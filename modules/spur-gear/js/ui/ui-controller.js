/**
 * MITCalc Web App - UI Controller & Reactive State Manager
 * Handles input bindings, real-time recalculations across all 18 sections,
 * tab switching, language selection, and canvas synchronization.
 */

import { Materials } from '../data/materials.js';
import { StandardTables } from '../data/standard-tables.js';
import { I18N } from '../data/i18n.js';
import { GearGeometry } from '../engine/gear-geometry.js';
import { GearForces } from '../engine/gear-forces.js';
import { GearStrengthISO } from '../engine/gear-strength-iso.js';
import { CenterDistanceSolver } from '../engine/center-distance-solver.js';

export class UIController {
    constructor(canvasController) {
        this.canvasController = canvasController;
        this.currentLang = 'vi';
        this.state = {
            // Section 1
            Pw: 100.0,
            n1: 1000.0,
            target_i: 2.50,

            // Section 2
            mat1_id: 35, // Alloy structural steel T2 tooth face hard.
            mat2_id: 35,
            KA: 1.00,
            mountingType: 'A',
            accuracyGrade: 7,
            KAS: 2.0,
            Lh: 20000,
            SH_req: 1.30,
            SF_req: 1.60,

            // Section 3 Tool
            ha0: 1.25,
            hf0: 1.00,
            ra0: 0.38,
            ca_star: 0.25,

            // Section 4 Gearing
            z1: 19,
            z2: 48,
            alfa_n: 20.0,
            beta: 0.0,
            mn: 6.0,
            b1: 120.0,
            b2: 117.0,

            // Section 5 Corrections
            x1: 0.0,
            x2: 0.0,

            // Section 14 Given Axis Distance
            aw_req: 201.0,

            // Section 15 Thermal
            Tair: 20.0,
            Toil: 60.0,
            kt: 12.0,

            // Section 16 Shaft
            shaftRm: 500.0
        };

        this.calcResults = null;
    }

    init() {
        this.populateDropdowns();
        this.bindEvents();
        this.recalculate();
    }

    populateDropdowns() {
        // Materials
        const selMat1 = document.getElementById('mat1Select');
        const selMat2 = document.getElementById('mat2Select');
        if (selMat1 && selMat2) {
            selMat1.innerHTML = '';
            selMat2.innerHTML = '';
            Materials.forEach(m => {
                const opt1 = document.createElement('option');
                opt1.value = m.id;
                opt1.textContent = `[${m.group}] ${m.fullName}`;
                if (m.id === this.state.mat1_id) opt1.selected = true;
                selMat1.appendChild(opt1);

                const opt2 = document.createElement('option');
                opt2.value = m.id;
                opt2.textContent = `[${m.group}] ${m.fullName}`;
                if (m.id === this.state.mat2_id) opt2.selected = true;
                selMat2.appendChild(opt2);
            });
        }

        // Standard Modules
        const selMod = document.getElementById('moduleSelect');
        if (selMod) {
            selMod.innerHTML = '';
            StandardTables.modules.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.val;
                opt.textContent = `${m.val} mm (Dãy ${m.series})`;
                if (m.val === this.state.mn) opt.selected = true;
                selMod.appendChild(opt);
            });
        }
    }

    bindEvents() {
        // Real-time calculation on all numeric inputs
        const inputs = document.querySelectorAll('input[data-key]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.getAttribute('data-key');
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                    this.state[key] = val;
                    this.recalculate();
                }
            });
        });

        // Dropdowns
        const mat1 = document.getElementById('mat1Select');
        if (mat1) {
            mat1.addEventListener('change', (e) => {
                this.state.mat1_id = parseInt(e.target.value);
                this.recalculate();
            });
        }
        const mat2 = document.getElementById('mat2Select');
        if (mat2) {
            mat2.addEventListener('change', (e) => {
                this.state.mat2_id = parseInt(e.target.value);
                this.recalculate();
            });
        }
        const selMod = document.getElementById('moduleSelect');
        if (selMod) {
            selMod.addEventListener('change', (e) => {
                this.state.mn = parseFloat(e.target.value);
                const mnInput = document.querySelector('input[data-key="mn"]');
                if (mnInput) mnInput.value = this.state.mn;
                this.recalculate();
            });
        }

        // Language toggle
        const langVi = document.getElementById('btnLangVi');
        const langEn = document.getElementById('btnLangEn');
        if (langVi && langEn) {
            langVi.addEventListener('click', () => this.setLanguage('vi'));
            langEn.addEventListener('click', () => this.setLanguage('en'));
        }

        // Accordion headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.closest('.calc-section');
                if (parent) {
                    parent.classList.toggle('collapsed');
                }
            });
        });

        // Section 14 solver trigger
        const btnSolve = document.getElementById('btnSolveAw');
        if (btnSolve) {
            btnSolve.addEventListener('click', () => {
                this.solveCenterDistance();
            });
        }

        // Reset button
        const btnReset = document.getElementById('btnResetDefaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.resetDefaults();
            });
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        const dict = I18N[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (dict[k]) {
                el.textContent = dict[k];
            }
        });
        const langVi = document.getElementById('btnLangVi');
        const langEn = document.getElementById('btnLangEn');
        if (langVi && langEn) {
            langVi.classList.toggle('btn-primary', lang === 'vi');
            langVi.classList.toggle('btn-secondary', lang !== 'vi');
            langEn.classList.toggle('btn-primary', lang === 'en');
            langEn.classList.toggle('btn-secondary', lang !== 'en');
        }
    }

    recalculate() {
        const s = this.state;
        const mat1 = Materials.find(m => m.id === s.mat1_id) || Materials[0];
        const mat2 = Materials.find(m => m.id === s.mat2_id) || Materials[0];

        // 1. Geometry
        const geom = GearGeometry.calculate({
            mn: s.mn,
            z1: s.z1,
            z2: s.z2,
            alfa_n: s.alfa_n,
            beta: s.beta,
            b1: s.b1,
            b2: s.b2,
            x1: s.x1,
            x2: s.x2,
            target_i: s.target_i,
            ha0: s.ha0,
            hf0: s.hf0,
            ra0: s.ra0,
            ca_star: s.ca_star
        });

        // 2. Forces & Thermal
        const forces = GearForces.calculate(geom, {
            Pw: s.Pw,
            n1: s.n1,
            Tair: s.Tair,
            Toil: s.Toil,
            kt: s.kt,
            shaftRm: s.shaftRm
        });

        // 3. ISO 6336 Rating
        const rating = GearStrengthISO.calculate(geom, forces, mat1, mat2, {
            KA: s.KA,
            KAS: s.KAS,
            Lh: s.Lh,
            accuracyGrade: s.accuracyGrade,
            mountingType: s.mountingType,
            SH_req: s.SH_req,
            SF_req: s.SF_req
        });

        this.calcResults = { geom, forces, rating, mat1, mat2 };

        // 4. Update UI Displays
        this.updateDisplays(geom, forces, rating, mat1, mat2);

        // 5. Update 2D Canvas
        if (this.canvasController) {
            this.canvasController.setGeometry(geom);
        }
    }

    updateDisplays(geom, forces, rating, mat1, mat2) {
        const setVal = (id, val, decimals = 2) => {
            const el = document.getElementById(id);
            if (el) {
                if (typeof val === 'number') {
                    el.textContent = val.toFixed(decimals);
                } else {
                    el.textContent = val !== undefined && val !== null ? val : '';
                }
            }
        };

        // Executive Banner
        const badge = document.getElementById('execStatusBadge');
        const indicator = document.getElementById('execStatusIndicator');
        const statusText = document.getElementById('execStatusText');
        if (badge && indicator && statusText) {
            if (rating.isSafe) {
                indicator.className = 'status-indicator status-safe';
                statusText.textContent = I18N[this.currentLang].summary_safe;
                statusText.className = 'val-green';
            } else {
                indicator.className = 'status-indicator status-danger';
                statusText.textContent = I18N[this.currentLang].summary_danger;
                statusText.className = 'val-red';
            }
        }

        setVal('summarySH', rating.minSH, 2);
        setVal('summarySF', rating.minSF, 2);
        setVal('summaryAw', geom.aw, 3);
        setVal('summaryRatio', geom.actual_i, 3);

        const shEl = document.getElementById('summarySH');
        if (shEl) shEl.className = rating.minSH >= rating.SH_req ? 'metric-value val-green' : 'metric-value val-red';
        const sfEl = document.getElementById('summarySF');
        if (sfEl) sfEl.className = rating.minSF >= rating.SF_req ? 'metric-value val-green' : 'metric-value val-red';

        // Section 1 Outputs
        setVal('out_n2', forces.n2, 1);
        setVal('out_Mk1', forces.Mk1, 2);
        setVal('out_Mk2', forces.Mk2, 2);
        setVal('out_i_actual', geom.actual_i, 3);
        setVal('out_i_dev', geom.ratio_deviation, 2);

        // Section 4 Outputs
        setVal('out_mt', geom.mt, 4);
        setVal('out_d1', geom.d1, 3);
        setVal('out_d2', geom.d2, 3);
        setVal('out_aw_sec4', geom.aw, 3);

        // Section 5 Outputs
        setVal('out_sumX', geom.sumX, 4);
        setVal('out_sa1_star', geom.sa1_star, 4);
        setVal('out_sa2_star', geom.sa2_star, 4);
        setVal('out_thetaSum', geom.thetaSum, 4);

        // Section 6 Outputs (Basic Dimensions)
        setVal('out_p', geom.p_n, 3);
        setVal('out_pt', geom.pt, 3);
        setVal('out_ptb', geom.ptb, 3);
        setVal('out_a_ref', geom.a, 3);
        setVal('out_av', geom.av, 3);
        setVal('out_aw', geom.aw, 3);
        setVal('out_alfat', geom.alfat, 4);
        setVal('out_alfawt', geom.alfawt, 4);
        setVal('out_betab', geom.betab, 4);
        setVal('out_da1', geom.da1, 3);
        setVal('out_da2', geom.da2, 3);
        setVal('out_db1', geom.db1, 3);
        setVal('out_db2', geom.db2, 3);
        setVal('out_df1', geom.df1, 3);
        setVal('out_df2', geom.df2, 3);
        setVal('out_dw1', geom.dw1, 3);
        setVal('out_dw2', geom.dw2, 3);
        setVal('out_ha1', geom.ha1, 3);
        setVal('out_ha2', geom.ha2, 3);
        setVal('out_hf1', geom.hf1, 3);
        setVal('out_hf2', geom.hf2, 3);
        setVal('out_sn1', geom.sn1, 4);
        setVal('out_sn2', geom.sn2, 4);

        // Section 7 (Contact Ratios)
        setVal('out_ea', geom.epsilon_A, 4);
        setVal('out_eb', geom.epsilon_B, 4);
        setVal('out_eg', geom.epsilon_G, 4);
        setVal('out_zn1', geom.zn1, 2);
        setVal('out_zn2', geom.zn2, 2);
        setVal('out_zmin1', geom.zmin_permissible1, 0);
        setVal('out_zmin2', geom.zmin_permissible2, 0);

        // Section 9 & 10 (Rating & Safety Factors)
        setVal('out_Kv', rating.Kv, 3);
        setVal('out_KHbeta', rating.KHbeta, 3);
        setVal('out_KFbeta', rating.KFbeta, 3);
        setVal('out_KHalfa', rating.KHalfa, 3);
        setVal('out_KH', rating.KH, 3);
        setVal('out_KF', rating.KF, 3);
        setVal('out_ZE', rating.ZE, 2);
        setVal('out_ZH', rating.ZH, 3);
        setVal('out_Zeps', rating.Zeps, 3);
        setVal('out_SigmaH0', rating.SigmaH0, 2);
        setVal('out_SigmaH1', rating.SigmaH_1, 2);
        setVal('out_SigmaH2', rating.SigmaH_2, 2);
        setVal('out_SigmaHG1', rating.SigmaHG_1, 2);
        setVal('out_SigmaHG2', rating.SigmaHG_2, 2);
        setVal('out_SH1', rating.SH1, 2);
        setVal('out_SH2', rating.SH2, 2);

        setVal('out_YF1', rating.YF1, 3);
        setVal('out_YF2', rating.YF2, 3);
        setVal('out_YS1', rating.YS1, 3);
        setVal('out_YS2', rating.YS2, 3);
        setVal('out_Ybeta', rating.Ybeta, 3);
        setVal('out_SigmaF01', rating.SigmaF0_1, 2);
        setVal('out_SigmaF02', rating.SigmaF0_2, 2);
        setVal('out_SigmaF1', rating.SigmaF_1, 2);
        setVal('out_SigmaF2', rating.SigmaF_2, 2);
        setVal('out_SigmaFG1', rating.SigmaFG_1, 2);
        setVal('out_SigmaFG2', rating.SigmaFG_2, 2);
        setVal('out_SF1', rating.SF1, 2);
        setVal('out_SF2', rating.SF2, 2);

        // Section 12 (Forces)
        setVal('out_Ft', forces.Ft, 1);
        setVal('out_Fa', forces.Fa, 1);
        setVal('out_Fr', forces.Fr, 1);
        setVal('out_Fn', forces.Fn, 1);
        setVal('out_Mo1', forces.Mo1, 2);
        setVal('out_Mo2', forces.Mo2, 2);
        setVal('out_v', forces.v, 2);
        setVal('out_wt', forces.wt, 2);
        setVal('out_eta', forces.eta * 100.0, 1);

        // Section 15 & 16 (Thermal & Shaft)
        setVal('out_Ploss', forces.Ploss, 2);
        setVal('out_Abox', forces.Abox, 2);
        setVal('out_dsh1', forces.dsh1_min, 1);
        setVal('out_dsh2', forces.dsh2_min, 1);
    }

    solveCenterDistance() {
        const inpAw = document.getElementById('inpAwReq');
        const aw_target = inpAw ? parseFloat(inpAw.value) : this.state.aw_req;

        const solutions = CenterDistanceSolver.findSolutions({
            aw_req: aw_target,
            target_i: this.state.target_i,
            mn: this.state.mn,
            alfa_n: this.state.alfa_n,
            beta: this.state.beta
        });

        const tbody = document.getElementById('solutionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (solutions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:1rem; color:var(--accent-yellow)">Không tìm thấy phương án ăn khớp khả thi với khoảng cách trục ${aw_target} mm. Hãy thử thay đổi module mn hoặc góc nghiêng beta.</td></tr>`;
            return;
        }

        solutions.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:center">#${s.id}</td>
                <td style="font-weight:700; color:var(--accent-cyan); text-align:center">${s.z1}</td>
                <td style="font-weight:700; color:var(--accent-cyan); text-align:center">${s.z2}</td>
                <td style="text-align:right">${s.actual_i}</td>
                <td style="text-align:right; color:${Math.abs(s.deviation_i) < 1.0 ? 'var(--accent-green)' : 'var(--accent-yellow)'}">${s.deviation_i > 0 ? '+' : ''}${s.deviation_i}%</td>
                <td style="text-align:right">${s.sumX}</td>
                <td style="text-align:right">${s.alfawt}°</td>
                <td style="text-align:center">
                    <button class="btn btn-secondary btn-sm apply-sol-btn" data-z1="${s.z1}" data-z2="${s.z2}" data-x1="${s.x1}" data-x2="${s.x2}">Áp Dụng</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind apply buttons
        tbody.querySelectorAll('.apply-sol-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const z1 = parseInt(e.target.getAttribute('data-z1'));
                const z2 = parseInt(e.target.getAttribute('data-z2'));
                const x1 = parseFloat(e.target.getAttribute('data-x1'));
                const x2 = parseFloat(e.target.getAttribute('data-x2'));

                this.state.z1 = z1;
                this.state.z2 = z2;
                this.state.x1 = x1;
                this.state.x2 = x2;

                const inpZ1 = document.querySelector('input[data-key="z1"]');
                const inpZ2 = document.querySelector('input[data-key="z2"]');
                const inpX1 = document.querySelector('input[data-key="x1"]');
                const inpX2 = document.querySelector('input[data-key="x2"]');
                if (inpZ1) inpZ1.value = z1;
                if (inpZ2) inpZ2.value = z2;
                if (inpX1) inpX1.value = x1;
                if (inpX2) inpX2.value = x2;

                this.recalculate();
                alert(`Đã áp dụng phương án: z1=${z1}, z2=${z2}, x1=${x1}, x2=${x2}!`);
            });
        });
    }

    resetDefaults() {
        this.state = {
            Pw: 100.0,
            n1: 1000.0,
            target_i: 2.50,
            mat1_id: 35,
            mat2_id: 35,
            KA: 1.00,
            mountingType: 'A',
            accuracyGrade: 7,
            KAS: 2.0,
            Lh: 20000,
            SH_req: 1.30,
            SF_req: 1.60,
            ha0: 1.25,
            hf0: 1.00,
            ra0: 0.38,
            ca_star: 0.25,
            z1: 19,
            z2: 48,
            alfa_n: 20.0,
            beta: 0.0,
            mn: 6.0,
            b1: 120.0,
            b2: 117.0,
            x1: 0.0,
            x2: 0.0,
            aw_req: 201.0,
            Tair: 20.0,
            Toil: 60.0,
            kt: 12.0,
            shaftRm: 500.0
        };

        // Update all input elements
        Object.keys(this.state).forEach(k => {
            const el = document.querySelector(`input[data-key="${k}"]`);
            if (el) el.value = this.state[k];
        });

        this.populateDropdowns();
        this.recalculate();
    }
}
