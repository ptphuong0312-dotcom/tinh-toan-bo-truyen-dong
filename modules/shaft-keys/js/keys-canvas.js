/**
 * 2D CANVAS CAD RENDERING ENGINE: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Hiển thị 3 HÌNH CẮT KỸ THUẬT:
 * 1. Hình Cắt Lỗ Moay-ơ (Hub Cross-Section)
 * 2. Hình Cắt Lắp Ghép (Assembly Cross-Section)
 * 3. Hình Cắt Trục (Shaft Cross-Section)
 * Hỗ trợ 1, 2, 3, 4 then và cử chỉ cảm ứng chuột & Multi-touch trên Mobile
 */

class KeysCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.displayView = 'triple'; // 'triple' (Bộ ba 3 hình), 'assembly', 'shaft', 'hub'
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

  setDisplayView(view) {
    this.displayView = view;
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

  // =========================================================================
  // BỘ 3 HÌNH CẮT THEN BẰNG (PARALLEL KEYS: HUB, ASSEMBLY, SHAFT)
  // =========================================================================
  renderParallelKeys(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;
    const numKeys = data.numKeys || 1;
    const angles = this.getKeyAngles(numKeys);

    if (this.displayView === 'triple') {
      // BỘ BA 3 HÌNH NẰM CẠNH NHAU
      const spacing = 380;
      const pxPerUnit = 135 / d; // Căn chỉnh tỷ lệ vừa vặn 3 hình
      const r_shaft = (d / 2) * pxPerUnit;
      const r_hub = r_shaft * 1.8;
      const w_key = b * pxPerUnit;
      const h_key = h * pxPerUnit;
      const depth1 = t1 * pxPerUnit;
      const depth2 = t2 * pxPerUnit;

      // 1. Bên trái: Hình cắt lỗ Moay-ơ (Hub)
      this.drawSingleHubView(ctx, -spacing, 0, r_shaft, r_hub, w_key, depth2, angles, data);

      // 2. Ở giữa: Hình cắt Lắp ghép (Assembly)
      this.drawSingleAssemblyView(ctx, 0, 0, r_shaft, r_hub, w_key, h_key, depth1, depth2, angles, data);

      // 3. Bên phải: Hình cắt Trục (Shaft)
      this.drawSingleShaftView(ctx, spacing, 0, r_shaft, w_key, depth1, angles, data);

    } else {
      // PHÓNG TO 1 HÌNH RIÊNG LẺ
      const pxPerUnit = 220 / d;
      const r_shaft = (d / 2) * pxPerUnit;
      const r_hub = r_shaft * 1.8;
      const w_key = b * pxPerUnit;
      const h_key = h * pxPerUnit;
      const depth1 = t1 * pxPerUnit;
      const depth2 = t2 * pxPerUnit;

      if (this.displayView === 'hub') {
        this.drawSingleHubView(ctx, 0, 0, r_shaft, r_hub, w_key, depth2, angles, data);
      } else if (this.displayView === 'shaft') {
        this.drawSingleShaftView(ctx, 0, 0, r_shaft, w_key, depth1, angles, data);
      } else {
        this.drawSingleAssemblyView(ctx, 0, 0, r_shaft, r_hub, w_key, h_key, depth1, depth2, angles, data);
      }
    }
  }

  // 1. VẼ MẶT CẮT LỖ MOAY-Ơ (HUB CROSS-SECTION)
  drawSingleHubView(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, angles, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, r_hub);

    // Hub ring body
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r_hub, 0, Math.PI * 2);
    ctx.arc(cx, cy, r_shaft, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    // Metallic Hatching for Hub
    this.drawHatchingRing(ctx, cx, cy, r_shaft, r_hub, '#334155');

    // Hub keyways (khoét rãnh ra ngoài)
    angles.forEach(ang => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang + Math.PI / 2);
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);
      ctx.restore();
    });

    // Outer and Inner Hub contours
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r_hub, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy, r_shaft, 0, Math.PI * 2);
    ctx.stroke();

    // Kích thước kỹ thuật cho Lỗ
    this.drawHubDimensions(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, data);

    // Tiêu đề hình
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1. HÌNH CẮT LỖ MOAY-Ơ (HUB)', cx, cy + r_hub + 45);

    ctx.restore();
  }

  // 2. VẼ MẶT CẮT LẮP GHÉP (ASSEMBLY CROSS-SECTION)
  drawSingleAssemblyView(ctx, cx, cy, r_shaft, r_hub, w_key, h_key, depth1, depth2, angles, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, r_hub);

    // 1. Hub outer ring
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r_hub, 0, Math.PI * 2);
    ctx.arc(cx, cy, r_shaft, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    this.drawHatchingRing(ctx, cx, cy, r_shaft, r_hub, '#334155');

    // 2. Shaft body inside
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r_shaft, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Keys and Keyways
    angles.forEach(ang => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang + Math.PI / 2);

      // Hub notch
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);

      // Shaft notch
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(-w_key / 2, -r_shaft, w_key, depth1);
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect(-w_key / 2, -r_shaft, w_key, depth1);

      // Key body (Solid amber with cross hatch)
      const keyTopY = -r_shaft + depth1 - h_key;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.fillRect(-w_key / 2, keyTopY, w_key, h_key);
      ctx.strokeRect(-w_key / 2, keyTopY, w_key, h_key);

      // Key hatch
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -w_key / 2; x <= w_key / 2 + h_key; x += 6) {
        ctx.moveTo(x, keyTopY);
        ctx.lineTo(x - h_key, keyTopY + h_key);
      }
      ctx.stroke();

      ctx.restore();
    });

    // Assembly Dimensions
    this.drawAssemblyDimensions(ctx, cx, cy, r_shaft, w_key, h_key, depth1, depth2, data);

    // Tiêu đề hình
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2. HÌNH CẮT LẮP GHÉP (ASSEMBLY)', cx, cy + r_hub + 45);

    ctx.restore();
  }

  // 3. VẼ MẶT CẮT TRỤC (SHAFT CROSS-SECTION)
  drawSingleShaftView(ctx, cx, cy, r_shaft, w_key, depth1, angles, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, r_shaft);

    // Solid Shaft circle
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(cx, cy, r_shaft, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Metallic Hatching for Shaft
    this.drawHatchingCircle(ctx, cx, cy, r_shaft, '#0e7490');

    // Shaft keyways (khoét rãnh vào trong)
    angles.forEach(ang => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang + Math.PI / 2);
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(-w_key / 2, -r_shaft, w_key, depth1);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(-w_key / 2, -r_shaft, w_key, depth1);
      ctx.restore();
    });

    // Shaft Dimensions
    this.drawShaftDimensions(ctx, cx, cy, r_shaft, w_key, depth1, data);

    // Tiêu đề hình
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('3. HÌNH CẮT TRỤC (SHAFT)', cx, cy + r_shaft * 1.8 + 45);

    ctx.restore();
  }

  // Đường gióng kích thước Lỗ Moay-ơ
  drawHubDimensions(ctx, cx, cy, r_shaft, r_hub, w_key, depth2, data) {
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    ctx.lineWidth = 1;

    // Kích thước b trên đỉnh
    const dimY = cy - r_shaft - depth2 - 20;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, cy - r_shaft - depth2);
    ctx.lineTo(cx - w_key / 2, dimY);
    ctx.moveTo(cx + w_key / 2, cy - r_shaft - depth2);
    ctx.lineTo(cx + w_key / 2, dimY);
    ctx.moveTo(cx - w_key / 2, dimY + 4);
    ctx.lineTo(cx + w_key / 2, dimY + 4);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(`b = ${data.b.toFixed(2)}`, cx, dimY - 2);

    // Kích thước t2 bên phải
    ctx.textAlign = 'left';
    ctx.fillText(`t2 = ${data.t2.toFixed(2)}`, cx + w_key / 2 + 8, cy - r_shaft - depth2 / 2 + 4);

    // Đường kính lỗ Ø d
    ctx.textAlign = 'center';
    ctx.fillText(`Ø Lỗ = ${data.d.toFixed(1)}${data.isMetric ? ' mm' : ' in'}`, cx, cy + 18);

    ctx.restore();
  }

  // Đường gióng kích thước Lắp Ghép
  drawAssemblyDimensions(ctx, cx, cy, r_shaft, w_key, h_key, depth1, depth2, data) {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    ctx.lineWidth = 1;

    // Then b x h
    const dimY = cy - r_shaft + depth1 - h_key - 22;
    ctx.textAlign = 'center';
    ctx.fillText(`Then: ${data.b.toFixed(1)} x ${data.h.toFixed(1)}`, cx, dimY);

    // Đường kính tiếp xúc d
    ctx.fillText(`Ø d = ${data.d.toFixed(1)}`, cx, cy + 18);

    // Thông số t1 và t2
    ctx.textAlign = 'left';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`t1 = ${data.t1.toFixed(2)}`, cx + w_key / 2 + 8, cy - r_shaft + depth1 / 2 + 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`t2 = ${data.t2.toFixed(2)}`, cx + w_key / 2 + 8, cy - r_shaft - depth2 / 2 + 4);

    ctx.restore();
  }

  // Đường gióng kích thước Trục
  drawShaftDimensions(ctx, cx, cy, r_shaft, w_key, depth1, data) {
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    ctx.lineWidth = 1;

    // Kích thước b trên đỉnh
    const dimY = cy - r_shaft - 20;
    ctx.beginPath();
    ctx.moveTo(cx - w_key / 2, cy - r_shaft);
    ctx.lineTo(cx - w_key / 2, dimY);
    ctx.moveTo(cx + w_key / 2, cy - r_shaft);
    ctx.lineTo(cx + w_key / 2, dimY);
    ctx.moveTo(cx - w_key / 2, dimY + 4);
    ctx.lineTo(cx + w_key / 2, dimY + 4);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(`b = ${data.b.toFixed(2)}`, cx, dimY - 2);

    // Kích thước t1 bên phải
    ctx.textAlign = 'left';
    ctx.fillText(`t1 = ${data.t1.toFixed(2)}`, cx + w_key / 2 + 8, cy - r_shaft + depth1 / 2 + 4);

    // Đường kính trục và đáy rãnh d1
    ctx.textAlign = 'center';
    ctx.fillText(`Ø d = ${data.d.toFixed(1)}${data.isMetric ? ' mm' : ' in'}`, cx, cy + 16);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`d1 = ${data.d1.toFixed(2)}`, cx, cy + 34);

    ctx.restore();
  }

  // Hatching utilities
  drawHatchingRing(ctx, cx, cy, rInner, rOuter, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.rect(cx - rOuter, cy - rOuter, rOuter * 2, rOuter * 2);
    ctx.clip();

    ctx.beginPath();
    for (let x = cx - rOuter * 2; x <= cx + rOuter * 2; x += 12) {
      ctx.moveTo(x, cy - rOuter);
      ctx.lineTo(x + rOuter * 2, cy + rOuter);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawHatchingCircle(ctx, cx, cy, radius, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    for (let x = cx - radius * 2; x <= cx + radius * 2; x += 12) {
      ctx.moveTo(x, cy - radius);
      ctx.lineTo(x + radius * 2, cy + radius);
    }
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // BỘ HÌNH THEN BÁN NGUYỆT (WOODRUFF) & THEN HOA (SPLINES)
  // =========================================================================
  renderWoodruffKeys(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;
    const numKeys = data.numKeys || 1;
    const angles = this.getKeyAngles(numKeys);

    const spacing = 380;
    const pxPerUnit = 135 / d;
    const r_shaft = (d / 2) * pxPerUnit;
    const r_hub = r_shaft * 1.8;
    const w_key = b * pxPerUnit;
    const h_key = h * pxPerUnit;
    const depth1 = t1 * pxPerUnit;
    const depth2 = t2 * pxPerUnit;

    this.drawSingleHubView(ctx, -spacing, 0, r_shaft, r_hub, w_key, depth2, angles, data);
    this.drawSingleAssemblyView(ctx, 0, 0, r_shaft, r_hub, w_key, h_key, depth1, depth2, angles, data);
    this.drawSingleShaftView(ctx, spacing, 0, r_shaft, w_key, depth1, angles, data);
  }

  renderStraightSplines(ctx) {
    const data = this.currentData;
    const n = data.n;
    const d = data.d; // minor
    const D = data.D; // major
    const b = data.b;

    const spacing = 380;
    const pxPerUnit = 120 / D;
    const r_minor = (d / 2) * pxPerUnit;
    const r_major = (D / 2) * pxPerUnit;
    const r_hub = r_major * 1.6;
    const halfB = (b / 2) * pxPerUnit;

    // 1. Hub spline
    this.drawSplineHub(ctx, -spacing, 0, r_minor, r_major, r_hub, n, halfB, data);
    // 2. Assembly spline
    this.drawSplineAssembly(ctx, 0, 0, r_minor, r_major, r_hub, n, halfB, data);
    // 3. Shaft spline
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
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1. HÌNH CẮT LỖ THEN HOA (HUB)', cx, cy + rHub + 45);
    ctx.restore();
  }

  drawSplineAssembly(ctx, cx, cy, rMinor, rMajor, rHub, n, halfB, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, rHub);
    this.drawSplineToothLoop(ctx, cx, cy, rMinor, rMajor, n, halfB, 'rgba(6, 182, 212, 0.25)', '#06b6d4');

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2. HÌNH CẮT LẮP GHÉP (ASSEMBLY)', cx, cy + rHub + 45);
    ctx.restore();
  }

  drawSplineShaft(ctx, cx, cy, rMinor, rMajor, n, halfB, data) {
    ctx.save();
    this.drawAxes(ctx, cx, cy, rMajor * 1.3);
    this.drawSplineToothLoop(ctx, cx, cy, rMinor, rMajor, n, halfB, 'rgba(16, 185, 129, 0.25)', '#10b981');

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('3. HÌNH CẮT TRỤC THEN HOA (SHAFT)', cx, cy + rMajor * 1.6 + 45);
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
    link.download = `Keys_3Views_${this.jointType}_CAD.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
