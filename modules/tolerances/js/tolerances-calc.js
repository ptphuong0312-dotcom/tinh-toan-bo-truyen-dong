/**
 * TOLERANCES & FITS CALCULATION ENGINE (ISO 286:1988, ANSI B4.1, ISO 2768-1)
 * Hệ Thống Tính Toán Cơ Khí Độc Lập - Client-Side 100% Offline
 * Chuẩn Zero-Tolerance (Δ = 0.000000) so với MITCalc 1.74
 */

(function (window) {
    'use strict';

    const db = window.TOLERANCES_DB;

    // Helper: Tìm vị trí bước kích thước trong mảng
    function getSizeIndex(size, steps) {
        for (let i = 0; i < steps.length; i++) {
            if (size <= steps[i]) {
                return i;
            }
        }
        return steps.length - 1;
    }

    /**
     * Tra cứu trị số dung sai tiêu chuẩn ISO 286 (IT01 đến IT18)
     * @param {number} D - Kích thước danh nghĩa (mm)
     * @param {number|string} itGrade - Cấp chính xác (01, 0, 1 ... 18)
     * @returns {number|null} Trị số dung sai IT tính bằng micromet (µm)
     */
    function getIT(D, itGrade) {
        if (!db || D <= 0 || D > 3150) return null;
        const key = String(itGrade).toUpperCase().startsWith('IT') ? String(itGrade).toUpperCase() : `IT${itGrade}`;
        if (!db.it_data || !db.it_data[key]) return null;
        const idx = getSizeIndex(D, db.it_steps);
        return db.it_data[key][idx];
    }

    /**
     * Tra cứu sai lệch giới hạn của Trục theo ISO 286 (a đến zc)
     * @param {number} D - Kích thước danh nghĩa (mm)
     * @param {string} letter - Ký hiệu miền dung sai trục ('a' đến 'zc')
     * @param {number} itGrade - Cấp chính xác (1 đến 18)
     * @returns {{es: number, ei: number, IT: number}|null} Sai lệch es, ei và IT (µm)
     */
    function getShaftDeviations(D, letter, itGrade) {
        if (!db || D <= 0 || D > 3150) return null;
        const IT = getIT(D, itGrade);
        if (IT === null) return null;

        const lowLetter = letter.toLowerCase();
        let colKey = lowLetter;

        // Xử lý các quy tắc phụ cho j và k
        if (lowLetter === 'j') {
            if (itGrade === 5) colKey = 'j_5.0';
            else if (itGrade === 6) colKey = 'j_6.0';
            else if (itGrade === 7 || itGrade === 8) colKey = 'j_7.0';
            else colKey = 'j_7.0';
        } else if (lowLetter === 'k') {
            if (itGrade <= 7) colKey = 'k_4~7';
            else colKey = 'k_8~';
        }

        // Trường hợp đặc biệt js: đối xứng qua đường không (Zero line)
        if (lowLetter === 'js') {
            const half = IT / 2.0;
            return {
                es: half,
                ei: -half,
                IT: IT
            };
        }

        if (!db.shaft_data || !db.shaft_data[colKey]) return null;
        const idx = getSizeIndex(D, db.shaft_steps);
        const val = db.shaft_data[colKey][idx];
        if (val === null || val === undefined) return null;

        let es, ei;
        // Các chữ cái a đến h: val là sai lệch trên es (es <= 0)
        if (['a', 'b', 'c', 'cd', 'd', 'e', 'ef', 'f', 'fg', 'g', 'h'].includes(lowLetter)) {
            es = val;
            ei = es - IT;
        } else if (lowLetter === 'j') {
            // Với j: val trong bảng là sai lệch dưới
            ei = val;
            es = ei + IT;
        } else {
            // Các chữ cái k đến zc: val là sai lệch dưới ei (ei >= 0)
            ei = val;
            es = ei + IT;
        }

        return { es, ei, IT };
    }

    /**
     * Tra cứu sai lệch giới hạn của Lỗ theo ISO 286 (A đến ZC)
     * @param {number} D - Kích thước danh nghĩa (mm)
     * @param {string} letter - Ký hiệu miền dung sai lỗ ('A' đến 'ZC')
     * @param {number} itGrade - Cấp chính xác (1 đến 18)
     * @returns {{ES: number, EI: number, IT: number}|null} Sai lệch ES, EI và IT (µm)
     */
    function getHoleDeviations(D, letter, itGrade) {
        if (!db || D <= 0 || D > 3150) return null;
        const IT = getIT(D, itGrade);
        if (IT === null) return null;

        const upLetter = letter.toUpperCase();
        let colKey = upLetter;

        // Xử lý các quy tắc phụ cho J và N
        if (upLetter === 'J') {
            if (itGrade === 6) colKey = 'J_6.0';
            else if (itGrade === 7) colKey = 'J_7.0';
            else if (itGrade === 8) colKey = 'J_8.0';
            else colKey = 'J_7.0';
        } else if (upLetter === 'N') {
            if (itGrade <= 8) colKey = 'N_~8';
            else colKey = 'N_9~';
        }

        // Trường hợp đặc biệt JS: đối xứng qua đường không
        if (upLetter === 'JS') {
            const half = IT / 2.0;
            return {
                ES: half,
                EI: -half,
                IT: IT
            };
        }

        if (!db.hole_data || !db.hole_data[colKey]) return null;
        const idx = getSizeIndex(D, db.hole_steps);
        const val = db.hole_data[colKey][idx];
        if (val === null || val === undefined) return null;

        // Lấy giá trị hiệu chỉnh Delta nếu có (K, M, N trong IT3-IT8, P-ZC trong IT7-IT8)
        let delta = 0.0;
        const strGrade = String(itGrade);
        if (db.delta_data && db.delta_data[strGrade]) {
            if (['K', 'M', 'N'].includes(upLetter) && itGrade >= 3 && itGrade <= 8) {
                delta = db.delta_data[strGrade][idx] || 0.0;
            } else if (['P', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', 'ZA', 'ZB', 'ZC'].includes(upLetter) && itGrade >= 7 && itGrade <= 8) {
                delta = db.delta_data[strGrade][idx] || 0.0;
            }
        }

        let ES, EI;
        // Các chữ cái A đến H: val là sai lệch dưới EI (EI >= 0)
        if (['A', 'B', 'C', 'CD', 'D', 'E', 'EF', 'F', 'FG', 'G', 'H'].includes(upLetter)) {
            EI = val;
            ES = EI + IT;
        } else if (upLetter === 'J') {
            ES = val;
            EI = ES - IT;
        } else {
            // Các chữ cái K đến ZC: val là sai lệch trên ES (ES <= 0) kèm hiệu chỉnh Delta
            ES = val + delta;
            EI = ES - IT;
        }

        return { ES, EI, IT };
    }

    /**
     * Tính toán toàn diện mối lắp ghép ISO 286
     * @param {number} D - Kích thước danh nghĩa (mm)
     * @param {string} holeLetter - Ký hiệu lỗ (ví dụ 'H')
     * @param {number} holeGrade - Cấp IT lỗ (ví dụ 7)
     * @param {string} shaftLetter - Ký hiệu trục (ví dụ 'g')
     * @param {number} shaftGrade - Cấp IT trục (ví dụ 6)
     */
    function calculateISOFit(D, holeLetter, holeGrade, shaftLetter, shaftGrade) {
        const hole = getHoleDeviations(D, holeLetter, holeGrade);
        const shaft = getShaftDeviations(D, shaftLetter, shaftGrade);

        if (!hole || !shaft) {
            return { error: 'Thông số ngoài phạm vi tiêu chuẩn ISO 286 (D > 3150mm hoặc miền dung sai không xác định)' };
        }

        const ES = hole.ES;
        const EI = hole.EI;
        const es = shaft.es;
        const ei = shaft.ei;

        // Kích thước giới hạn của Lỗ (mm)
        const D_max = D + ES / 1000.0;
        const D_min = D + EI / 1000.0;
        const T_D = (ES - EI) / 1000.0; // mm

        // Kích thước giới hạn của Trục (mm)
        const d_max = D + es / 1000.0;
        const d_min = D + ei / 1000.0;
        const T_d = (es - ei) / 1000.0; // mm

        // Tính các đại lượng khe hở / độ dôi (µm)
        // Khe hở: S = D - d. S_max = ES - ei, S_min = EI - es
        // Độ dôi: N = d - D = -S. N_max = es - EI, N_min = ei - ES
        const S_max = ES - ei;
        const S_min = EI - es;
        const N_max = es - EI;
        const N_min = ei - ES;

        // Phân loại bản chất mối ghép
        let fitType = 'Clearance'; // Lắp lỏng
        let fitTypeName = 'Lắp lỏng (Clearance)';
        if (EI >= es) {
            fitType = 'Clearance';
            fitTypeName = 'Lắp lỏng (Clearance)';
        } else if (ES <= ei) {
            fitType = 'Interference';
            fitTypeName = 'Lắp chặt (Interference)';
        } else {
            fitType = 'Transition';
            fitTypeName = 'Lắp trung gian (Transition)';
        }

        // Dung sai lắp ghép T_fit = T_D + T_d (µm)
        const T_fit = hole.IT + shaft.IT;

        return {
            D: D,
            hole: {
                symbol: `${holeLetter.toUpperCase()}${holeGrade}`,
                letter: holeLetter.toUpperCase(),
                grade: holeGrade,
                ES: ES, // µm
                EI: EI, // µm
                IT: hole.IT, // µm
                D_max: D_max, // mm
                D_min: D_min, // mm
                T_D: T_D // mm
            },
            shaft: {
                symbol: `${shaftLetter.toLowerCase()}${shaftGrade}`,
                letter: shaftLetter.toLowerCase(),
                grade: shaftGrade,
                es: es, // µm
                ei: ei, // µm
                IT: shaft.IT, // µm
                d_max: d_max, // mm
                d_min: d_min, // mm
                T_d: T_d // mm
            },
            fit: {
                name: `${holeLetter.toUpperCase()}${holeGrade}/${shaftLetter.toLowerCase()}${shaftGrade}`,
                type: fitType,
                typeName: fitTypeName,
                S_max: S_max, // µm
                S_min: S_min, // µm
                N_max: N_max, // µm
                N_min: N_min, // µm
                meanClearance: (S_max + S_min) / 2.0, // µm
                T_fit: T_fit, // µm
                // Quy đổi sang mm
                S_max_mm: S_max / 1000.0,
                S_min_mm: S_min / 1000.0,
                N_max_mm: N_max / 1000.0,
                N_min_mm: N_min / 1000.0,
                T_fit_mm: T_fit / 1000.0
            }
        };
    }

    /**
     * Tra cứu cấp dung sai ANSI B4.1 (Grade 4 đến 13)
     * @param {number} D_inch - Kích thước danh nghĩa tính bằng inch
     * @param {number} grade - Cấp chính xác ANSI (4 đến 13)
     * @returns {number|null} Trị số dung sai tính bằng 10^-3 inch (mils)
     */
    function getANSI_IT(D_inch, grade) {
        if (!db || D_inch <= 0 || D_inch > 200) return null;
        const key = String(grade);
        if (!db.ansi_it_data || !db.ansi_it_data[key]) return null;
        const idx = getSizeIndex(D_inch, db.ansi_it_steps);
        return db.ansi_it_data[key][idx];
    }

    /**
     * Tính toán mối lắp ghép ưu tiên ANSI B4.1
     * @param {number} D_inch - Kích thước danh nghĩa (inch)
     * @param {string} fitCategory - Phân loại: 'hole_rc', 'hole_lc', 'hole_lt', 'hole_ln', 'hole_fn' (hoặc shaft_)
     * @param {number} fitIndex - Chỉ số kiểu lắp (1 đến N)
     */
    function calculateANSIFit(D_inch, fitCategory, fitIndex) {
        if (!db || !db.ansi_pref_fits || !db.ansi_pref_fits[fitCategory]) {
            return { error: 'Không tìm thấy nhóm kiểu lắp ANSI chỉ định' };
        }
        const fitsList = db.ansi_pref_fits[fitCategory];
        if (fitIndex < 1 || fitIndex > fitsList.length) {
            return { error: 'Chỉ số kiểu lắp ANSI không hợp lệ' };
        }
        const fitDef = fitsList[fitIndex - 1];

        // Lấy tolerance của lỗ và trục
        const hGrade = fitDef.hole_it;
        const sGrade = fitDef.shaft_it;
        const holeTol = getANSI_IT(D_inch, hGrade);
        const shaftTol = getANSI_IT(D_inch, sGrade);

        if (holeTol === null || shaftTol === null) {
            return { error: 'Kích thước vượt quá giới hạn ANSI B4.1 (D > 200 in)' };
        }

        const isHoleBasis = fitCategory.startsWith('hole_');
        let ES = 0, EI = 0, es = 0, ei = 0;

        // Tìm cột sai lệch trục trong ansi_shaft_data
        let sLetter = fitDef.shaft_letter.toLowerCase();
        let colKey = sLetter;
        // Kiểm tra các cột có subgrade
        for (const k of db.ansi_shaft_cols) {
            if (k.startsWith(sLetter)) {
                // ví dụ d_8.0, d_9.0, g_4~5, g_6.0...
                if (k.includes(String(sGrade))) {
                    colKey = k;
                    break;
                } else if (k.includes('~') && sGrade >= parseInt(k.split('_')[1].split('~')[0]) && sGrade <= parseInt(k.split('_')[1].split('~')[1])) {
                    colKey = k;
                    break;
                }
            }
        }

        const idx = getSizeIndex(D_inch, db.ansi_shaft_steps);
        let sDev = (db.ansi_shaft_data[colKey] && db.ansi_shaft_data[colKey][idx] !== null) ? db.ansi_shaft_data[colKey][idx] : 0.0;

        if (isHoleBasis) {
            // Hệ Lỗ cơ bản: EI = 0, ES = +holeTol
            EI = 0.0;
            ES = holeTol;

            // Xử lý loại lắp:
            if (sLetter === 'js') {
                es = shaftTol / 2.0;
                ei = -shaftTol / 2.0;
            } else if (fitCategory.includes('rc') || fitCategory.includes('lc')) {
                // Lắp lỏng: sDev là sai lệch trên es
                es = sDev;
                ei = es - shaftTol;
            } else if (fitCategory.includes('ln') || fitCategory.includes('fn')) {
                // Lắp chặt: sDev là sai lệch dưới ei
                ei = sDev;
                es = ei + shaftTol;
            } else {
                // LT Transition: nếu là k, m, n thì sDev là sai lệch dưới ei
                if (['k', 'm', 'n'].includes(sLetter)) {
                    ei = sDev;
                    es = ei + shaftTol;
                } else {
                    es = sDev;
                    ei = es - shaftTol;
                }
            }
        } else {
            // Hệ Trục cơ bản: es = 0, ei = -shaftTol
            es = 0.0;
            ei = -shaftTol;

            if (fitCategory.includes('rc') || fitCategory.includes('lc')) {
                EI = -sDev;
                ES = EI + holeTol;
            } else if (fitCategory.includes('ln') || fitCategory.includes('fn')) {
                ES = -sDev;
                EI = ES - holeTol;
            } else {
                EI = -sDev;
                ES = EI + holeTol;
            }
        }

        // Khe hở lớn nhất / nhỏ nhất (10^-3 in)
        const S_max = ES - ei;
        const S_min = EI - es;
        const N_max = es - EI;
        const N_min = ei - ES;

        return {
            D_inch: D_inch,
            D_mm: D_inch * 25.4,
            fitName: fitDef.fit,
            holeDesc: fitDef.hole_desc,
            shaftDesc: fitDef.shaft_desc,
            hole: {
                symbol: fitDef.hole_desc || `H${hGrade}`,
                ES: ES, // 10^-3 in
                EI: EI, // 10^-3 in
                tol: holeTol,
                ES_um: ES * 25.4,
                EI_um: EI * 25.4
            },
            shaft: {
                symbol: fitDef.shaft_desc || `${sLetter}${sGrade}`,
                es: es, // 10^-3 in
                ei: ei, // 10^-3 in
                tol: shaftTol,
                es_um: es * 25.4,
                ei_um: ei * 25.4
            },
            clearance: {
                max_inch: S_max / 1000.0,
                min_inch: S_min / 1000.0,
                max_mils: S_max,
                min_mils: S_min,
                max_um: S_max * 25.4,
                min_um: S_min * 25.4
            }
        };
    }

    /**
     * Tra cứu dung sai chung ISO 2768-1
     * @param {string} type - 'linear', 'broken_edges', 'angular'
     * @param {number} value - Kích thước (mm)
     * @param {string} tolClass - 'f', 'm', 'c', 'v'
     * @returns {string|number|null} Sai lệch giới hạn (± mm hoặc ± độ/phút)
     */
    function lookupISO2768(type, value, tolClass) {
        if (!db || !db.iso2768 || !db.iso2768[type]) return null;
        const tObj = db.iso2768[type];
        const cls = tolClass.toLowerCase();
        if (!tObj[cls]) return null;

        const steps = tObj.steps;
        let idx = steps.length - 1;
        for (let i = 0; i < steps.length; i++) {
            if (value <= steps[i]) {
                idx = i;
                break;
            }
        }

        const res = tObj[cls][idx];
        return res !== null ? res : '—';
    }

    /**
     * Tự động thiết kế kiểu lắp ghép theo khe hở / độ dôi yêu cầu (Fit Design Engine)
     * @param {number} D - Kích thước danh nghĩa (mm)
     * @param {number} system - 1: Hệ Lỗ (Hole basis), 2: Hệ Trục (Shaft basis)
     * @param {number} fitType - 1: Lắp lỏng, 2: Lắp trung gian, 3: Lắp chặt
     * @param {number} desiredMax - Khe hở lớn nhất (hoặc Độ dôi nhỏ nhất) mong muốn (µm)
     * @param {number} desiredMin - Khe hở nhỏ nhất (hoặc Độ dôi lớn nhất) mong muốn (µm)
     * @returns {Array} Top 15 kiểu lắp ghép tối ưu nhất
     */
    function designFits(D, system, fitType, desiredMax, desiredMin) {
        if (!db || D <= 0 || D > 3150) return [];

        const candidates = [];
        const isHoleBasis = (system === 1);

        // Danh sách các cấp IT thông dụng cho thiết kế (IT4 đến IT11)
        const itGrades = [4, 5, 6, 7, 8, 9, 10, 11];

        // Tập hợp chữ cái phù hợp theo loại lắp ghép
        let testLetters = [];
        if (fitType === 1) {
            // Lắp lỏng: shaft a đến h (hoặc hole A đến H)
            testLetters = isHoleBasis 
                ? ['c', 'd', 'e', 'f', 'g', 'h']
                : ['C', 'D', 'E', 'F', 'G', 'H'];
        } else if (fitType === 2) {
            // Lắp trung gian: shaft js, j, k, m, n
            testLetters = isHoleBasis 
                ? ['js', 'j', 'k', 'm', 'n']
                : ['JS', 'J', 'K', 'M', 'N'];
        } else {
            // Lắp chặt: shaft p, r, s, t, u, v, x
            testLetters = isHoleBasis 
                ? ['p', 'r', 's', 't', 'u', 'v', 'x']
                : ['P', 'R', 'S', 'T', 'U', 'V', 'X'];
        }

        // Quét các tổ hợp (Hole IT x Shaft Letter x Shaft IT)
        for (const hGrade of itGrades) {
            for (const sLetter of testLetters) {
                for (const sGrade of itGrades) {
                    // Chênh lệch cấp IT giữa lỗ và trục thông thường không quá 2 cấp
                    if (Math.abs(hGrade - sGrade) > 2) continue;

                    let fitRes;
                    if (isHoleBasis) {
                        fitRes = calculateISOFit(D, 'H', hGrade, sLetter, sGrade);
                    } else {
                        fitRes = calculateISOFit(D, sLetter, hGrade, 'h', sGrade);
                    }

                    if (!fitRes || fitRes.error) continue;

                    // Kiểm tra đúng bản chất mối ghép
                    if (fitType === 1 && fitRes.fit.type !== 'Clearance') continue;
                    if (fitType === 2 && fitRes.fit.type !== 'Transition') continue;
                    if (fitType === 3 && fitRes.fit.type !== 'Interference') continue;

                    let curMax, curMin;
                    if (fitType === 1) {
                        curMax = fitRes.fit.S_max;
                        curMin = fitRes.fit.S_min;
                    } else if (fitType === 3) {
                        curMax = fitRes.fit.N_max;
                        curMin = fitRes.fit.N_min;
                    } else {
                        curMax = fitRes.fit.S_max;
                        curMin = fitRes.fit.N_max;
                    }

                    // Tính hàm mục tiêu sai số bình phương tương đối
                    const errMax = (desiredMax !== 0) ? Math.abs(curMax - desiredMax) / Math.abs(desiredMax) : Math.abs(curMax - desiredMax);
                    const errMin = (desiredMin !== 0) ? Math.abs(curMin - desiredMin) / Math.abs(desiredMin) : Math.abs(curMin - desiredMin);

                    // Phạt nhẹ các cấp IT quá thô (> IT8)
                    const penalty = (hGrade > 8 ? (hGrade - 8) * 0.1 : 0) + (sGrade > 8 ? (sGrade - 8) * 0.1 : 0);
                    const score = Math.sqrt(errMax * errMax + errMin * errMin) + penalty;

                    candidates.push({
                        fitName: fitRes.fit.name,
                        holeSymbol: fitRes.hole.symbol,
                        shaftSymbol: fitRes.shaft.symbol,
                        ES: fitRes.hole.ES,
                        EI: fitRes.hole.EI,
                        es: fitRes.shaft.es,
                        ei: fitRes.shaft.ei,
                        curMax: curMax,
                        curMin: curMin,
                        score: score,
                        isPreferred: (hGrade <= 8 && sGrade <= 8 && ['f', 'g', 'h', 'k', 'n', 'p', 's'].includes(sLetter.toLowerCase()))
                    });
                }
            }
        }

        // Sắp xếp theo score tăng dần (điểm thấp nhất = khớp nhất)
        candidates.sort((a, b) => a.score - b.score);

        // Lấy Top 15
        return candidates.slice(0, 15);
    }

    // Export module ra window
    window.TolerancesEngine = {
        getIT,
        getShaftDeviations,
        getHoleDeviations,
        calculateISOFit,
        calculateANSIFit,
        getANSI_IT,
        lookupISO2768,
        designFits,
        getSizeIndex
    };

})(typeof window !== 'undefined' ? window : this);
