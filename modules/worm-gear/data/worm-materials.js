/**
 * MITCalc Web App - Worm Gear Materials & Standard Lookup Tables (Module 3)
 * 100% 1-to-1 Extraction from C:\MITCalc\gear4\Gear4_01.xlsb (Material & Tables sheets)
 */

const WORM_WHEEL_MATERIALS = [
    {
        id: 1,
        fullName: "User material 1",
        name: "User material 1",
        designation: "",
        density: 8800.0,
        matTypeW: 1, // 1=Bronze, 2=Cast Iron, 3=Al Bronze
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0], // [Mineral, PAO, PEG]
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 2,
        fullName: "User material 2",
        name: "User material 2",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 3,
        fullName: "User material 3",
        name: "User material 3",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 4,
        fullName: "User material 4",
        name: "User material 4",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 5,
        fullName: "User material 5",
        name: "User material 5",
        designation: "",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 150.0,
        coreHardnessHV: 200.0,
        surfaceHardnessHV: 200.0,
        shlim: 400.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 400.0,
        tauFlimT: 100.0,
        ynlMode: "fixed1"
    },
    {
        id: 6,
        fullName: "Tinbronze CuSn12-C-GZ (DIN EN 1982) (Rm=280 MPa)",
        name: "Tinbronze",
        designation: "CuSn12-C-GZ (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 280.0,
        rp02: 150.0,
        coreHardnessHV: 190.0,
        surfaceHardnessHV: 190.0,
        shlim: 430.0,
        sflim: 315.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 88.3,
        poissonRatio: 0.35,
        wml: [1.6, 1.6, 2.25],
        yw: 1.0,
        sigmaHlimT: 425.0,
        tauFlimT: 92.0,
        ynlMode: "bronze"
    },
    {
        id: 7,
        fullName: "Bronze (centrifugal cast) CuSn12Ni2-C-GZ (DIN EN 1982) (Rm=300 MPa)",
        name: "Bronze (centrifugal cast)",
        designation: "CuSn12Ni2-C-GZ (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 180.0,
        coreHardnessHV: 230.0,
        surfaceHardnessHV: 230.0,
        shlim: 510.0,
        sflim: 325.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.35,
        wml: [1.0, 1.0, 1.75],
        yw: 0.95,
        sigmaHlimT: 520.0,
        tauFlimT: 100.0,
        ynlMode: "bronze"
    },
    {
        id: 8,
        fullName: "Bronze (continuous casting) CuSn12Ni2-C-GC (DIN EN 1982) (Rm=300 MPa)",
        name: "Bronze (continuous casting)",
        designation: "CuSn12Ni2-C-GC (DIN EN 1982)",
        density: 8800.0,
        matTypeW: 1,
        group: "X",
        rm: 300.0,
        rp02: 180.0,
        coreHardnessHV: 250.0,
        surfaceHardnessHV: 250.0,
        shlim: 550.0,
        sflim: 345.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.35,
        wml: [4.1, 4.1, 4.1],
        yw: 0.95,
        sigmaHlimT: 520.0,
        tauFlimT: 100.0,
        ynlMode: "bronze"
    },
    {
        id: 9,
        fullName: "Aluminium Bronze CuAl10Fe5Ni5-C-GZ (DIN EN 1982) (Rm=700 MPa)",
        name: "Aluminium Bronze",
        designation: "CuAl10Fe5Ni5-C-GZ (DIN EN 1982)",
        density: 7400.0,
        matTypeW: 3,
        group: "X",
        rm: 700.0,
        rp02: 300.0,
        coreHardnessHV: 150.0,
        surfaceHardnessHV: 150.0,
        shlim: 420.0,
        sflim: 300.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 122.6,
        poissonRatio: 0.35,
        wml: [1.0, 1.0, 1.0],
        yw: 1.1,
        sigmaHlimT: 660.0,
        tauFlimT: 128.0,
        ynlMode: "albronze"
    },
    {
        id: 10,
        fullName: "SG Cast iron EN-GJS-400-15 (DIN EN 1563) (Rm=400 MPa)",
        name: "SG Cast iron",
        designation: "EN-GJS-400-15 (DIN EN 1563)",
        density: 7000.0,
        matTypeW: 2,
        group: "X",
        rm: 400.0,
        rp02: 250.0,
        coreHardnessHV: 180.0,
        surfaceHardnessHV: 180.0,
        shlim: 480.0,
        sflim: 336.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 175.0,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.0,
        sigmaHlimT: 490.0,
        tauFlimT: 115.0,
        ynlMode: "gjs"
    },
    {
        id: 11,
        fullName: "Cast iron EN-GJL-250 (DIN EN 1561) (Rm=250 MPa)",
        name: "Cast iron",
        designation: "EN-GJL-250 (DIN EN 1561)",
        density: 7000.0,
        matTypeW: 2,
        group: "X",
        rm: 250.0,
        rp02: 165.0,
        coreHardnessHV: 210.0,
        surfaceHardnessHV: 210.0,
        shlim: 540.0,
        sflim: 372.0,
        nhlim: 50000000.0,
        nflim: 3000000.0,
        qh: 10.0,
        qf: 6.0,
        elasticModulus: 98.1,
        poissonRatio: 0.3,
        wml: [1.0, 1.0, 1.0],
        yw: 1.05,
        sigmaHlimT: 350.0,
        tauFlimT: 70.0,
        ynlMode: "gjl"
    }
];

const WORM_STD_TABLES = {
    // T_ToothType (Tables!B7:B11)
    T_ToothType: [
        { id: 1, code: "ZA", label: "ZA (A) Wormgear — Trục vít Ác-si-mét (Archimedean)" },
        { id: 2, code: "ZN", label: "ZN (N) Wormgear — Trục vít কনボリュート pháp tuyến (Normal Straight)" },
        { id: 3, code: "ZI", label: "ZI (I) Wormgear — Trục vít Thân khai (Involute)" },
        { id: 4, code: "ZK", label: "ZK (K) Wormgear — Trục vít Gia công bằng đá mài/dao côn (Cone Milled)" },
        { id: 5, code: "ZH", label: "ZH (C) Wormgear — Trục vít Biên dạng lõm Cavex (Concave Profile)" }
    ],

    // T_DesignCooling (Tables!B31:G33)
    T_DesignCooling: [
        { id: 1, label: "Worm oil bath lubrication (Ngâm dầu trục vít)", indexOffset: 3 },
        { id: 2, label: "Worm gear oil bath lubrication (Ngâm dầu bánh vít)", indexOffset: 3 },
        { id: 3, label: "Oil-spray lubrication (Phun dầu cưỡng bức)", indexOffset: 0 }
    ],

    // T_OilType (Tables!B26:E28)
    T_OilType: [
        { id: 1, label: "Mineral oil (Dầu khoáng)", Zoil: 0.89, calfa: 1.7e-8, kp: 0.0007 },
        { id: 2, label: "Oil based on polyalphaolefins (PAO - Dầu tổng hợp PAO)", Zoil: 0.94, calfa: 1.4e-8, kp: 0.00076 },
        { id: 3, label: "Oil based on Polyglycols (PEG - Dầu tổng hợp Polyglycol)", Zoil: 1.0, calfa: 1.3e-8, kp: 0.00077 }
    ],

    // T_Lubricant (Tables!B70:E79)
    T_Lubricant: [
        { id: 1, label: "ISO VG - 32", ro15: 0.984, ny40: 32.0, ny100: 6.5 },
        { id: 2, label: "ISO VG - 46      (AGMA no 1)", ro15: 1.035, ny40: 46.0, ny100: 9.0 },
        { id: 3, label: "ISO VG - 80", ro15: 1.04, ny40: 80.0, ny100: 15.0 },
        { id: 4, label: "ISO VG - 100    (AGMA no 3)", ro15: 1.043, ny40: 100.0, ny100: 20.0 },
        { id: 5, label: "ISO VG - 150    (AGMA no 4)", ro15: 1.05, ny40: 150.0, ny100: 29.0 },
        { id: 6, label: "ISO VG - 220    (AGMA no 5)", ro15: 1.06, ny40: 220.0, ny100: 40.0 },
        { id: 7, label: "ISO VG - 320    (AGMA no 6)", ro15: 1.067, ny40: 320.0, ny100: 54.0 },
        { id: 8, label: "ISO VG - 460    (AGMA no 7)", ro15: 1.074, ny40: 460.0, ny100: 71.0 },
        { id: 9, label: "ISO VG - 680    (AGMA no 8)", ro15: 1.075, ny40: 680.0, ny100: 110.0 },
        { id: 10, label: "ISO VG - 1000  (AGMA no 9)", ro15: 1.075, ny40: 1000.0, ny100: 167.0 }
    ],

    // T_BearingTyp (Tables!B45:B47)
    T_BearingTyp: [
        { id: 1, label: "A..Fixed/fixed bearing (Ổ đỡ cố định - cố định)" },
        { id: 2, label: "B..Fixed/floating bearing (Ổ đỡ cố định - tùy động)" },
        { id: 3, label: "C..Friction bearing (Ổ trượt)" }
    ],

    // T_LoadType (Tables!B343:B346)
    T_LoadType: [
        { id: 1, label: "A...Continuous (Tải êm, liên tục)" },
        { id: 2, label: "B...Light shocks (Va đập nhẹ)" },
        { id: 3, label: "C...Moderate shocks (Va đập vừa)" },
        { id: 4, label: "D...Heavy shocks (Va đập mạnh)" }
    ],

    // T_KAcoef (Tables!C337:F340) [LoadTypeA - 1][LoadTypeB - 1]
    T_KAcoef: [
        [1.00, 1.25, 1.50, 1.75],
        [1.10, 1.35, 1.60, 1.85],
        [1.25, 1.50, 1.75, 2.00],
        [1.50, 1.75, 2.00, 2.25]
    ],

    // T_Diam_q (Tables!B82:B99)
    T_Diam_q: [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0],

    // T_Module (Tables!B103:E123)
    T_Module: [
        { id: 1, m: 0.5, dp: 40.0 },
        { id: 2, m: 0.6, dp: 32.0 },
        { id: 3, m: 0.8, dp: 24.0 },
        { id: 4, m: 1.0, dp: 20.0 },
        { id: 5, m: 1.25, dp: 16.0 },
        { id: 6, m: 1.6, dp: 14.0 },
        { id: 7, m: 2.0, dp: 12.0 },
        { id: 8, m: 2.5, dp: 10.0 },
        { id: 9, m: 3.15, dp: 8.0 },
        { id: 10, m: 4.0, dp: 6.0 },
        { id: 11, m: 4.233333333333333, dp: 6.0, label: "4.2333 (DP 6)" },
        { id: 12, m: 5.0, dp: 5.0 },
        { id: 13, m: 6.3, dp: 4.0 },
        { id: 14, m: 8.0, dp: 3.0 },
        { id: 15, m: 10.0, dp: 2.5 },
        { id: 16, m: 12.5, dp: 2.0 },
        { id: 17, m: 16.0, dp: 1.5 },
        { id: 18, m: 20.0, dp: 1.25 },
        { id: 19, m: 25.0, dp: 1.0 },
        { id: 20, m: 32.0, dp: 0.75 },
        { id: 21, m: 40.0, dp: 0.6 },
        { id: 22, m: 50.0, dp: 0.5 }
    ],

    // Pure 21 rows of T_Module in Gear4_01.xlsb Tables!B103:E123 (used by AxisDistTbl)
    T_Module_Excel21: [
        0.5, 0.6, 0.8, 1.0, 1.25, 1.6, 2.0, 2.5, 3.15, 4.0, 5.0,
        6.3, 8.0, 10.0, 12.5, 16.0, 20.0, 25.0, 32.0, 40.0, 50.0
    ],

    // T_Alfa0 (Tables!B158:D164)
    T_Alfa0: [14.5, 17.5, 20.0, 22.5, 25.0, 27.5, 30.0],

    // T_gamaProp (Tables!B167:B178)
    T_gamaProp: [2.0, 3.0, 4.0, 5.0, 7.0, 9.0, 11.0, 14.0, 17.0, 21.0, 25.0, 30.0],

    // T_i (Tables!B299:C331)
    T_i: [
        { label: "5.00", val: 5.0 },
        { label: "*5.60", val: 5.6 },
        { label: "6.30", val: 6.3 },
        { label: "*7.10", val: 7.1 },
        { label: "8.00", val: 8.0 },
        { label: "*9.00", val: 9.0 },
        { label: "10.00", val: 10.0 },
        { label: "*11.20", val: 11.2 },
        { label: "12.50", val: 12.5 },
        { label: "*14.00", val: 14.0 },
        { label: "16.00", val: 16.0 },
        { label: "*18.00", val: 18.0 },
        { label: "20.00", val: 20.0 },
        { label: "*22.40", val: 22.4 },
        { label: "25.00", val: 25.0 },
        { label: "*28.00", val: 28.0 },
        { label: "31.50", val: 31.5 },
        { label: "*35.50", val: 35.5 },
        { label: "40.00", val: 40.0 },
        { label: "*45.00", val: 45.0 },
        { label: "50.00", val: 50.0 },
        { label: "*56.00", val: 56.0 },
        { label: "63.00", val: 63.0 },
        { label: "*71.00", val: 71.0 },
        { label: "80.00", val: 80.0 },
        { label: "*90.00", val: 90.0 },
        { label: "100.00", val: 100.0 },
        { label: "*112.00", val: 112.0 },
        { label: "125.00", val: 125.0 },
        { label: "*140.00", val: 140.0 },
        { label: "160.00", val: 160.0 },
        { label: "*180.00", val: 180.0 },
        { label: "200.00", val: 200.0 }
    ],

    // T_av (Tables!B262:C296)
    T_av: [
        { label: "40", val: 40 },
        { label: "50", val: 50 },
        { label: "63", val: 63 },
        { label: "*71", val: 71 },
        { label: "80", val: 80 },
        { label: "*90", val: 90 },
        { label: "100", val: 100 },
        { label: "*112", val: 112 },
        { label: "125", val: 125 },
        { label: "*140", val: 140 },
        { label: "160", val: 160 },
        { label: "*180", val: 180 },
        { label: "200", val: 200 },
        { label: "*224", val: 224 },
        { label: "250", val: 250 },
        { label: "*280", val: 280 },
        { label: "315", val: 315 },
        { label: "*355", val: 355 },
        { label: "400", val: 400 },
        { label: "*450", val: 450 },
        { label: "500", val: 500 }
    ]
};

if (typeof window !== 'undefined') {
    window.WORM_WHEEL_MATERIALS = WORM_WHEEL_MATERIALS;
    window.WORM_STD_TABLES = WORM_STD_TABLES;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WORM_WHEEL_MATERIALS, WORM_STD_TABLES };
}
