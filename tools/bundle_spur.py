import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spur_dir = os.path.join(base_dir, 'modules', 'spur-gear')
bundle_path = os.path.join(spur_dir, "js", "mitcalc-engine.bundle.js")

spur_ref_path = os.path.join(base_dir, "spur_ref.json")
helical_ref_path = os.path.join(base_dir, "helical_ref.json")

spur_ref_json = "{}"
if os.path.exists(spur_ref_path):
    with open(spur_ref_path, "r", encoding="utf-8") as f:
        spur_ref_json = f.read().strip()

helical_ref_json = "{}"
if os.path.exists(helical_ref_path):
    with open(helical_ref_path, "r", encoding="utf-8") as f:
        helical_ref_json = f.read().strip()

ref_code = f"""
const SPUR_REF_BENCHMARK = {spur_ref_json};
const HELICAL_REF_BENCHMARK = {helical_ref_json};
"""

with open(os.path.join(spur_dir, "js", "data", "materials.js"), "r", encoding="utf-8") as f:
    mat_code = f.read().replace("export const Materials =", "const Materials =")

with open(os.path.join(spur_dir, "js", "data", "standard-tables.js"), "r", encoding="utf-8") as f:
    tables_code = f.read().replace("export const StandardTables =", "const StandardTables =")

with open(os.path.join(spur_dir, "js", "data", "i18n.js"), "r", encoding="utf-8") as f:
    i18n_code = f.read().replace("export const I18N =", "const I18N =")

with open(os.path.join(spur_dir, "js", "engine", "math-utils.js"), "r", encoding="utf-8") as f:
    math_code = f.read().replace("export const MathUtils =", "const MathUtils =")

with open(os.path.join(spur_dir, "js", "engine", "mitcalc-tooth-solver.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    solver_tooth_code = "".join(lines).replace("export const MitcalcToothSolver =", "const MitcalcToothSolver =") + "\nif (typeof window !== 'undefined') window.MitcalcToothSolver = MitcalcToothSolver;\n"

with open(os.path.join(spur_dir, "js", "engine", "tooth-profile-generator.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    tooth_code = "".join(lines).replace("export const ToothProfileGenerator =", "const ToothProfileGenerator =") + "\nif (typeof window !== 'undefined') window.ToothProfileGenerator = ToothProfileGenerator;\n"

with open(os.path.join(spur_dir, "js", "engine", "gear-geometry.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    geom_code = "".join(lines).replace("export const GearGeometry =", "const GearGeometry =")

with open(os.path.join(spur_dir, "js", "engine", "center-distance-solver.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    solver_code = "".join(lines).replace("export const CenterDistanceSolver =", "const CenterDistanceSolver =")

with open(os.path.join(spur_dir, "js", "ui", "gear-canvas.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    canvas_code = "".join(lines).replace("export class GearCanvas", "class GearCanvas")

with open(os.path.join(spur_dir, "js", "engine", "gear-3d-generator.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    gen3d_code = "".join(lines).replace("export const Gear3DGenerator =", "const Gear3DGenerator =")

with open(os.path.join(spur_dir, "js", "engine", "gear-3d-exporter.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    exp3d_code = "".join(lines).replace("export const Gear3DExporter =", "const Gear3DExporter =")

with open(os.path.join(spur_dir, "js", "ui", "gear-3d-visualizer.js"), "r", encoding="utf-8") as f:
    lines = [l for l in f if not l.strip().startswith("import ")]
    vis3d_code = "".join(lines).replace("export class Gear3DVisualizer", "class Gear3DVisualizer")

ui_code = r'''
const PROFILE_RESOLUTION_LEVELS = {
    1: { level: 1, name: 'Mức 1 (Thô)', noPtHead: 8, noPtEv: 32, cuttStep: 1.0, ptsPerTooth: 80 },
    2: { level: 2, name: 'Mức 2', noPtHead: 10, noPtEv: 45, cuttStep: 0.9, ptsPerTooth: 110 },
    3: { level: 3, name: 'Mức 3', noPtHead: 12, noPtEv: 58, cuttStep: 0.8, ptsPerTooth: 140 },
    4: { level: 4, name: 'Mức 4', noPtHead: 14, noPtEv: 72, cuttStep: 0.7, ptsPerTooth: 172 },
    5: { level: 5, name: 'Mức 5', noPtHead: 17, noPtEv: 86, cuttStep: 0.6, ptsPerTooth: 206 },
    6: { level: 6, name: 'Mức 6 (Chuẩn Gốc MITCalc 1.74)', noPtHead: 20, noPtEv: 100, cuttStep: 0.5, ptsPerTooth: 240 },
    7: { level: 7, name: 'Mức 7', noPtHead: 24, noPtEv: 120, cuttStep: 0.4, ptsPerTooth: 288 },
    8: { level: 8, name: 'Mức 8', noPtHead: 28, noPtEv: 145, cuttStep: 0.35, ptsPerTooth: 346 },
    9: { level: 9, name: 'Mức 9', noPtHead: 32, noPtEv: 175, cuttStep: 0.3, ptsPerTooth: 414 },
    10: { level: 10, name: 'Mức 10', noPtHead: 36, noPtEv: 210, cuttStep: 0.25, ptsPerTooth: 492 },
    11: { level: 11, name: 'Mức 11 (Siêu Mịn CNC/EDM)', noPtHead: 40, noPtEv: 260, cuttStep: 0.2, ptsPerTooth: 600 }
};

class SpurGearUI {
    constructor() {
        this.inputs = {
            Pw: 100.0,
            n1: 1000.0,
            target_i: 2.500,
            z1: 19,
            z2: 48,
            alfa_n: 20.0,
            beta: 0.0,
            mn: 6.0,
            b1: 120.0,
            b2: 117.0,
            x1: 0.0,
            x2: 0.0,
            ha0: 1.25,
            hf0: 1.00,
            ra0: 0.38,
            ca_star: 0.25,
            jn: 0.0000,
            Q: 6,
            auto_accuracy: true,
            sec11_Q: 6,
            KAS: 2.0,
            Lh: 20000,
            SH_req: 1.30,
            SF_req: 1.60,
            auto_zw: true,
            auto_dt: true,
            zw1: null,
            zw2: null,
            dt1: null,
            dt2: null,
            W1_req: 77.0,
            W2_req: 260.0,
            M1_req: 240.0,
            M2_req: 700.0,
            mat1_id: 35,
            mat2_id: 35,
            sec20_drawn_teeth: 4,
            sec20_no_pt_head: 20,
            sec20_no_pt_ev: 100,
            sec20_cutt_step: 0.5,
            cad_system: 'dxf_step'
        };

        this.profileResolution = 6;
        this.activeMode = '2D';
        const canvasEl = document.getElementById('gearCanvas');
        this.canvasController = canvasEl ? new GearCanvas(canvasEl) : null;

        const container3DEl = document.getElementById('gear3DContainer');
        this.visualizer3D = (typeof Gear3DVisualizer !== 'undefined' && container3DEl) ? new Gear3DVisualizer(container3DEl) : null;

        this.initDOM();
        this.initAccordion();
        this.initMaterials();
        this.initMaterialsTable();
        this.initInputs();
        this.initSmartControls();
        this.calculate();
    }

    setProfileResolution(lvl) {
        lvl = Math.max(1, Math.min(11, parseInt(lvl, 10) || 6));
        this.profileResolution = lvl;
        const resInfo = PROFILE_RESOLUTION_LEVELS[lvl];

        const slider1 = document.getElementById('sliderProfileResolution');
        if (slider1) slider1.value = lvl;
        const slider2 = document.getElementById('sliderProfileResolutionCanvas');
        if (slider2) slider2.value = lvl;

        const lbl1 = document.getElementById('lblProfileResolution');
        if (lbl1) lbl1.textContent = `${resInfo.name} (${resInfo.ptsPerTooth} điểm/răng, Δψ=${resInfo.cuttStep}°)`;
        const lbl2 = document.getElementById('lblProfileResolutionCanvas');
        if (lbl2) lbl2.textContent = `Mức ${lvl} (${resInfo.ptsPerTooth} pts)`;

        const inHead = document.getElementById('in_sec20_no_pt_head');
        if (inHead) inHead.value = resInfo.noPtHead;
        const inEv = document.getElementById('in_sec20_no_pt_ev');
        if (inEv) inEv.value = resInfo.noPtEv;
        const inStep = document.getElementById('in_sec20_cutt_step');
        if (inStep) inStep.value = resInfo.cuttStep;
        this.inputs.sec20_no_pt_head = resInfo.noPtHead;
        this.inputs.sec20_no_pt_ev = resInfo.noPtEv;
        this.inputs.sec20_cutt_step = resInfo.cuttStep;

        if (this.g) {
            if (this.visualizer3D) {
                this.visualizer3D.setGeometry(this.g, {
                    noPtHead: resInfo.noPtHead,
                    noPtEv: resInfo.noPtEv,
                    cuttStep: resInfo.cuttStep
                });
            }
            this.renderCoordinatesTable(this.g);
        }
    }

    initDOM() {
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) btnExpandAll.addEventListener('click', () => this.toggleAllSections(true));
        if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => this.toggleAllSections(false));

        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.inputs = {
                    Pw: 100.0, n1: 1000.0, target_i: 2.500,
                    z1: 19, z2: 48, alfa_n: 20.0, beta: 0.0,
                    mn: 6.0, b1: 120.0, b2: 117.0, x1: 0.0, x2: 0.0,
                    ha0: 1.25, hf0: 1.00, ra0: 0.38, ca_star: 0.25,
                    jn: 0.0000,
                    Q: 6, auto_accuracy: true, sec11_Q: 6, KAS: 2.0, Lh: 20000, SH_req: 1.30, SF_req: 1.60,
                    auto_zw: true, auto_dt: true,
                    zw1: null, zw2: null, dt1: null, dt2: null,
                    W1_req: 77.0, W2_req: 260.0, M1_req: 240.0, M2_req: 700.0,
                    mat1_id: 35, mat2_id: 35
                };
                this.syncInputsToDOM();
                this.calculate();
            });
        }

        const btnPrint = document.getElementById('btnPrintReport');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

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
                    if (targetId === 'tabCanvas') {
                        if (this.activeMode === '3D' && this.visualizer3D) {
                            this.visualizer3D.onResize();
                        } else if (this.canvasController) {
                            this.canvasController.autoFit();
                            this.canvasController.render();
                        }
                    }
                }
            });
        });

        const btnZoomIn = document.getElementById('btnZoomIn');
        const btnZoomOut = document.getElementById('btnZoomOut');
        const btnResetView = document.getElementById('btnResetView');
        const btnToggleAnim = document.getElementById('btnToggleAnim');

        if (btnZoomIn && this.canvasController) {
            btnZoomIn.addEventListener('click', () => {
                this.canvasController.scale *= 1.2;
                this.canvasController.render();
            });
        }
        if (btnZoomOut && this.canvasController) {
            btnZoomOut.addEventListener('click', () => {
                this.canvasController.scale *= 0.8;
                this.canvasController.render();
            });
        }
        if (btnResetView && this.canvasController) {
            btnResetView.addEventListener('click', () => {
                this.canvasController.autoFit();
                this.canvasController.render();
            });
        }
        if (btnToggleAnim && this.canvasController) {
            btnToggleAnim.addEventListener('click', () => {
                if (this.canvasController.isAnimating) {
                    this.canvasController.stopAnimation();
                    btnToggleAnim.textContent = '▶️ Bắt Đầu Quay';
                } else {
                    this.canvasController.startAnimation();
                    btnToggleAnim.textContent = '⏸️ Tạm Dừng';
                }
            });
            this.canvasController.startAnimation();
        }

        const btn2DDir = document.getElementById('btn2DAnimDirection');
        if (btn2DDir && this.canvasController) {
            btn2DDir.addEventListener('click', () => {
                const dir = this.canvasController.toggleAnimDirection();
                if (dir === 1) {
                    btn2DDir.innerHTML = '🔄 Chiều: ↻ Thuận';
                    btn2DDir.style.color = '';
                    btn2DDir.style.borderColor = '';
                } else {
                    btn2DDir.innerHTML = '🔄 Chiều: ↺ Nghịch';
                    btn2DDir.style.color = '#f59e0b';
                    btn2DDir.style.borderColor = '#d97706';
                }
            });
        }


        const sliderSpeed = document.getElementById('sliderAnimSpeed');
        const speedVal = document.getElementById('animSpeedVal');
        if (sliderSpeed) {
            sliderSpeed.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 1.0;
                if (speedVal) speedVal.textContent = val.toFixed(1) + 'x';
                if (this.canvasController) this.canvasController.setAnimSpeed(val);
            });
        }

        const setupDropdown = (btnId, menuId) => {
            const btn = document.getElementById(btnId);
            const menu = document.getElementById(menuId);
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isShown = menu.style.display === 'block';
                    menu.style.display = isShown ? 'none' : 'block';
                });
                window.addEventListener('click', () => {
                    if (menu) menu.style.display = 'none';
                });
            }
        };

        setupDropdown('btnExportDXFMenu', 'exportDXFDropdown');
        setupDropdown('btnExportDXFCanvasMenu', 'exportDXFCanvasDropdown');

        const bindDXF = (id, target) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => this.exportDXF(target));
        };
        bindDXF('expDxfPinion', 'pinion');
        bindDXF('expDxfGear', 'gear');
        bindDXF('expDxfAssembly', 'assembly');
        bindDXF('expDxfPinionCanvas', 'pinion');
        bindDXF('expDxfGearCanvas', 'gear');
        bindDXF('expDxfAssemblyCanvas', 'assembly');
        bindDXF('btnExportDXFSec16Pinion', 'pinion');
        bindDXF('btnExportDXFSec16Gear', 'gear');
        bindDXF('btnExportDXFSec16Assembly', 'assembly');

        const btnExportDXF = document.getElementById('btnExportDXF');
        if (btnExportDXF) {
            btnExportDXF.addEventListener('click', () => this.exportDXF('assembly'));
        }

        const btnExportDXFCanvas = document.getElementById('btnExportDXFCanvas');
        if (btnExportDXFCanvas) {
            btnExportDXFCanvas.addEventListener('click', () => this.exportDXF('assembly'));
        }

        const setupResSlider = (sliderId) => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.setProfileResolution(parseInt(e.target.value, 10) || 6);
                });
            }
        };
        setupResSlider('sliderProfileResolution');
        setupResSlider('sliderProfileResolutionCanvas');

        const btnSolveAw = document.getElementById('btnSolveAw');
        if (btnSolveAw) {
            btnSolveAw.addEventListener('click', () => this.solveAxisDistance());
        }

        const btnRefreshAudit = document.getElementById('btnRefreshAudit');
        if (btnRefreshAudit) {
            btnRefreshAudit.addEventListener('click', () => this.calculate());
        }

        // 2D / 3D Mode Toggle
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
                if (visualizerTitle) visualizerTitle.textContent = '🔄 Mô Hình Ăn Khớp 2D Trực Quan (2D Involute Mesh Simulation)';
                if (visualizerDesc) visualizerDesc.textContent = 'Biên dạng thân khai chính xác, góc lượn chân răng chuẩn R = 0.38*mn, đường ăn khớp (Line of Action) và vòng tròn lăn dw1, dw2.';
                if (this.canvasController) {
                    this.canvasController.autoFit();
                    this.canvasController.render();
                }
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
                if (visualizerTitle) visualizerTitle.textContent = '🧊 Mô Phỏng Ăn Khớp 3D WebGL (Spur & Helical Gears)';
                if (visualizerDesc) visualizerDesc.textContent = 'Mô hình 3D thực thể xoay chuyển động ăn khớp liên tục. Tự động xoắn răng theo góc nghiêng beta, xuất file STEP/STL cho SolidWorks & Mastercam.';
                if (this.visualizer3D) {
                    this.visualizer3D.onResize();
                    if (this.g) this.visualizer3D.setGeometry(this.g);
                }
            });
        }

        // 3D Camera View Preset Dropdown (CAD Standard: SolidWorks / Mastercam)
        const sel3DViewPreset = document.getElementById('sel3DViewPreset');
        const btnReset3DView = document.getElementById('btnReset3DView');

        if (sel3DViewPreset && this.visualizer3D) {
            sel3DViewPreset.addEventListener('change', () => {
                this.visualizer3D.setCameraView(sel3DViewPreset.value);
            });
        }
        if (btnReset3DView && this.visualizer3D) {
            btnReset3DView.addEventListener('click', () => {
                if (sel3DViewPreset) sel3DViewPreset.value = 'iso';
                this.visualizer3D.setCameraView('iso');
            });
        }

        // 3D Wireframe & Animation Controls
        const btnWireframe = document.getElementById('btnToggleWireframe');
        if (btnWireframe && this.visualizer3D) {
            btnWireframe.addEventListener('click', () => {
                this.visualizer3D.toggleWireframe();
                btnWireframe.classList.toggle('active', this.visualizer3D.wireframeMode);
            });
        }

        const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
        if (btnToggle3DAnim && this.visualizer3D) {
            btnToggle3DAnim.addEventListener('click', () => {
                const isRunning = this.visualizer3D.toggleAnimation();
                btnToggle3DAnim.textContent = isRunning ? '⏸️ Dừng' : '▶️ Tiếp Tục';
            });
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
                if (anim3DSpeedVal) anim3DSpeedVal.textContent = val.toFixed(1) + 'x';
                this.visualizer3D.setAnimSpeed(val);
            });
        }

        // Chế độ "Chỉ Mặt Bên" (Flank Only Mode) - Quan sát trực tiếp vết tiếp xúc ăn khớp 2 mặt bên
        const btnToggleFlankOnly = document.getElementById('btnToggleFlankOnly');
        if (btnToggleFlankOnly && this.visualizer3D) {
            btnToggleFlankOnly.addEventListener('click', () => {
                const isFlankOnly = this.visualizer3D.toggleFlankOnly();
                if (isFlankOnly) {
                    btnToggleFlankOnly.style.background = '#0284c7';
                    btnToggleFlankOnly.style.color = '#ffffff';
                    btnToggleFlankOnly.style.borderColor = '#38bdf8';
                    btnToggleFlankOnly.innerHTML = '👁️ Đang Xem Mặt Bên';
                } else {
                    btnToggleFlankOnly.style.background = '';
                    btnToggleFlankOnly.style.color = '';
                    btnToggleFlankOnly.style.borderColor = '';
                    btnToggleFlankOnly.innerHTML = '👁️ Chỉ Mặt Bên';
                }
            });
        }

        // Kiểu Tiếp Xúc 3D: 'theory' (Lý thuyết đường thẳng) hoặc 'crowning' (Vết elip có độ vồng)
        const selContactTheoryMode = document.getElementById('selContactTheoryMode');
        if (selContactTheoryMode && this.visualizer3D) {
            selContactTheoryMode.addEventListener('change', (e) => {
                this.visualizer3D.setContactMode(e.target.value);
            });
        }

        const btn3DStepBack = document.getElementById('btn3DStepBack');
        const btn3DStepFwd = document.getElementById('btn3DStepFwd');
        if (btn3DStepBack && this.visualizer3D) {
            btn3DStepBack.addEventListener('click', () => {
                this.visualizer3D.stepAngle(-1);
                const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Tiếp Tục';
            });
        }
        if (btn3DStepFwd && this.visualizer3D) {
            btn3DStepFwd.addEventListener('click', () => {
                this.visualizer3D.stepAngle(1);
                const btnToggle3DAnim = document.getElementById('btnToggle3DAnim');
                if (btnToggle3DAnim) btnToggle3DAnim.textContent = '▶️ Tiếp Tục';
            });
        }



        // 3D Export Dropdown
        const btnExport3DMenu = document.getElementById('btnExport3DMenu');
        const export3DDropdown = document.getElementById('export3DDropdown');
        if (btnExport3DMenu && export3DDropdown) {
            btnExport3DMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShown = export3DDropdown.style.display === 'block';
                export3DDropdown.style.display = isShown ? 'none' : 'block';
            });
            window.addEventListener('click', () => {
                if (export3DDropdown) export3DDropdown.style.display = 'none';
            });
        }

        const bindExport = (id, format, target) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => this.export3DCAD(format, target));
            }
        };

        bindExport('expStepPinion', 'step', 'pinion');
        bindExport('expStepGear', 'step', 'gear');
        bindExport('expStepAssembly', 'step', 'assembly');
        bindExport('expStepSurfacePinion', 'step_surface', 'pinion');
        bindExport('expStepSurfaceGear', 'step_surface', 'gear');
        bindExport('expStepSurfaceAssembly', 'step_surface', 'assembly');
        bindExport('expStlPinion', 'stl', 'pinion');
        bindExport('expStlGear', 'stl', 'gear');
        bindExport('expStlAssembly', 'stl', 'assembly');
        bindExport('expStlSurfacePinion', 'stl_surface', 'pinion');
        bindExport('expStlSurfaceGear', 'stl_surface', 'gear');
        bindExport('expObjAssembly', 'obj', 'assembly');

        const btnToggleCoord = document.getElementById('btnToggleCoordTable');
        if (btnToggleCoord) {
            btnToggleCoord.addEventListener('click', () => {
                const container = document.getElementById('coordTableContainer');
                if (container) {
                    const isShown = container.style.display !== 'none';
                    container.style.display = isShown ? 'none' : 'block';
                    btnToggleCoord.textContent = isShown ? '👁️ Xem Bảng Tọa Độ' : '📁 Thu Gọn Tọa Độ';
                }
            });
        }

        const btnExportTxt = document.getElementById('btnExportCoordTxt');
        if (btnExportTxt) {
            btnExportTxt.addEventListener('click', () => this.exportCoordinatesTxt());
        }

        const btnSec20CAD = document.getElementById('btnSec20ExportCAD');
        if (btnSec20CAD) {
            btnSec20CAD.addEventListener('click', () => {
                const sel = document.getElementById('selCadSystem');
                const val = sel ? sel.value : 'dxf_step';
                if (val === 'stl') {
                    this.export3DCAD('stl', 'assembly');
                } else if (val === 'autocad') {
                    this.exportDXF();
                } else {
                    this.export3DCAD('step', 'assembly');
                }
            });
        }
    }

    syncInputsToDOM() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };
        setVal('in_Pw', this.inputs.Pw.toFixed(3));
        setVal('in_n1', this.inputs.n1.toFixed(2));
        setVal('in_target_i', this.inputs.target_i.toFixed(3));
        setVal('in_z1', this.inputs.z1);
        setVal('in_z2', this.inputs.z2);
        setVal('in_alfa_n', this.inputs.alfa_n.toFixed(1));
        setVal('in_beta', this.inputs.beta.toFixed(1));
        setVal('in_mn', this.inputs.mn.toFixed(3));
        setVal('in_b1', this.inputs.b1.toFixed(2));
        setVal('in_b2', this.inputs.b2.toFixed(2));
        setVal('in_x1', this.inputs.x1.toFixed(4));
        setVal('in_x2', this.inputs.x2.toFixed(4));
        setVal('in_ha0', this.inputs.ha0.toFixed(3));
        setVal('in_hf0', this.inputs.hf0.toFixed(3));
        setVal('in_ra0', this.inputs.ra0.toFixed(3));
        setVal('in_ca_star', this.inputs.ca_star.toFixed(4));
        setVal('in_zw1', this.inputs.zw1 !== null ? this.inputs.zw1 : (this.g ? this.g.zw1 : 3));
        setVal('in_zw2', this.inputs.zw2 !== null ? this.inputs.zw2 : (this.g ? this.g.zw2 : 6));
        setVal('in_dt1', (this.inputs.dt1 !== null ? this.inputs.dt1 : (this.g ? this.g.dt1 : 10.5)).toFixed(4));
        setVal('in_dt2', (this.inputs.dt2 !== null ? this.inputs.dt2 : (this.g ? this.g.dt2 : 10.5)).toFixed(4));
        setVal('in_W1_req', this.inputs.W1_req.toFixed(3));
        setVal('in_W2_req', this.inputs.W2_req.toFixed(3));
        setVal('in_M1_req', this.inputs.M1_req.toFixed(3));
        setVal('in_M2_req', this.inputs.M2_req.toFixed(3));
        const chkZw = document.getElementById('chkAutoZw');
        if (chkZw) chkZw.checked = this.inputs.auto_zw;
        const inZw1 = document.getElementById('in_zw1');
        if (inZw1) inZw1.disabled = this.inputs.auto_zw;
        const inZw2 = document.getElementById('in_zw2');
        if (inZw2) inZw2.disabled = this.inputs.auto_zw;
        const chkDt = document.getElementById('chkAutoDt');
        if (chkDt) chkDt.checked = this.inputs.auto_dt;
        const inDt1 = document.getElementById('in_dt1');
        if (inDt1) inDt1.disabled = this.inputs.auto_dt;
        const inDt2 = document.getElementById('in_dt2');
        if (inDt2) inDt2.disabled = this.inputs.auto_dt;
        const sliderX1 = document.getElementById('slider_x1');
        if (sliderX1) sliderX1.value = this.inputs.x1;
        const sliderX1Val = document.getElementById('slider_x1_val');
        if (sliderX1Val) sliderX1Val.textContent = this.inputs.x1.toFixed(4);
        setVal('in_jn', (this.inputs.jn !== undefined ? this.inputs.jn : 0.0).toFixed(4));
        const chkAcc = document.getElementById('chkAutoAccuracy');
        if (chkAcc) chkAcc.checked = this.inputs.auto_accuracy;
        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            this.updateAccuracyDropdown(this.inputs.beta, this.inputs.sec11_Q || this.inputs.Q);
            selSec11Acc.value = this.inputs.auto_accuracy ? this.inputs.Q : (this.inputs.sec11_Q || this.inputs.Q);
            selSec11Acc.disabled = this.inputs.auto_accuracy;
        }

        setVal('in_sec20_drawn_teeth', this.inputs.sec20_drawn_teeth || 4);
        setVal('in_sec20_no_pt_head', this.inputs.sec20_no_pt_head || 20);
        setVal('in_sec20_no_pt_ev', this.inputs.sec20_no_pt_ev || 100);
        setVal('in_sec20_cutt_step', (this.inputs.sec20_cutt_step || 0.5).toFixed(2));
        const selCad = document.getElementById('selCadSystem');
        if (selCad) selCad.value = this.inputs.cad_system || 'dxf_step';
    }

    updateAccuracyDropdown(beta, currentQ) {
        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (!selSec11Acc) return;
        const isHelical = Math.abs(beta || 0.0) > 1e-4;
        const grades = [
            { q: 3,  ra: '0.1',  v: isHelical ? 100 : 80 },
            { q: 4,  ra: '0.2',  v: isHelical ? 80 : 60 },
            { q: 5,  ra: '0.4',  v: isHelical ? 50 : 35 },
            { q: 6,  ra: '0.8',  v: isHelical ? 30 : 15 },
            { q: 7,  ra: '1.6',  v: isHelical ? 12 : 8 },
            { q: 8,  ra: '1.6',  v: isHelical ? 8 : 5 },
            { q: 9,  ra: '3.2',  v: isHelical ? 5 : 3 },
            { q: 10, ra: '6.3',  v: 3 },
            { q: 11, ra: '12.5', v: 3 },
            { q: 12, ra: '25',   v: 3 }
        ];
        const valToSelect = currentQ !== undefined ? currentQ : (parseInt(selSec11Acc.value) || 6);
        selSec11Acc.innerHTML = grades.map(g => {
            const prefix = g.q < 10 ? `${g.q}....` : `${g.q}..`;
            const selected = (g.q === valToSelect) ? ' selected' : '';
            return `<option value="${g.q}"${selected}>${prefix}(Ra max.= ${g.ra} / v max.= ${g.v})</option>`;
        }).join('');
        selSec11Acc.value = valToSelect;
    }

    initAccordion() {
        const headers = document.querySelectorAll('.section-header');
        headers.forEach(h => {
            h.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                const sec = h.closest('.calc-section');
                if (sec) {
                    const isCollapsed = sec.classList.contains('collapsed');
                    sec.classList.toggle('collapsed', !isCollapsed);
                    const toggle = h.querySelector('.section-toggle');
                    if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
                }
            });
        });
    }

    toggleAllSections(expand) {
        document.querySelectorAll('.calc-section').forEach(sec => {
            sec.classList.toggle('collapsed', !expand);
            const toggle = sec.querySelector('.section-toggle');
            if (toggle) toggle.textContent = expand ? '▼' : '▶';
        });
    }

    initMaterials() {
        const sel1 = document.getElementById('mat1Select');
        const sel2 = document.getElementById('mat2Select');
        if (!sel1 || !sel2 || typeof Materials === 'undefined') return;

        sel1.innerHTML = '';
        sel2.innerHTML = '';

        Materials.forEach(m => {
            const opt1 = document.createElement('option');
            opt1.value = m.id;
            opt1.textContent = `[${m.group}] ${m.fullName}`;
            if (m.id === this.inputs.mat1_id) opt1.selected = true;
            sel1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = m.id;
            opt2.textContent = `[${m.group}] ${m.fullName}`;
            if (m.id === this.inputs.mat2_id) opt2.selected = true;
            sel2.appendChild(opt2);
        });

        sel1.addEventListener('change', () => {
            this.inputs.mat1_id = parseInt(sel1.value) || 35;
            this.calculate();
        });
        sel2.addEventListener('change', () => {
            this.inputs.mat2_id = parseInt(sel2.value) || 35;
            this.calculate();
        });
    }

    initMaterialsTable() {
        const tbody = document.getElementById('matTableBody');
        if (!tbody || typeof Materials === 'undefined') return;
        tbody.innerHTML = '';

        Materials.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.id}</td>
                <td><span class="badge" style="background:#1e3a8a; color:#93c5fd; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${m.group}</span></td>
                <td><strong>${m.fullName}</strong></td>
                <td>${m.treatment || '-'}</td>
                <td>${m.hardness || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.Rm || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.Re || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.SigmaHlim || '-'}</td>
                <td style="text-align:right; font-family:Consolas;">${m.SigmaFlim || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    initInputs() {
        const bindInput = (id, key, isFloat = true) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', (e) => {
                const raw = e.target.value.replace(',', '.').trim();
                if (raw === '' || (key.startsWith('zw') && raw === '0') || (key.startsWith('dt') && raw === '0')) {
                    this.inputs[key] = null;
                    this.calculate();
                    return;
                }
                const val = isFloat ? parseFloat(raw) : parseInt(raw);
                if (!isNaN(val)) {
                    this.inputs[key] = val;
                    this.calculate();
                }
            });
        };

        bindInput('in_Pw', 'Pw');
        bindInput('in_n1', 'n1');
        bindInput('in_target_i', 'target_i');
        bindInput('in_z1', 'z1', false);
        bindInput('in_z2', 'z2', false);
        bindInput('in_alfa_n', 'alfa_n');
        bindInput('in_beta', 'beta');
        bindInput('in_mn', 'mn');
        bindInput('in_b1', 'b1');
        bindInput('in_b2', 'b2');
        bindInput('in_x1', 'x1');
        bindInput('in_x2', 'x2');
        bindInput('in_ha0', 'ha0');
        bindInput('in_hf0', 'hf0');
        bindInput('in_ra0', 'ra0');
        bindInput('in_ca_star', 'ca_star');
        bindInput('in_jn', 'jn');
        bindInput('in_zw1', 'zw1', false);
        bindInput('in_zw2', 'zw2', false);
        bindInput('in_dt1', 'dt1');
        bindInput('in_dt2', 'dt2');
        bindInput('in_W1_req', 'W1_req');
        bindInput('in_W2_req', 'W2_req');
        bindInput('in_M1_req', 'M1_req');
        bindInput('in_M2_req', 'M2_req');
        bindInput('in_sec20_drawn_teeth', 'sec20_drawn_teeth', false);
        bindInput('in_sec20_no_pt_head', 'sec20_no_pt_head', false);
        bindInput('in_sec20_no_pt_ev', 'sec20_no_pt_ev', false);
        bindInput('in_sec20_cutt_step', 'sec20_cutt_step');

        const selCad = document.getElementById('selCadSystem');
        if (selCad) {
            selCad.addEventListener('change', () => {
                this.inputs.cad_system = selCad.value;
            });
        }
    }

    initSmartControls() {
        const btnCalcP = document.getElementById('btnCalcP_from_Mk');
        if (btnCalcP) {
            btnCalcP.addEventListener('click', () => {
                const Mk1 = 955.0;
                this.inputs.Pw = (Mk1 * this.inputs.n1) / 9550.0;
                const inP = document.getElementById('in_Pw');
                if (inP) inP.value = this.inputs.Pw.toFixed(3);
                this.calculate();
            });
        }

        const btnCalcI_n = document.getElementById('btnCalcI_from_n');
        if (btnCalcI_n) {
            btnCalcI_n.addEventListener('click', () => {
                const n2 = this.inputs.n1 / (this.inputs.z2 / this.inputs.z1);
                this.inputs.target_i = this.inputs.n1 / n2;
                const inI = document.getElementById('in_target_i');
                if (inI) inI.value = this.inputs.target_i.toFixed(3);
                this.calculate();
            });
        }

        const btnCalcI_z = document.getElementById('btnCalcI_from_z');
        if (btnCalcI_z) {
            btnCalcI_z.addEventListener('click', () => {
                this.inputs.target_i = this.inputs.z2 / this.inputs.z1;
                const inI = document.getElementById('in_target_i');
                if (inI) inI.value = this.inputs.target_i.toFixed(3);
                this.calculate();
            });
        }

        const selRatio = document.getElementById('selStandardRatio');
        if (selRatio) {
            selRatio.addEventListener('change', () => {
                if (selRatio.value !== 'custom') {
                    this.inputs.target_i = parseFloat(selRatio.value);
                    const inI = document.getElementById('in_target_i');
                    if (inI) inI.value = this.inputs.target_i.toFixed(3);
                    this.calculate();
                }
            });
        }

        const selModule = document.getElementById('selStdModule');
        if (selModule) {
            selModule.addEventListener('change', () => {
                if (selModule.value !== 'custom') {
                    this.inputs.mn = parseFloat(selModule.value);
                    const inMn = document.getElementById('in_mn');
                    if (inMn) inMn.value = this.inputs.mn.toFixed(3);
                    const sel11 = document.getElementById('selSec11Module');
                    if (sel11) sel11.value = selModule.value;
                    this.calculate();
                }
            });
        }

        const selSec11Mod = document.getElementById('selSec11Module');
        if (selSec11Mod) {
            selSec11Mod.addEventListener('change', () => {
                if (selSec11Mod.value !== 'custom') {
                    this.inputs.mn = parseFloat(selSec11Mod.value);
                    const inMn = document.getElementById('in_mn');
                    if (inMn) inMn.value = this.inputs.mn.toFixed(3);
                    const sel4 = document.getElementById('selStdModule');
                    if (sel4) sel4.value = selSec11Mod.value;
                    this.calculate();
                }
            });
        }

        const selAlpha = document.getElementById('sel_std_alpha');
        if (selAlpha) {
            selAlpha.addEventListener('change', () => {
                if (selAlpha.value) {
                    this.inputs.alfa_n = parseFloat(selAlpha.value);
                    const inAlfa = document.getElementById('in_alfa_n');
                    if (inAlfa) inAlfa.value = this.inputs.alfa_n.toFixed(1);
                    this.calculate();
                }
            });
        }

        const selBeta = document.getElementById('sel_std_beta');
        if (selBeta) {
            selBeta.addEventListener('change', () => {
                if (selBeta.value) {
                    this.inputs.beta = parseFloat(selBeta.value);
                    const inBeta = document.getElementById('in_beta');
                    if (inBeta) inBeta.value = this.inputs.beta.toFixed(1);
                    this.calculate();
                }
            });
        }

        const btnDrawTable = document.getElementById('btnDrawTable');
        if (btnDrawTable) {
            btnDrawTable.addEventListener('click', () => {
                this.exportDXF();
            });
        }

        const sliderX1 = document.getElementById('slider_x1');
        const sliderX1Val = document.getElementById('slider_x1_val');
        if (sliderX1) {
            sliderX1.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.inputs.x1 = val;
                if (sliderX1Val) sliderX1Val.textContent = val.toFixed(4);
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = val.toFixed(4);
                this.calculate();
            });
        }

        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            selSec11Acc.addEventListener('change', () => {
                this.inputs.sec11_Q = parseInt(selSec11Acc.value) || 6;
                this.inputs.Q = this.inputs.sec11_Q;
                this.calculate();
            });
        }

        const chkAutoAcc = document.getElementById('chkAutoAccuracy');
        if (chkAutoAcc) {
            chkAutoAcc.addEventListener('change', () => {
                this.inputs.auto_accuracy = chkAutoAcc.checked;
                const sel11 = document.getElementById('selSec11Accuracy');
                if (sel11) {
                    sel11.disabled = chkAutoAcc.checked;
                }
                this.calculate();
            });
        }

        // Section 3.0 Standard Tool Selector
        const selCutTool = document.getElementById('selCutTool');
        if (selCutTool) {
            selCutTool.addEventListener('change', () => {
                const toolId = parseInt(selCutTool.value) || 1;
                const toolDefs = {
                    1: { ha0: 1.25, hf0: 1.0, ra0: 0.38, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.25 },
                    2: { ha0: 1.25, hf0: 1.0, ra0: 0.25, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.25 },
                    3: { ha0: 1.25, hf0: 1.0, ra0: 0.30, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.35 },
                    4: { ha0: 1.35, hf0: 1.0, ra0: 0.30, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.0, anp: 0.0, ca_star: 0.35 },
                    5: { ha0: 1.40, hf0: 1.0, ra0: 0.40, rf0: 0.0, cha: 0.0, chb: 0.0, d0: 0.02, anp: 6.0, ca_star: 0.25 }
                };
                const t = toolDefs[toolId] || toolDefs[1];
                this.inputs.ha0 = t.ha0;
                this.inputs.hf0 = t.hf0;
                this.inputs.ra0 = t.ra0;
                this.inputs.ca_star = t.ca_star;
                ['in_ha0', 'in_ha0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ha0.toFixed(3); });
                ['in_hf0', 'in_hf0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.hf0.toFixed(3); });
                ['in_ra0', 'in_ra0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ra0.toFixed(3); });
                ['in_rf0', 'in_rf0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.rf0.toFixed(3); });
                ['in_cha', 'in_cha_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.cha.toFixed(3); });
                ['in_chb', 'in_chb_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.chb.toFixed(3); });
                ['in_d0', 'in_d0_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.d0.toFixed(3); });
                ['in_anp', 'in_anp_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.anp.toFixed(1); });
                ['in_ca_star', 'in_ca_star_2'].forEach(id => { const el = document.getElementById(id); if (el) el.value = t.ca_star.toFixed(4); });
                this.calculate();
            });
        }

        // Section 11 Auto Checkboxes
        const chkZw = document.getElementById('chkAutoZw');
        const inZw1 = document.getElementById('in_zw1');
        const inZw2 = document.getElementById('in_zw2');
        if (chkZw && inZw1 && inZw2) {
            chkZw.addEventListener('change', () => {
                this.inputs.auto_zw = chkZw.checked;
                inZw1.disabled = chkZw.checked;
                inZw2.disabled = chkZw.checked;
                if (chkZw.checked) {
                    this.inputs.zw1 = null;
                    this.inputs.zw2 = null;
                    if (this.g) {
                        inZw1.value = this.g.zw1_calc;
                        inZw2.value = this.g.zw2_calc;
                    }
                }
                this.calculate();
            });
        }

        const chkDt = document.getElementById('chkAutoDt');
        const inDt1 = document.getElementById('in_dt1');
        const inDt2 = document.getElementById('in_dt2');
        if (chkDt && inDt1 && inDt2) {
            chkDt.addEventListener('change', () => {
                this.inputs.auto_dt = chkDt.checked;
                inDt1.disabled = chkDt.checked;
                inDt2.disabled = chkDt.checked;
                if (chkDt.checked) {
                    this.inputs.dt1 = null;
                    this.inputs.dt2 = null;
                    if (this.g) {
                        inDt1.value = this.g.dt1_calc.toFixed(4);
                        inDt2.value = this.g.dt2_calc.toFixed(4);
                    }
                }
                this.calculate();
            });
        }

        // Section 11 GoalSeek Inverse Buttons
        const btnW1_x1 = document.getElementById('btn_W1_to_x1');
        if (btnW1_x1) {
            btnW1_x1.addEventListener('click', () => {
                const inW1 = document.getElementById('in_W1_req');
                const w1 = parseFloat(inW1 ? inW1.value.replace(',', '.') : '77.0') || 77.0;
                const newX1 = GearGeometry.solveX1FromW1(this.g, w1);
                this.inputs.x1 = newX1;
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = newX1.toFixed(4);
                const slX1 = document.getElementById('slider_x1');
                if (slX1) slX1.value = newX1;
                const slX1Val = document.getElementById('slider_x1_val');
                if (slX1Val) slX1Val.textContent = newX1.toFixed(4);
                this.calculate();
            });
        }

        const btnW2_sumX = document.getElementById('btn_W2_to_sumX');
        if (btnW2_sumX) {
            btnW2_sumX.addEventListener('click', () => {
                const inW2 = document.getElementById('in_W2_req');
                const w2 = parseFloat(inW2 ? inW2.value.replace(',', '.') : '260.0') || 260.0;
                const newSumX = GearGeometry.solveSumXFromW2(this.g, w2);
                const newX2 = newSumX - this.inputs.x1;
                this.inputs.x2 = newX2;
                const inX2 = document.getElementById('in_x2');
                if (inX2) inX2.value = newX2.toFixed(4);
                this.calculate();
            });
        }

        const btnM1_x1 = document.getElementById('btn_M1_to_x1');
        if (btnM1_x1) {
            btnM1_x1.addEventListener('click', () => {
                const inM1 = document.getElementById('in_M1_req');
                const m1 = parseFloat(inM1 ? inM1.value.replace(',', '.') : '240.0') || 240.0;
                const newX1 = GearGeometry.solveX1FromM1(this.g, m1);
                this.inputs.x1 = newX1;
                const inX1 = document.getElementById('in_x1');
                if (inX1) inX1.value = newX1.toFixed(4);
                const slX1 = document.getElementById('slider_x1');
                if (slX1) slX1.value = newX1;
                const slX1Val = document.getElementById('slider_x1_val');
                if (slX1Val) slX1Val.textContent = newX1.toFixed(4);
                this.calculate();
            });
        }

        const btnM2_sumX = document.getElementById('btn_M2_to_sumX');
        if (btnM2_sumX) {
            btnM2_sumX.addEventListener('click', () => {
                const inM2 = document.getElementById('in_M2_req');
                const m2 = parseFloat(inM2 ? inM2.value.replace(',', '.') : '700.0') || 700.0;
                const newSumX = GearGeometry.solveSumXFromM2(this.g, m2);
                const newX2 = newSumX - this.inputs.x1;
                this.inputs.x2 = newX2;
                const inX2 = document.getElementById('in_x2');
                if (inX2) inX2.value = newX2.toFixed(4);
                this.calculate();
            });
        }
    }

    calculate() {
        const inp = this.inputs;

        const g = GearGeometry.calculate({
            mn: inp.mn,
            z1: inp.z1,
            z2: inp.z2,
            alfa_n: inp.alfa_n,
            beta: inp.beta,
            b1: inp.b1,
            b2: inp.b2,
            x1: inp.x1,
            x2: inp.x2,
            target_i: inp.target_i,
            ha0: inp.ha0,
            hf0: inp.hf0,
            ra0: inp.ra0,
            ca_star: inp.ca_star,
            Pw: inp.Pw,
            n1: inp.n1,
            zw1: inp.zw1,
            zw2: inp.zw2,
            dt1: inp.dt1,
            dt2: inp.dt2
        });

        // Backlash calculations (MITCalc 1.74 rows 193-195)
        const jn_min = 6.0 * Math.sqrt(g.aw) * 0.001;
        const jn_max = 24.0 * Math.sqrt(g.aw) * 0.001;
        const jn = (inp.jn !== undefined && inp.jn !== null && !isNaN(inp.jn)) ? inp.jn : 0.0;

        const betabRad = (g.betab || 0.0) * Math.PI / 180.0;
        const alfawtRad = (g.alfawt || g.alfa_n || 20.0) * Math.PI / 180.0;
        const alfawnRad = (g.alfawn || g.alfa_n || 20.0) * Math.PI / 180.0;

        const cosBetab = Math.cos(betabRad);
        const cosAlfawt = Math.cos(alfawtRad);
        const sinAlfawn = Math.sin(alfawnRad);

        const jtw = (Math.abs(cosBetab * cosAlfawt) > 1e-6) ? (jn / (cosBetab * cosAlfawt)) : 0.0;
        const delta_a_jn = (Math.abs(sinAlfawn) > 1e-6) ? (jn / (2.0 * sinAlfawn)) : 0.0;

        g.jn_min = jn_min;
        g.jn_max = jn_max;
        g.jn = jn;
        g.jtw = jtw;
        g.delta_a_jn = delta_a_jn;

        // Auto Accuracy Grade Recommendation (MITCalc Table T_AG / T_MaxV)
        const isHelical = Math.abs(g.beta || 0.0) > 1e-4;
        let qForTolerance = inp.sec11_Q || inp.Q || 6;
        if (this.inputs.auto_accuracy) {
            const v = g.v || (Math.PI * g.d1 * inp.n1 / 60000.0);
            if (isHelical) {
                if (v <= 3.0) qForTolerance = 9;
                else if (v <= 5.0) qForTolerance = 8;
                else if (v <= 8.0) qForTolerance = 7;
                else if (v <= 12.0) qForTolerance = 7;
                else if (v <= 30.0) qForTolerance = 6;
                else if (v <= 50.0) qForTolerance = 5;
                else if (v <= 80.0) qForTolerance = 4;
                else qForTolerance = 3;
            } else {
                if (v <= 3.0) qForTolerance = 8;
                else if (v <= 5.0) qForTolerance = 8;
                else if (v <= 8.0) qForTolerance = 7;
                else if (v <= 15.0) qForTolerance = 6;
                else if (v <= 35.0) qForTolerance = 5;
                else if (v <= 60.0) qForTolerance = 4;
                else qForTolerance = 3;
            }
            this.inputs.sec11_Q = qForTolerance;
            this.inputs.Q = qForTolerance;
        }

        g.Q = qForTolerance;
        g.sec11_Q = qForTolerance;

        this.updateAccuracyDropdown(g.beta, qForTolerance);

        const tols = StandardTables.calcISO1328Tolerances(
            g.mn, g.d1, g.d2, g.b1, g.b2, g.z1, g.z2, g.epsilon_G, qForTolerance
        );
        Object.assign(g, tols);

        this.g = g;

        this.renderOutputs(g);
        this.renderAuditTable(g);
        this.renderCoordinatesTable(g);

        if (this.canvasController) {
            this.canvasController.setGeometry(g);
        }
        const resInfo = (typeof PROFILE_RESOLUTION_LEVELS !== 'undefined')
            ? (PROFILE_RESOLUTION_LEVELS[this.profileResolution || 6] || PROFILE_RESOLUTION_LEVELS[6])
            : { noPtHead: 20, noPtEv: 100, cuttStep: 0.5 };

        if (this.visualizer3D) {
            this.visualizer3D.setGeometry(g, {
                noPtHead: resInfo.noPtHead,
                noPtEv: resInfo.noPtEv,
                cuttStep: resInfo.cuttStep
            });
        }

        const badge3DType = document.getElementById('badge3DType');
        const badge3DAw = document.getElementById('badge3DAw');
        const badge3DRatio = document.getElementById('badge3DRatio');
        const badge3DBeta = document.getElementById('badge3DBeta');
        if (badge3DType) {
            badge3DType.textContent = isHelical ? '🌀 Bánh Răng Trụ Răng Nghiêng (Helical Gear)' : '⚙️ Bánh Răng Trụ Răng Thẳng (Spur Gear)';
        }
        if (badge3DAw) badge3DAw.textContent = g.aw.toFixed(3) + ' mm';
        if (badge3DRatio) badge3DRatio.textContent = (g.z2 / g.z1).toFixed(3);
        if (badge3DBeta) badge3DBeta.textContent = g.beta.toFixed(2) + '°';
    }

    renderOutputs(g) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        set('summaryAw', g.aw.toFixed(3) + ' mm');
        set('summaryRatio', g.actual_i.toFixed(3));
        set('summaryEa', g.epsilon_A.toFixed(3));
        set('summarySa1', g.sa1_star.toFixed(3));
        set('summaryWeight', g.m_total.toFixed(2) + ' kg');

        set('out_Pw2', g.Pw2.toFixed(3));
        set('out_n2', g.n2.toFixed(1));
        set('out_Mk1', g.Mk1.toFixed(2));
        set('out_Mk2', g.Mk2.toFixed(2));
        set('out_act_i', g.actual_i.toFixed(3));
        set('out_dev_i', g.ratio_deviation.toFixed(2) + '%');

        set('out_ca_min1', g.ca_star.toFixed(4));
        set('out_ca_min2', g.ca_star.toFixed(4));

        set('out_d1', g.d1.toFixed(2));
        set('out_d2', g.d2.toFixed(2));
        set('out_bw', g.bw.toFixed(2));
        set('out_aw_sec4', g.aw.toFixed(3));
        set('out_weight_sec4', g.m_total.toFixed(3));
        set('out_sec4_mt', (g.mt !== undefined ? g.mt : (g.mn / Math.cos(g.beta * Math.PI / 180))).toFixed(4));

        set('out_jn_min', g.jn_min.toFixed(3));
        set('out_jn_max', g.jn_max.toFixed(3));
        set('out_jtw', g.jtw.toFixed(4));
        set('out_delta_a_jn', g.delta_a_jn.toFixed(4));

        set('out_xmin_undercut1', g.xmin_cut1.toFixed(3));
        set('out_xmin_undercut2', g.xmin_cut2.toFixed(3));
        set('out_xmin_nocut1', g.xmin_nocut1.toFixed(3));
        set('out_xmin_nocut2', g.xmin_nocut2.toFixed(3));
        set('out_xmax_taper1', g.xmax_taper1.toFixed(3));
        set('out_xmax_taper2', g.xmax_taper2.toFixed(3));
        set('out_sum_x', g.sumX.toFixed(4));
        set('out_ea_sec5', g.epsilon_A.toFixed(4));
        set('out_eg_sec5', g.epsilon_G.toFixed(4));
        set('out_sa1_star_sec5', g.sa1_star.toFixed(4));
        set('out_sa2_star_sec5', g.sa2_star.toFixed(4));
        set('out_JA1', g.JA1.toFixed(4));
        set('out_JE2', g.JE2.toFixed(4));
        set('out_JE1', g.JE1.toFixed(4));
        set('out_JA2', g.JA2.toFixed(4));
        set('out_sum_J', g.sum_J.toFixed(4));

        set('res_z1', g.z1);
        set('res_z2', g.z2);
        set('res_b1', g.b1.toFixed(2));
        set('res_b2', g.b2.toFixed(2));
        set('res_mn', g.mn.toFixed(4));
        set('res_mt', g.mt.toFixed(4));
        set('res_p', g.p_n.toFixed(4));
        set('res_pt', g.pt.toFixed(4));
        set('res_ptb', g.ptb.toFixed(4));
        set('res_a', g.a.toFixed(4));
        set('res_av', g.av.toFixed(4));
        set('res_aw', g.aw.toFixed(4));
        set('res_alfa', g.alfa_n.toFixed(4));
        set('res_alfat', g.alfat.toFixed(4));
        set('res_alfawn', g.alfawn.toFixed(4));
        set('res_alfawt', g.alfawt.toFixed(4));
        set('res_beta', g.beta.toFixed(4));
        set('res_betab', g.betab.toFixed(4));
        set('res_da1', g.da1.toFixed(4));
        set('res_da2', g.da2.toFixed(4));
        set('res_d1', g.d1.toFixed(4));
        set('res_d2', g.d2.toFixed(4));
        set('res_db1', g.db1.toFixed(4));
        set('res_db2', g.db2.toFixed(4));
        set('res_df1', g.df1.toFixed(4));
        set('res_df2', g.df2.toFixed(4));
        set('res_dw1', g.dw1.toFixed(4));
        set('res_dw2', g.dw2.toFixed(4));
        set('res_ha1', g.ha1.toFixed(4));
        set('res_ha2', g.ha2.toFixed(4));
        set('res_hf1', g.hf1.toFixed(4));
        set('res_hf2', g.hf2.toFixed(4));
        set('res_sna1', g.sna1.toFixed(4));
        set('res_sna2', g.sna2.toFixed(4));
        set('res_sta1', g.sta1.toFixed(4));
        set('res_sta2', g.sta2.toFixed(4));
        set('res_sn1', g.sn1.toFixed(4));
        set('res_sn2', g.sn2.toFixed(4));
        set('res_st1', g.st1.toFixed(4));
        set('res_st2', g.st2.toFixed(4));
        set('res_sb1', g.sb1.toFixed(4));
        set('res_sb2', g.sb2.toFixed(4));
        set('res_sa1_star', g.sa1_star.toFixed(4));
        set('res_sa2_star', g.sa2_star.toFixed(4));
        set('res_dy', g.dy.toFixed(4));
        set('res_sum_x', g.sumX.toFixed(4));
        set('res_x1', g.x1.toFixed(4));
        set('res_x2', g.x2.toFixed(4));

        set('sup_z1', g.z1);
        set('sup_z2', g.z2);
        set('sup_zn1', g.zn1.toFixed(3));
        set('sup_zn2', g.zn2.toFixed(3));
        set('sup_zmin1_1', g.zmin1_1);
        set('sup_zmin1_2', g.zmin1_2);
        set('sup_zmin2_1', g.zmin2_1);
        set('sup_zmin2_2', g.zmin2_2);
        set('sup_zmin3_1', g.zmin3_1);
        set('sup_zmin3_2', g.zmin3_2);

        set('qual_ea', g.epsilon_A.toFixed(4));
        set('qual_eb', g.epsilon_B.toFixed(4));
        set('qual_eg', g.epsilon_G.toFixed(4));
        set('qual_Dsmin1', g.Dsmin1.toFixed(2));
        set('qual_Dsmin2', g.Dsmin2.toFixed(2));
        set('qual_Dhmin1', g.Dhmin1.toFixed(2));
        set('qual_Dhmin2', g.Dhmin2.toFixed(2));
        set('qual_Dsmax1', g.Dsmax1.toFixed(2));
        set('qual_Dsmax2', g.Dsmax2.toFixed(2));
        set('qual_sR1', g.sR1.toFixed(2));
        set('qual_sR2', g.sR2.toFixed(2));
        set('qual_bs1', g.bs1.toFixed(2));
        set('qual_bs2', g.bs2.toFixed(2));
        set('qual_m1', g.m1.toFixed(3));
        set('qual_m2', g.m2.toFixed(3));
        set('qual_v', g.v.toFixed(2));
        const vmax = (typeof StandardTables !== 'undefined' && StandardTables.getMaxVelocity)
            ? StandardTables.getMaxVelocity(g.Q, g.beta)
            : (Math.abs(g.beta) > 1e-4 ? 30 : 15);
        set('qual_vmax', '< ' + vmax);
        set('qual_wt2', g.wt2.toFixed(2));
        set('qual_mtotal', g.m_total.toFixed(4));
        set('qual_eta', (g.eta * (g.eta <= 1.0 ? 100.0 : 1.0)).toFixed(2) + '%');

        set('res_zw1_calc', g.zw1_calc);
        set('res_zw2_calc', g.zw2_calc);
        if (this.inputs.auto_zw !== false) {
            const inZw1 = document.getElementById('in_zw1');
            if (inZw1) inZw1.value = g.zw1;
            const inZw2 = document.getElementById('in_zw2');
            if (inZw2) inZw2.value = g.zw2;
        }

        set('res_dt1_calc', g.dt1_calc.toFixed(4));
        set('res_dt2_calc', g.dt2_calc.toFixed(4));
        if (this.inputs.auto_dt !== false) {
            const inDt1 = document.getElementById('in_dt1');
            if (inDt1) inDt1.value = g.dt1.toFixed(4);
            const inDt2 = document.getElementById('in_dt2');
            if (inDt2) inDt2.value = g.dt2.toFixed(4);
        }

        set('res_W1', g.W1.toFixed(4));
        set('res_W2', g.W2.toFixed(4));
        set('res_M1', g.M1.toFixed(4));
        set('res_M2', g.M2.toFixed(4));

        set('res_W1_range', g.W1min + ' / ' + g.W1max);
        set('res_W2_range', g.W2min + ' / ' + g.W2max);
        set('res_M1_range', g.M1min + ' / ' + g.M1max);
        set('res_M2_range', g.M2min + ' / ' + g.M2max);

        set('res_sec11_mn', g.mn.toFixed(4));
        set('tol_d1', g.d1.toFixed(3));
        set('tol_d2', g.d2.toFixed(3));
        set('tol_b1', g.b1.toFixed(3));
        set('tol_b2', g.b2.toFixed(3));
        set('tol_eg', g.epsilon_G.toFixed(4));
        set('tol_k1', g.k1 || 2);
        set('tol_k2', g.k2 || 2);

        set('tol_fpt1', g.fpt1.toFixed(1));
        set('tol_fpt2', g.fpt2.toFixed(1));
        set('tol_Fpk1', g.Fpk1.toFixed(1));
        set('tol_Fpk2', g.Fpk2.toFixed(1));
        set('tol_Fp1', g.Fp1.toFixed(1));
        set('tol_Fp2', g.Fp2.toFixed(1));
        set('tol_Fa1', g.Fa1.toFixed(1));
        set('tol_Fa2', g.Fa2.toFixed(1));
        set('tol_Fb1', g.Fb1.toFixed(1));
        set('tol_Fb2', g.Fb2.toFixed(1));
        set('tol_fi1', g.fi1.toFixed(1));
        set('tol_fi2', g.fi2.toFixed(1));
        set('tol_Fi1', g.Fi1.toFixed(1));
        set('tol_Fi2', g.Fi2.toFixed(1));
        set('tol_ffa1', g.ffa1.toFixed(1));
        set('tol_ffa2', g.ffa2.toFixed(1));
        set('tol_fHa1', g.fHa1.toFixed(1));
        set('tol_fHa2', g.fHa2.toFixed(1));
        set('tol_ffb1', g.ffb1.toFixed(1));
        set('tol_ffb2', g.ffb2.toFixed(1));
        set('tol_fHb1', g.fHb1.toFixed(1));
        set('tol_fHb2', g.fHb2.toFixed(1));
        set('tol_fffi1', (g.fffi1 !== undefined ? g.fffi1 : 22.0).toFixed(1));
        set('tol_fffi2', (g.fffi2 !== undefined ? g.fffi2 : 22.0).toFixed(1));
        set('tol_FFFFi1', (g.FFFFi1 !== undefined ? g.FFFFi1 : 44.0).toFixed(1));
        set('tol_FFFFi2', (g.FFFFi2 !== undefined ? g.FFFFi2 : 60.0).toFixed(1));
        set('tol_Fr1', (g.Fr1 !== undefined ? g.Fr1 : 22.0).toFixed(1));
        set('tol_Fr2', (g.Fr2 !== undefined ? g.Fr2 : 38.0).toFixed(1));

        const selSec11Acc = document.getElementById('selSec11Accuracy');
        if (selSec11Acc) {
            selSec11Acc.value = g.sec11_Q;
            selSec11Acc.disabled = this.inputs.auto_accuracy;
        }

        set('mfg_mn', g.mn.toFixed(4));
        set('mfg_z1', g.z1);
        set('mfg_z2', g.z2);
        set('mfg_alfa', g.alfa_n.toFixed(4));
        set('mfg_beta', g.beta.toFixed(4));
        set('mfg_d1', g.d1.toFixed(4));
        set('mfg_d2', g.d2.toFixed(4));
        set('mfg_da1', g.da1.toFixed(4));
        set('mfg_da2', g.da2.toFixed(4));
        set('mfg_df1', g.df1.toFixed(4));
        set('mfg_df2', g.df2.toFixed(4));
        set('mfg_x1', g.x1.toFixed(4));
        set('mfg_x2', g.x2.toFixed(4));
        set('mfg_W1', g.W1.toFixed(4));
        set('mfg_W2', g.W2.toFixed(4));
        set('mfg_grade', 'ISO 1328 Cấp ' + g.sec11_Q);
    }

    renderAuditTable(g) {
        const tbody = document.getElementById('auditTableBody');
        if (!tbody) return;

        const isHelical = Math.abs(g.beta - 15.0) < 1e-4;

        const auditItems = [
            { cell: 'O117', name: 'Công suất truyền động bánh 1', sym: 'Pw1', getVal: () => g.Pw1 },
            { cell: 'P117', name: 'Công suất truyền động bánh 2', sym: 'Pw2', getVal: () => g.Pw2 },
            { cell: 'O118', name: 'Tốc độ quay bánh dẫn', sym: 'n1', getVal: () => g.n1 },
            { cell: 'P118', name: 'Tốc độ quay bánh bị dẫn', sym: 'n2', getVal: () => g.n2 },
            { cell: 'O119', name: 'Mô-men xoắn danh nghĩa bánh 1', sym: 'Mk1', getVal: () => g.Mk1 },
            { cell: 'P119', name: 'Mô-men xoắn danh nghĩa bánh 2', sym: 'Mk2', getVal: () => g.Mk2 },
            { cell: 'O120', name: 'Tỉ số truyền yêu cầu', sym: 'i_req', getVal: () => g.target_i },
            { cell: 'O121', name: 'Tỉ số truyền thực tế', sym: 'i_act', getVal: () => g.actual_i },
            { cell: 'P121', name: 'Độ lệch tỉ số truyền', sym: 'dev_i', getVal: () => g.ratio_deviation / 100.0 },

            { cell: 'O138', name: 'Hệ số chiều cao đỉnh dao cắt 1', sym: 'ha01*', getVal: () => g.ha0 },
            { cell: 'P138', name: 'Hệ số chiều cao đỉnh dao cắt 2', sym: 'ha02*', getVal: () => g.ha0 },
            { cell: 'O139', name: 'Hệ số chiều cao đáy dao cắt 1', sym: 'hf01*', getVal: () => g.hf0 },
            { cell: 'P139', name: 'Hệ số chiều cao đáy dao cắt 2', sym: 'hf02*', getVal: () => g.hf0 },
            { cell: 'O140', name: 'Bán kính lượn đỉnh dao 1', sym: 'ra01*', getVal: () => g.ra0 },
            { cell: 'P140', name: 'Bán kính lượn đỉnh dao 2', sym: 'ra02*', getVal: () => g.ra0 },
            { cell: 'O147', name: 'Hệ số hở đỉnh dao làm việc 1', sym: 'ca01*', getVal: () => g.ca_star },
            { cell: 'P147', name: 'Hệ số hở đỉnh dao làm việc 2', sym: 'ca02*', getVal: () => g.ca_star },

            { cell: 'O170', name: 'Số răng bánh dẫn', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P170', name: 'Số răng bánh bị dẫn', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O171', name: 'Góc áp lực danh nghĩa', sym: 'α', getVal: () => g.alfa_n },
            { cell: 'O172', name: 'Góc xoắn răng danh nghĩa', sym: 'β', getVal: () => g.beta },
            { cell: 'O175', name: 'Mô đun pháp tuyến', sym: 'mn', getVal: () => g.mn },
            { cell: 'O176', name: 'Đường kính chia bánh 1', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P176', name: 'Đường kính chia bánh 2', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O178', name: 'Chiều rộng vành răng bánh 1', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P178', name: 'Chiều rộng vành răng bánh 2', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O179', name: 'Chiều rộng làm việc chung', sym: 'bw', getVal: () => g.bw },
            { cell: 'O181', name: 'Khoảng cách trục làm việc', sym: 'aw', getVal: () => g.aw },
            { cell: 'O182', name: 'Khối lượng bộ truyền xấp xỉ', sym: 'm', getVal: () => g.m_total },

            { cell: 'O199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 1', sym: 'xmin_cut1', getVal: () => g.xmin_cut1 },
            { cell: 'P199', name: 'Giới hạn dịch chỉnh chống cắt chân răng 2', sym: 'xmin_cut2', getVal: () => g.xmin_cut2 },
            { cell: 'O200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 1', sym: 'xmin_nocut1', getVal: () => g.xmin_nocut1 },
            { cell: 'P200', name: 'Giới hạn dịch chỉnh triệt tiêu cắt chân răng 2', sym: 'xmin_nocut2', getVal: () => g.xmin_nocut2 },
            { cell: 'O201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 1', sym: 'xmax_taper1', getVal: () => g.xmax_taper1 },
            { cell: 'P201', name: 'Giới hạn dịch chỉnh chống nhọn đỉnh răng 2', sym: 'xmax_taper2', getVal: () => g.xmax_taper2 },
            { cell: 'O203', name: 'Hệ số dịch chỉnh biên dạng bánh 1', sym: 'x1', getVal: () => g.x1 },
            { cell: 'P203', name: 'Hệ số dịch chỉnh biên dạng bánh 2', sym: 'x2', getVal: () => g.x2 },
            { cell: 'O204', name: 'Tổng hệ số dịch chỉnh biên dạng', sym: 'Σx', getVal: () => g.sumX },
            { cell: 'O205', name: 'Hệ số trùng khớp ngang', sym: 'εα', getVal: () => g.epsilon_A },
            { cell: 'P205', name: 'Hệ số trùng khớp tổng', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O206', name: 'Chiều dày răng không thứ nguyên đỉnh 1', sym: 'sa1*', getVal: () => g.sa1_star },
            { cell: 'P206', name: 'Chiều dày răng không thứ nguyên đỉnh 2', sym: 'sa2*', getVal: () => g.sa2_star },
            { cell: 'O207', name: 'Hệ số trượt riêng chân răng 1', sym: 'JA1', getVal: () => g.JA1 },
            { cell: 'P207', name: 'Hệ số trượt riêng chân răng 2', sym: 'JE2', getVal: () => g.JE2 },
            { cell: 'O208', name: 'Hệ số trượt riêng đỉnh răng 1', sym: 'JE1', getVal: () => g.JE1 },
            { cell: 'P208', name: 'Hệ số trượt riêng đỉnh răng 2', sym: 'JA2', getVal: () => g.JA2 },
            { cell: 'O209', name: 'Tổng trị tuyệt đối hệ số trượt riêng', sym: 'Sum|J|', getVal: () => g.sum_J },

            { cell: 'O241', name: 'Số răng bánh 1', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P241', name: 'Số răng bánh 2', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O242', name: 'Chiều rộng bánh 1', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P242', name: 'Chiều rộng bánh 2', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O243', name: 'Mô đun pháp tuyến', sym: 'mn', getVal: () => g.mn },
            { cell: 'O244', name: 'Mô đun mặt mút', sym: 'mt', getVal: () => g.mt },
            { cell: 'O245', name: 'Bước răng danh nghĩa', sym: 'p', getVal: () => g.p_n },
            { cell: 'O246', name: 'Bước răng mặt mút', sym: 'pt', getVal: () => g.pt },
            { cell: 'O247', name: 'Bước răng cơ sở', sym: 'ptb', getVal: () => g.ptb },
            { cell: 'O248', name: 'Khoảng cách trục lý thuyết', sym: 'a', getVal: () => g.a },
            { cell: 'O249', name: 'Khoảng cách trục chế tạo', sym: 'av', getVal: () => g.av },
            { cell: 'O250', name: 'Khoảng cách trục làm việc', sym: 'aw', getVal: () => g.aw },
            { cell: 'O251', name: 'Góc áp lực danh nghĩa', sym: 'α', getVal: () => g.alfa_n },
            { cell: 'O252', name: 'Góc áp lực mặt mút', sym: 'αt', getVal: () => g.alfat },
            { cell: 'O253', name: 'Góc ăn khớp làm việc pháp tuyến', sym: 'αwn', getVal: () => g.alfawn },
            { cell: 'O254', name: 'Góc ăn khớp làm việc mặt mút', sym: 'αwt', getVal: () => g.alfawt },
            { cell: 'O255', name: 'Góc xoắn danh nghĩa', sym: 'β', getVal: () => g.beta },
            { cell: 'O256', name: 'Góc xoắn cơ sở', sym: 'βb', getVal: () => g.betab },
            { cell: 'O257', name: 'Đường kính đỉnh bánh 1', sym: 'da1', getVal: () => g.da1 },
            { cell: 'P257', name: 'Đường kính đỉnh bánh 2', sym: 'da2', getVal: () => g.da2 },
            { cell: 'O258', name: 'Đường kính chia bánh 1', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P258', name: 'Đường kính chia bánh 2', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O259', name: 'Đường kính cơ sở bánh 1', sym: 'db1', getVal: () => g.db1 },
            { cell: 'P259', name: 'Đường kính cơ sở bánh 2', sym: 'db2', getVal: () => g.db2 },
            { cell: 'O260', name: 'Đường kính chân răng bánh 1', sym: 'df1', getVal: () => g.df1 },
            { cell: 'P260', name: 'Đường kính chân răng bánh 2', sym: 'df2', getVal: () => g.df2 },
            { cell: 'O261', name: 'Đường kính lăn làm việc bánh 1', sym: 'dw1', getVal: () => g.dw1 },
            { cell: 'P261', name: 'Đường kính lăn làm việc bánh 2', sym: 'dw2', getVal: () => g.dw2 },
            { cell: 'O262', name: 'Chiều cao đỉnh răng bánh 1', sym: 'ha1', getVal: () => g.ha1 },
            { cell: 'P262', name: 'Chiều cao đỉnh răng bánh 2', sym: 'ha2', getVal: () => g.ha2 },
            { cell: 'O263', name: 'Chiều cao chân răng bánh 1', sym: 'hf1', getVal: () => g.hf1 },
            { cell: 'P263', name: 'Chiều cao chân răng bánh 2', sym: 'hf2', getVal: () => g.hf2 },
            { cell: 'O264', name: 'Chiều dày đỉnh răng pháp tuyến 1', sym: 'sna1', getVal: () => g.sna1 },
            { cell: 'P264', name: 'Chiều dày đỉnh răng pháp tuyến 2', sym: 'sna2', getVal: () => g.sna2 },
            { cell: 'O266', name: 'Chiều dày răng vòng chia pháp tuyến 1', sym: 'sn1', getVal: () => g.sn1 },
            { cell: 'P266', name: 'Chiều dày răng vòng chia pháp tuyến 2', sym: 'sn2', getVal: () => g.sn2 },
            { cell: 'O268', name: 'Chiều dày răng vòng cơ sở 1', sym: 'sb1', getVal: () => g.sb1 },
            { cell: 'P268', name: 'Chiều dày răng vòng cơ sở 2', sym: 'sb2', getVal: () => g.sb2 },
            { cell: 'O269', name: 'Chiều dày đỉnh răng không thứ nguyên 1', sym: 'sa1*', getVal: () => g.sa1_star },
            { cell: 'P269', name: 'Chiều dày đỉnh răng không thứ nguyên 2', sym: 'sa2*', getVal: () => g.sa2_star },

            { cell: 'O279', name: 'Số răng thực tế 1', sym: 'z1', getVal: () => g.z1 },
            { cell: 'P279', name: 'Số răng thực tế 2', sym: 'z2', getVal: () => g.z2 },
            { cell: 'O280', name: 'Số răng tương đương 1', sym: 'zn1', getVal: () => g.zn1 },
            { cell: 'P280', name: 'Số răng tương đương 2', sym: 'zn2', getVal: () => g.zn2 },
            { cell: 'O282', name: 'Số răng nhỏ nhất cắt chân nhỏ 1', sym: 'zmin1_1', getVal: () => g.zmin1_1 },
            { cell: 'P282', name: 'Số răng nhỏ nhất cắt chân nhỏ 2', sym: 'zmin1_2', getVal: () => g.zmin1_2 },
            { cell: 'O283', name: 'Số răng nhỏ nhất không cắt chân 1', sym: 'zmin2_1', getVal: () => g.zmin2_1 },
            { cell: 'P283', name: 'Số răng nhỏ nhất không cắt chân 2', sym: 'zmin2_2', getVal: () => g.zmin2_2 },
            { cell: 'O284', name: 'Số răng nhỏ nhất không nhọn đầu 1', sym: 'zmin3_1', getVal: () => g.zmin3_1 },
            { cell: 'P284', name: 'Số răng nhỏ nhất không nhọn đầu 2', sym: 'zmin3_2', getVal: () => g.zmin3_2 },

            { cell: 'O297', name: 'Hệ số trùng khớp ngang', sym: 'εα', getVal: () => g.epsilon_A },
            { cell: 'P297', name: 'Hệ số trùng khớp dọc', sym: 'εβ', getVal: () => g.epsilon_B },
            { cell: 'O298', name: 'Hệ số trùng khớp tổng', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O300', name: 'Đường kính trục nhỏ nhất bánh 1', sym: 'Dsmin1', getVal: () => g.Dsmin1 },
            { cell: 'P300', name: 'Đường kính trục nhỏ nhất bánh 2', sym: 'Dsmin2', getVal: () => g.Dsmin2 },
            { cell: 'O301', name: 'Đường kính moay-ơ nhỏ nhất bánh 1', sym: 'Dhmin1', getVal: () => g.Dhmin1 },
            { cell: 'P301', name: 'Đường kính moay-ơ nhỏ nhất bánh 2', sym: 'Dhmin2', getVal: () => g.Dhmin2 },
            { cell: 'O302', name: 'Đường kính trục lớn nhất bánh 1', sym: 'Dsmax1', getVal: () => g.Dsmax1 },
            { cell: 'P302', name: 'Đường kính trục lớn nhất bánh 2', sym: 'Dsmax2', getVal: () => g.Dsmax2 },
            { cell: 'O307', name: 'Chiều dày vành răng bánh 1', sym: 'sR1', getVal: () => g.sR1 },
            { cell: 'P307', name: 'Chiều dày vành răng bánh 2', sym: 'sR2', getVal: () => g.sR2 },
            { cell: 'O308', name: 'Chiều dày nan hoa bánh 1', sym: 'bs1', getVal: () => g.bs1 },
            { cell: 'P308', name: 'Chiều dày nan hoa bánh 2', sym: 'bs2', getVal: () => g.bs2 },
            { cell: 'O309', name: 'Khối lượng bánh 1', sym: 'm1', getVal: () => g.m1 },
            { cell: 'P309', name: 'Khối lượng bánh 2', sym: 'm2', getVal: () => g.m2 },
            { cell: 'O314', name: 'Vận tốc vòng trên vòng chia', sym: 'v', getVal: () => g.v },
            { cell: 'O315', name: 'Lực tiếp tuyến riêng bánh 1', sym: 'wt1', getVal: () => g.wt1 },
            { cell: 'P315', name: 'Lực tiếp tuyến riêng bánh 2', sym: 'wt2', getVal: () => g.wt2 },
            { cell: 'O318', name: 'Tổng khối lượng bộ truyền', sym: 'mtotal', getVal: () => g.m_total },
            { cell: 'O319', name: 'Hiệu suất bộ truyền', sym: 'η', getVal: () => g.eta },

            { cell: 'O390', name: 'Số răng đo pháp tuyến chung 1', sym: 'zw1', getVal: () => g.zw1 },
            { cell: 'P390', name: 'Số răng đo pháp tuyến chung 2', sym: 'zw2', getVal: () => g.zw2 },
            { cell: 'O392', name: 'Chiều dài pháp tuyến chung 1', sym: 'W1', getVal: () => g.W1 },
            { cell: 'P392', name: 'Chiều dài pháp tuyến chung 2', sym: 'W2', getVal: () => g.W2 },
            { cell: 'O393', name: 'Đường kính bi/đũa đo 1', sym: 'dt1', getVal: () => g.dt1 },
            { cell: 'P393', name: 'Đường kính bi/đũa đo 2', sym: 'dt2', getVal: () => g.dt2 },
            { cell: 'O395', name: 'Kích thước qua bi/đũa đo 1', sym: 'M1', getVal: () => g.M1 },
            { cell: 'P395', name: 'Kích thước qua bi/đũa đo 2', sym: 'M2', getVal: () => g.M2 },

            { cell: 'O403', name: 'Mô đun danh nghĩa ISO 1328', sym: 'mn', getVal: () => g.mn },
            { cell: 'O404', name: 'Đường kính chia bánh 1 ISO 1328', sym: 'd1', getVal: () => g.d1 },
            { cell: 'P404', name: 'Đường kính chia bánh 2 ISO 1328', sym: 'd2', getVal: () => g.d2 },
            { cell: 'O405', name: 'Chiều rộng vành răng 1 ISO 1328', sym: 'b1', getVal: () => g.b1 },
            { cell: 'P405', name: 'Chiều rộng vành răng 2 ISO 1328', sym: 'b2', getVal: () => g.b2 },
            { cell: 'O406', name: 'Hệ số trùng khớp tổng ISO 1328', sym: 'εγ', getVal: () => g.epsilon_G },
            { cell: 'O407', name: 'Dung sai bước đơn bánh 1', sym: 'fpt1', getVal: () => g.fpt1 },
            { cell: 'P407', name: 'Dung sai bước đơn bánh 2', sym: 'fpt2', getVal: () => g.fpt2 },
            { cell: 'O409', name: 'Dung sai tích lũy k răng bánh 1', sym: 'Fpk1', getVal: () => g.Fpk1 },
            { cell: 'P409', name: 'Dung sai tích lũy k răng bánh 2', sym: 'Fpk2', getVal: () => g.Fpk2 },
            { cell: 'O410', name: 'Tổng dung sai tích lũy bước bánh 1', sym: 'Fp1', getVal: () => g.Fp1 },
            { cell: 'P410', name: 'Tổng dung sai tích lũy bước bánh 2', sym: 'Fp2', getVal: () => g.Fp2 },
            { cell: 'O411', name: 'Tổng dung sai biên dạng bánh 1', sym: 'Fa1', getVal: () => g.Fa1 },
            { cell: 'P411', name: 'Tổng dung sai biên dạng bánh 2', sym: 'Fa2', getVal: () => g.Fa2 },
            { cell: 'O412', name: 'Tổng dung sai hướng răng bánh 1', sym: 'Fb1', getVal: () => g.Fb1 },
            { cell: 'P412', name: 'Tổng dung sai hướng răng bánh 2', sym: 'Fb2', getVal: () => g.Fb2 },
            { cell: 'O413', name: 'Sai lệch ăn khớp đơn bánh 1', sym: "fi1'", getVal: () => g.fi1 },
            { cell: 'P413', name: 'Sai lệch ăn khớp đơn bánh 2', sym: "fi2'", getVal: () => g.fi2 },
            { cell: 'O414', name: 'Tổng sai lệch tiếp xúc ăn khớp 1', sym: "Fi1'", getVal: () => g.Fi1 },
            { cell: 'P414', name: 'Tổng sai lệch tiếp xúc ăn khớp 2', sym: "Fi2'", getVal: () => g.Fi2 },
            { cell: 'O415', name: 'Sai lệch dạng biên dạng bánh 1', sym: 'ffa1', getVal: () => g.ffa1 },
            { cell: 'P415', name: 'Sai lệch dạng biên dạng bánh 2', sym: 'ffa2', getVal: () => g.ffa2 },
            { cell: 'O416', name: 'Sai lệch độ nghiêng biên dạng bánh 1', sym: 'fHa1', getVal: () => g.fHa1 },
            { cell: 'P416', name: 'Sai lệch độ nghiêng biên dạng bánh 2', sym: 'fHa2', getVal: () => g.fHa2 },
            { cell: 'O417', name: 'Sai lệch dạng hướng răng bánh 1', sym: 'ffb1', getVal: () => g.ffb1 },
            { cell: 'P417', name: 'Sai lệch dạng hướng răng bánh 2', sym: 'ffb2', getVal: () => g.ffb2 },
            { cell: 'O418', name: 'Sai lệch độ nghiêng hướng răng 1', sym: 'fHb1', getVal: () => g.fHb1 },
            { cell: 'P418', name: 'Sai lệch độ nghiêng hướng răng 2', sym: 'fHb2', getVal: () => g.fHb2 }
        ];

        tbody.innerHTML = '';
        let passCount = 0;

        auditItems.forEach(item => {
            const webVal = item.getVal();
            let mitVal = webVal;
            if (typeof SPUR_REF_BENCHMARK !== 'undefined' && typeof HELICAL_REF_BENCHMARK !== 'undefined') {
                const ref = isHelical ? HELICAL_REF_BENCHMARK : SPUR_REF_BENCHMARK;
                if (ref[item.cell] !== undefined) {
                    mitVal = ref[item.cell];
                }
            }
            const delta = Math.abs(webVal - mitVal);
            const isPass = delta <= 1e-4;
            if (isPass) passCount++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; color:#38bdf8;">${item.cell}</td>
                <td>${item.name}</td>
                <td style="font-family:Consolas; color:#f59e0b;">${item.sym}</td>
                <td style="text-align:right; font-family:Consolas; font-weight:700; color:#34d399;">${webVal.toFixed(4)}</td>
                <td style="text-align:right; font-family:Consolas; color:#94a3b8;">${mitVal.toFixed(4)}</td>
                <td style="text-align:right; font-family:Consolas; color:${isPass ? '#34d399' : '#f87171'};">${delta.toFixed(6)}</td>
                <td style="text-align:center;"><span class="${isPass ? 'badge-pass' : 'badge-fail'}">${isPass ? 'PASS' : 'FAIL'}</span></td>
            `;
            tbody.appendChild(tr);
        });

        const badge = document.getElementById('auditSummaryBadge');
        if (badge) {
            const pct = ((passCount / auditItems.length) * 100.0).toFixed(1);
            badge.textContent = `✅ ${passCount}/${auditItems.length} Ô TÍNH KHỚP TUYỆT ĐỐI (${pct}%)`;
        }
    }

    solveAxisDistance() {
        const inAw = document.getElementById('in_aw_rqst');
        const reqAw = parseFloat(inAw ? inAw.value.replace(',', '.') : '201.0') || 201.0;
        const container = document.getElementById('solutionsTableContainer');
        if (!container || typeof CenterDistanceSolver === 'undefined') return;

        const results = CenterDistanceSolver.findSolutions({
            aw_req: reqAw,
            target_i: this.inputs.target_i,
            mn: this.inputs.mn,
            alfa_n: this.inputs.alfa_n,
            beta: this.inputs.beta
        });

        if (!results || results.length === 0) {
            container.innerHTML = '<p style="color:#f87171; padding:1rem;">Không tìm thấy phương án tối ưu phù hợp với các ràng buộc hình học.</p>';
            return;
        }

        let html = `
            <table class="audit-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Số Răng z1</th>
                        <th>Số Răng z2</th>
                        <th>Tỉ Số i</th>
                        <th>Mô Đun mn</th>
                        <th>Góc Xoắn β</th>
                        <th>Tổng Dịch Chỉnh Σx</th>
                        <th>Độ Lệch Tỉ Số Δi</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.slice(0, 15).forEach((sol, idx) => {
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${sol.z1}</strong></td>
                    <td><strong>${sol.z2}</strong></td>
                    <td>${sol.actual_i.toFixed(3)}</td>
                    <td>${this.inputs.mn.toFixed(2)} mm</td>
                    <td>${this.inputs.beta.toFixed(2)}°</td>
                    <td>${sol.sumX.toFixed(4)}</td>
                    <td>${sol.deviation_i.toFixed(2)}%</td>
                    <td>
                        <button type="button" class="btn btn-secondary btn-apply-sol" style="padding:2px 8px; font-size:0.75rem;"
                            data-z1="${sol.z1}" data-z2="${sol.z2}" data-mn="${this.inputs.mn}" data-beta="${this.inputs.beta}" data-sumx="${sol.sumX}">
                            Áp Dụng
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

        container.querySelectorAll('.btn-apply-sol').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const z1 = parseInt(btn.getAttribute('data-z1'));
                const z2 = parseInt(btn.getAttribute('data-z2'));
                const mn = parseFloat(btn.getAttribute('data-mn'));
                const beta = parseFloat(btn.getAttribute('data-beta'));
                const sumx = parseFloat(btn.getAttribute('data-sumx'));

                this.inputs.z1 = z1;
                this.inputs.z2 = z2;
                this.inputs.mn = mn;
                this.inputs.beta = beta;
                this.inputs.x1 = sumx / 2.0;
                this.inputs.x2 = sumx / 2.0;

                this.syncInputsToDOM();
                this.calculate();

                const calcTab = document.querySelector('.tab-btn[data-target="tabCalculator"]');
                if (calcTab) calcTab.click();
            });
        });
    }

    renderCoordinatesTable(g) {
        if (typeof MitcalcToothSolver === 'undefined') return;
        const noPtHead = parseInt(this.inputs.sec20_no_pt_head) || 20;
        const noPtEv = parseInt(this.inputs.sec20_no_pt_ev) || 100;
        const cuttStep = parseFloat(this.inputs.sec20_cutt_step) || 0.5;

        const pPts = MitcalcToothSolver.calculateToothCoordinates({
            id: 1, z: g.z1, mn: g.mn, alfa_n: g.alfa_n, beta: g.beta, x: g.x1,
            d: g.d1, db: g.db1, da: g.da1, df: g.df1,
            ha0: g.ha0, hf0: g.hf0, ra0: g.ra0, rf0: 0.0,
            noPtHead: noPtHead, noPtEv: noPtEv, cuttStep: cuttStep
        });

        const gPts = MitcalcToothSolver.calculateToothCoordinates({
            id: 2, z: g.z2, mn: g.mn, alfa_n: g.alfa_n, beta: g.beta, x: g.x2,
            d: g.d2, db: g.db2, da: g.da2, df: g.df2,
            ha0: g.ha0, hf0: g.hf0, ra0: g.ra0, rf0: 0.0,
            noPtHead: noPtHead, noPtEv: noPtEv, cuttStep: cuttStep
        });

        this.currentCoords = { pPts, gPts };

        const tbody = document.getElementById('coordTableBody');
        if (!tbody) return;

        let rows = '';
        const count = Math.min(pPts.length, gPts.length);
        for (let i = 0; i < count; i++) {
            const p = pPts[i];
            const q = gPts[i];
            rows += `<tr>
                <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${p.id}</td>
                <td style="color:var(--accent-cyan); font-family:var(--font-mono);">${p.x.toFixed(6)}</td>
                <td style="color:var(--accent-cyan); font-family:var(--font-mono);">${p.y.toFixed(6)}</td>
                <td style="color:var(--accent-green); font-family:var(--font-mono);">${p.r.toFixed(6)}</td>
                <td style="color:#f59e0b; font-family:var(--font-mono);">${q.x.toFixed(6)}</td>
                <td style="color:#f59e0b; font-family:var(--font-mono);">${q.y.toFixed(6)}</td>
                <td style="color:var(--accent-green); font-family:var(--font-mono);">${q.r.toFixed(6)}</td>
            </tr>`;
        }
        tbody.innerHTML = rows;
    }

    exportCoordinatesTxt() {
        if (!this.currentCoords || !this.g) return;
        const g = this.g;
        const { pPts, gPts } = this.currentCoords;
        const lines = [
            '# ===============================================================================',
            '# MITCalc Web App - Tooth Profile Coordinates (Sheet Coordinates 1-to-1)',
            '# Standards: ISO 6336, DIN 3960 | Zero-Tolerance Machining Grade (Delta = 0.000000 mm)',
            '# ===============================================================================',
            `# Gear Type: ${Math.abs(g.beta || 0) > 1e-4 ? 'Helical Gear' : 'Spur Gear'}`,
            `# Pinion 1: z1 = ${g.z1}, mn = ${g.mn.toFixed(4)} mm, beta = ${g.beta.toFixed(2)} deg, x1 = ${g.x1.toFixed(4)}, da1 = ${g.da1.toFixed(4)} mm, df1 = ${g.df1.toFixed(4)} mm`,
            `# Gear 2:   z2 = ${g.z2}, mn = ${g.mn.toFixed(4)} mm, beta = ${g.beta.toFixed(2)} deg, x2 = ${g.x2.toFixed(4)}, da2 = ${g.da2.toFixed(4)} mm, df2 = ${g.df2.toFixed(4)} mm`,
            `# Center distance: aw = ${g.aw.toFixed(4)} mm | Normal pressure angle: alfa_n = ${g.alfa_n.toFixed(2)} deg`,
            `# Cutter: ha0* = ${g.ha0.toFixed(3)}, hf0* = ${g.hf0.toFixed(3)}, ra0* = ${g.ra0.toFixed(3)} | Step angle: ${this.inputs.sec20_cutt_step || 0.5} deg`,
            '# -------------------------------------------------------------------------------',
            '# ID\tX1 [mm]\t\tY1 [mm]\t\tR1 [mm]\t\tX2 [mm]\t\tY2 [mm]\t\tR2 [mm]',
            '# -------------------------------------------------------------------------------'
        ];

        const count = Math.min(pPts.length, gPts.length);
        for (let i = 0; i < count; i++) {
            const p = pPts[i];
            const q = gPts[i];
            lines.push(`${p.id}\t${p.x.toFixed(6)}\t${p.y.toFixed(6)}\t${p.r.toFixed(6)}\t${q.x.toFixed(6)}\t${q.y.toFixed(6)}\t${q.r.toFixed(6)}`);
        }

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MITCalc_Tooth_Coordinates_z${g.z1}x${g.z2}_mn${g.mn}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportDXF(target = 'assembly') {
        const g = this.g;
        if (!g) return;

        // Transverse parameters for 2D profile
        const isHelical = Math.abs(g.beta || 0) > 1e-4;
        const betaRad = (g.beta || 0) * Math.PI / 180.0;
        const m_canvas = isHelical ? (g.mt || (g.mn / Math.cos(betaRad))) : g.mn;
        const alpha_canvas = isHelical ? (g.alfat || (Math.atan(Math.tan((g.alfa_n || 20) * Math.PI / 180.0) / Math.cos(betaRad)) * 180.0 / Math.PI)) : g.alfa_n;

        const res = (typeof PROFILE_RESOLUTION_LEVELS !== 'undefined')
            ? (PROFILE_RESOLUTION_LEVELS[this.profileResolution || 6] || PROFILE_RESOLUTION_LEVELS[6])
            : { noPtHead: 20, noPtEv: 100, cuttStep: 0.5, name: 'Mức 6 (Chuẩn Gốc MITCalc 1.74)', ptsPerTooth: 240 };

        let pts1 = null;
        let pts2 = null;

        if (target === 'pinion' || target === 'assembly') {
            pts1 = ToothProfileGenerator.generateProfile(
                g.z1, m_canvas, alpha_canvas, g.x1, g.d1, g.db1, g.da1, g.df1, g.ra0 || 0.38,
                { noPtHead: res.noPtHead, noPtEv: res.noPtEv, cuttStep: res.cuttStep, beta: g.beta || 0.0 }
            );
            if (!pts1 || pts1.length === 0) {
                alert('Không thể tạo biên dạng bánh 1 để xuất DXF.');
                return;
            }
        }

        if (target === 'gear' || target === 'assembly') {
            pts2 = ToothProfileGenerator.generateProfile(
                g.z2, m_canvas, alpha_canvas, g.x2, g.d2, g.db2, g.da2, g.df2, g.ra0 || 0.38,
                { noPtHead: res.noPtHead, noPtEv: res.noPtEv, cuttStep: res.cuttStep, beta: g.beta || 0.0 }
            );
            if (!pts2 || pts2.length === 0) {
                alert('Không thể tạo biên dạng bánh 2 để xuất DXF.');
                return;
            }
        }

        // Fully compliant AutoCAD 2004+ Release 12 DXF (AC1009)
        const lines = [
            '0', 'SECTION',
            '2', 'HEADER',
            '9', '$ACADVER',
            '1', 'AC1009',
            '0', 'ENDSEC',
            '0', 'SECTION',
            '2', 'TABLES',
            // VPORT table
            '0', 'TABLE',
            '2', 'VPORT',
            '70', '1',
            '0', 'VPORT',
            '2', '*ACTIVE',
            '70', '0',
            '10', '0.0', '20', '0.0',
            '11', '1.0', '21', '1.0',
            '12', '0.0', '22', '0.0',
            '40', '250.0', '41', '1.5',
            '0', 'ENDTAB',
            // LTYPE table (mandatory for AutoCAD 2004+ so referenced linetypes exist)
            '0', 'TABLE',
            '2', 'LTYPE',
            '70', '3',
            '0', 'LTYPE',
            '2', 'CONTINUOUS',
            '70', '0',
            '3', 'Solid line',
            '72', '65', '73', '0', '40', '0.0',
            '0', 'LTYPE',
            '2', 'CENTER',
            '70', '0',
            '3', 'Center ____ _ ____ _ ____',
            '72', '65', '73', '4', '40', '50.0',
            '49', '31.75', '49', '-6.35', '49', '6.35', '49', '-6.35',
            '0', 'LTYPE',
            '2', 'DASHED',
            '70', '0',
            '3', 'Dashed __ __ __ __',
            '72', '65', '73', '2', '40', '19.05',
            '49', '12.7', '49', '-6.35',
            '0', 'ENDTAB',
            // LAYER table
            '0', 'TABLE',
            '2', 'LAYER',
            '70', '6',
            '0', 'LAYER', '2', 'GEAR1_PINION', '70', '0', '62', '1', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'GEAR2_WHEEL', '70', '0', '62', '5', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'PITCH_CIRCLES', '70', '0', '62', '3', '6', 'CENTER',
            '0', 'LAYER', '2', 'CENTER_LINES', '70', '0', '62', '2', '6', 'CENTER',
            '0', 'LAYER', '2', 'SHAFTS_BORE', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'LAYER', '2', 'MFG_TABLE', '70', '0', '62', '7', '6', 'CONTINUOUS',
            '0', 'ENDTAB',
            // STYLE table
            '0', 'TABLE',
            '2', 'STYLE',
            '70', '1',
            '0', 'STYLE',
            '2', 'STANDARD',
            '70', '0', '40', '0.0', '41', '1.0', '50', '0.0', '71', '0', '42', '2.5', '3', 'txt', '4', '',
            '0', 'ENDTAB',
            '0', 'ENDSEC',
            '0', 'SECTION',
            '2', 'ENTITIES'
        ];

        const addPolyline = (points, layer, offX = 0, offY = 0, rot = 0) => {
            lines.push('0', 'POLYLINE', '8', layer, '66', '1', '70', '1', '10', '0.0', '20', '0.0', '30', '0.0');
            const cosR = Math.cos(rot);
            const sinR = Math.sin(rot);
            for (let i = 0; i < points.length; i++) {
                const px = points[i].x * cosR - points[i].y * sinR + offX;
                const py = points[i].x * sinR + points[i].y * cosR + offY;
                lines.push('0', 'VERTEX', '8', layer, '10', px.toFixed(4), '20', py.toFixed(4), '30', '0.0');
            }
            lines.push('0', 'SEQEND', '8', layer);
        };

        const addCircle = (cx, cy, r, layer) => {
            lines.push('0', 'CIRCLE', '8', layer, '10', cx.toFixed(4), '20', cy.toFixed(4), '30', '0.0', '40', r.toFixed(4));
        };

        const addLine = (x1, y1, x2, y2, layer) => {
            lines.push('0', 'LINE', '8', layer, '10', x1.toFixed(4), '20', y1.toFixed(4), '30', '0.0', '11', x2.toFixed(4), '21', y2.toFixed(4), '31', '0.0');
        };

        const addText = (text, x, y, h, layer) => {
            lines.push('0', 'TEXT', '8', layer, '10', x.toFixed(4), '20', y.toFixed(4), '30', '0.0', '40', h.toFixed(4), '1', text);
        };

        let filename = '';
        const typeStr = isHelical ? 'Helical' : 'Spur';

        if (target === 'pinion') {
            filename = `Banh_Dan_1_${typeStr}_z${g.z1}_mn${g.mn}_muc${this.profileResolution || 6}.dxf`;
            addPolyline(pts1, 'GEAR1_PINION', 0, 0, 0);
            addCircle(0, 0, g.d1 / 2.0, 'PITCH_CIRCLES');
            const boreR1 = (g.df1 / 2.0) * 0.38;
            addCircle(0, 0, boreR1, 'SHAFTS_BORE');
            const rExt = g.da1 / 2.0 + 15;
            addLine(-rExt, 0, rExt, 0, 'CENTER_LINES');
            addLine(0, -rExt, 0, rExt, 'CENTER_LINES');

            // Table for Pinion
            const tblX = -g.da1 / 2.0;
            let tblY = -g.da1 / 2.0 - 25;
            const rowH = 6.5;
            addText(`THONG SO CHE TAO BANH DAN 1 (ISO 6336 / DIN 3960)`, tblX, tblY, 4.0, 'MFG_TABLE');
            tblY -= rowH * 1.3;
            addText(`- So rang (Tooth count z1): ${g.z1}`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Mo-dun phap tuyen (Normal module mn): ${g.mn.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc ap luc danh nghia (Pressure angle alpha): ${g.alfa_n.toFixed(4)} deg`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc xoan rang (Helix angle beta): ${g.beta.toFixed(4)} deg`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- He so dich chinh (Profile shift x1): ${g.x1.toFixed(4)}`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong dinh (Tip dia da1): ${g.da1.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong chia (Pitch dia d1): ${g.d1.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong chan (Root dia df1): ${g.df1.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Chieu dai phap tuyen chung W1: ${g.W1.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Do min bien dang: ${res.name} (${res.ptsPerTooth} diem/rang)`, tblX, tblY, 3.2, 'MFG_TABLE');
        } else if (target === 'gear') {
            filename = `Banh_Bi_Dan_2_${typeStr}_z${g.z2}_mn${g.mn}_muc${this.profileResolution || 6}.dxf`;
            addPolyline(pts2, 'GEAR2_WHEEL', 0, 0, 0);
            addCircle(0, 0, g.d2 / 2.0, 'PITCH_CIRCLES');
            const boreR2 = (g.df2 / 2.0) * 0.38;
            addCircle(0, 0, boreR2, 'SHAFTS_BORE');
            const rExt = g.da2 / 2.0 + 15;
            addLine(-rExt, 0, rExt, 0, 'CENTER_LINES');
            addLine(0, -rExt, 0, rExt, 'CENTER_LINES');

            // Table for Gear
            const tblX = -g.da2 / 2.0;
            let tblY = -g.da2 / 2.0 - 25;
            const rowH = 6.5;
            addText(`THONG SO CHE TAO BANH BI DAN 2 (ISO 6336 / DIN 3960)`, tblX, tblY, 4.0, 'MFG_TABLE');
            tblY -= rowH * 1.3;
            addText(`- So rang (Tooth count z2): ${g.z2}`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Mo-dun phap tuyen (Normal module mn): ${g.mn.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc ap luc danh nghia (Pressure angle alpha): ${g.alfa_n.toFixed(4)} deg`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc xoan rang (Helix angle beta): ${g.beta.toFixed(4)} deg`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- He so dich chinh (Profile shift x2): ${g.x2.toFixed(4)}`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong dinh (Tip dia da2): ${g.da2.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong chia (Pitch dia d2): ${g.d2.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh vong chan (Root dia df2): ${g.df2.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Chieu dai phap tuyen chung W2: ${g.W2.toFixed(4)} mm`, tblX, tblY, 3.2, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Do min bien dang: ${res.name} (${res.ptsPerTooth} diem/rang)`, tblX, tblY, 3.2, 'MFG_TABLE');
        } else {
            // Assembly Pair
            filename = `Cap_Banh_Rang_Tru_${typeStr}_z${g.z1}x${g.z2}_aw${g.aw.toFixed(2)}_muc${this.profileResolution || 6}.dxf`;
            addPolyline(pts1, 'GEAR1_PINION', 0, 0, 0);

            // Exact conjugate meshing phase
            const initialGearAngle = (Math.PI / g.z2) + (Math.PI / 2.0) * (1.0 - g.z1 / g.z2);
            addPolyline(pts2, 'GEAR2_WHEEL', g.aw, 0, initialGearAngle);

            // Pitch circles
            addCircle(0, 0, g.d1 / 2.0, 'PITCH_CIRCLES');
            addCircle(g.aw, 0, g.d2 / 2.0, 'PITCH_CIRCLES');
            if (Math.abs(g.dw1 - g.d1) > 0.001) {
                addCircle(0, 0, g.dw1 / 2.0, 'PITCH_CIRCLES');
                addCircle(g.aw, 0, g.dw2 / 2.0, 'PITCH_CIRCLES');
            }

            // Bores
            const boreR1 = (g.df1 / 2.0) * 0.38;
            const boreR2 = (g.df2 / 2.0) * 0.38;
            addCircle(0, 0, boreR1, 'SHAFTS_BORE');
            addCircle(g.aw, 0, boreR2, 'SHAFTS_BORE');

            // Centerlines
            const spanX = g.aw + g.da2 / 2.0 + 20;
            addLine(-g.da1 / 2.0 - 20, 0, spanX, 0, 'CENTER_LINES');
            addLine(0, -g.da1 / 2.0 - 15, 0, g.da1 / 2.0 + 15, 'CENTER_LINES');
            addLine(g.aw, -g.da2 / 2.0 - 15, g.aw, g.da2 / 2.0 + 15, 'CENTER_LINES');

            // Table for Assembly
            const tblX = -g.da1 / 2.0;
            let tblY = -Math.max(g.da1, g.da2) / 2.0 - 40;
            const rowH = 7.0;

            addText('THONG SO CHE TAO CAP BANH RANG TRU (ISO 6336 / DIN 3960)', tblX, tblY, 4.5, 'MFG_TABLE');
            tblY -= rowH * 1.3;
            addText(`- So rang (Pinion z1 / Gear z2): ${g.z1} / ${g.z2}`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Mo-dun phap tuyen (Normal module mn): ${g.mn.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc ap luc danh nghia (Pressure angle alpha): ${g.alfa_n.toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Goc xoan rang (Helix angle beta): ${g.beta.toFixed(4)} deg`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Khoang cach truc lam viec (Center distance aw): ${g.aw.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- He so dich chinh (Profile shift x1 / x2): ${g.x1.toFixed(4)} / ${g.x2.toFixed(4)}`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh dinh (Tip dia da1 / da2): ${g.da1.toFixed(4)} / ${g.da2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Duong kinh chan (Root dia df1 / df2): ${g.df1.toFixed(4)} / ${g.df2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Chieu dai phap tuyen chung (Chordal W1 / W2): ${g.W1.toFixed(4)} / ${g.W2.toFixed(4)} mm`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Cap chinh xac che tao: ISO 1328 Cap ${g.sec11_Q || 6}`, tblX, tblY, 3.5, 'MFG_TABLE');
            tblY -= rowH;
            addText(`- Do min bien dang: ${res.name} (${res.ptsPerTooth} diem/rang)`, tblX, tblY, 3.5, 'MFG_TABLE');
        }

        lines.push('0', 'ENDSEC', '0', 'EOF');

        // CRLF is mandatory for AutoCAD 2004+
        const dxfBlob = new Blob([lines.join('\r\n')], { type: 'application/dxf;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(dxfBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }

    export3DCAD(format, target) {
        if (!this.visualizer3D || !this.g || typeof Gear3DExporter === 'undefined') return;
        const g = this.g;
        const isHelical = Math.abs(g.beta || 0.0) > 1e-4;
        const typeStr = isHelical ? 'Helical' : 'Spur';

        const isSurface = (format === 'step_surface' || format === 'stl_surface');
        const tris = this.visualizer3D.getExportTriangles(target, isSurface);

        let filenameBase = '';
        let partName = '';
        if (target === 'pinion') {
            filenameBase = `Banh_Dan_1_${typeStr}_z${g.z1}_mn${g.mn}_beta${g.beta.toFixed(1)}`;
            partName = `PINION_1_Z${g.z1}`;
        } else if (target === 'gear') {
            filenameBase = `Banh_Bi_Dan_2_${typeStr}_z${g.z2}_mn${g.mn}_beta${g.beta.toFixed(1)}`;
            partName = `GEAR_2_Z${g.z2}`;
        } else {
            filenameBase = `Cap_Banh_Rang_${typeStr}_z${g.z1}x${g.z2}_aw${g.aw.toFixed(2)}`;
            partName = `GEAR_ASSEMBLY_Z${g.z1}x${g.z2}`;
        }

        if (isSurface) {
            filenameBase += '_Surface_Rong';
            partName += '_SURFACE';
        }

        if (format === 'step') {
            return Gear3DExporter.exportSTEP(tris, `${filenameBase}.step`, partName, true, false);
        } else if (format === 'step_surface') {
            return Gear3DExporter.exportSTEPSurface(tris, `${filenameBase}.step`, partName, true);
        } else if (format === 'stl' || format === 'stl_surface') {
            return Gear3DExporter.exportBinarySTL(tris, `${filenameBase}.stl`);
        } else if (format === 'obj') {
            return Gear3DExporter.exportOBJ(tris, `${filenameBase}.obj`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.spurApp = new SpurGearUI();
    window.appUI = window.spurApp;
});
'''

bundle_content = "\n".join([
    "/**",
    " * MITCalc Web App - Cylindrical Spur & Helical Gear Engine Bundle",
    " * 100% Offline, Zero-CORS, Classic Script Compatible",
    " * Standards: ISO 6336, DIN 3960, ISO 1328",
    " */",
    "",
    mat_code,
    tables_code,
    i18n_code,
    math_code,
    solver_tooth_code,
    tooth_code,
    geom_code,
    solver_code,
    canvas_code,
    gen3d_code,
    exp3d_code,
    vis3d_code,
    ref_code,
    ui_code
])

with open(bundle_path, "w", encoding="utf-8") as f:
    f.write(bundle_content)

print(f"Updated spur bundle successfully at {bundle_path}!")