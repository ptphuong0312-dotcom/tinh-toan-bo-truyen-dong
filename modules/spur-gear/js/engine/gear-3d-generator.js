/**
 * MITCalc Web App - 3D Spur & Helical Gear Solid Mesh Generator
 * Generates 100% watertight, closed manifold 3D solid meshes for both Spur Gears (beta = 0)
 * and Helical Gears (beta != 0) with conjugate spatial twisting, true involute flanks,
 * circular root fillets (R = 0.38*mn), root land arcs, bore cylinders, and planar/twisted annular end caps.
 * Compatible with Three.js WebGL rendering, Binary STL, and STEP AP214 CAD formats.
 */

import { ToothProfileGenerator } from './tooth-profile-generator.js';
import { MathUtils } from './math-utils.js';

export const Gear3DGenerator = {
    /**
     * Generates a complete 3D solid mesh for a cylindrical gear
     * @param {Object} opt
     * @param {number} opt.z - Number of teeth
     * @param {number} opt.mn - Normal module (mm)
     * @param {number} opt.alfa_n - Normal pressure angle (deg)
     * @param {number} opt.beta - Helix angle (deg)
     * @param {number} opt.b - Face width (mm)
     * @param {number} opt.x - Profile shift coefficient
     * @param {number} opt.d - Reference pitch diameter (mm)
     * @param {number} opt.db - Base diameter (mm)
     * @param {number} opt.da - Tip diameter (mm)
     * @param {number} opt.df - Root diameter (mm)
     * @param {number} [opt.hand=1] - Helix handedness: +1 for Right-Hand (RH), -1 for Left-Hand (LH)
     * @param {number} [opt.dBore] - Internal bore diameter (mm)
     * @param {number} [opt.numSlices] - Discretization slices along face width Z
     * @param {number} [opt.profileStep=1] - Point step along 2D profile (1 = full detail)
     * @returns {Object} Mesh data: { vertices, normals, indices, rawTriangles, bbox }
     */
    generateGearMesh(opt) {
        const z = opt.z;
        const mn = opt.mn;
        const alfa_n = opt.alfa_n || 20.0;
        const betaDeg = opt.beta || 0.0;
        const b = opt.b || 50.0;
        const x = opt.x || 0.0;
        const d = opt.d;
        const db = opt.db;
        const da = opt.da;
        const df = opt.df;
        const hand = opt.hand !== undefined ? opt.hand : 1;
        const dBore = opt.dBore || Math.max(10.0, df * 0.45);
        const rBore = dBore / 2.0;
        const isSurfaceOnly = !!opt.surfaceOnly;
        const profileStep = opt.profileStep || 1;

        const isHelical = Math.abs(betaDeg) > 1e-4;
        const betaRad = (betaDeg * Math.PI) / 180.0;

        // 1. Generate base 2D transverse profile using exact MITCalc rack cutter envelope
        // Note: For isSurfaceOnly, noPtEv=120 & cuttStep=0.25 ensures triangle width (~0.11mm) >= 1 screen pixel,
        // preventing sub-pixel 2x2 quad depth derivative overshoot in 4x MSAA rasterization.
        const optContour = isSurfaceOnly ? Object.assign({}, opt, {
            noPtHead: 20,
            noPtEv: 120,
            cuttStep: 0.25
        }) : Object.assign({}, opt, {
            noPtHead: opt.noPtHead || 20,
            noPtEv: opt.noPtEv || 100,
            cuttStep: opt.cuttStep || 0.5
        });
        const rawContour = ToothProfileGenerator.generateProfile(z, mn, alfa_n, x, d, db, da, df, opt.ra0 || 0.38, optContour);

        // Downsample contour if step > 1 for high-performance watertight 3D CAD mesh
        let contour = [];
        if (profileStep > 1) {
            for (let i = 0; i < rawContour.length; i += profileStep) {
                contour.push(rawContour[i]);
            }
        } else {
            contour = rawContour;
        }
        const N = contour.length;

        // 2. Precompute polar angles of contour points for aligned inner bore circle
        const boreAngles = new Float64Array(N);
        for (let j = 0; j < N; j++) {
            boreAngles[j] = Math.atan2(contour[j].y, contour[j].x);
        }

        // 3. Determine slice count along face width b (Z axis), scaling with profile resolution
        const contactMode = opt.contactMode || 'theory';
        const resFactor = Math.max(0.5, (optContour.noPtEv || 100) / 100.0); // 0.5 at L1, 1.0 at L6, 2.6 at L11
        const buildRawTriangles = !!opt.buildRawTriangles;

        let numSlices = opt.numSlices;
        if (!numSlices) {
            if (isSurfaceOnly && !isHelical && contactMode !== 'crowning') {
                numSlices = 20;
            } else if (contactMode === 'crowning') {
                numSlices = Math.max(16, Math.min(32, Math.round(8 * resFactor) * 2));
            } else if (!isHelical) {
                numSlices = Math.max(2, Math.min(12, Math.round(2 * resFactor) * 2));
            } else {
                // For helical gear, adapt slices to both helix twist and user resolution level
                const twistTotalRad = Math.abs((b * Math.tan(betaRad)) / (d / 2.0));
                const slicesFromTwist = Math.ceil((twistTotalRad / (Math.PI / 36.0)) * resFactor);
                const baseHelicalSlices = Math.round(8 * resFactor) * 2;
                numSlices = Math.max(16, Math.min(40, Math.ceil(Math.max(baseHelicalSlices, slicesFromTwist) / 2) * 2));
            }
        }

        const numLayers = numSlices + 1;
        const halfB = b / 2.0;

        // Twist rate per unit Z (rad/mm):
        // Along helix, dTheta / dZ = 2 * tan(beta) / d
        const twistRate = isHelical ? (hand * (2.0 * Math.tan(betaRad)) / d) : 0.0;

        // 4. Generate Vertex Grid with Dedicated Vertex Blocks
        // To guarantee 100% FLAT, OPTICALLY PLANAR end caps with sharp mechanical 90-degree edges (zero nhấp nhô):
        // Group 1: Lateral tooth outer surface (numLayers * N vertices)
        // Group 2: Front end cap at Z = +halfB (2 * N vertices: N outer + N bore, normal strictly [0, 0, 1])
        // Group 3: Back end cap at Z = -halfB (2 * N vertices: N outer + N bore, normal strictly [0, 0, -1])
        // Group 4: Inner bore cylinder surface (numLayers * N vertices, normal pointing radially inwards)
        const lateralVCount = numLayers * N;
        const capVCount = isSurfaceOnly ? 0 : (2 * N);
        const boreVCount = isSurfaceOnly ? 0 : (numLayers * N);
        const totalVertices = lateralVCount + capVCount + capVCount + boreVCount;

        const totalTriangles = isSurfaceOnly
            ? (numSlices * N * 2)
            : (numSlices * N * 2 + N * 2 + N * 2 + numSlices * N * 2);

        const positions = new Float32Array(totalVertices * 3);
        const normals = new Float32Array(totalVertices * 3);
        const tcaParams = new Float32Array(totalVertices * 3);
        const triIndices = new Uint32Array(totalTriangles * 3);
        let idxPtr = 0;
        const rawTriangles = [];

        // Helper to compute slice rotation and Z
        const getLayerGeom = (k) => {
            const u = k / numSlices;
            const zCoord = -halfB + u * b;
            const theta = twistRate * zCoord;
            return { zCoord, cosT: Math.cos(theta), sinT: Math.sin(theta), theta };
        };

        const computeFaceNormal = (ax, ay, az, bx, by, bz, cx, cy, cz) => {
            const abx = bx - ax, aby = by - ay, abz = bz - az;
            const acx = cx - ax, acy = cy - ay, acz = cz - az;
            let nx = aby * acz - abz * acy;
            let ny = abz * acx - abx * acz;
            let nz = abx * acy - aby * acx;
            const len = Math.hypot(nx, ny, nz);
            if (len > 1e-12) {
                nx /= len; ny /= len; nz /= len;
            }
            return [nx, ny, nz];
        };

        const accumulateNormal = (vIdx, n) => {
            normals[vIdx * 3] += n[0];
            normals[vIdx * 3 + 1] += n[1];
            normals[vIdx * 3 + 2] += n[2];
        };

        // --- GROUP 1: Lateral Tooth Outer Surface ---
        const lateralBase = 0;
        let vIdx = lateralBase;
        const isPinion = (opt.isPinion !== undefined) ? (opt.isPinion === true) : (opt.hand === +1);
        const rSpan = Math.max(0.01, (da - df) / 2.0);

        for (let k = 0; k < numLayers; k++) {
            const { zCoord, theta } = getLayerGeom(k);
            const uNorm = halfB > 1e-6 ? (zCoord / halfB) : 0.0; // -1.0 to +1.0

            let dThetaKiss = 0.0;
            if (isSurfaceOnly && isPinion) {
                if (contactMode === 'crowning') {
                    // Phương án 2: Độ vồng Parabol vi mô dọc trục Z (đường kẻ tiếp xúc elip mảnh ở 75% giữa răng)
                    const K_crown = Math.max(0.0, 1.0 - 1.50 * uNorm * uNorm);
                    const allowance = (0.0016 * mn) * K_crown - (0.0008 * mn) * (1.0 - K_crown);
                    dThetaKiss = allowance / Math.max(1.0, d / 2.0);
                } else {
                    // Phương án 1 (MẶC ĐỊNH): Chuẩn Lý Thuyết - Tiếp xúc 1 đường kẻ mảnh liền mạch chạy dọc theo răng (0.0014 * mn ~ 8.4 um)
                    const allowance = 0.0014 * mn;
                    dThetaKiss = allowance / Math.max(1.0, d / 2.0);
                }
            }

            for (let j = 0; j < N; j++) {
                const pt = contour[j];
                const side = pt.side || 0.0;
                // Sign correction: rotation CCW by totalTheta subtracts kissAngle from polar angle
                // Therefore, kissAngle = -side * dThetaKiss expands the tooth outwards on BOTH flanks (+side for right, -side for left)
                const kissAngle = -side * dThetaKiss;
                const totalTheta = theta + kissAngle;
                const cosT = Math.cos(totalTheta);
                const sinT = Math.sin(totalTheta);

                positions[vIdx * 3] = pt.x * cosT - pt.y * sinT;
                positions[vIdx * 3 + 1] = pt.x * sinT + pt.y * cosT;
                positions[vIdx * 3 + 2] = zCoord;

                const fT = Math.max(0.0, Math.min(1.0, (pt.r - df / 2.0) / rSpan));
                const fId = (side === 1.0) ? 1.0 : ((side === -1.0) ? 2.0 : 0.0);

                tcaParams[vIdx * 3] = uNorm * 0.5; // u: -0.5 to +0.5
                tcaParams[vIdx * 3 + 1] = fT;       // flankT: 0.0 at root, 1.0 at tip
                tcaParams[vIdx * 3 + 2] = fId;      // flankId: 1.0 drive, 2.0 coast, 0.0 land

                vIdx++;
            }
        }

        // Lateral Triangles & Outward-Pointing Normals (contour[j] progresses Clockwise in XY plane)
        for (let k = 0; k < numSlices; k++) {
            for (let j = 0; j < N; j++) {
                const jNext = (j + 1) % N;
                const v00 = lateralBase + k * N + j;
                const v01 = lateralBase + k * N + jNext;
                const v10 = lateralBase + (k + 1) * N + j;
                const v11 = lateralBase + (k + 1) * N + jNext;

                // CCW winding when viewed from outside the gear (normal points radially outwards)
                triIndices[idxPtr++] = v00;
                triIndices[idxPtr++] = v11;
                triIndices[idxPtr++] = v01;
                triIndices[idxPtr++] = v00;
                triIndices[idxPtr++] = v10;
                triIndices[idxPtr++] = v11;

                const ax = positions[v00 * 3], ay = positions[v00 * 3 + 1], az = positions[v00 * 3 + 2];
                const bx = positions[v01 * 3], by = positions[v01 * 3 + 1], bz = positions[v01 * 3 + 2];
                const cx = positions[v11 * 3], cy = positions[v11 * 3 + 1], cz = positions[v11 * 3 + 2];
                const dx = positions[v10 * 3], dy = positions[v10 * 3 + 1], dz = positions[v10 * 3 + 2];

                const n1 = computeFaceNormal(ax, ay, az, cx, cy, cz, bx, by, bz);
                accumulateNormal(v00, n1);
                accumulateNormal(v11, n1);
                accumulateNormal(v01, n1);

                const n2 = computeFaceNormal(ax, ay, az, dx, dy, dz, cx, cy, cz);
                accumulateNormal(v00, n2);
                accumulateNormal(v10, n2);
                accumulateNormal(v11, n2);

                if (buildRawTriangles) {
                    rawTriangles.push([[ax, ay, az], [cx, cy, cz], [bx, by, bz], n1]);
                    rawTriangles.push([[ax, ay, az], [dx, dy, dz], [cx, cy, cz], n2]);
                }
            }
        }

        // Normalize lateral normals
        for (let v = 0; v < lateralVCount; v++) {
            const idx = v * 3;
            const len = Math.hypot(normals[idx], normals[idx + 1], normals[idx + 2]);
            if (len > 1e-12) {
                normals[idx] /= len;
                normals[idx + 1] /= len;
                normals[idx + 2] /= len;
            }
        }

        if (!isSurfaceOnly) {
            // --- GROUP 2: Front End Cap at Z = +halfB ---
            const frontBase = lateralVCount;
            vIdx = frontBase;
            const frontGeom = getLayerGeom(numSlices); // layer at Z = +halfB
            // N outer contour points at Z = +halfB
            for (let j = 0; j < N; j++) {
                const px = contour[j].x;
                const py = contour[j].y;
                positions[vIdx * 3] = px * frontGeom.cosT - py * frontGeom.sinT;
                positions[vIdx * 3 + 1] = px * frontGeom.sinT + py * frontGeom.cosT;
                positions[vIdx * 3 + 2] = halfB;
                normals[vIdx * 3] = 0.0;
                normals[vIdx * 3 + 1] = 0.0;
                normals[vIdx * 3 + 2] = 1.0; // Strictly +Z normal for 100% flat planar reflection
                vIdx++;
            }
            // N inner bore points at Z = +halfB
            for (let j = 0; j < N; j++) {
                const bAng = boreAngles[j] + frontGeom.theta;
                positions[vIdx * 3] = rBore * Math.cos(bAng);
                positions[vIdx * 3 + 1] = rBore * Math.sin(bAng);
                positions[vIdx * 3 + 2] = halfB;
                normals[vIdx * 3] = 0.0;
                normals[vIdx * 3 + 1] = 0.0;
                normals[vIdx * 3 + 2] = 1.0; // Strictly +Z normal for 100% flat planar reflection
                vIdx++;
            }

            // Front Cap Triangles (CCW when viewed from +Z, since contour[j] is Clockwise)
            const frontNormal = [0.0, 0.0, 1.0];
            for (let j = 0; j < N; j++) {
                const jNext = (j + 1) % N;
                const o0 = frontBase + j;
                const o1 = frontBase + jNext;
                const b0 = frontBase + N + j;
                const b1 = frontBase + N + jNext;

                triIndices[idxPtr++] = o0;
                triIndices[idxPtr++] = b1;
                triIndices[idxPtr++] = o1;
                triIndices[idxPtr++] = o0;
                triIndices[idxPtr++] = b0;
                triIndices[idxPtr++] = b1;

                if (buildRawTriangles) {
                    rawTriangles.push([
                        [positions[o0 * 3], positions[o0 * 3 + 1], halfB],
                        [positions[b1 * 3], positions[b1 * 3 + 1], halfB],
                        [positions[o1 * 3], positions[o1 * 3 + 1], halfB],
                        frontNormal
                    ]);
                    rawTriangles.push([
                        [positions[o0 * 3], positions[o0 * 3 + 1], halfB],
                        [positions[b0 * 3], positions[b0 * 3 + 1], halfB],
                        [positions[b1 * 3], positions[b1 * 3 + 1], halfB],
                        frontNormal
                    ]);
                }
            }

            // --- GROUP 3: Back End Cap at Z = -halfB ---
            const backBase = frontBase + capVCount;
            vIdx = backBase;
            const backGeom = getLayerGeom(0); // layer at Z = -halfB
            // N outer contour points at Z = -halfB
            for (let j = 0; j < N; j++) {
                const px = contour[j].x;
                const py = contour[j].y;
                positions[vIdx * 3] = px * backGeom.cosT - py * backGeom.sinT;
                positions[vIdx * 3 + 1] = px * backGeom.sinT + py * backGeom.cosT;
                positions[vIdx * 3 + 2] = -halfB;
                normals[vIdx * 3] = 0.0;
                normals[vIdx * 3 + 1] = 0.0;
                normals[vIdx * 3 + 2] = -1.0; // Strictly -Z normal for 100% flat planar reflection
                vIdx++;
            }
            // N inner bore points at Z = -halfB
            for (let j = 0; j < N; j++) {
                const bAng = boreAngles[j] + backGeom.theta;
                positions[vIdx * 3] = rBore * Math.cos(bAng);
                positions[vIdx * 3 + 1] = rBore * Math.sin(bAng);
                positions[vIdx * 3 + 2] = -halfB;
                normals[vIdx * 3] = 0.0;
                normals[vIdx * 3 + 1] = 0.0;
                normals[vIdx * 3 + 2] = -1.0; // Strictly -Z normal for 100% flat planar reflection
                vIdx++;
            }

            // Back Cap Triangles (CCW when viewed from -Z, since contour[j] is Clockwise from +Z)
            const backNormal = [0.0, 0.0, -1.0];
            for (let j = 0; j < N; j++) {
                const jNext = (j + 1) % N;
                const o0 = backBase + j;
                const o1 = backBase + jNext;
                const b0 = backBase + N + j;
                const b1 = backBase + N + jNext;

                triIndices[idxPtr++] = o0;
                triIndices[idxPtr++] = o1;
                triIndices[idxPtr++] = b1;
                triIndices[idxPtr++] = o0;
                triIndices[idxPtr++] = b1;
                triIndices[idxPtr++] = b0;

                if (buildRawTriangles) {
                    rawTriangles.push([
                        [positions[o0 * 3], positions[o0 * 3 + 1], -halfB],
                        [positions[o1 * 3], positions[o1 * 3 + 1], -halfB],
                        [positions[b1 * 3], positions[b1 * 3 + 1], -halfB],
                        backNormal
                    ]);
                    rawTriangles.push([
                        [positions[o0 * 3], positions[o0 * 3 + 1], -halfB],
                        [positions[b1 * 3], positions[b1 * 3 + 1], -halfB],
                        [positions[b0 * 3], positions[b0 * 3 + 1], -halfB],
                        backNormal
                    ]);
                }
            }

            // --- GROUP 4: Inner Bore Cylinder Surface ---
            const boreBase = backBase + capVCount;
            vIdx = boreBase;
            for (let k = 0; k < numLayers; k++) {
                const { zCoord, theta } = getLayerGeom(k);
                for (let j = 0; j < N; j++) {
                    const bAng = boreAngles[j] + theta;
                    const cosA = Math.cos(bAng);
                    const sinA = Math.sin(bAng);
                    positions[vIdx * 3] = rBore * cosA;
                    positions[vIdx * 3 + 1] = rBore * sinA;
                    positions[vIdx * 3 + 2] = zCoord;
                    // Normal points radially inwards towards the gear shaft axis:
                    normals[vIdx * 3] = -cosA;
                    normals[vIdx * 3 + 1] = -sinA;
                    normals[vIdx * 3 + 2] = 0.0;
                    vIdx++;
                }
            }

            // Bore Triangles (Facing inwards towards shaft axis)
            for (let k = 0; k < numSlices; k++) {
                for (let j = 0; j < N; j++) {
                    const jNext = (j + 1) % N;
                    const b00 = boreBase + k * N + j;
                    const b01 = boreBase + k * N + jNext;
                    const b10 = boreBase + (k + 1) * N + j;
                    const b11 = boreBase + (k + 1) * N + jNext;

                    triIndices[idxPtr++] = b00;
                    triIndices[idxPtr++] = b01;
                    triIndices[idxPtr++] = b11;
                    triIndices[idxPtr++] = b00;
                    triIndices[idxPtr++] = b11;
                    triIndices[idxPtr++] = b10;

                    if (buildRawTriangles) {
                        const ax = positions[b00 * 3], ay = positions[b00 * 3 + 1], az = positions[b00 * 3 + 2];
                        const bx = positions[b01 * 3], by = positions[b01 * 3 + 1], bz = positions[b01 * 3 + 2];
                        const cx = positions[b11 * 3], cy = positions[b11 * 3 + 1], cz = positions[b11 * 3 + 2];
                        const dx = positions[b10 * 3], dy = positions[b10 * 3 + 1], dz = positions[b10 * 3 + 2];

                        const n1 = computeFaceNormal(ax, ay, az, bx, by, bz, cx, cy, cz);
                        const n2 = computeFaceNormal(ax, ay, az, cx, cy, cz, dx, dy, dz);
                        rawTriangles.push([[ax, ay, az], [bx, by, bz], [cx, cy, cz], n1]);
                        rawTriangles.push([[ax, ay, az], [cx, cy, cz], [dx, dy, dz], n2]);
                    }
                }
            }
        }

        return {
            positions,
            normals,
            indices: triIndices,
            tcaParams,
            rawTriangles,
            triangleCount: totalTriangles,
            vertexCount: totalVertices,
            radiusTip: da / 2.0,
            radiusRoot: df / 2.0,
            radiusBore: rBore,
            faceWidth: b,
            dBore,
            isSurfaceOnly
        };
    },

    /**
     * Extracts rawTriangles array on demand from a generated meshData object (for STEP/STL/OBJ CAD export)
     */
    extractRawTriangles: function(meshData) {
        if (!meshData) return [];
        if (meshData.rawTriangles && meshData.rawTriangles.length > 0) return meshData.rawTriangles;
        const pos = meshData.positions;
        const ind = meshData.indices;
        const numTris = Math.floor(ind.length / 3);
        const tris = new Array(numTris);
        for (let i = 0; i < numTris; i++) {
            const i0 = ind[i * 3] * 3;
            const i1 = ind[i * 3 + 1] * 3;
            const i2 = ind[i * 3 + 2] * 3;
            const ax = pos[i0], ay = pos[i0 + 1], az = pos[i0 + 2];
            const bx = pos[i1], by = pos[i1 + 1], bz = pos[i1 + 2];
            const cx = pos[i2], cy = pos[i2 + 1], cz = pos[i2 + 2];
            const abx = bx - ax, aby = by - ay, abz = bz - az;
            const acx = cx - ax, acy = cy - ay, acz = cz - az;
            let nx = aby * acz - abz * acy;
            let ny = abz * acx - abx * acz;
            let nz = abx * acy - aby * acx;
            const len = Math.hypot(nx, ny, nz);
            if (len > 1e-12) { nx /= len; ny /= len; nz /= len; }
            tris[i] = [[ax, ay, az], [bx, by, bz], [cx, cy, cz], [nx, ny, nz]];
        }
        meshData.rawTriangles = tris;
        return tris;
    },

    /**
     * Generate 3D Surface Mesh (Hollow flank shell only, no caps, no bore)
     * For 5-axis surface finishing in Mastercam / SolidWorks Surface modeling / Wire EDM
     */
    generateGearSurfaceMesh: function(opt) {
        return this.generateGearMesh(Object.assign({}, opt, { surfaceOnly: true }));
    }
};
