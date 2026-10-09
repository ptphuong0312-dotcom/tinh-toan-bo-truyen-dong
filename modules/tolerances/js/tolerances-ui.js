/**
 * TOLERANCES & FITS UI CONTROLLER
 * Xử lý tương tác giao diện người dùng, đồng bộ tính toán thời gian thực
 */

(function (window) {
    'use strict';

    let visualizer = null;
    let thermalVisualizer = null;
    let currentISOResult = null;
    let currentThermalResult = null;

    function init() {
        // Khởi tạo visualizers
        visualizer = new window.TolerancesVisualizer('toleranceCanvas');
        thermalVisualizer = new window.ThermalFitVisualizer('thermalFitCanvas');

        initTabs();
        initAccordions();
        initISOControls();
        initThermalFitControls();
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

        // Cập nhật tiện ích nung nhiệt nếu có độ dôi hoặc kiểu lắp chặt
        const calloutContainer = document.getElementById('thermalCalloutContainer');
        const calloutNmaxVal = document.getElementById('callout_nmax_val');
        const isInterference = (res.fit.type === 'Interference' || res.fit.N_max > 0);
        
        if (calloutContainer) {
            if (isInterference) {
                calloutContainer.style.display = 'flex';
                if (calloutNmaxVal) calloutNmaxVal.textContent = res.fit.N_max.toFixed(1);
            } else {
                calloutContainer.style.display = 'none';
            }
        }

        // Tự động đồng bộ d và Nmax vào form nung nhiệt (nếu người dùng chưa chỉnh sửa tay)
        const inpThermD = document.getElementById('thermal_inp_d');
        const inpThermNmax = document.getElementById('thermal_inp_nmax');
        const inpThermDhub = document.getElementById('thermal_inp_D');
        const inpThermC = document.getElementById('thermal_inp_c');
        if (inpThermD && (!inpThermD.dataset.userEdited)) {
            inpThermD.value = res.D.toFixed(3);
        }
        if (inpThermNmax && (!inpThermNmax.dataset.userEdited)) {
            if (isInterference) {
                inpThermNmax.value = res.fit.N_max.toFixed(1);
            }
        }
        if (inpThermDhub && (!inpThermDhub.dataset.userEdited)) {
            inpThermDhub.value = (res.D * 2.0).toFixed(1);
        }
        if (inpThermC && (!inpThermC.dataset.userEdited)) {
            inpThermC.value = Math.max(20.0, res.D * 1.0).toFixed(1);
        }
        calculateThermal();
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

    // 3.5. Thermal Fit & Shrinkage Controls (DIN 7190)
    function initThermalFitControls() {
        const inpD = document.getElementById('thermal_inp_d');
        const inpNmax = document.getElementById('thermal_inp_nmax');
        const inpDhub = document.getElementById('thermal_inp_D');
        const inpD0 = document.getElementById('thermal_inp_d0');
        const inpC = document.getElementById('thermal_inp_c');
        const inpT0 = document.getElementById('thermal_inp_T0');
        const selMatH = document.getElementById('thermal_sel_mat_hub');
        const selMatS = document.getElementById('thermal_sel_mat_shaft');

        const inputs = [inpD, inpNmax, inpDhub, inpD0, inpC, inpT0];
        inputs.forEach(inp => {
            if (inp) {
                inp.addEventListener('input', () => {
                    inp.dataset.userEdited = 'true';
                    calculateThermal();
                });
                inp.addEventListener('change', () => {
                    inp.dataset.userEdited = 'true';
                    calculateThermal();
                });
            }
        });

        if (selMatH) selMatH.addEventListener('change', calculateThermal);
        if (selMatS) selMatS.addEventListener('change', calculateThermal);

        // Nút đồng bộ từ ISO 286
        const btnSync = document.getElementById('btnSyncFromISO');
        if (btnSync) {
            btnSync.addEventListener('click', () => {
                if (currentISOResult) {
                    if (inpD) {
                        inpD.value = currentISOResult.D.toFixed(3);
                        delete inpD.dataset.userEdited;
                    }
                    if (inpNmax) {
                        inpNmax.value = (currentISOResult.fit.N_max > 0 ? currentISOResult.fit.N_max : 50.0).toFixed(1);
                        delete inpNmax.dataset.userEdited;
                    }
                    if (inpDhub) {
                        inpDhub.value = (currentISOResult.D * 2.0).toFixed(1);
                        delete inpDhub.dataset.userEdited;
                    }
                    if (inpC) {
                        inpC.value = Math.max(20.0, currentISOResult.D * 1.0).toFixed(1);
                        delete inpC.dataset.userEdited;
                    }
                    calculateThermal();
                }
            });
        }

        // Nút nhảy tới tiện ích nung nhiệt
        const btnJump = document.getElementById('btnJumpToThermal');
        if (btnJump) {
            btnJump.addEventListener('click', () => {
                const sec = document.getElementById('secThermalFit');
                if (sec) {
                    sec.classList.remove('collapsed');
                    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Thermal Canvas Controls
        const btnHot = document.getElementById('btnThermalModeHot');
        const btnCold = document.getElementById('btnThermalModeCold');
        if (btnHot && btnCold) {
            btnHot.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.setMode('hot');
                btnHot.style.background = '#dc2626';
                btnHot.style.borderColor = '#ef4444';
                btnCold.style.background = '#334155';
                btnCold.style.borderColor = '#475569';
            });
            btnCold.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.setMode('cold');
                btnCold.style.background = '#0284c7';
                btnCold.style.borderColor = '#0ea5e9';
                btnHot.style.background = '#334155';
                btnHot.style.borderColor = '#475569';
            });
        }

        const btnZoomIn = document.getElementById('btnThermalZoomIn');
        if (btnZoomIn) {
            btnZoomIn.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.zoomIn();
            });
        }

        const btnZoomOut = document.getElementById('btnThermalZoomOut');
        if (btnZoomOut) {
            btnZoomOut.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.zoomOut();
            });
        }

        const btnReset = document.getElementById('btnThermalReset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.resetView();
            });
        }

        const btnDownload = document.getElementById('btnThermalDownload');
        if (btnDownload) {
            btnDownload.addEventListener('click', () => {
                if (thermalVisualizer) thermalVisualizer.downloadPNG();
            });
        }

        const btnCopy = document.getElementById('btnThermalCopy');
        if (btnCopy) {
            btnCopy.addEventListener('click', copyThermalReportToClipboard);
        }
    }

    function calculateThermal() {
        if (!window.TolerancesEngine || !window.TolerancesEngine.calculateThermalFit) return;

        const d = parseFloat(document.getElementById('thermal_inp_d')?.value.replace(',', '.') || 50.0);
        const N_max = parseFloat(document.getElementById('thermal_inp_nmax')?.value.replace(',', '.') || 59.0);
        const D_hub = parseFloat(document.getElementById('thermal_inp_D')?.value.replace(',', '.') || 100.0);
        const d0_shaft = parseFloat(document.getElementById('thermal_inp_d0')?.value.replace(',', '.') || 0.0);
        const c = parseFloat(document.getElementById('thermal_inp_c')?.value.replace(',', '.') || 50.0);
        const T0 = parseFloat(document.getElementById('thermal_inp_T0')?.value.replace(',', '.') || 20.0);
        const mat_hub = document.getElementById('thermal_sel_mat_hub')?.value || 'steel';
        const mat_shaft = document.getElementById('thermal_sel_mat_shaft')?.value || 'steel';

        const res = window.TolerancesEngine.calculateThermalFit({
            d,
            N_max,
            D_hub,
            d0_shaft,
            c,
            T0,
            mat_hub,
            mat_shaft
        });

        currentThermalResult = res;

        setVal('thermal_res_TH', `${res.scenario_H.T_H} °C`);
        setVal('thermal_res_method_H', res.scenario_H.method);
        const badgeH = document.getElementById('thermal_badge_H');
        if (badgeH) {
            badgeH.textContent = res.scenario_H.statusText;
            if (res.scenario_H.status === 'safe') {
                badgeH.style.background = '#15803d';
            } else if (res.scenario_H.status === 'warning') {
                badgeH.style.background = '#d97706';
            } else {
                badgeH.style.background = '#dc2626';
            }
        }

        setVal('thermal_res_TS', `${res.scenario_S.T_S} °C`);
        setVal('thermal_res_coolant_S', res.scenario_S.coolant);

        setVal('thermal_res_combo_TH', `${res.scenario_combo.T_H} °C`);
        setVal('thermal_res_combo_TS', `${res.scenario_combo.T_S} °C`);

        setVal('thermal_res_p', `${res.p} MPa`);
        setVal('thermal_res_ueff', `${res.U_eff} µm`);
        setVal('thermal_res_deltaD', `+${res.delta_D} µm`);
        setVal('thermal_res_Dact', `${res.D_act} mm`);

        setVal('thermal_res_deltad0', `-${res.delta_d0} µm`);
        const d0lbl = document.getElementById('thermal_res_d0act_lbl');
        if (d0lbl) {
            if (d0_shaft > 0) {
                d0lbl.innerHTML = `Đường kính sau ép: <span style="color:#e2e8f0; font-weight:600;">${res.d0_act} mm</span>`;
            } else {
                d0lbl.textContent = 'Trục đặc (không có lỗ trong)';
            }
        }

        if (thermalVisualizer) {
            thermalVisualizer.updateData(res);
        }
    }

    function copyThermalReportToClipboard() {
        if (!currentThermalResult) return;
        const res = currentThermalResult;

        const text = `======================================================================
PHIẾU QUY TRÌNH KỸ THUẬT: LẮP GHÉP NHIỆT & BIẾN DẠNG DÔI (DIN 7190)
MITCalc Engineering Web App - Xuất Xưởng Tự Động
======================================================================
1. THÔNG SỐ MỐI GHÉP:
   - Đường kính mặt ghép danh nghĩa d: ${res.d} mm
   - Độ dôi lớn nhất tính toán N_max: ${res.N_max} µm (${(res.N_max / 1000).toFixed(4)} mm)
   - Đường kính ngoài Moay-ơ D: ${res.D_hub} mm
   - Đường kính lỗ trong trục rỗng d0: ${res.d0_shaft > 0 ? res.d0_shaft + ' mm' : 'Trục đặc (0 mm)'}
   - Khe hở lắp lọt an toàn khi nung c: ${res.c} µm
   - Độ giãn nở lỗ yêu cầu: Δd_req = ${res.delta_d_req_um} µm
   - Vật liệu Moay-ơ: ${res.mat_hub.name} (α = ${(res.mat_hub.alpha * 1e6).toFixed(1)}e-6/K)
   - Vật liệu Trục: ${res.mat_shaft.name} (α = ${(res.mat_shaft.alpha * 1e6).toFixed(1)}e-6/K)

2. BA (03) KỊCH BẢN GIA CÔNG NHIỆT:
   [A] NUNG NÓNG MOAY-Ơ (Trục ở ${res.T0}°C):
       * Nhiệt độ nung cần thiết T_hub: ${res.scenario_H.T_H} °C
       * Trạng thái & Phương pháp: ${res.scenario_H.statusText} - ${res.scenario_H.method}

   [B] LÀM LẠNH SÂU TRỤC (Moay-ơ ở ${res.T0}°C):
       * Nhiệt độ làm lạnh cần thiết T_shaft: ${res.scenario_S.T_S} °C
       * Môi chất lạnh khuyến nghị: ${res.scenario_S.coolant}

   [C] PHỐI HỢP CẢ HAI (Tối ưu cơ tính thép tôi):
       * Nung Moay-ơ vừa phải: T_hub = ${res.scenario_combo.T_H} °C
       * Làm lạnh Trục nhẹ: T_shaft = ${res.scenario_combo.T_S} °C

3. BIẾN DẠNG HÌNH HỌC & ÁP SUẤT SAU KHI NGUỘI:
   - Áp suất tiếp xúc mặt ghép p: ${res.p} MPa
   - Độ dôi hiệu dụng sau khi cán phẳng U_eff: ${res.U_eff} µm
   - Nở đường kính ngoài Moay-ơ ΔD: +${res.delta_D} µm (D_sau_ép = ${res.D_act} mm)
   - Co hẹp lỗ trong trục rỗng Δd0: ${res.d0_shaft > 0 ? `-${res.delta_d0} µm (d0_sau_ép = ${res.d0_act} mm)` : '0.0 µm (Trục đặc)'}
======================================================================`;

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btnThermalCopy');
            if (btn) {
                const oldText = btn.textContent;
                btn.textContent = 'Đã Sao Chép! ✓';
                btn.style.background = '#059669';
                setTimeout(() => {
                    btn.textContent = oldText;
                    btn.style.background = '#475569';
                }, 2000);
            }
        }).catch(() => {
            alert('Không thể truy cập Clipboard trình duyệt.');
        });
    }

    function calculateAll() {
        calculateISO();
        calculateANSI();
        calculateThermal();
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
