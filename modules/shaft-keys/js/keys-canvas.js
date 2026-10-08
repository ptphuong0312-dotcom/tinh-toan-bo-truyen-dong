/**
 * 2D CANVAS CAD RENDERING ENGINE: MODULE 8 KEYS & STRAIGHT-SIDED SPLINES
 * Hiển thị mặt cắt ngang (Cross-section) & mặt cắt dọc (Longitudinal section)
 * Hỗ trợ cử chỉ cảm ứng chuột & Multi-touch trên Mobile
 */

class KeysCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.viewMode = 'assembly'; // 'assembly', 'shaft', 'hub', 'key'
    this.sectionType = 'cross'; // 'cross' (mặt cắt ngang), 'long' (mặt cắt dọc)
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
    const newScale = Math.max(0.2, Math.min(10.0, this.scale * factor));
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

  setSectionType(type) {
    this.sectionType = type;
    this.render();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background grid
    this.drawGrid(ctx, w, h);

    if (!this.currentData) return;

    ctx.save();
    // Center origin
    ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
    ctx.scale(this.scale, this.scale);

    if (this.jointType === 'parallel') {
      if (this.sectionType === 'cross') {
        this.drawParallelKeyCrossSection(ctx);
      } else {
        this.drawParallelKeyLongitudinal(ctx);
      }
    } else if (this.jointType === 'woodruff') {
      if (this.sectionType === 'cross') {
        this.drawWoodruffCrossSection(ctx);
      } else {
        this.drawWoodruffLongitudinal(ctx);
      }
    } else if (this.jointType === 'spline') {
      if (this.sectionType === 'cross') {
        this.drawStraightSplineCrossSection(ctx);
      } else {
        this.drawStraightSplineLongitudinal(ctx);
      }
    }

    ctx.restore();
  }

  drawGrid(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
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

    // Center axes
    const cx = w / 2 + this.panX;
    const cy = h / 2 + this.panY;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Mặt cắt ngang Then Bằng (Parallel Key Cross-Section)
   */
  drawParallelKeyCrossSection(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;
    const numKeys = data.numKeys;

    // Auto visual scale to fit canvas nicely (~220px radius for shaft)
    const pxPerUnit = 220 / (d * 0.9);
    const r_shaft = (d / 2) * pxPerUnit;
    const r_hub = r_shaft * 1.8;
    const w_key = b * pxPerUnit;
    const h_key = h * pxPerUnit;
    const depth1 = t1 * pxPerUnit;
    const depth2 = t2 * pxPerUnit;

    // 1. Hub (Moay-ơ) - outer circle with keyway notch
    if (this.viewMode === 'assembly' || this.viewMode === 'hub') {
      ctx.save();
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      // Hub cross section: ring from r_shaft to r_hub
      ctx.beginPath();
      ctx.arc(0, 0, r_hub, 0, Math.PI * 2);
      ctx.arc(0, 0, r_shaft, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();

      // Hub keyway top pocket
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.fillRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);

      if (numKeys === 2) {
        ctx.fillRect(-w_key / 2, r_shaft, w_key, depth2);
        ctx.strokeRect(-w_key / 2, r_shaft, w_key, depth2);
      }
      ctx.restore();
    }

    // 2. Shaft (Trục) - inner solid circle with keyway slot
    if (this.viewMode === 'assembly' || this.viewMode === 'shaft') {
      ctx.save();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;

      // Shaft body
      ctx.beginPath();
      ctx.arc(0, 0, r_shaft, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cut keyway on shaft (dark pocket)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-w_key / 2, -r_shaft, w_key, depth1);
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect(-w_key / 2, -r_shaft, w_key, depth1);

      if (numKeys === 2) {
        ctx.fillRect(-w_key / 2, r_shaft - depth1, w_key, depth1);
        ctx.strokeRect(-w_key / 2, r_shaft - depth1, w_key, depth1);
      }
      ctx.restore();
    }

    // 3. Key (Then) - amber solid rectangle with mechanical hatching
    if (this.viewMode === 'assembly' || this.viewMode === 'key') {
      ctx.save();
      const topY = -r_shaft + depth1 - h_key;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;

      ctx.fillRect(-w_key / 2, topY, w_key, h_key);
      ctx.strokeRect(-w_key / 2, topY, w_key, h_key);

      // Hatching inside key
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -w_key / 2; x <= w_key / 2 + h_key; x += 8) {
        ctx.moveTo(x, topY);
        ctx.lineTo(x - h_key, topY + h_key);
      }
      ctx.stroke();

      if (numKeys === 2) {
        const bottomY = r_shaft - depth1;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.fillRect(-w_key / 2, bottomY, w_key, h_key);
        ctx.strokeRect(-w_key / 2, bottomY, w_key, h_key);
      }
      ctx.restore();
    }

    // 4. Dimension lines & annotations
    this.drawParallelCrossDimensions(ctx, r_shaft, w_key, h_key, depth1, depth2, data);
  }

  drawParallelCrossDimensions(ctx, r_shaft, w_key, h_key, depth1, depth2, data) {
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.lineWidth = 1;

    // Dimension b (width) on top
    const dimY = -r_shaft - depth2 - 25;
    ctx.beginPath();
    ctx.moveTo(-w_key / 2, -r_shaft - depth2);
    ctx.lineTo(-w_key / 2, dimY);
    ctx.moveTo(w_key / 2, -r_shaft - depth2);
    ctx.lineTo(w_key / 2, dimY);
    ctx.moveTo(-w_key / 2, dimY + 5);
    ctx.lineTo(w_key / 2, dimY + 5);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillText(`b = ${data.b.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, dimY);

    // Dimension d (diameter)
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`Ø d = ${data.d.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, r_shaft * 0.45);
    ctx.fillText(`d1 = ${data.d1.toFixed(2)}`, 0, r_shaft * 0.65);

    // Depth t1 & t2 labels on side
    ctx.textAlign = 'left';
    ctx.fillText(`t1 = ${data.t1.toFixed(2)}`, w_key / 2 + 15, -r_shaft + depth1 / 2 + 4);
    ctx.fillText(`t2 = ${data.t2.toFixed(2)}`, w_key / 2 + 15, -r_shaft - depth2 / 2 + 4);

    ctx.restore();
  }

  /**
   * Mặt cắt dọc Then Bằng (Longitudinal Section)
   */
  drawParallelKeyLongitudinal(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const h = data.h;
    const L = data.chosenL;
    const t1 = data.t1;
    const t2 = data.t2;

    const pxPerUnit = 220 / (L * 0.7);
    const len_key = L * pxPerUnit;
    const len_shaft = len_key * 1.5;
    const diam_shaft = d * pxPerUnit;
    const h_key = h * pxPerUnit;
    const r_head = (b / 2) * pxPerUnit;
    const depth1 = t1 * pxPerUnit;

    ctx.save();

    // Shaft body horizontal cylinder
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.fillRect(-len_shaft / 2, -diam_shaft / 2, len_shaft, diam_shaft);
    ctx.strokeRect(-len_shaft / 2, -diam_shaft / 2, len_shaft, diam_shaft);

    // Centerline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.beginPath();
    ctx.moveTo(-len_shaft / 2 - 20, 0);
    ctx.lineTo(len_shaft / 2 + 20, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Keyway pocket on shaft
    const keyTopY = -diam_shaft / 2 - (h_key - depth1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-len_key / 2, -diam_shaft / 2, len_key, depth1);
    ctx.strokeStyle = '#06b6d4';
    ctx.strokeRect(-len_key / 2, -diam_shaft / 2, len_key, depth1);

    // Key body (Form A rounded ends or Form B square)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;

    // Draw Form A rounded ends
    ctx.beginPath();
    ctx.moveTo(-len_key / 2 + r_head, keyTopY);
    ctx.lineTo(len_key / 2 - r_head, keyTopY);
    ctx.arc(len_key / 2 - r_head, keyTopY + h_key / 2, h_key / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-len_key / 2 + r_head, keyTopY + h_key);
    ctx.arc(-len_key / 2 + r_head, keyTopY + h_key / 2, h_key / 2, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dimensions
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';

    const dimY = keyTopY - 25;
    ctx.beginPath();
    ctx.moveTo(-len_key / 2, keyTopY);
    ctx.lineTo(-len_key / 2, dimY);
    ctx.moveTo(len_key / 2, keyTopY);
    ctx.lineTo(len_key / 2, dimY);
    ctx.moveTo(-len_key / 2, dimY + 5);
    ctx.lineTo(len_key / 2, dimY + 5);
    ctx.stroke();
    ctx.fillText(`L = ${L.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, dimY);

    // Functional length Lf
    const dimY2 = -diam_shaft / 2 + depth1 + 25;
    ctx.beginPath();
    ctx.moveTo(-len_key / 2 + r_head, keyTopY + h_key);
    ctx.lineTo(-len_key / 2 + r_head, dimY2);
    ctx.moveTo(len_key / 2 - r_head, keyTopY + h_key);
    ctx.lineTo(len_key / 2 - r_head, dimY2);
    ctx.moveTo(-len_key / 2 + r_head, dimY2 - 5);
    ctx.lineTo(len_key / 2 - r_head, dimY2 - 5);
    ctx.stroke();
    ctx.fillText(`Lf = ${data.Lf_formA.toFixed(2)}`, 0, dimY2 + 15);

    ctx.restore();
  }

  /**
   * Mặt cắt ngang Then Bán Nguyệt (Woodruff Key Cross-Section)
   */
  drawWoodruffCrossSection(ctx) {
    const data = this.currentData;
    const d = data.d;
    const b = data.b;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;

    const pxPerUnit = 220 / (d * 0.9);
    const r_shaft = (d / 2) * pxPerUnit;
    const r_hub = r_shaft * 1.8;
    const w_key = b * pxPerUnit;
    const depth1 = t1 * pxPerUnit;
    const depth2 = t2 * pxPerUnit;

    ctx.save();
    // Hub
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r_hub, 0, Math.PI * 2);
    ctx.arc(0, 0, r_shaft, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    // Hub notch
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fillRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(-w_key / 2, -r_shaft - depth2, w_key, depth2);

    // Shaft
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r_shaft, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Shaft key slot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-w_key / 2, -r_shaft, w_key, depth1);
    ctx.strokeStyle = '#06b6d4';
    ctx.strokeRect(-w_key / 2, -r_shaft, w_key, depth1);

    // Woodruff key rectangular cross profile
    const topY = -r_shaft - depth2;
    const totalH = (h) * pxPerUnit;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.fillRect(-w_key / 2, topY, w_key, totalH);
    ctx.strokeRect(-w_key / 2, topY, w_key, totalH);

    // Annotations
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`b = ${data.b.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, -r_shaft - depth2 - 15);
    ctx.fillText(`Ø d = ${data.d.toFixed(2)}`, 0, r_shaft * 0.5);

    ctx.restore();
  }

  /**
   * Mặt cắt dọc Then Bán Nguyệt (Woodruff Key Longitudinal Section)
   */
  drawWoodruffLongitudinal(ctx) {
    const data = this.currentData;
    const d = data.d;
    const Dk = data.Dk;
    const h = data.h;
    const t1 = data.t1;
    const t2 = data.t2;

    const pxPerUnit = 220 / (d * 1.0);
    const r_shaft = (d / 2) * pxPerUnit;
    const diam_shaft = d * pxPerUnit;
    const len_shaft = Math.max(160, Dk * 1.6 * pxPerUnit);
    const Rk = (Dk / 2) * pxPerUnit;
    const depth1 = t1 * pxPerUnit;

    ctx.save();
    // Shaft body
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.fillRect(-len_shaft / 2, -r_shaft, len_shaft, diam_shaft);
    ctx.strokeRect(-len_shaft / 2, -r_shaft, len_shaft, diam_shaft);

    // Centerline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.beginPath();
    ctx.moveTo(-len_shaft / 2 - 20, 0);
    ctx.lineTo(len_shaft / 2 + 20, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Disc Center for Woodruff key
    // The disc bottom reaches -r_shaft + depth1
    const discCenterY = -r_shaft + depth1 - Rk;

    // Draw Woodruff Disc Key
    ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;

    const keyTopY = -r_shaft - t2 * pxPerUnit;
    const halfChord = Math.sqrt(Math.max(0, Rk * Rk - Math.pow(keyTopY - discCenterY, 2)));

    ctx.beginPath();
    ctx.moveTo(-halfChord, keyTopY);
    ctx.lineTo(halfChord, keyTopY);
    // Arc down to bottom
    const angleStart = Math.asin(Math.max(-1, Math.min(1, halfChord / Rk)));
    ctx.arc(0, discCenterY, Rk, Math.PI / 2 - angleStart, Math.PI / 2 + angleStart);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Annotations
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Woodruff ${data.keyName}`, 0, discCenterY + Rk + 25);
    ctx.fillText(`Dk = ${Dk.toFixed(2)}${data.isMetric ? ' mm' : ' in'}, L = ${data.L.toFixed(2)}`, 0, discCenterY + Rk + 45);

    ctx.restore();
  }

  /**
   * Mặt cắt ngang Then Hoa Răng Chữ Nhật (Straight-Sided Spline Cross-Section)
   */
  drawStraightSplineCrossSection(ctx) {
    const data = this.currentData;
    const n = data.n;
    const d = data.d; // minor
    const D = data.D; // major
    const b = data.b; // width

    const pxPerUnit = 220 / (D * 0.85);
    const r_minor = (d / 2) * pxPerUnit;
    const r_major = (D / 2) * pxPerUnit;
    const r_hub = r_major * 1.5;
    const halfB = (b / 2) * pxPerUnit;

    ctx.save();

    // 1. Hub outer body
    if (this.viewMode === 'assembly' || this.viewMode === 'hub') {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r_hub, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 2. Shaft Splines Profile (n teeth distributed evenly)
    if (this.viewMode === 'assembly' || this.viewMode === 'shaft') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;

      ctx.beginPath();
      const angleStep = (Math.PI * 2) / n;

      for (let i = 0; i < n; i++) {
        const theta = i * angleStep;
        // Tooth center at theta
        // Tangent unit vector: [-sin(theta), cos(theta)]
        // Radial unit vector: [cos(theta), sin(theta)]
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const tanX = -sinT;
        const tanY = cosT;

        // Tooth corners in major circle
        const p1x = r_major * cosT - halfB * tanX;
        const p1y = r_major * sinT - halfB * tanY;
        const p2x = r_major * cosT + halfB * tanX;
        const p2y = r_major * sinT + halfB * tanY;

        // Tooth corners in minor circle (root)
        const p0x = r_minor * cosT - halfB * tanX;
        const p0y = r_minor * sinT - halfB * tanY;
        const p3x = r_minor * cosT + halfB * tanX;
        const p3y = r_minor * sinT + halfB * tanY;

        if (i === 0) {
          ctx.moveTo(p0x, p0y);
        } else {
          ctx.lineTo(p0x, p0y);
        }
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);

        // Next tooth root arc
        const nextTheta = (i + 1) * angleStep;
        const nextCos = Math.cos(nextTheta);
        const nextSin = Math.sin(nextTheta);
        const nextTanX = -nextSin;
        const nextTanY = nextCos;
        const nextP0x = r_minor * nextCos - halfB * nextTanX;
        const nextP0y = r_minor * nextSin - halfB * nextTanY;

        const startAng = Math.atan2(p3y, p3x);
        const endAng = Math.atan2(nextP0y, nextP0x);
        ctx.arc(0, 0, r_minor, startAng, endAng);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Pitch circles & Reference lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, r_minor, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r_major, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Annotations
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${n} then | D = ${D.toFixed(2)}, d = ${d.toFixed(2)}, b = ${b.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, r_hub + 25);
    ctx.fillText(data.splineName, 0, r_hub + 45);

    ctx.restore();
  }

  /**
   * Mặt cắt dọc Then Hoa Răng Chữ Nhật (Longitudinal Section)
   */
  drawStraightSplineLongitudinal(ctx) {
    const data = this.currentData;
    const d = data.d;
    const D = data.D;
    const L = data.chosenL;

    const pxPerUnit = 220 / (L * 0.7);
    const len_spline = L * pxPerUnit;
    const len_shaft = len_spline * 1.5;
    const r_minor = (d / 2) * pxPerUnit;
    const r_major = (D / 2) * pxPerUnit;

    ctx.save();
    // Shaft body
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.fillRect(-len_shaft / 2, -r_minor, len_shaft, r_minor * 2);
    ctx.strokeRect(-len_shaft / 2, -r_minor, len_shaft, r_minor * 2);

    // Spline teeth ridges (raised to r_major)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.strokeStyle = '#fbbf24';
    ctx.fillRect(-len_spline / 2, -r_major, len_spline, r_major - r_minor);
    ctx.strokeRect(-len_spline / 2, -r_major, len_spline, r_major - r_minor);

    ctx.fillRect(-len_spline / 2, r_minor, len_spline, r_major - r_minor);
    ctx.strokeRect(-len_spline / 2, r_minor, len_spline, r_major - r_minor);

    // Centerline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.beginPath();
    ctx.moveTo(-len_shaft / 2 - 20, 0);
    ctx.lineTo(len_shaft / 2 + 20, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Length dimension
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`L = ${L.toFixed(2)}${data.isMetric ? ' mm' : ' in'}`, 0, -r_major - 25);

    ctx.restore();
  }

  downloadImage() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = `Keys_CAD_${this.jointType}_${this.sectionType}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}
