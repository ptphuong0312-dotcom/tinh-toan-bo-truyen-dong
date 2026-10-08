/**
 * 2D CANVAS CAD RENDERING ENGINE: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Hiển thị 2 BẢN VẼ MẶT CẮT KỸ THUẬT CHUẨN CƠ KHÍ (ISO 773 / DIN 6885):
 * 1. Bên Trái: Hình Cắt Lỗ Moay-ơ (Hub Cross-Section) - Kèm kích thước b, t2, Ø Lỗ, và d2
 * 2. Bên Phải: Hình Cắt Trục (Shaft Cross-Section) - Kèm kích thước b, t1, Ø Trục, và d1
 * Hỗ trợ 1, 2, 3, 4 then và cử chỉ cảm ứng chuột & Multi-touch trên Mobile
 */

class KeysCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.jointType = 'parallel'; // 'parallel', 'woodruff', 'spline'

    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    // Multi-touch
    this.initialPinchDistance = null;
    this.currentData = null;

    this.initEvents();
  }

  initEvents() {
    if (!this.canvas) return;

    // Mouse Pan & Zoom
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom(zoomFactor, e.offsetX, e.offsetY);
    }, { passive: false });

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.panX;
        this.startY = e.touches[0].clientY - this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.initialPinchDistance = Math.hypot(dx, dy);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        this.panX = e.touches[0].clientX - this.startX;
        this.panY = e.touches[0].clientY - this.startY;
        this.render();
      } else if (e.touches.length === 2 && this.initialPinchDistance) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const factor = currentDistance / this.initialPinchDistance;
        if (Math.abs(factor - 1) > 0.02) {
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const rect = this.canvas.getBoundingClientRect();
          this.zoom(factor > 1 ? 1.05 : 0.95, midX - rect.left, midY - rect.top);
          this.initialPinchDistance = currentDistance;
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      this.initialPinchDistance = null;
    });
  }

  zoom(factor, centerX, centerY) {
    const newScale = Math.max(0.3, Math.min(8.0, this.scale * factor));
    const cx = centerX !== undefined ? centerX : this.canvas.width / 2;
    const cy = centerY !== undefined ? centerY : this.canvas.height / 2;
    this.panX = cx - (cx - this.panX) * (newScale / this.scale);
    this.panY = cy - (cy - this.panY) * (newScale / this.scale);
    this.scale = newScale;
    this.render();
  }

  resetView() {
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  setData(jointType, data) {
    this.jointType = jointType;
    this.currentData = data;
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    this.drawGrid(ctx, w, h);

    if (!this.currentData) return;

    ctx.save();
    ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
    ctx.scale(this.scale, this.scale);

    if (this.jointType === 'parallel') {
      this.renderParallelKeys(ctx);
    } else if (this.jointType === 'woodruff') {
      this.renderWoodruffKeys(ctx);
    } else if (this.jointType === 'spline') {
      this.renderStraightSplines(ctx);
    }

    ctx.restore();
  }

  drawGrid(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
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

  drawAxes(ctx, cx, cy, radius) {
    ctx.save();
    ctx.strokeStyle = '#ef4444'; // Red centerline
    ctx.lineWidth = 1.2;
    ctx.setLineDash([10, 4, 2, 4]);

    const ext = radius * 1.35;
    ctx.beginPath();
    ctx.moveTo(cx - ext, cy);
    ctx.lineTo(cx + ext, cy);
    ctx.moveTo(cx, cy - ext);
    ctx.lineTo(cx, cy + ext);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Tính các góc đặt then theo số lượng then (1, 2, 3, 4)
   */
  getKeyAngles(numKeys) {
    if (numKeys === 4) {
      // 4 then cách đều 90° (12h, 3h, 6h, 9h)
      return [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    } else if (numKeys === 3) {
      // 3 then cách đều 120°
      return [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 3, -Math.PI / 2 + (4 * Math.PI) / 3];
    } else if (numKeys === 2) {
      // 2 then đối xứng 180° (12h và 6h)
      return [-Math.PI / 2, Math.PI / 2];
    }
    // 1 then ở đỉnh (12h)
    return [-Math.PI / 2];
  }

  /**
   * Vẽ mũi tên chuẩn CAD
   */
  drawCadArrow(ctx, fromX, fromY, toX, toY, headLength = 7, headWidth = 2.8) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;
    const ux = dx / len;
    const uy = dy / len;

    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * ux + headWidth * uy, toY - headLength * uy - headWidth * ux);
    ctx.lineTo(toX - headLength * 0.75 * ux, toY - headLength * 0.75 * uy);
    ctx.lineTo(toX - headLength * ux - headWidth * uy, toY - headLength * uy + headWidth * ux);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Đường kích thước kỹ thuật với 2 mũi tên CAD và nhãn giá trị
   */
  drawLinearDimension(ctx, x1, y1, x2, y2, text, color = '#94a3b8', textOffset = 0) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;

    // Dimension line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrows pointing outwards to dimension endpoints
    this.drawCadArrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x1, y1, 7, 2.8);
    this.drawCadArrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, 7, 2.8);

    // Dimension text with dark background badge
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.font = 'bold 11px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(text);
    const pad = 4;
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(midX - metrics.width / 2 - pad + textOffset, midY - 7, metrics.width + pad * 2, 14);

    ctx.fillStyle = color;
    ctx.fillText(text, midX + textOffset, midY);
    ctx.restore();
  }

  // =========================================================================
  // BỘ 2 HÌNH CẮT THEN BẰNG (PARALLEL KEYS: 1. HUB & 2. SHAFT)
  // =========================================================================
  renderParallelKeys(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const t1 = data.t1;
    const t2 = data.t2;
    const numKeys = data.numKeys || 1;
    const angles = this.getKeyAngles(numKeys);

    // 2 Hình cắt cân đối: Hub bên trái (-290), Shaft bên phải (+290)
    const spacing = 290;
    const pxPerUnit = 160 / d; // Kích thước to rõ, sắc nét
    const r_shaft = (d / 2) * pxPerUnit;
    const r_hub = r_shaft * 1.8;
    const w_key = b * pxPerUnit;
    const depth1 = t1 * pxPerUnit;
    const depth2 = t2 * pxPerUnit;

    // 1. Bên trái: Hình cắt lỗ Moay-ơ (Hub)
    this.drawSingleHubView(ctx, -spacing, 0, r_shaft, r_hub, w_key, depth2, angles, data);

    // 2. Bên phải: Hình cắt Trục (Shaft)
    this.drawSingleShaftView(ctx, spacing, 0, r_shaft, w_key, depth1, angles, data);
  }

  /**
   * Tạo đường bao lỗ Moay-ơ khép kín với các rãnh khoét ra ngoài (Hole Contour with Open Notches)
   * Tuyệt đối không có cung tròn chắn ngang miệng rãnh!
   */
  traceHubHoleContour(ctx, cx, cy, r_shaft, w_key, depth2, angles) {
    const halfW = w_key / 2;
    const ratio = Math.min(0.999, halfW / r_shaft);
    const deltaTheta = Math.asin(ratio);

    for (let i = 0; i < angles.length; i++) {
      const ang = angles[i];
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const tanX = -sinA;
      const tanY = cosA;
      const radX = cosA;
      const radY = sinA;

      const angM1 = ang - deltaTheta;
      const pm1x = cx + r_shaft * Math.cos(angM1);
      const pm1y = cy + r_shaft * Math.sin(angM1);

      // Điểm đỉnh nóc rãnh trong thân moay-ơ
      const pt1x = cx + (r_shaft + depth2) * radX - halfW * tanX;
      const pt1y = cy + (r_shaft + depth2) * radY - halfW * tanY;

      const pt2x = cx + (r_shaft + depth2) * radX + halfW * tanX;
      const pt2y = cy + (r_shaft + depth2) * radY + halfW * tanY;

      const angM2 = ang + deltaTheta;
      const pm2x = cx + r_shaft * Math.cos(angM2);
      const pm2y = cy + r_shaft * Math.sin(angM2);

      if (i === 0) {
        ctx.moveTo(pm1x, pm1y);
      } else {
        ctx.lineTo(pm1x, pm1y);
      }
      ctx.lineTo(pt1x, pt1y);
      ctx.lineTo(pt2x, pt2y);
      ctx.lineTo(pm2x, pm2y);

      // Cung tròn nối sang then tiếp theo theo chiều kim đồng hồ
      if (angles.length === 1) {
        ctx.arc(cx, cy, r_shaft, angM2, angM1 + Math.PI * 2, false);
      } else {
        const nextAng = angles[(i + 1) % angles.length];
        let nextAngM1 = nextAng - deltaTheta;
        while (nextAngM1 <= angM2) {
          nextAngM1 += Math.PI * 2;
        }
        ctx.arc(cx, cy, r_shaft, angM2, nextAngM1, false);
      }
    }
    ctx.closePath();
  }

  /**
   * Tạo đường bao thân trục khép kín với các rãnh khoét vào trong (Shaft Contour with Open Notches)
   * Miệng rãnh mở thông ra ngoài không khí, tuyệt đối không có cung tròn chắn ngang!
   */
  traceShaftContour(ctx, cx, cy, r_shaft, w_key, depth1, angles) {
    const halfW = w_key / 2;
    const ratio = Math.min(0.999, halfW / r_shaft);
    const deltaTheta = Math.asin(ratio);

    for (let i = 0; i < angles.length; i++) {
      const ang = angles[i];
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const tanX = -sinA;
      const tanY = cosA;
      const radX = cosA;
      const radY = sinA;

      const angM1 = ang - deltaTheta;
      const pm1x = cx + r_shaft * Math.cos(angM1);
      const pm1y = cy + r_shaft * Math.sin(angM1);

      // Điểm đáy rãnh khoét lõm vào trong thân trục
      const pb1x = cx + (r_shaft - depth1) * radX - halfW * tanX;
      const pb1y = cy + (r_shaft - depth1) * radY - halfW * tanY;

      const pb2x = cx + (r_shaft - depth1) * radX + halfW * tanX;
      const pb2y = cy + (r_shaft - depth1) * radY + halfW * tanY;

      const angM2 = ang + deltaTheta;
      const pm2x = cx + r_shaft * Math.cos(angM2);
      const pm2y = cy + r_shaft * Math.sin(angM2);

      if (i === 0) {
        ctx.moveTo(pm1x, pm1y);
      } else {
        ctx.lineTo(pm1x, pm1y);
      }
      ctx.lineTo(pb1x, pb1y);
      ctx.lineTo(pb2x, pb2y);
      ctx.lineTo(pm2x, pm2y);

      // Cung tròn bề mặt trụ nối sang then tiếp theo theo chiều kim đồng hồ
      if (angles.length === 1) {
        ctx.arc(cx, cy, r_shaft, angM2, angM1 + Math.PI * 2, false);
      } else {
        const nextAng = angles[(i + 1) % angles.length];
        let nextAngM1 = nextAng - deltaTheta;
        while (nextAngM1 <= angM2) {
          nextAngM1 += Math.PI * 2;
        }
        ctx.arc(cx, cy, r_shaft, angM2, nextAngM1, false);
      }
    }
    ctx.closePath();
  }

  // 1. VẼ MẶT CẮT LỖ MOAY-Ơ (HUB CROSS-SECTION)
  drawSingleHubView(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, angles, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, r_hub);

    // 1. Thân kim loại Moay-ơ kèm gạch mặt cắt (Chỉ gạch trong vùng kim loại)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r_hub, 0, Math.PI * 2, false);
    this.traceHubHoleContour(ctx, cx, cy, r_shaft, w_key, depth2, angles);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fill('evenodd');

    ctx.clip('evenodd');
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    const ext = r_hub * 1.5;
    for (let x = -ext * 2; x <= ext * 2; x += 12) {
      ctx.moveTo(cx + x, cy - ext);
      ctx.lineTo(cx + x + ext * 2, cy + ext);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Đường bao ngoài Moay-ơ
    ctx.beginPath();
    ctx.arc(cx, cy, r_hub, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // 3. Đường bao trong lỗ Moay-ơ (Miệng rãnh mở thông suốt, không có nét tròn chắn ngang)
    ctx.beginPath();
    this.traceHubHoleContour(ctx, cx, cy, r_shaft, w_key, depth2, angles);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 4. Kích thước kỹ thuật cho Lỗ (b, t2, Ø d, và d2)
    this.drawHubDimensions(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, data);

    // 5. Tiêu đề hình
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1. HÌNH CẮT LỖ MOAY-Ơ (HUB CROSS-SECTION)', cx, cy + r_hub + 45);

    ctx.restore();
  }

  // 2. VẼ MẶT CẮT TRỤC (SHAFT CROSS-SECTION)
  drawSingleShaftView(ctx, cx, cy, r_shaft, w_key, depth1, angles, data) {
    ctx.save();
    const r_bound = r_shaft * 1.8;
    this.drawAxes(ctx, cx, cy, r_bound);

    // 1. Thân kim loại Trục kèm gạch mặt cắt (Chỉ gạch trong thân trục, rãnh khuyết để rỗng)
    ctx.save();
    ctx.beginPath();
    this.traceShaftContour(ctx, cx, cy, r_shaft, w_key, depth1, angles);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fill();

    ctx.clip();
    ctx.strokeStyle = '#0e7490';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    const ext = r_shaft * 1.5;
    for (let x = -ext * 2; x <= ext * 2; x += 12) {
      ctx.moveTo(cx + x, cy - ext);
      ctx.lineTo(cx + x + ext * 2, cy + ext);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Đường bao thân Trục (Miệng rãnh mở thông ra ngoài, không có cung tròn chắn ngang)
    ctx.beginPath();
    this.traceShaftContour(ctx, cx, cy, r_shaft, w_key, depth1, angles);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 3. Kích thước kỹ thuật cho Trục (b, t1, Ø d, và d1)
    this.drawShaftDimensions(ctx, cx, cy, r_shaft, w_key, depth1, data);

    // 4. Tiêu đề hình
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2. HÌNH CẮT TRỤC (SHAFT CROSS-SECTION)', cx, cy + r_bound + 45);

    ctx.restore();
  }

  // Đường gióng & Kích thước Lỗ Moay-ơ
  drawHubDimensions(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, data) {
    ctx.save();
    const unitStr = data.isMetric ? ' mm' : ' in';

    // 1. Kích thước bề rộng b trên đỉnh
    const dimY_b = cy - r_shaft - depth2 - 25;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, cy - r_shaft - depth2);
    ctx.lineTo(cx - w_key / 2, dimY_b - 5);
    ctx.moveTo(cx + w_key / 2, cy - r_shaft - depth2);
    ctx.lineTo(cx + w_key / 2, dimY_b - 5);
    ctx.stroke();

    this.drawLinearDimension(ctx, cx - w_key / 2, dimY_b, cx + w_key / 2, dimY_b, `b = ${data.b.toFixed(2)}`, '#38bdf8');

    // 2. Kích thước chiều sâu rãnh t2 bên phải
    const dimX_t2 = cx + w_key / 2 + 25;
    const yTop_t2 = cy - r_shaft - depth2;
    const yBot_t2 = cy - Math.sqrt(Math.max(0, r_shaft * r_shaft - (w_key / 2) * (w_key / 2)));
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + w_key / 2, yTop_t2);
    ctx.lineTo(dimX_t2 + 5, yTop_t2);
    ctx.moveTo(cx + w_key / 2, yBot_t2);
    ctx.lineTo(dimX_t2 + 5, yBot_t2);
    ctx.stroke();

    this.drawLinearDimension(ctx, dimX_t2, yTop_t2, dimX_t2, yBot_t2, `t2 = ${data.t2.toFixed(2)}`, '#f59e0b', 24);

    // 3. Đường kính lỗ Ø d ở tâm
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Ø Lỗ = ${data.d.toFixed(1)}${unitStr}`, cx, cy + 22);

    // 4. KÍCH THƯỚC ĐỈNH RÃNH LỖ d2 (BÊN TRÁI)
    const dimX_d2 = cx - r_shaft - 35;
    let yD2_top = cy - r_shaft - depth2;
    let yD2_bot = cy + r_shaft;
    if (data.numKeys === 2) {
      yD2_bot = cy + r_shaft + depth2;
    }

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, yD2_top);
    ctx.lineTo(dimX_d2 - 5, yD2_top);
    ctx.moveTo(cx, yD2_bot);
    ctx.lineTo(dimX_d2 - 5, yD2_bot);
    ctx.stroke();

    this.drawLinearDimension(ctx, dimX_d2, yD2_top, dimX_d2, yD2_bot, `d2 = ${data.d2.toFixed(2)}${unitStr}`, '#fbbf24', -36);

    ctx.restore();
  }

  // Đường gióng & Kích thước Trục
  drawShaftDimensions(ctx, cx, cy, r_shaft, w_key, depth1, data) {
    ctx.save();
    const unitStr = data.isMetric ? ' mm' : ' in';

    // 1. Kích thước bề rộng b trên đỉnh
    const dimY_b = cy - r_shaft - 25;
    const yMouth = cy - Math.sqrt(Math.max(0, r_shaft * r_shaft - (w_key / 2) * (w_key / 2)));
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, yMouth);
    ctx.lineTo(cx - w_key / 2, dimY_b - 5);
    ctx.moveTo(cx + w_key / 2, yMouth);
    ctx.lineTo(cx + w_key / 2, dimY_b - 5);
    ctx.stroke();

    this.drawLinearDimension(ctx, cx - w_key / 2, dimY_b, cx + w_key / 2, dimY_b, `b = ${data.b.toFixed(2)}`, '#06b6d4');

    // 2. Kích thước chiều sâu rãnh t1 bên phải
    const dimX_t1 = cx + w_key / 2 + 25;
    const yTop_t1 = yMouth;
    const yBot_t1 = cy - r_shaft + depth1;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + w_key / 2, yTop_t1);
    ctx.lineTo(dimX_t1 + 5, yTop_t1);
    ctx.moveTo(cx + w_key / 2, yBot_t1);
    ctx.lineTo(dimX_t1 + 5, yBot_t1);
    ctx.stroke();

    this.drawLinearDimension(ctx, dimX_t1, yTop_t1, dimX_t1, yBot_t1, `t1 = ${data.t1.toFixed(2)}`, '#10b981', 24);

    // 3. Đường kính trục Ø d ở tâm
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Ø Trục = ${data.d.toFixed(1)}${unitStr}`, cx, cy + 22);

    // 4. KÍCH THƯỚC ĐÁY RÃNH TRỤC d1 (BÊN TRÁI)
    const dimX_d1 = cx - r_shaft - 35;
    let yD1_top = cy - r_shaft + depth1;
    let yD1_bot = cy + r_shaft;
    if (data.numKeys === 2) {
      yD1_bot = cy + r_shaft - depth1;
    }

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, yD1_top);
    ctx.lineTo(dimX_d1 - 5, yD1_top);
    ctx.moveTo(cx, yD1_bot);
    ctx.lineTo(dimX_d1 - 5, yD1_bot);
    ctx.stroke();

    this.drawLinearDimension(ctx, dimX_d1, yD1_top, dimX_d1, yD1_bot, `d1 = ${data.d1.toFixed(2)}${unitStr}`, '#10b981', -36);

    ctx.restore();
  }

  // =========================================================================
  // BỘ HÌNH THEN BÁN NGUYỆT (WOODRUFF) & THEN HOA (SPLINES)
  // =========================================================================
  renderWoodruffKeys(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const t1 = data.t1;
    const t2 = data.t2;
    const numKeys = data.numKeys || 1;
    const angles = this.getKeyAngles(numKeys);

    const spacing = 290;
    const pxPerUnit = 160 / d;
    const r_shaft = (d / 2) * pxPerUnit;
    const r_hub = r_shaft * 1.8;
    const w_key = b * pxPerUnit;
    const depth1 = t1 * pxPerUnit;
    const depth2 = t2 * pxPerUnit;

    this.drawSingleHubView(ctx, -spacing, 0, r_shaft, r_hub, w_key, depth2, angles, data);
    this.drawSingleShaftView(ctx, spacing, 0, r_shaft, w_key, depth1, angles, data);
  }

  renderStraightSplines(ctx) {
    const data = this.currentData;
    const n = data.n;
    const d = data.d; // minor
    const D = data.D; // major
    const b = data.b;

    const spacing = 290;
    const pxPerUnit = 140 / D;
    const r_minor = (d / 2) * pxPerUnit;
    const r_major = (D / 2) * pxPerUnit;
    const r_hub = r_major * 1.6;
    const halfB = (b / 2) * pxPerUnit;

    // 1. Hub spline
    this.drawSplineHub(ctx, -spacing, 0, r_minor, r_major, r_hub, n, halfB, data);
    // 2. Shaft spline
    this.drawSplineShaft(ctx, spacing, 0, r_minor, r_major, n, halfB, data);
  }

  drawSplineHub(ctx, cx, cy, rMinor, rMajor, rHub, n, halfB, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, rHub);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, rHub, 0, Math.PI * 2);
    ctx.arc(cx, cy, rMajor, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1. HÌNH CẮT LỖ THEN HOA (HUB)', cx, cy + rHub + 45);
    ctx.restore();
  }

  drawSplineShaft(ctx, cx, cy, rMinor, rMajor, n, halfB, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, rMajor * 1.3);
    this.drawSplineToothLoop(ctx, cx, cy, rMinor, rMajor, n, halfB, 'rgba(16, 185, 129, 0.25)', '#10b981');

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2. HÌNH CẮT TRỤC THEN HOA (SHAFT)', cx, cy + rMajor * 1.6 + 45);
    ctx.restore();
  }

  drawSplineToothLoop(ctx, cx, cy, rMinor, rMajor, n, halfB, fillColor, strokeColor) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const angleStep = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const theta = i * angleStep;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const tanX = -sinT;
      const tanY = cosT;

      const p1x = cx + rMajor * cosT - halfB * tanX;
      const p1y = cy + rMajor * sinT - halfB * tanY;
      const p2x = cx + rMajor * cosT + halfB * tanX;
      const p2y = cy + rMajor * sinT + halfB * tanY;

      const p0x = cx + rMinor * cosT - halfB * tanX;
      const p0y = cy + rMinor * sinT - halfB * tanY;
      const p3x = cx + rMinor * cosT + halfB * tanX;
      const p3y = cy + rMinor * sinT + halfB * tanY;

      if (i === 0) ctx.moveTo(p0x, p0y);
      else ctx.lineTo(p0x, p0y);
      ctx.lineTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.lineTo(p3x, p3y);

      const nextTheta = (i + 1) * angleStep;
      const nextCos = Math.cos(nextTheta);
      const nextSin = Math.sin(nextTheta);
      const nextTanX = -nextSin;
      const nextTanY = nextCos;
      const nextP0x = cx + rMinor * nextCos - halfB * nextTanX;
      const nextP0y = cy + rMinor * nextSin - halfB * nextTanY;

      const startAng = Math.atan2(p3y - cy, p3x - cx);
      const endAng = Math.atan2(nextP0y - cy, nextP0x - cx);
      ctx.arc(cx, cy, rMinor, startAng, endAng);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  downloadImage() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `Keys_2Views_${this.jointType}_CAD.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
