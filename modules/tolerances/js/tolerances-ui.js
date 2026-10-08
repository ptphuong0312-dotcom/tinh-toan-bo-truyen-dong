/**
 * TOLERANCES & FITS UI CONTROLLER
 * Xử lý tương tác giao diện người dùng, đồng bộ tính toán thời gian thực
 */

(function (window) {
    'use strict';

    let visualizer = null;
    let currentISOResult = null;

    function init() {
        // Khởi tạo visualizer
        visualizer = new window.TolerancesVisualizer('toleranceCanvas');

        initTabs();
        initAccordions();
        initISOControls();
        initANSIControls();
        initISO2768Controls();
        initFitDesignControls();
        initSurfaceFinishTable();

        // Tính toán ban đầu
        calculateAll();
    }

    // 1. Unified Toolbar & Canvas Controls
    function initTabs() {
        // Global accordion buttons
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) {
            btnExpandAll.addEventListener('click', () => {
                document.querySelectorAll('.calc-section').forEach(s => s.classList.remove('collapsed'));
            });
        }
        if (btnCollapseAll) {
            btnCollapseAll.addEventListener('click', () => {
                document.querySelectorAll('.calc-section').forEach(s => s.classList.add('collapsed'));
            });
        }

        // Canvas controls
        const btnResetView = document.getElementById('btnResetCanvas');
        if (btnResetView) {
            btnResetView.addEventListener('click', () => {
                if (visualizer) visualizer.resetView();
            });
        }

        const btnZoomIn = document.getElementById('btnZoomInCanvas');
        if (btnZoomIn) {
            btnZoomIn.addEventListener('click', () => {
                if (visualizer) visualizer.zoomIn();
            });
        }

        const btnZoomOut = document.getElementById('btnZoomOutCanvas');
        if (btnZoomOut) {
            btnZoomOut.addEventListener('click', () => {
                if (visualizer) visualizer.zoomOut();
            });
        }

        const btnDownload = document.getElementById('btnDownloadCanvas');
        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                if (visualizer) visualizer.downloadPNG();
            });
        }

        const btnCopy = document.getElementById('btnCopyFitData');
        if (btnCopy) {
            btnCopy.addEventListener('click', copyFitDataToClipboard);
        }
    }

    // 2. Accordion Control
    function initAccordions() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.calc-section');
                if (section) {
                    section.classList.toggle('collapsed');
                }
            });
        });
    }

    // 3. ISO 286 Controls
    function initISOControls() {
        const inpSize = document.getElementById('iso_nominal_size');
        const selSystem = document.getElementById('iso_system');
        const selType = document.getElementById('iso_type');
        const selPrefFit = document.getElementById('iso_preferred_fit');
        const selHoleLetter = document.getElementById('iso_hole_letter');
        const selHoleIT = document.getElementById('iso_hole_it');
        const selShaftLetter = document.getElementById('iso_shaft_letter');
        const selShaftIT = document.getElementById('iso_shaft_it');

        // Populate preferred fits list based on System & Type
        function updatePrefFitsList() {
            if (!selPrefFit || !window.TOLERANCES_DB) return;
            const system = selSystem ? parseInt(selSystem.value) : 1; // 1: Hole, 2: Shaft
            const type = selType ? parseInt(selType.value) : 1; // 1: Clear, 2: Trans, 3: Interf

            let listKey = '';
            if (system === 1) {
                listKey = type === 1 ? 'hole_clearance' : (type === 2 ? 'hole_transition' : 'hole_interference');
            } else {
                listKey = type === 1 ? 'shaft_clearance' : (type === 2 ? 'shaft_transition' : 'shaft_interference');
            }

            const fits = window.TOLERANCES_DB.pref_fits[listKey] || [];
            selPrefFit.innerHTML = '';

            fits.forEach((item, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = `${item.name}${item.pref === 1 ? ' ★ (Ưu tiên)' : ''}`;
                selPrefFit.appendChild(opt);
            });

            // Chọn kiểu mặc định
            if (fits.length > 0) {
                // Ưu tiên chọn H7/g6 hoặc H8/f7 nếu có
                let defIdx = 0;
                fits.forEach((f, i) => {
                    if (f.name === 'H7/g6' || f.name === 'H8/f7' || f.name === 'H7/h6') defIdx = i;
                });
                selPrefFit.selectedIndex = defIdx;
                applyPrefFit(fits[defIdx]);
            }
        }

        function applyPrefFit(fitObj) {
            if (!fitObj) return;
            const holeLetterName = window.TOLERANCES_DB.hole_list[fitObj.hole_letter - 1]?.letter || 'H';
            const shaftLetterName = window.TOLERANCES_DB.shaft_list[fitObj.shaft_letter - 1]?.letter || 'h';

            if (selHoleLetter) selHoleLetter.value = holeLetterName;
            if (selHoleIT) selHoleIT.value = fitObj.hole_it;
            if (selShaftLetter) selShaftLetter.value = shaftLetterName;
            if (selShaftIT) selShaftIT.value = fitObj.shaft_it;

            calculateISO();
        }

        if (selSystem) selSystem.addEventListener('change', updatePrefFitsList);
        if (selType) selType.addEventListener('change', updatePrefFitsList);

        if (selPrefFit) {
            selPrefFit.addEventListener('change', () => {
                const system = parseInt(selSystem.value);
                const type = parseInt(selType.value);
                const listKey = (system === 1) 
                    ? (type === 1 ? 'hole_clearance' : (type === 2 ? 'hole_transition' : 'hole_interference'))
                    : (type === 1 ? 'shaft_clearance' : (type === 2 ? 'shaft_transition' : 'shaft_interference'));
                const fits = window.TOLERANCES_DB.pref_fits[listKey] || [];
                const selected = fits[parseInt(selPrefFit.value)];
                applyPrefFit(selected);
            });
        }

        // Custom inputs
        [inpSize, selHoleLetter, selHoleIT, selShaftLetter, selShaftIT].forEach(el => {
            if (el) {
                el.addEventListener('input', calculateISO);
                el.addEventListener('change', calculateISO);
            }
        });

        // Khởi tạo danh sách preferred fits
        updatePrefFitsList();
    }

    // Tính toán ISO 286
    function calculateISO() {
        const inpSize = document.getElementById('iso_nominal_size');
        const selHoleLetter = document.getElementById('iso_hole_letter');
        const selHoleIT = document.getElementById('iso_hole_it');
        const selShaftLetter = document.getElementById('iso_shaft_letter');
        const selShaftIT = document.getElementById('iso_shaft_it');

        if (!inpSize || !selHoleLetter || !selHoleIT || !selShaftLetter || !selShaftIT) return;

        const D = parseFloat(inpSize.value.replace(',', '.')) || 50;
        const hLetter = selHoleLetter.value;
        const hGrade = parseInt(selHoleIT.value);
        const sLetter = selShaftLetter.value;
        const sGrade = parseInt(selShaftIT.value);

        const res = window.TolerancesEngine.calculateISOFit(D, hLetter, hGrade, sLetter, sGrade);
        if (!res || res.error) {
            console.warn(res ? res.error : 'Lỗi tính toán ISO');
            return;
        }

        currentISOResult = res;

        // Render DOM Results
        setVal('res_iso_fit_name', res.fit.name);
        setVal('res_iso_fit_type', res.fit.typeName);
        setVal('res_iso_hole_sym', res.hole.symbol);
        setVal('res_iso_hole_es', formatSigned(res.hole.ES));
        setVal('res_iso_hole_ei', formatSigned(res.hole.EI));
        setVal('res_iso_hole_it', res.hole.IT);
        setVal('res_iso_hole_dmax', res.hole.D_max.toFixed(4));
        setVal('res_iso_hole_dmin', res.hole.D_min.toFixed(4));
        setVal('res_iso_hole_td', res.hole.T_D.toFixed(4));

        setVal('res_iso_shaft_sym', res.shaft.symbol);
        setVal('res_iso_shaft_es', formatSigned(res.shaft.es));
        setVal('res_iso_shaft_ei', formatSigned(res.shaft.ei));
        setVal('res_iso_shaft_it', res.shaft.IT);
        setVal('res_iso_shaft_dmax', res.shaft.d_max.toFixed(4));
        setVal('res_iso_shaft_dmin', res.shaft.d_min.toFixed(4));
        setVal('res_iso_shaft_td', res.shaft.T_d.toFixed(4));

        // Fit clearances / interferences
        if (res.fit.type === 'Clearance') {
            setVal('lbl_iso_clearance_max', 'Khe hở lớn nhất (S_max):');
            setVal('res_iso_clearance_max', `${res.fit.S_max} µm (${res.fit.S_max_mm.toFixed(4)} mm)`);
            setVal('lbl_iso_clearance_min', 'Khe hở nhỏ nhất (S_min):');
            setVal('res_iso_clearance_min', `${res.fit.S_min} µm (${res.fit.S_min_mm.toFixed(4)} mm)`);
        } else if (res.fit.type === 'Interference') {
            setVal('lbl_iso_clearance_max', 'Độ dôi lớn nhất (N_max):');
            setVal('res_iso_clearance_max', `${res.fit.N_max} µm (${res.fit.N_max_mm.toFixed(4)} mm)`);
            setVal('lbl_iso_clearance_min', 'Độ dôi nhỏ nhất (N_min):');
            setVal('res_iso_clearance_min', `${res.fit.N_min} µm (${res.fit.N_min_mm.toFixed(4)} mm)`);
        } else {
            setVal('lbl_iso_clearance_max', 'Khe hở lớn nhất (S_max):');
            setVal('res_iso_clearance_max', `${res.fit.S_max} µm (${res.fit.S_max_mm.toFixed(4)} mm)`);
            setVal('lbl_iso_clearance_min', 'Độ dôi lớn nhất (N_max):');
            setVal('res_iso_clearance_min', `${res.fit.N_max} µm (${res.fit.N_max_mm.toFixed(4)} mm)`);
        }

        setVal('res_iso_mean_allowance', `${res.fit.meanClearance.toFixed(1)} µm`);
        setVal('res_iso_tfit', `${res.fit.T_fit} µm (${res.fit.T_fit_mm.toFixed(4)} mm)`);

        // Badge type color
        const badge = document.getElementById('badge_iso_fit_type');
        if (badge) {
            badge.className = 'badge-type ' + (res.fit.type === 'Clearance' ? 'badge-clearance' : (res.fit.type === 'Interference' ? 'badge-interference' : 'badge-transition'));
            badge.textContent = res.fit.typeName;
        }

        // Cập nhật biểu đồ Canvas 2D
        if (visualizer) {
            visualizer.updateData(res);
        }

        // Cập nhật highlight phương pháp gia công khả thi (Mục 5.0)
        updateSurfaceFinishHighlights(hGrade, sGrade);
    }

    // 4. ANSI B4.1 Controls
    function initANSIControls() {
        const inpSizeInch = document.getElementById('ansi_nominal_size');
        const selSystem = document.getElementById('ansi_system');
        const selType = document.getElementById('ansi_type');
        const selPrefFit = document.getElementById('ansi_preferred_fit');

        function updateANSIPrefList() {
            if (!selPrefFit || !window.TOLERANCES_DB) return;
            const system = selSystem ? parseInt(selSystem.value) : 1; // 1: Hole, 2: Shaft
            const type = selType ? selType.value : 'rc'; // rc, lc, lt, ln, fn
            const key = (system === 1 ? 'hole_' : 'shaft_') + type;

            const fits = window.TOLERANCES_DB.ansi_pref_fits[key] || [];
            selPrefFit.innerHTML = '';

            fits.forEach((item, idx) => {
                const opt = document.createElement('option');
                opt.value = idx + 1;
                opt.textContent = `${item.fit} (${item.hole_desc}/${item.shaft_desc})`;
                selPrefFit.appendChild(opt);
            });

            if (fits.length > 0) {
                selPrefFit.selectedIndex = 0;
                calculateANSI();
            }
        }

        if (selSystem) selSystem.addEventListener('change', updateANSIPrefList);
        if (selType) selType.addEventListener('change', updateANSIPrefList);
        if (selPrefFit) selPrefFit.addEventListener('change', calculateANSI);
        if (inpSizeInch) {
            inpSizeInch.addEventListener('input', calculateANSI);
            inpSizeInch.addEventListener('change', calculateANSI);
        }

        updateANSIPrefList();
    }

    function calculateANSI() {
        const inpSizeInch = document.getElementById('ansi_nominal_size');
        const selSystem = document.getElementById('ansi_system');
        const selType = document.getElementById('ansi_type');
        const selPrefFit = document.getElementById('ansi_preferred_fit');

        if (!inpSizeInch || !selSystem || !selType || !selPrefFit) return;

        const D_inch = parseFloat(inpSizeInch.value.replace(',', '.')) || 2.0;
        const system = parseInt(selSystem.value);
        const type = selType.value;
        const fitIdx = parseInt(selPrefFit.value);
        const key = (system === 1 ? 'hole_' : 'shaft_') + type;

        const res = window.TolerancesEngine.calculateANSIFit(D_inch, key, fitIdx);
        if (!res || res.error) {
            console.warn(res ? res.error : 'Lỗi tính toán ANSI');
            return;
        }

        setVal('res_ansi_fit_name', res.fitName);
        setVal('res_ansi_size_mm', `${res.D_mm.toFixed(3)} mm`);

        setVal('res_ansi_hole_sym', res.hole.symbol);
        setVal('res_ansi_hole_es', `${formatSigned(res.hole.ES)} mil (${formatSigned(res.hole.ES_um.toFixed(1))} µm)`);
        setVal('res_ansi_hole_ei', `${formatSigned(res.hole.EI)} mil (${formatSigned(res.hole.EI_um.toFixed(1))} µm)`);
        setVal('res_ansi_hole_tol', `${res.hole.tol} mil`);

        setVal('res_ansi_shaft_sym', res.shaft.symbol);
        setVal('res_ansi_shaft_es', `${formatSigned(res.shaft.es)} mil (${formatSigned(res.shaft.es_um.toFixed(1))} µm)`);
        setVal('res_ansi_shaft_ei', `${formatSigned(res.shaft.ei)} mil (${formatSigned(res.shaft.ei_um.toFixed(1))} µm)`);
        setVal('res_ansi_shaft_tol', `${res.shaft.tol} mil`);

        setVal('res_ansi_clearance_max', `${res.clearance.max_mils.toFixed(1)} mil (${res.clearance.max_inch.toFixed(4)} in / ${res.clearance.max_um.toFixed(1)} µm)`);
        setVal('res_ansi_clearance_min', `${res.clearance.min_mils.toFixed(1)} mil (${res.clearance.min_inch.toFixed(4)} in / ${res.clearance.min_um.toFixed(1)} µm)`);
    }

    // 5. ISO 2768-1 Controls
    function initISO2768Controls() {
        const inpLinear = document.getElementById('iso2768_linear_val');
        const selLinearCls = document.getElementById('iso2768_linear_class');
        const inpRadius = document.getElementById('iso2768_radius_val');
        const selRadiusCls = document.getElementById('iso2768_radius_class');
        const inpAngle = document.getElementById('iso2768_angle_val');
        const selAngleCls = document.getElementById('iso2768_angle_class');

        function updateISO2768() {
            if (inpLinear && selLinearCls) {
                const val = parseFloat(inpLinear.value.replace(',', '.')) || 10;
                const cls = selLinearCls.value;
                const dev = window.TolerancesEngine.lookupISO2768('linear', val, cls);
                setVal('res_iso2768_linear_dev', typeof dev === 'number' ? `± ${dev} mm` : dev);
            }
            if (inpRadius && selRadiusCls) {
                const val = parseFloat(inpRadius.value.replace(',', '.')) || 2;
                const cls = selRadiusCls.value;
                const dev = window.TolerancesEngine.lookupISO2768('broken_edges', val, cls);
                setVal('res_iso2768_radius_dev', typeof dev === 'number' ? `± ${dev} mm` : dev);
            }
            if (inpAngle && selAngleCls) {
                const val = parseFloat(inpAngle.value.replace(',', '.')) || 25;
                const cls = selAngleCls.value;
                const dev = window.TolerancesEngine.lookupISO2768('angular', val, cls);
                setVal('res_iso2768_angle_dev', dev);
            }
        }

        [inpLinear, selLinearCls, inpRadius, selRadiusCls, inpAngle, selAngleCls].forEach(el => {
            if (el) {
                el.addEventListener('input', updateISO2768);
                el.addEventListener('change', updateISO2768);
            }
        });

        updateISO2768();
    }

    // 6. Fit Design Controls (Mục 4.0)
    function initFitDesignControls() {
        const btnDesign = document.getElementById('btnStartFitDesign');
        const inpSize = document.getElementById('dsgn_size');
        const selSystem = document.getElementById('dsgn_system');
        const selType = document.getElementById('dsgn_type');
        const inpMax = document.getElementById('dsgn_desired_max');
        const inpMin = document.getElementById('dsgn_desired_min');
        const tbody = document.getElementById('dsgn_results_tbody');

        if (!btnDesign || !tbody) return;

        btnDesign.addEventListener('click', () => {
            const D = parseFloat(inpSize.value.replace(',', '.')) || 50;
            const system = parseInt(selSystem.value) || 1;
            const fitType = parseInt(selType.value) || 1;
            const desiredMax = parseFloat(inpMax.value.replace(',', '.')) || 50;
            const desiredMin = parseFloat(inpMin.value.replace(',', '.')) || 10;

            const results = window.TolerancesEngine.designFits(D, system, fitType, desiredMax, desiredMin);

            tbody.innerHTML = '';
            if (results.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="color:#ef4444; text-align:center;">Không tìm thấy kiểu lắp nào thỏa mãn điều kiện yêu cầu</td></tr>';
                return;
            }

            results.forEach((c, i) => {
                const tr = document.createElement('tr');
                if (c.isPreferred) tr.className = 'design-row-pref';

                tr.innerHTML = `
                    <td><b>${i + 1}</b></td>
                    <td><span style="color:#38bdf8; font-weight:700;">${c.fitName}</span> ${c.isPreferred ? '★' : ''}</td>
                    <td>${c.holeSymbol} [${formatSigned(c.ES)}, ${formatSigned(c.EI)}]</td>
                    <td>${c.shaftSymbol} [${formatSigned(c.es)}, ${formatSigned(c.ei)}]</td>
                    <td><b style="color:#34d399;">${c.curMax} µm</b></td>
                    <td><b style="color:#fbbf24;">${c.curMin} µm</b></td>
                    <td><button class="design-btn-apply" data-fit="${c.fitName}" data-d="${D}">Áp dụng</button></td>
                `;
                tbody.appendChild(tr);
            });

            // Gán sự kiện click nút áp dụng
            tbody.querySelectorAll('.design-btn-apply').forEach(btn => {
                btn.addEventListener('click', () => {
                    const fitStr = btn.dataset.fit;
                    const parts = fitStr.split('/');
                    if (parts.length === 2) {
                        const hPart = parts[0];
                        const sPart = parts[1];
                        const hLetter = hPart.replace(/[0-9]/g, '');
                        const hIT = hPart.replace(/[^0-9]/g, '');
                        const sLetter = sPart.replace(/[0-9]/g, '');
                        const sIT = sPart.replace(/[^0-9]/g, '');

                        const elSize = document.getElementById('iso_nominal_size');
                        const elHL = document.getElementById('iso_hole_letter');
                        const elHIT = document.getElementById('iso_hole_it');
                        const elSL = document.getElementById('iso_shaft_letter');
                        const elSIT = document.getElementById('iso_shaft_it');

                        if (elSize) elSize.value = btn.dataset.d;
                        if (elHL) elHL.value = hLetter;
                        if (elHIT) elHIT.value = hIT;
                        if (elSL) elSL.value = sLetter;
                        if (elSIT) elSIT.value = sIT;

                        calculateISO();

                        // Cuộn mượt mà đến biểu đồ Canvas để xem trực quan
                        const canvasContainer = document.getElementById('toleranceCanvasContainer');
                        if (canvasContainer) {
                            canvasContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                });
            });
        });
    }

    // 7. Surface Finish Matrix (Mục 5.0)
    function initSurfaceFinishTable() {
        const tbody = document.getElementById('surface_processes_tbody');
        if (!tbody || !window.TOLERANCES_DB || !window.TOLERANCES_DB.processes) return;

        tbody.innerHTML = '';
        window.TOLERANCES_DB.processes.forEach((proc, idx) => {
            const tr = document.createElement('tr');
            tr.dataset.grades = JSON.stringify(proc.grades || []);

            // Thanh ma trận IT2 đến IT16
            let barHtml = '';
            for (let g = 2; g <= 16; g++) {
                if (proc.grades && proc.grades.includes(g)) {
                    barHtml += `<span class="it-cell-active" data-grade="${g}" title="${proc.name}: IT${g}">IT${g}</span>`;
                } else {
                    barHtml += `<span class="it-cell-inactive" data-grade="${g}">·</span>`;
                }
            }

            tr.innerHTML = `
                <td style="text-align:center; color:#94a3b8; font-weight:600;">${idx + 1}</td>
                <td>
                    <div style="font-weight:700; color:#f8fafc; font-size:0.92rem;">${proc.name_vi || proc.name}</div>
                    <div style="font-size:0.78rem; color:#64748b;">${proc.name}</div>
                </td>
                <td style="color:#38bdf8; font-weight:700; white-space:nowrap;">IT${proc.min_grade} ~ IT${proc.max_grade}</td>
                <td style="color:#34d399; font-weight:600; white-space:nowrap;">${proc.ra_min} ~ ${proc.ra_max} µm</td>
                <td>
                    <div class="it-bar-container">${barHtml}</div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Dynamic highlight cho Section 5.0 khi chọn Lỗ / Trục ở Mục 1.0
    function updateSurfaceFinishHighlights(holeIT, shaftIT) {
        const tbody = document.getElementById('surface_processes_tbody');
        if (!tbody) return;

        tbody.querySelectorAll('tr').forEach(tr => {
            try {
                const grades = JSON.parse(tr.dataset.grades || '[]');
                const canMakeHole = grades.includes(holeIT);
                const canMakeShaft = grades.includes(shaftIT);

                if (canMakeHole && canMakeShaft) {
                    tr.className = 'row-proc-feasible';
                } else {
                    tr.className = '';
                }

                // Highlight active IT cells
                tr.querySelectorAll('.it-cell-active').forEach(cell => {
                    const g = parseInt(cell.dataset.grade);
                    if (g === holeIT || g === shaftIT) {
                        cell.classList.add('it-cell-highlight');
                    } else {
                        cell.classList.remove('it-cell-highlight');
                    }
                });
            } catch (e) {}
        });
    }

    // Sao chép thông số kỹ thuật mối lắp ghép vào Clipboard
    function copyFitDataToClipboard() {
        if (!currentISOResult) return;
        const res = currentISOResult;
        const D = res.D;
        const fit = res.fit;
        const hole = res.hole;
        const shaft = res.shaft;

        let clearInfo = '';
        if (fit.type === 'Clearance') {
            clearInfo = `  + Khe hở lớn nhất (S_max): ${fit.S_max} µm (${fit.S_max_mm.toFixed(4)} mm)\n  + Khe hở nhỏ nhất (S_min): ${fit.S_min} µm (${fit.S_min_mm.toFixed(4)} mm)`;
        } else if (fit.type === 'Interference') {
            clearInfo = `  + Độ dôi lớn nhất (N_max): ${fit.N_max} µm (${fit.N_max_mm.toFixed(4)} mm)\n  + Độ dôi nhỏ nhất (N_min): ${fit.N_min} µm (${fit.N_min_mm.toFixed(4)} mm)`;
        } else {
            clearInfo = `  + Khe hở lớn nhất (S_max): ${fit.S_max} µm (${fit.S_max_mm.toFixed(4)} mm)\n  + Độ dôi lớn nhất (N_max): ${fit.N_max} µm (${fit.N_max_mm.toFixed(4)} mm)`;
        }

        const text = 
`======================================================================
KẾT QUẢ TÍNH TOÁN DUNG SAI & LẮP GHÉP THEO ISO 286:1988
- Kích thước danh nghĩa: D = ${D} mm
- Kiểu lắp ghép: ${fit.name} (${fit.typeName})
----------------------------------------------------------------------
1. CHI TIẾT LỖ (HOLE): ${hole.symbol}
   - Sai lệch trên ES: ${formatSigned(hole.ES)} µm
   - Sai lệch dưới EI: ${formatSigned(hole.EI)} µm
   - Dung sai lỗ T_D: ${hole.IT} µm (${hole.T_D.toFixed(4)} mm)
   - Kích thước giới hạn: D_max = ${hole.D_max.toFixed(4)} mm, D_min = ${hole.D_min.toFixed(4)} mm

2. CHI TIẾT TRỤC (SHAFT): ${shaft.symbol}
   - Sai lệch trên es: ${formatSigned(shaft.es)} µm
   - Sai lệch dưới ei: ${formatSigned(shaft.ei)} µm
   - Dung sai trục T_d: ${shaft.IT} µm (${shaft.T_d.toFixed(4)} mm)
   - Kích thước giới hạn: d_max = ${shaft.d_max.toFixed(4)} mm, d_min = ${shaft.d_min.toFixed(4)} mm

3. ĐẶC TÍNH MỐI GHÉP:
${clearInfo}
   - Độ hở/dôi trung bình: ${fit.meanClearance.toFixed(1)} µm
   - Dung sai ghép tổng (T_fit): ${fit.T_fit} µm (${fit.T_fit_mm.toFixed(4)} mm)
======================================================================`;

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btnCopyFitData');
            if (btn) {
                const oldText = btn.textContent;
                btn.textContent = 'Đã Sao Chép! ✓';
                btn.style.background = '#059669';
                setTimeout(() => {
                    btn.textContent = oldText;
                    btn.style.background = '#10b981';
                }, 2000);
            }
        }).catch(() => {
            alert('Không thể truy cập Clipboard trình duyệt.');
        });
    }

    function calculateAll() {
        calculateISO();
        calculateANSI();
    }

    function setVal(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function formatSigned(num) {
        if (typeof num !== 'number') return num;
        return num > 0 ? `+${num}` : `${num}`;
    }

    // Chạy khi trang tải xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof window !== 'undefined' ? window : this);
