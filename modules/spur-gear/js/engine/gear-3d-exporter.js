/**
 * MITCalc Web App - 3D CAD Exporter for SolidWorks & Mastercam
 * Generates industry-standard 3D CAD files:
 * 1. Binary STL (.stl) - High-precision, compact binary mesh ready for Mastercam Toolpaths
 *    (Dynamic OptiRough, Surface Finish Scallop/Blend, Wire EDM) & SolidWorks Solid Mesh Body.
 * 2. ISO 10303-21 STEP AP214 (.step / .stp) - Standard CAD Solid B-Rep format recognized by SolidWorks
 *    as a native Solid Body and Mastercam as a Machinable Solid.
 * 3. Wavefront OBJ (.obj) - Universal 3D geometry interchange format.
 */

export const Gear3DExporter = {
    /**
     * Helper to trigger browser file download via Blob URL
     * @param {Blob} blob - Data blob
     * @param {string} filename - Filename with extension
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 300);
    },

    /**
     * Flattens triangles from single gear or assembly
     * @param {Array|Object} input - rawTriangles array or array of triangle arrays
     * @returns {Array} Array of [[p1], [p2], [p3], [n]]
     */
    normalizeTriangles(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            // Check if it's already an array of triangles: triangle is [[x,y,z], [x,y,z], [x,y,z], [nx,ny,nz]]
            if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 4) {
                return input;
            }
            // If it's an array of part triangles:
            let combined = [];
            for (const part of input) {
                if (Array.isArray(part)) {
                    combined = combined.concat(part);
                } else if (part && part.rawTriangles) {
                    combined = combined.concat(part.rawTriangles);
                }
            }
            return combined;
        } else if (input.rawTriangles) {
            return input.rawTriangles;
        }
        return [];
    },

    /**
     * Exports Binary STL file (Compatible with Mastercam 3D Milling & SolidWorks)
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "SpurGear_Pinion.stl"
     * @param {boolean} [autoDownload=true] - Trigger browser download
     */
    exportBinarySTL(input, filename = 'gear_model.stl', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const numTriangles = triangles.length;

        // Binary STL format:
        // 80 bytes: ASCII header
        // 4 bytes: uint32 number of triangles
        // numTriangles * 50 bytes:
        //   12 bytes: normal (3 * float32)
        //   12 bytes: vertex 1 (3 * float32)
        //   12 bytes: vertex 2 (3 * float32)
        //   12 bytes: vertex 3 (3 * float32)
        //   2 bytes: attribute byte count (uint16 = 0)
        const totalBytes = 84 + numTriangles * 50;
        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);

        // Write 80-byte header
        const headerStr = 'MITCalc 3D Gear Model - SolidWorks & Mastercam Compatible CAD/CAM';
        for (let i = 0; i < 80; i++) {
            view.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 32);
        }

        // Write triangle count (little endian)
        view.setUint32(80, numTriangles, true);

        // Write triangles
        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
            const tri = triangles[i];
            const p1 = tri[0];
            const p2 = tri[1];
            const p3 = tri[2];
            const n = tri[3];

            // Normal
            view.setFloat32(offset, n[0], true);
            view.setFloat32(offset + 4, n[1], true);
            view.setFloat32(offset + 8, n[2], true);

            // Vertex 1
            view.setFloat32(offset + 12, p1[0], true);
            view.setFloat32(offset + 16, p1[1], true);
            view.setFloat32(offset + 20, p1[2], true);

            // Vertex 2
            view.setFloat32(offset + 24, p2[0], true);
            view.setFloat32(offset + 28, p2[1], true);
            view.setFloat32(offset + 32, p2[2], true);

            // Vertex 3
            view.setFloat32(offset + 36, p3[0], true);
            view.setFloat32(offset + 40, p3[1], true);
            view.setFloat32(offset + 44, p3[2], true);

            // Attribute byte count = 0
            view.setUint16(offset + 48, 0, true);

            offset += 50;
        }

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { buffer, blob, numTriangles, totalBytes };
    },

    /**
     * Exports ASCII STL file
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "gear.stl"
     * @param {string} solidName - Solid name in STL
     */
    exportAsciiSTL(input, filename = 'gear_model.stl', solidName = 'MITCALC_GEAR') {
        const triangles = this.normalizeTriangles(input);
        const lines = [`solid ${solidName}`];

        for (let i = 0; i < triangles.length; i++) {
            const [p1, p2, p3, n] = triangles[i];
            lines.push(`  facet normal ${n[0].toExponential(6)} ${n[1].toExponential(6)} ${n[2].toExponential(6)}`);
            lines.push('    outer loop');
            lines.push(`      vertex ${p1[0].toFixed(4)} ${p1[1].toFixed(4)} ${p1[2].toFixed(4)}`);
            lines.push(`      vertex ${p2[0].toFixed(4)} ${p2[1].toFixed(4)} ${p2[2].toFixed(4)}`);
            lines.push(`      vertex ${p3[0].toFixed(4)} ${p3[1].toFixed(4)} ${p3[2].toFixed(4)}`);
            lines.push('    endloop');
            lines.push('  endfacet');
        }

        lines.push(`endsolid ${solidName}`);
        const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
        this.downloadBlob(blob, filename);
    },

    /**
     * Normalizes input into an array of part triangle arrays: [part1Tris, part2Tris, ...]
     * Ensures multi-body assemblies (Pinion + Gear) are exported as separate B-Rep solids/shells
     */
    normalizePartTriangleArrays(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            if (input.length === 0) return [];
            if (Array.isArray(input[0]) && input[0].length === 4 && Array.isArray(input[0][0]) && typeof input[0][0][0] === 'number') {
                return [input];
            }
            const parts = [];
            for (const part of input) {
                if (Array.isArray(part) && part.length > 0) {
                    parts.push(part);
                } else if (part && Array.isArray(part.rawTriangles) && part.rawTriangles.length > 0) {
                    parts.push(part.rawTriangles);
                }
            }
            return parts;
        } else if (input.rawTriangles && input.rawTriangles.length > 0) {
            return [input.rawTriangles];
        }
        return [];
    },

    /**
     * Exports standard ISO 10303-21 STEP AP214 file (.step)
     * Uses full B-Rep topology (VERTEX_POINT, EDGE_CURVE, ORIENTED_EDGE, EDGE_LOOP, PLANE with
     * orthogonal AXIS2_PLACEMENT_3D, and ADVANCED_FACE) required by SolidWorks & Mastercam.
     * Solid: MANIFOLD_SOLID_BREP + ADVANCED_BREP_SHAPE_REPRESENTATION.
     * Surface: OPEN_SHELL + SHELL_BASED_SURFACE_MODEL + MANIFOLD_SURFACE_SHAPE_REPRESENTATION.
     * @param {Array|Object} input - Triangle data or [pinionTris, gearTris]
     * @param {string} filename - e.g. "SpurGear.step"
     * @param {string} partName - Part name
     * @param {boolean} [autoDownload=true] - Trigger browser download
     * @param {boolean} [isSurface=false] - If true, exports OPEN_SHELL with SHELL_BASED_SURFACE_MODEL
     */
    exportSTEP(input, filename = 'gear_model.step', partName = 'GEAR_SOLID_PART', autoDownload = true, isSurface = false) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const now = new Date().toISOString().replace(/\.\d+Z$/, '');

        const lines = [];
        lines.push('ISO-10303-21;');
        lines.push('HEADER;');
        const fileDesc = isSurface
            ? 'MITCalc 3D Gear Hollow Flank Surface Model for SolidWorks and Mastercam Surface Toolpaths'
            : 'MITCalc 3D Gear Solid Model for SolidWorks and Mastercam';
        lines.push(`FILE_DESCRIPTION(('${fileDesc}'),'2;1');`);
        lines.push(`FILE_NAME('${filename}','${now}',('SirPhuong'),('MITCalc-Gear-Engineering'),'Antigravity CAD/CAM Engine','SolidWorks / Mastercam Compatible','');`);
        lines.push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
        lines.push('ENDSEC;');
        lines.push('DATA;');

        let id = 1;

        // Context & Units (ISO 10303-214)
        lines.push(`#${id++}=APPLICATION_CONTEXT('automotive design');`); // #1
        lines.push(`#${id++}=APPLICATION_PROTOCOL_DEFINITION('international standard','automotive_design',2000,#1);`); // #2
        lines.push(`#${id++}=PRODUCT_CONTEXT('',#1,'mechanical');`); // #3
        lines.push(`#${id++}=PRODUCT('${partName}','${partName}','',(#3));`); // #4
        lines.push(`#${id++}=PRODUCT_DEFINITION_FORMATION('','',#4);`); // #5
        lines.push(`#${id++}=PRODUCT_DEFINITION_CONTEXT('part definition',#1,'design');`); // #6
        lines.push(`#${id++}=PRODUCT_DEFINITION('design','',#5,#6);`); // #7
        lines.push(`#${id++}=PRODUCT_DEFINITION_SHAPE('','',#7);`); // #8

        // SI Units: Millimetre (0.001 m)
        lines.push(`#${id++}=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT(.MILLI.,.METRE.));`); // #9
        lines.push(`#${id++}=(NAMED_UNIT(*)PLANE_ANGLE_UNIT()SI_UNIT($,.RADIAN.));`); // #10
        lines.push(`#${id++}=(NAMED_UNIT(*)SOLID_ANGLE_UNIT()SI_UNIT($,.STERADIAN.));`); // #11
        lines.push(`#${id++}=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.0E-04),#9,'distance_accuracy_value','confusion accuracy');`); // #12
        lines.push(`#${id++}=(GEOMETRIC_REPRESENTATION_CONTEXT(3)GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#12))GLOBAL_UNIT_ASSIGNED_CONTEXT((#9,#10,#11))REPRESENTATION_CONTEXT('Context3D','3D Context'));`); // #13

        const prodDefShapeId = 8;
        const repContextId = 13;

        // Global origin placement
        const origPtId = id++;
        const origDirZId = id++;
        const origDirXId = id++;
        const origAxisId = id++;
        lines.push(`#${origPtId}=CARTESIAN_POINT('',(0.0,0.0,0.0));`);
        lines.push(`#${origDirZId}=DIRECTION('',(0.0,0.0,1.0));`);
        lines.push(`#${origDirXId}=DIRECTION('',(1.0,0.0,0.0));`);
        lines.push(`#${origAxisId}=AXIS2_PLACEMENT_3D('',#${origPtId},#${origDirZId},#${origDirXId});`);

        const fStr = (v) => {
            const val = Math.abs(v) < 1e-12 ? 0.0 : v;
            const s = val.toFixed(6);
            return s.indexOf('.') === -1 ? s + '.0' : s;
        };

        let totalTriangles = 0;
        let totalFaces = 0;
        const bodyItemIds = [];

        for (let pIdx = 0; pIdx < partArrays.length; pIdx++) {
            const triangles = partArrays[pIdx];
            totalTriangles += triangles.length;

            const vertices = [];
            const vMap = new Map();

            const getVertexIdx = (p) => {
                const key = `${Math.round(p[0] * 10000)},${Math.round(p[1] * 10000)},${Math.round(p[2] * 10000)}`;
                let vIdx = vMap.get(key);
                if (vIdx === undefined) {
                    vIdx = vertices.length;
                    vMap.set(key, vIdx);
                    const ptId = id++;
                    const vtxId = id++;
                    lines.push(`#${ptId}=CARTESIAN_POINT('',(${fStr(p[0])},${fStr(p[1])},${fStr(p[2])}));`);
                    lines.push(`#${vtxId}=VERTEX_POINT('',#${ptId});`);
                    vertices.push({ x: p[0], y: p[1], z: p[2], ptId, vtxId });
                }
                return vIdx;
            };

            const rawTris = [];
            for (let i = 0; i < triangles.length; i++) {
                const [p1, p2, p3, nHint] = triangles[i];
                const i1 = getVertexIdx(p1);
                const i2 = getVertexIdx(p2);
                const i3 = getVertexIdx(p3);
                if (i1 === i2 || i2 === i3 || i3 === i1) continue;

                const vA = vertices[i1], vB = vertices[i2], vC = vertices[i3];
                const abx = vB.x - vA.x, aby = vB.y - vA.y, abz = vB.z - vA.z;
                const acx = vC.x - vA.x, acy = vC.y - vA.y, acz = vC.z - vA.z;
                let nx = aby * acz - abz * acy;
                let ny = abz * acx - abx * acz;
                let nz = abx * acy - aby * acx;
                const nLen = Math.hypot(nx, ny, nz);
                if (nLen < 1e-11) continue;
                nx /= nLen; ny /= nLen; nz /= nLen;

                if (nHint && (nx * nHint[0] + ny * nHint[1] + nz * nHint[2] < -1e-6)) {
                    rawTris.push({ verts: [i1, i3, i2], n: [-nx, -ny, -nz] });
                } else {
                    rawTris.push({ verts: [i1, i2, i3], n: [nx, ny, nz] });
                }
            }

            // Merge consecutive coplanar convex triangle pairs sharing an edge into 4-sided quads
            const polygons = [];
            const isConvexQuad = (ia, ib, ic, id4, n) => {
                const pts = [vertices[ia], vertices[ib], vertices[ic], vertices[id4]];
                const distD = Math.abs((pts[3].x - pts[0].x) * n[0] + (pts[3].y - pts[0].y) * n[1] + (pts[3].z - pts[0].z) * n[2]);
                if (distD > 1e-5) return false;
                for (let k = 0; k < 4; k++) {
                    const pPrev = pts[(k + 3) % 4];
                    const pCurr = pts[k];
                    const pNext = pts[(k + 1) % 4];
                    const e1x = pCurr.x - pPrev.x, e1y = pCurr.y - pPrev.y, e1z = pCurr.z - pPrev.z;
                    const e2x = pNext.x - pCurr.x, e2y = pNext.y - pCurr.y, e2z = pNext.z - pCurr.z;
                    const cx = e1y * e2z - e1z * e2y;
                    const cy = e1z * e2x - e1x * e2z;
                    const cz = e1x * e2y - e1y * e2x;
                    if (cx * n[0] + cy * n[1] + cz * n[2] <= 1e-8) return false;
                }
                return true;
            };

            let idx = 0;
            while (idx < rawTris.length) {
                const t1 = rawTris[idx];
                if (idx + 1 < rawTris.length) {
                    const t2 = rawTris[idx + 1];
                    const dotN = t1.n[0] * t2.n[0] + t1.n[1] * t2.n[1] + t1.n[2] * t2.n[2];
                    if (dotN > 0.999999) {
                        const [a, b, c] = t1.verts;
                        const [d, e, f] = t2.verts;
                        // Pattern 1: t1 = (a, b, c), t2 = (a, c, f) -> quad (a, b, c, f)
                        if (a === d && c === e && b !== f && isConvexQuad(a, b, c, f, t1.n)) {
                            polygons.push({ verts: [a, b, c, f], n: t1.n });
                            idx += 2;
                            continue;
                        }
                        // Pattern 2: t1 = (a, b, c), t2 = (b, e, c) -> quad (a, b, e, c)
                        if (b === d && c === f && a !== e && isConvexQuad(a, b, e, c, t1.n)) {
                            polygons.push({ verts: [a, b, e, c], n: t1.n });
                            idx += 2;
                            continue;
                        }
                        // Pattern 3: t1 = (a, b, c), t2 = (a, e, b) -> quad (a, e, b, c)
                        if (a === d && b === f && c !== e && isConvexQuad(a, e, b, c, t1.n)) {
                            polygons.push({ verts: [a, e, b, c], n: t1.n });
                            idx += 2;
                            continue;
                        }
                    }
                }
                polygons.push(t1);
                idx++;
            }

            // Build deduplicated undirected EDGE_CURVEs and ADVANCED_FACEs
            const edgeMap = new Map();
            const getEdgeCurve = (u, v) => {
                const uMin = u < v ? u : v;
                const uMax = u < v ? v : u;
                const key = `${uMin}_${uMax}`;
                let ecId = edgeMap.get(key);
                if (ecId === undefined) {
                    const pA = vertices[uMin];
                    const pB = vertices[uMax];
                    let dx = pB.x - pA.x, dy = pB.y - pA.y, dz = pB.z - pA.z;
                    const len = Math.hypot(dx, dy, dz) || 1.0;
                    dx /= len; dy /= len; dz /= len;
                    const dirId = id++;
                    const vecId = id++;
                    const lineId = id++;
                    ecId = id++;
                    lines.push(`#${dirId}=DIRECTION('',(${fStr(dx)},${fStr(dy)},${fStr(dz)}));`);
                    lines.push(`#${vecId}=VECTOR('',#${dirId},1.0);`);
                    lines.push(`#${lineId}=LINE('',#${pA.ptId},#${vecId});`);
                    lines.push(`#${ecId}=EDGE_CURVE('',#${pA.vtxId},#${pB.vtxId},#${lineId},.T.);`);
                    edgeMap.set(key, ecId);
                }
                return { ecId, sense: u < v ? '.T.' : '.F.' };
            };

            const faceIds = [];
            for (let i = 0; i < polygons.length; i++) {
                const poly = polygons[i];
                const m = poly.verts.length;
                const oeIds = [];
                for (let k = 0; k < m; k++) {
                    const u = poly.verts[k];
                    const v = poly.verts[(k + 1) % m];
                    const { ecId, sense } = getEdgeCurve(u, v);
                    const oeId = id++;
                    lines.push(`#${oeId}=ORIENTED_EDGE('',*,*,#${ecId},${sense});`);
                    oeIds.push(`#${oeId}`);
                }

                const loopId = id++;
                const boundId = id++;
                const p0 = vertices[poly.verts[0]];
                const p1 = vertices[poly.verts[1]];
                let rx = p1.x - p0.x, ry = p1.y - p0.y, rz = p1.z - p0.z;
                const dotNR = rx * poly.n[0] + ry * poly.n[1] + rz * poly.n[2];
                rx -= dotNR * poly.n[0];
                ry -= dotNR * poly.n[1];
                rz -= dotNR * poly.n[2];
                const rLen = Math.hypot(rx, ry, rz) || 1.0;
                rx /= rLen; ry /= rLen; rz /= rLen;

                const nDirId = id++;
                const rDirId = id++;
                const axisId = id++;
                const planeId = id++;
                const faceId = id++;

                lines.push(`#${loopId}=EDGE_LOOP('',(${oeIds.join(',')}));`);
                lines.push(`#${boundId}=FACE_OUTER_BOUND('',#${loopId},.T.);`);
                lines.push(`#${nDirId}=DIRECTION('',(${fStr(poly.n[0])},${fStr(poly.n[1])},${fStr(poly.n[2])}));`);
                lines.push(`#${rDirId}=DIRECTION('',(${fStr(rx)},${fStr(ry)},${fStr(rz)}));`);
                lines.push(`#${axisId}=AXIS2_PLACEMENT_3D('',#${p0.ptId},#${nDirId},#${rDirId});`);
                lines.push(`#${planeId}=PLANE('',#${axisId});`);
                lines.push(`#${faceId}=ADVANCED_FACE('',(#${boundId}),#${planeId},.T.);`);
                faceIds.push(`#${faceId}`);
            }

            totalFaces += faceIds.length;
            if (faceIds.length === 0) continue;

            const bodyLabel = partArrays.length > 1 ? `${partName}_BODY_${pIdx + 1}` : partName;
            const shellId = id++;
            if (isSurface) {
                lines.push(`#${shellId}=OPEN_SHELL('${bodyLabel}',(${faceIds.join(',')}));`);
                const sbsmId = id++;
                lines.push(`#${sbsmId}=SHELL_BASED_SURFACE_MODEL('${bodyLabel}',(#${shellId}));`);
                bodyItemIds.push(`#${sbsmId}`);
            } else {
                lines.push(`#${shellId}=CLOSED_SHELL('${bodyLabel}',(${faceIds.join(',')}));`);
                const brepId = id++;
                lines.push(`#${brepId}=MANIFOLD_SOLID_BREP('${bodyLabel}',#${shellId});`);
                bodyItemIds.push(`#${brepId}`);
            }
        }

        bodyItemIds.push(`#${origAxisId}`);
        const shapeRepId = id++;
        if (isSurface) {
            lines.push(`#${shapeRepId}=MANIFOLD_SURFACE_SHAPE_REPRESENTATION('${partName}',(${bodyItemIds.join(',')}),#${repContextId});`);
        } else {
            lines.push(`#${shapeRepId}=ADVANCED_BREP_SHAPE_REPRESENTATION('${partName}',(${bodyItemIds.join(',')}),#${repContextId});`);
        }
        lines.push(`#${id++}=SHAPE_DEFINITION_REPRESENTATION(#${prodDefShapeId},#${shapeRepId});`);

        lines.push('ENDSEC;');
        lines.push('END-ISO-10303-21;');

        const textContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([textContent], { type: 'application/step;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { text: textContent, blob, triangleCount: totalTriangles, faceCount: totalFaces, isSurface };
    },

    /**
     * Exports hollow open flank surface STEP file for Mastercam Surface Toolpaths & SolidWorks Surface Modeling
     */
    exportSTEPSurface(input, filename = 'gear_surface.step', partName = 'GEAR_SURFACE_PART', autoDownload = true) {
        return this.exportSTEP(input, filename, partName, autoDownload, true);
    },

    /**
     * Exports Wavefront OBJ file (.obj) with welded manifold vertices and multi-body object groups
     * @param {Array|Object} input - Triangle data or [pinionTris, gearTris]
     * @param {string} filename - e.g. "gear_model.obj"
     * @param {boolean} [autoDownload=true] - Trigger browser download
     */
    exportOBJ(input, filename = 'gear_model.obj', autoDownload = true) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const lines = [
            '# MITCalc 3D Gear Model',
            '# SolidWorks & Mastercam Compatible Welded Manifold Mesh'
        ];

        let globalVtxOffset = 0;
        let globalNormOffset = 0;
        let totalTriangles = 0;

        for (let pIdx = 0; pIdx < partArrays.length; pIdx++) {
            const triangles = partArrays[pIdx];
            totalTriangles += triangles.length;
            lines.push(`o GearBody_${pIdx + 1}`);

            const vMap = new Map();
            let localVtxCount = 0;
            const getVtxIndex = (p) => {
                const key = `${Math.round(p[0] * 10000)},${Math.round(p[1] * 10000)},${Math.round(p[2] * 10000)}`;
                let vId = vMap.get(key);
                if (vId === undefined) {
                    localVtxCount++;
                    vId = globalVtxOffset + localVtxCount;
                    vMap.set(key, vId);
                    lines.push(`v ${p[0].toFixed(5)} ${p[1].toFixed(5)} ${p[2].toFixed(5)}`);
                }
                return vId;
            };

            const faceLines = [];
            for (let i = 0; i < triangles.length; i++) {
                const [p1, p2, p3, n] = triangles[i];
                const v1 = getVtxIndex(p1);
                const v2 = getVtxIndex(p2);
                const v3 = getVtxIndex(p3);
                if (v1 === v2 || v2 === v3 || v3 === v1) continue;
                globalNormOffset++;
                lines.push(`vn ${n[0].toFixed(5)} ${n[1].toFixed(5)} ${n[2].toFixed(5)}`);
                faceLines.push(`f ${v1}//${globalNormOffset} ${v2}//${globalNormOffset} ${v3}//${globalNormOffset}`);
            }

            for (let i = 0; i < faceLines.length; i++) {
                lines.push(faceLines[i]);
            }
            globalVtxOffset += localVtxCount;
        }

        const textContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { text: textContent, blob, triangleCount: totalTriangles };
    },

    /**
     * Transforms raw triangle array by translation (dx, dy, dz) and rotation around Z (angleRad)
     * @param {Array} triangles
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @param {number} rotZRad
     * @returns {Array} Transformed triangles
     */
    transformTriangles(triangles, dx = 0, dy = 0, dz = 0, rotZRad = 0) {
        const cosR = Math.cos(rotZRad);
        const sinR = Math.sin(rotZRad);

        return triangles.map(([p1, p2, p3, n]) => {
            const rotatePt = (p) => [
                p[0] * cosR - p[1] * sinR + dx,
                p[0] * sinR + p[1] * cosR + dy,
                p[2] + dz
            ];
            const rotateVec = (v) => [
                v[0] * cosR - v[1] * sinR,
                v[0] * sinR + v[1] * cosR,
                v[2]
            ];
            return [
                rotatePt(p1),
                rotatePt(p2),
                rotatePt(p3),
                rotateVec(n)
            ];
        });
    }
};
