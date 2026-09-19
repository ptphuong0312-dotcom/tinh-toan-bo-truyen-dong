/**
 * MITCalc Web App - Standard Engineering Tables
 * Module series, axis distances, gear ratios, basic racks, and ISO 6336 factors
 */

export const StandardTables = {
    // Standard Normal Modules [mm] per ISO 54 / DIN 780
    modules: [
        { val: 0.5, series: 1 },
        { val: 0.55, series: 2 },
        { val: 0.6, series: 1 },
        { val: 0.7, series: 2 },
        { val: 0.8, series: 1 },
        { val: 0.9, series: 2 },
        { val: 1.0, series: 1 },
        { val: 1.125, series: 2 },
        { val: 1.25, series: 1 },
        { val: 1.375, series: 2 },
        { val: 1.5, series: 1 },
        { val: 1.75, series: 2 },
        { val: 2.0, series: 1 },
        { val: 2.25, series: 2 },
        { val: 2.5, series: 1 },
        { val: 2.75, series: 2 },
        { val: 3.0, series: 1 },
        { val: 3.5, series: 2 },
        { val: 4.0, series: 1 },
        { val: 4.5, series: 2 },
        { val: 5.0, series: 1 },
        { val: 5.5, series: 2 },
        { val: 6.0, series: 1 },
        { val: 7.0, series: 2 },
        { val: 8.0, series: 1 },
        { val: 9.0, series: 2 },
        { val: 10.0, series: 1 },
        { val: 11.0, series: 2 },
        { val: 12.0, series: 1 },
        { val: 14.0, series: 2 },
        { val: 16.0, series: 1 },
        { val: 18.0, series: 2 },
        { val: 20.0, series: 1 },
        { val: 22.0, series: 2 },
        { val: 25.0, series: 1 },
        { val: 28.0, series: 2 },
        { val: 32.0, series: 1 },
        { val: 36.0, series: 2 },
        { val: 40.0, series: 1 },
        { val: 45.0, series: 2 },
        { val: 50.0, series: 1 }
    ],

    // Standard Center Distances [mm] per ISO 286
    axisDistances: [
        40, 50, 63, 71, 80, 90, 100, 112, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250
    ],

    // Standard Transmission Ratios
    transmissionRatios: [
        1.0, 1.12, 1.25, 1.4, 1.6, 1.8, 2.0, 2.24, 2.5, 2.8, 3.15, 3.55, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10.0
    ],

    // Standard Basic Rack Tooth Profiles (DIN 867, ANSI B6.1, ISO 53)
    rackProfiles: [
        { id: 1, name: 'DIN 867 (Standard Metric)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 },
        { id: 2, name: 'ANSI B6.1 (Standard Inch)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.30, ca: 0.35 },
        { id: 3, name: 'ISO 53 Profile A', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 },
        { id: 4, name: 'ISO 53 Profile B (High load)', alpha: 20, ha0: 1.20, hf0: 1.00, ra0: 0.30, ca: 0.20 },
        { id: 5, name: 'ISO 53 Profile C (Fine pitch)', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.25, ca: 0.25 },
        { id: 6, name: 'Custom Tool / Profile', alpha: 20, ha0: 1.25, hf0: 1.00, ra0: 0.38, ca: 0.25 }
    ],

    // Application Factor KA (ISO 6336-1)
    applicationFactors: {
        // [driveMachine][drivenMachine]
        // 1: Uniform, 2: Light shocks, 3: Moderate shocks, 4: Heavy shocks
        matrix: [
            [1.00, 1.25, 1.50, 1.75], // Electric motor, steam turbine (Uniform)
            [1.10, 1.35, 1.60, 1.85], // Multi-cylinder IC engine (Light shocks)
            [1.25, 1.50, 1.75, 2.00], // Single-cylinder IC engine (Moderate shocks)
            [1.50, 1.75, 2.00, 2.25]  // Variable speed, rough shocks
        ],
        driveExamples: [
            { id: 0, name_vn: 'Động cơ điện, Tua-bin hơi (Êm, đồng đều)', name_en: 'Electric motor, Steam turbine (Uniform)' },
            { id: 1, name_vn: 'Động cơ đốt trong nhiều xy-lanh (Va đập nhẹ)', name_en: 'Multi-cylinder IC engine (Light shocks)' },
            { id: 2, name_vn: 'Động cơ đốt trong 1 xy-lanh (Va đập trung bình)', name_en: 'Single-cylinder IC engine (Moderate shocks)' },
            { id: 3, name_vn: 'Tải không ổn định, rung lắc mạnh (Va đập nặng)', name_en: 'Rough shocks, variable drives (Heavy shocks)' }
        ],
        drivenExamples: [
            { id: 0, name_vn: 'Máy phát điện, Quạt ly tâm, Băng tải nhẹ (Tải đều)', name_en: 'Generator, Centrifugal fan, Light conveyor (Uniform)' },
            { id: 1, name_vn: 'Máy công cụ, Máy nén ly tâm, Bơm piston nhiều xy-lanh', name_en: 'Machine tools, Centrifugal compressor, Multi-cylinder pump' },
            { id: 2, name_vn: 'Máy trộn, Tời nâng, Máy dệt, Máy nén piston 1 xy-lanh', name_en: 'Mixers, Hoists, Textile machines, Single-cylinder compressor' },
            { id: 3, name_vn: 'Máy nghiền đá, Máy cán thép, Máy đào, Máy xúc', name_en: 'Crushers, Rolling mills, Excavators, Heavy impact' }
        ]
    },

    // Gear Mounting Types
    mountings: [
        { id: 1, type: 'A', name_vn: 'Hai đầu đối xứng - Loại 1 (Ổ bi cứng vững)', name_en: 'Double-sided symmetrically supported - Type 1', psi_d_max: 1.6 },
        { id: 2, type: 'A2', name_vn: 'Hai đầu đối xứng - Loại 2 (Vỏ hộp đàn hồi)', name_en: 'Double-sided symmetrically supported - Type 2', psi_d_max: 1.4 },
        { id: 3, type: 'B', name_vn: 'Hai đầu không đối xứng - Loại 1 (Ổ bi cứng vững)', name_en: 'Double-sided non-symmetrically supported - Type 1', psi_d_max: 1.2 },
        { id: 4, type: 'B2', name_vn: 'Hai đầu không đối xứng - Loại 2 (Vỏ hộp đàn hồi)', name_en: 'Double-sided non-symmetrically supported - Type 2', psi_d_max: 1.0 },
        { id: 5, type: 'C', name_vn: 'Một đầu trục chìa (Công xôn / Overhung)', name_en: 'Single-sided overhung / Cantilever', psi_d_max: 0.6 }
    ],

    // ISO 1328 Accuracy Grades
    accuracyGrades: [
        { grade: 3, name: 'Cấp 3 (Siêu chính xác / Master gears)', v_max: 50, ra_max: 0.4 },
        { grade: 4, name: 'Cấp 4 (Độ chính xác rất cao / Tua-bin cao tốc)', v_max: 35, ra_max: 0.4 },
        { grade: 5, name: 'Cấp 5 (Chính xác cao / Hộp số ô tô, máy bay)', v_max: 25, ra_max: 0.8 },
        { grade: 6, name: 'Cấp 6 (Chính xác / Máy công cụ chính xác)', v_max: 18, ra_max: 0.8 },
        { grade: 7, name: 'Cấp 7 (Tiêu chuẩn công nghiệp phổ biến)', v_max: 12, ra_max: 1.6 },
        { grade: 8, name: 'Cấp 8 (Công nghiệp trung bình / Hộp giảm tốc thông dụng)', v_max: 8, ra_max: 3.2 },
        { grade: 9, name: 'Cấp 9 (Tải chậm, máy nông nghiệp, cơ khí xây dựng)', v_max: 4, ra_max: 6.3 },
        { grade: 10, name: 'Cấp 10 (Vận tốc thấp, truyền động thô)', v_max: 2, ra_max: 6.3 },
        { grade: 11, name: 'Cấp 11 (Bánh răng đúc / Cắt thô)', v_max: 1, ra_max: 12.5 },
        { grade: 12, name: 'Cấp 12 (Bánh răng hở, tốc độ rất chậm)', v_max: 0.5, ra_max: 12.5 }
    ],

    // Lubricants (ISO VG)
    lubricants: [
        { id: 1, name: 'ISO VG 32 (Dầu loãng)', nu40: 32, nu50: 22 },
        { id: 2, name: 'ISO VG 46 (Dầu nhẹ)', nu40: 46, nu50: 31 },
        { id: 3, name: 'ISO VG 68 (Dầu trung bình)', nu40: 68, nu50: 45 },
        { id: 4, name: 'ISO VG 100 (Dầu hộp số nhẹ)', nu40: 100, nu50: 65 },
        { id: 5, name: 'ISO VG 150 (Dầu hộp số tiêu chuẩn)', nu40: 150, nu50: 95 },
        { id: 6, name: 'ISO VG 220 (Dầu hộp số tải nặng phổ biến)', nu40: 220, nu50: 135 },
        { id: 7, name: 'ISO VG 320 (Dầu hộp số tải rất nặng)', nu40: 320, nu50: 195 },
        { id: 8, name: 'ISO VG 460 (Dầu đặc, nhiệt độ cao)', nu40: 460, nu50: 275 },
        { id: 9, name: 'ISO VG 680 (Dầu siêu đặc, tốc độ chậm)', nu40: 680, nu50: 400 }
    ]
};
