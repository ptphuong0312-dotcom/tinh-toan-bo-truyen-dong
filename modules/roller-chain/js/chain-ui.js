/**
 * MITCalc Web App - Roller Chain UI Controller & Event Handler (Module 9)
 * Standards: ISO 606 / DIN 8187 / ASME B29.1M
 * Complies with:
 *   - Rule 1: Zero-Force Scope Protocol
 *   - Rule 2 & 3: Master Blocks & Excel-Style Controls
 *   - Rule 11: Mobile Touch Support
 *   - Rule 12: Combo-Box Protocol
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    const state = {
        units: 1, // 1: Metric, 2: Imperial
        stdId: 'EU_STD',
        chainId: 4, // 08B-1
        presetId: 'motorcycle_secondary',
        P: 5.0, // kW
        n1: 1450, // rpm
        n2_req: 690, // rpm
        z1: 19,
        z2: 40,
        a_req: 350.0, // mm
        linksMode: 'even',
        drivingType: 'A',
        drivenType: 'B',
        customLinks: null,
        calcResult: null
    };

    // 2. DOM Elements Cache
    const el = {
        // Module menu dropdown
        btnModuleMenuToggle: document.getElementById('btnModuleMenuToggle'),
        moduleDropdownMenu: document.getElementById('moduleDropdownMenu'),

        // Global Accordion toolbar
        btnExpandAll: document.getElementById('btnExpandAll'),
        btnCollapseAll: document.getElementById('btnCollapseAll'),

        // Tabs
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabPanes: document.querySelectorAll('.tab-pane'),

        // Inputs
        selUnits: document.getElementById('selUnits'),
        selStandard: document.getElementById('selStandard'),
        selChain: document.getElementById('selChain'),
        selPreset: document.getElementById('selPreset'),
        selDriving: document.getElementById('selDriving'),
        selDriven: document.getElementById('selDriven'),

        inputP: document.getElementById('inputP'),
        inputN1: document.getElementById('inputN1'),
        inputN2: document.getElementById('inputN2'),
        inputRatio: document.getElementById('inputRatio'),
        selRatioStd: document.getElementById('selRatioStd'),
        btnCalcRatioSpeed: document.getElementById('btnCalcRatioSpeed'),
        btnCalcPowerTorque: document.getElementById('btnCalcPowerTorque'),

        inputZ1: document.getElementById('inputZ1'),
        inputZ2: document.getElementById('inputZ2'),
        btnCalcRatioTeeth: document.getElementById('btnCalcRatioTeeth'),
        inputAReq: document.getElementById('inputAReq'),
        rangeAReq: document.getElementById('rangeAReq'),
        selLinksMode: document.getElementById('selLinksMode'),

        // Outputs - Sec 1.0
        outMk1: document.getElementById('outMk1'),
        outMk2: document.getElementById('outMk2'),
        outActualN2: document.getElementById('outActualN2'),

        // Outputs - Sec 3.0 / 4.0
        outPitch: document.getElementById('outPitch'),
        outRollerD: document.getElementById('outRollerD'),
        outInnerW: document.getElementById('outInnerW'),
        outBreakingF: document.getElementById('outBreakingF'),
        outMass: document.getElementById('outMass'),
        outXExact: document.getElementById('outXExact'),
        outXActual: document.getElementById('outXActual'),
        outAActual: document.getElementById('outAActual'),
        outAPercent: document.getElementById('outAPercent'),
        outChainLength: document.getElementById('outChainLength'),
        outChainSpeed: document.getElementById('outChainSpeed'),
        outAlpha1: document.getElementById('outAlpha1'),
        outAlpha2: document.getElementById('outAlpha2'),
        outSagY: document.getElementById('outSagY'),
        outLubeType: document.getElementById('outLubeType'),

        // Outputs - Sec 5.0 (Sprockets)
        outD1: document.getElementById('outD1'),
        outD2: document.getElementById('outD2'),
        outDa1: document.getElementById('outDa1'),
        outDa2: document.getElementById('outDa2'),
        outDf1: document.getElementById('outDf1'),
        outDf2: document.getElementById('outDf2'),
        outR1_1: document.getElementById('outR1_1'),
        outR1_2: document.getElementById('outR1_2'),
        outBf1: document.getElementById('outBf1'),
        outRx: document.getElementById('outRx'),
        outDg1: document.getElementById('outDg1'),
        outDg2: document.getElementById('outDg2'),

        // Summary Banner
        bannerPitch: document.getElementById('bannerPitch'),
        bannerSpeed: document.getElementById('bannerSpeed'),
        bannerAxisDist: document.getElementById('bannerAxisDist'),
        bannerLinks: document.getElementById('bannerLinks'),
        bannerStatus: document.getElementById('bannerStatus'),

        // Canvas & Controls
        chainCanvas: document.getElementById('chainCanvas'),
        btnViewFull: document.getElementById('btnViewFull'),
        btnViewSp1: document.getElementById('btnViewSp1'),
        btnViewSp2: document.getElementById('btnViewSp2'),
        btnViewMesh: document.getElementById('btnViewMesh'),
        btnToggleLinks: document.getElementById('btnToggleLinks'),
        btnAnimToggle: document.getElementById('btnAnimToggle'),
        rangeAnimSpeed: document.getElementById('rangeAnimSpeed'),
        spanAnimSpeed: document.getElementById('spanAnimSpeed'),
        btnAnimReset: document.getElementById('btnAnimReset'),
        btnFitView: document.getElementById('btnFitView'),

        // DXF export
        btnExportDxfAssembly: document.getElementById('btnExportDxfAssembly'),
        btnExportDxfSp1: document.getElementById('btnExportDxfSp1'),
        btnExportDxfSp2: document.getElementById('btnExportDxfSp2')
    };

    // 3. Initialize 2D Canvas Engine
    let canvasEngine = null;
    if (el.chainCanvas && typeof ChainCanvas !== 'undefined') {
        canvasEngine = new ChainCanvas('chainCanvas');
    }

    // 4. Populate Standard Chains & Presets Dropdowns
    function populateStandards() {
        if (!el.selStandard || typeof ChainData === 'undefined') return;
        el.selStandard.innerHTML = '';
        ChainData.standards.forEach(std => {
            const opt = document.createElement('option');
            opt.value = std.id;
            opt.textContent = `${std.name} (${std.standard})`;
            if (std.id === state.stdId) opt.selected = true;
            el.selStandard.appendChild(opt);
        });
    }

    function populateChains() {
        if (!el.selChain || typeof ChainData === 'undefined') return;
        el.selChain.innerHTML = '';
        const std = ChainData.standards.find(s => s.id === state.stdId) || ChainData.standards[0];
        if (!std || !std.chains) return;

        std.chains.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.code} - p=${c.pitch.toFixed(3)}mm (d3=${c.d3.toFixed(2)}mm, b1=${c.b1.toFixed(2)}mm)`;
            if (c.id === state.chainId) opt.selected = true;
            el.selChain.appendChild(opt);
        });
    }

    function populatePresets() {
        if (!el.selPreset || typeof ChainData === 'undefined' || !ChainData.presets) return;
        el.selPreset.innerHTML = '<option value="">-- Chọn Preset Ứng Dụng --</option>';
        ChainData.presets.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (${p.chainCode}, z1=${p.z1}, z2=${p.z2})`;
            el.selPreset.appendChild(opt);
        });
    }

    // 5. Core Recalculation Routine
    function recalculate() {
        if (typeof ChainCalc === 'undefined') return;

        // Parse Inputs safely (supporting both ',' and '.' decimal formats)
        const parseNum = (val, def) => {
            if (typeof val === 'number') return val;
            if (!val) return def;
            const cleaned = String(val).replace(',', '.').trim();
            const n = parseFloat(cleaned);
            return isNaN(n) ? def : n;
        };

        state.P = parseNum(el.inputP ? el.inputP.value : 5.0, 5.0);
        state.n1 = parseNum(el.inputN1 ? el.inputN1.value : 1450, 1450);
        state.n2_req = parseNum(el.inputN2 ? el.inputN2.value : 690, 690);
        state.z1 = Math.max(7, parseInt(el.inputZ1 ? el.inputZ1.value : 19, 10));
        state.z2 = Math.max(state.z1, parseInt(el.inputZ2 ? el.inputZ2.value : 40, 10));
        state.a_req = parseNum(el.inputAReq ? el.inputAReq.value : 350.0, 350.0);
        state.linksMode = el.selLinksMode ? el.selLinksMode.value : 'even';

        // Synchronize a_req slider
        if (el.rangeAReq) {
            el.rangeAReq.value = state.a_req;
        }

        // Perform calculation via ChainCalc
        const res = ChainCalc.calculate({
            units: state.units,
            stdId: state.stdId,
            chainId: state.chainId,
            P: state.P,
            n1: state.n1,
            n2_req: state.n2_req,
            z1: state.z1,
            z2: state.z2,
            a_req: state.a_req,
            linksMode: state.linksMode,
            drivingType: state.drivingType,
            drivenType: state.drivenType
        });

        state.calcResult = res;

        // Update UI Outputs
        updateUI(res);

        // Update 2D Canvas Engine
        if (canvasEngine) {
            canvasEngine.setData(res);
        }
    }

    function updateUI(res) {
        if (!res) return;

        const i_val = res.i ?? res.i_act ?? (res.z2 && res.z1 ? res.z2 / res.z1 : 2.0);
        const n2_val = res.n2 ?? res.n2_act ?? 690;
        const Mk1_val = res.Mk1 ?? 0;
        const Mk2_val = res.Mk2 ?? 0;
        const X_val = res.X_even ?? res.X ?? 100;
        const a_val = res.a ?? 300;
        const L_val = res.L ?? (X_val * (res.chain ? res.chain.pitch : 12.7));
        const v_val = res.v ?? 0;
        const y_val = res.y ?? res.y_slack ?? 0;
        const alpha1_val = res.alpha1 ?? 180;
        const alpha2_val = res.alpha2 ?? 180;

        // Sec 1.0 Kinematics
        if (el.inputRatio) el.inputRatio.value = typeof i_val === 'number' ? i_val.toFixed(4) : i_val;
        if (el.outActualN2) el.outActualN2.textContent = typeof n2_val === 'number' ? n2_val.toFixed(1) : n2_val;
        if (el.outMk1) el.outMk1.textContent = typeof Mk1_val === 'number' ? Mk1_val.toFixed(2) : Mk1_val;
        if (el.outMk2) el.outMk2.textContent = typeof Mk2_val === 'number' ? Mk2_val.toFixed(2) : Mk2_val;

        // Sec 3.0 Chain Geometry
        if (res.chain) {
            if (el.outPitch) el.outPitch.textContent = res.chain.pitch.toFixed(3);
            if (el.outRollerD) el.outRollerD.textContent = res.chain.d3.toFixed(2);
            if (el.outInnerW) el.outInnerW.textContent = res.chain.b1.toFixed(2);
            if (el.outBreakingF) el.outBreakingF.textContent = (res.chain.fb / 1000).toFixed(1) + ' kN';
            if (el.outMass) el.outMass.textContent = res.chain.mass.toFixed(2);
        }

        // Sec 4.0 Center Distance & Transmission Quality
        if (el.outXExact) el.outXExact.textContent = typeof res.X_exact === 'number' ? res.X_exact.toFixed(2) : res.X_exact;
        if (el.outXActual) el.outXActual.textContent = X_val;
        if (el.outAActual) el.outAActual.textContent = typeof a_val === 'number' ? a_val.toFixed(2) : a_val;
        if (el.outAPercent) {
            const p = res.chain ? res.chain.pitch : 12.7;
            const a_in_p = a_val / p;
            el.outAPercent.textContent = a_in_p.toFixed(1) + ' p';
        }
        if (el.outChainLength) el.outChainLength.textContent = typeof L_val === 'number' ? L_val.toFixed(1) : L_val;
        if (el.outChainSpeed) el.outChainSpeed.textContent = typeof v_val === 'number' ? v_val.toFixed(2) : v_val;
        if (el.outAlpha1) el.outAlpha1.textContent = typeof alpha1_val === 'number' ? alpha1_val.toFixed(2) + '°' : alpha1_val;
        if (el.outAlpha2) el.outAlpha2.textContent = typeof alpha2_val === 'number' ? alpha2_val.toFixed(2) + '°' : alpha2_val;
        if (el.outSagY) el.outSagY.textContent = typeof y_val === 'number' ? y_val.toFixed(1) + ' mm' : y_val;
        if (el.outLubeType) el.outLubeType.textContent = res.lubrication || 'Bôi trơn nhỏ giọt (Drip lubrication)';

        // Sec 5.0 Sprocket Dimensions (ISO 606)
        if (el.outD1 && res.d1 != null) el.outD1.textContent = res.d1.toFixed(2);
        if (el.outD2 && res.d2 != null) el.outD2.textContent = res.d2.toFixed(2);

        const sp1 = res.sprocket1 || { da: res.da1, df: res.df1, R1: res.R1, bf1: res.bf, rx: res.rx, Dg: res.Dg1 };
        if (sp1) {
            if (el.outDa1 && sp1.da != null) el.outDa1.textContent = sp1.da.toFixed(2);
            if (el.outDf1 && sp1.df != null) el.outDf1.textContent = sp1.df.toFixed(2);
            if (el.outR1_1 && sp1.R1 != null) el.outR1_1.textContent = sp1.R1.toFixed(2);
            if (el.outBf1 && sp1.bf1 != null) el.outBf1.textContent = sp1.bf1.toFixed(2);
            if (el.outRx && sp1.rx != null) el.outRx.textContent = sp1.rx.toFixed(2);
            if (el.outDg1 && sp1.Dg != null) el.outDg1.textContent = sp1.Dg.toFixed(2);
        }

        const sp2 = res.sprocket2 || { da: res.da2, df: res.df2, R1: res.R1, Dg: res.Dg2 };
        if (sp2) {
            if (el.outDa2 && sp2.da != null) el.outDa2.textContent = sp2.da.toFixed(2);
            if (el.outDf2 && sp2.df != null) el.outDf2.textContent = sp2.df.toFixed(2);
            if (el.outR1_2 && sp2.R1 != null) el.outR1_2.textContent = sp2.R1.toFixed(2);
            if (el.outDg2 && sp2.Dg != null) el.outDg2.textContent = sp2.Dg.toFixed(2);
        }

        // Summary Banner Cards
        if (el.bannerPitch && res.chain) el.bannerPitch.textContent = `${res.chain.pitch.toFixed(2)} mm (${res.chain.code})`;
        if (el.bannerSpeed && v_val != null) el.bannerSpeed.textContent = `${typeof v_val === 'number' ? v_val.toFixed(2) : v_val} m/s`;
        if (el.bannerAxisDist && a_val != null) el.bannerAxisDist.textContent = `${typeof a_val === 'number' ? a_val.toFixed(2) : a_val} mm`;
        if (el.bannerLinks) el.bannerLinks.textContent = `${X_val} mắt (${typeof L_val === 'number' ? L_val.toFixed(0) : L_val} mm)`;
        if (el.bannerStatus) {
            const isAngleGood = alpha1_val >= 120;
            el.bannerStatus.textContent = isAngleGood ? 'ĐẠT TIÊU CHUẨN ISO 606' : 'CẢNH BÁO: GÓC ÔM < 120°';
            el.bannerStatus.className = isAngleGood ? 'status-pill status-pass' : 'status-pill status-warn';
        }
    }

    // 6. Bind Input Events
    function bindEvents() {
        // Dropdown Module Navigation
        if (el.btnModuleMenuToggle && el.moduleDropdownMenu) {
            el.btnModuleMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                el.moduleDropdownMenu.classList.toggle('show');
            });
            document.addEventListener('click', () => {
                el.moduleDropdownMenu.classList.remove('show');
            });
        }

        // Accordion Global Toolbar
        if (el.btnExpandAll) {
            el.btnExpandAll.addEventListener('click', () => {
                document.querySelectorAll('.accordion-section').forEach(sec => sec.classList.add('active'));
            });
        }
        if (el.btnCollapseAll) {
            el.btnCollapseAll.addEventListener('click', () => {
                document.querySelectorAll('.accordion-section').forEach(sec => sec.classList.remove('active'));
            });
        }

        // Accordion Section Header Click
        document.querySelectorAll('.section-header').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const sec = hdr.closest('.accordion-section');
                if (sec) sec.classList.toggle('active');
            });
        });

        // Tab Switching
        el.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                el.tabBtns.forEach(b => b.classList.remove('active'));
                el.tabPanes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const pane = document.getElementById(target);
                if (pane) pane.classList.add('active');

                // If switched to Canvas tab, trigger autoFit and resize
                if (target === 'tabCanvas' && canvasEngine) {
                    setTimeout(() => {
                        canvasEngine.autoFit();
                        canvasEngine.render();
                    }, 50);
                }
            });
        });

        // Standard select change
        if (el.selStandard) {
            el.selStandard.addEventListener('change', () => {
                state.stdId = el.selStandard.value;
                populateChains();
                if (el.selChain && el.selChain.options.length > 0) {
                    state.chainId = parseInt(el.selChain.value, 10);
                }
                recalculate();
            });
        }

        // Chain select change
        if (el.selChain) {
            el.selChain.addEventListener('change', () => {
                state.chainId = parseInt(el.selChain.value, 10);
                recalculate();
            });
        }

        // Preset select change
        if (el.selPreset) {
            el.selPreset.addEventListener('change', () => {
                const presetId = el.selPreset.value;
                if (!presetId || !ChainData || !ChainData.presets) return;
                const p = ChainData.presets.find(item => item.id === presetId);
                if (!p) return;

                if (el.inputP) el.inputP.value = p.P;
                if (el.inputN1) el.inputN1.value = p.n1;
                if (el.inputN2) el.inputN2.value = p.n2;
                if (el.inputZ1) el.inputZ1.value = p.z1;
                if (el.inputZ2) el.inputZ2.value = p.z2;
                if (el.inputAReq) el.inputAReq.value = p.a_req;

                // Match chain
                const std = ChainData.standards.find(s => s.id === p.stdId);
                if (std) {
                    state.stdId = p.stdId;
                    if (el.selStandard) el.selStandard.value = p.stdId;
                    populateChains();
                    const chainMatch = std.chains.find(c => c.code === p.chainCode);
                    if (chainMatch) {
                        state.chainId = chainMatch.id;
                        if (el.selChain) el.selChain.value = chainMatch.id;
                    }
                }

                recalculate();
            });
        }

        // Reactive inputs
        const liveInputs = [
            el.inputP, el.inputN1, el.inputN2, el.inputZ1, el.inputZ2,
            el.inputAReq, el.selLinksMode, el.selDriving, el.selDriven
        ];
        liveInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', recalculate);
                input.addEventListener('change', recalculate);
            }
        });

        // Axis distance slider
        if (el.rangeAReq && el.inputAReq) {
            el.rangeAReq.addEventListener('input', () => {
                el.inputAReq.value = el.rangeAReq.value;
                recalculate();
            });
        }

        // Helper buttons
        if (el.btnCalcRatioSpeed && el.inputN1 && el.inputN2) {
            el.btnCalcRatioSpeed.addEventListener('click', () => {
                const n1 = parseFloat(el.inputN1.value) || 1450;
                const n2 = parseFloat(el.inputN2.value) || 690;
                if (n2 > 0 && el.inputRatio) {
                    el.inputRatio.value = (n1 / n2).toFixed(4);
                }
            });
        }

        if (el.btnCalcRatioTeeth && el.inputZ1 && el.inputZ2) {
            el.btnCalcRatioTeeth.addEventListener('click', () => {
                const z1 = parseFloat(el.inputZ1.value) || 19;
                const z2 = parseFloat(el.inputZ2.value) || 40;
                if (z1 > 0 && el.inputRatio) {
                    el.inputRatio.value = (z2 / z1).toFixed(4);
                    if (el.inputN1 && el.inputN2) {
                        const n1 = parseFloat(el.inputN1.value) || 1450;
                        el.inputN2.value = (n1 / (z2 / z1)).toFixed(1);
                    }
                    recalculate();
                }
            });
        }

        // Standard Ratio Dropdown (T_i)
        if (el.selRatioStd && el.inputRatio && el.inputN1 && el.inputN2) {
            el.selRatioStd.addEventListener('change', () => {
                const val = parseFloat(el.selRatioStd.value);
                if (val > 0) {
                    el.inputRatio.value = val.toFixed(2);
                    const n1 = parseFloat(el.inputN1.value) || 1450;
                    el.inputN2.value = (n1 / val).toFixed(1);
                    // Also suggest z2
                    const z1 = parseInt(el.inputZ1.value, 10) || 19;
                    el.inputZ2.value = Math.round(z1 * val);
                    recalculate();
                }
            });
        }

        // Canvas View Mode Controls
        if (canvasEngine) {
            if (el.btnViewFull) el.btnViewFull.addEventListener('click', () => canvasEngine.setViewMode('full'));
            if (el.btnViewSp1) el.btnViewSp1.addEventListener('click', () => canvasEngine.setViewMode('sprocket1'));
            if (el.btnViewSp2) el.btnViewSp2.addEventListener('click', () => canvasEngine.setViewMode('sprocket2'));
            if (el.btnViewMesh) el.btnViewMesh.addEventListener('click', () => canvasEngine.setViewMode('mesh'));
            if (el.btnToggleLinks) {
                el.btnToggleLinks.addEventListener('click', () => {
                    const show = canvasEngine.toggleLinks();
                    el.btnToggleLinks.textContent = show ? '🔗 Ẩn/Hiện Xích' : '⛓️ Hiện Xích';
                });
            }

            if (el.btnAnimToggle) {
                el.btnAnimToggle.addEventListener('click', () => {
                    const running = canvasEngine.toggleAnimation();
                    el.btnAnimToggle.textContent = running ? '⏸ Tạm Dừng' : '▶ Tiếp Tục';
                });
            }

            if (el.rangeAnimSpeed && el.spanAnimSpeed) {
                el.rangeAnimSpeed.addEventListener('input', () => {
                    const sp = parseFloat(el.rangeAnimSpeed.value);
                    canvasEngine.setSpeed(sp);
                    el.spanAnimSpeed.textContent = sp.toFixed(1) + 'x';
                });
            }

            if (el.btnAnimReset) {
                el.btnAnimReset.addEventListener('click', () => canvasEngine.resetRotation());
            }

            if (el.btnFitView) {
                el.btnFitView.addEventListener('click', () => canvasEngine.autoFit());
            }
        }

        // DXF Exporters (Blob zero-CORS)
        if (el.btnExportDxfAssembly && typeof ChainDxf !== 'undefined') {
            el.btnExportDxfAssembly.addEventListener('click', () => {
                if (!state.calcResult) return;
                const dxfStr = ChainDxf.generateDXF(state.calcResult, 'assembly');
                ChainDxf.download(dxfStr, `BoTruyenXich_${state.calcResult.chain.code}_ToanBo.dxf`);
            });
        }

        if (el.btnExportDxfSp1 && typeof ChainDxf !== 'undefined') {
            el.btnExportDxfSp1.addEventListener('click', () => {
                if (!state.calcResult) return;
                const dxfStr = ChainDxf.generateDXF(state.calcResult, 'sprocket1');
                ChainDxf.download(dxfStr, `DiaXichDan1_Z${state.z1}_${state.calcResult.chain.code}.dxf`);
            });
        }

        if (el.btnExportDxfSp2 && typeof ChainDxf !== 'undefined') {
            el.btnExportDxfSp2.addEventListener('click', () => {
                if (!state.calcResult) return;
                const dxfStr = ChainDxf.generateDXF(state.calcResult, 'sprocket2');
                ChainDxf.download(dxfStr, `DiaXichBiDan2_Z${state.z2}_${state.calcResult.chain.code}.dxf`);
            });
        }
    }

    // 7. Initialize Application
    populateStandards();
    populateChains();
    populatePresets();
    bindEvents();
    recalculate();
});
