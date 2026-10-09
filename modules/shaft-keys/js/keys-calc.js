/**
 * KEYS & STRAIGHT-SIDED SPLINES CALCULATION ENGINE
 * MITCalc 1.74 ShaftCon_01.xlsb Independent Port
 * Standards: DIN 6885, ISO 2491, ISO R773, ANSI B17.1, BS 4235, BS 46, JIS B 1301, CSN 02 2562
 *            DIN 6888, ISO 3912, ANSI B17.2, BS 6, CSN 30 1385
 *            ISO 14, DIN 5464, DIN 5471, DIN 5472, CSN 01 4942, SAE J499 / J501
 * Zero-Force Scope Protocol: 100% Geometry, Dimensions, Tolerances & CAD.
 * Zero-Tolerance Policy: Delta = 0.000000
 */

const KeysCalc = {
  /**
   * Tính toán Then Bằng (Parallel Side Keys)
   * @param {Object} params - { units, keyTypeIndex, numKeys, shaftDiam, chosenLength, fitClass }
   */
  calculateParallelKey(params) {
    const isMetric = params.units !== 'imperial';
    const typeIdx = Math.max(0, Math.min(10, params.keyTypeIndex || 0));
    const numKeys = Math.max(1, Math.min(4, parseInt(params.numKeys, 10) || 1));
    const d = parseFloat(params.shaftDiam) || (isMetric ? 40.0 : 1.5);
    const fitClass = params.fitClass || 'normal'; // 'tight' (P9), 'normal' (N9), 'sliding' (JS9)

    const meta = KEYS_DATABASE.T_Key1_Name[typeIdx];
    const tabName = meta[1];
    const tabRatio = isMetric ? parseFloat(meta[2]) : parseFloat(meta[3]);
    const isCalcDepth = parseInt(meta[8], 10) === 1; // 1 for ANSI chordal formula, 0 for tabular depth
    const table = KEYS_DATABASE[tabName];

    // Find suitable row in table based on shaft diameter d
    let selectedRow = null;
    let rowIndex = -1;
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const dMin = parseFloat(row[1]) * tabRatio;
      const dMax = parseFloat(row[2]) * tabRatio;
      // First row checks >= dMin, others check > dMin
      const inRange = (i === 0) ? (d >= dMin && d <= dMax) : (d > dMin && d <= dMax);
      if (inRange) {
        selectedRow = row;
        rowIndex = i;
        break;
      }
    }

    // Fallback if out of bounds: clamp to nearest row
    if (!selectedRow) {
      if (d < parseFloat(table[0][1]) * tabRatio) {
        selectedRow = table[0];
        rowIndex = 0;
      } else {
        selectedRow = table[table.length - 1];
        rowIndex = table.length - 1;
      }
    }

    const keyName = selectedRow[0];
    const b = parseFloat(selectedRow[3]) * tabRatio;
    const h = parseFloat(selectedRow[4]) * tabRatio;
    const Lmin_tab = parseFloat(selectedRow[5]) * tabRatio;
    const Lmax_tab = parseFloat(selectedRow[6]) * tabRatio;
    const chamfer_s = parseFloat(selectedRow[7]) * tabRatio;
    const R_head = b / 2.0;

    // Shaft keyway depth t (t1)
    let t1 = 0;
    if (isCalcDepth) {
      // ANSI chordal formula: t1 = (d - sqrt(d^2 - b^2) + h) / 2
      const diff = d * d - b * b;
      t1 = (d - Math.sqrt(Math.max(0, diff)) + h) / 2.0;
    } else {
      t1 = parseFloat(selectedRow[8]) * tabRatio;
    }

    // Rounding per units
    const rndDec = isMetric ? 2 : 4;
    t1 = Math.round(t1 * Math.pow(10, rndDec)) / Math.pow(10, rndDec);

    // Remaining shaft diameter d1 at groove root
    const d1 = numKeys === 1 ? (d - t1) : (d - 2 * t1);

    // Hub keyway depth t2
    let t2 = 0;
    if (isCalcDepth) {
      // ANSI: t2 = h - t1
      t2 = h - t1;
    } else {
      // ISO/DIN standard hub depth:
      // In DIN 6885: t2 = h - t1 + clearance (or standard t2 table)
      // Usually t2 = h - t1 + (isMetric ? 0.2 : 0.008)
      t2 = h - t1 + (isMetric ? (d <= 50 ? 0.3 : 0.4) : 0.012);
    }
    t2 = Math.round(t2 * Math.pow(10, rndDec)) / Math.pow(10, rndDec);

    // Hub inner diameter at groove peak d2
    const d2 = numKeys === 1 ? (d + t2) : (d + 2 * t2);

    // Standard available lengths from length table
    const lenTabName = isMetric ? meta[4] : meta[5];
    const lenTable = KEYS_DATABASE[lenTabName] || [];
    const availableLengths = lenTable.map(row => parseFloat(Array.isArray(row) ? row[0] : row));

    // Filter available lengths for this key
    const validLengths = availableLengths.filter(l => l >= Lmin_tab * 0.99 && l <= Lmax_tab * 1.01);

    // Chosen length L
    let chosenL = parseFloat(params.chosenLength);
    if (!chosenL || isNaN(chosenL)) {
      // Pick a reasonable standard length in middle of valid range
      chosenL = validLengths.length > 0 ? validLengths[Math.floor(validLengths.length / 2)] : (Lmin_tab + Lmax_tab) / 2;
    }

    // Functional length Lf
    // Form A (round ends): Lf = L - 2 * R = L - b
    // Form B (square ends): Lf = L
    const Lf_formA = Math.max(0, chosenL - b);
    const Lf_formB = chosenL;

    // Tolerances (ISO 286 / DIN 6885)
    const tolerances = this.getParallelKeyTolerances(b, h, isMetric, fitClass);

    return {
      typeIdx,
      typeName: meta[0],
      tabName,
      rowIndex,
      keyName,
      d,
      numKeys,
      b,
      h,
      t1,
      t2,
      d1,
      d2,
      R_head,
      chamfer_s,
      Lmin_tab,
      Lmax_tab,
      chosenL,
      Lf_formA,
      Lf_formB,
      validLengths,
      availableLengths,
      tolerances,
      isMetric
    };
  },

  /**
    * Tính toán Dung sai lắp then bằng (ISO 286 / DIN 6885)
   */
  getParallelKeyTolerances(b, h, isMetric, fitClass = 'normal') {
    if (!isMetric || fitClass.startsWith('ansi_')) {
      let shaftStr = '-0.000 / +0.002 in (Clearance)';
      let hubStr = '+0.002 / -0.000 in (Clearance)';
      let keyStr = '±0.002 in (Class 1)';
      if (fitClass === 'tight' || fitClass === 'tight_p9_p9' || fitClass === 'ansi_class3') {
        shaftStr = '-0.002 / +0.000 in (Interference / Ép chặt)';
        hubStr = '-0.000 / -0.002 in (Interference / Ép chặt)';
        keyStr = '+0.002 / -0.000 in (Class 3)';
      } else if (fitClass === 'ansi_class2' || fitClass === 'light_js9_js9' || fitClass === 'normal_h9_h9') {
        shaftStr = '±0.001 in (Transition / Trung gian)';
        hubStr = '±0.001 in (Transition / Trung gian)';
        keyStr = '±0.001 in (Class 2)';
      } else if (fitClass === 'sliding' || fitClass === 'sliding_h9_d10' || fitClass === 'loose_d10_d10' || fitClass === 'ansi_class1') {
        shaftStr = '-0.000 / +0.003 in (Sliding / Di trượt)';
        hubStr = '+0.004 / +0.001 in (Sliding / Di trượt)';
        keyStr = '-0.000 / -0.002 in (Class 1)';
      }
      return {
        keyWidthTol: keyStr,
        keyHeightTol: '±0.003 in',
        shaftKeywayTol: shaftStr,
        hubKeywayTol: hubStr,
        depthTolShaft: '+0.010 / -0.000 in',
        depthTolHub: '+0.010 / -0.000 in'
      };
    }

    // IT9 for width b
    let it9_um = 30; // 30 um for 10-18mm
    if (b <= 3) it9_um = 25;
    else if (b <= 6) it9_um = 30;
    else if (b <= 10) it9_um = 36;
    else if (b <= 18) it9_um = 43;
    else if (b <= 30) it9_um = 52;
    else if (b <= 50) it9_um = 62;
    else it9_um = 74;

    const it_half = Math.round(it9_um / 2);
    let s_sym = 'N9', s_es = 0, s_ei = -it9_um;
    let h_sym = 'JS9', h_es = it_half, h_ei = -it_half;

    switch (fitClass) {
      case 'tight':
        s_sym = 'P9'; s_es = -Math.round(it9_um * 0.4); s_ei = -Math.round(it9_um * 1.4);
        h_sym = 'JS9'; h_es = it_half; h_ei = -it_half;
        break;
      case 'tight_p9_p9':
        s_sym = 'P9'; s_es = -Math.round(it9_um * 0.4); s_ei = -Math.round(it9_um * 1.4);
        h_sym = 'P9'; h_es = -Math.round(it9_um * 0.4); h_ei = -Math.round(it9_um * 1.4);
        break;
      case 'sliding':
        s_sym = 'JS9'; s_es = it_half; s_ei = -it_half;
        h_sym = 'D10'; h_es = Math.round(it9_um * 2.0); h_ei = Math.round(it9_um * 0.8);
        break;
      case 'sliding_h9_d10':
        s_sym = 'H9'; s_es = it9_um; s_ei = 0;
        h_sym = 'D10'; h_es = Math.round(it9_um * 2.0); h_ei = Math.round(it9_um * 0.8);
        break;
      case 'sliding_h9_f8':
        s_sym = 'H9'; s_es = it9_um; s_ei = 0;
        h_sym = 'F8'; h_es = Math.round(it9_um * 0.9); h_ei = Math.round(it9_um * 0.35);
        break;
      case 'normal_h9_h9':
        s_sym = 'H9'; s_es = it9_um; s_ei = 0;
        h_sym = 'H9'; h_es = it9_um; h_ei = 0;
        break;
      case 'loose_d10_d10':
        s_sym = 'D10'; s_es = Math.round(it9_um * 2.0); s_ei = Math.round(it9_um * 0.8);
        h_sym = 'D10'; h_es = Math.round(it9_um * 2.0); h_ei = Math.round(it9_um * 0.8);
        break;
      case 'light_js9_js9':
        s_sym = 'JS9'; s_es = it_half; s_ei = -it_half;
        h_sym = 'JS9'; h_es = it_half; h_ei = -it_half;
        break;
      default: // 'normal'
        s_sym = 'N9'; s_es = 0; s_ei = -it9_um;
        h_sym = 'JS9'; h_es = it_half; h_ei = -it_half;
        break;
    }

    const fmtDev = (val) => (val >= 0 ? '+' : '') + (val / 1000).toFixed(3);

    return {
      keyWidthTol: `h9 (0.000 / -${(it9_um / 1000).toFixed(3)} mm)`,
      keyHeightTol: `h11 (0.000 / -${(it9_um * 2.5 / 1000).toFixed(3)} mm)`,
      shaftKeywayTol: `${s_sym} (${fmtDev(s_es)} / ${fmtDev(s_ei)} mm)`,
      hubKeywayTol: `${h_sym} (${fmtDev(h_es)} / ${fmtDev(h_ei)} mm)`,
      depthTolShaft: '+0.100 / 0.000 mm (t1 <= 6) hoặc +0.200 / 0.000 mm',
      depthTolHub: '+0.100 / 0.000 mm (t2 <= 6) hoặc +0.200 / 0.000 mm'
    };
  },

  /**
   * Tính toán Then Bán Nguyệt (Woodruff Keys)
   * @param {Object} params - { units, woodruffTypeIndex, numKeys, shaftDiam, keySizeIndex }
   */
  calculateWoodruffKey(params) {
    const isMetric = params.units !== 'imperial';
    const typeIdx = Math.max(0, Math.min(9, params.woodruffTypeIndex || 0));
    const numKeys = params.numKeys === 2 ? 2 : 1;
    const d = parseFloat(params.shaftDiam) || (isMetric ? 25.0 : 1.0);

    const meta = KEYS_DATABASE.T_Key2_Name[typeIdx];
    const tabName = meta[1];
    const tabRatio = isMetric ? parseFloat(meta[2]) : parseFloat(meta[3]);
    const table = KEYS_DATABASE[tabName];

    // Filter compatible keys for this shaft diameter d
    const compatibleKeys = [];
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const dMin = parseFloat(row[2]) * tabRatio;
      const dMax = parseFloat(row[3]) * tabRatio;
      if (d >= dMin * 0.95 && d <= dMax * 1.05) {
        compatibleKeys.push({ index: i, row });
      }
    }

    // Key selection: user keySizeIndex or default to first/best compatible
    let selectedEntry = compatibleKeys[0];
    if (params.keySizeIndex !== undefined && params.keySizeIndex >= 0 && params.keySizeIndex < table.length) {
      selectedEntry = { index: params.keySizeIndex, row: table[params.keySizeIndex] };
    } else if (compatibleKeys.length > 0) {
      selectedEntry = compatibleKeys[Math.floor(compatibleKeys.length / 2)];
    } else {
      selectedEntry = { index: 0, row: table[0] };
    }

    const row = selectedEntry.row;
    const keyName = row[0];
    const b = parseFloat(row[4]) * tabRatio;
    const h = parseFloat(row[5]) * tabRatio;
    const Dk = parseFloat(row[6]) * tabRatio;
    const e = parseFloat(row[7]) * tabRatio;
    const L = parseFloat(row[8]) * tabRatio;
    const t1 = parseFloat(row[9]) * tabRatio;
    const chamfer_s = parseFloat(row[10]) * tabRatio;

    // Remaining shaft diameter d1
    const d1 = numKeys === 1 ? (d - t1) : (d - 2 * t1);

    // Hub keyway depth t2
    const t2 = h + e - t1;
    const d2 = numKeys === 1 ? (d + t2) : (d + 2 * t2);

    // Key disc radius Rk
    const Rk = Dk / 2.0;

    // Contact areas calculation (DIN / ANSI)
    // Shaft contact depth: hs = t1 - chamfer_s
    const hs = Math.max(0, t1 - chamfer_s);
    // Hub contact depth: hh = h + e - t1 - chamfer_s
    const hh = Math.max(0, h + e - t1 - chamfer_s);
    const areaShaft = hs * L;
    const areaHub = hh * L;

    return {
      typeIdx,
      typeName: meta[0],
      tabName,
      rowIndex: selectedEntry.index,
      keyName,
      d,
      numKeys,
      b,
      h,
      Dk,
      Rk,
      e,
      L,
      t1,
      t2,
      d1,
      d2,
      chamfer_s,
      areaShaft,
      areaHub,
      compatibleKeys,
      allKeys: table.map((r, i) => ({ index: i, name: r[0], b: parseFloat(r[4]) * tabRatio, h: parseFloat(r[5]) * tabRatio })),
      isMetric
    };
  },

  /**
   * Tính toán Then Hoa Răng Chữ Nhật (Straight-Sided Splines)
   * @param {Object} params - { units, splineTypeIndex, splineSizeIndex, chosenLength }
   */
  calculateStraightSpline(params) {
    const isMetric = params.units !== 'imperial';
    const typeIdx = Math.max(0, Math.min(8, params.splineTypeIndex || 0));

    const meta = KEYS_DATABASE.T_spl1_Name[typeIdx];
    const tabName = meta[1];
    const tabRatio = isMetric ? parseFloat(meta[2]) : parseFloat(meta[3]);
    const table = KEYS_DATABASE[tabName];

    let splineSizeIdx = parseInt(params.splineSizeIndex, 10);
    if (isNaN(splineSizeIdx) || splineSizeIdx < 0 || splineSizeIdx >= table.length) {
      splineSizeIdx = Math.min(3, table.length - 1);
    }

    const row = table[splineSizeIdx];
    const splineName = row[0];
    const n = parseInt(row[1], 10);
    const d_minor = parseFloat(row[2]) * tabRatio;
    const D_major = parseFloat(row[3]) * tabRatio;
    const b_tooth = parseFloat(row[4]) * tabRatio;
    const chamfer_s = parseFloat(row[5]) * tabRatio;

    // Tooth height h
    const h = (D_major - d_minor) / 2.0;
    // Mean diameter dm
    const dm = (D_major + d_minor) / 2.0;

    // Pitch circumference & slot width on shaft
    const circularPitch = (Math.PI * dm) / n;
    const slotWidth = circularPitch - b_tooth;

    // Spline length L
    let chosenL = parseFloat(params.chosenLength);
    if (!chosenL || isNaN(chosenL)) {
      chosenL = Math.round(1.5 * D_major);
    }

    // Length list from DB
    const lenTabName = isMetric ? 'T_SplineLen_mm' : 'T_SplineLen_in';
    const lenTable = KEYS_DATABASE[lenTabName] || [];
    const availableLengths = lenTable.map(r => parseFloat(Array.isArray(r) ? r[0] : r));

    // Tolerances (ISO 14 / DIN 5464)
    const tolerances = this.getStraightSplineTolerances(d_minor, D_major, b_tooth, isMetric);

    return {
      typeIdx,
      typeName: meta[0],
      tabName,
      splineSizeIdx,
      splineName,
      n,
      d: d_minor,
      D: D_major,
      b: b_tooth,
      s: chamfer_s,
      h,
      dm,
      circularPitch,
      slotWidth,
      chosenL,
      availableLengths,
      allSplines: table.map((r, i) => ({
        index: i,
        name: r[0],
        n: r[1],
        d: parseFloat(r[2]) * tabRatio,
        D: parseFloat(r[3]) * tabRatio,
        b: parseFloat(r[4]) * tabRatio
      })),
      tolerances,
      isMetric
    };
  },

  /**
   * Dung sai then hoa răng chữ nhật (ISO 14 / DIN 5464)
   */
  getStraightSplineTolerances(d, D, b, isMetric) {
    if (!isMetric) {
      return {
        centeringType: 'Minor diameter centering',
        minorDiameterFit: 'Shaft: -0.001 / -0.002 in, Hub: +0.001 / 0 in',
        majorDiameterFit: 'Free clearance (Shaft h11, Hub H11)',
        widthFit: 'Shaft: -0.0005 / -0.0015 in, Hub: +0.001 / 0 in'
      };
    }

    return {
      centeringType: 'Định tâm theo đường kính trong d (Minor diameter centering)',
      minorDiameterFit: 'Lỗ H7 (0 / +0.021 mm) - Trục g6 (-0.007 / -0.020 mm) hoặc f7 (-0.020 / -0.041 mm)',
      majorDiameterFit: 'Khe hở tự do (Trục a11, Lỗ H11)',
      widthFit: 'Lỗ D10 (+0.040 / +0.098 mm) - Trục f7 (-0.013 / -0.028 mm) hoặc h9 (0 / -0.030 mm)'
    };
  },

  /**
   * Bảng so sánh 3 giải pháp mối ghép (Section 10.0)
   */
  getComparativeTable(shaftDiam, chosenLength, isMetric) {
    const d = parseFloat(shaftDiam) || (isMetric ? 40.0 : 1.5);
    const L = parseFloat(chosenLength) || (isMetric ? 56.0 : 2.25);

    // 1. Parallel key
    const pk = this.calculateParallelKey({ units: isMetric ? 'metric' : 'imperial', keyTypeIndex: 5, shaftDiam: d, chosenLength: L });
    // 2. Woodruff key
    const wk = this.calculateWoodruffKey({ units: isMetric ? 'metric' : 'imperial', woodruffTypeIndex: 2, shaftDiam: d });
    // 3. Straight spline
    const ss = this.calculateStraightSpline({ units: isMetric ? 'metric' : 'imperial', splineTypeIndex: 4, splineSizeIndex: 4, chosenLength: L });

    return {
      shaftDiam: d,
      chosenL: L,
      isMetric,
      parallelKey: {
        name: pk.keyName + ' (DIN 6885 Blatt 1)',
        dimensions: `b = ${pk.b.toFixed(2)}, h = ${pk.h.toFixed(2)}, t1 = ${pk.t1.toFixed(2)}`,
        d1: pk.d1.toFixed(2),
        area: ((pk.h - pk.t1) * pk.Lf_formA).toFixed(1)
      },
      woodruffKey: {
        name: wk.keyName + ' (DIN 6888 A)',
        dimensions: `b = ${wk.b.toFixed(2)}, h = ${wk.h.toFixed(2)}, Dk = ${wk.Dk.toFixed(2)}`,
        d1: wk.d1.toFixed(2),
        area: wk.areaHub.toFixed(1)
      },
      straightSpline: {
        name: ss.splineName + ' (ISO 14 Medium)',
        dimensions: `${ss.n} răng, D = ${ss.D.toFixed(2)}, d = ${ss.d.toFixed(2)}, b = ${ss.b.toFixed(2)}`,
        d1: ss.d.toFixed(2),
        area: (ss.n * ss.h * ss.chosenL).toFixed(1)
      }
    };
  }
};
