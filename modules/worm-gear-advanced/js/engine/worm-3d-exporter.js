/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR CAD EXPORTER FOR SOLIDWORKS & MASTERCAM (MODULE 3)
 * ============================================================================
 * Generates industry-standard 3D CAD files:
 * 1. Binary STL (.stl) - High-precision, compact binary mesh ready for Mastercam Toolpaths
 *    (4-Axis Rotary Worm Milling, 5-Axis Swarf/Multiaxis Wheel Hobbing) & SolidWorks Mesh Body.
 * 2. ISO 10303-21 STEP AP214 (.step / .stp) - Standard CAD Solid B-Rep format recognized by
 *    SolidWorks as a native Solid Body and Mastercam as a Machinable Solid.
 * 3. STEP AP214 Hollow Flank Surface (.step) - OPEN_SHELL with SHELL_BASED_SURFACE_MODEL for
 *    Mastercam 5-axis Surface Toolpaths & SolidWorks surface modeling.
 * 4. Wavefront OBJ (.obj) - Universal 3D geometry interchange format.
 * ============================================================================
 */

const Worm3DExporter = {
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

    meshToRawTriangles(meshData) {
        if (!meshData) return [];
        if (meshData.rawTriangles) return meshData.rawTriangles;
        const { vertices, normals, indices } = meshData;
        if (!vertices || !indices) return [];
        const tris = [];
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = indices[i] * 3, i2 = indices[i + 1] * 3, i3 = indices[i + 2] * 3;
            const p1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const p2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
            const p3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];
            const n = normals ? [normals[i1], normals[i1 + 1], normals[i1 + 2]] : [0, 1, 0];
            tris.push([p1, p2, p3, n]);
        }
        return tris;
    },

    normalizeTriangles(input) {
        if (!input) return [];
        if (Array.isArray(input)) {
            if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 4) {
                return input;
            }
            let combined = [];
            for (const part of input) {
                if (Array.isArray(part)) {
                    combined = combined.concat(this.normalizeTriangles(part));
                } else if (part && part.rawTriangles) {
                    combined = combined.concat(part.rawTriangles);
                } else if (part && part.vertices && part.indices) {
                    combined = combined.concat(this.meshToRawTriangles(part));
                }
            }
            return combined;
        } else if (input.rawTriangles) {
            return input.rawTriangles;
        } else if (input.vertices && input.indices) {
            return this.meshToRawTriangles(input);
        }
        return [];
    },

    exportBinarySTL(input, filename = 'worm_gear.stl', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const numTriangles = triangles.length;

        const totalBytes = 84 + numTriangles * 50;
        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);

        const headerStr = 'MITCalc 3D Worm Gear Model - DIN 3975 / DIN 3996 SolidWorks & Mastercam';
        for (let i = 0; i < 80; i++) {
            view.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 32);
        }

        view.setUint32(80, numTriangles, true);

        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
            const tri = triangles[i];
            const p1 = tri[0];
            const p2 = tri[1];
            const p3 = tri[2];
            const n = tri[3];

            view.setFloat32(offset, n[0], true);
            view.setFloat32(offset + 4, n[1], true);
            view.setFloat32(offset + 8, n[2], true);

            view.setFloat32(offset + 12, p1[0], true);
            view.setFloat32(offset + 16, p1[1], true);
            view.setFloat32(offset + 20, p1[2], true);

            view.setFloat32(offset + 24, p2[0], true);
            view.setFloat32(offset + 28, p2[1], true);
            view.setFloat32(offset + 32, p2[2], true);

            view.setFloat32(offset + 36, p3[0], true);
            view.setFloat32(offset + 40, p3[1], true);
            view.setFloat32(offset + 44, p3[2], true);

            view.setUint16(offset + 48, 0, true);
            offset += 50;
        }

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { buffer, blob, numTriangles, totalBytes };
    },

    exportSTLSurface(input, filename = 'worm_gear_surface.stl', autoDownload = true) {
        return this.exportBinarySTL(input, filename, autoDownload);
    },

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

    exportSTEP(input, filename = 'worm_gear.step', partName = 'WORM_GEAR_PART', autoDownload = true, isSurface = false) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const now = new Date().toISOString().replace(/\.\d+Z$/, '');

        const lines = [];
        lines.push('ISO-10303-21;');
        lines.push('HEADER;');
        const fileDesc = isSurface
            ? 'MITCalc 3D Worm Gear Hollow Flank Surface Model for SolidWorks and Mastercam Surface Toolpaths'
            : 'MITCalc 3D Worm Gear Solid Model for SolidWorks and Mastercam (DIN 3975 / DIN 3996)';
        lines.push(`FILE_DESCRIPTION(('${fileDesc}'),'2;1');`);
        lines.push(`FILE_NAME('${filename}','${now}',('SirPhuong'),('MITCalc-Gear-Engineering'),'Antigravity CAD/CAM Engine','SolidWorks / Mastercam Compatible','');`);
        lines.push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
        lines.push('ENDSEC;');
        lines.push('DATA;');

        let id = 1;

        lines.push(`#${id++}=APPLICATION_CONTEXT('automotive design');`); // #1
        lines.push(`#${id++}=APPLICATION_PROTOCOL_DEFINITION('international standard','automotive_design',2000,#1);`); // #2
        lines.push(`#${id++}=PRODUCT_CONTEXT('',#1,'mechanical');`); // #3
        lines.push(`#${id++}=PRODUCT('${partName}','${partName}','',(#3));`); // #4
        lines.push(`#${id++}=PRODUCT_DEFINITION_FORMATION('','',#4);`); // #5
        lines.push(`#${id++}=PRODUCT_DEFINITION_CONTEXT('part definition',#1,'design');`); // #6
        lines.push(`#${id++}=PRODUCT_DEFINITION('design','',#5,#6);`); // #7
        lines.push(`#${id++}=PRODUCT_DEFINITION_SHAPE('','',#7);`); // #8

        lines.push(`#${id++}=(LENGTH_UNIT()NAMED_UNIT(*)SI_UNIT(.MILLI.,.METRE.));`); // #9
        lines.push(`#${id++}=(NAMED_UNIT(*)PLANE_ANGLE_UNIT()SI_UNIT($,.RADIAN.));`); // #10
        lines.push(`#${id++}=(NAMED_UNIT(*)SOLID_ANGLE_UNIT()SI_UNIT($,.STERADIAN.));`); // #11
        lines.push(`#${id++}=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.0E-04),#9,'distance_accuracy_value','confusion accuracy');`); // #12
        lines.push(`#${id++}=(GEOMETRIC_REPRESENTATION_CONTEXT(3)GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#12))GLOBAL_UNIT_ASSIGNED_CONTEXT((#9,#10,#11))REPRESENTATION_CONTEXT('Context3D','3D Context'));`); // #13

        const prodDefShapeId = 8;
        const repContextId = 13;

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
                        if (a === d && c === e && b !== f && isConvexQuad(a, b, c, f, t1.n)) {
                            polygons.push({ verts: [a, b, c, f], n: t1.n });
                            idx += 2;
                            continue;
                        }
                        if (b === d && c === f && a !== e && isConvexQuad(a, b, e, c, t1.n)) {
                            polygons.push({ verts: [a, b, e, c], n: t1.n });
                            idx += 2;
                            continue;
                        }
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

        const stepContent = lines.join('\r\n') + '\r\n';
        const blob = new Blob([stepContent], { type: 'application/step;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { content: stepContent, blob, numFaces: totalFaces, triangleCount: totalTriangles, isSurface };
    },

    exportSTEPSurface(input, filename = 'worm_gear_surface.step', partName = 'WORM_GEAR_SURFACE', autoDownload = true) {
        return this.exportSTEP(input, filename, partName, autoDownload, true);
    },

    exportOBJ(input, filename = 'worm_gear.obj', autoDownload = true) {
        const partArrays = this.normalizePartTriangleArrays(input);
        const lines = [
            '# MITCalc 3D Worm Gear Wavefront OBJ File',
            '# Standards: DIN 3975 / DIN 3996 / AGMA 6022 - Welded Manifold Mesh'
        ];

        let globalVtxOffset = 0;
        let globalNormOffset = 0;
        let totalTriangles = 0;

        for (let pIdx = 0; pIdx < partArrays.length; pIdx++) {
            const triangles = partArrays[pIdx];
            totalTriangles += triangles.length;
            lines.push(`o WormGearBody_${pIdx + 1}`);

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
        return { blob, text: textContent, triangleCount: totalTriangles };
    },

    /**
     * Exports True Parametric B-Spline Surfaces (Entity 128) and Wireframe Profile Curves (Entity 106 Form 2)
     * strictly formatted according to ANSI/USPRO/IPO-100-1996 (IGES 5.3) for Mastercam (X5-2026) & SolidWorks.
     * Level 1: SURFACES (Flanks, Tip Crests) - True surfaces, opens instantly in Mastercam without solid conversion!
     * Level 2: WIREFRAME_LOFT_PROFILES (Tooth cross profiles, Helical/Throat Rails) for Mastercam Create -> Surface -> Ruled/Lofted.
     * Level 3: AXES_DATUMS (Shaft / wheel rotation centerlines).
     *
     * @param {Object|Array} parametricData - { surfaces, curves, mc } or array of such objects
     * @param {string} filename - Target .igs filename
     * @param {boolean} autoDownload - Triggers browser Blob download
     */
    exportIGES(parametricData, filename = 'worm_gear_surface.igs', autoDownload = true) {
        let surfaces = [];
        let curves = [];
        if (Array.isArray(parametricData)) {
            parametricData.forEach(p => {
                if (p && p.surfaces) surfaces.push(...p.surfaces);
                if (p && p.curves) curves.push(...p.curves);
            });
        } else if (parametricData) {
            if (parametricData.surfaces) surfaces.push(...parametricData.surfaces);
            if (parametricData.curves) curves.push(...parametricData.curves);
        }

        const pad8 = (v) => ('        ' + v).slice(-8);
        const padLine = (txt, char, seq) => {
            const p = (txt + ' '.repeat(72)).slice(0, 72);
            const s = ('       ' + seq).slice(-7);
            return p + char + s;
        };
        const deL1 = (eType, pPtr, level, seq) => {
            return pad8(eType) + pad8(pPtr) + pad8(0) + pad8(1) + pad8(level) + pad8(0) + pad8(0) + pad8(0) + pad8('00000000') + 'D' + ('       ' + seq).slice(-7);
        };
        const deL2 = (eType, color, pCnt, form, label, seq) => {
            const shortLbl = (label || '')
                .replace('WHEEL_DRV_', 'DRV_')
                .replace('WHEEL_CST_', 'CST_')
                .replace('WHEEL_TIP_', 'TIP_')
                .replace('WHEEL_ROOT_', 'ROT_')
                .replace('WORM_FLANK_R_', 'FLK_R')
                .replace('WORM_FLANK_L_', 'FLK_L')
                .replace('WORM_TIP_', 'TIP_W')
                .replace('WORM_ROOT_', 'ROT_W');
            const padLbl = (shortLbl + '        ').slice(0, 8);
            return pad8(eType) + pad8(1) + pad8(color) + pad8(pCnt) + pad8(form) + pad8(0) + pad8(0) + padLbl + pad8(0) + 'D' + ('       ' + seq).slice(-7);
        };
        const pLine = (chunk, dePtr, seq) => {
            const c = (chunk + ' '.repeat(64)).slice(0, 64);
            return c + pad8(dePtr) + 'P' + ('       ' + seq).slice(-7);
        };

        // Start Section S
        const sLines = [
            padLine('MITCalc Web App - 3D Worm Gear Native Surface Export for Mastercam X5-2026', 'S', 1),
            padLine('Direct Parametric B-Spline Surfaces & Wireframe Profiles - Zero Conversion', 'S', 2)
        ];

        // Global Section G
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') + '.' +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');

        const gTokens = [
            '1H,', '1H;',
            '33HMITCalc 3D Worm Gear Surface CAD',
            filename.length + 'H' + filename,
            '21HAntigravity CAD Engine',
            '12HMastercam X5',
            32, 38, 6, 308, 15,
            '12HMastercam X5',
            '1.0', 2, '2HMM', 1, '1.0',
            '15H' + dateStr,
            '0.0001', '1000.0',
            '9HSirPhuong',
            '24HMITCalc-Gear-Engineering',
            11, 0
        ];
        const gChunks = [];
        let curG = '';
        for (let i = 0; i < gTokens.length; i++) {
            const delim = (i === gTokens.length - 1) ? ';' : ',';
            const item = String(gTokens[i]) + delim;
            if (curG.length + item.length <= 72) {
                curG += item;
            } else {
                gChunks.push(curG);
                curG = item;
            }
        }
        if (curG.length > 0) gChunks.push(curG);
        const gLines = gChunks.map((chunk, idx) => padLine(chunk, 'G', idx + 1));

        // Entities preparation
        const entityList = [];

        // 1. Parametric B-Spline Surfaces (Entity 128) - Level 1 (SURFACES)
        surfaces.forEach(s => {
            const grid = s.grid;
            if (!grid || !grid.length || !grid[0].length) return;
            const Nu = grid.length;
            const Nv = grid[0].length;
            const K1 = Nu - 1;
            const K2 = Nv - 1;
            const M1 = Math.min(3, Nu - 1);
            const M2 = Math.min(3, Nv - 1); // Bicubic B-Spline (Degree 3 in U and V) for C2 curvature continuity

            const uKnots = [];
            for (let i = 0; i <= M1; i++) uKnots.push('0');
            const uInt = Nu - M1 - 1;
            for (let i = 1; i <= uInt; i++) uKnots.push((i / (uInt + 1)).toFixed(6));
            for (let i = 0; i <= M1; i++) uKnots.push('1');

            const vKnots = [];
            for (let j = 0; j <= M2; j++) vKnots.push('0');
            const vInt = Nv - M2 - 1;
            for (let j = 1; j <= vInt; j++) vKnots.push((j / (vInt + 1)).toFixed(6));
            for (let j = 0; j <= M2; j++) vKnots.push('1');

            const totalPts = Nu * Nv;
            const weights = new Array(totalPts).fill('1');

            const ptsCoords = [];
            // IGES Entity 128 Specification:
            // First index i (0 .. K1 = Nu - 1, along U) varies FASTEST (inner loop)
            // Second index j (0 .. K2 = Nv - 1, along V) varies slowest (outer loop)
            for (let j = 0; j < Nv; j++) {
                for (let i = 0; i < Nu; i++) {
                    const pt = grid[i][j];
                    ptsCoords.push(Number(pt[0]).toFixed(5));
                    ptsCoords.push(Number(pt[1]).toFixed(5));
                    ptsCoords.push(Number(pt[2]).toFixed(5));
                }
            }

            const pTokens = [
                128, K1, K2, M1, M2,
                0, 0, 1, 0, 0,
                ...uKnots,
                ...vKnots,
                ...weights,
                ...ptsCoords,
                0, 1, 0, 1
            ];

            entityList.push({
                type: 128,
                form: 0,
                level: s.level || 1,
                color: s.color || 3,
                label: s.label || 'SURFACE',
                pTokens
            });
        });

        // 2. Wireframe Profiles and Rails (Entity 106 Form 12 Copious Data: Linear Path) - Level 2 / Level 3
        curves.forEach(c => {
            const pts = c.points;
            if (!pts || !pts.length) return;
            const N = pts.length;
            const coords = [];
            for (let i = 0; i < N; i++) {
                coords.push(Number(pts[i][0]).toFixed(5));
                coords.push(Number(pts[i][1]).toFixed(5));
                coords.push(Number(pts[i][2]).toFixed(5));
            }
            const pTokens = [106, 2, N, ...coords];
            entityList.push({
                type: 106,
                form: 12, // Form 12 = Linear Path in 3D (connected 3D wireframe curve, NOT discrete point markers!)
                level: c.level || 2,
                color: c.color || 5,
                label: c.label || 'CURVE',
                pTokens
            });
        });

        // Compute P lines & DE lines with strict token-aware line wrapping
        const dLines = [];
        const pLines = [];
        let pSeq = 1;

        entityList.forEach((e, idx) => {
            const deLine1Seq = idx * 2 + 1;
            const deLine2Seq = idx * 2 + 2;
            const pStartPtr = pSeq;

            // Strictly token-aware: each token is placed completely within column 1-64.
            // No parameter, number, or sign ever crosses column 64!
            const chunks = [];
            let curChunk = '';
            for (let i = 0; i < e.pTokens.length; i++) {
                const delim = (i === e.pTokens.length - 1) ? ';' : ',';
                const item = String(e.pTokens[i]) + delim;
                if (curChunk.length + item.length <= 64) {
                    curChunk += item;
                } else {
                    chunks.push(curChunk);
                    curChunk = item;
                }
            }
            if (curChunk.length > 0) {
                chunks.push(curChunk);
            }

            dLines.push(deL1(e.type, pStartPtr, e.level, deLine1Seq));
            dLines.push(deL2(e.type, e.color, chunks.length, e.form, e.label, deLine2Seq));

            chunks.forEach(chunk => {
                pLines.push(pLine(chunk, deLine1Seq, pSeq++));
            });
        });

        // Terminate Section T
        const sCnt = String(sLines.length).padStart(7, ' ');
        const gCnt = String(gLines.length).padStart(7, ' ');
        const dCnt = String(dLines.length).padStart(7, ' ');
        const pCnt = String(pLines.length).padStart(7, ' ');
        const tLine = `S${sCnt}G${gCnt}D${dCnt}P${pCnt}` + ' '.repeat(40) + 'T      1';

        const allLines = sLines.concat(gLines, dLines, pLines, [tLine]);
        const igesContent = allLines.join('\r\n') + '\r\n';
        const blob = new Blob([igesContent], { type: 'application/iges;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);

        return {
            content: igesContent,
            blob,
            numSurfaces: surfaces.length,
            numCurves: curves.length,
            totalLines: allLines.length
        };
    }
};

if (typeof window !== 'undefined') {
    window.Worm3DExporter = Worm3DExporter;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Worm3DExporter;
}
