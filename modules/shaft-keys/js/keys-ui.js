/**
 * UI CONTROLLER: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Connects DOM inputs, KeysCalc engine & 3-View Canvas CAD
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new KeysCanvas('keysCanvas');

  // State
  const state = {
    units: 'metric',
    jointType: 'parallel', // 'parallel', 'woodruff', 'spline'
    fitClass: 'normal',
    // Parallel: Default is (1)F ... DIN 6885: Blatt 1 (index 5)
    keyTypeIndex: 5,
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

  function updateSelectColor() {
    const sel = document.getElementById('selParallelType');
    if (!sel) return;
    const val = parseInt(sel.value, 10);
    if ([5, 3, 10].includes(val)) {
      sel.style.color = '#059669'; // Ưu tiên cao: Màu xanh lá đậm
      sel.style.fontWeight = 'bold';
    } else if (val === 4) {
      sel.style.color = '#d97706'; // Then mỏng ISO 2491: Màu vàng/cam
      sel.style.fontWeight = 'bold';
    } else {
      sel.style.color = '#111827';
      sel.style.fontWeight = '600';
    }
  }

  // Init dropdowns
  initTypeDropdowns();
  bindEvents();
  updateCalculation();

  function initTypeDropdowns() {
    // 1. Parallel keys standards: Phân nhóm 1-4, đánh số (1) đến (11), tô màu ưu tiên
    const selParallelType = document.getElementById('selParallelType');
    if (selParallelType) {
      selParallelType.innerHTML = '';

      // Định nghĩa 4 nhóm chuẩn hóa theo yêu cầu người dùng
      const groups = [
        {
          label: 'Nhóm 1: Hệ Mét Châu Âu & Quốc Tế (Chế độ ưu tiên)',
          items: [
            { text: '(1)F ... DIN 6885: Blatt 1', val: 5, color: '#10b981', isDefault: true },
            { text: '(2)D ... ISO R773', val: 3, color: '#10b981' },
            { text: '(3)K ... CSN 022562', val: 10, color: '#10b981' },
            { text: '(4)E ... ISO 2491', val: 4, color: '#f59e0b' } // Màu vàng: Then mỏng
          ]
        },
        {
          label: 'Nhóm 2: Hệ Inch Hoa Kỳ (ANSI B17.1)',
          items: [
            { text: '(5)A ... ANSI B17.1 (Preferred)', val: 0, color: '#94a3b8' },
            { text: '(6)B ... ANSI B17.1 (Square)', val: 1, color: '#94a3b8' },
            { text: '(7)C ... ANSI B17.1 (Rectangular)', val: 2, color: '#94a3b8' }
          ]
        },
        {
          label: 'Nhóm 3: Tiêu chuẩn Nhật Bản (JIS)',
          items: [
            { text: '(8)J ... JIS B 1301 (B)', val: 9, color: '#94a3b8' }
          ]
        },
        {
          label: 'Nhóm 4: Tiêu chuẩn Anh (British Standard)',
          items: [
            { text: '(9)G ... BS 46: Part 1 (Square)', val: 6, color: '#94a3b8' },
            { text: '(10)H ... BS 46: Part 1 (Rectangular)', val: 7, color: '#94a3b8' },
            { text: '(11)I ... BS 4235: Part 1', val: 8, color: '#94a3b8' }
          ]
        }
      ];

      groups.forEach(grp => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = grp.label;
        grp.items.forEach(it => {
          const opt = document.createElement('option');
          opt.value = it.val;
          opt.textContent = it.text;
          opt.style.color = it.color;
          opt.style.fontWeight = 'bold';
          if (it.val === state.keyTypeIndex) opt.selected = true;
          optgroup.appendChild(opt);
        });
        selParallelType.appendChild(optgroup);
      });
      updateSelectColor();
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
      btn.addEventListener('click', () => {
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
      updateSelectColor();
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



    document.getElementById('btnZoomIn').addEventListener('click', () => canvas.zoom(1.2));
    document.getElementById('btnZoomOut').addEventListener('click', () => canvas.zoom(0.8));
    document.getElementById('btnResetView').addEventListener('click', () => canvas.resetView());
    document.getElementById('btnDownloadPNG').addEventListener('click', () => canvas.downloadImage());

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
      document.getElementById('sumJointType').textContent = `Then Bằng (${res.numKeys} then)`;
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

    // Send data to Canvas
    canvas.setData(state.jointType, currentData);
  }
});
