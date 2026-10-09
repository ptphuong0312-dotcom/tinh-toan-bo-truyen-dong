/**
 * MITCalc Web App - Involute Splines UI Controller
 * Binds UI inputs, calculation engine, canvas rendering, and DXF exporter.
 */

import { SplinesData } from './splines-data.js';
import { SplinesCalc } from './splines-calc.js';
import { SplinesCanvas } from './splines-canvas.js';
import { SplinesDxf } from './splines-dxf.js';

export class SplinesUI {
    constructor() {
        this.calc = SplinesCalc;
        this.canvas = new SplinesCanvas('splinesCanvas');
        this.currentGeom = null;

        this.initDOM();
        this.populateStandardDropdowns();
        this.bindEvents();
        this.recalculate();
    }

    initDOM() {
        // Cache frequently accessed elements
        this.elStdType = document.getElementById('stdTypeSelect');
        this.elUnits = document.getElementById('unitsSelect');
        this.elModule = document.getElementById('moduleInput');
        this.elModuleSelect = document.getElementById('moduleSelect');
        this.elDP = document.getElementById('dpInput');
        this.elDPSelect = document.getElementById('dpSelect');
        this.elZ = document.getElementById('zInput');
        this.elAlfa = document.getElementById('alfaSelect');
        this.elAlfaInput = document.getElementById('alfaInput');
        this.elX0 = document.getElementById('x0Input');
        this.elX2 = document.getElementById('x2Input');
        this.elAutoFill = document.getElementById('autoFillCheck');

        // Section 2.0 tooth profile elements
        this.elProfileStd = document.getElementById('profileStdCheck');
        this.elHa0 = document.getElementById('ha0Input');
        this.elHa2 = document.getElementById('ha2Input');
        this.elHf0 = document.getElementById('hf0Input');
        this.elHf2 = document.getElementById('hf2Input');
        this.elRa0 = document.getElementById('ra0Input');
        this.elRa2 = document.getElementById('ra2Input');
        this.elRf0 = document.getElementById('rf0Input');
        this.elRf2 = document.getElementById('rf2Input');

        // Diameters inputs
        this.elDa0 = document.getElementById('da0Input');
        this.elDf0 = document.getElementById('df0Input');
        this.elDi2 = document.getElementById('di2Input');
        this.elDri2 = document.getElementById('dri2Input');

        // Inspection inputs
        this.elDt0 = document.getElementById('dt0Input');
        this.elDt2 = document.getElementById('dt2Input');
        this.elK0 = document.getElementById('k0Input');
        this.elK0Auto = document.getElementById('k0AutoCheck');
        this.elK2 = document.getElementById('k2Input');
        this.elK2Auto = document.getElementById('k2AutoCheck');

        // Section 5.0 reverse inputs
        this.elZRevShaft = document.getElementById('zRevShaftInput');
        this.elDaRevShaft = document.getElementById('daRevShaftInput');
        this.elURevShaft = document.getElementById('uRevShaftInput');

        this.elZRevHub = document.getElementById('zRevHubInput');
        this.elDaRevHub = document.getElementById('daRevHubInput');
        this.elURevHub = document.getElementById('uRevHubInput');

        // Sync X0 and X2 checkbox
        this.elSyncX0X2 = document.getElementById('syncX0X2Check');

        // Navigation module dropdown
        this.btnModuleMenuToggle = document.getElementById('btnModuleMenuToggle');
        this.moduleDropdownMenu = document.getElementById('moduleDropdownMenu');

        // Toast element
        this.elToast = document.getElementById('toastMsg');
    }

    populateStandardDropdowns() {
        // 1. Populate Standard Spline Types
        if (this.elStdType) {
            this.elStdType.innerHTML = '';
            SplinesData.std_types.forEach(st => {
                const opt = document.createElement('option');
                opt.value = st.id;
                opt.textContent = st.name;
                this.elStdType.appendChild(opt);
            });
            // Default: DIN 5480 - 30° (ID: 14) - Kiểu thông dụng nhất
            this.elStdType.value = '14';
            const std = SplinesData.std_types.find(st => st.id === 14);
            if (std) {
                if (this.elAlfaInput) this.elAlfaInput.value = (std.angle || 30.0).toFixed(2);
                if (this.elAlfa) this.elAlfa.value = '30';
                if (this.elHa0) this.elHa0.value = (std.ha0 || 0.45).toFixed(4);
                if (this.elHa2) this.elHa2.value = (std.ha2 || 0.45).toFixed(4);
                if (this.elHf0) this.elHf0.value = (std.hf0 || 0.65).toFixed(4);
                if (this.elHf2) this.elHf2.value = (std.hf2 || 0.65).toFixed(4);
                if (this.elRa0) this.elRa0.value = (std.ra0 || 0.00).toFixed(4);
                if (this.elRa2) this.elRa2.value = (std.ra2 || 0.16).toFixed(4);
                if (this.elRf0) this.elRf0.value = (std.rf0 || 0.00).toFixed(4);
                if (this.elRf2) this.elRf2.value = (std.rf2 || 0.00).toFixed(4);
            }
        }

        // 2. Populate Standard Metric Modules
        if (this.elModuleSelect) {
            this.elModuleSelect.innerHTML = '';
            SplinesData.modules.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = `${m} mm`;
                this.elModuleSelect.appendChild(opt);
            });
            this.elModuleSelect.value = '10';
        }

        // 3. Populate Standard Diametral Pitches
        if (this.elDPSelect) {
            this.elDPSelect.innerHTML = '';
            SplinesData.dp_series.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.P;
                opt.textContent = `P = ${item.desc}`;
                this.elDPSelect.appendChild(opt);
            });
            this.elDPSelect.value = '2.5';
        }

        // 4. Populate Standard Presets List (Quick lookup by standard table)
        this.populateStandardPresets();
    }

    populateStandardPresets() {
        const presetSelect = document.getElementById('standardPresetSelect');
        if (!presetSelect) return;

        presetSelect.innerHTML = '<option value="">-- Chọn Quy Cách Tiêu Chuẩn Nhanh --</option>';

        // DIN 5480 items group
        const grpDIN = document.createElement('optgroup');
        grpDIN.label = 'DIN 5480 (Mẫu tiêu chuẩn)';
        // Take a representative sample of popular sizes
        const dinSamples = SplinesData.din5480.filter((_, idx) => idx % 15 === 0);
        dinSamples.forEach(e => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify({ type: 14, m: e.m, z: e.z, d_ref: e.d_ref });
            opt.textContent = `DIN 5480 - ${e.name} (m=${e.m}, z=${e.z})`;
            grpDIN.appendChild(opt);
        });
        presetSelect.appendChild(grpDIN);

        // ISO 4156 items group
        const grpISO = document.createElement('optgroup');
        grpISO.label = 'ISO 4156 30° (Mẫu tiêu chuẩn)';
        const isoSamples = SplinesData.iso4156_30.filter((_, idx) => idx % 35 === 0);
        isoSamples.forEach(e => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify({ type: 6, m: e.m, z: e.z, angle: 30 });
            opt.textContent = `ISO 4156 - ${e.name} (m=${e.m}, z=${e.z})`;
            grpISO.appendChild(opt);
        });
        presetSelect.appendChild(grpISO);
    }

    bindEvents() {
        // Track manual edits for pin diameter
        this.elDt0?.addEventListener('input', () => {
            this.elDt0.dataset.userEdited = 'true';
        });
        this.elDt2?.addEventListener('input', () => {
            this.elDt2.dataset.userEdited = 'true';
        });

        // Clear manual edit flags when standard type or module changes so pin is recalculated
        const resetPinFlag = () => {
            delete this.elDt0?.dataset.userEdited;
            delete this.elDt2?.dataset.userEdited;
        };

        // Khi người dùng thay đổi Tiêu chuẩn Mục 1.2: Tự động đổi Mục 1.3 và Mục 2.0
        this.elStdType?.addEventListener('change', () => {
            const stdId = parseInt(this.elStdType.value);
            const std = SplinesData.std_types.find(st => st.id === stdId);
            if (std) {
                // 1. Đồng bộ góc ăn khớp sang Mục 1.3
                const ang = std.angle || 30.0;
                if (this.elAlfaInput) this.elAlfaInput.value = ang.toFixed(2);
                if (this.elAlfa) {
                    const opt = Array.from(this.elAlfa.options).find(o => Math.abs(parseFloat(o.value) - ang) < 1e-3);
                    this.elAlfa.value = opt ? opt.value : 'custom';
                }

                // 2. Đồng bộ thông số biên dạng răng Mục 2.0
                if (this.elHa0) this.elHa0.value = (std.ha0 || 0.50).toFixed(4);
                if (this.elHa2) this.elHa2.value = (std.ha2 || 0.50).toFixed(4);
                if (this.elHf0) this.elHf0.value = (std.hf0 || 0.75).toFixed(4);
                if (this.elHf2) this.elHf2.value = (std.hf2 || 0.75).toFixed(4);
                if (this.elRa0) this.elRa0.value = (std.ra0 || 0.00).toFixed(4);
                if (this.elRa2) this.elRa2.value = (std.ra2 || 0.20).toFixed(4);
                if (this.elRf0) this.elRf0.value = (std.rf0 || 0.00).toFixed(4);
                if (this.elRf2) this.elRf2.value = (std.rf2 || 0.00).toFixed(4);
            }
            resetPinFlag();
            this.recalculate();
        });

        // Đồng bộ hai chiều Góc ăn khớp Mục 1.3
        if (this.elAlfa) {
            this.elAlfa.addEventListener('change', () => {
                if (this.elAlfa.value === 'custom') {
                    this.elAlfaInput?.focus();
                    this.elAlfaInput?.select();
                } else {
                    const ang = parseFloat(this.elAlfa.value);
                    if (!isNaN(ang) && this.elAlfaInput) {
                        this.elAlfaInput.value = ang.toFixed(2);
                    }
                    resetPinFlag();
                    this.recalculate();
                }
            });
        }
        if (this.elAlfaInput) {
            const onAlfaInputChange = () => {
                const ang = parseFloat(this.elAlfaInput.value);
                if (!isNaN(ang) && ang > 0) {
                    if (this.elAlfa) {
                        const opt = Array.from(this.elAlfa.options).find(o => Math.abs(parseFloat(o.value) - ang) < 1e-3);
                        this.elAlfa.value = opt ? opt.value : 'custom';
                    }
                    resetPinFlag();
                    this.recalculate();
                }
            };
            this.elAlfaInput.addEventListener('input', onAlfaInputChange);
            this.elAlfaInput.addEventListener('change', onAlfaInputChange);
        }

        // Quản lý Checkbox Tiêu chuẩn Mục 2.0 (Khóa / Mở khóa chỉnh sửa)
        if (this.elProfileStd) {
            this.elProfileStd.addEventListener('change', () => {
                const isStd = this.elProfileStd.checked;
                const pInputs = [
                    this.elHa0, this.elHa2, this.elHf0, this.elHf2,
                    this.elRa0, this.elRa2, this.elRf0, this.elRf2
                ];
                pInputs.forEach(inp => {
                    if (inp) inp.disabled = isStd;
                });
                if (isStd) {
                    const stdId = parseInt(this.elStdType?.value || 6);
                    const std = SplinesData.std_types.find(st => st.id === stdId);
                    if (std) {
                        if (this.elHa0) this.elHa0.value = (std.ha0 || 0.50).toFixed(4);
                        if (this.elHa2) this.elHa2.value = (std.ha2 || 0.50).toFixed(4);
                        if (this.elHf0) this.elHf0.value = (std.hf0 || 0.75).toFixed(4);
                        if (this.elHf2) this.elHf2.value = (std.hf2 || 0.75).toFixed(4);
                        if (this.elRa0) this.elRa0.value = (std.ra0 || 0.00).toFixed(4);
                        if (this.elRa2) this.elRa2.value = (std.ra2 || 0.20).toFixed(4);
                        if (this.elRf0) this.elRf0.value = (std.rf0 || 0.00).toFixed(4);
                        if (this.elRf2) this.elRf2.value = (std.rf2 || 0.00).toFixed(4);
                    }
                }
                this.recalculate();
            });
        }

        // Xử lý menu dropdown luân chuyển module bên cạnh nút "Trang Chủ"
        if (this.btnModuleMenuToggle && this.moduleDropdownMenu) {
            this.btnModuleMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.moduleDropdownMenu.classList.toggle('show');
            });
            document.addEventListener('click', (e) => {
                if (!this.moduleDropdownMenu.contains(e.target) && e.target !== this.btnModuleMenuToggle) {
                    this.moduleDropdownMenu.classList.remove('show');
                }
            });
        }

        // Quản lý Checkbox Liên hợp hệ số dịch chỉnh x2 = -x0 (Mục 1.10)
        if (this.elSyncX0X2) {
            this.elSyncX0X2.addEventListener('change', () => {
                const isSync = this.elSyncX0X2.checked;
                if (this.elX2) {
                    this.elX2.disabled = isSync;
                    if (isSync && this.elX0) {
                        const val0 = parseFloat(this.elX0.value || 0.0);
                        this.elX2.value = (-val0).toFixed(4);
                    }
                }
                this.recalculate();
            });
        }
        if (this.elX0) {
            this.elX0.addEventListener('input', () => {
                if (this.elSyncX0X2 && this.elSyncX0X2.checked && this.elX2) {
                    const val0 = parseFloat(this.elX0.value || 0.0);
                    this.elX2.value = (-val0).toFixed(4);
                }
            });
        }

        // Quản lý Checkbox Tự động Mục 4.1 (Số răng k0, k2)
        if (this.elK0Auto) {
            this.elK0Auto.addEventListener('change', () => {
                if (this.elK0) this.elK0.disabled = this.elK0Auto.checked;
                this.recalculate();
            });
        }
        if (this.elK2Auto) {
            this.elK2Auto.addEventListener('change', () => {
                if (this.elK2) this.elK2.disabled = this.elK2Auto.checked;
                this.recalculate();
            });
        }
        this.elK0?.addEventListener('input', () => this.recalculate());
        this.elK2?.addEventListener('input', () => this.recalculate());

        // Inputs that trigger recalculation
        const triggerInputs = [
            this.elUnits, this.elZ,
            this.elX0, this.elX2, this.elAutoFill,
            this.elHa0, this.elHa2, this.elHf0, this.elHf2,
            this.elRa0, this.elRa2, this.elRf0, this.elRf2,
            this.elDa0, this.elDf0, this.elDi2, this.elDri2,
            this.elDt0, this.elDt2,
            this.elZRevShaft, this.elDaRevShaft, this.elURevShaft,
            this.elZRevHub, this.elDaRevHub, this.elURevHub
        ];

        triggerInputs.forEach(el => {
            if (el) {
                el.addEventListener('change', () => this.recalculate());
                el.addEventListener('input', () => this.recalculate());
            }
        });

        // Two-way synchronization: Module (Metric) <-> Diametral Pitch (ANSI Inch)
        if (this.elModule) {
            const onModuleChange = () => {
                const mVal = parseFloat(this.elModule.value);
                if (!isNaN(mVal) && mVal > 0) {
                    if (this.elDP) this.elDP.value = (25.4 / mVal).toFixed(4);
                    if (this.elModuleSelect) {
                        const opt = Array.from(this.elModuleSelect.options).find(o => Math.abs(parseFloat(o.value) - mVal) < 1e-3);
                        if (opt) this.elModuleSelect.value = opt.value;
                    }
                    resetPinFlag();
                }
                this.recalculate();
            };
            this.elModule.addEventListener('input', onModuleChange);
            this.elModule.addEventListener('change', onModuleChange);
        }

        if (this.elDP) {
            const onDPChange = () => {
                const dpVal = parseFloat(this.elDP.value);
                if (!isNaN(dpVal) && dpVal > 0) {
                    if (this.elModule) this.elModule.value = (25.4 / dpVal).toFixed(4);
                    if (this.elDPSelect) {
                        const opt = Array.from(this.elDPSelect.options).find(o => Math.abs(parseFloat(o.value) - dpVal) < 1e-3);
                        if (opt) this.elDPSelect.value = opt.value;
                    }
                    resetPinFlag();
                }
                this.recalculate();
            };
            this.elDP.addEventListener('input', onDPChange);
            this.elDP.addEventListener('change', onDPChange);
        }

        // Module dropdown synchronizer
        if (this.elModuleSelect) {
            this.elModuleSelect.addEventListener('change', () => {
                if (this.elModule) {
                    this.elModule.value = this.elModuleSelect.value;
                    const mVal = parseFloat(this.elModuleSelect.value);
                    if (this.elDP) this.elDP.value = (25.4 / mVal).toFixed(4);
                    resetPinFlag();
                    this.recalculate();
                }
            });
        }

        // DP dropdown synchronizer
        if (this.elDPSelect) {
            this.elDPSelect.addEventListener('change', () => {
                if (this.elDP) {
                    this.elDP.value = this.elDPSelect.value;
                    const dpVal = parseFloat(this.elDP.value);
                    if (this.elModule) {
                        this.elModule.value = (25.4 / dpVal).toFixed(4);
                    }
                    resetPinFlag();
                    this.recalculate();
                }
            });
        }

        // Quick Preset selection
        const presetSelect = document.getElementById('standardPresetSelect');
        if (presetSelect) {
            presetSelect.addEventListener('change', () => {
                if (!presetSelect.value) return;
                try {
                    const preset = JSON.parse(presetSelect.value);
                    if (this.elStdType) this.elStdType.value = preset.type;
                    if (this.elModule) this.elModule.value = preset.m;
                    if (this.elZ) this.elZ.value = preset.z;
                    if (preset.angle && this.elAlfa) this.elAlfa.value = preset.angle;
                    if (this.elAutoFill) this.elAutoFill.checked = true;
                    this.recalculate();
                    this.showToast(`Đã nạp quy cách tiêu chuẩn thành công!`);
                } catch (e) {
                    console.error(e);
                }
            });
        }

        // Accordion group toggles
        document.querySelectorAll('.section-header').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const parent = hdr.closest('.calc-section');
                if (parent) {
                    parent.classList.toggle('open');
                    const icon = hdr.querySelector('.toggle-icon');
                    if (icon) {
                        icon.textContent = parent.classList.contains('open') ? '▼' : '▶';
                    }
                }
            });
        });

        // Global accordion toolbar buttons
        const btnExpandAll = document.getElementById('btnExpandAll');
        const btnCollapseAll = document.getElementById('btnCollapseAll');
        if (btnExpandAll) {
            btnExpandAll.addEventListener('click', () => {
                document.querySelectorAll('.calc-section').forEach(s => {
                    s.classList.add('open');
                    const icon = s.querySelector('.toggle-icon');
                    if (icon) icon.textContent = '▼';
                });
            });
        }
        if (btnCollapseAll) {
            btnCollapseAll.addEventListener('click', () => {
                document.querySelectorAll('.calc-section').forEach(s => {
                    s.classList.remove('open');
                    const icon = s.querySelector('.toggle-icon');
                    if (icon) icon.textContent = '▶';
                });
            });
        }

        // Canvas Toolbar Controls
        const btnModeAssembly = document.getElementById('btnModeAssembly');
        const btnModeShaft = document.getElementById('btnModeShaft');
        const btnModeHub = document.getElementById('btnModeHub');

        const setViewMode = (mode, activeBtn) => {
            this.canvas.viewMode = mode;
            [btnModeAssembly, btnModeShaft, btnModeHub].forEach(b => b?.classList.remove('active'));
            activeBtn?.classList.add('active');
            this.canvas.render();
        };

        btnModeAssembly?.addEventListener('click', () => setViewMode('assembly', btnModeAssembly));
        btnModeShaft?.addEventListener('click', () => setViewMode('shaft', btnModeShaft));
        btnModeHub?.addEventListener('click', () => setViewMode('hub', btnModeHub));

        // Tooth Scope Controls
        const btnScopeFull = document.getElementById('btnScopeFull');
        const btnScopeDetail = document.getElementById('btnScopeDetail');
        const btnScopeSingle = document.getElementById('btnScopeSingle');

        const setScope = (scope, activeBtn) => {
            this.canvas.toothScope = scope;
            [btnScopeFull, btnScopeDetail, btnScopeSingle].forEach(b => b?.classList.remove('active'));
            activeBtn?.classList.add('active');
            this.canvas.resetView();
        };

        btnScopeFull?.addEventListener('click', () => setScope('full', btnScopeFull));
        btnScopeDetail?.addEventListener('click', () => setScope('detail', btnScopeDetail));
        btnScopeSingle?.addEventListener('click', () => setScope('single', btnScopeSingle));

        // Canvas View Zoom Buttons
        document.getElementById('btnZoomIn')?.addEventListener('click', () => {
            this.canvas.scale = Math.min(50.0, this.canvas.scale * 1.25);
            this.canvas.render();
        });
        document.getElementById('btnZoomOut')?.addEventListener('click', () => {
            this.canvas.scale = Math.max(0.05, this.canvas.scale * 0.8);
            this.canvas.render();
        });
        document.getElementById('btnResetView')?.addEventListener('click', () => {
            this.canvas.resetView();
        });
        document.getElementById('btnExportPng')?.addEventListener('click', () => {
            this.canvas.exportImage();
            this.showToast('Đã tải hình ảnh 2D PNG!');
        });

        // DXF Export Buttons
        document.getElementById('btnExportDxfAssembly')?.addEventListener('click', () => {
            if (this.currentGeom) {
                SplinesDxf.downloadDxf(this.currentGeom, 'assembly');
                this.showToast('Đã xuất bản vẽ CAD DXF (Cặp Lắp Ghép)!');
            }
        });
        document.getElementById('btnExportDxfShaft')?.addEventListener('click', () => {
            if (this.currentGeom) {
                SplinesDxf.downloadDxf(this.currentGeom, 'shaft');
                this.showToast('Đã xuất bản vẽ CAD DXF (Trục Then Hoa)!');
            }
        });
        document.getElementById('btnExportDxfHub')?.addEventListener('click', () => {
            if (this.currentGeom) {
                SplinesDxf.downloadDxf(this.currentGeom, 'hub');
                this.showToast('Đã xuất bản vẽ CAD DXF (Lỗ Moay-ơ)!');
            }
        });

        // Reverse module transfer buttons
        document.getElementById('btnApplyRevShaft')?.addEventListener('click', () => {
            if (this.currentGeom && this.elModule) {
                this.elModule.value = this.currentGeom.m_rev_shaft.toFixed(3);
                this.recalculate();
                this.showToast(`Đã áp dụng mô đun m = ${this.currentGeom.m_rev_shaft.toFixed(3)} mm vào thiết kế!`);
            }
        });
        document.getElementById('btnApplyRevHub')?.addEventListener('click', () => {
            if (this.currentGeom && this.elModule) {
                this.elModule.value = this.currentGeom.m_rev_hub.toFixed(3);
                this.recalculate();
                this.showToast(`Đã áp dụng mô đun m = ${this.currentGeom.m_rev_hub.toFixed(3)} mm vào thiết kế!`);
            }
        });
    }

    recalculate() {
        const units = parseInt(this.elUnits?.value || 1);
        const stdType = parseInt(this.elStdType?.value || 14);
        let m = parseFloat(this.elModule?.value || 10.0);
        const DP = parseFloat(this.elDP?.value || 2.5);
        const z = parseInt(this.elZ?.value || 20);
        const alfa = parseFloat(this.elAlfaInput?.value || this.elAlfa?.value || 30.0);

        // Liên hợp x2 theo x0 (x2 = -x0) nếu checkbox đang tích
        if (this.elSyncX0X2 && this.elSyncX0X2.checked && this.elX0 && this.elX2) {
            const val0 = parseFloat(this.elX0.value || 0.0);
            this.elX2.value = (-val0).toFixed(4);
        }

        const x0 = parseFloat(this.elX0?.value || 0.0);
        const x2 = parseFloat(this.elX2?.value || 0.0);
        const autoFill = this.elAutoFill ? this.elAutoFill.checked : true;

        const profile_standard = this.elProfileStd ? this.elProfileStd.checked : true;
        const ha0_tool = parseFloat(this.elHa0?.value || 0.5);
        const hf0_tool = parseFloat(this.elHf0?.value || 0.75);
        const ra0_tool = parseFloat(this.elRa0?.value || 0.0);
        const rf0_tool = parseFloat(this.elRf0?.value || 0.0);
        const ha2_tool = parseFloat(this.elHa2?.value || 0.5);
        const hf2_tool = parseFloat(this.elHf2?.value || 0.75);
        const ra2_tool = parseFloat(this.elRa2?.value || 0.2);
        const rf2_tool = parseFloat(this.elRf2?.value || 0.0);

        const k0_auto = this.elK0Auto ? this.elK0Auto.checked : true;
        const k0_custom = parseInt(this.elK0?.value || 4);
        const k2_auto = this.elK2Auto ? this.elK2Auto.checked : true;
        const k2_custom = parseInt(this.elK2?.value || 3);

        const da0 = parseFloat(this.elDa0?.value || 210.0);
        const df0 = parseFloat(this.elDf0?.value || 185.0);
        const di2 = parseFloat(this.elDi2?.value || 191.1454);
        const dri2 = parseFloat(this.elDri2?.value || 215.0);

        const dt0 = (this.elDt0 && this.elDt0.dataset.userEdited && this.elDt0.value) ? parseFloat(this.elDt0.value) : 0;
        const dt2 = (this.elDt2 && this.elDt2.dataset.userEdited && this.elDt2.value) ? parseFloat(this.elDt2.value) : 0;

        const z_rev_shaft = parseInt(this.elZRevShaft?.value || 24);
        const da_rev_shaft = parseFloat(this.elDaRevShaft?.value || 20.0);
        const u_rev_shaft = parseFloat(this.elURevShaft?.value || 0.0);

        const z_rev_hub = parseInt(this.elZRevHub?.value || 24);
        const da_rev_hub = parseFloat(this.elDaRevHub?.value || 20.0);
        const u_rev_hub = parseFloat(this.elURevHub?.value || 0.0);

        // Run calculation
        const geom = this.calc.calculate({
            units,
            stdType,
            m,
            DP,
            z,
            alfa,
            customAlfa: true,
            x0,
            x2,
            autoFill,
            profile_standard,
            ha0_tool,
            hf0_tool,
            ra0_tool,
            rf0_tool,
            ha2_tool,
            hf2_tool,
            ra2_tool,
            rf2_tool,
            k0_auto,
            k0_custom,
            k2_auto,
            k2_custom,
            da0,
            df0,
            di2,
            dri2,
            dt0,
            dt2,
            z_rev_shaft,
            da_rev_shaft,
            u_rev_shaft,
            z_rev_hub,
            da_rev_hub,
            u_rev_hub
        });

        this.currentGeom = geom;

        // If AutoFill is on or custom tooth profile is defined, update diameter fields
        if (autoFill || !profile_standard) {
            if (this.elDa0) this.elDa0.value = geom.da0.toFixed(4);
            if (this.elDf0) this.elDf0.value = geom.df0.toFixed(4);
            if (this.elDi2) this.elDi2.value = geom.di2.toFixed(4);
            if (this.elDri2) this.elDri2.value = geom.dri2.toFixed(4);
        }

        // Update k input fields if in auto mode
        if (k0_auto && this.elK0) this.elK0.value = geom.k0;
        if (k2_auto && this.elK2) this.elK2.value = geom.k2;

        // If profile standard is active, ensure inputs reflect standard profile
        if (profile_standard) {
            if (this.elHa0) this.elHa0.value = geom.ha0_tool.toFixed(4);
            if (this.elHf0) this.elHf0.value = geom.hf0_tool.toFixed(4);
            if (this.elRa0) this.elRa0.value = geom.ra0_tool.toFixed(4);
            if (this.elRf0) this.elRf0.value = geom.rf0_tool.toFixed(4);
            if (this.elHa2) this.elHa2.value = geom.ha2_tool.toFixed(4);
            if (this.elHf2) this.elHf2.value = geom.hf2_tool.toFixed(4);
            if (this.elRa2) this.elRa2.value = geom.ra2_tool.toFixed(4);
            if (this.elRf2) this.elRf2.value = geom.rf2_tool.toFixed(4);
        }

        // Always update recommended ball/pin diameter if not manually edited by user
        if (this.elDt0 && !this.elDt0.dataset.userEdited) this.elDt0.value = geom.dt0.toFixed(4);
        if (this.elDt2 && !this.elDt2.dataset.userEdited) this.elDt2.value = geom.dt2.toFixed(4);

        // Update DOM outputs
        this.updateDOMOutputs(geom);

        // Update Canvas 2D
        this.canvas.updateData(geom);
    }

    updateDOMOutputs(g) {
        // Section 1.0 Module & Pitch Diameters & Angles
        this.setTxt('outAlfaHub', g.alfa.toFixed(2));
        this.setTxt('outModuleHub', g.m.toFixed(3));
        this.setTxt('outDPHub', g.DP.toFixed(3));
        this.setTxt('outD0', g.d0.toFixed(4));
        this.setTxt('outDb0', g.db0.toFixed(4));
        this.setTxt('outD2', g.d2.toFixed(4));
        this.setTxt('outDb2', g.db2.toFixed(4));

        // Section 1.0 Tooth thickness and space
        this.setTxt('outS0_pitch', g.s0.toFixed(4));
        this.setTxt('outS2_pitch', g.s2.toFixed(4));
        this.setTxt('outE0_groove', g.e0.toFixed(4));
        this.setTxt('outE2_groove', g.e2.toFixed(4));
        this.setTxt('outBacklash', g.backlash.toFixed(4));

        // Section 3.0 Dimensions
        this.setTxt('outSec3_z0', g.z0);
        this.setTxt('outSec3_z2', g.z2);
        this.setTxt('outSec3_m', g.m.toFixed(4));
        this.setTxt('outSec3_p', g.p.toFixed(4));
        this.setTxt('outSec3_pb', g.pb.toFixed(4));
        this.setTxt('outSec3_alfa', g.alfa.toFixed(2));

        this.setTxt('outSec3_da0', g.da0.toFixed(4));
        this.setTxt('outSec3_da2', g.di2.toFixed(4));
        this.setTxt('outSec3_d0', g.d0.toFixed(4));
        this.setTxt('outSec3_d2', g.d2.toFixed(4));
        this.setTxt('outSec3_db0', g.db0.toFixed(4));
        this.setTxt('outSec3_db2', g.db2.toFixed(4));
        this.setTxt('outSec3_df0', g.df0.toFixed(4));
        this.setTxt('outSec3_df2', g.dri2.toFixed(4));

        this.setTxt('outSec3_ha0', g.ha0.toFixed(4));
        this.setTxt('outSec3_ha2', g.ha2.toFixed(4));
        this.setTxt('outSec3_hf0', g.hf0.toFixed(4));
        this.setTxt('outSec3_hf2', g.hf2.toFixed(4));

        this.setTxt('outSec3_sa0', g.sa0.toFixed(4));
        this.setTxt('outSec3_sa2', g.sa2.toFixed(4));
        this.setTxt('outSec3_s0', g.s0.toFixed(4));
        this.setTxt('outSec3_s2', g.s2.toFixed(4));
        this.setTxt('outSec3_sb0', g.sb0.toFixed(4));
        this.setTxt('outSec3_sb2', g.sb2.toFixed(4));

        this.setTxt('outSec3_c0', g.c0.toFixed(4));
        this.setTxt('outSec3_c2', g.c2.toFixed(4));
        this.setTxt('outSec3_c0_m', g.c0_m.toFixed(4));
        this.setTxt('outSec3_c2_m', g.c2_m.toFixed(4));

        // Section 4.0 Check Dimensions
        this.setTxt('outK0', g.k0);
        this.setTxt('outK2', g.k2);
        this.setTxt('outW0', g.W0.toFixed(4));
        this.setTxt('outW2', (g.W_bi2 || g.W2).toFixed(4)); // 2-ball measurement across k teeth for hub
        this.setTxt('outM0', g.M0.toFixed(4));
        this.setTxt('outM2', g.M2.toFixed(4));

        // Section 5.0 Reverse Module Outputs
        this.setTxt('outDaxxShaft', g.daxx_shaft.toFixed(4));
        this.setTxt('outMRevShaft', g.m_rev_shaft.toFixed(3));
        this.setTxt('outDaxxHub', g.daxx_hub.toFixed(4));
        this.setTxt('outMRevHub', g.m_rev_hub.toFixed(3));
    }

    setTxt(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    showToast(msg) {
        if (!this.elToast) return;
        this.elToast.textContent = msg;
        this.elToast.classList.add('show');
        setTimeout(() => {
            this.elToast.classList.remove('show');
        }, 2800);
    }
}

// Auto bootstrap when loaded
window.addEventListener('DOMContentLoaded', () => {
    window.splinesApp = new SplinesUI();
});
