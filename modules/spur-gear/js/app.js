/**
 * MITCalc Web App - Application Entry Point & Bootstrapper
 */

import { GearCanvas } from './ui/gear-canvas.js';
import { UIController } from './ui/ui-controller.js';
import { Materials } from './data/materials.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 2D Canvas
    const canvasEl = document.getElementById('gearCanvas');
    let gearCanvas = null;
    if (canvasEl) {
        // Set dynamic resolution
        canvasEl.width = canvasEl.parentElement.clientWidth || 900;
        canvasEl.height = 650;
        gearCanvas = new GearCanvas(canvasEl);
    }

    // 2. Initialize UI Controller
    const ui = new UIController(gearCanvas);
    ui.init();

    // 3. Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-target');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });

            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.style.display = 'block';
            }

            // If switching to visualizer, re-render and re-fit canvas
            if (targetId === 'paneVisualizer' && gearCanvas) {
                setTimeout(() => {
                    canvasEl.width = canvasEl.parentElement.clientWidth || 900;
                    gearCanvas.autoFit();
                    gearCanvas.render();
                }, 50);
            }
        });
    });

    // 4. Canvas Animation Controls
    const btnPlayAnim = document.getElementById('btnPlayAnim');
    const btnResetView = document.getElementById('btnResetView');
    if (btnPlayAnim && gearCanvas) {
        btnPlayAnim.addEventListener('click', () => {
            if (gearCanvas.isAnimating) {
                gearCanvas.stopAnimation();
                btnPlayAnim.textContent = '▶ Tiếp Tục Mô Phỏng';
                btnPlayAnim.classList.remove('btn-success');
                btnPlayAnim.classList.add('btn-primary');
            } else {
                gearCanvas.startAnimation();
                btnPlayAnim.textContent = '⏸ Tạm Dừng';
                btnPlayAnim.classList.remove('btn-primary');
                btnPlayAnim.classList.add('btn-success');
            }
        });
    }

    if (btnResetView && gearCanvas) {
        btnResetView.addEventListener('click', () => {
            gearCanvas.autoFit();
            gearCanvas.render();
        });
    }

    // 5. Populate Materials Table in Tab 4
    const matTableBody = document.getElementById('materialsTableBody');
    if (matTableBody) {
        matTableBody.innerHTML = '';
        Materials.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:center; font-weight:700">#${m.id}</td>
                <td><span style="display:inline-block; padding:2px 6px; border-radius:4px; background:#1e293b; color:#38bdf8; font-weight:700; font-size:0.8rem">${m.group}</span></td>
                <td style="font-weight:600">${m.fullName}</td>
                <td>${m.treatment}</td>
                <td style="text-align:right; font-family:monospace">${m.rm}</td>
                <td style="text-align:right; font-family:monospace">${m.rp02}</td>
                <td style="text-align:right; font-family:monospace; color:var(--accent-green)">${m.shlim}</td>
                <td style="text-align:right; font-family:monospace; color:var(--accent-cyan)">${m.sflim}</td>
                <td style="text-align:right; font-family:monospace">${m.surfaceHardnessHV}</td>
                <td style="text-align:center; color:var(--text-secondary)">${m.standards.din || m.standards.iso || '-'}</td>
            `;
            matTableBody.appendChild(tr);
        });
    }

    // 6. Print / Export PDF
    const btnPrint = document.getElementById('btnPrintReport');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    console.log('MITCalc Web App initialized successfully!');
});
