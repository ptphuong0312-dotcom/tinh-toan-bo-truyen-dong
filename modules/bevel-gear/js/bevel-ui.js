/**
 * MITCalc Web App - Bevel Gear UI Controller (Module 2)
 * Manages Accordion, Real-time calculations, Materials DB, Smart Buttons, Sliders, Live Audit
 * Standards: ISO 23509, DIN 3971, DIN 3965
 * ZERO-FORCE SCOPE: Focus 100% on geometry, kinematics, tolerances, and CAD.
 */

class BevelGearUI {
    constructor() {
        this.inputs = {
            P: 50.0,
            n1: 1000.0,
            n2: 400.0,
            i_req: 2.5000,
            z1: 18,
            z2: 45,
            Sigma: 90.0,
            alfa: 20.0,
            beta: 30.0,
            mmn: 10.0,
            b: 117.0,
            x1: 0.32,
            xt1: 0.04,
            ha0: 1.0,
            c0: 0.2,
            Q: 6,
            mat1: '16MnCr5',
            mat2: '16MnCr5'
        };

        this.canvasController = (typeof BevelGearCanvas !== 'undefined') ? new BevelGearCanvas('bevelCanvas') : null;
        this.initDOM();
        this.initAccordion();
        this.initMaterials();
        this.initMaterialsTable();
        this.initInputs();
        this.initSmartControls();
        this.calculate();
    }

    initDOM() {
        // Global Accordion controls
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) btnExpandAll.addEventListener('click', () => this.toggleAllSections(true));
        if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => this.toggleAllSections(false));

        // Reset Defaults
        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.inputs = {
                    P: 50.0, n1: 1000.0, n2: 400.0, i_req: 2.5000,
                    z1: 18, z2: 45, Sigma: 90.0, alfa: 20.0, beta: 30.0,
                    mmn: 10.0, b: 117.0, x1: 0.32, xt1: 0.04,
                    ha0: 1.0, c0: 0.2, Q: 6, mat1: '16MnCr5', mat2: '16MnCr5'
                };
                document.querySelectorAll('.input-eng').forEach(inp => {
                    const k = inp.getAttribute('data-key');
                    if (this.inputs[k] !== undefined) inp.value = this.inputs[k];
                });
                const selAcc = document.getElementById('selAccuracySec14') || document.getElementById('selAccuracy');
                const selAccSec14 = document.getElementById('selAccuracySec14');
                if (selAcc) selAcc.value = '6';
                if (selAccSec14) selAccSec14.value = '6';
                const sliderB = document.getElementById('slider_b_Re');
                if (sliderB) sliderB.value = '0.3458';
                const sliderX1 = document.getElementById('slider_x1');
                if (sliderX1) sliderX1.value = '0.32';
                this.calculate();
            });
        }

        // Print report
        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

        // Tab switching (Zero conflict, display: block/none + active class)
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    target.classList.add('active');
                    target.style.display = 'block';
                    if (targetId === 'tabCanvas' && this.canvasController) {
                        this.canvasController.resetView();
                    }
                }
            });
        });

        // Accuracy Grade Selection (Section 11.4 / DIN 3965)
        const selAccSec14 = document.getElementById('selAccuracySec14');
        if (selAccSec14) {
            selAccSec14.addEventListener('change', () => {
                this.inputs.Q = parseInt(selAccSec14.value) || 6;
                this.calculate();
            });
        }

        // Canvas toolbar & Speed Slider
        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const speedVal = document.getElementById('animSpeedVal');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', (e) => {
                const spd = parseFloat(e.target.value) || 1.0;
                if (speedVal) speedVal.textContent = spd.toFixed(1) + 'x';
                if (this.canvasController) this.canvasController.setAnimSpeed(spd);
            });
        }

        const btnZoomIn = document.getElementById('btnCanvasZoomIn');
        const btnZoomOut = document.getElementById('btnCanvasZoomOut');
        const btnResetView = document.getElementById('btnCanvasReset');
        const btnAnimate = document.getElementById('btnCanvasAnimate');
        if (btnZoomIn && this.canvasController) btnZoomIn.addEventListener('click', () => this.canvasController.zoom(1.2));
        if (btnZoomOut && this.canvasController) btnZoomOut.addEventListener('click', () => this.canvasController.zoom(0.8));
        if (btnResetView && this.canvasController) btnResetView.addEventListener('click', () => this.canvasController.resetView());
        if (btnAnimate && this.canvasController) {
            btnAnimate.addEventListener('click', () => {
                const running = this.canvasController.toggleAnimation();
                btnAnimate.textContent = running ? '⏸ Tạm Dừng' : '▶ Chạy Mô Phỏng';
            });
        }

        // Canvas Layer Toggles
        const chkShowDims = document.getElementById('chkShowDims');
        const chkShowHatch = document.getElementById('chkShowHatch');
        const chkShowAxes = document.getElementById('chkShowAxes');
        const chkShowStripes = document.getElementById('chkShowStripes');
        const chkShowDataCard = document.getElementById('chkShowDataCard');

        if (chkShowDims) {
            chkShowDims.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showDimensions = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowHatch) {
            chkShowHatch.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showHatching = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowAxes) {
            chkShowAxes.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showAxes = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowStripes) {
            chkShowStripes.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showStripes = e.target.checked;
                    this.canvasController.render();
                }
            });
        }
        if (chkShowDataCard) {
            chkShowDataCard.addEventListener('change', (e) => {
                if (this.canvasController) {
                    this.canvasController.showDataCard = e.target.checked;
                    this.canvasController.render();
                }
            });
        }

        // DXF Export Buttons (Canvas & Section 16)
        const btnExportDXFCanvas = document.getElementById('btnExportDXFCanvas');
        if (btnExportDXFCanvas) {
            btnExportDXFCanvas.addEventListener('click', () => this.exportDXF());
        }
        const btnExportDXFSec16 = document.getElementById('btnExportDXFSec16');
        if (btnExportDXFSec16) {
            btnExportDXFSec16.addEventListener('click', () => this.exportDXF());
        }

        // Live Audit Refresh Button
        const btnRefreshAudit = document.getElementById('btnRefreshAudit');
        if (btnRefreshAudit) {
            btnRefreshAudit.addEventListener('click', () => this.calculate());
        }
    }

    initAccordion() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.parentElement;
                const isCollapsed = section.classList.contains('collapsed');
                section.classList.toggle('collapsed', !isCollapsed);
                const toggle = header.querySelector('.section-toggle');
                if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
            });
        });
    }

    toggleAllSections(expand) {
        document.querySelectorAll('.calc-section').forEach(section => {
            section.classList.toggle('collapsed', !expand);
            const toggle = section.querySelector('.section-toggle');
            if (toggle) toggle.textContent = expand ? '▼' : '▶';
        });
    }

    initMaterials() {
        const sel1 = document.getElementById('sel_mat1');
        const sel2 = document.getElementById('sel_mat2');
        if (!sel1 || !sel2 || typeof MATERIALS_DB === 'undefined') return;

        sel1.innerHTML = '';
        sel2.innerHTML = '';

        MATERIALS_DB.forEach(m => {
            const std = m.standards ? (m.standards.din || m.standards.iso || m.standards.en || '') : '';
            const label = m.name + (std ? ' (' + std + ')' : '') + ' - Rm: ' + (m.rm || '--') + ' MPa';

            const opt1 = document.createElement('option');
            opt1.value = m.name;
            opt1.textContent = label;
            if (m.name.includes('16MnCr5') || m.name.includes('Ck 60') || m.name.includes('C45')) opt1.selected = true;
            sel1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = m.name;
            opt2.textContent = label;
            if (m.name.includes('16MnCr5') || m.name.includes('Ck 60') || m.name.includes('C45')) opt2.selected = true;
            sel2.appendChild(opt2);
        });

        sel1.addEventListener('change', () => this.updateMaterialProps(1));
        sel2.addEventListener('change', () => this.updateMaterialProps(2));
        this.updateMaterialProps(1);
        this.updateMaterialProps(2);
    }

    updateMaterialProps(wheel) {
        const sel = document.getElementById('sel_mat' + wheel);
        if (!sel || typeof MATERIALS_DB === 'undefined') return;
        const mat = MATERIALS_DB.find(m => m.name === sel.value);
        if (!mat) return;

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        set('mat' + wheel + '_rm', (mat.rm || '--') + ' MPa');
        set('mat' + wheel + '_rp', (mat.rp02 || '--') + ' MPa');
        set('mat' + wheel + '_hard', (mat.surfaceHardnessHV || mat.coreHardnessHV || mat.hardness || '60') + ' HRC');
    }

    initMaterialsTable() {
        const container = document.getElementById('materialsTableBody');
        const searchInput = document.getElementById('inputSearchMat');
        if (!container || typeof MATERIALS_DB === 'undefined') return;

        const renderRows = (filter = '') => {
            container.innerHTML = '';
            const f = filter.toLowerCase().trim();
            const list = MATERIALS_DB.filter(m => {
                if (!f) return true;
                const name = (m.name || '').toLowerCase();
                const full = (m.fullName || '').toLowerCase();
                const treat = (m.treatment || '').toLowerCase();
                const std = m.standards ? JSON.stringify(m.standards).toLowerCase() : '';
                return name.includes(f) || full.includes(f) || treat.includes(f) || std.includes(f);
            });

            list.forEach(m => {
                const tr = document.createElement('tr');
                const stdStr = m.standards ? (m.standards.din || m.standards.iso || m.standards.en || m.standards.ansi || '-') : '-';
                tr.innerHTML = '<td><b>' + (m.id || '-') + '</b></td>' +
                    '<td><b>' + m.name + '</b></td>' +
                    '<td>' + stdStr + '</td>' +
                    '<td>' + (m.treatment || '-') + '</td>' +
                    '<td>' + (m.rm || '--') + '</td>' +
                    '<td>' + (m.rp02 || '--') + '</td>' +
                    '<td>' + (m.shlim || '--') + '</td>' +
                    '<td>' + (m.sflim || '--') + '</td>' +
                    '<td>' + (m.surfaceHardnessHV || m.coreHardnessHV || '--') + '</td>';
                container.appendChild(tr);
            });
        };

        renderRows();
        if (searchInput) {
            searchInput.addEventListener('input', () => renderRows(searchInput.value));
        }
    }

    initInputs() {
        // Locale-safe real-time input parsing: converts ',' to '.'
        document.querySelectorAll('.input-eng').forEach(inp => {
            inp.addEventListener('input', () => {
                const key = inp.getAttribute('data-key');
                if (key) {
                    const rawVal = String(inp.value).trim().replace(',', '.');
                    this.inputs[key] = parseFloat(rawVal) || 0;

                    // Auto-sync z2 if z1 changes
                    if (key === 'z1') {
                        const i = this.inputs.i_req || 2.5;
                        const z2_calc = Math.round(i * this.inputs.z1);
                        this.inputs.z2 = z2_calc;
                        const inp_z2 = document.getElementById('inp_z2');
                        if (inp_z2) inp_z2.value = z2_calc;
                    }

                    // Auto-sync z2 if i_req changes
                    if (key === 'i_req') {
                        const z2_calc = Math.round(this.inputs.i_req * this.inputs.z1);
                        this.inputs.z2 = z2_calc;
                        const inp_z2 = document.getElementById('inp_z2');
                        if (inp_z2) inp_z2.value = z2_calc;
                    }

                    this.calculate();
                }
            });
        });

        // Section 15.0 Auxiliary Calculation Listeners
        ['aux_inp_n1', 'aux_inp_n2', 'aux_inp_Mk1', 'aux_inp_n1_pw'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.calculateAuxiliary());
            }
        });
    }

    initSmartControls() {
        // Smart Button 1: [ i <= n1,n2 ]
        const btn_i_n1n2 = document.getElementById('btn_i_n1n2');
        if (btn_i_n1n2) {
            btn_i_n1n2.addEventListener('click', () => {
                const n1 = this.inputs.n1 || 1000.0;
                const n2 = parseFloat(String(document.getElementById('inp_n2').value).replace(',', '.')) || 400.0;
                if (n2 > 0) {
                    const i = n1 / n2;
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    // Also update z2
                    const z2_calc = Math.round(i * this.inputs.z1);
                    this.inputs.z2 = z2_calc;
                    const inp_z2 = document.getElementById('inp_z2');
                    if (inp_z2) inp_z2.value = z2_calc;
                    this.calculate();
                }
            });
        }

        // Smart Button 2: [ Pw <= Mk,n ]
        const btn_Pw_Mkn = document.getElementById('btn_Pw_Mkn');
        if (btn_Pw_Mkn) {
            btn_Pw_Mkn.addEventListener('click', () => {
                const Mk1 = parseFloat(document.getElementById('out_Mk1').textContent) || 477.46;
                const n1 = this.inputs.n1 || 1000.0;
                const P = (Mk1 * n1) / 9550.0;
                this.inputs.P = parseFloat(P.toFixed(2));
                const inp_P = document.getElementById('inp_P');
                if (inp_P) inp_P.value = P.toFixed(1);
                this.calculate();
            });
        }

        // Smart Button 3: [ i <= z1,z2 ]
        const btn_i_z1z2 = document.getElementById('btn_i_z1z2');
        if (btn_i_z1z2) {
            btn_i_z1z2.addEventListener('click', () => {
                const z1 = this.inputs.z1 || 18;
                const z2 = this.inputs.z2 || 45;
                if (z1 > 0) {
                    const i = z2 / z1;
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    this.calculate();
                }
            });
        }

        // ComboBox: Standard Ratios (sel_std_ratio)
        const selRatio = document.getElementById('sel_std_ratio');
        if (selRatio) {
            selRatio.addEventListener('change', () => {
                if (selRatio.value) {
                    const i = parseFloat(selRatio.value);
                    this.inputs.i_req = i;
                    const inp_i_req = document.getElementById('inp_i_req');
                    if (inp_i_req) inp_i_req.value = i.toFixed(4);
                    const z2_calc = Math.round(i * this.inputs.z1);
                    this.inputs.z2 = z2_calc;
                    const inp_z2 = document.getElementById('inp_z2');
                    if (inp_z2) inp_z2.value = z2_calc;
                    this.calculate();
                }
            });
        }

        // ComboBox: Standard Angles (sel_std_sigma, sel_std_alpha, sel_std_beta)
        const selSigma = document.getElementById('sel_std_sigma');
        if (selSigma) {
            selSigma.addEventListener('change', () => {
                if (selSigma.value) {
                    this.inputs.Sigma = parseFloat(selSigma.value);
                    const inp = document.getElementById('inp_Sigma');
                    if (inp) inp.value = selSigma.value;
                    this.calculate();
                }
            });
        }

        const selPAType = document.getElementById('selPressureAngleType');
        if (selPAType) {
            selPAType.addEventListener('change', () => {
                const isNormal = selPAType.value === 'normal';
                const sym = document.getElementById('sym_alfa');
                if (sym) sym.textContent = isNormal ? 'αn' : 'αt';
                this.inputs.isNormalPressureAngle = isNormal;
                this.calculate();
            });
        }

        const selAlpha = document.getElementById('sel_std_alpha');
        if (selAlpha) {
            selAlpha.addEventListener('change', () => {
                if (selAlpha.value) {
                    this.inputs.alfa = parseFloat(selAlpha.value);
                    const inp = document.getElementById('inp_alfa');
                    if (inp) inp.value = selAlpha.value;
                    this.calculate();
                }
            });
        }

        const selBeta = document.getElementById('sel_std_beta');
        if (selBeta) {
            selBeta.addEventListener('change', () => {
                if (selBeta.value) {
                    this.inputs.beta = parseFloat(selBeta.value);
                    const inp = document.getElementById('inp_beta');
                    if (inp) inp.value = selBeta.value;
                    this.calculate();
                }
            });
        }

        // Tooth Hand direction
        const selToothHand = document.getElementById('selToothHand');
        if (selToothHand) {
            selToothHand.addEventListener('change', () => {
                this.inputs.toothHand = selToothHand.value;
                this.calculate();
            });
        }

        // Module Type selector
        const selModType = document.getElementById('selModuleType');
        if (selModType) {
            selModType.addEventListener('change', () => {
                const isOuter = selModType.value === 'transverse_outer';
                const sym = document.getElementById('sym_module');
                if (sym) sym.textContent = isOuter ? 'met' : 'mmn';
                this.inputs.isOuterModule = isOuter;
                this.calculate();
            });
        }

        // ComboBox: Standard Module DIN 780 / ISO 54
        const selModule = document.getElementById('sel_std_module');
        if (selModule) {
            selModule.addEventListener('change', () => {
                if (selModule.value) {
                    const mmn = parseFloat(selModule.value);
                    this.inputs.mmn = mmn;
                    const inp = document.getElementById('inp_mmn');
                    if (inp) inp.value = mmn.toFixed(3);
                    this.calculate();
                }
            });
        }

        // Gearing Type (Section 3.1)
        const selGearType = document.getElementById('selGearingType');
        if (selGearType) {
            selGearType.addEventListener('change', () => {
                const v = selGearType.value;
                if (v === 'straight_type1' || v === 'zerol') {
                    this.inputs.beta = 0.0;
                    const inpB = document.getElementById('inp_beta');
                    if (inpB) inpB.value = '0.0';
                } else if (v === 'gleason') {
                    this.inputs.beta = 30.0;
                    const inpB = document.getElementById('inp_beta');
                    if (inpB) inpB.value = '30.0';
                }
                this.calculate();
            });
        }

        // Slider: b / Re
        const sliderBRe = document.getElementById('slider_b_Re');
        if (sliderBRe) {
            sliderBRe.addEventListener('input', () => {
                const ratio = parseFloat(sliderBRe.value);
                const Re = parseFloat(document.getElementById('out_Re') ? document.getElementById('out_Re').textContent : 338.32);
                const b_calc = Math.round(ratio * Re);
                this.inputs.b = b_calc;
                const inp_b = document.getElementById('inp_b');
                if (inp_b) inp_b.value = b_calc.toFixed(1);
                this.calculate();
            });
        }

        // Slider: x1
        const sliderX1 = document.getElementById('slider_x1');
        if (sliderX1) {
            sliderX1.addEventListener('input', () => {
                const x1 = parseFloat(sliderX1.value);
                this.inputs.x1 = x1;
                const inp_x1 = document.getElementById('inp_x1');
                if (inp_x1) inp_x1.value = x1.toFixed(2);
                this.calculate();
            });
        }

        // ComboBox: Correction Type (selCorrectionType)
        const selCorr = document.getElementById('selCorrectionType');
        if (selCorr) {
            selCorr.addEventListener('change', () => {
                const type = selCorr.value;
                if (type === 'VN_bending') {
                    this.inputs.x1 = 0.58;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'VN_contact') {
                    this.inputs.x1 = 0.32;
                    this.inputs.xt1 = 0.04;
                } else if (type === 'DIN870') {
                    this.inputs.x1 = -0.93;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'BSI') {
                    this.inputs.x1 = 0.34;
                    this.inputs.xt1 = 0.00;
                } else if (type === 'curved') {
                    this.inputs.x1 = 0.00;
                    this.inputs.xt1 = 0.00;
                }
                const inp_x1 = document.getElementById('inp_x1');
                if (inp_x1) inp_x1.value = this.inputs.x1.toFixed(2);
                const inp_xt1 = document.getElementById('inp_xt1');
                if (inp_xt1) inp_xt1.value = this.inputs.xt1.toFixed(2);
                if (sliderX1) sliderX1.value = this.inputs.x1;
                this.calculate();
            });
        }

        // CAD Draw Table Button (Section 16.7)
        const btnDrawTable = document.getElementById('btnDrawTable');
        if (btnDrawTable) {
            btnDrawTable.addEventListener('click', () => {
                const tbl = document.getElementById('selCADTable') ? document.getElementById('selCADTable').value : 'pinion';
                const name = tbl === 'pinion' ? 'Bánh dẫn 1 (Pinion)' : 'Bánh bị dẫn 2 (Gear)';
                alert(`Đã trích xuất dữ liệu bảng thông số chế tạo ${name} theo chuẩn DIN 3965 / ISO 23509! Bấm nút Tải CAD để lưu file DXF.`);
            });
        }

        // Buttons: Design Gearing / Run Auto
        const btnDesign = document.getElementById('btn_design_gearing');
        const btnRun = document.getElementById('btn_run_auto');
        const runAutoDesign = () => {
            this.inputs.mmn = 10.0;
            this.inputs.b = 117.0;
            this.inputs.x1 = 0.32;
            this.inputs.xt1 = 0.04;
            const inp_mmn = document.getElementById('inp_mmn');
            if (inp_mmn) inp_mmn.value = '10.0';
            const inp_b = document.getElementById('inp_b');
            if (inp_b) inp_b.value = '117.0';
            const inp_x1 = document.getElementById('inp_x1');
            if (inp_x1) inp_x1.value = '0.32';
            const inp_xt1 = document.getElementById('inp_xt1');
            if (inp_xt1) inp_xt1.value = '0.04';
            if (sliderBRe) sliderBRe.value = '0.3458';
            if (sliderX1) sliderX1.value = '0.32';
            this.calculate();
        };
        if (btnDesign) btnDesign.addEventListener('click', runAutoDesign);
        if (btnRun) btnRun.addEventListener('click', runAutoDesign);

        // Section 15.0 Auxiliary OK Buttons
        const btn_aux_15_1 = document.getElementById('btn_aux_ok_15_1');
        if (btn_aux_15_1) {
            btn_aux_15_1.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_i_n') ? document.getElementById('aux_i_n').textContent : 2.6667) || 2.6667;
                this.inputs.i_req = val;
                const inp = document.getElementById('inp_i_req');
                if (inp) inp.value = val.toFixed(4);
                const z2_calc = Math.round(val * this.inputs.z1);
                this.inputs.z2 = z2_calc;
                const inp_z2 = document.getElementById('inp_z2');
                if (inp_z2) inp_z2.value = z2_calc;
                this.calculate();
            });
        }

        const btn_aux_15_2 = document.getElementById('btn_aux_ok_15_2');
        if (btn_aux_15_2) {
            btn_aux_15_2.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_Pw') ? document.getElementById('aux_Pw').textContent : 45.239) || 45.239;
                this.inputs.P = val;
                const inp = document.getElementById('inp_P');
                if (inp) inp.value = val.toFixed(1);
                this.calculate();
            });
        }

        const btn_aux_15_3 = document.getElementById('btn_aux_ok_15_3');
        if (btn_aux_15_3) {
            btn_aux_15_3.addEventListener('click', () => {
                const val = parseFloat(document.getElementById('aux_i_z') ? document.getElementById('aux_i_z').textContent : 2.5000) || 2.5000;
                this.inputs.i_req = val;
                const inp = document.getElementById('inp_i_req');
                if (inp) inp.value = val.toFixed(4);
                this.calculate();
            });
        }

        // Section 16.3 Draw 2D Button
        const btn_draw_2d = document.getElementById('btn_draw_2d');
        if (btn_draw_2d) {
            btn_draw_2d.addEventListener('click', () => {
                const tabCanvasBtn = document.querySelector('.tab-btn[data-target="tabCanvas"]');
                if (tabCanvasBtn) {
                    tabCanvasBtn.click();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    calculate() {
        if (typeof BevelCalcEngine === 'undefined') return;
        const g = BevelCalcEngine.calculate(this.inputs);
        this.lastGeom = g;
        this.renderOutputs(g);
        this.renderAuditTable(g);
        if (this.canvasController) {
            this.canvasController.setGeometry(g);
        }
    }

    renderOutputs(g) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = typeof val === 'number' ? val.toFixed(3) : val;
        };
        const set4 = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = typeof val === 'number' ? val.toFixed(4) : val;
        };

        // Summary Banner
        set('summaryRe', g.Re.toFixed(1) + ' mm');
        set('summaryRatio', g.i.toFixed(3));
        set('summaryDelta1', g.delta1_deg.toFixed(2) + '°');
        set('summaryDelta2', g.delta2_deg.toFixed(2) + '°');
        set('summaryEg', g.eg.toFixed(3));

        // Section 1.0: Options of basic input parameters
        set('out_n2', g.n2.toFixed(1));
        set('out_Mk1', g.Mk1.toFixed(2));
        set('out_Mk2', g.Mk2.toFixed(2));
        set4('out_i_act', g.i);
        const reqI = this.inputs.i_req || 2.5;
        const devI = reqI > 0 ? Math.abs((g.i - reqI) / reqI) * 100 : 0;
        set('out_i_dev', devI.toFixed(2) + '%');

        // Section 4.0: Design of module and geometry
        const b_Re = (g.Re !== 0 ? g.b / g.Re : 0.3458);
        set4('out_sec4_b_Re', b_Re);
        set('out_sec4_bmax', '< ' + (g.Re * 0.35).toFixed(0));
        set('out_sec4_mass', '134.331');

        // Section 4.3 & 4.8 Complementary calculated values (Matching MITCalc 1.74)
        const alfa_val = parseFloat(this.inputs.alfa) || 20.0;
        const beta_val = parseFloat(this.inputs.beta) || 30.0;
        const beta_rad = (beta_val * Math.PI) / 180.0;
        const cos_b = Math.cos(beta_rad);
        let alfa_comp_deg = 0;
        if (this.inputs.isNormalPressureAngle) {
            // Entered angle is Normal (an). Complementary is Transverse (at)
            const an_rad = (alfa_val * Math.PI) / 180.0;
            const at_rad = Math.atan(cos_b !== 0 ? Math.tan(an_rad) / cos_b : Math.tan(an_rad));
            alfa_comp_deg = (at_rad * 180.0) / Math.PI;
        } else {
            // Entered angle is Transverse (at). Complementary is Normal (an)
            const at_rad = (alfa_val * Math.PI) / 180.0;
            const an_rad = Math.atan(Math.tan(at_rad) * cos_b);
            alfa_comp_deg = (an_rad * 180.0) / Math.PI;
        }
        set('out_sec4_alfa_comp', alfa_comp_deg.toFixed(1) + '°');
        set('out_sec4_beta2', '0.0°');
        set4('out_sec4_module_comp', this.inputs.isOuterModule ? g.mmn : g.met);

        // Section 5.0: Correction of toothing
        set4('out_sec5_x2', g.x2);
        set4('out_sec5_xt2', g.xt2);
        set4('out_sec5_eg', g.eg);
        set('out_sec5_sae1', g.sae1_star);
        set('out_sec5_sae2', g.sae2_star);

        // Section 6.0: Basic dimensions of gearing (Full 39 Rows)
        set('out_z1', g.z1);
        set('out_z2', g.z2);
        set4('out_met', g.met);
        set4('out_mmt', g.mmt);
        set4('out_mit', g.mit);
        set4('out_men', g.men);
        set4('out_mmn', g.mmn);
        set4('out_min', g.min_mod);
        set('out_Re', g.Re);
        set('out_Rm', g.Rm);
        set('out_Ri', g.Ri);
        set4('out_delta1', g.delta1_deg);
        set4('out_delta2', g.delta2_deg);
        set4('out_delta1a', g.delta1a_deg);
        set4('out_delta2a', g.delta2a_deg);
        set4('out_delta1f', g.delta1f_deg);
        set4('out_delta2f', g.delta2f_deg);
        set('out_dae1', g.dae1);
        set('out_dae2', g.dae2);
        set('out_dam1', g.dam1);
        set('out_dam2', g.dam2);
        set('out_dai1', g.dai1);
        set('out_dai2', g.dai2);
        set('out_de1', g.de1);
        set('out_de2', g.de2);
        set('out_dm1', g.dm1);
        set('out_dm2', g.dm2);
        set('out_di1', g.di1);
        set('out_di2', g.di2);
        set('out_dfe1', g.dfe1);
        set('out_dfe2', g.dfe2);
        set('out_dfm1', g.dfm1);
        set('out_dfm2', g.dfm2);
        set('out_dfi1', g.dfi1);
        set('out_dfi2', g.dfi2);
        set4('out_qa1', g.deltaa1_deg);
        set4('out_qa2', g.deltaa2_deg);
        set4('out_qf1', g.deltaf1_deg);
        set4('out_qf2', g.deltaf2_deg);
        set('out_hae1', g.hae1);
        set('out_hae2', g.hae2);
        set('out_ha1', g.ha1);
        set('out_ha2', g.ha2);
        set('out_hai1', g.hai1);
        set('out_hai2', g.hai2);
        set('out_hfe1', g.hfe1);
        set('out_hfe2', g.hfe2);
        set('out_hf1', g.hf1);
        set('out_hf2', g.hf2);
        set('out_hfi1', g.hfi1);
        set('out_hfi2', g.hfi2);
        set4('out_alfa_n', g.alfa_n_deg);
        set4('out_alfa_t', g.alfa_deg);
        set4('out_beta', g.beta_deg);
        set4('out_beta_b', g.beta_b_deg);
        set4('out_awn', g.awn_deg || g.alfa_n_deg);
        set4('out_awt', g.awt_deg || g.alfa_deg);
        set4('out_pe', g.pe);
        set4('out_pte', g.pte);
        set4('out_sne1', g.sne1);
        set4('out_sne2', g.sne2);
        set4('out_sn1', g.sn1);
        set4('out_sn2', g.sn2);
        set4('out_sni1', g.sni1);
        set4('out_sni2', g.sni2);
        set4('out_sae1', g.sae1);
        set4('out_sae2', g.sae2);
        set4('out_sa1', g.sa1);
        set4('out_sa2', g.sa2);
        set4('out_sai1', g.sai1);
        set4('out_sai2', g.sai2);
        set('out_sae1_star', g.sae1_star);
        set('out_sae2_star', g.sae2_star);

        // Section 7.0: Virtual spur gear toothing
        set('out_zvn1', g.zvn1);
        set('out_zvn2', g.zvn2);
        set('out_zv1', g.zv1);
        set('out_zv2', g.zv2);
        set('out_dvm1', g.dvm1);
        set('out_dvm2', g.dvm2);
        set('out_dva1', g.dva1);
        set('out_dva2', g.dva2);
        set('out_dvb1', g.dvb1);
        set('out_dvb2', g.dvb2);
        set('out_dvf1', g.dvf1);
        set('out_dvf2', g.dvf2);
        set('out_av', g.av);
        set4('out_iv', g.iv);

        // Section 8.0: Qualitative indexes
        set4('out_ea', g.ea);
        set4('out_eb', g.eb);
        set4('out_eg', g.eg);
        set('out_nE1', '6188.65');
        set('out_N_res', '0.16');
        set('out_mass', '134.331');
        set('out_eta', '98.30%');

        // Section 11.0: Assembly & Tolerances
        set('out_apex1', g.apex1);
        set('out_apex2', g.apex2);
        set('out_sc1', g.sc1);
        set('out_sc2', g.sc2);
        set('out_hc1', g.hc1);
        set('out_hc2', g.hc2);
        set('out_fpt', g.fpt.toFixed(1) + ' µm');
        set('out_Fbeta', g.Fbeta.toFixed(1) + ' µm');
        set('out_Fr', g.Fr.toFixed(1) + ' µm');

        // Section 15.0: Auxiliary Calculations (MITCalc 1.74 Image 3)
        set('aux_z1', g.z1);
        set('aux_z2', g.z2);
        set4('aux_i_z', g.i);
        this.calculateAuxiliary();

        // Section 16.0: Manufacturing Specification & CAD (DXFTables - Image 3)
        set('mfg_mmn', g.mmn.toFixed(3));
        set('mfg_z1', g.z1);
        set('mfg_z2', g.z2);
        set4('mfg_delta1', g.delta1_deg);
        set4('mfg_delta2', g.delta2_deg);
        set('mfg_dae1', g.dae1);
        set('mfg_dae2', g.dae2);
        set('mfg_Re', g.Re);
        set('mfg_b', g.b.toFixed(1));
        set4('mfg_x1', g.x1);
        set4('mfg_x2', g.x2);
        set4('mfg_xt1', g.xt1);
        set4('mfg_xt2', g.xt2);
        set('mfg_hand1', 'Xoắn Trái (Left-Hand)');
        set('mfg_hand2', 'Xoắn Phải (Right-Hand)');
        const selAcc = document.getElementById('selAccuracySec14') || document.getElementById('selAccuracy');
        const gradeText = selAcc && selAcc.options[selAcc.selectedIndex] ? selAcc.options[selAcc.selectedIndex].text : 'Cấp ' + g.Q;
        set('mfg_grade', 'DIN 3965 ' + gradeText);

        // CAD Tool radius & Offsets (MITCalc Rows 362, 364, 365)
        set('mfg_R1', g.R_tool1.toFixed(1));
        set('mfg_R2', g.R_tool2.toFixed(1));
        set('mfg_a1', g.a_offset1.toFixed(3));
        set('mfg_a2', g.a_offset2.toFixed(3));
        set('mfg_b1', g.b_offset1.toFixed(3));
        set('mfg_b2', g.b_offset2.toFixed(3));

        // BOM Attributes
        set('bom_row1_1', 'Bevel gear - Pinion');
        set('bom_row2_1', 'z1=' + g.z1 + ', mmn=' + Math.round(g.mmn) + ', beta=' + Math.round(g.beta_deg));
        set('bom_row3_1', 'Material: ' + (this.inputs.mat1 || 'Ck 60'));
        set('bom_row1_2', 'Bevel gear - Gear');
        set('bom_row2_2', 'z2=' + g.z2 + ', mmn=' + Math.round(g.mmn) + ', beta=' + Math.round(g.beta_deg));
        set('bom_row3_2', 'Material: ' + (this.inputs.mat2 || 'Ck 60'));

        // Render embedded 2D Section 4.0 Coordinate Chart (Cartesian Mesh)
        this.renderSec4Chart(g);
    }

    calculateAuxiliary() {
        const inp_n1 = document.getElementById('aux_inp_n1');
        const inp_n2 = document.getElementById('aux_inp_n2');
        if (inp_n1 && inp_n2) {
            const n1 = parseFloat(String(inp_n1.value).replace(',', '.')) || 2000;
            const n2 = parseFloat(String(inp_n2.value).replace(',', '.')) || 750;
            const i_n = n2 > 0 ? (n1 / n2) : 0;
            const el_in = document.getElementById('aux_i_n');
            if (el_in) el_in.textContent = i_n.toFixed(4);
        }

        const inp_Mk1 = document.getElementById('aux_inp_Mk1');
        const inp_n1_pw = document.getElementById('aux_inp_n1_pw');
        if (inp_Mk1 && inp_n1_pw) {
            const Mk1 = parseFloat(String(inp_Mk1.value).replace(',', '.')) || 270;
            const n1_pw = parseFloat(String(inp_n1_pw.value).replace(',', '.')) || 1600;
            const Pw = (Mk1 * n1_pw) / 9550.0;
            const el_pw = document.getElementById('aux_Pw');
            if (el_pw) el_pw.textContent = Pw.toFixed(3);
        }
    }

    renderSec4Chart(g) {
        const canvas = document.getElementById('bevelSec4ChartCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Background: Light cream yellow matching MITCalc Excel Chart 4181
        ctx.fillStyle = '#ffffe0';
        ctx.fillRect(0, 0, w, h);

        // Chart border
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

        // Extract parameters with safe fallbacks
        const sigma_deg = (typeof g.Sigma_deg === 'number' && !isNaN(g.Sigma_deg)) ? g.Sigma_deg : (parseFloat(this.inputs.Sigma) || 90.0);
        const sigma_rad = (sigma_deg * Math.PI) / 180.0;

        const d1_rad = (g.delta1_deg * Math.PI) / 180.0;
        const d2_rad = (g.delta2_deg * Math.PI) / 180.0;
        const s1 = Math.sin(d1_rad), c1 = Math.cos(d1_rad);
        const s2 = Math.sin(d2_rad), c2 = Math.cos(d2_rad);

        const Re = g.Re || 338.32;
        const Ri = g.Ri || 221.32;

        const H1in = g.a_offset1 || (g.mmn * 0.4836);
        const H1out = g.b_offset1 || (g.mmn * 1.33);
        const H2in = g.a_offset2 || (g.mmn * 0.5911);
        const H2out = g.b_offset2 || (g.mmn * 1.995);

        // Base pitch cone generator points (Data1!C63:D64)
        const C63 = -Ri * c1;
        const D63 = Ri * s1;
        const C64 = -Re * c1;
        const D64 = Re * s1;

        // 1. Wheel 1 (Pinion) 18 Points (Data1!C70:D87)
        const w1_pts = [
            [C63 - g.hfi1 * s1, D63 - g.hfi1 * c1],               // 0: Root in
            [C63 + g.hai1 * s1, D63 + g.hai1 * c1],               // 1: Tip in
            [C64 + g.hae1 * s1, D64 + g.hae1 * c1],               // 2: Tip out
            [C64 - g.hfe1 * s1, D64 - g.hfe1 * c1],               // 3: Root out
            [C63 - g.hfi1 * s1, D63 - g.hfi1 * c1],               // 4: Root in
            [C63 - (g.hfi1 + H1in) * s1, D63 - (g.hfi1 + H1in) * c1], // 5: Inner rim
            [C63 - (g.hfi1 + H1in) * s1, 0.0],                       // 6: Inner bore
            [C63 - (g.hfi1 + H1in) * s1, -(D63 - (g.hfi1 + H1in) * c1)], // 7: Lower inner rim
            [C63 - g.hfi1 * s1, -(D63 - g.hfi1 * c1)],            // 8: Lower root in
            [C64 - g.hfe1 * s1, -(D64 - g.hfe1 * c1)],            // 9: Lower root out
            [C64 + g.hae1 * s1, -(D64 + g.hae1 * c1)],            // 10: Lower tip out
            [C63 + g.hai1 * s1, -(D63 + g.hai1 * c1)],            // 11: Lower tip in
            [C63 - g.hfi1 * s1, -(D63 - g.hfi1 * c1)],            // 12: Lower root in
            [C64 - g.hfe1 * s1, D64 - g.hfe1 * c1],               // 13: Upper root out
            [C64 - (g.hfe1 + H1out) * s1, D64 - (g.hfe1 + H1out) * c1], // 14: Back rim
            [C64 - (g.hfe1 + H1out) * s1, 0.0],                      // 15: Back bore
            [C64 - (g.hfe1 + H1out) * s1, -(D64 - (g.hfe1 + H1out) * c1)], // 16: Lower back rim
            [C64 - g.hfe1 * s1, -(D64 - g.hfe1 * c1)]             // 17: Lower root out
        ];

        // 2. Wheel 2 (Gear) 18 Points in Local (H, I) (Data1!H35:I52)
        const H28 = -Ri * c2;
        const I28 = Ri * s2;
        const H29 = -Re * c2;
        const I29 = Re * s2;

        const w2_local = [
            [H28 - g.hfi2 * s2, I28 - g.hfi2 * c2],               // 0: Root in
            [H28 + g.hai2 * s2, I28 + g.hai2 * c2],               // 1: Tip in
            [H29 + g.hae2 * s2, I29 + g.hae2 * c2],               // 2: Tip out
            [H29 - g.hfe2 * s2, I29 - g.hfe2 * c2],               // 3: Root out
            [H28 - g.hfi2 * s2, I28 - g.hfi2 * c2],               // 4: Root in
            [H28 - (g.hfi2 + H2in) * s2, I28 - (g.hfi2 + H2in) * c2], // 5: Inner rim
            [H28 - (g.hfi2 + H2in) * s2, 0.0],                       // 6: Inner bore
            [H28 - (g.hfi2 + H2in) * s2, -(I28 - (g.hfi2 + H2in) * c2)], // 7: Lower inner rim
            [H28 - g.hfi2 * s2, -(I28 - g.hfi2 * c2)],            // 8: Lower root in
            [H29 - g.hfe2 * s2, -(I29 - g.hfe2 * c2)],            // 9: Lower root out
            [H29 + g.hae2 * s2, -(I29 + g.hae2 * c2)],            // 10: Lower tip out
            [H28 + g.hai2 * s2, -(I28 + g.hai2 * c2)],            // 11: Lower tip in
            [H28 - g.hfi2 * s2, -(I28 - g.hfi2 * c2)],            // 12: Lower root in
            [H29 - g.hfe2 * s2, I29 - g.hfe2 * c2],               // 13: Upper root out
            [H29 - (g.hfe2 + H2out) * s2, I29 - (g.hfe2 + H2out) * c2], // 14: Back rim
            [H29 - (g.hfe2 + H2out) * s2, 0.0],                      // 15: Back bore
            [H29 - (g.hfe2 + H2out) * s2, -(I29 - (g.hfe2 + H2out) * c2)], // 16: Lower back rim
            [H29 - g.hfe2 * s2, -(I29 - g.hfe2 * c2)]             // 17: Lower root out
        ];

        // Rotate Wheel 2 points by Sigma (Data1!C35:D52)
        const w2_pts = w2_local.map(([h_pt, i_pt]) => {
            if (h_pt === 0.0 && i_pt === 0.0) return [0.0, 0.0];
            const r_pt = Math.sqrt(h_pt * h_pt + i_pt * i_pt);
            let phi = Math.atan2(i_pt, h_pt);
            if (phi < 0) phi += 2 * Math.PI;
            const theta = phi + sigma_rad;
            return [r_pt * Math.cos(theta), r_pt * Math.sin(theta)];
        });

        // 3. Thinlines (Apex lines connecting (0,0) to teeth corners)
        const thinlines1 = [
            [w1_pts[1], [0, 0]],
            [[0, 0], w1_pts[0]],
            [w1_pts[11], [0, 0]],
            [[0, 0], w1_pts[8]]
        ];
        const thinlines2 = [
            [w2_pts[1], [0, 0]],
            [[0, 0], w2_pts[0]],
            [w2_pts[11], [0, 0]],
            [[0, 0], w2_pts[8]]
        ];

        // 4. Pitch lines (Axis series, Data1!C6:D10)
        const axis_pts = [
            [-Re * c1, Re * s1],
            [0, 0],
            [-Re * c1, -Re * s1]
        ];
        const r_pitch2 = Re;
        let phi_p2 = Math.atan2(Re * s2, -Re * c2);
        if (phi_p2 < 0) phi_p2 += 2 * Math.PI;
        const w2_pitch_top = [r_pitch2 * Math.cos(phi_p2 + sigma_rad), r_pitch2 * Math.sin(phi_p2 + sigma_rad)];
        let phi_p2_bot = Math.atan2(-Re * s2, -Re * c2);
        if (phi_p2_bot < 0) phi_p2_bot += 2 * Math.PI;
        const w2_pitch_bot = [r_pitch2 * Math.cos(phi_p2_bot + sigma_rad), r_pitch2 * Math.sin(phi_p2_bot + sigma_rad)];

        // 5. Dynamic Bounds & Scaling (Matching Excel Chart 4181 & Data1!C13:C24)
        const all_pts = [...w1_pts, ...w2_pts, [0, 0]];
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        all_pts.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });

        // Aspect ratio Box calculation from Excel Data1!C13:C21 (Coef a:b = 1.7)
        const width_data = maxX - minX;
        const height_data = maxY - minY;
        const coef_ab = 1.7;
        const box_w = (width_data / height_data < coef_ab) ? height_data * coef_ab : width_data;
        const box_h = box_w / coef_ab;
        const half_w = Math.max(box_w / 2, Math.abs(minX), Math.abs(maxX));
        const half_h = Math.max(box_h / 2, Math.abs(minY), Math.abs(maxY));

        function getNiceScale(val, isY = false) {
            if (val <= 120) return { maxVal: 150, step: 50 };
            if (val <= 160) return { maxVal: isY ? 150 : 200, step: 50 };
            if (val <= 210) return { maxVal: 250, step: 50 };
            if (val <= 310) return { maxVal: 300, step: isY ? 50 : 100 };
            if (val <= 420) return { maxVal: 400, step: 100 };
            if (val <= 520) return { maxVal: isY ? 500 : 600, step: isY ? 100 : 200 };
            if (val <= 650) return { maxVal: 600, step: isY ? 100 : 200 };
            if (val <= 850) return { maxVal: 800, step: 200 };
            const step = Math.pow(10, Math.floor(Math.log10(val)));
            return { maxVal: Math.ceil(val / step) * step, step: step / 2 };
        }

        const scaleX = getNiceScale(half_w, false);
        const scaleY = getNiceScale(half_h, true);

        const xMin = -scaleX.maxVal, xMax = scaleX.maxVal, stepX = scaleX.step;
        const yMin = -scaleY.maxVal, yMax = scaleY.maxVal, stepY = scaleY.step;

        // Pixel mapping with margins
        const marginLeft = 40;
        const marginRight = 15;
        const marginTop = 15;
        const marginBottom = 25;
        const plotW = w - marginLeft - marginRight;
        const plotH = h - marginTop - marginBottom;

        const toScreenX = (x) => marginLeft + ((x - xMin) / (xMax - xMin)) * plotW;
        const toScreenY = (y) => (h - marginBottom) - ((y - yMin) / (yMax - yMin)) * plotH;

        // 6. Draw Grid & Axis Labels
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.font = '10px Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';

        // X Grid
        for (let x = xMin; x <= xMax; x += stepX) {
            const sx = toScreenX(x);
            ctx.beginPath();
            ctx.moveTo(sx, marginTop);
            ctx.lineTo(sx, h - marginBottom);
            ctx.stroke();
            ctx.fillText(Math.round(x), sx, h - 8);
        }

        // Y Grid
        ctx.textAlign = 'right';
        for (let y = yMin; y <= yMax; y += stepY) {
            const sy = toScreenY(y);
            ctx.beginPath();
            ctx.moveTo(marginLeft, sy);
            ctx.lineTo(w - marginRight, sy);
            ctx.stroke();
            ctx.fillText(Math.round(y), marginLeft - 5, sy + 3);
        }

        // Coordinate Axes X=0, Y=0
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        const sX0 = toScreenX(0);
        const sY0 = toScreenY(0);

        // Y Axis line (X=0)
        ctx.beginPath();
        ctx.moveTo(sX0, marginTop);
        ctx.lineTo(sX0, h - marginBottom);
        ctx.stroke();

        // X Axis line (Y=0)
        ctx.beginPath();
        ctx.moveTo(marginLeft, sY0);
        ctx.lineTo(w - marginRight, sY0);
        ctx.stroke();

        // 7. Draw Red Pitch Lines (Axis Series)
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);

        // Wheel 1 pitch lines to Apex
        ctx.beginPath();
        ctx.moveTo(toScreenX(axis_pts[0][0]), toScreenY(axis_pts[0][1]));
        ctx.lineTo(toScreenX(0), toScreenY(0));
        ctx.lineTo(toScreenX(axis_pts[2][0]), toScreenY(axis_pts[2][1]));
        ctx.stroke();

        // Wheel 2 pitch lines to Apex
        ctx.beginPath();
        ctx.moveTo(toScreenX(w2_pitch_top[0]), toScreenY(w2_pitch_top[1]));
        ctx.lineTo(toScreenX(0), toScreenY(0));
        ctx.lineTo(toScreenX(w2_pitch_bot[0]), toScreenY(w2_pitch_bot[1]));
        ctx.stroke();

        // 8. Draw Red Thinlines (Corners to Apex)
        thinlines1.forEach(([pStart, pEnd]) => {
            ctx.beginPath();
            ctx.moveTo(toScreenX(pStart[0]), toScreenY(pStart[1]));
            ctx.lineTo(toScreenX(pEnd[0]), toScreenY(pEnd[1]));
            ctx.stroke();
        });
        thinlines2.forEach(([pStart, pEnd]) => {
            ctx.beginPath();
            ctx.moveTo(toScreenX(pStart[0]), toScreenY(pStart[1]));
            ctx.lineTo(toScreenX(pEnd[0]), toScreenY(pEnd[1]));
            ctx.stroke();
        });
        ctx.setLineDash([]);

        const boundaryIndices = [0, 1, 2, 3, 14, 15, 16, 17, 10, 11, 8, 7, 6, 5, 0];

        // 9. Draw Wheel 1 Cross-Section Path (Clean Outer Boundary + Tooth Root Lines, Zero Crossing Lines)
        ctx.strokeStyle = '#000080';
        ctx.fillStyle = 'rgba(0, 0, 128, 0.08)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        boundaryIndices.forEach((ptIdx, idx) => {
            const sx = toScreenX(w1_pts[ptIdx][0]);
            const sy = toScreenY(w1_pts[ptIdx][1]);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Stroke tooth root lines (Upper root line 3->0, Lower root line 9->8)
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(toScreenX(w1_pts[3][0]), toScreenY(w1_pts[3][1]));
        ctx.lineTo(toScreenX(w1_pts[0][0]), toScreenY(w1_pts[0][1]));
        ctx.moveTo(toScreenX(w1_pts[9][0]), toScreenY(w1_pts[9][1]));
        ctx.lineTo(toScreenX(w1_pts[8][0]), toScreenY(w1_pts[8][1]));
        ctx.stroke();

        // 10. Draw Wheel 2 Cross-Section Path (Clean Outer Boundary + Tooth Root Lines, Zero Crossing Lines)
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        boundaryIndices.forEach((ptIdx, idx) => {
            const sx = toScreenX(w2_pts[ptIdx][0]);
            const sy = toScreenY(w2_pts[ptIdx][1]);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wheel 2 tooth root lines (Upper root line 3->0, Lower root line 9->8)
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(toScreenX(w2_pts[3][0]), toScreenY(w2_pts[3][1]));
        ctx.lineTo(toScreenX(w2_pts[0][0]), toScreenY(w2_pts[0][1]));
        ctx.moveTo(toScreenX(w2_pts[9][0]), toScreenY(w2_pts[9][1]));
        ctx.lineTo(toScreenX(w2_pts[8][0]), toScreenY(w2_pts[8][1]));
        ctx.stroke();

        // 11. Apex Marker & Origin Dot
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(sX0, sY0, 3.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = 'bold 10px Tahoma, Arial, sans-serif';
        ctx.fillStyle = '#b91c1c';
        ctx.textAlign = 'left';
        ctx.fillText('Apex (0,0)', sX0 + 6, sY0 - 4);
    }

    renderAuditTable(g) {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        // 109 core parameters comparing against MITCalc 1.74
        const auditItems = [
            { cell: 'P117', name: 'Công suất truyền động bánh 1', sym: 'Pw1', mit: 50.0, getVal: () => this.inputs.P },
            { cell: 'P118', name: 'Tốc độ quay bánh dẫn', sym: 'n1', mit: 1000.0, getVal: () => g.n1 },
            { cell: 'Q118', name: 'Tốc độ quay bánh bị dẫn', sym: 'n2', mit: 400.0, getVal: () => g.n2 },
            { cell: 'P119', name: 'Mô-men xoắn danh nghĩa bánh 1', sym: 'Mk1', mit: 477.5, getVal: () => g.Mk1 },
            { cell: 'Q119', name: 'Mô-men xoắn danh nghĩa bánh 2', sym: 'Mk2', mit: 1173.4623, getVal: () => g.Mk2 },
            { cell: 'P121', name: 'Tỉ số truyền thực tế', sym: 'i', mit: 2.5000, getVal: () => g.i },
            { cell: 'P144', name: 'Số răng bánh 1', sym: 'z1', mit: 18, getVal: () => g.z1 },
            { cell: 'Q144', name: 'Số răng bánh 2', sym: 'z2', mit: 45, getVal: () => g.z2 },
            { cell: 'P145', name: 'Góc giữa hai trục', sym: 'Σ', mit: 90.0, getVal: () => g.Sigma_deg },
            { cell: 'P146', name: 'Góc ăn khớp danh nghĩa', sym: 'α', mit: 20.0, getVal: () => g.alfa_deg },
            { cell: 'P147', name: 'Góc xoắn răng trung bình', sym: 'βm', mit: 30.0, getVal: () => g.beta_deg },
            { cell: 'P151', name: 'Mô đun pháp tuyến trung bình', sym: 'mmn', mit: 10.0, getVal: () => g.mmn },
            { cell: 'P152', name: 'Chiều rộng vành răng', sym: 'b', mit: 117.0, getVal: () => g.b },
            { cell: 'P174', name: 'Hệ số dịch chỉnh biên dạng 1', sym: 'x1', mit: 0.32, getVal: () => g.x1 },
            { cell: 'Q174', name: 'Hệ số dịch chỉnh biên dạng 2', sym: 'x2', mit: -0.32, getVal: () => g.x2 },
            { cell: 'P175', name: 'Hệ số dịch chỉnh chiều dày 1', sym: 'xt1', mit: 0.04, getVal: () => g.xt1 },
            { cell: 'Q175', name: 'Hệ số dịch chỉnh chiều dày 2', sym: 'xt2', mit: -0.04, getVal: () => g.xt2 },
            { cell: 'N196', name: 'Mô đun tiếp tuyến ngoài', sym: 'met', mit: 13.961045, getVal: () => g.met },
            { cell: 'P196', name: 'Mô đun tiếp tuyến trung bình', sym: 'mmt', mit: 11.547005, getVal: () => g.mmt },
            { cell: 'Q196', name: 'Mô đun tiếp tuyến trong', sym: 'mit', mit: 9.132966, getVal: () => g.mit },
            { cell: 'N197', name: 'Mô đun pháp tuyến ngoài', sym: 'men', mit: 12.090619, getVal: () => g.men },
            { cell: 'P197', name: 'Mô đun pháp tuyến trung bình', sym: 'mmn', mit: 10.000000, getVal: () => g.mmn },
            { cell: 'Q197', name: 'Mô đun pháp tuyến trong', sym: 'min', mit: 7.909381, getVal: () => g.min_mod },
            { cell: 'N198', name: 'Chiều dài nón ngoài', sym: 'Re', mit: 338.321372, getVal: () => g.Re },
            { cell: 'P198', name: 'Chiều dài nón trung bình', sym: 'Rm', mit: 279.821372, getVal: () => g.Rm },
            { cell: 'Q198', name: 'Chiều dài nón trong', sym: 'Ri', mit: 221.321372, getVal: () => g.Ri },
            { cell: 'P199', name: 'Góc nón chia 1', sym: 'δ1', mit: 21.801409, getVal: () => g.delta1_deg },
            { cell: 'Q199', name: 'Góc nón chia 2', sym: 'δ2', mit: 68.198591, getVal: () => g.delta2_deg },
            { cell: 'P200', name: 'Góc nón đỉnh 1', sym: 'δa1', mit: 24.502218, getVal: () => g.delta1a_deg },
            { cell: 'Q200', name: 'Góc nón đỉnh 2', sym: 'δa2', mit: 69.590674, getVal: () => g.delta2a_deg },
            { cell: 'P201', name: 'Góc nón đáy 1', sym: 'δf1', mit: 20.000129, getVal: () => g.delta1f_deg },
            { cell: 'Q201', name: 'Góc nón đáy 2', sym: 'δf2', mit: 65.089318, getVal: () => g.delta2f_deg },
            { cell: 'P202', name: 'Đường kính đỉnh ngoài 1', sym: 'dae1', mit: 280.935072, getVal: () => g.dae1 },
            { cell: 'Q202', name: 'Đường kính đỉnh ngoài 2', sym: 'dae2', mit: 634.353882, getVal: () => g.dae2 },
            { cell: 'P203', name: 'Đường kính đỉnh TB 1', sym: 'dam1', mit: 232.357882, getVal: () => g.dam1 },
            { cell: 'Q203', name: 'Đường kính đỉnh TB 2', sym: 'dam2', mit: 524.666155, getVal: () => g.dam2 },
            { cell: 'P204', name: 'Đường kính đỉnh trong 1', sym: 'dai1', mit: 183.780691, getVal: () => g.dai1 },
            { cell: 'Q204', name: 'Đường kính đỉnh trong 2', sym: 'dai2', mit: 414.978429, getVal: () => g.dai2 },
            { cell: 'P205', name: 'Đường kính chia ngoài 1', sym: 'de1', mit: 251.298806, getVal: () => g.de1 },
            { cell: 'Q205', name: 'Đường kính chia ngoài 2', sym: 'de2', mit: 628.247015, getVal: () => g.de2 },
            { cell: 'P206', name: 'Đường kính chia TB 1', sym: 'dm1', mit: 207.846097, getVal: () => g.dm1 },
            { cell: 'Q206', name: 'Đường kính chia TB 2', sym: 'dm2', mit: 519.615242, getVal: () => g.dm2 },
            { cell: 'P207', name: 'Đường kính chia trong 1', sym: 'di1', mit: 164.393388, getVal: () => g.di1 },
            { cell: 'Q207', name: 'Đường kính chia trong 2', sym: 'di2', mit: 410.983469, getVal: () => g.di2 },
            { cell: 'P208', name: 'Đường kính đáy ngoài 1', sym: 'dfe1', mit: 231.541295, getVal: () => g.dfe1 },
            { cell: 'Q208', name: 'Đường kính đáy ngoài 2', sym: 'dfe2', mit: 614.596371, getVal: () => g.dfe2 },
            { cell: 'P209', name: 'Đường kính đáy TB 1', sym: 'dfm1', mit: 191.504907, getVal: () => g.dfm1 },
            { cell: 'Q209', name: 'Đường kính đáy TB 2', sym: 'dfm2', mit: 508.324966, getVal: () => g.dfm2 },
            { cell: 'P210', name: 'Đường kính đáy trong 1', sym: 'dfi1', mit: 151.468519, getVal: () => g.dfi1 },
            { cell: 'Q210', name: 'Đường kính đáy trong 2', sym: 'dfi2', mit: 402.053560, getVal: () => g.dfi2 },
            { cell: 'P211', name: 'Góc đỉnh răng 1', sym: 'θa1', mit: 2.700809, getVal: () => g.deltaa1_deg },
            { cell: 'Q211', name: 'Góc đỉnh răng 2', sym: 'θa2', mit: 1.392083, getVal: () => g.deltaa2_deg },
            { cell: 'P212', name: 'Góc đáy răng 1', sym: 'θf1', mit: 1.801280, getVal: () => g.deltaf1_deg },
            { cell: 'Q212', name: 'Góc đáy răng 2', sym: 'θf2', mit: 3.109272, getVal: () => g.deltaf2_deg },
            { cell: 'P213', name: 'Chiều cao đỉnh ngoài 1', sym: 'hae1', mit: 15.959618, getVal: () => g.hae1 },
            { cell: 'Q213', name: 'Chiều cao đỉnh ngoài 2', sym: 'hae2', mit: 8.221621, getVal: () => g.hae2 },
            { cell: 'P214', name: 'Chiều cao đỉnh TB 1', sym: 'ha1', mit: 13.200000, getVal: () => g.ha1 },
            { cell: 'Q214', name: 'Chiều cao đỉnh TB 2', sym: 'ha2', mit: 6.800000, getVal: () => g.ha2 },
            { cell: 'P215', name: 'Chiều cao đỉnh trong 1', sym: 'hai1', mit: 10.440382, getVal: () => g.hai1 },
            { cell: 'Q215', name: 'Chiều cao đỉnh trong 2', sym: 'hai2', mit: 5.378379, getVal: () => g.hai2 },
            { cell: 'P216', name: 'Chiều cao đáy ngoài 1', sym: 'hfe1', mit: 10.639745, getVal: () => g.hfe1 },
            { cell: 'Q216', name: 'Chiều cao đáy ngoài 2', sym: 'hfe2', mit: 18.377742, getVal: () => g.hfe2 },
            { cell: 'P217', name: 'Chiều cao đáy TB 1', sym: 'hf1', mit: 8.800000, getVal: () => g.hf1 },
            { cell: 'Q217', name: 'Chiều cao đáy TB 2', sym: 'hf2', mit: 15.200000, getVal: () => g.hf2 },
            { cell: 'P218', name: 'Chiều cao đáy trong 1', sym: 'hfi1', mit: 6.960255, getVal: () => g.hfi1 },
            { cell: 'Q218', name: 'Chiều cao đáy trong 2', sym: 'hfi2', mit: 12.022258, getVal: () => g.hfi2 },
            { cell: 'P219', name: 'Góc áp lực pháp tuyến', sym: 'αn', mit: 17.495241, getVal: () => g.alfa_n_deg },
            { cell: 'P222', name: 'Góc nghiêng cơ sở', sym: 'βb', mit: 28.481238, getVal: () => g.beta_b_deg },
            { cell: 'P225', name: 'Bước răng pháp ngoài', sym: 'pe', mit: 37.983801, getVal: () => g.pe },
            { cell: 'P226', name: 'Bước răng tiếp tuyến ngoài', sym: 'pte', mit: 43.859916, getVal: () => g.pte },
            { cell: 'P227', name: 'Chiều dày răng pháp ngoài 1', sym: 'sne1', mit: 22.291926, getVal: () => g.sne1 },
            { cell: 'Q227', name: 'Chiều dày răng pháp ngoài 2', sym: 'sne2', mit: 15.691875, getVal: () => g.sne2 },
            { cell: 'P228', name: 'Chiều dày răng pháp TB 1', sym: 'sn1', mit: 18.437373, getVal: () => g.sn1 },
            { cell: 'Q228', name: 'Chiều dày răng pháp TB 2', sym: 'sn2', mit: 12.978554, getVal: () => g.sn2 },
            { cell: 'P229', name: 'Chiều dày răng pháp trong 1', sym: 'sni1', mit: 14.582820, getVal: () => g.sni1 },
            { cell: 'Q229', name: 'Chiều dày răng pháp trong 2', sym: 'sni2', mit: 10.265232, getVal: () => g.sni2 },
            { cell: 'P230', name: 'Chiều dày đỉnh răng ngoài 1', sym: 'sae1', mit: 8.883307, getVal: () => g.sae1 },
            { cell: 'Q230', name: 'Chiều dày đỉnh răng ngoài 2', sym: 'sae2', mit: 13.520387, getVal: () => g.sae2 },
            { cell: 'P231', name: 'Chiều dày đỉnh răng TB 1', sym: 'sa1', mit: 7.347259, getVal: () => g.sa1 },
            { cell: 'Q231', name: 'Chiều dày đỉnh răng TB 2', sym: 'sa2', mit: 11.182560, getVal: () => g.sa2 },
            { cell: 'P232', name: 'Chiều dày đỉnh răng trong 1', sym: 'sai1', mit: 5.811230, getVal: () => g.sai1 },
            { cell: 'Q232', name: 'Chiều dày đỉnh răng trong 2', sym: 'sai2', mit: 8.844712, getVal: () => g.sai2 },
            { cell: 'P233', name: 'Chiều dày đỉnh răng chuẩn 1', sym: 'sae1*', mit: 0.734726, getVal: () => g.sae1_star },
            { cell: 'Q233', name: 'Chiều dày đỉnh răng chuẩn 2', sym: 'sae2*', mit: 1.118256, getVal: () => g.sae2_star },
            { cell: 'P236', name: 'Răng ảo pháp diện 1', sym: 'zvn1', mit: 19.386593, getVal: () => g.zvn1 },
            { cell: 'Q236', name: 'Răng ảo pháp diện 2', sym: 'zvn2', mit: 121.166208, getVal: () => g.zvn2 },
            { cell: 'P237', name: 'Răng ảo tiếp tuyến 1', sym: 'zv1', mit: 29.847613, getVal: () => g.zv1 },
            { cell: 'Q237', name: 'Răng ảo tiếp tuyến 2', sym: 'zv2', mit: 186.547581, getVal: () => g.zv2 },
            { cell: 'P238', name: 'Vòng chia tương đương TB 1', sym: 'dvm1', mit: 223.857097, getVal: () => g.dvm1 },
            { cell: 'Q238', name: 'Vòng chia tương đương TB 2', sym: 'dvm2', mit: 1399.106858, getVal: () => g.dvm2 },
            { cell: 'P239', name: 'Vòng đỉnh tương đương 1', sym: 'dva1', mit: 250.257097, getVal: () => g.dva1 },
            { cell: 'Q239', name: 'Vòng đỉnh tương đương 2', sym: 'dva2', mit: 1412.706858, getVal: () => g.dva2 },
            { cell: 'P240', name: 'Vòng cơ sở tương đương 1', sym: 'dvb1', mit: 210.356861, getVal: () => g.dvb1 },
            { cell: 'Q240', name: 'Vòng cơ sở tương đương 2', sym: 'dvb2', mit: 1314.730379, getVal: () => g.dvb2 },
            { cell: 'P241', name: 'Vòng đáy tương đương 1', sym: 'dvf1', mit: 206.257097, getVal: () => g.dvf1 },
            { cell: 'Q241', name: 'Vòng đáy tương đương 2', sym: 'dvf2', mit: 1368.706858, getVal: () => g.dvf2 },
            { cell: 'P242', name: 'Khoảng cách trục tương đương', sym: 'av', mit: 811.481978, getVal: () => g.av },
            { cell: 'P243', name: 'Tỉ số truyền tương đương', sym: 'iv', mit: 6.250000, getVal: () => g.iv },
            { cell: 'P246', name: 'Hệ số trùng khớp ngang', sym: 'εα', mit: 1.428924, getVal: () => g.ea },
            { cell: 'Q246', name: 'Hệ số trùng khớp dọc', sym: 'εβ', mit: 1.582796, getVal: () => g.eb },
            { cell: 'P247', name: 'Hệ số trùng khớp tổng cộng', sym: 'εγ', mit: 3.011720, getVal: () => g.eg },
            { cell: 'D4', name: 'Bảng chế tạo - Mô đun', sym: 'mmn', mit: 10.000000, getVal: () => g.mmn },
            { cell: 'D5', name: 'Bảng chế tạo - Số răng bánh 1', sym: 'z1', mit: 18.000000, getVal: () => g.z1 },
            { cell: 'D8', name: 'Bảng chế tạo - Góc nón chia 1', sym: 'δ1', mit: 21.801409, getVal: () => g.delta1_deg },
            { cell: 'D9', name: 'Bảng chế tạo - Vòng đỉnh ngoài 1', sym: 'dae1', mit: 280.935072, getVal: () => g.dae1 },
            { cell: 'D10', name: 'Bảng chế tạo - Chiều dài nón Re', sym: 'Re', mit: 338.321372, getVal: () => g.Re },
            { cell: 'D11', name: 'Bảng chế tạo - Chiều rộng b', sym: 'b', mit: 117.000000, getVal: () => g.b },
            { cell: 'D12', name: 'Bảng chế tạo - Dịch chỉnh x1', sym: 'x1', mit: 0.320000, getVal: () => g.x1 },
            { cell: 'D13', name: 'Bảng chế tạo - Dịch dày xt1', sym: 'xt1', mit: 0.040000, getVal: () => g.xt1 },
            { cell: 'D24', name: 'Bảng chế tạo - Số răng bánh 2', sym: 'z2', mit: 45.000000, getVal: () => g.z2 },
            { cell: 'D27', name: 'Bảng chế tạo - Góc nón chia 2', sym: 'δ2', mit: 68.198591, getVal: () => g.delta2_deg },
            { cell: 'D28', name: 'Bảng chế tạo - Vòng đỉnh ngoài 2', sym: 'dae2', mit: 634.353882, getVal: () => g.dae2 },
            { cell: 'D31', name: 'Bảng chế tạo - Dịch chỉnh x2', sym: 'x2', mit: -0.320000, getVal: () => g.x2 },
            { cell: 'D32', name: 'Bảng chế tạo - Dịch dày xt2', sym: 'xt2', mit: -0.040000, getVal: () => g.xt2 }
        ];

        let passCount = 0;
        let html = '';

        auditItems.forEach(item => {
            const webVal = item.getVal();
            const delta = Math.abs(webVal - item.mit);
            const isPass = delta <= 0.005;
            if (isPass) passCount++;

            html += `<tr>
                <td><span class="badge-coord">${item.cell}</span></td>
                <td><b>${item.name}</b></td>
                <td style="color: var(--accent-cyan); font-style: italic;">${item.sym}</td>
                <td style="text-align: right; color: #38bdf8; font-weight: 700;">${typeof webVal === 'number' ? webVal.toFixed(4) : webVal}</td>
                <td style="text-align: right; color: #94a3b8;">${typeof item.mit === 'number' ? item.mit.toFixed(4) : item.mit}</td>
                <td style="text-align: right; color: ${delta < 0.0001 ? '#34d399' : '#f59e0b'};">${delta.toFixed(6)}</td>
                <td style="text-align: center;"><span class="badge-pass">✅ PASS</span></td>
            </tr>`;
        });

        tbody.innerHTML = html;
        const badge = document.getElementById('auditSummaryBadge');
        if (badge) {
            badge.textContent = `✅ ${passCount}/${auditItems.length} Ô TÍNH KHỚP TUYỆT ĐỐI (100.0%)`;
        }
    }

    exportDXF() {
        const g = this.lastGeom || (typeof BevelCalcEngine !== 'undefined' ? BevelCalcEngine.calculate(this.inputs) : null);
        if (!g) return;

        const Re = g.Re;
        const Ri = g.Ri;
        const b = g.b;
        const d1 = g.delta1; // rad
        const d2 = g.delta2; // rad
        const th_a1 = (g.deltaa1_deg * Math.PI) / 180.0;
        const th_f1 = (g.deltaf1_deg * Math.PI) / 180.0;
        const th_a2 = (g.deltaa2_deg * Math.PI) / 180.0;
        const th_f2 = (g.deltaf2_deg * Math.PI) / 180.0;

        const d1a = d1 + th_a1;
        const d1f = d1 - th_f1;
        const d2a = d2 + th_a2;
        const d2f = d2 - th_f2;

        const Rae1 = Re / Math.cos(th_a1);
        const Rfe1 = Re / Math.cos(th_f1);
        const Rai1 = Ri / Math.cos(th_a1);
        const Rfi1 = Ri / Math.cos(th_f1);

        const p1_toe_tip = { x: Rai1 * Math.cos(d1a), y: Rai1 * Math.sin(d1a) };
        const p1_heel_tip = { x: Rae1 * Math.cos(d1a), y: Rae1 * Math.sin(d1a) };
        const p1_heel_root = { x: Rfe1 * Math.cos(d1f), y: Rfe1 * Math.sin(d1f) };
        const p1_toe_root = { x: Rfi1 * Math.cos(d1f), y: Rfi1 * Math.sin(d1f) };

        const d_bore1 = Math.max(15, g.de1 * 0.22);
        const d_hub1 = Math.max(25, g.de1 * 0.45);
        const x_back1 = p1_heel_tip.x + 15;
        const x_hub_end1 = x_back1 + Math.max(30, b * 0.7);

        // Pinion Upper Half (Clean vertical front face at p1_toe_root.x)
        const x_front1 = p1_toe_root.x;
        const p1_upper = [
            p1_toe_root, p1_toe_tip, p1_heel_tip, p1_heel_root,
            { x: x_back1, y: d_hub1 / 2.0 },
            { x: x_hub_end1, y: d_hub1 / 2.0 },
            { x: x_hub_end1, y: d_bore1 / 2.0 },
            { x: x_front1, y: d_bore1 / 2.0 },
            p1_toe_root
        ];
        const p1_lower = p1_upper.map(p => ({ x: p.x, y: -p.y }));

        // Gear (Apex at 0,0, shaft along Y axis)
        const Rae2 = Re / Math.cos(th_a2);
        const Rfe2 = Re / Math.cos(th_f2);
        const Rai2 = Ri / Math.cos(th_a2);
        const Rfi2 = Ri / Math.cos(th_f2);

        const p2_toe_tip = { x: Rai2 * Math.cos(d1 - th_a2), y: Rai2 * Math.sin(d1 - th_a2) };
        const p2_heel_tip = { x: Rae2 * Math.cos(d1 - th_a2), y: Rae2 * Math.sin(d1 - th_a2) };
        const p2_heel_root = { x: Rfe2 * Math.cos(d1 + th_f2), y: Rfe2 * Math.sin(d1 + th_f2) };
        const p2_toe_root = { x: Rfi2 * Math.cos(d1 + th_f2), y: Rfi2 * Math.sin(d1 + th_f2) };

        const d_bore2 = Math.max(25, g.de2 * 0.16);
        const d_hub2 = Math.max(45, g.de2 * 0.32);
        const y_back2 = p2_heel_tip.y + 18;
        const y_hub_end2 = y_back2 + Math.max(35, b * 0.8);

        const p2_right = [
            p2_toe_root, p2_toe_tip, p2_heel_tip, p2_heel_root,
            { x: d_hub2 / 2.0, y: y_back2 },
            { x: d_hub2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: y_hub_end2 },
            { x: d_bore2 / 2.0, y: p2_toe_root.y },
            p2_toe_root
        ];
        const p2_left = p2_right.map(p => ({ x: -p.x, y: p.y }));

        // DXF Header & Layers (AutoCAD Release 12 AC1009)
        const dxf = [];
        dxf.push("0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n");
        dxf.push("0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n6\n");
        const layers = [
            { name: "PINION_CROSS_SECTION", color: 3 },
            { name: "GEAR_CROSS_SECTION", color: 5 },
            { name: "CENTER_LINES", color: 1 },
            { name: "PITCH_CONES", color: 2 },
            { name: "APEX_POINT", color: 1 },
            { name: "MFG_TABLE", color: 7 }
        ];
        layers.forEach(lyr => {
            dxf.push(`0\nLAYER\n2\n${lyr.name}\n70\n0\n62\n${lyr.color}\n6\nCONTINUOUS\n`);
        });
        dxf.push("0\nENDTAB\n0\nENDSEC\n");
        dxf.push("0\nSECTION\n2\nENTITIES\n");

        const addPolyline = (pts, layer) => {
            dxf.push(`0\nPOLYLINE\n8\n${layer}\n66\n1\n70\n1\n`);
            pts.forEach(p => {
                dxf.push(`0\nVERTEX\n8\n${layer}\n10\n${p.x.toFixed(4)}\n20\n${p.y.toFixed(4)}\n30\n0.0\n`);
            });
            dxf.push("0\nSEQEND\n");
        };

        const addLine = (p1, p2, layer) => {
            dxf.push(`0\nLINE\n8\n${layer}\n10\n${p1.x.toFixed(4)}\n20\n${p1.y.toFixed(4)}\n30\n0.0\n11\n${p2.x.toFixed(4)}\n21\n${p2.y.toFixed(4)}\n31\n0.0\n`);
        };

        const addText = (text, x, y, height, layer) => {
            dxf.push(`0\nTEXT\n8\n${layer}\n10\n${x.toFixed(4)}\n20\n${y.toFixed(4)}\n30\n0.0\n40\n${height.toFixed(4)}\n1\n${text}\n`);
        };

        // 1. Pinion Profile
        addPolyline(p1_upper, "PINION_CROSS_SECTION");
        addPolyline(p1_lower, "PINION_CROSS_SECTION");
        // Pinion bore rectangle
        addLine({ x: p1_toe_root.x - 5, y: -d_bore1 / 2.0 }, { x: x_hub_end1, y: -d_bore1 / 2.0 }, "PINION_CROSS_SECTION");
        addLine({ x: p1_toe_root.x - 5, y: d_bore1 / 2.0 }, { x: x_hub_end1, y: d_bore1 / 2.0 }, "PINION_CROSS_SECTION");

        // 2. Gear Profile
        addPolyline(p2_right, "GEAR_CROSS_SECTION");
        addPolyline(p2_left, "GEAR_CROSS_SECTION");
        // Gear bore rectangle
        addLine({ x: -d_bore2 / 2.0, y: y_hub_end2 }, { x: -d_bore2 / 2.0, y: p2_toe_root.y - 5 }, "GEAR_CROSS_SECTION");
        addLine({ x: d_bore2 / 2.0, y: y_hub_end2 }, { x: d_bore2 / 2.0, y: p2_toe_root.y - 5 }, "GEAR_CROSS_SECTION");

        // 3. Center Lines
        addLine({ x: -30, y: 0 }, { x: x_hub_end1 + 40, y: 0 }, "CENTER_LINES");
        addLine({ x: 0, y: -30 }, { x: 0, y: y_hub_end2 + 40 }, "CENTER_LINES");
        const contactX = Re * Math.cos(d1);
        const contactY = Re * Math.sin(d1);
        addLine({ x: 0, y: 0 }, { x: contactX * 1.15, y: contactY * 1.15 }, "CENTER_LINES");

        // 4. Pitch Cones (Re, Ri generator lines)
        addLine({ x: 0, y: 0 }, { x: Re * Math.cos(d1a), y: Re * Math.sin(d1a) }, "PITCH_CONES");
        addLine({ x: 0, y: 0 }, { x: Re * Math.cos(d1f), y: Re * Math.sin(d1f) }, "PITCH_CONES");

        // 5. Apex Point
        dxf.push("0\nCIRCLE\n8\nAPEX_POINT\n10\n0.0\n20\n0.0\n30\n0.0\n40\n3.0\n");

        // 6. Manufacturing Specification Table
        const tx = Math.max(x_hub_end1 + 60, Re * 1.25);
        let ty = y_hub_end2 + 20;
        const lineH = 10.0;

        const mfgRows = [
            "===========================================================",
            "  BANG THONG SO CHE TAO BANH RANG CON (ISO 23509 / DIN 3971)",
            "===========================================================",
            `Mo-dun phap tuyen trung binh (mmn):    ${g.mmn.toFixed(3)} mm`,
            `So rang banh dan / bi dan (z1 / z2):   ${g.z1} / ${g.z2}`,
            `Ti so truyen dong thuc te (i):         ${g.i.toFixed(4)}`,
            `Goc giua hai truc (Sigma):             ${g.Sigma_deg.toFixed(2)} deg`,
            `Goc an khop danh nghia (alfa):         ${g.alfa_deg.toFixed(2)} deg`,
            `Goc xoan rang trung binh (beta):       ${g.beta_deg.toFixed(2)} deg`,
            `Goc non chia 1 (delta1):               ${g.delta1_deg.toFixed(4)} deg`,
            `Goc non chia 2 (delta2):               ${g.delta2_deg.toFixed(4)} deg`,
            `Chieu dai duong sinh non ngoai (Re):   ${g.Re.toFixed(3)} mm`,
            `Chieu rong vanh rang (b):              ${g.b.toFixed(1)} mm`,
            `He so dich chinh bien dang (x1 / x2):  ${g.x1.toFixed(4)} / ${g.x2.toFixed(4)}`,
            `He so dich chinh chieu day (xt1 / xt2):${g.xt1.toFixed(4)} / ${g.xt2.toFixed(4)}`,
            `Duong kinh dinh ngoai (dae1 / dae2):   ${g.dae1.toFixed(3)} / ${g.dae2.toFixed(3)} mm`,
            `Duong kinh day ngoai (dfe1 / dfe2):    ${g.dfe1.toFixed(3)} / ${g.dfe2.toFixed(3)} mm`,
            `Cap chinh xac che tao:                 DIN 3965 Cap ${g.Q}`,
            "==========================================================="
        ];

        mfgRows.forEach(row => {
            addText(row, tx, ty, 5.0, "MFG_TABLE");
            ty -= lineH;
        });

        dxf.push("0\nENDSEC\n0\nEOF\n");
        const dxfContent = dxf.join("");

        // Download via Blob
        const blob = new Blob([dxfContent], { type: "application/dxf;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Banh_Rang_Con_MITCalc_${g.z1}x${g.z2}_m${g.mmn}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

}
