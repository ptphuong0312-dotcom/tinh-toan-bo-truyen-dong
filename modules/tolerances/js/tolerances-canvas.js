/**
 * TOLERANCES & FITS 2D CANVAS VISUALIZER
 * Biểu đồ Miền Dung Sai & Mối Lắp Ghép (Tolerance Zones Diagram)
 * Đồ họa động thời gian thực chuẩn 2D CAD
 */

(function (window) {
    'use strict';

    class TolerancesVisualizer {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            // Virtual resolution
            this.vWidth = 1200;
            this.vHeight = 650;

            // Pan & Zoom state
            this.scale = 1.0;
            this.offsetX = 0;
            this.offsetY = 0;

            // Current fit data
            this.fitData = null;

            // Touch & Drag state
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.initialPinchDistance = null;

            this.initEvents();
        }

        initEvents() {
            if (!this.canvas) return;

            // Mouse pan
            this.canvas.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
            });

            window.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - this.dragStartX;
                const dy = e.clientY - this.dragStartY;
                this.offsetX += dx;
                this.offsetY += dy;
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.render();
            });

            window.addEventListener('mouseup', () => {
                this.isDragging = false;
            });

            // Wheel zoom
            this.canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                this.scale = Math.max(0.3, Math.min(5.0, this.scale * zoomFactor));
                this.render();
            }, { passive: false });

            // Touch events (Mobile multi-touch engine)
            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.dragStartX = e.touches[0].clientX;
                    this.dragStartY = e.touches[0].clientY;
                } else if (e.touches.length === 2) {
                    this.isDragging = false;
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this.initialPinchDistance = Math.hypot(dx, dy);
                }
            }, { passive: true });

            this.canvas.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && this.isDragging) {
                    const dx = e.touches[0].clientX - this.dragStartX;
                    const dy = e.touches[0].clientY - this.dragStartY;
                    this.offsetX += dx;
                    this.offsetY += dy;
                    this.dragStartX = e.touches[0].clientX;
                    this.dragStartY = e.touches[0].clientY;
                    this.render();
                } else if (e.touches.length === 2 && this.initialPinchDistance) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const currentDist = Math.hypot(dx, dy);
                    const factor = currentDist / this.initialPinchDistance;
                    this.scale = Math.max(0.3, Math.min(5.0, this.scale * factor));
                    this.initialPinchDistance = currentDist;
                    this.render();
                }
            }, { passive: true });

            this.canvas.addEventListener('touchend', () => {
                this.isDragging = false;
                this.initialPinchDistance = null;
            });
        }

        resetView() {
            this.scale = 1.0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.render();
        }

        zoomIn() {
            this.scale = Math.min(5.0, this.scale * 1.25);
            this.render();
        }

        zoomOut() {
            this.scale = Math.max(0.3, this.scale / 1.25);
            this.render();
        }

        downloadPNG() {
            if (!this.canvas) return;
            const link = document.createElement('a');
            const fitName = this.fitData && this.fitData.fit ? this.fitData.fit.name.replace('/', '_') : 'Fit';
            link.download = `Bieu_do_dung_sai_${fitName}.png`;
            link.href = this.canvas.toDataURL('image/png');
            link.click();
        }

        updateData(fitData) {
            this.fitData = fitData;
            this.render();
        }

        render() {
            if (!this.canvas || !this.ctx) return;
            const ctx = this.ctx;

            // Clear background
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Background Grid (Engineering dark theme)
            ctx.fillStyle = '#0b1329';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (!this.fitData || !this.fitData.hole || !this.fitData.shaft) {
                ctx.fillStyle = '#64748b';
                ctx.font = '16px Segoe UI, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Chưa có dữ liệu mối lắp ghép', this.canvas.width / 2, this.canvas.height / 2);
                return;
            }

            const w = this.canvas.width;
            const h = this.canvas.height;

            const ES = this.fitData.hole.ES;
            const EI = this.fitData.hole.EI;
            const es = this.fitData.shaft.es;
            const ei = this.fitData.shaft.ei;

            // Max span in µm
            const maxVal = Math.max(ES, EI, es, ei, 0);
            const minVal = Math.min(ES, EI, es, ei, 0);
            const totalSpan = Math.max(40, maxVal - minVal);

            // Auto-scale vertical pixels per µm
            const availableHeight = h * 0.55 * this.scale;
            const pxPerUm = availableHeight / totalSpan;

            // Zero Line Y
            const zeroY = h / 2 + this.offsetY + ((maxVal + minVal) / 2) * pxPerUm;

            ctx.save();

            // 1. Draw Background coordinate grid
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // 2. Draw Zero Line (Đường không 0)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(60, zeroY);
            ctx.lineTo(w - 60, zeroY);
            ctx.stroke();

            // Label Zero Line
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 12px Segoe UI, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Đường 0', 70, zeroY - 6);
            ctx.fillText(`Kích thước danh nghĩa d = D = ${this.fitData.D} mm`, w - 380, zeroY - 8);

            // 3. Ruler Ticks on the left
            ctx.strokeStyle = '#475569';
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px Segoe UI, sans-serif';
            ctx.textAlign = 'right';

            const niceStep = totalSpan > 200 ? 50 : (totalSpan > 80 ? 20 : 10);
            const startTick = Math.floor(minVal / niceStep) * niceStep;
            const endTick = Math.ceil(maxVal / niceStep) * niceStep;

            for (let val = startTick; val <= endTick; val += niceStep) {
                const y = zeroY - val * pxPerUm;
                if (y >= 40 && y <= h - 40) {
                    ctx.beginPath();
                    ctx.moveTo(110, y);
                    ctx.lineTo(130, y);
                    ctx.stroke();
                    if (val !== 0) {
                        ctx.fillText(`${val > 0 ? '+' : ''}${val} µm`, 105, y + 4);
                    }
                }
            }

            // Vertical axis line
            ctx.beginPath();
            ctx.moveTo(130, 40);
            ctx.lineTo(130, h - 40);
            ctx.stroke();

            // 4. Draw Hole Tolerance Zone (Lỗ - Cyan)
            const holeX = w * 0.35 + this.offsetX;
            const blockWidth = 140 * this.scale;

            const holeTopY = zeroY - ES * pxPerUm;
            const holeBottomY = zeroY - EI * pxPerUm;
            const holeHeight = holeBottomY - holeTopY;

            // Fill Hole Block
            ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2;
            ctx.fillRect(holeX, holeTopY, blockWidth, holeHeight);
            ctx.strokeRect(holeX, holeTopY, blockWidth, holeHeight);

            // Hole Hatching Lines (45 deg)
            ctx.save();
            ctx.beginPath();
            ctx.rect(holeX, holeTopY, blockWidth, holeHeight);
            ctx.clip();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
            ctx.lineWidth = 1;
            for (let x = holeX - holeHeight; x < holeX + blockWidth + holeHeight; x += 12) {
                ctx.beginPath();
                ctx.moveTo(x, holeBottomY);
                ctx.lineTo(x + holeHeight, holeTopY);
                ctx.stroke();
            }
            ctx.restore();

            // Hole Labels
            ctx.fillStyle = '#22d3ee';
            ctx.font = 'bold 18px Segoe UI, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`LỖ ${this.fitData.hole.symbol}`, holeX + blockWidth / 2, holeTopY + holeHeight / 2 + 6);

            // ES label
            ctx.font = 'bold 12px Segoe UI, sans-serif';
            ctx.fillStyle = '#67e8f9';
            ctx.textAlign = 'right';
            ctx.fillText(`ES = ${ES > 0 ? '+' : ''}${ES} µm`, holeX - 10, holeTopY + 4);
            ctx.beginPath();
            ctx.moveTo(holeX - 6, holeTopY);
            ctx.lineTo(holeX, holeTopY);
            ctx.stroke();

            // EI label
            ctx.fillText(`EI = ${EI > 0 ? '+' : ''}${EI} µm`, holeX - 10, holeBottomY + 4);
            ctx.beginPath();
            ctx.moveTo(holeX - 6, holeBottomY);
            ctx.lineTo(holeX, holeBottomY);
            ctx.stroke();

            // 5. Draw Shaft Tolerance Zone (Trục - Amber/Orange)
            const shaftX = w * 0.55 + this.offsetX;
            const shaftTopY = zeroY - es * pxPerUm;
            const shaftBottomY = zeroY - ei * pxPerUm;
            const shaftHeight = shaftBottomY - shaftTopY;

            // Fill Shaft Block
            ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.fillRect(shaftX, shaftTopY, blockWidth, shaftHeight);
            ctx.strokeRect(shaftX, shaftTopY, blockWidth, shaftHeight);

            // Shaft Hatching Lines (-45 deg)
            ctx.save();
            ctx.beginPath();
            ctx.rect(shaftX, shaftTopY, blockWidth, shaftHeight);
            ctx.clip();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.lineWidth = 1;
            for (let x = shaftX - shaftHeight; x < shaftX + blockWidth + shaftHeight; x += 12) {
                ctx.beginPath();
                ctx.moveTo(x, shaftTopY);
                ctx.lineTo(x + shaftHeight, shaftBottomY);
                ctx.stroke();
            }
            ctx.restore();

            // Shaft Labels
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 18px Segoe UI, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`TRỤC ${this.fitData.shaft.symbol}`, shaftX + blockWidth / 2, shaftTopY + shaftHeight / 2 + 6);

            // es label
            ctx.font = 'bold 12px Segoe UI, sans-serif';
            ctx.fillStyle = '#fde68a';
            ctx.textAlign = 'left';
            ctx.fillText(`es = ${es > 0 ? '+' : ''}${es} µm`, shaftX + blockWidth + 10, shaftTopY + 4);
            ctx.beginPath();
            ctx.moveTo(shaftX + blockWidth, shaftTopY);
            ctx.lineTo(shaftX + blockWidth + 6, shaftTopY);
            ctx.stroke();

            // ei label
            ctx.fillText(`ei = ${ei > 0 ? '+' : ''}${ei} µm`, shaftX + blockWidth + 10, shaftBottomY + 4);
            ctx.beginPath();
            ctx.moveTo(shaftX + blockWidth, shaftBottomY);
            ctx.lineTo(shaftX + blockWidth + 6, shaftBottomY);
            ctx.stroke();

            // 6. Draw Fit Dimensions (Arrows for S_max, S_min or N_max, N_min)
            const fit = this.fitData.fit;
            const arrow1X = shaftX + blockWidth + 105;
            const arrow2X = shaftX + blockWidth + 195;

            if (fit.type === 'Clearance') {
                // S_max = ES - ei
                this.drawDimArrow(ctx, arrow1X, holeTopY, shaftBottomY, `S_max = ${fit.S_max} µm`, '#34d399');
                // S_min = EI - es
                this.drawDimArrow(ctx, arrow2X, holeBottomY, shaftTopY, `S_min = ${fit.S_min} µm`, '#38bdf8');
            } else if (fit.type === 'Interference') {
                // N_max = es - EI
                this.drawDimArrow(ctx, arrow1X, shaftTopY, holeBottomY, `N_max = ${fit.N_max} µm`, '#f87171');
                // N_min = ei - ES
                this.drawDimArrow(ctx, arrow2X, shaftBottomY, holeTopY, `N_min = ${fit.N_min} µm`, '#fbbf24');
            } else {
                // Transition: S_max and N_max
                this.drawDimArrow(ctx, arrow1X, holeTopY, shaftBottomY, `S_max = ${fit.S_max} µm`, '#34d399');
                this.drawDimArrow(ctx, arrow2X, shaftTopY, holeBottomY, `N_max = ${fit.N_max} µm`, '#f87171');
            }

            // Header info box
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#334155';
            ctx.fillRect(w - 290, 20, 270, 110);
            ctx.strokeRect(w - 290, 20, 270, 110);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 15px Segoe UI, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`Mối ghép: ${fit.name}`, w - 275, 45);

            ctx.font = '13px Segoe UI, sans-serif';
            ctx.fillStyle = fit.type === 'Clearance' ? '#34d399' : (fit.type === 'Interference' ? '#f87171' : '#fbbf24');
            ctx.fillText(`Bản chất: ${fit.typeName}`, w - 275, 68);

            ctx.fillStyle = '#cbd5e1';
            if (fit.type === 'Clearance') {
                ctx.fillText(`S_max = ${fit.S_max} µm (${fit.S_max_mm} mm)`, w - 275, 90);
                ctx.fillText(`S_min = ${fit.S_min} µm (${fit.S_min_mm} mm)`, w - 275, 110);
            } else if (fit.type === 'Interference') {
                ctx.fillText(`N_max = ${fit.N_max} µm (${fit.N_max_mm} mm)`, w - 275, 90);
                ctx.fillText(`N_min = ${fit.N_min} µm (${fit.N_min_mm} mm)`, w - 275, 110);
            } else {
                ctx.fillText(`S_max = ${fit.S_max} µm | N_max = ${fit.N_max} µm`, w - 275, 90);
                ctx.fillText(`Dung sai ghép T_fit = ${fit.T_fit} µm`, w - 275, 110);
            }

            ctx.restore();
        }

        drawDimArrow(ctx, x, y1, y2, text, color) {
            if (Math.abs(y1 - y2) < 2) return;
            const topY = Math.min(y1, y2);
            const bottomY = Math.max(y1, y2);

            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1.5;

            // Leader lines
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(x - 20, topY);
            ctx.lineTo(x + 5, topY);
            ctx.moveTo(x - 20, bottomY);
            ctx.lineTo(x + 5, bottomY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Main vertical line
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.stroke();

            // Arrows
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x - 4, topY + 8);
            ctx.lineTo(x + 4, topY + 8);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x, bottomY);
            ctx.lineTo(x - 4, bottomY - 8);
            ctx.lineTo(x + 4, bottomY - 8);
            ctx.closePath();
            ctx.fill();

            // Label
            ctx.font = 'bold 11px Segoe UI, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(text, x + 8, (topY + bottomY) / 2 + 4);
            ctx.restore();
        }
    }

    /**
     * THERMAL FIT & DEFORMATION 2D CANVAS VISUALIZER (DIN 7190)
     * Trực quan hóa mặt cắt kỹ thuật mối ghép nung nóng và biến dạng dôi sau khi nguội
     */
    class ThermalFitVisualizer {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            this.vWidth = 1200;
            this.vHeight = 440;

            this.scale = 1.0;
            this.offsetX = 0;
            this.offsetY = 0;

            this.mode = 'hot'; // 'hot' (Lắp ráp nung nóng) hoặc 'cold' (Sau khi ghép nguội)
            this.data = null;

            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.initialPinchDistance = null;

            this.initEvents();
        }

        initEvents() {
            if (!this.canvas) return;

            this.canvas.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
            });

            window.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - this.dragStartX;
                const dy = e.clientY - this.dragStartY;
                this.offsetX += dx;
                this.offsetY += dy;
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.render();
            });

            window.addEventListener('mouseup', () => {
                this.isDragging = false;
            });

            this.canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                this.scale = Math.max(0.4, Math.min(4.0, this.scale * zoomFactor));
                this.render();
            }, { passive: false });

            // Touch events
            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.dragStartX = e.touches[0].clientX;
                    this.dragStartY = e.touches[0].clientY;
                } else if (e.touches.length === 2) {
                    this.isDragging = false;
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this.initialPinchDistance = Math.hypot(dx, dy);
                }
            }, { passive: true });

            this.canvas.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && this.isDragging) {
                    const dx = e.touches[0].clientX - this.dragStartX;
                    const dy = e.touches[0].clientY - this.dragStartY;
                    this.offsetX += dx;
                    this.offsetY += dy;
                    this.dragStartX = e.touches[0].clientX;
                    this.dragStartY = e.touches[0].clientY;
                    this.render();
                } else if (e.touches.length === 2 && this.initialPinchDistance) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const currentDist = Math.hypot(dx, dy);
                    const factor = currentDist / this.initialPinchDistance;
                    this.scale = Math.max(0.4, Math.min(4.0, this.scale * factor));
                    this.initialPinchDistance = currentDist;
                    this.render();
                }
            }, { passive: true });

            this.canvas.addEventListener('touchend', () => {
                this.isDragging = false;
                this.initialPinchDistance = null;
            });
        }

        setMode(mode) {
            this.mode = mode;
            this.render();
        }

        updateData(data) {
            this.data = data;
            this.render();
        }

        resetView() {
            this.scale = 1.0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.render();
        }

        zoomIn() {
            this.scale = Math.min(4.0, this.scale * 1.2);
            this.render();
        }

        zoomOut() {
            this.scale = Math.max(0.4, this.scale / 1.2);
            this.render();
        }

        downloadPNG() {
            if (!this.canvas) return;
            const link = document.createElement('a');
            link.download = `MITCalc_Thermal_Fit_${this.mode}_d${this.data?.d || 50}.png`;
            link.href = this.canvas.toDataURL('image/png');
            link.click();
        }

        render() {
            if (!this.canvas || !this.ctx) return;
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;

            // Xóa nền kỹ thuật Dark Slate
            ctx.fillStyle = '#0b1120';
            ctx.fillRect(0, 0, w, h);

            // Vẽ lưới tọa độ CAD mờ
            this.drawGrid(ctx, w, h);

            if (!this.data) {
                ctx.fillStyle = '#64748b';
                ctx.font = '16px Segoe UI, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Đang chờ nạp thông số tính toán nhiệt độ & biến dạng...', w / 2, h / 2);
                return;
            }

            ctx.save();
            // Tịnh tiến vào tâm và áp dụng Pan/Zoom
            ctx.translate(w / 2 + this.offsetX, h / 2 + this.offsetY);
            ctx.scale(this.scale, this.scale);

            const d = this.data.d;
            const D = this.data.D_hub;
            const d0 = this.data.d0_shaft;
            const isHot = (this.mode === 'hot');

            // Tỉ lệ vẽ tự động fit vào bán kính 160px
            const maxR = D / 2.0;
            const baseScale = 150.0 / Math.max(maxR, 20);

            const rHubOuter = (D / 2.0) * baseScale;
            const rShaftOuter = (d / 2.0) * baseScale;
            const rShaftInner = (d0 / 2.0) * baseScale;

            // Khe hở phóng đại khi nung nóng để mắt thường nhìn thấy rõ
            const gapVisual = isHot ? Math.max(12, rShaftOuter * 0.12) : 0;
            const rHubInner = rShaftOuter + gapVisual;

            // 1. Vẽ Thân Moay-ơ (Hub)
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, rHubOuter, 0, Math.PI * 2, false);
            ctx.arc(0, 0, rHubInner, 0, Math.PI * 2, true);
            ctx.closePath();

            if (isHot) {
                // Gradient rực đỏ lửa thể hiện nung nhiệt
                const gradH = ctx.createRadialGradient(0, 0, rHubInner, 0, 0, rHubOuter);
                gradH.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
                gradH.addColorStop(0.6, 'rgba(249, 115, 22, 0.40)');
                gradH.addColorStop(1, 'rgba(185, 28, 28, 0.50)');
                ctx.fillStyle = gradH;
                ctx.fill();

                ctx.strokeStyle = '#f87171';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            } else {
                // Màu Cyan kim loại nguội
                ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
                ctx.fill();

                ctx.strokeStyle = '#06b6d4';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
            ctx.restore();

            // 2. Vẽ Thân Trục (Shaft)
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, rShaftOuter, 0, Math.PI * 2, false);
            if (d0 > 0) {
                ctx.arc(0, 0, rShaftInner, 0, Math.PI * 2, true);
            }
            ctx.closePath();

            if (isHot) {
                // Trục ở nhiệt độ thường hoặc làm lạnh
                ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
                ctx.fill();
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Trục ép chặt màu hổ phách
                ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
                ctx.fill();
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.restore();

            // Nếu trục rỗng: vẽ viền lỗ trong
            if (d0 > 0) {
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, rShaftInner, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 3. Đường tâm chữ thập CAD
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 4, 2, 4]);
            ctx.beginPath();
            ctx.moveTo(-rHubOuter - 35, 0);
            ctx.lineTo(rHubOuter + 35, 0);
            ctx.moveTo(0, -rHubOuter - 35);
            ctx.lineTo(0, rHubOuter + 35);
            ctx.stroke();
            ctx.setLineDash([]);

            // 4. Kích thước và chỉ dẫn kỹ thuật
            if (isHot) {
                // Chỉ dẫn khe hở lắp lọt an toàn c
                const arrowX = rShaftOuter + gapVisual / 2;
                ctx.strokeStyle = '#34d399';
                ctx.fillStyle = '#34d399';
                ctx.lineWidth = 2;

                // Mũi tên chỉ khe hở
                ctx.beginPath();
                ctx.moveTo(rShaftOuter, -15);
                ctx.lineTo(rHubInner, -15);
                ctx.stroke();

                // Vạch giới hạn
                ctx.beginPath();
                ctx.moveTo(rShaftOuter, -22);
                ctx.lineTo(rShaftOuter, -8);
                ctx.moveTo(rHubInner, -22);
                ctx.lineTo(rHubInner, -8);
                ctx.stroke();

                // Text khe hở
                ctx.font = 'bold 12px Segoe UI, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`Khe hở lọt an toàn c = ${this.data.c.toFixed(1)} µm`, (rShaftOuter + rHubInner) / 2, -30);

                // Nhãn nhiệt độ nung
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 14px Segoe UI, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`🔥 Nhiệt độ Moay-ơ: T_hub = ${this.data.scenario_H.T_H} °C`, rHubOuter + 25, -60);

                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 13px Segoe UI, sans-serif';
                ctx.fillText(`❄️ Hoặc làm lạnh Trục: T_shaft = ${this.data.scenario_S.T_S} °C`, rHubOuter + 25, -35);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '12px Segoe UI, sans-serif';
                ctx.fillText(`Độ giãn nở lỗ yêu cầu: Δd = ${this.data.delta_d_req_um.toFixed(1)} µm`, rHubOuter + 25, -12);

            } else {
                // Trạng thái nguội sau ép: Thể hiện độ giãn nở ngoài và co hẹp trong
                ctx.fillStyle = '#06b6d4';
                ctx.font = 'bold 13px Segoe UI, sans-serif';
                ctx.textAlign = 'left';

                // Mũi tên chỉ nở đường kính ngoài ΔD
                ctx.fillText(`📈 Nở ngoài Moay-ơ: ΔD = +${this.data.delta_D.toFixed(1)} µm (D' = ${this.data.D_act} mm)`, rHubOuter + 25, -55);
                ctx.fillStyle = '#f59e0b';
                ctx.fillText(`⚡ Áp suất tiếp xúc: p = ${this.data.p} MPa`, rHubOuter + 25, -30);

                if (d0 > 0) {
                    ctx.fillStyle = '#a855f7';
                    ctx.fillText(`📉 Co hẹp lỗ trục rỗng: Δd₀ = -${this.data.delta_d0.toFixed(1)} µm (d₀' = ${this.data.d0_act} mm)`, rHubOuter + 25, -5);
                }

                ctx.fillStyle = '#10b981';
                ctx.font = '12px Segoe UI, sans-serif';
                ctx.fillText(`Độ dôi hiệu dụng: U_eff = ${this.data.U_eff.toFixed(1)} µm`, rHubOuter + 25, d0 > 0 ? 18 : -5);

                // Vòng nét đứt đỏ mỏng biểu diễn mặt tiếp xúc ép căng
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, rShaftOuter, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Ghi chú đường kính danh nghĩa d
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 13px Segoe UI, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Ø ${d} mm`, 0, rShaftOuter / 2);

            ctx.restore();

            // Tiêu đề trạng thái góc trên bên trái
            ctx.save();
            ctx.fillStyle = isHot ? '#f97316' : '#06b6d4';
            ctx.font = 'bold 14px Segoe UI, sans-serif';
            ctx.textAlign = 'left';
            const modeTitle = isHot 
                ? '🔥 TRẠNG THÁI NUNG NÓNG (ASSEMBLY STATE) - LỖ NỞ RỘNG TẠO KHE HỞ LỌT AN TOÀN'
                : '❄️ TRẠNG THÁI NGUỘI SAU ÉP (SHRINK FIT STATE) - ÁP SUẤT TIẾP XÚC & BIẾN DẠNG DÔI';
            ctx.fillText(modeTitle, 25, 30);
            ctx.restore();
        }

        drawGrid(ctx, w, h) {
            ctx.save();
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
            ctx.lineWidth = 1;
            const step = 40;
            for (let x = 0; x < w; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    window.TolerancesVisualizer = TolerancesVisualizer;
    window.ThermalFitVisualizer = ThermalFitVisualizer;

})(typeof window !== 'undefined' ? window : this);
