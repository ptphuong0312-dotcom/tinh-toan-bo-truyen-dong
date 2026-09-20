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
        const dBore = opt.dBore || Math.max(10.0, Math.round((df / 2.0) * 0.45 * 2.0));
        const rBore = dBore / 2.0;
        const profileStep = opt.profileStep || (z > 30 ? 4 : 2);

        const isHelical = Math.abs(betaDeg) > 1e-4;
        const betaRad = (betaDeg * Math.PI) / 180.0;

        // 1. Generate base 2D transverse profile
        const rawContour = ToothProfileGenerator.generateProfile(z, mn, alfa_n, x, d, db, da, df, 0.38);

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

        // 3. Determine slice count along face width b (Z axis)
        let numSlices = opt.numSlices;
        if (!numSlices) {
            if (!isHelical) {
                numSlices = 1; // 2 layers (front & back) is mathematically exact for spur gears
            } else {
                // For helical gear, adapt slices to helix twist
                const twistTotalRad = Math.abs((b * Math.tan(betaRad)) / (d / 2.0));
                const slicesFromTwist = Math.ceil(twistTotalRad / (Math.PI / 45.0));
                numSlices = Math.max(6, Math.min(10, slicesFromTwist));
            }
        }

        const numLayers = numSlices + 1;
        const halfB = b / 2.0;

        // Twist rate per unit Z (rad/mm):
        // Along helix, dTheta / dZ = 2 * tan(beta) / d
        const twistRate = isHelical ? (hand * (2.0 * Math.tan(betaRad)) / d) : 0.0;

        // 4. Generate Vertex Grid
        // Each layer k has:
        // - N outer contour vertices: index [k * 2 * N + j]
        // - N inner bore vertices: index [k * 2 * N + N + j]
        const totalVertices = numLayers * 2 * N;
        const positions = new Float32Array(totalVertices * 3);

        let vIdx = 0;
        for (let k = 0; k < numLayers; k++) {
            const u = k / numSlices;
            const zCoord = -halfB + u * b;
            const theta = twistRate * zCoord;
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);

            // Outer contour vertices at layer k:
            for (let j = 0; j < N; j++) {
                const px = contour[j].x;
                const py = contour[j].y;
                const rotX = px * cosT - py * sinT;
                const rotY = px * sinT + py * cosT;

                positions[vIdx * 3] = rotX;
                positions[vIdx * 3 + 1] = rotY;
                positions[vIdx * 3 + 2] = zCoord;
                vIdx++;
            }

            // Inner bore vertices at layer k:
            for (let j = 0; j < N; j++) {
                const bAng = boreAngles[j] + theta;
                const bx = rBore * Math.cos(bAng);
                const by = rBore * Math.sin(bAng);

                positions[vIdx * 3] = bx;
                positions[vIdx * 3 + 1] = by;
                positions[vIdx * 3 + 2] = zCoord;
                vIdx++;
            }
        }

        // Helpers to get vertex indices
        const getOuterIdx = (layer, j) => layer * 2 * N + j;
        const getBoreIdx = (layer, j) => layer * 2 * N + N + j;

        // 5. Construct Triangles
        const indices = [];

        // 5.1 Lateral outer tooth surfaces (between consecutive layers k and k+1)
        for (let k = 0; k < numSlices; k++) {
            for (let j = 0; j < N; j++) {
                const jNext = (j + 1) % N;
                const v00 = getOuterIdx(k, j);
                const v01 = getOuterIdx(k, jNext);
                const v10 = getOuterIdx(k + 1, j);
                const v11 = getOuterIdx(k + 1, jNext);

                // CCW winding for outward normals:
                indices.push(v00, v01, v11);
                indices.push(v00, v11, v10);
            }
        }

        // 5.2 Front annular end cap at Z = +halfB (layer = numSlices)
        const frontLayer = numSlices;
        for (let j = 0; j < N; j++) {
            const jNext = (j + 1) % N;
            const o0 = getOuterIdx(frontLayer, j);
            const o1 = getOuterIdx(frontLayer, jNext);
            const b0 = getBoreIdx(frontLayer, j);
            const b1 = getBoreIdx(frontLayer, jNext);

            // Normal pointing +Z:
            indices.push(o0, o1, b1);
            indices.push(o0, b1, b0);
        }

        // 5.3 Back annular end cap at Z = -halfB (layer = 0)
        for (let j = 0; j < N; j++) {
            const jNext = (j + 1) % N;
            const o0 = getOuterIdx(0, j);
            const o1 = getOuterIdx(0, jNext);
            const b0 = getBoreIdx(0, j);
            const b1 = getBoreIdx(0, jNext);

            // Normal pointing -Z (reversed winding):
            indices.push(o1, o0, b1);
            indices.push(b1, o0, b0);
        }

        // 5.4 Internal bore cylinder
        for (let k = 0; k < numSlices; k++) {
            for (let j = 0; j < N; j++) {
                const jNext = (j + 1) % N;
                const b00 = getBoreIdx(k, j);
                const b01 = getBoreIdx(k, jNext);
                const b10 = getBoreIdx(k + 1, j);
                const b11 = getBoreIdx(k + 1, jNext);

                // Normal pointing inwards towards origin:
                indices.push(b00, b11, b01);
                indices.push(b00, b10, b11);
            }
        }

        // 6. Compute vertex normals and raw triangles
        const triIndices = new Uint32Array(indices);
        const normals = new Float32Array(totalVertices * 3);
        const rawTriangles = [];

        const numTriangles = triIndices.length / 3;
        for (let t = 0; t < numTriangles; t++) {
            const i0 = triIndices[t * 3];
            const i1 = triIndices[t * 3 + 1];
            const i2 = triIndices[t * 3 + 2];

            const ax = positions[i0 * 3], ay = positions[i0 * 3 + 1], az = positions[i0 * 3 + 2];
            const bx = positions[i1 * 3], by = positions[i1 * 3 + 1], bz = positions[i1 * 3 + 2];
            const cx = positions[i2 * 3], cy = positions[i2 * 3 + 1], cz = positions[i2 * 3 + 2];

            // Edge vectors:
            const abx = bx - ax, aby = by - ay, abz = bz - az;
            const acx = cx - ax, acy = cy - ay, acz = cz - az;

            // Cross product:
            let nx = aby * acz - abz * acy;
            let ny = abz * acx - abx * acz;
            let nz = abx * acy - aby * acx;
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (len > 1e-12) {
                nx /= len;
                ny /= len;
                nz /= len;
            }

            // Accumulate vertex normals:
            normals[i0 * 3] += nx; normals[i0 * 3 + 1] += ny; normals[i0 * 3 + 2] += nz;
            normals[i1 * 3] += nx; normals[i1 * 3 + 1] += ny; normals[i1 * 3 + 2] += nz;
            normals[i2 * 3] += nx; normals[i2 * 3 + 1] += ny; normals[i2 * 3 + 2] += nz;

            // Save raw triangle data for direct CAD export:
            rawTriangles.push([
                [ax, ay, az],
                [bx, by, bz],
                [cx, cy, cz],
                [nx, ny, nz]
            ]);
        }

        // Normalize vertex normals
        for (let v = 0; v < totalVertices; v++) {
            const idx = v * 3;
            let nx = normals[idx];
            let ny = normals[idx + 1];
            let nz = normals[idx + 2];
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            if (len > 1e-12) {
                normals[idx] = nx / len;
                normals[idx + 1] = ny / len;
                normals[idx + 2] = nz / len;
            }
        }

        return {
            positions,
            normals,
            indices: triIndices,
            rawTriangles,
            triangleCount: numTriangles,
            vertexCount: totalVertices,
            radiusTip: da / 2.0,
            radiusRoot: df / 2.0,
            radiusBore: rBore,
            faceWidth: b,
            dBore
        };
    }
};
