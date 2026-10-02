/**
 * ============================================================================
 * MITCALC WORM GEAR UI CONTROLLER (Gear4_01.xlsb - Module 3)
 * ============================================================================
 * Connects DOM inputs/outputs in modules/worm-gear/index.html with:
 * - WormCalcEngine (worm-calc-engine.js)
 * - WormCanvasRenderer (worm-canvas.js)
 * - Materials & WORM_WHEEL_MATERIALS & WORM_STD_TABLES
 * ============================================================================
 */

class WormUIController {
    constructor() {
        this.activeMode = '2D';
        this.canvasRenderer = new WormCanvasRenderer('wormCanvas');
        const container3DEl = document.getElementById('worm3DContainer');
        this.visualizer3D = (typeof Worm3DVisualizer !== 'undefined' && container3DEl)
            ? new Worm3DVisualizer(container3DEl)
            : null;
        window.worm3DVisualizer = this.visualizer3D;
        window.wormCanvas = this.canvasRenderer;
        this.latestResult = null;
        this.init();
    }

    init() {
        this.populateSelectDropdowns();
        this.bindTabsAndAccordions();
        this.bindInputsAndControls();
        this.bindCanvasControls();
        this.resetDefaults();
    }

    parseVal(elId, fallback = 0) {
        const el = document.getElementById(elId);
        if (!el) return fallback;
        const raw = String(el.value || '').trim().replace(',', '.');
        const num = parseFloat(raw);
        return Number.isFinite(num) ? num : fallback;
    }

    setVal(elId, val, decimals = null) {
        const el = document.getElementById(elId);
        if (!el) return;
        if (val === null || val === undefined || (typeof val === 'number' && !Number.isFinite(val))) {
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                el.value = '-';
            } else {
                el.textContent = '-';
            }
            return;
        }
        const formatted = (decimals !== null && typeof val === 'number')
            ? val.toFixed(decimals)
            : String(val);
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
            if (document.activeElement !== el) {
                el.value = formatted;
            }
        } else {
            el.textContent = formatted;
        }
    }

    populateSelectDropdowns() {
        // 1. Worm Materials (51 steels from Materials / MATERIALS_DB)
        const selMatP = document.getElementById('sel_matP');
        const matDb = (typeof MATERIALS_DB !== 'undefined')
            ? MATERIALS_DB
            : ((typeof Materials !== 'undefined') ? Materials : []);
        if (selMatP && Array.isArray(matDb)) {
            selMatP.innerHTML = '';
            matDb.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = `${m.id}. ${m.fullName || m.name}`;
                if (m.id === 41) opt.selected = true;
                selMatP.appendChild(opt);
            });
        }

        // 2. Worm Wheel Materials (11 bronzes/cast irons from WORM_WHEEL_MATERIALS)
        const selMatW = document.getElementById('sel_matW');
        if (selMatW && typeof WORM_WHEEL_MATERIALS !== 'undefined') {
            selMatW.innerHTML = '';
            WORM_WHEEL_MATERIALS.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = `${m.id}. ${m.fullName || m.name}`;
                if (m.id === 7) opt.selected = true;
                selMatW.appendChild(opt);
            });
        }

        // Helper for table dropdowns
        const fillSelect = (elId, list, defaultId, labelFn) => {
            const sel = document.getElementById(elId);
            if (!sel || !Array.isArray(list)) return;
            sel.innerHTML = '';
            list.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = labelFn ? labelFn(item) : item.name;
                if (item.id === defaultId) opt.selected = true;
                sel.appendChild(opt);
            });
        };

        if (typeof WORM_STD_TABLES !== 'undefined') {
            fillSelect('sel_toothType', WORM_STD_TABLES.T_ToothType, 2);
            fillSelect('sel_loadTypeA', WORM_STD_TABLES.T_LoadType, 1);
            fillSelect('sel_loadTypeB', WORM_STD_TABLES.T_LoadType, 1);
            fillSelect('sel_designCooling', WORM_STD_TABLES.T_DesignCooling, 1);
            fillSelect('sel_oilType', WORM_STD_TABLES.T_OilType, 3);
            fillSelect('sel_lubricant', WORM_STD_TABLES.T_Lubricant, 6, item => `${item.name} (ν40=${item.ny40}, ν100=${item.ny100})`);
            fillSelect('sel_bearingType', WORM_STD_TABLES.T_BearingTyp, 1);

            // Standard combo-box helper selects
            const fillComboSelect = (elId, arr, placeholder = '') => {
                const sel = document.getElementById(elId);
                if (!sel || !Array.isArray(arr)) return;
                sel.innerHTML = `<option value="">${placeholder}</option>`;
                arr.forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v;
                    opt.textContent = v;
                    sel.appendChild(opt);
                });
            };

            fillComboSelect('sel_std_i', WORM_STD_TABLES.T_i);
            fillComboSelect('sel_std_alfa0', WORM_STD_TABLES.T_Alfa0);
            fillComboSelect('sel_std_q', WORM_STD_TABLES.T_Diam_q);
            fillComboSelect('sel_std_gama', WORM_STD_TABLES.T_gamaProp);
            fillComboSelect('sel_std_module', WORM_STD_TABLES.T_Module);
            fillComboSelect('sel_std_av', WORM_STD_TABLES.T_av);
        }
    }

    bindTabsAndAccordions() {
        // Main 2-Tab Navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });
                btn.classList.add('active');
                const pane = document.getElementById(targetId);
                if (pane) {
                    pane.classList.add('active');
                    pane.style.display = 'block';
                }
                if (targetId === 'tabCanvas') {
                    if (this.activeMode === '2D') {
                        this.canvasRenderer.render();
                    } else if (this.activeMode === '3D' && this.visualizer3D) {
                        this.visualizer3D.onResize();
                        if (this.latestResult) {
                            this.visualizer3D.setGeometry(this.latestResult);
                        }
                    }
                }
            });
        });

        // Accordion Section Headers (.calc-section and .accordion-section)
        document.querySelectorAll('.calc-section .section-header, .accordion-section .section-header').forEach(hdr => {
            hdr.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
                const sec = hdr.closest('.calc-section') || hdr.closest('.accordion-section');
                if (!sec) return;
                const isCollapsed = sec.classList.contains('collapsed');
                sec.classList.toggle('collapsed', !isCollapsed);
                sec.classList.toggle('open', isCollapsed);
                const toggle = hdr.querySelector('.section-toggle');
                if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
            });
        });

        const toggleAllSections = (expand) => {
            document.querySelectorAll('.calc-section, .accordion-section').forEach(sec => {
                sec.classList.toggle('collapsed', !expand);
                sec.classList.toggle('open', expand);
                const toggle = sec.querySelector('.section-toggle');
                if (toggle) toggle.textContent = expand ? '▼' : '▶';
            });
        };

        // Expand / Collapse All
        const btnExpandAll = document.getElementById('btnExpandAll');
        if (btnExpandAll) {
            btnExpandAll.addEventListener('click', () => toggleAllSections(true));
        }
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnCollapseAll) {
            btnCollapseAll.addEventListener('click', () => toggleAllSections(false));
        }
    }

    bindComboArrow(selectId, inputId) {
        const sel = document.getElementById(selectId);
        const inp = document.getElementById(inputId);
        if (!sel || !inp) return;
        sel.addEventListener('change', () => {
            if (sel.value !== '') {
                inp.value = sel.value;
                sel.value = '';
                this.recalculate();
            }
        });
    }

    syncRadioCalcQVisuals() {
        const checkedRadio = document.querySelector('input[name="rad_calc_q"]:checked');
        const calcQ = checkedRadio ? parseInt(checkedRadio.value, 10) : 1;

        const inpQ = document.getElementById('inp_q');
        const inpD1 = document.getElementById('inp_d1_Input');
        const inpGama = document.getElementById('inp_gama');

        const setInputMode = (el, isEditable) => {
            if (!el) return;
            el.readOnly = !isEditable;
            if (isEditable) {
                el.classList.add('user-input');
                el.classList.remove('readonly-calc');
            } else {
                el.classList.remove('user-input');
                el.classList.add('readonly-calc');
            }
        };

        setInputMode(inpQ, calcQ === 1);
        setInputMode(inpD1, calcQ === 2);
        setInputMode(inpGama, calcQ === 3);

        const optFitQ = document.getElementById('opt_fit_q');
        const selFitAxis = document.getElementById('sel_FitAxis');
        if (optFitQ) {
            optFitQ.textContent = (calcQ === 1)
                ? 'Thay đổi hệ số đường kính trục vít [4.6]'
                : 'Không khả dụng ở chế độ này';
        }
        if (selFitAxis && calcQ !== 1 && selFitAxis.value === '3') {
            selFitAxis.value = '2';
        }
    }

    syncAutoFlagsVisuals() {
        const toggleAutoInput = (chkId, inpIds) => {
            const chk = document.getElementById(chkId);
            if (!chk) return;
            const isAuto = chk.checked;
            inpIds.forEach(id => {
                const inp = document.getElementById(id);
                if (!inp) return;
                inp.readOnly = isAuto;
                if (isAuto) {
                    inp.classList.remove('user-input');
                    inp.classList.add('readonly-calc');
                } else {
                    inp.classList.add('user-input');
                    inp.classList.remove('readonly-calc');
                }
            });
        };

        toggleAutoInput('chk_kaFlag', ['inp_KA']);
        toggleAutoInput('chk_rf1Flag', ['inp_rf1']);
        toggleAutoInput('chk_l1l2_flag', ['inp_l1_input', 'inp_l2_input']);
        toggleAutoInput('chk_FlagL', ['inp_L_Input']);
        toggleAutoInput('chk_Flagb2H', ['inp_b2H_Input']);
        toggleAutoInput('chk_de2Flag', ['inp_de2Input']);
        toggleAutoInput('chk_dstFlag', ['inp_Shaft_ds', 'inp_Shaft_th']);
    }

    bindInputsAndControls() {
        // Combo-box arrows
        this.bindComboArrow('sel_std_i', 'inp_iin');
        this.bindComboArrow('sel_std_alfa0', 'inp_alfa_temp');
        this.bindComboArrow('sel_std_q', 'inp_q');
        this.bindComboArrow('sel_std_gama', 'inp_gama');
        this.bindComboArrow('sel_std_module', 'inp_m_Input');
        this.bindComboArrow('sel_std_av', 'inp_a_req');

        // Lubricant dropdown updates ny40, ny100, rooil15 automatically (like VBA LubricantChange)
        const selLub = document.getElementById('sel_lubricant');
        if (selLub) {
            selLub.addEventListener('change', () => {
                const lubId = parseInt(selLub.value, 10);
                if (typeof WORM_STD_TABLES !== 'undefined') {
                    const item = WORM_STD_TABLES.T_Lubricant.find(x => x.id === lubId);
                    if (item && item.id < 12) {
                        const el40 = document.getElementById('inp_ny40');
                        const el100 = document.getElementById('inp_ny100');
                        const elRo = document.getElementById('inp_rooil15');
                        if (el40) el40.value = item.ny40.toFixed(1);
                        if (el100) el100.value = item.ny100.toFixed(1);
                        if (elRo) elRo.value = item.rooil15.toFixed(3);
                    }
                }
                this.recalculate();
            });
        }

        // Radio calc_q (4.6 / 4.7 / 4.8)
        document.querySelectorAll('input[name="rad_calc_q"]').forEach(r => {
            r.addEventListener('change', () => {
                this.syncRadioCalcQVisuals();
                this.recalculate();
            });
        });

        // Auto checkboxes
        ['chk_kaFlag', 'chk_rf1Flag', 'chk_l1l2_flag', 'chk_FlagL', 'chk_Flagb2H', 'chk_de2Flag', 'chk_dstFlag'].forEach(chkId => {
            const chk = document.getElementById(chkId);
            if (chk) {
                chk.addEventListener('change', () => {
                    this.syncAutoFlagsVisuals();
                    this.recalculate();
                });
            }
        });

        // Slider x2 <-> inp_x2
        const sliderX2 = document.getElementById('slider_x2');
        const inpX2 = document.getElementById('inp_x2');
        if (sliderX2 && inpX2) {
            sliderX2.addEventListener('input', () => {
                inpX2.value = parseFloat(sliderX2.value).toFixed(4);
                this.recalculate();
            });
            inpX2.addEventListener('input', () => {
                const v = this.parseVal('inp_x2', 0);
                sliderX2.value = Math.max(-1, Math.min(1, v));
            });
        }

        // Button [ < ] Set Self-Locking Lead Angle (Row 50: gama = gama_SelfLock)
        const btnGamaSL = document.getElementById('btn_gama_SL');
        if (btnGamaSL) {
            btnGamaSL.addEventListener('click', () => {
                if (!this.latestResult) return;
                const radio3 = document.querySelector('input[name="rad_calc_q"][value="3"]');
                if (radio3) radio3.checked = true;
                this.syncRadioCalcQVisuals();
                const inpGama = document.getElementById('inp_gama');
                if (inpGama) {
                    inpGama.value = this.latestResult.gama_SelfLock.toFixed(4);
                }
                this.recalculate();
            });
        }

        // Button [ Tính khớp a ] FitAxisDistance Solver (VBA FitAxisDistance exact port)
        const btnSolveFitAxis = document.getElementById('btn_SolveFitAxis');
        if (btnSolveFitAxis) {
            btnSolveFitAxis.addEventListener('click', () => {
                this.solveFitAxisDistance();
            });
        }

        // Section 16.0: Sync z2_req = ROUND(z1_req * iin)
        const btnSyncZ2Req = document.getElementById('btn_sync_z2req');
        if (btnSyncZ2Req) {
            btnSyncZ2Req.addEventListener('click', () => {
                const z1Req = this.parseVal('inp_z1_req', 1);
                const iin = this.parseVal('inp_iin', 40.0);
                const elZ2Req = document.getElementById('inp_z2_req');
                if (elZ2Req) elZ2Req.value = Math.max(5, Math.round(z1Req * iin));
                this.recalculate();
            });
        }

        // Section 16.0: Apply selected variant from AxisDistTbl to Section 4.0
        const btnApplyAxisDist = document.getElementById('btn_ApplyAxisDist');
        if (btnApplyAxisDist) {
            btnApplyAxisDist.addEventListener('click', () => {
                this.applySelectedAxisDistVariant();
            });
        }

        // Jump buttons from Section 1.0 & 4.0 to Section 18.0
        const openSec18AndFocus = (focusId) => {
            const sec18 = document.getElementById('sec18Accordion');
            if (sec18) {
                sec18.classList.remove('collapsed');
                sec18.classList.add('open');
                const toggle = sec18.querySelector('.section-toggle');
                if (toggle) toggle.textContent = '▼';
                sec18.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            const el = document.getElementById(focusId);
            if (el) setTimeout(() => el.focus(), 250);
        };

        const btnJumpN1N2 = document.getElementById('btn_jump_n1n2');
        if (btnJumpN1N2) btnJumpN1N2.addEventListener('click', () => openSec18AndFocus('inp_XX_n1'));

        const btnJumpPw2 = document.getElementById('btn_jump_Pw2');
        if (btnJumpPw2) btnJumpPw2.addEventListener('click', () => openSec18AndFocus('inp_XX_Mk2'));

        const btnJumpZ1Z2 = document.getElementById('btn_jump_z1z2');
        if (btnJumpZ1Z2) btnJumpZ1Z2.addEventListener('click', () => openSec18AndFocus('inp_XX_z1'));

        // Section 18.0 Auxiliary [ OK ] Transfer Buttons (VBA Move_z1z2, Move_n1n2, Move_Pwn2)
        const btnMoveZ1Z2 = document.getElementById('btn_Move_z1z2');
        if (btnMoveZ1Z2) {
            btnMoveZ1Z2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elIin = document.getElementById('inp_iin');
                const elZ1 = document.getElementById('inp_z1');
                if (elIin) elIin.value = this.latestResult.XXX_i.toFixed(2);
                if (elZ1) elZ1.value = Math.round(this.latestResult.XX_z1);
                this.recalculate();
            });
        }

        const btnMoveN1N2 = document.getElementById('btn_Move_n1n2');
        if (btnMoveN1N2) {
            btnMoveN1N2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elIin = document.getElementById('inp_iin');
                const elN1 = document.getElementById('inp_n1');
                if (elIin) elIin.value = this.latestResult.XX_i.toFixed(2);
                if (elN1) elN1.value = this.latestResult.XX_n1.toFixed(1);
                this.recalculate();
            });
        }

        const btnMovePwN2 = document.getElementById('btn_Move_Pwn2');
        if (btnMovePwN2) {
            btnMovePwN2.addEventListener('click', () => {
                if (!this.latestResult) return;
                const elPw2 = document.getElementById('inp_Pw2');
                const elN1 = document.getElementById('inp_n1');
                if (elPw2) elPw2.value = this.latestResult.XX_Pw2.toFixed(3);
                if (elN1) elN1.value = (this.latestResult.XX_n2 * this.latestResult.i).toFixed(1);
                this.recalculate();
            });
        }

        // Section 19.0 CAD Icon Buttons (Export DXF directly)
        document.querySelectorAll('.cad-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-dxf-mode') || 'assembly';
                this.canvasRenderer.exportDXF(mode);
            });
        });

        // Header Reset & Print
        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => this.resetDefaults());
        }
        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

        // Bind all inputs & selects for live recalculation
        const allInputs = document.querySelectorAll('#tabCalculator input, #tabCalculator select');
        allInputs.forEach(el => {
            if (el.id && el.id.startsWith('sel_std_')) return;
            if (el.id === 'sel_AxisDist') return;
            const evtName = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') ? 'change' : 'input';
            el.addEventListener(evtName, () => this.recalculate());
            if (evtName === 'input') {
                el.addEventListener('change', () => this.recalculate());
            }
        });
    }

    bindCanvasControls() {
        // 1. 2D / 3D Mode Switcher
        const btnMode2D = document.getElementById('btnMode2D');
        const btnMode3D = document.getElementById('btnMode3D');
        const container2D = document.getElementById('container2D');
        const container3D = document.getElementById('container3D');
        const toolbar2D = document.getElementById('toolbar2D');
        const toolbar3D = document.getElementById('toolbar3D');
        const visualizerTitle = document.getElementById('visualizerTitle');
        const visualizerDesc = document.getElementById('visualizerDesc');

        if (btnMode2D && btnMode3D) {
            btnMode2D.addEventListener('click', () => {
                this.activeMode = '2D';
                btnMode2D.style.background = 'var(--accent-green)';
                btnMode2D.style.color = '#000';
                btnMode3D.style.background = 'transparent';
                btnMode3D.style.color = 'var(--text-secondary)';
                if (container2D) container2D.style.display = 'flex';
                if (container3D) container3D.style.display = 'none';
                if (toolbar2D) toolbar2D.style.display = 'flex';
                if (toolbar3D) toolbar3D.style.display = 'none';
                if (visualizerTitle) visualizerTitle.textContent = '📐 Mô Hình 2D Bộ Truyền Trục Vít - Bánh Vít Ăn Khớp (DIN 3975 / DIN 3996)';
                if (visualizerDesc) visualizerDesc.textContent = 'Bản vẽ lắp 2 hình chiếu vuông góc chuẩn MITCalc Data1, mặt cắt họng bánh vít lõm ôm trục vít có bán kính lượn chân răng rf1. Bấm 3D WebGL để quan sát ăn khớp không gian và xuất file CAD STEP/STL cho SolidWorks & Mastercam.';
                this.canvasRenderer.render();
            });

            btnMode3D.addEventListener('click', () => {
                this.activeMode = '3D';
                btnMode3D.style.background = 'var(--accent-cyan)';
                btnMode3D.style.color = '#000';
                btnMode2D.style.background = 'transparent';
                btnMode2D.style.color = 'var(--text-secondary)';
                if (container2D) container2D.style.display = 'none';
                if (container3D) container3D.style.display = 'block';
                if (toolbar2D) toolbar2D.style.display = 'none';
                if (toolbar3D) toolbar3D.style.display = 'flex';
                if (visualizerTitle) visualizerTitle.textContent = '🧊 Mô Phỏng Ăn Khớp 3D WebGL (Trục Vít 1 & Bánh Vít Lõm 2)';
                if (visualizerDesc) visualizerDesc.textContent = 'Mô hình 3D thực thể Trục Vít xoắn ốc (ZA/ZN/ZI/ZK) có R chân rf1 và Bánh Vít họng lõm chữ U ôm trục vít. Xuất file CAD STEP AP214 / STL cho SolidWorks & Mastercam.';
                if (this.visualizer3D) {
                    requestAnimationFrame(() => {
                        this.visualizer3D.onResize();
                        if (this.latestResult) {
                            const curW = this.visualizer3D.wormAngle;
                            const curG = this.visualizer3D.wheelAngle;
                            this.visualizer3D.setGeometry(this.latestResult);
                            this.visualizer3D.wormAngle = curW;
                            this.visualizer3D.wheelAngle = curG;
                            this.visualizer3D.updateGearRotations();
                        }
                        if (!this._hasSetInitial3DView) {
                            this.visualizer3D.setViewPreset('iso');
                            this._hasSetInitial3DView = true;
                        }
                    });
                }
            });
        }

        // 2. 2D Canvas Controls
        const viewBtnIds = ['btnViewAssembly', 'btnViewWorm', 'btnViewWheel', 'btnViewNormalProfile', 'btnViewTangentialProfile'];
        const setViewBtnActive = (activeBtnId, mode) => {
            viewBtnIds.forEach(id => {
                const b = document.getElementById(id);
                if (b) {
                    b.classList.toggle('btn-primary', id === activeBtnId);
                    b.classList.toggle('btn-secondary', id !== activeBtnId);
                }
            });
            this.canvasRenderer.viewMode = mode;
            this.canvasRenderer.render();
        };

        const btnAssy = document.getElementById('btnViewAssembly');
        if (btnAssy) btnAssy.addEventListener('click', () => setViewBtnActive('btnViewAssembly', 'assembly'));

        const btnWorm = document.getElementById('btnViewWorm');
        if (btnWorm) btnWorm.addEventListener('click', () => setViewBtnActive('btnViewWorm', 'worm'));

        const btnWheel = document.getElementById('btnViewWheel');
        if (btnWheel) btnWheel.addEventListener('click', () => setViewBtnActive('btnViewWheel', 'wheel'));

        const btnNormal = document.getElementById('btnViewNormalProfile');
        if (btnNormal) btnNormal.addEventListener('click', () => setViewBtnActive('btnViewNormalProfile', 'normal_profile'));

        const btnTangential = document.getElementById('btnViewTangentialProfile');
        if (btnTangential) btnTangential.addEventListener('click', () => setViewBtnActive('btnViewTangentialProfile', 'tangential_profile'));

        const btnToggleWorm2D = document.getElementById('btnToggleWorm2D');
        if (btnToggleWorm2D) {
            btnToggleWorm2D.addEventListener('click', () => {
                const vis = this.canvasRenderer.toggleWormVisible();
                btnToggleWorm2D.textContent = vis ? '🔩 Trục Vít: Hiện' : '🔩 Trục Vít: Ẩn';
                btnToggleWorm2D.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnToggleWheel2D = document.getElementById('btnToggleWheel2D');
        if (btnToggleWheel2D) {
            btnToggleWheel2D.addEventListener('click', () => {
                const vis = this.canvasRenderer.toggleWheelVisible();
                btnToggleWheel2D.textContent = vis ? '⚙️ Bánh Vít: Hiện' : '⚙️ Bánh Vít: Ẩn';
                btnToggleWheel2D.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnPlay = document.getElementById('btnPlayAnim');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                const running = this.canvasRenderer.toggleAnimation();
                btnPlay.textContent = running ? '⏸ Dừng Quay' : '▶ Mô Phỏng Ăn Khớp';
            });
        }

        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const lblSpeed = document.getElementById('lblAnimSpeed');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', () => {
                const spd = parseFloat(sliderSpeed.value) || 1.0;
                this.canvasRenderer.animSpeed = spd;
                if (lblSpeed) lblSpeed.textContent = `${spd.toFixed(1)}x`;
            });
        }

        const btnToggleDims = document.getElementById('btnToggleDims');
        if (btnToggleDims) {
            btnToggleDims.addEventListener('click', () => {
                this.canvasRenderer.showDims = !this.canvasRenderer.showDims;
                this.canvasRenderer.render();
            });
        }

        const btnResetView = document.getElementById('btnResetView');
        if (btnResetView) {
            btnResetView.addEventListener('click', () => {
                this.canvasRenderer.resetView();
            });
        }

        // 2D DXF Export Dropdown & Items
        const btnExport2DMenu = document.getElementById('btnExport2DMenu');
        const export2DDropdown = document.getElementById('export2DDropdown');
        if (btnExport2DMenu && export2DDropdown) {
            btnExport2DMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                export2DDropdown.style.display = (export2DDropdown.style.display === 'block') ? 'none' : 'block';
            });
            document.addEventListener('click', () => {
                export2DDropdown.style.display = 'none';
            });
        }

        const bind2DExp = (id, mode) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (export2DDropdown) export2DDropdown.style.display = 'none';
                    const targetMode = mode === 'current' ? this.canvasRenderer.viewMode : mode;
                    this.canvasRenderer.exportDXF(targetMode);
                });
            }
        };

        bind2DExp('expDxfCurrent', 'current');
        bind2DExp('expDxfNormalProfile', 'normal_profile');
        bind2DExp('expDxfTangentialProfile', 'tangential_profile');
        bind2DExp('expDxfAssembly', 'assembly');
        bind2DExp('expDxfWormFront', 'worm_front');
        bind2DExp('expDxfWheelThroat', 'gear_left');

        const btnExportDXF = document.getElementById('btnExportDXF');
        if (btnExportDXF) {
            btnExportDXF.addEventListener('click', () => {
                this.canvasRenderer.exportDXF(this.canvasRenderer.viewMode);
            });
        }

        // 3. 3D WebGL Controls
        const sel3DViewPreset = document.getElementById('sel3DViewPreset');
        const btnReset3DView = document.getElementById('btnReset3DView');
        if (sel3DViewPreset && this.visualizer3D) {
            sel3DViewPreset.addEventListener('change', () => {
                this.visualizer3D.setViewPreset(sel3DViewPreset.value);
            });
        }
        if (btnReset3DView && this.visualizer3D) {
            btnReset3DView.addEventListener('click', () => {
                if (sel3DViewPreset) sel3DViewPreset.value = 'iso';
                this.visualizer3D.setViewPreset('iso');
            });
        }

        // 3D Worm and Wheel Visibility Toggles
        const btnToggleWorm = document.getElementById('btnToggleWorm');
        if (btnToggleWorm && this.visualizer3D) {
            btnToggleWorm.addEventListener('click', () => {
                const vis = this.visualizer3D.toggleWormVisible();
                btnToggleWorm.textContent = vis ? '🔩 Trục Vít: Hiện' : '🔩 Trục Vít: Ẩn';
                btnToggleWorm.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnToggleWheel = document.getElementById('btnToggleWheel');
        if (btnToggleWheel && this.visualizer3D) {
            btnToggleWheel.addEventListener('click', () => {
                const vis = this.visualizer3D.toggleWheelVisible();
                btnToggleWheel.textContent = vis ? '⚙️ Bánh Vít: Hiện' : '⚙️ Bánh Vít: Ẩn';
                btnToggleWheel.style.opacity = vis ? '1' : '0.6';
            });
        }

        const btnWireframe = document.getElementById('btnToggleWireframe');
        if (btnWireframe && this.visualizer3D) {
            btnWireframe.addEventListener('click', () => {
                this.visualizer3D.toggleWireframe();
                btnWireframe.classList.toggle('active', this.visualizer3D.wireframeMode);
            });
        }

        const btnFlankOnly = document.getElementById('btnToggleFlankOnly');
        if (btnFlankOnly && this.visualizer3D) {
            btnFlankOnly.addEventListener('click', () => {
                const isFlankOnly = this.visualizer3D.toggleFlankOnly();
                btnFlankOnly.classList.toggle('active', isFlankOnly);
                btnFlankOnly.textContent = isFlankOnly ? '👁️ Đang Xem Mặt Bên' : '👁️ Chỉ Mặt Bên';
            });
        }

        const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
        if (btnToggle3DAnim && this.visualizer3D) {
            btnToggle3DAnim.addEventListener('click', () => {
                const isRunning = this.visualizer3D.toggleAnimation();
                btnToggle3DAnim.textContent = isRunning ? '⏸️ Tạm Dừng' : '▶️ Chạy Mô Phỏng';
            });
            btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
        }

        const btn3DDir = document.getElementById('btn3DAnimDirection');
        if (btn3DDir && this.visualizer3D) {
            btn3DDir.addEventListener('click', () => {
                const dir = this.visualizer3D.toggleAnimDirection();
                if (dir === 1) {
                    btn3DDir.innerHTML = '🔄 Chiều: ↻ Thuận';
                    btn3DDir.style.color = '';
                    btn3DDir.style.borderColor = '';
                } else {
                    btn3DDir.innerHTML = '🔄 Chiều: ↺ Nghịch';
                    btn3DDir.style.color = '#f59e0b';
                    btn3DDir.style.borderColor = '#d97706';
                }
            });
        }

        const slider3DSpeed = document.getElementById('slider3DAnimSpeed');
        const anim3DSpeedVal = document.getElementById('anim3DSpeedVal');
        if (slider3DSpeed && this.visualizer3D) {
            slider3DSpeed.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 1.0;
                if (anim3DSpeedVal) anim3DSpeedVal.textContent = `${val.toFixed(1)}x`;
                this.visualizer3D.setAnimSpeed(val);
            });
        }

        const btn3DStepBack = document.getElementById('btn3DStepBack');
        const btn3DStepFwd = document.getElementById('btn3DStepFwd');
        if (btn3DStepBack && this.visualizer3D) {
            btn3DStepBack.addEventListener('click', () => {
                this.visualizer3D.stepAnimation(-1);
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
            });
        }
        if (btn3DStepFwd && this.visualizer3D) {
            btn3DStepFwd.addEventListener('click', () => {
                this.visualizer3D.stepAnimation(1);
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Chạy Mô Phỏng';
            });
        }

        const selMeshDensity = document.getElementById('selMeshDensity');
        if (selMeshDensity && this.visualizer3D) {
            const initDensity = parseInt(selMeshDensity.value, 10) || 6;
            this.visualizer3D.setMeshDensityLevel(initDensity);
            selMeshDensity.addEventListener('change', (e) => {
                const level = parseInt(e.target.value, 10) || 6;
                this.visualizer3D.setMeshDensityLevel(level);
            });
        }



        // 4. 3D Export Dropdown & Items
        const btnExport3DMenu = document.getElementById('btnExport3DMenu');
        const export3DDropdown = document.getElementById('export3DDropdown');
        if (btnExport3DMenu && export3DDropdown) {
            btnExport3DMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                export3DDropdown.style.display = (export3DDropdown.style.display === 'block') ? 'none' : 'block';
            });
            document.addEventListener('click', () => {
                export3DDropdown.style.display = 'none';
            });
        }

        const bind3DExp = (id, format, target) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (export3DDropdown) export3DDropdown.style.display = 'none';
                    this.export3DCAD(format, target);
                });
            }
        };

        bind3DExp('expStepWorm', 'step', 'worm');
        bind3DExp('expStepWheel', 'step', 'wheel');
        bind3DExp('expStepAssembly', 'step', 'assembly');

        bind3DExp('expStepSurfaceWorm', 'step_surface', 'worm');
        bind3DExp('expStepSurfaceWheel', 'step_surface', 'wheel');
        bind3DExp('expStepSurfaceAssembly', 'step_surface', 'assembly');

        bind3DExp('expStlSurfaceWorm', 'stl_surface', 'worm');
        bind3DExp('expStlSurfaceWheel', 'stl_surface', 'wheel');

        bind3DExp('expStlWorm', 'stl', 'worm');
        bind3DExp('expStlWheel', 'stl', 'wheel');
        bind3DExp('expStlAssembly', 'stl', 'assembly');

        bind3DExp('expObjAssembly', 'obj', 'assembly');
    }

    export3DCAD(format, target) {
        if (!this.visualizer3D || !this.latestResult || typeof Worm3DExporter === 'undefined') return;
        const g = this.latestResult;
        const typeNames = { 1: 'ZA', 2: 'ZN', 3: 'ZI', 4: 'ZK' };
        const typeCode = typeNames[g.toothType] || 'ZN';

        const isSurface = (format === 'step_surface' || format === 'stl_surface');
        const forStep = (format === 'step' || format === 'step_surface');
        const tris = this.visualizer3D.getExportTriangles(target, isSurface, forStep);

        let filenameBase = '';
        let partName = '';
        if (target === 'worm') {
            filenameBase = `Truc_Vit_1_${typeCode}_z${g.z1}_mn${g.mn.toFixed(2)}`;
            partName = `WORM_1_${typeCode}_Z${g.z1}`;
        } else if (target === 'wheel') {
            filenameBase = `Banh_Vit_Lom_2_${typeCode}_z${g.z2}_mn${g.mn.toFixed(2)}`;
            partName = `WORM_WHEEL_2_${typeCode}_Z${g.z2}`;
        } else {
            filenameBase = `Cap_Truc_Vit_Banh_Vit_${typeCode}_z${g.z1}x${g.z2}_a${g.a.toFixed(1)}`;
            partName = `WORM_GEAR_ASSEMBLY_${typeCode}_Z${g.z1}x${g.z2}`;
        }

        if (isSurface) {
            filenameBase += '_Surface_Rong';
            partName += '_SURFACE';
        }

        if (format === 'step') {
            return Worm3DExporter.exportSTEP(tris, `${filenameBase}.step`, partName, true, false);
        } else if (format === 'step_surface') {
            return Worm3DExporter.exportSTEPSurface(tris, `${filenameBase}.step`, partName, true);
        } else if (format === 'stl' || format === 'stl_surface') {
            return Worm3DExporter.exportBinarySTL(tris, `${filenameBase}.stl`);
        } else if (format === 'obj') {
            return Worm3DExporter.exportOBJ(tris, `${filenameBase}.obj`);
        }
    }

    collectParams() {
        const checkedRadio = document.querySelector('input[name="rad_calc_q"]:checked');
        const calc_q = checkedRadio ? parseInt(checkedRadio.value, 10) : 1;

        return {
            // Section 1.0
            poweredWoWh: parseInt(document.getElementById('sel_poweredWoWh')?.value || '1', 10),
            Pw2: this.parseVal('inp_Pw2', 3.0),
            n1: this.parseVal('inp_n1', 1500.0),
            iin: this.parseVal('inp_iin', 40.0),

            // Section 2.0
            matP: parseInt(document.getElementById('sel_matP')?.value || '41', 10),
            matW: parseInt(document.getElementById('sel_matW')?.value || '7', 10),
            toothType: parseInt(document.getElementById('sel_toothType')?.value || '2', 10),
            loadTypeA: parseInt(document.getElementById('sel_loadTypeA')?.value || '1', 10),
            loadTypeB: parseInt(document.getElementById('sel_loadTypeB')?.value || '1', 10),
            designCooling: parseInt(document.getElementById('sel_designCooling')?.value || '1', 10),
            oilType: parseInt(document.getElementById('sel_oilType')?.value || '3', 10),
            lubricant: parseInt(document.getElementById('sel_lubricant')?.value || '6', 10),
            ny40: this.parseVal('inp_ny40', 220.0),
            ny100: this.parseVal('inp_ny100', 40.0),
            rooil15: this.parseVal('inp_rooil15', 1.06),
            Ra1: this.parseVal('inp_Ra1', 0.5),
            kaFlag: document.getElementById('chk_kaFlag')?.checked ?? true,
            KA: this.parseVal('inp_KA', 1.0),

            // Section 3.0
            haXP: this.parseVal('inp_haXP', 1.0),
            caXP: this.parseVal('inp_caXP', 0.25),
            rf1Flag: document.getElementById('chk_rf1Flag')?.checked ?? true,
            rf1: this.parseVal('inp_rf1', 0.3799508411451843),

            // Section 4.0
            z1: Math.max(1, Math.round(this.parseVal('inp_z1', 1))),
            alfa_temp: this.parseVal('inp_alfa_temp', 20.0),
            calc_q: calc_q,
            q: this.parseVal('inp_q', 8.5),
            d1_Input: this.parseVal('inp_d1_Input', 36.23149719358681),
            gama: this.parseVal('inp_gama', 6.709836807756933),
            teethOrientation: parseInt(document.getElementById('sel_teethOrientation')?.value || '1', 10),
            m_Input: this.parseVal('inp_m_Input', 25.4 / 6.0),
            l1_proc: this.parseVal('inp_l1_proc', 50.0),
            l2_proc: this.parseVal('inp_l2_proc', 50.0),
            l1l2_flag: document.getElementById('chk_l1l2_flag')?.checked ?? true,
            l1_input: this.parseVal('inp_l1_input', 89.4839149653023),
            l2_input: this.parseVal('inp_l2_input', 89.4839149653023),
            FlagL: document.getElementById('chk_FlagL')?.checked ?? true,
            L_Input: this.parseVal('inp_L_Input', 56.72666666666667),
            Flagb2H: document.getElementById('chk_Flagb2H')?.checked ?? true,
            b2H_Input: this.parseVal('inp_b2H_Input', 33.57),
            x2: this.parseVal('inp_x2', 0.0),
            a_req1_Input: this.parseVal('inp_a_req1_Input', 100.0),
            FitAxis: parseInt(document.getElementById('sel_FitAxis')?.value || '2', 10),

            // Section 5.0
            de2Flag: document.getElementById('chk_de2Flag')?.checked ?? true,
            de2Input: this.parseVal('inp_de2Input', 183.23),

            // Section 6.0
            bearingType: parseInt(document.getElementById('sel_bearingType')?.value || '1', 10),

            // Section 16.0
            z1_req: Math.max(1, Math.round(this.parseVal('inp_z1_req', 1))),
            z2_req: Math.max(5, Math.round(this.parseVal('inp_z2_req', 50))),
            a_req: this.parseVal('inp_a_req', 180.0),

            // Section 18.0
            XX_z1: this.parseVal('inp_XX_z1', 2.0),
            XX_z2: this.parseVal('inp_XX_z2', 41.0),
            XX_n1: this.parseVal('inp_XX_n1', 1600.0),
            XX_n2_ratio: this.parseVal('inp_XX_n2_ratio', 80.0),
            XX_Mk2: this.parseVal('inp_XX_Mk2', 300.0),
            XX_n2: this.parseVal('inp_XX_n2', 3.75),

            // Section 19.0
            dstFlag: document.getElementById('chk_dstFlag')?.checked ?? true,
            Shaft_ds: this.parseVal('inp_Shaft_ds', 21.4),
            Shaft_th: this.parseVal('inp_Shaft_th', 1.1),
            DXF_Beta: this.parseVal('inp_DXF_Beta', 10.0)
        };
    }

    recalculate() {
        const params = this.collectParams();
        const res = WormCalcEngine.calculate(params);
        this.latestResult = res;
        window.latestWormResult = res;

        this.renderDOM(res);
        this.canvasRenderer.updateGeometry(res);

        // Update 3D Badge & 3D WebGL Geometry
        const typeNames = { 1: 'ZA', 2: 'ZN', 3: 'ZI', 4: 'ZK' };
        const typeCode = typeNames[res.toothType] || 'ZN';
        const orientStr = res.teethOrientation === 2 ? 'Ren Trái' : 'Ren Phải';
        this.setVal('badge3DType', `🌀 Trục Vít - Bánh Vít Lõm (${typeCode} - ${orientStr})`);
        this.setVal('badge3DRatio', `${res.i.toFixed(2)} (z1=${res.z1}, z2=${res.z2})`);
        this.setVal('badge3DA', `${res.a.toFixed(3)} mm`);
        this.setVal('badge3DGama', `${res.gama.toFixed(3)}°`);

        if (this.visualizer3D && this.activeMode === '3D') {
            const curW = this.visualizer3D.wormAngle;
            const curG = this.visualizer3D.wheelAngle;
            this.visualizer3D.setGeometry(res);
            this.visualizer3D.wormAngle = curW;
            this.visualizer3D.wheelAngle = curG;
            this.visualizer3D.updateGearRotations();
        }
    }

    renderDOM(r) {
        // Executive Summary Banner
        this.setVal('summaryA', `${r.a.toFixed(2)} mm`);
        this.setVal('summaryRatio', `${r.i.toFixed(2)} (${r.z1}:${r.z2})`);
        this.setVal('summaryGama', `${r.gama.toFixed(2)}°`);
        this.setVal('summaryEta', `${r.etages_pct.toFixed(1)} %`);
        this.setVal('summarySelfLock', r.isSelfLocking
            ? `Tự hãm tĩnh (γ ≤ ${r.gama_SelfLock.toFixed(2)}°)`
            : `Không tự hãm (γ > ${r.gama_SelfLock.toFixed(2)}°)`);

        const dot = document.getElementById('summaryStatusDot');
        const txt = document.getElementById('summaryStatusText');
        const isGeomOk = (r.Flag_z2min === 0);
        if (dot && txt) {
            dot.className = 'status-indicator ' + (isGeomOk ? 'status-safe' : 'status-warning');
            txt.textContent = isGeomOk
                ? 'ĐẠT TIÊU CHUẨN DIN 3975 / DIN 3996'
                : 'CẢNH BÁO: CẮT CHÂN RĂNG (x2 < xmin)';
        }

        // Section 1.0
        this.setVal('out_Pw1', r.Pw1, 4);
        this.setVal('out_n2', r.n2, 2);
        this.setVal('out_Mk1', r.Mk1, 3);
        this.setVal('out_Mk2', r.Mk2, 3);
        this.setVal('out_i', r.i, 2);
        this.setVal('out_i_dev', `${r.i_dev_pct >= 0 ? '+' : ''}${r.i_dev_pct.toFixed(2)} %`);

        // Section 2.0
        this.setVal('out_matP_des', r.wormMat.designation || r.wormMat.name);
        this.setVal('out_matW_des', r.wheelMat.designation || r.wheelMat.name);
        this.setVal('out_lubIndex', `Nhóm ${r.lubricationIndex}`);
        this.setVal('out_YW', r.YW, 2);
        this.setVal('out_YR', r.YR, 4);
        this.setVal('out_KA_Prop', r.KA_Prop, 2);
        if (r.kaFlag) this.setVal('inp_KA', r.KA, 2);
        this.setVal('out_mat1_prop', `${r.Rm1} / ${r.Rp02_1} (E=${r.E1})`);
        this.setVal('out_mat2_prop', `${r.Rm2} / ${r.Rp02_2} (E=${r.E2})`);

        // Section 3.0
        this.setVal('out_haXG', r.haXG, 2);
        this.setVal('out_caXG', r.caXG, 2);
        this.setVal('out_rf1_rec', r.rf1_rec, 4);
        if (r.rf1Flag) this.setVal('inp_rf1', r.rf1, 4);
        this.setVal('out_rf2', r.rf2, 4);

        // Section 4.0
        this.setVal('out_z2', r.z2, 0);
        this.setVal('lbl_alfa_type', r.toothType === 1
            ? 'Góc ăn khớp dọc trục α₀ (4.10) — Hệ ZA'
            : 'Góc ăn khớp pháp tuyến αn (4.10) — Hệ ZN/ZI/ZK');
        this.setVal('out_q_rec', r.q_rec, 1);

        if (r.calc_q !== 1) this.setVal('inp_q', r.q, 4);
        if (r.calc_q !== 2) this.setVal('inp_d1_Input', r.d1, 4);
        if (r.calc_q !== 3) this.setVal('inp_gama', r.gama, 4);

        this.setVal('out_d1_rec', `~ ${r.d1_rec.toFixed(2)}`);
        this.setVal('out_gama_SL', `< ${r.gama_SelfLock.toFixed(2)}°`);

        this.setVal('sym_module_mode', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_module_conj', r.toothType === 1 ? r.mn : r.mx, 4);
        this.setVal('out_CP', r.CP, 4);
        this.setVal('out_DP', r.DP, 4);

        if (r.l1l2_flag) {
            this.setVal('inp_l1_input', r.l1, 2);
            this.setVal('inp_l2_input', r.l2, 2);
        }
        this.setVal('out_L_Proposal', `> ${r.L_Proposal.toFixed(2)}`);
        if (r.FlagL) this.setVal('inp_L_Input', r.L, 2);

        this.setVal('out_b2H_Proposal', r.b2H_Proposal, 2);
        if (r.Flagb2H) this.setVal('inp_b2H_Input', r.b2H, 2);

        this.setVal('out_xmin_limit', `> ${r.xmin.toFixed(3)}`);
        const sliderX2 = document.getElementById('slider_x2');
        if (sliderX2 && document.activeElement !== sliderX2) {
            sliderX2.value = Math.max(-1, Math.min(1, r.x2));
        }

        this.setVal('out_sec4_d1', r.d1, 3);
        this.setVal('out_sec4_d2', r.d2, 3);
        this.setVal('out_sec4_a', r.a, 3);
        this.setVal('out_mass', r.mass, 2);
        this.setVal('out_mass_gears', r.mass_gears, 2);
        this.setVal('out_sec4_etages', r.etages_pct, 2);
        this.setVal('out_sec4_etamax', `< ${r.etamax_pct.toFixed(2)}`);

        // Section 5.0 (DIN 3975)
        this.setVal('out_mn', r.mn, 4);
        this.setVal('out_mt', r.mt, 4);
        this.setVal('out_mx', r.mx, 4);
        this.setVal('out_pn', r.pn, 4);
        this.setVal('out_pt', r.pt, 4);
        this.setVal('out_px', r.px, 4);
        this.setVal('out_alfan', r.alfan, 4);
        this.setVal('out_alfat', r.alfat, 4);
        this.setVal('out_alfax', r.alfax, 4);
        this.setVal('out_sec5_z1', r.z1, 0);
        this.setVal('out_sec5_z2', r.z2, 0);
        this.setVal('out_da1', r.da1, 3);
        this.setVal('out_da2', r.da2, 3);
        this.setVal('out_d1', r.d1, 3);
        this.setVal('out_d2', r.d2, 3);
        this.setVal('out_df1', r.df1, 3);
        this.setVal('out_df2', r.df2, 3);
        this.setVal('out_dw1', r.dw1, 3);
        this.setVal('out_dw2', r.dw2, 3);
        this.setVal('out_dm1', r.dm1, 3);
        this.setVal('out_dm2', r.dm2, 3);
        if (r.de2Flag) this.setVal('inp_de2Input', r.de2, 2);
        this.setVal('out_de2_range', r.de2_range_str);
        this.setVal('out_ha1', r.ha1, 3);
        this.setVal('out_ha2', r.ha2, 3);
        this.setVal('out_hf1', r.hf1, 3);
        this.setVal('out_hf2', r.hf2, 3);
        this.setVal('out_a', r.a, 3);
        this.setVal('out_L', r.L, 2);
        this.setVal('out_b2H', r.b2H, 2);
        this.setVal('out_sec5_gama', r.gama, 4);
        this.setVal('out_gamaw', r.gamaw, 4);
        this.setVal('out_gamab', r.gamab, 4);
        this.setVal('out_sn1', r.sn1, 3);
        this.setVal('out_sn2', r.sn2, 3);
        this.setVal('out_sx1', r.sx1, 3);
        this.setVal('out_sx2', r.sx2, 3);
        this.setVal('out_en1', r.en1, 3);
        this.setVal('out_en2', r.en2, 3);
        this.setVal('out_ex1', r.ex1, 3);
        this.setVal('out_ex2', r.ex2, 3);

        // Section 6.0 (DIN 3996 Efficiency & Losses)
        this.setVal('out_vgm', r.vgm, 4);
        this.setVal('out_v1', r.v1, 4);
        this.setVal('out_v2', r.v2, 4);
        this.setVal('out_YS', r.YS, 4);
        this.setVal('out_YG', r.YG, 4);
        this.setVal('out_h_x', r.h_x, 5);
        this.setVal('out_sec6_YW', r.YW, 2);
        this.setVal('out_sec6_YR', r.YR, 4);
        this.setVal('out_eta0T', r.eta0T, 5);
        this.setVal('out_etazm', r.etazm, 5);
        this.setVal('out_roz', r.roz, 4);
        this.setVal('out_etaStatic', r.etaStatic, 5);
        this.setVal('out_etaz', r.etaz * 100.0, 2);
        this.setVal('out_PV0', r.PV0, 4);
        this.setVal('out_PV0_W', r.PV0_W, 2);
        this.setVal('out_PVLP', r.PVLP, 4);
        this.setVal('out_PVD', r.PVD, 4);
        this.setVal('out_PVD_W', r.PVD_W, 2);
        this.setVal('out_PVz', r.PVz, 4);
        this.setVal('out_PVz_W', r.PVz_W, 2);
        this.setVal('out_PV', r.PV, 4);
        this.setVal('out_PV_W', r.PV_W, 2);
        this.setVal('out_etages', r.etages_pct, 2);
        this.setVal('out_etages_pct2', r.etages, 4);

        // Section 12.0 AGMA
        this.setVal('out_NW', r.NW, 0);
        this.setVal('out_NG', r.NG, 0);
        this.setVal('out_mG', r.mG, 3);
        this.setVal('out_C_agma', r.C_agma, 4);
        this.setVal('out_pitchx', r.pitchx, 4);
        this.setVal('out_d_rec_agma', r.d_rec_agma_str);
        this.setVal('out_d_LC', r.d_LC, 4);
        this.setVal('out_D_UC', r.D_UC, 4);
        this.setVal('out_Lead_agma', r.Lead_agma, 4);
        this.setVal('out_leadAngle_agma', r.leadAngle_agma, 4);
        this.setVal('out_addendum_agma', r.addendum_agma, 4);
        this.setVal('out_dedendum_agma', r.dedendum_agma, 4);
        this.setVal('out_do1_agma', r.do1_agma, 4);
        this.setVal('out_Do2_agma', r.Do2_agma, 4);
        this.setVal('out_dr_agma', r.dr_agma, 4);
        this.setVal('out_Dt_agma', r.Dt_agma, 4);
        this.setVal('out_clearance_agma', r.clearance_agma, 4);
        this.setVal('out_FWmax_agma', r.FWmax_agma, 4);
        this.setVal('out_FG_agma', r.FG_agma, 4);
        this.setVal('out_agma_mm', `${r.FWmax_agma_mm.toFixed(2)} / ${r.FG_agma_mm.toFixed(2)} mm`);

        // Section 16.0 AxisDistTbl
        const selAxisDist = document.getElementById('sel_AxisDist');
        if (selAxisDist && Array.isArray(r.axisDistSolutions)) {
            const prevIdx = selAxisDist.value;
            selAxisDist.innerHTML = '';
            r.axisDistSolutions.forEach((row, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = row.label;
                selAxisDist.appendChild(opt);
            });
            if (prevIdx && selAxisDist.querySelector(`option[value="${prevIdx}"]`)) {
                selAxisDist.value = prevIdx;
            }
            this.setVal('out_AxisDistCount', `${r.axisDistSolutions.length} phương án hợp lệ`);
        }

        // Section 18.0
        this.setVal('out_XXX_i', r.XXX_i, 3);
        this.setVal('out_XX_i', r.XX_i, 3);
        this.setVal('out_XX_Pw2', r.XX_Pw2, 4);

        // Section 19.0
        this.setVal('out_DXF_AutoScale', r.DXF_AutoScale, 3);
        if (r.dstFlag) {
            this.setVal('inp_Shaft_ds', r.Shaft_ds, 1);
            this.setVal('inp_Shaft_th', r.Shaft_th, 1);
        }
        this.setVal('out_ABOM', `${r.ABOM01} | ${r.ABOM02} | ${r.ABOM03}`);
        this.setVal('out_BBOM', `${r.BBOM01} | ${r.BBOM02} | ${r.BBOM03}`);

        this.setVal('dxf_worm_m_sym', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_dxf_worm_m', r.dxf_worm_m, 3);
        this.setVal('out_dxf_worm_z1', r.dxf_worm_z1, 0);
        this.setVal('out_dxf_worm_alfa', `${r.dxf_worm_alfa}°`);
        this.setVal('out_dxf_worm_d1', r.dxf_worm_d1, 3);
        this.setVal('out_dxf_worm_da1', r.dxf_worm_da1, 3);
        this.setVal('out_dxf_worm_L', r.dxf_worm_L, 3);
        this.setVal('out_dxf_worm_mat', r.dxf_worm_mat);
        this.setVal('out_dxf_worm_a', r.dxf_worm_a, 3);
        this.setVal('out_dxf_worm_z2', r.dxf_worm_z2, 0);

        this.setVal('dxf_wheel_m_sym', r.toothType === 1 ? 'mx' : 'mn');
        this.setVal('out_dxf_wheel_m', r.dxf_wheel_m, 3);
        this.setVal('out_dxf_wheel_z2', r.dxf_wheel_z2, 0);
        this.setVal('out_dxf_wheel_alfa', `${r.dxf_wheel_alfa}°`);
        this.setVal('out_dxf_wheel_d2', r.dxf_wheel_d2, 3);
        this.setVal('out_dxf_wheel_da2', r.dxf_wheel_da2, 3);
        this.setVal('out_dxf_wheel_b2H', r.dxf_wheel_b2H, 3);
        this.setVal('out_dxf_wheel_x2', r.dxf_wheel_x2, 3);
        this.setVal('out_dxf_wheel_mat', r.dxf_wheel_mat);
        this.setVal('out_dxf_wheel_a', r.dxf_wheel_a, 3);
        this.setVal('out_dxf_wheel_z1', r.dxf_wheel_z1, 0);
    }

    /**
     * Exact port of VBA FitAxisDistance (Rows 174-177 in Gear4_01.xlsb)
     */
    solveFitAxisDistance() {
        if (!this.latestResult) return;
        const r = this.latestResult;
        const fitMode = parseInt(document.getElementById('sel_FitAxis')?.value || '2', 10);

        if (fitMode === 1) {
            // 1. Change Module (m_Input = m_for_a)
            const elM = document.getElementById('inp_m_Input');
            if (elM && Number.isFinite(r.m_for_a) && r.m_for_a > 0) {
                elM.value = r.m_for_a.toFixed(6);
            }
        } else if (fitMode === 2) {
            // 2. Change Profile Shift x2 (x2 = x_for_a)
            const elX2 = document.getElementById('inp_x2');
            if (elX2 && Number.isFinite(r.x_for_a)) {
                elX2.value = r.x_for_a.toFixed(6);
            }
        } else if (fitMode === 3 && r.calc_q === 1) {
            // 3. Change Diametral Quotient q (q = q_for_a)
            const elQ = document.getElementById('inp_q');
            if (elQ && Number.isFinite(r.q_for_a) && r.q_for_a > 0) {
                elQ.value = r.q_for_a.toFixed(6);
            }
        }
        this.recalculate();
    }

    /**
     * Exact port of applying a row from Section 16.0 AxisDistTbl to Section 4.0
     */
    applySelectedAxisDistVariant() {
        if (!this.latestResult || !Array.isArray(this.latestResult.axisDistSolutions)) return;
        const sel = document.getElementById('sel_AxisDist');
        const idx = sel ? parseInt(sel.value, 10) : 0;
        const row = this.latestResult.axisDistSolutions[idx];
        if (!row) return;

        const elZ1 = document.getElementById('inp_z1');
        const elIin = document.getElementById('inp_iin');
        const elM = document.getElementById('inp_m_Input');
        const elQ = document.getElementById('inp_q');
        const elX2 = document.getElementById('inp_x2');
        const radio1 = document.querySelector('input[name="rad_calc_q"][value="1"]');

        if (radio1) radio1.checked = true;
        this.syncRadioCalcQVisuals();

        if (elZ1) elZ1.value = row.z1;
        if (elIin) elIin.value = row.i.toFixed(2);
        if (elM) elM.value = row.m;
        if (elQ) elQ.value = row.q;
        if (elX2) elX2.value = row.x2.toFixed(6);

        this.recalculate();
    }

    resetDefaults() {
        const setValDirect = (id, v) => {
            const el = document.getElementById(id);
            if (el) el.value = v;
        };
        const setChkDirect = (id, c) => {
            const el = document.getElementById(id);
            if (el) el.checked = c;
        };

        // Exact SI defaults from C:\MITCalc\gear4\Gear4_01.xlsb
        setValDirect('sel_poweredWoWh', '1');
        setValDirect('inp_Pw2', '3.0');
        setValDirect('inp_n1', '1500.0');
        setValDirect('inp_iin', '40.0');

        setValDirect('sel_matP', '41');
        setValDirect('sel_matW', '7');
        setValDirect('sel_toothType', '2');
        setValDirect('sel_loadTypeA', '1');
        setValDirect('sel_loadTypeB', '1');
        setValDirect('sel_designCooling', '1');
        setValDirect('sel_oilType', '3');
        setValDirect('sel_lubricant', '6');
        setValDirect('inp_ny40', '220.0');
        setValDirect('inp_ny100', '40.0');
        setValDirect('inp_rooil15', '1.06');
        setValDirect('inp_Ra1', '0.5');
        setChkDirect('chk_kaFlag', true);

        setValDirect('inp_haXP', '1.0');
        setValDirect('inp_caXP', '0.25');
        setChkDirect('chk_rf1Flag', true);

        setValDirect('inp_z1', '1');
        setValDirect('inp_alfa_temp', '20.0');
        const radio1 = document.querySelector('input[name="rad_calc_q"][value="1"]');
        if (radio1) radio1.checked = true;
        setValDirect('inp_q', '8.5');
        setValDirect('sel_teethOrientation', '1');
        setValDirect('inp_m_Input', String(25.4 / 6.0));
        setValDirect('inp_l1_proc', '50.0');
        setValDirect('inp_l2_proc', '50.0');
        setChkDirect('chk_l1l2_flag', true);
        setChkDirect('chk_FlagL', true);
        setChkDirect('chk_Flagb2H', true);
        setValDirect('inp_x2', '0.0');
        setValDirect('inp_a_req1_Input', '100.0');
        setValDirect('sel_FitAxis', '2');

        setChkDirect('chk_de2Flag', true);
        setValDirect('sel_bearingType', '1');

        setValDirect('inp_z1_req', '1');
        setValDirect('inp_z2_req', '50');
        setValDirect('inp_a_req', '180.0');

        setValDirect('inp_XX_z1', '2');
        setValDirect('inp_XX_z2', '41');
        setValDirect('inp_XX_n1', '1600.0');
        setValDirect('inp_XX_n2_ratio', '80.0');
        setValDirect('inp_XX_Mk2', '300.0');
        setValDirect('inp_XX_n2', '3.75');

        setChkDirect('chk_dstFlag', true);
        setValDirect('inp_DXF_Beta', '10.0');

        this.syncRadioCalcQVisuals();
        this.syncAutoFlagsVisuals();
        this.recalculate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.WormUI = new WormUIController();
    window.wormUI = window.WormUI;
});
