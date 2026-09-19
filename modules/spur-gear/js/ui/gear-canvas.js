/**
 * MITCalc Web App - 2D Interactive Gear Mesh Canvas Visualizer
 * Renders mating gear pair with true involute profiles, pitch/base/tip circles,
 * line of action, and real-time rotating animation.
 */

import { ToothProfileGenerator } from '../engine/tooth-profile-generator.js';

export class GearCanvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.geom = null;
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.rotationAngle = 0; // Animation angle
        this.isAnimating = false;
        this.animFrameId = null;
        this.animSpeed = 1.0;

        this.initEvents();
    }

    initEvents() {
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
            this.scale *= zoomFactor;
            this.scale = Math.max(0.1, Math.min(this.scale, 10.0));
            this.render();
        });

        // Mobile Touch Gestures: 1-finger pan, 2-finger pinch zoom
        let touchStartDist = 0;
        let touchStartScale = 1.0;
        let isTouchPanning = false;
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isTouchPanning = true;
                touchStartX = e.touches[0].clientX - this.panX;
                touchStartY = e.touches[0].clientY - this.panY;
            } else if (e.touches.length === 2) {
                isTouchPanning = false;
                touchStartDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                touchStartScale = this.scale;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isTouchPanning) {
                this.panX = e.touches[0].clientX - touchStartX;
                this.panY = e.touches[0].clientY - touchStartY;
                this.render();
            } else if (e.touches.length === 2 && touchStartDist > 0) {
                const currentDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const factor = currentDist / touchStartDist;
                this.scale = Math.max(0.1, Math.min(10.0, touchStartScale * factor));
                this.render();
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            isTouchPanning = false;
            touchStartDist = 0;
        }, { passive: true });
    }

    setGeometry(geom) {
        this.geom = geom;
        this.autoFit();
        this.render();
    }

    autoFit() {
        if (!this.geom) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = this.canvas.width = rect.width || this.canvas.parentElement?.clientWidth || 1200;
        const height = this.canvas.height = rect.height || 650;
        const totalLength = this.geom.aw + (this.geom.da1 + this.geom.da2) / 2.0;
        const maxDim = Math.max(totalLength, this.geom.da2);

        this.scale = (Math.min(width, height) * 0.78) / (maxDim || 300);
        this.panX = width / 2.0 - (this.geom.aw * this.scale) / 2.0;
        this.panY = height / 2.0;
    }

    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        const loop = () => {
            if (!this.isAnimating) return;
            this.rotationAngle += 0.008 * (this.animSpeed || 1.0);
            this.render();
            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.05, Math.min(speed, 10.0));
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const g = this.geom;

        ctx.clearRect(0, 0, 0, w, h);

        // Background grid
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, w, h);

        if (!g) return;

        ctx.save();
        ctx.translate(this.panX, this.panY);
        ctx.scale(this.scale, this.scale);

        // Pinion Center: (0, 0)
        // Gear Center: (aw, 0)
        const c1x = 0;
        const c1y = 0;
        const c2x = g.aw;
        const c2y = 0;

        // 1. Center Line & Reference Axis
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)'; // slate-500
        ctx.lineWidth = 1 / this.scale;
        ctx.setLineDash([6 / this.scale, 6 / this.scale]);
        ctx.beginPath();
        ctx.moveTo(-g.da1 * 0.7, 0);
        ctx.lineTo(g.aw + g.da2 * 0.7, 0);
        ctx.stroke();

        // Vertical centerline through Pinion
        ctx.beginPath();
        ctx.moveTo(0, -g.da1 * 0.6);
        ctx.lineTo(0, g.da1 * 0.6);
        ctx.stroke();

        // Vertical centerline through Gear
        ctx.beginPath();
        ctx.moveTo(g.aw, -g.da2 * 0.6);
        ctx.lineTo(g.aw, g.da2 * 0.6);
        ctx.stroke();

        // 2. Line of Action (Passing through Pitch Point C at working pressure angle)
        const alphaWtRad = (g.alfawt || g.alfa_n) * Math.PI / 180.0;
        const pitchPointX = g.dw1 / 2.0;
        const loaLen = Math.min(g.da1, g.da2) * 0.45;
        const cosA = Math.cos(alphaWtRad);
        const sinA = Math.sin(alphaWtRad);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // red-500 line of action
        ctx.lineWidth = 1 / this.scale;
        ctx.setLineDash([4 / this.scale, 4 / this.scale]);
        ctx.beginPath();
        ctx.moveTo(pitchPointX - loaLen * sinA, -loaLen * cosA);
        ctx.lineTo(pitchPointX + loaLen * sinA, loaLen * cosA);
        ctx.stroke();

        // 3. Operating Pitch Circles (dw1, dw2) - Subtle dashed engineering line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; // sky-400
        ctx.lineWidth = 1.2 / this.scale;
        ctx.setLineDash([5 / this.scale, 5 / this.scale]);
        ctx.beginPath();
        ctx.arc(c1x, c1y, g.dw1 / 2.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c2x, c2y, g.dw2 / 2.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash for gear bodies

        // 4. Involute Tooth Outlines (Transverse Cross-Section):
        const isHelical = Math.abs(g.beta || 0) > 1e-4;
        const betaRad = (g.beta || 0) * Math.PI / 180.0;
        const m_canvas = isHelical ? (g.mt || (g.mn / Math.cos(betaRad))) : g.mn;
        const alpha_canvas = isHelical ? (g.alfat || (Math.atan(Math.tan((g.alfa_n || 20) * Math.PI / 180.0) / Math.cos(betaRad)) * 180.0 / Math.PI)) : g.alfa_n;

        // Draw Pinion (Green)
        ctx.save();
        ctx.translate(c1x, c1y);
        ctx.rotate(this.rotationAngle);
        this.drawGearOutline(g.z1, m_canvas, alpha_canvas, g.x1, g.d1, g.db1, g.da1, g.df1, '#22c55e', '#15803d');
        ctx.restore();

        // Draw Gear (Blue)
        ctx.save();
        ctx.translate(c2x, c2y);
        // Conjugate meshing phase offset: opposite rotation, tooth entering space cleanly
        // Exact conjugate rolling phase: gap of Gear 2 aligns with tooth of Pinion 1
        const pitchAngle2 = (2.0 * Math.PI) / g.z2;
        const phaseOffset = Math.PI + (pitchAngle2 / 2.0);
        const angle2 = phaseOffset - this.rotationAngle * (g.z1 / g.z2);
        ctx.rotate(angle2);
        this.drawGearOutline(g.z2, m_canvas, alpha_canvas, g.x2, g.d2, g.db2, g.da2, g.df2, '#38bdf8', '#1d4ed8');
        ctx.restore();

        // 5. Operating Pitch Point C
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.beginPath();
        ctx.arc(pitchPointX, 0, 3.5 / this.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawGearOutline(z, m, alpha, x, d, db, da, df, strokeColor, fillColor) {
        const ctx = this.ctx;
        const pts = ToothProfileGenerator.generateProfile(z, m, alpha, x, d, db, da, df);
        if (!pts || pts.length === 0) return;

        // Draw gear outer profile with smooth filled body
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = fillColor + '26'; // 15% opacity fill
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.6 / this.scale;
        ctx.stroke();

        // Center shaft hole with keyway
        const boreRadius = (df / 2.0) * 0.38;
        const kwWidth = boreRadius * 0.32;
        const kwDepth = boreRadius * 0.22;

        ctx.fillStyle = '#0f172a'; // match background
        ctx.beginPath();
        // Bore circle with top keyway notch
        const kwHalfAng = Math.asin(Math.min(1.0, (kwWidth / 2.0) / boreRadius));
        ctx.arc(0, 0, boreRadius, -Math.PI / 2 + kwHalfAng, 3 * Math.PI / 2 - kwHalfAng);
        ctx.lineTo(-kwWidth / 2.0, -boreRadius - kwDepth);
        ctx.lineTo(kwWidth / 2.0, -boreRadius - kwDepth);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2 / this.scale;
        ctx.stroke();
    }
}
