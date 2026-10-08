/**
 * CAD DXF EXPORT ENGINE: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Standard: DXF Release 12 (AC1009 ASCII format)
 * Compatible: AutoCAD, SolidWorks, Autodesk Inventor, LibreCAD, BricsCAD, ZWCAD
 * 100% Offline, Zero-CORS, Blob download
 */

const KeysDXF = {
  /**
   * Xuất bản vẽ 2D DXF cho Then Bằng, Then Bán Nguyệt, hoặc Then Hoa
   * @param {string} jointType - 'parallel', 'woodruff', 'spline'
   * @param {Object} data - Dữ liệu tính toán từ KeysCalc
   * @param {string} sectionType - 'cross', 'long'
   */
  exportDXF(jointType, data, sectionType = 'cross') {
    let d = '';
    // Header
    d += '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n';

    // Tables
    d += '0\nSECTION\n2\nTABLES\n';
    d += '0\nTABLE\n2\nLTYPE\n70\n1\n';
    d += '0\nLTYPE\n2\nCENTER\n70\n0\n3\nCenterline\n72\n65\n73\n2\n40\n10.0\n49\n7.5\n49\n-2.5\n';
    d += '0\nENDTAB\n';

    d += '0\nTABLE\n2\nLAYER\n70\n5\n';
    d += '0\nLAYER\n2\nCONTOUR_SHAFT\n70\n0\n62\n4\n6\nCONTINUOUS\n'; // Cyan
    d += '0\nLAYER\n2\nCONTOUR_HUB\n70\n0\n62\n1\n6\nCONTINUOUS\n';   // Red
    d += '0\nLAYER\n2\nCONTOUR_KEY\n70\n0\n62\n2\n6\nCONTINUOUS\n';   // Yellow
    d += '0\nLAYER\n2\nCENTER\n70\n0\n62\n7\n6\nCENTER\n';           // White
    d += '0\nLAYER\n2\nMFG_TABLE\n70\n0\n62\n7\n6\nCONTINUOUS\n';     // White
    d += '0\nENDTAB\n0\nENDSEC\n';

    // Entities
    d += '0\nSECTION\n2\nENTITIES\n';

    // Center axes
    const rShaft = (jointType === 'spline' ? data.D / 2 : data.d / 2) * 1.5;
    d += this.dxfLine(-rShaft * 1.3, 0, rShaft * 1.3, 0, 'CENTER');
    d += this.dxfLine(0, -rShaft * 1.3, 0, rShaft * 1.3, 'CENTER');

    if (jointType === 'parallel') {
      d += this.generateParallelKeyDXF(data, sectionType);
    } else if (jointType === 'woodruff') {
      d += this.generateWoodruffKeyDXF(data, sectionType);
    } else if (jointType === 'spline') {
      d += this.generateStraightSplineDXF(data, sectionType);
    }

    // Manufacturing Parameters Table (Bảng chế tạo)
    d += this.generateManufacturingTable(jointType, data);

    d += '0\nENDSEC\n0\nEOF\n';

    // Blob download
    const blob = new Blob([d], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MITCalc_${jointType}_key_drawing.dxf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  dxfLine(x1, y1, x2, y2, layer) {
    return `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(4)}\n20\n${y1.toFixed(4)}\n30\n0.0\n11\n${x2.toFixed(4)}\n21\n${y2.toFixed(4)}\n31\n0.0\n`;
  },

  dxfCircle(cx, cy, r, layer) {
    return `0\nCIRCLE\n8\n${layer}\n10\n${cx.toFixed(4)}\n20\n${cy.toFixed(4)}\n30\n0.0\n40\n${r.toFixed(4)}\n`;
  },

  dxfText(x, y, height, text, layer) {
    return `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(4)}\n20\n${y.toFixed(4)}\n30\n0.0\n40\n${height.toFixed(4)}\n1\n${text}\n`;
  },

  generateParallelKeyDXF(data, sectionType) {
    let d = '';
    const r = data.d / 2;
    const b = data.b;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;

    if (sectionType === 'cross') {
      // Shaft circle
      d += this.dxfCircle(0, 0, r, 'CONTOUR_SHAFT');
      // Shaft keyway slot
      d += this.dxfLine(-b / 2, r, -b / 2, r - t1, 'CONTOUR_SHAFT');
      d += this.dxfLine(-b / 2, r - t1, b / 2, r - t1, 'CONTOUR_SHAFT');
      d += this.dxfLine(b / 2, r - t1, b / 2, r, 'CONTOUR_SHAFT');

      // Key cross section
      d += this.dxfLine(-b / 2, r - t1, -b / 2, r - t1 + h, 'CONTOUR_KEY');
      d += this.dxfLine(-b / 2, r - t1 + h, b / 2, r - t1 + h, 'CONTOUR_KEY');
      d += this.dxfLine(b / 2, r - t1 + h, b / 2, r - t1, 'CONTOUR_KEY');
      d += this.dxfLine(b / 2, r - t1, -b / 2, r - t1, 'CONTOUR_KEY');

      // Hub outer circle & keyway
      const rHub = r * 1.8;
      d += this.dxfCircle(0, 0, rHub, 'CONTOUR_HUB');
      d += this.dxfLine(-b / 2, r, -b / 2, r + t2, 'CONTOUR_HUB');
      d += this.dxfLine(-b / 2, r + t2, b / 2, r + t2, 'CONTOUR_HUB');
      d += this.dxfLine(b / 2, r + t2, b / 2, r, 'CONTOUR_HUB');
    } else {
      // Longitudinal view
      const L = data.chosenL;
      const Lshaft = L * 1.5;
      d += this.dxfLine(-Lshaft / 2, -r, Lshaft / 2, -r, 'CONTOUR_SHAFT');
      d += this.dxfLine(-Lshaft / 2, r, Lshaft / 2, r, 'CONTOUR_SHAFT');
      d += this.dxfLine(-Lshaft / 2, -r, -Lshaft / 2, r, 'CONTOUR_SHAFT');
      d += this.dxfLine(Lshaft / 2, -r, Lshaft / 2, r, 'CONTOUR_SHAFT');

      // Key body
      d += this.dxfLine(-L / 2, r - t1, L / 2, r - t1, 'CONTOUR_KEY');
      d += this.dxfLine(-L / 2, r - t1 + h, L / 2, r - t1 + h, 'CONTOUR_KEY');
      d += this.dxfLine(-L / 2, r - t1, -L / 2, r - t1 + h, 'CONTOUR_KEY');
      d += this.dxfLine(L / 2, r - t1, L / 2, r - t1 + h, 'CONTOUR_KEY');
    }
    return d;
  },

  generateWoodruffKeyDXF(data, sectionType) {
    let d = '';
    const r = data.d / 2;
    const b = data.b;
    const h = data.h;
    const Dk = data.Dk;
    const Rk = Dk / 2;
    const t1 = data.t1;
    const t2 = data.t2;

    if (sectionType === 'cross') {
      d += this.dxfCircle(0, 0, r, 'CONTOUR_SHAFT');
      d += this.dxfCircle(0, 0, r * 1.8, 'CONTOUR_HUB');
      d += this.dxfLine(-b / 2, r - t1, -b / 2, r + t2, 'CONTOUR_KEY');
      d += this.dxfLine(-b / 2, r + t2, b / 2, r + t2, 'CONTOUR_KEY');
      d += this.dxfLine(b / 2, r + t2, b / 2, r - t1, 'CONTOUR_KEY');
      d += this.dxfLine(b / 2, r - t1, -b / 2, r - t1, 'CONTOUR_KEY');
    } else {
      const Lshaft = Dk * 2.0;
      d += this.dxfLine(-Lshaft / 2, -r, Lshaft / 2, -r, 'CONTOUR_SHAFT');
      d += this.dxfLine(-Lshaft / 2, r, Lshaft / 2, r, 'CONTOUR_SHAFT');

      // Key disc
      const discY = r - t1 + Rk;
      d += this.dxfCircle(0, discY, Rk, 'CONTOUR_KEY');
    }
    return d;
  },

  generateStraightSplineDXF(data, sectionType) {
    let d = '';
    const n = data.n;
    const rMinor = data.d / 2;
    const rMajor = data.D / 2;
    const b = data.b;
    const halfB = b / 2;

    if (sectionType === 'cross') {
      d += this.dxfCircle(0, 0, rMinor, 'CONTOUR_SHAFT');
      d += this.dxfCircle(0, 0, rMajor, 'CONTOUR_SHAFT');
      d += this.dxfCircle(0, 0, rMajor * 1.5, 'CONTOUR_HUB');

      const angleStep = (Math.PI * 2) / n;
      for (let i = 0; i < n; i++) {
        const theta = i * angleStep;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const tanX = -sinT;
        const tanY = cosT;

        const p1x = rMajor * cosT - halfB * tanX;
        const p1y = rMajor * sinT - halfB * tanY;
        const p2x = rMajor * cosT + halfB * tanX;
        const p2y = rMajor * sinT + halfB * tanY;

        const p0x = rMinor * cosT - halfB * tanX;
        const p0y = rMinor * sinT - halfB * tanY;
        const p3x = rMinor * cosT + halfB * tanX;
        const p3y = rMinor * sinT + halfB * tanY;

        d += this.dxfLine(p0x, p0y, p1x, p1y, 'CONTOUR_SHAFT');
        d += this.dxfLine(p1x, p1y, p2x, p2y, 'CONTOUR_SHAFT');
        d += this.dxfLine(p2x, p2y, p3x, p3y, 'CONTOUR_SHAFT');
      }
    } else {
      const L = data.chosenL;
      const Lshaft = L * 1.5;
      d += this.dxfLine(-Lshaft / 2, -rMinor, Lshaft / 2, -rMinor, 'CONTOUR_SHAFT');
      d += this.dxfLine(-Lshaft / 2, rMinor, Lshaft / 2, rMinor, 'CONTOUR_SHAFT');
      d += this.dxfLine(-L / 2, rMajor, L / 2, rMajor, 'CONTOUR_KEY');
      d += this.dxfLine(-L / 2, -rMajor, L / 2, -rMajor, 'CONTOUR_KEY');
    }
    return d;
  },

  generateManufacturingTable(jointType, data) {
    let d = '';
    const startX = (jointType === 'spline' ? data.D : data.d) * 1.2;
    let startY = 40;
    const lineH = 4.5;
    const txtSize = 2.5;

    const rows = [
      '--- THONG SO CHE TAO MOI GHEP ---',
      `Tieu chuan: ${data.typeName}`,
      `Quy cach: ${data.keyName || data.splineName}`
    ];

    if (jointType === 'parallel') {
      rows.push(`Duong kinh truc: d = ${data.d.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`);
      rows.push(`Chieu rong then: b = ${data.b.toFixed(2)} (${data.tolerances.keyWidthTol})`);
      rows.push(`Chieu cao then: h = ${data.h.toFixed(2)} (${data.tolerances.keyHeightTol})`);
      rows.push(`Chieu sau ranh truc: t1 = ${data.t1.toFixed(2)} (${data.tolerances.depthTolShaft})`);
      rows.push(`Chieu sau ranh moay-o: t2 = ${data.t2.toFixed(2)} (${data.tolerances.depthTolHub})`);
      rows.push(`Chieu dai then: L = ${data.chosenL.toFixed(2)}`);
      rows.push(`Chieu dai lam viec: Lf = ${data.Lf_formA.toFixed(2)}`);
    } else if (jointType === 'woodruff') {
      rows.push(`Duong kinh truc: d = ${data.d.toFixed(2)}`);
      rows.push(`Chieu rong then: b = ${data.b.toFixed(2)}`);
      rows.push(`Chieu cao then: h = ${data.h.toFixed(2)}`);
      rows.push(`Duong kinh dia: Dk = ${data.Dk.toFixed(2)}`);
      rows.push(`Chieu sau ranh truc: t = ${data.t1.toFixed(2)}`);
      rows.push(`Chieu dai danh nghia: L = ${data.L.toFixed(2)}`);
    } else if (jointType === 'spline') {
      rows.push(`So then (rang): n = ${data.n}`);
      rows.push(`Duong kinh ngoai: D = ${data.D.toFixed(2)}`);
      rows.push(`Duong kinh trong: d = ${data.d.toFixed(2)}`);
      rows.push(`Chieu rong then: b = ${data.b.toFixed(2)}`);
      rows.push(`Vat mep: s = ${data.s.toFixed(2)}`);
      rows.push(`Chieu dai then hoa: L = ${data.chosenL.toFixed(2)}`);
    }

    for (let i = 0; i < rows.length; i++) {
      d += this.dxfText(startX, startY - i * lineH, txtSize, rows[i], 'MFG_TABLE');
    }

    return d;
  }
};
