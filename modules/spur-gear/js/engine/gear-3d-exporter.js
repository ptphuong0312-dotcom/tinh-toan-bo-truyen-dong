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
     * Exports standard ISO 10303-21 STEP AP214 file (.step)
     * SolidWorks parses this directly into a Solid Body.
     * Mastercam recognizes it as a Machinable Solid for 3D Toolpaths & Wire EDM.
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "SpurGear.step"
     * @param {string} partName - Part name
     */
    exportSTEP(input, filename = 'gear_model.step', partName = 'GEAR_SOLID_PART', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const now = new Date().toISOString().replace(/\.\d+Z$/, '');

        const lines = [];
        lines.push('ISO-10303-21;');
        lines.push('HEADER;');
        lines.push(`FILE_DESCRIPTION(('MITCalc 3D Gear Solid Model for SolidWorks and Mastercam'),'2;1');`);
        lines.push(`FILE_NAME('${filename}','${now}',('SirPhuong'),('MITCalc-Gear-Engineering'),'Antigravity CAD/CAM Engine','SolidWorks / Mastercam Compatible','');`);
        lines.push(`FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));`);
        lines.push('ENDSEC;');
        lines.push('DATA;');

        let id = 1;

        // Context & Units
        lines.push(`#${id++} = APPLICATION_CONTEXT('core data for automotive mechanical design processes');`); // #1
        lines.push(`#${id++} = APPLICATION_PROTOCOL_DEFINITION('draft international standard','automotive_design',1999,#1);`); // #2
        lines.push(`#${id++} = PRODUCT_CONTEXT('',#1,'mechanical');`); // #3
        lines.push(`#${id++} = PRODUCT('${partName}','${partName}','',(#3));`); // #4
        lines.push(`#${id++} = PRODUCT_DEFINITION_FORMATION('','',#4);`); // #5
        lines.push(`#${id++} = PRODUCT_DEFINITION('design','',#5,#3);`); // #6
        lines.push(`#${id++} = PRODUCT_DEFINITION_SHAPE('','',#6);`); // #7

        // SI Units: Millimetre (0.001 m)
        lines.push(`#${id++} = ( LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.) );`); // #8
        lines.push(`#${id++} = ( NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.) );`); // #9
        lines.push(`#${id++} = ( NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT() );`); // #10
        lines.push(`#${id++} = UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(0.001),#8,'distance_accuracy_value','confusion accuracy');`); // #11
        lines.push(`#${id++} = ( GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#11)) GLOBAL_UNIT_ASSIGNED_CONTEXT((#8,#9,#10)) REPRESENTATION_CONTEXT('3D','TOPOLOGY') );`); // #12

        const repContextId = 12;

        // Write vertices & faces for closed shell
        const vMap = new Map();
        let nextVId = id;

        const fStr = (v) => {
            const s = v.toFixed(5);
            return s.indexOf('.') === -1 ? s + '.' : s;
        };

        const getVertexId = (p) => {
            const key = `${Math.round(p[0] * 1000)},${Math.round(p[1] * 1000)},${Math.round(p[2] * 1000)}`;
            let existId = vMap.get(key);
            if (!existId) {
                existId = nextVId++;
                vMap.set(key, existId);
                lines.push(`#${existId} = CARTESIAN_POINT('',(${fStr(p[0])},${fStr(p[1])},${fStr(p[2])}));`);
            }
            return existId;
        };

        const faceDefinitions = [];
        for (let i = 0; i < triangles.length; i++) {
            const [p1, p2, p3, n] = triangles[i];
            const id1 = getVertexId(p1);
            const id2 = getVertexId(p2);
            const id3 = getVertexId(p3);

            if (id1 === id2 || id2 === id3 || id3 === id1) continue;

            faceDefinitions.push({ id1, id2, id3, n, p1 });
        }

        id = nextVId;

        const faceIds = [];
        for (let i = 0; i < faceDefinitions.length; i++) {
            const f = faceDefinitions[i];
            const pId1 = f.id1;
            const pId2 = f.id2;
            const pId3 = f.id3;

            const loopId = id++;
            lines.push(`#${loopId} = POLY_LOOP('',(#${pId1},#${pId2},#${pId3}));`);

            const boundId = id++;
            lines.push(`#${boundId} = FACE_OUTER_BOUND('',#${loopId},.T.);`);

            const dirId = id++;
            lines.push(`#${dirId} = DIRECTION('',(${fStr(f.n[0])},${fStr(f.n[1])},${fStr(f.n[2])}));`);

            const axisId = id++;
            lines.push(`#${axisId} = AXIS2_PLACEMENT_3D('',#${pId1},#${dirId},$);`);

            const planeId = id++;
            lines.push(`#${planeId} = PLANE('',#${axisId});`);

            const faceId = id++;
            lines.push(`#${faceId} = FACE_SURFACE('',(#${boundId}),#${planeId},.T.);`);
            faceIds.push(`#${faceId}`);
        }

        const shellId = id++;
        lines.push(`#${shellId} = CLOSED_SHELL('',(${faceIds.join(',')}));`);

        const solidId = id++;
        lines.push(`#${solidId} = MANIFOLD_SOLID_BREP('${partName}',#${shellId});`);

        const shapeRepId = id++;
        lines.push(`#${shapeRepId} = SHAPE_REPRESENTATION('${partName}',(#${solidId}),#${repContextId});`);

        lines.push(`#${id++} = SHAPE_DEFINITION_REPRESENTATION(#7,#${shapeRepId});`);

        lines.push('ENDSEC;');
        lines.push('END-ISO-10303-21;');

        const textContent = lines.join('\r\n');
        const blob = new Blob([textContent], { type: 'application/step;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { text: textContent, blob, triangleCount: triangles.length, faceCount: faceIds.length };
    },

    /**
     * Exports Wavefront OBJ file (.obj)
     * @param {Array|Object} input - Triangle data
     * @param {string} filename - e.g. "gear_model.obj"
     * @param {boolean} [autoDownload=true] - Trigger browser download
     */
    exportOBJ(input, filename = 'gear_model.obj', autoDownload = true) {
        const triangles = this.normalizeTriangles(input);
        const lines = [
            '# MITCalc 3D Gear Model',
            '# SolidWorks & Mastercam Compatible Mesh',
            'o GearSolid'
        ];

        let vCounter = 1;
        for (let i = 0; i < triangles.length; i++) {
            const [p1, p2, p3, n] = triangles[i];
            lines.push(`vn ${n[0].toFixed(5)} ${n[1].toFixed(5)} ${n[2].toFixed(5)}`);
            lines.push(`v ${p1[0].toFixed(4)} ${p1[1].toFixed(4)} ${p1[2].toFixed(4)}`);
            lines.push(`v ${p2[0].toFixed(4)} ${p2[1].toFixed(4)} ${p2[2].toFixed(4)}`);
            lines.push(`v ${p3[0].toFixed(4)} ${p3[1].toFixed(4)} ${p3[2].toFixed(4)}`);

            const v1 = vCounter;
            const v2 = vCounter + 1;
            const v3 = vCounter + 2;
            const vn = i + 1;
            lines.push(`f ${v1}//${vn} ${v2}//${vn} ${v3}//${vn}`);
            vCounter += 3;
        }

        const textContent = lines.join('\r\n');
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        if (autoDownload) this.downloadBlob(blob, filename);
        return { text: textContent, blob, triangleCount: triangles.length };
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
