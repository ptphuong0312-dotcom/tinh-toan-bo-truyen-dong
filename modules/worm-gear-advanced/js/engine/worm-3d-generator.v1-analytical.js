/**
 * ============================================================================
 * MITCALC WEB APP - 3D WORM GEAR SOLID & SURFACE MESH GENERATOR (V1 ARCHIVE)
 * ============================================================================
 * Archived v1 implementation (Analytical C1 Root Fillet + S-Curve Chamfer +
 * Radial-Axial Globoid Envelope) preserved per SirPhuong's instruction.
 * ============================================================================
 */

const Worm3DGeneratorV1 = {
    getDensitySettings(level = 6, z1 = 1, z2 = 40) {
        const lvl = Math.max(1, Math.min(8, parseInt(level) || 6));
        const table = {
            1: { wormSlicesPerPitch: 18, wormPtsPerStart: 36, wheelSlices: 9,  wheelPtsPerFlank: 6,  wheelPtsFillet: 3 },
            2: { wormSlicesPerPitch: 24, wormPtsPerStart: 48, wheelSlices: 11, wheelPtsPerFlank: 8,  wheelPtsFillet: 4 },
            3: { wormSlicesPerPitch: 30, wormPtsPerStart: 60, wheelSlices: 13, wheelPtsPerFlank: 10, wheelPtsFillet: 4 },
            4: { wormSlicesPerPitch: 36, wormPtsPerStart: 72, wheelSlices: 15, wheelPtsPerFlank: 12, wheelPtsFillet: 5 },
            5: { wormSlicesPerPitch: 44, wormPtsPerStart: 88, wheelSlices: 19, wheelPtsPerFlank: 14, wheelPtsFillet: 5 },
            6: { wormSlicesPerPitch: 54, wormPtsPerStart: 108, wheelSlices: 23, wheelPtsPerFlank: 16, wheelPtsFillet: 6 },
            7: { wormSlicesPerPitch: 64, wormPtsPerStart: 128, wheelSlices: 27, wheelPtsPerFlank: 20, wheelPtsFillet: 7 },
            8: { wormSlicesPerPitch: 76, wormPtsPerStart: 144, wheelSlices: 31, wheelPtsPerFlank: 24, wheelPtsFillet: 8 }
        };
        const cfg = table[lvl] || table[6];
        const minTotalPts = Math.max(72, cfg.wormPtsPerStart);
        const ptsPerStart = Math.max(28, Math.ceil(minTotalPts / Math.max(1, z1)));
        return {
            wormSlicesPerPitch: cfg.wormSlicesPerPitch,
            wormPtsPerStart: ptsPerStart,
            wheelSlices: cfg.wheelSlices,
            wheelPtsPerFlank: cfg.wheelPtsPerFlank,
            wheelPtsFillet: cfg.wheelPtsFillet
        };
    },

    evalWormThreadProfile(uNorm, params) {
        const {
            r1, ra1, rf1, px, sx1, alfax, rf1_mm, toothType
        } = params;

        const absU = Math.min(0.5, Math.max(0.0, Math.abs(uNorm)));
        const xAbs = absU * px;

        const ha1 = Math.max(0.1, ra1 - r1);
        const hf1 = Math.max(0.1, r1 - rf1);
        const tanA = Math.tan(Math.max(0.15, Math.min(0.75, alfax)));
        const sinA = Math.sin(alfax);
        const cosA = Math.cos(alfax);

        const halfSx1 = Math.min(px * 0.42, Math.max(px * 0.12, sx1 * 0.5));
        const xTip = Math.max(0.03 * px, halfSx1 - ha1 * tanA);
        const xFlankRoot = Math.min(px * 0.47, halfSx1 + hf1 * tanA);

        const maxRf = Math.min(
            rf1_mm,
            0.75 * hf1,
            Math.max(0.05, (px * 0.49 - xFlankRoot) * ((1.0 + sinA) / cosA))
        );
        const Rf = Math.max(0.02 * hf1, maxRf);
        const rT = rf1 + Rf * (1.0 - sinA);
        const xT = halfSx1 + (r1 - rT) * tanA;
        const xR = xT + Rf * cosA;

        const crownFactor = (toothType === 3) ? 0.012 : ((toothType === 4) ? -0.010 : ((toothType === 2) ? 0.005 : 0.0));

        if (xAbs <= xTip) {
            return { r: ra1, zone: 'tip_land', isFlank: false, flankSide: 0 };
        } else if (xAbs <= xT) {
            const t = (xAbs - xTip) / Math.max(1e-6, xT - xTip);
            let rLin = ra1 - t * (ra1 - rT);
            rLin += crownFactor * (ha1 + hf1) * (4.0 * t * (1.0 - t));
            return {
                r: Math.max(rf1, Math.min(ra1, rLin)),
                zone: 'flank',
                isFlank: true,
                flankSide: uNorm >= 0 ? 1 : 2
            };
        } else if (xAbs <= xR) {
            const dx = Math.max(0.0, Math.min(Rf * cosA, xR - xAbs));
            const rFillet = rf1 + Rf - Math.sqrt(Math.max(0.0, Rf * Rf - dx * dx));
            return {
                r: Math.max(rf1, Math.min(rT, rFillet)),
                zone: 'fillet',
                isFlank: false,
                flankSide: 0
            };
        } else {
            return { r: rf1, zone: 'root_land', isFlank: false, flankSide: 0 };
        }
    },

    generateWheelSliceContour(sliceOpt) {
        const {
            z2, rPitch_s, rTip_s, rRoot_s, sx2, alfax, rf2_mm, ptsPerFlank, ptsFillet
        } = sliceOpt;

        const pitchAngle = (2.0 * Math.PI) / z2;
        const halfPitch = 0.5 * pitchAngle;
        const ha_s = Math.max(0.05, rTip_s - rPitch_s);
        const hf_s = Math.max(0.05, rPitch_s - rRoot_s);

        const px_s = (2.0 * Math.PI * rPitch_s) / z2;
        const ex2 = Math.max(0.25 * px_s, Math.min(0.75 * px_s, px_s - sx2));

        const tanA = Math.tan(Math.max(0.15, Math.min(0.70, alfax)));
        const sinA = Math.sin(alfax);
        const cosA = Math.cos(alfax);

        const sPitch = 0.5 * ex2;
        const sRootNominal = Math.max(0.04 * px_s, sPitch - hf_s * tanA);
        const sTip = Math.min(0.46 * px_s, sPitch + ha_s * tanA);

        const maxRf = Math.min(
            rf2_mm,
            0.70 * hf_s,
            Math.max(0.02, sRootNominal * ((1.0 + sinA) / cosA) * 0.85)
        );
        const Rf = Math.max(0.02 * hf_s, maxRf);
        const rFilletTop = rRoot_s + Rf * (1.0 - sinA);
        const sFilletTop = sPitch - (rPitch_s - rFilletTop) * tanA;
        const sFilletRoot = Math.max(0.01 * px_s, sFilletTop - Rf * cosA);

        const rightHalf = [];
        rightHalf.push({ theta: 0.0, r: rRoot_s, isFlank: false });
        if (sFilletRoot > 1e-4) {
            rightHalf.push({ theta: (0.5 * sFilletRoot) / rPitch_s, r: rRoot_s, isFlank: false });
            rightHalf.push({ theta: sFilletRoot / rPitch_s, r: rRoot_s, isFlank: false });
        }

        for (let k = 1; k <= ptsFillet; k++) {
            const tau = k / ptsFillet;
            const s = sFilletRoot + tau * (sFilletTop - sFilletRoot);
            const ds = Math.max(0.0, Math.min(Rf * cosA, s - sFilletRoot));
            const r = rRoot_s + Rf - Math.sqrt(Math.max(0.0, Rf * Rf - ds * ds));
            rightHalf.push({ theta: s / rPitch_s, r: Math.max(rRoot_s, Math.min(rFilletTop, r)), isFlank: false });
        }

        for (let k = 1; k <= ptsPerFlank; k++) {
            const t = k / ptsPerFlank;
            const r = rFilletTop + t * (rTip_s - rFilletTop);
            const s = sFilletTop + t * (sTip - sFilletTop);
            rightHalf.push({
                theta: Math.min(halfPitch * 0.96, s / rPitch_s),
                r: Math.max(rRoot_s, Math.min(rTip_s, r)),
                isFlank: true
            });
        }

        const thetaTip = rightHalf[rightHalf.length - 1].theta;
        const ptsTip = 3;
        for (let k = 1; k <= ptsTip; k++) {
            const frac = k / ptsTip;
            const th = thetaTip + frac * (halfPitch - thetaTip);
            rightHalf.push({ theta: th, r: rTip_s, isFlank: false });
        }

        const fullPeriod = [];
        for (let i = rightHalf.length - 1; i >= 1; i--) {
            fullPeriod.push({
                theta: -rightHalf[i].theta,
                r: rightHalf[i].r,
                isFlank: rightHalf[i].isFlank
            });
        }
        for (let i = 0; i < rightHalf.length - 1; i++) {
            fullPeriod.push({
                theta: +rightHalf[i].theta,
                r: rightHalf[i].r,
                isFlank: rightHalf[i].isFlank
            });
        }
        return fullPeriod;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Worm3DGeneratorV1;
}
