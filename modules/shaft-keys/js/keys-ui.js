/**
 * UI CONTROLLER: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Connects DOM inputs, KeysCalc engine, 2D Canvas & DXF Exporter
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new KeysCanvas('keysCanvas');

  // State
  const state = {
    units: 'metric',
    jointType: 'parallel', // 'parallel', 'woodruff', 'spline'
    sectionType: 'cross',  // 'cross', 'long'
    fitClass: 'normal',
    // Parallel
    keyTypeIndex: 5,       // DIN 6885 Blatt 1
    parallelDiam: 40.0,
    parallelNumKeys: 1,
    parallelLength: 56.0,
    // Woodruff
    woodruffTypeIndex: 2,  // DIN 6888 A
    woodruffDiam: 25.0,
    woodruffKeyIndex: 5,
    woodruffNumKeys: 1,
    // Spline
    splineTypeIndex: 4,    // ISO 14 Medium
    splineSizeIndex: 4,
    splineLength: 60.0
  };

  // Init dropdowns
  initTypeDropdowns();
  bindEvents();
  updateCalculation();

  function initTypeDropdowns() {
    // 1. Parallel keys standards
    const selParallelType = document.getElementById('selParallelType');
    if (selParallelType) {
      selParallelType.innerHTML = '';
      KEYS_DATABASE.T_Key1_Name.forEach((meta, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = meta[0];
        if (idx === state.keyTypeIndex) opt.selected = true;
        selParallelType.appendChild(opt);
      });
    }

    // 2. Woodruff keys standards
    const selWoodruffType = document.getElementById('selWoodruffType');
    if (selWoodruffType) {
      selWoodruffType.innerHTML = '';
      KEYS_DATABASE.T_Key2_Name.forEach((meta, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = meta[0];
        if (idx === state.woodruffTypeIndex) opt.selected = true;
        selWoodruffType.appendChild(opt);
      });
    }

    // 3. Splines standards
    const selSplineType = document.getElementById('selSplineType');
    if (selSplineType) {
      selSplineType.innerHTML = '';
      KEYS_DATABASE.T_spl1_Name.forEach((meta, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = meta[0];
        if (idx === state.splineTypeIndex) opt.selected = true;
        selSplineType.appendChild(opt);
      });
    }
  }

  function bindEvents() {
    // Subsystem tabs
    document.querySelectorAll('.joint-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.joint-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.jointType = btn.dataset.type;

        // Toggle visibility of input sections
        document.getElementById('secParallelInputs').style.display = state.jointType === 'parallel' ? 'block' : 'none';
        document.getElementById('secWoodruffInputs').style.display = state.jointType === 'woodruff' ? 'block' : 'none';
        document.getElementById('secSplineInputs').style.display = state.jointType === 'spline' ? 'block' : 'none';

        // Toggle results tables
        document.getElementById('secParallelResults').style.display = state.jointType === 'parallel' ? 'block' : 'none';
        document.getElementById('secWoodruffResults').style.display = state.jointType === 'woodruff' ? 'block' : 'none';
        document.getElementById('secSplineResults').style.display = state.jointType === 'spline' ? 'block' : 'none';

        updateCalculation();
      });
    });

    // Units toggle
    const selUnits = document.getElementById('selUnits');
    if (selUnits) {
      selUnits.addEventListener('change', (e) => {
        state.units = e.target.value;
        const isM = state.units === 'metric';
        state.parallelDiam = isM ? 40.0 : 1.5;
        state.woodruffDiam = isM ? 25.0 : 1.0;
        document.getElementById('txtParallelDiam').value = state.parallelDiam;
        document.getElementById('txtWoodruffDiam').value = state.woodruffDiam;
        document.querySelectorAll('.unit-dim').forEach(el => el.textContent = isM ? 'mm' : 'in');
        updateCalculation();
      });
    }

    // Parallel Key controls
    document.getElementById('selParallelType').addEventListener('change', (e) => {
      state.keyTypeIndex = parseInt(e.target.value, 10);
      updateCalculation();
    });

    document.getElementById('txtParallelDiam').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(v) && v > 0) {
        state.parallelDiam = v;
        updateCalculation();
      }
    });

    document.getElementById('selParallelNumKeys').addEventListener('change', (e) => {
      state.parallelNumKeys = parseInt(e.target.value, 10);
      updateCalculation();
    });

    document.getElementById('txtParallelLength').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(v) && v > 0) {
        state.parallelLength = v;
        updateCalculation();
      }
    });

    document.getElementById('selFitClass').addEventListener('change', (e) => {
      state.fitClass = e.target.value;
      updateCalculation();
    });

    // Woodruff Key controls
    document.getElementById('selWoodruffType').addEventListener('change', (e) => {
      state.woodruffTypeIndex = parseInt(e.target.value, 10);
      updateCalculation();
    });

    document.getElementById('txtWoodruffDiam').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(v) && v > 0) {
        state.woodruffDiam = v;
        updateCalculation();
      }
    });

    document.getElementById('selWoodruffKey').addEventListener('change', (e) => {
      state.woodruffKeyIndex = parseInt(e.target.value, 10);
      updateCalculation();
    });

    // Spline controls
    document.getElementById('selSplineType').addEventListener('change', (e) => {
      state.splineTypeIndex = parseInt(e.target.value, 10);
      updateCalculation();
    });

    document.getElementById('selSplineSize').addEventListener('change', (e) => {
      state.splineSizeIndex = parseInt(e.target.value, 10);
      updateCalculation();
    });

    document.getElementById('txtSplineLength').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value.replace(',', '.'));
      if (!isNaN(v) && v > 0) {
        state.splineLength = v;
        updateCalculation();
      }
    });

    // View toggles
    document.getElementById('btnCrossSection').addEventListener('click', () => {
      state.sectionType = 'cross';
      document.getElementById('btnCrossSection').classList.add('active');
      document.getElementById('btnLongSection').classList.remove('active');
      canvas.setSectionType('cross');
    });

    document.getElementById('btnLongSection').addEventListener('click', () => {
      state.sectionType = 'long';
      document.getElementById('btnLongSection').classList.add('active');
      document.getElementById('btnCrossSection').classList.remove('active');
      canvas.setSectionType('long');
    });

    document.getElementById('btnZoomIn').addEventListener('click', () => canvas.zoom(1.2));
    document.getElementById('btnZoomOut').addEventListener('click', () => canvas.zoom(0.8));
    document.getElementById('btnResetView').addEventListener('click', () => canvas.resetView());
    document.getElementById('btnDownloadPNG').addEventListener('click', () => canvas.downloadImage());

    document.getElementById('btnExportDXF').addEventListener('click', () => {
      let data = null;
      if (state.jointType === 'parallel') {
        data = KeysCalc.calculateParallelKey({
          units: state.units,
          keyTypeIndex: state.keyTypeIndex,
          numKeys: state.parallelNumKeys,
          shaftDiam: state.parallelDiam,
          chosenLength: state.parallelLength,
          fitClass: state.fitClass
        });
      } else if (state.jointType === 'woodruff') {
        data = KeysCalc.calculateWoodruffKey({
          units: state.units,
          woodruffTypeIndex: state.woodruffTypeIndex,
          numKeys: state.woodruffNumKeys,
          shaftDiam: state.woodruffDiam,
          keySizeIndex: state.woodruffKeyIndex
        });
      } else {
        data = KeysCalc.calculateStraightSpline({
          units: state.units,
          splineTypeIndex: state.splineTypeIndex,
          splineSizeIndex: state.splineSizeIndex,
          chosenLength: state.splineLength
        });
      }
      KeysDXF.exportDXF(state.jointType, data, state.sectionType);
    });

    // Accordion global controls
    document.getElementById('btnExpandAll').addEventListener('click', () => {
      document.querySelectorAll('.calc-section').forEach(s => s.classList.remove('collapsed'));
    });
    document.getElementById('btnCollapseAll').addEventListener('click', () => {
      document.querySelectorAll('.calc-section').forEach(s => s.classList.add('collapsed'));
    });

    // Accordion click toggle
    document.querySelectorAll('.section-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const sec = hdr.closest('.calc-section');
        if (sec) sec.classList.toggle('collapsed');
      });
    });
  }

  function updateCalculation() {
    let currentData = null;

    if (state.jointType === 'parallel') {
      const res = KeysCalc.calculateParallelKey({
        units: state.units,
        keyTypeIndex: state.keyTypeIndex,
        numKeys: state.parallelNumKeys,
        shaftDiam: state.parallelDiam,
        chosenLength: state.parallelLength,
        fitClass: state.fitClass
      });
      currentData = res;

      // Update DOM
      document.getElementById('outParallelKeyName').textContent = res.keyName;
      document.getElementById('outParallelB').textContent = res.b.toFixed(2);
      document.getElementById('outParallelH').textContent = res.h.toFixed(2);
      document.getElementById('outParallelT1').textContent = res.t1.toFixed(2);
      document.getElementById('outParallelT2').textContent = res.t2.toFixed(2);
      document.getElementById('outParallelD1').textContent = res.d1.toFixed(2);
      document.getElementById('outParallelD2').textContent = res.d2.toFixed(2);
      document.getElementById('outParallelRange').textContent = `${res.Lmin_tab.toFixed(1)} ~ ${res.Lmax_tab.toFixed(1)}`;
      document.getElementById('outParallelLf').textContent = res.Lf_formA.toFixed(2);

      // Tolerances
      document.getElementById('outTolWidth').textContent = res.tolerances.keyWidthTol;
      document.getElementById('outTolHeight').textContent = res.tolerances.keyHeightTol;
      document.getElementById('outTolShaft').textContent = res.tolerances.shaftKeywayTol;
      document.getElementById('outTolHub').textContent = res.tolerances.hubKeywayTol;

      // Summary banner
      document.getElementById('sumJointType').textContent = 'Then Bằng (Parallel Key)';
      document.getElementById('sumStandard').textContent = res.typeName.split('...')[1]?.trim() || res.typeName;
      document.getElementById('sumDimensions').textContent = `${res.b.toFixed(1)} x ${res.h.toFixed(1)} x ${res.chosenL.toFixed(1)}`;
      document.getElementById('sumShaftDiam').textContent = `${res.d.toFixed(1)} mm`;

    } else if (state.jointType === 'woodruff') {
      const res = KeysCalc.calculateWoodruffKey({
        units: state.units,
        woodruffTypeIndex: state.woodruffTypeIndex,
        numKeys: state.woodruffNumKeys,
        shaftDiam: state.woodruffDiam,
        keySizeIndex: state.woodruffKeyIndex
      });
      currentData = res;

      // Populate woodruff key selector
      const selW = document.getElementById('selWoodruffKey');
      if (selW && selW.options.length !== res.allKeys.length) {
        selW.innerHTML = '';
        res.allKeys.forEach(k => {
          const opt = document.createElement('option');
          opt.value = k.index;
          opt.textContent = `${k.name} (b=${k.b.toFixed(1)}, h=${k.h.toFixed(1)})`;
          if (k.index === res.rowIndex) opt.selected = true;
          selW.appendChild(opt);
        });
      }

      // Update DOM
      document.getElementById('outWoodruffKeyName').textContent = res.keyName;
      document.getElementById('outWoodruffB').textContent = res.b.toFixed(2);
      document.getElementById('outWoodruffH').textContent = res.h.toFixed(2);
      document.getElementById('outWoodruffDk').textContent = res.Dk.toFixed(2);
      document.getElementById('outWoodruffL').textContent = res.L.toFixed(2);
      document.getElementById('outWoodruffT1').textContent = res.t1.toFixed(2);
      document.getElementById('outWoodruffD1').textContent = res.d1.toFixed(2);
      document.getElementById('outWoodruffAreaS').textContent = res.areaShaft.toFixed(1);
      document.getElementById('outWoodruffAreaH').textContent = res.areaHub.toFixed(1);

      // Summary
      document.getElementById('sumJointType').textContent = 'Then Bán Nguyệt (Woodruff)';
      document.getElementById('sumStandard').textContent = res.typeName.split('...')[1]?.trim() || res.typeName;
      document.getElementById('sumDimensions').textContent = `${res.b.toFixed(1)} x ${res.h.toFixed(1)} (Ø${res.Dk.toFixed(1)})`;
      document.getElementById('sumShaftDiam').textContent = `${res.d.toFixed(1)} mm`;

    } else if (state.jointType === 'spline') {
      const res = KeysCalc.calculateStraightSpline({
        units: state.units,
        splineTypeIndex: state.splineTypeIndex,
        splineSizeIndex: state.splineSizeIndex,
        chosenLength: state.splineLength
      });
      currentData = res;

      // Populate spline size selector
      const selS = document.getElementById('selSplineSize');
      if (selS && selS.options.length !== res.allSplines.length) {
        selS.innerHTML = '';
        res.allSplines.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.index;
          opt.textContent = `${s.name} (${s.n} then, D=${s.D.toFixed(1)}, d=${s.d.toFixed(1)})`;
          if (s.index === res.splineSizeIdx) opt.selected = true;
          selS.appendChild(opt);
        });
      }

      // Update DOM
      document.getElementById('outSplineName').textContent = res.splineName;
      document.getElementById('outSplineN').textContent = res.n;
      document.getElementById('outSplineD').textContent = res.D.toFixed(2);
      document.getElementById('outSplined').textContent = res.d.toFixed(2);
      document.getElementById('outSplineB').textContent = res.b.toFixed(2);
      document.getElementById('outSplineS').textContent = res.s.toFixed(2);
      document.getElementById('outSplineH').textContent = res.h.toFixed(2);
      document.getElementById('outSplineDm').textContent = res.dm.toFixed(2);
      document.getElementById('outSplineSlot').textContent = res.slotWidth.toFixed(2);

      document.getElementById('outSplineCentering').textContent = res.tolerances.centeringType;
      document.getElementById('outSplineMinorFit').textContent = res.tolerances.minorDiameterFit;
      document.getElementById('outSplineWidthFit').textContent = res.tolerances.widthFit;

      // Summary
      document.getElementById('sumJointType').textContent = 'Then Hoa Chữ Nhật (Spline)';
      document.getElementById('sumStandard').textContent = res.typeName.split('...')[1]?.trim() || res.typeName;
      document.getElementById('sumDimensions').textContent = `${res.n} then | ${res.D.toFixed(1)}x${res.d.toFixed(1)}x${res.b.toFixed(1)}`;
      document.getElementById('sumShaftDiam').textContent = `D = ${res.D.toFixed(1)} mm`;
    }

    // Update Section 10: Comparative table
    const comp = KeysCalc.getComparativeTable(
      state.jointType === 'parallel' ? state.parallelDiam : (state.jointType === 'woodruff' ? state.woodruffDiam : 40.0),
      state.jointType === 'parallel' ? state.parallelLength : 50.0,
      state.units === 'metric'
    );
    document.getElementById('compPKName').textContent = comp.parallelKey.name;
    document.getElementById('compPKDim').textContent = comp.parallelKey.dimensions;
    document.getElementById('compPKD1').textContent = comp.parallelKey.d1;

    document.getElementById('compWKName').textContent = comp.woodruffKey.name;
    document.getElementById('compWKDim').textContent = comp.woodruffKey.dimensions;
    document.getElementById('compWKD1').textContent = comp.woodruffKey.d1;

    document.getElementById('compSSName').textContent = comp.straightSpline.name;
    document.getElementById('compSSDim').textContent = comp.straightSpline.dimensions;
    document.getElementById('compSSD1').textContent = comp.straightSpline.d1;

    // Send data to Canvas
    canvas.setData(state.jointType, currentData);
  }
});
