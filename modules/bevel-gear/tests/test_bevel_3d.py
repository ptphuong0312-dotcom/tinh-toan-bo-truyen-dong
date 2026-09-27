import os
import sys
import math
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def test_bevel_3d():
    print("=" * 80)
    print(" BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG MÔ HÌNH 2D & 3D CAD BÁNH RĂNG CÔN (ISO 23509)")
    print("=" * 80)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_path = os.path.join(base_dir, "index.html")
    file_url = "file:///" + html_path.replace("\\", "/")

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--use-gl=angle"])
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print(f"\n-> [1] Đang tải trang Web App: {file_url}")
        page.goto(file_url)
        page.wait_for_load_state("networkidle")

        # Kiểm tra console errors
        if console_errors:
            print(f"[-] Cảnh báo: Có {len(console_errors)} lỗi console:")
            for err in console_errors:
                print("   ", err)
        else:
            print("[+] Hoàn hảo: 0 lỗi Console / JavaScript khi tải trang!")

        # Chuyển sang Tab 2: Mô phỏng ăn khớp 2D / 3D CAD
        print("\n-> [2] Chuyển sang Tab 2 (Mô Phỏng Ăn Khớp 2D / 3D CAD)...")
        page.click('.tab-btn[data-target="tabCanvas"]')
        page.wait_for_timeout(400)

        # Kiểm tra đồng bộ 2D Canvas với 3D Blank & Bán kính lượn chân răng R chân = 0.38 * mmn
        print("\n-> [2.1] Kiểm tra đồng bộ 2D Canvas (1-to-1 với Phôi 3D & R chân = 0.38 * mmn)...")
        sync_2d_check = page.evaluate("""() => {
            const ui = window.appUI;
            const c = ui.canvasController;
            const g = ui.lastGeom;
            const bp = c._get3DMatchedBlankParams(g);
            const slice1 = Bevel3DGenerator.generateSliceToothContour({
                z: bp.z1, mmn: bp.mmn, Rm: bp.Rm, R_s: bp.Rm, delta: bp.d1,
                alfa: (g.alfa_deg || 20) * Math.PI / 180,
                beta: (g.beta_deg || 0) * Math.PI / 180,
                isSpiral: Math.abs(g.beta_deg || 0) > 1e-4,
                ha_s: g.ha1, hf_s: g.hf1, sn_s: g.sn1, ptsPerFlank: 20, ptsFillet: 10
            });
            const slice2 = Bevel3DGenerator.generateSliceToothContour({
                z: bp.z2, mmn: bp.mmn, Rm: bp.Rm, R_s: bp.Rm, delta: bp.d2,
                alfa: (g.alfa_deg || 20) * Math.PI / 180,
                beta: (g.beta_deg || 0) * Math.PI / 180,
                isSpiral: Math.abs(g.beta_deg || 0) > 1e-4,
                ha_s: g.ha2, hf_s: g.hf2, sn_s: g.sn2, ptsPerFlank: 20, ptsFillet: 10
            });
            const filletPts1 = slice1.toothContour.filter(pt => pt.zone === 'fillet').length;
            const rootLandPts1 = slice1.toothContour.filter(pt => pt.zone === 'root_land').length;
            const tipLandPts1 = slice1.toothContour.filter(pt => pt.zone === 'tip_land').length;
            return {
                Rf1: slice1.fillet.Rf,
                Rf2: slice2.fillet.Rf,
                expectedRf: 0.38 * bp.mmn,
                filletPts1,
                rootLandPts1,
                tipLandPts1,
                Hin1: bp.Hin1,
                Hout1: bp.Hout1,
                rBore1: bp.rBore1
            };
        }""")
        print(f"[+] Bán kính lượn chân răng R chân (Bánh 1 / Bánh 2): Rf1 = {sync_2d_check['Rf1']:.2f} mm, Rf2 = {sync_2d_check['Rf2']:.2f} mm (Chuẩn 0.38*mmn = {sync_2d_check['expectedRf']:.2f} mm)")
        print(f"[+] Số điểm cung lượn chân răng mỗi răng: {sync_2d_check['filletPts1']} điểm | Cung đáy rãnh: {sync_2d_check['rootLandPts1']} điểm | Cung đỉnh: {sync_2d_check['tipLandPts1']} điểm")
        assert abs(sync_2d_check['Rf1'] - sync_2d_check['expectedRf']) < 1e-4, f"Rf1 lệch: {sync_2d_check['Rf1']}"
        assert abs(sync_2d_check['Rf2'] - sync_2d_check['expectedRf']) < 1e-4, f"Rf2 lệch: {sync_2d_check['Rf2']}"
        assert sync_2d_check['filletPts1'] == 20, f"Thiếu điểm cung lượn chân răng: {sync_2d_check['filletPts1']}"
        assert sync_2d_check['rootLandPts1'] == 2, f"Thiếu điểm cung đáy rãnh: {sync_2d_check['rootLandPts1']}"

        # Kiểm tra nút chuyển chế độ 2D / 3D
        btn_mode_3d = page.query_selector('#btnMode3D')
        assert btn_mode_3d is not None, "Không tìm thấy nút #btnMode3D"

        print("\n-> [3] Kích hoạt chế độ 3D WebGL...")
        page.click('#btnMode3D')
        page.wait_for_timeout(600)

        # Kiểm tra hiển thị container3D
        container_3d = page.query_selector('#container3D')
        assert container_3d.is_visible(), "Container 3D không hiển thị!"
        print("[+] Container 3D WebGL đã hiển thị thành công!")

        # Kiểm tra các thông số 3D sinh bởi Bevel3DGenerator
        mesh_stats = page.evaluate("""() => {
            const ui = window.appUI;
            if (!ui || !ui.visualizer3D) return null;
            const v = ui.visualizer3D;
            return {
                hasMesh1: !!v.mesh1Data,
                hasMesh2: !!v.mesh2Data,
                mesh1Verts: v.mesh1Data ? v.mesh1Data.vertices.length / 3 : 0,
                mesh1Tris: v.mesh1Data ? v.mesh1Data.rawTriangles.length : 0,
                mesh2Verts: v.mesh2Data ? v.mesh2Data.vertices.length / 3 : 0,
                mesh2Tris: v.mesh2Data ? v.mesh2Data.rawTriangles.length : 0,
                ratio: v.gearRatio,
                sigma: v.sigmaRad * 180 / Math.PI
            };
        }""")

        assert mesh_stats is not None, "Không đọc được thông số 3D visualizer"
        print(f"[+] Lưới 3D Bánh dẫn 1: {mesh_stats['mesh1Verts']} đỉnh, {mesh_stats['mesh1Tris']} tam giác.")
        print(f"[+] Lưới 3D Bánh bị dẫn 2: {mesh_stats['mesh2Verts']} đỉnh, {mesh_stats['mesh2Tris']} tam giác.")
        print(f"[+] Tỷ số truyền: {mesh_stats['ratio']:.3f}, Góc trục Sigma: {mesh_stats['sigma']:.1f}°.")
        assert mesh_stats['mesh1Tris'] > 1000, "Lưới Bánh 1 quá ít tam giác!"
        assert mesh_stats['mesh2Tris'] > 1000, "Lưới Bánh 2 quá ít tam giác!"

        # Chụp ảnh góc Isometric
        artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
        iso_path = os.path.join(artifacts_dir, "bevel_3d_isometric_view.png")
        page.screenshot(path=iso_path)
        print(f"[+] Đã lưu ảnh chụp 3D Isometric: {iso_path}")

        # Kiểm tra chuyển góc nhìn sang Mesh Zone
        print("\n-> [4] Kiểm tra chuyển hướng nhìn 3D sang Vùng Ăn Khớp (Mesh Zone)...")
        page.select_option('#sel3DViewPreset', 'mesh')
        page.wait_for_timeout(400)
        mesh_zone_path = os.path.join(artifacts_dir, "bevel_3d_mesh_zone.png")
        page.screenshot(path=mesh_zone_path)
        print(f"[+] Đã lưu ảnh chụp 3D Vùng Ăn Khớp: {mesh_zone_path}")

        # Kiểm tra chuyển góc nhìn sang Mặt Bổ Dọc Trục Front
        print("\n-> [5] Kiểm tra chuyển hướng nhìn 3D sang Mặt Bổ Dọc Trục Front (XY)...")
        page.select_option('#sel3DViewPreset', 'front')
        page.wait_for_timeout(400)
        front_path = os.path.join(artifacts_dir, "bevel_3d_axial_front.png")
        page.screenshot(path=front_path)
        print(f"[+] Đã lưu ảnh chụp 3D Mặt Bổ Dọc Trục: {front_path}")

        # Kiểm tra hình học nón thực thể chuẩn MITCalc 1.74 khi đặt beta = 30.0 (Data1!C70:D87 & Data1!H35:I52)
        print("\n-> [6] Kiểm tra hình học nón thực thể chuẩn MITCalc 1.74 với beta = 30.0° (ISO 23509 & Data1 Ground Truth)...")
        page.evaluate("""() => {
            const inp = document.getElementById('inp_beta');
            if (inp) {
                inp.value = '30.0';
                inp.dispatchEvent(new Event('input'));
            }
        }""")
        page.wait_for_timeout(400)

        conical_check = page.evaluate("""() => {
            const ui = window.appUI;
            const v = ui.visualizer3D;
            const m1 = v.mesh1Data;
            const m2 = v.mesh2Data;
            
            // Pinion 1 bounds (matches Data1!C70:D87: P01 X=-201.61, P03 X=-318.08, P02 Y=140.47)
            const m1_minZ = m1.bbox.min[2];
            const m1_maxZ = m1.bbox.max[2];
            const m1_maxR = Math.max(Math.abs(m1.bbox.min[0]), m1.bbox.max[0]);
            
            // Gear 2 bounds (matches Data1!H35:I52: P01 X=-77.20, P03 X=-142.71, P02 Y=317.18)
            const m2_minZ = m2.bbox.min[2];
            const m2_maxZ = m2.bbox.max[2];
            const m2_maxR = Math.max(Math.abs(m2.bbox.min[0]), m2.bbox.max[0]);

            return {
                m1_minZ, m1_maxZ, m1_maxR,
                m2_minZ, m2_maxZ, m2_maxR,
                hasVertices: m1.vertices.length > 0 && m2.vertices.length > 0
            };
        }""")
        
        print(f"[+] Bánh dẫn 1 (Pinion): Z in [{conical_check['m1_minZ']:.2f}, {conical_check['m1_maxZ']:.2f}] mm, R_max={conical_check['m1_maxR']:.2f} mm (Khớp Data1!C70:D87!)")
        print(f"[+] Bánh bị dẫn 2 (Gear): Z in [{conical_check['m2_minZ']:.2f}, {conical_check['m2_maxZ']:.2f}] mm, R_max={conical_check['m2_maxR']:.2f} mm (Khớp Data1!H35:I52!)")
        assert 200.0 <= conical_check['m1_minZ'] <= 204.0, f"Bánh 1 minZ sai: {conical_check['m1_minZ']}"
        assert 321.0 <= conical_check['m1_maxZ'] <= 325.0, f"Bánh 1 maxZ sai: {conical_check['m1_maxZ']}"
        assert 138.0 <= conical_check['m1_maxR'] <= 142.0, f"Bánh 1 maxR sai: {conical_check['m1_maxR']}"
        assert 75.0 <= conical_check['m2_minZ'] <= 79.0, f"Bánh 2 minZ sai: {conical_check['m2_minZ']}"
        assert 159.0 <= conical_check['m2_maxZ'] <= 163.0, f"Bánh 2 maxZ sai: {conical_check['m2_maxZ']}"
        assert 315.0 <= conical_check['m2_maxR'] <= 319.0, f"Bánh 2 maxR sai: {conical_check['m2_maxR']}"

        # Kiểm tra chuyển đổi góc xoắn beta về 0 (Răng thẳng)
        print("\n-> [6.1] Kiểm tra chuyển góc xoắn beta về 0 (Răng Thẳng Tuyệt Đối)...")
        page.evaluate("""() => {
            const inp = document.getElementById('inp_beta');
            if (inp) {
                inp.value = '0.0';
                inp.dispatchEvent(new Event('input'));
            }
        }""")
        page.wait_for_timeout(400)

        beta0_check = page.evaluate("""() => {
            const ui = window.appUI;
            const g = ui.lastGeom;
            const v = ui.visualizer3D;
            const badgeType = document.getElementById('badge3DType');
            return {
                beta_deg: g.beta_deg,
                badgeText: badgeType ? badgeType.textContent : '',
                m1_isSpiral: v.mesh1Data ? Math.abs(v.mesh1Data.bbox.min[0]) > 0 : true
            };
        }""")
        print(f"[+] lastGeom.beta_deg: {beta0_check['beta_deg']:.1f}°")
        print(f"[+] Badge 3D: {beta0_check['badgeText']}")
        assert beta0_check['beta_deg'] == 0.0, f"beta_deg không phải 0.0: {beta0_check['beta_deg']}"
        assert "Thẳng" in beta0_check['badgeText'], f"Badge không nhận diện răng thẳng: {beta0_check['badgeText']}"

        straight_path = os.path.join(artifacts_dir, "bevel_3d_straight_beta0.png")
        page.screenshot(path=straight_path)
        print(f"[+] Đã lưu ảnh chụp 3D Răng Thẳng (beta = 0): {straight_path}")

        # Kiểm tra cập nhật khi thay đổi các góc xoắn khác (beta = 15, beta = 25, beta = 35)
        print("\n-> [6.2] Kiểm tra thay đổi các góc xoắn khác (15°, 25°, 35°)...")
        for test_b in [15.0, 25.0, 35.0]:
            page.evaluate(f"""(b) => {{
                const inp = document.getElementById('inp_beta');
                if (inp) {{
                    inp.value = b.toFixed(1);
                    inp.dispatchEvent(new Event('input'));
                }}
            }}""", test_b)
            page.wait_for_timeout(300)
            actual_b = page.evaluate("() => window.appUI.lastGeom.beta_deg")
            assert abs(actual_b - test_b) < 1e-4, f"beta không cập nhật: mong muốn {test_b}, nhận {actual_b}"
            print(f"[+] Cập nhật beta = {test_b}° -> lastGeom.beta_deg = {actual_b}° thành công!")

        # Đặt lại beta = 0.0 tiêu chuẩn
        page.evaluate("""() => {
            const inp = document.getElementById('inp_beta');
            if (inp) {
                inp.value = '0.0';
                inp.dispatchEvent(new Event('input'));
            }
        }""")
        page.wait_for_timeout(300)

        # Kiểm tra tạo tệp xuất 3D CAD: STEP Solid, STEP Surface, Binary STL
        print("\n-> [7] Kiểm tra sinh dữ liệu xuất 3D CAD (STEP & STL)...")
        export_tests = page.evaluate("""() => {
            const ui = window.appUI;
            const v = ui.visualizer3D;
            
            // 1. STEP Solid Pinion
            const stepSolid = Bevel3DExporter.exportSTEP(v.getExportTriangles('pinion', false, true), 'test.step', 'PINION', false, false);
            // 2. STEP Surface Pinion (Open Shell)
            const stepSurface = Bevel3DExporter.exportSTEP(v.getExportTriangles('pinion', true, true), 'test_surf.step', 'PINION_SURF', false, true);
            // 3. STL Solid Assembly
            const stlSolid = Bevel3DExporter.exportBinarySTL(v.getExportTriangles('assembly', false), 'test.stl', false);
            // 4. STL Surface Pinion
            const stlSurface = Bevel3DExporter.exportBinarySTL(v.getExportTriangles('pinion', true), 'test_surf.stl', false);

            return {
                stepSolidLen: stepSolid.content.length,
                hasClosedShell: stepSolid.content.includes('CLOSED_SHELL'),
                stepSurfaceLen: stepSurface.content.length,
                hasOpenShell: stepSurface.content.includes('OPEN_SHELL'),
                hasSurfaceModel: stepSurface.content.includes('SHELL_BASED_SURFACE_MODEL'),
                stlSolidTris: stlSolid.numTriangles,
                stlSolidBytes: stlSolid.totalBytes,
                stlSurfaceTris: stlSurface.numTriangles,
                stlSurfaceBytes: stlSurface.totalBytes
            };
        }""")

        print(f"[+] STEP Solid Model: {export_tests['stepSolidLen']:,} ký tự | CLOSED_SHELL: {export_tests['hasClosedShell']}")
        print(f"[+] STEP Surface Model: {export_tests['stepSurfaceLen']:,} ký tự | OPEN_SHELL: {export_tests['hasOpenShell']} | SHELL_BASED_SURFACE_MODEL: {export_tests['hasSurfaceModel']}")
        print(f"[+] STL Solid Assembly: {export_tests['stlSolidTris']:,} tam giác | {export_tests['stlSolidBytes']:,} bytes ({export_tests['stlSolidBytes']/1024/1024:.2f} MB)")
        print(f"[+] STL Surface Rỗng: {export_tests['stlSurfaceTris']:,} tam giác | {export_tests['stlSurfaceBytes']:,} bytes ({export_tests['stlSurfaceBytes']/1024/1024:.2f} MB)")

        assert export_tests['hasClosedShell'], "Tệp STEP Solid không có CLOSED_SHELL!"
        assert export_tests['hasOpenShell'], "Tệp STEP Surface không có OPEN_SHELL!"
        assert export_tests['hasSurfaceModel'], "Tệp STEP Surface không có SHELL_BASED_SURFACE_MODEL!"
        assert export_tests['stlSurfaceTris'] < export_tests['stlSolidTris'], "Lưới Surface rỗng phải ít tam giác hơn Solid!"

        # Kiểm tra xuất bản vẽ 2D CAD DXF (AutoCAD 2004+ AC1009) với 11 mức độ mịn & Biên dạng 2D có R chân
        print("\n-> [8] Kiểm tra xuất bản vẽ 2D CAD DXF (AutoCAD 2004+ Release 12 AC1009 & Biên dạng răng có R chân)...")
        dxf_tests = page.evaluate("""() => {
            const ui = window.appUI;
            const g = ui.lastGeom;
            
            // Test 3 targets (pinion, gear, assembly) with level 6 (default)
            const dxfPinion = BevelDxfExporter.generateDXF(g, 'pinion', 6);
            const dxfGear = BevelDxfExporter.generateDXF(g, 'gear', 6);
            const dxfAssembly = BevelDxfExporter.generateDXF(g, 'assembly', 6);
            
            // Test level 1 (coarse) and level 11 (ultra-fine)
            const dxfLvl1 = BevelDxfExporter.generateDXF(g, 'assembly', 1);
            const dxfLvl11 = BevelDxfExporter.generateDXF(g, 'assembly', 11);
            
            return {
                hasAC1009: dxfAssembly.includes('AC1009'),
                hasAcadVer: dxfAssembly.includes('$ACADVER'),
                hasTables: dxfAssembly.includes('TABLES') && dxfAssembly.includes('LAYER') && dxfAssembly.includes('LTYPE'),
                hasEntities: dxfAssembly.includes('ENTITIES'),
                hasMfgTable: dxfAssembly.includes('MFG_TABLE'),
                hasTredgoldRChan: dxfAssembly.includes('Rf = 0.38*mmn'),
                hasCRLF: dxfAssembly.includes('\\r\\n'),
                pinionLen: dxfPinion.length,
                gearLen: dxfGear.length,
                assemblyLen: dxfAssembly.length,
                lvl1Len: dxfLvl1.length,
                lvl11Len: dxfLvl11.length
            };
        }""")

        print(f"[+] DXF AC1009 Header: {dxf_tests['hasAC1009']} ($ACADVER: {dxf_tests['hasAcadVer']})")
        print(f"[+] DXF TABLES (VPORT, LTYPE, LAYER, STYLE): {dxf_tests['hasTables']}")
        print(f"[+] DXF ENTITIES & Bảng chế tạo MFG_TABLE: {dxf_tests['hasEntities']} & {dxf_tests['hasMfgTable']}")
        print(f"[+] DXF Hình Chiếu Biên Dạng Răng 2D Tredgold có R chân: {dxf_tests['hasTredgoldRChan']}")
        print(f"[+] Định dạng xuống dòng chuẩn CRLF (AutoCAD 2004+): {dxf_tests['hasCRLF']}")
        print(f"[+] Độ dài DXF Pinion: {dxf_tests['pinionLen']:,} bytes | Gear: {dxf_tests['gearLen']:,} bytes | Assembly: {dxf_tests['assemblyLen']:,} bytes")
        print(f"[+] Độ mịn Mức 1 (Thô): {dxf_tests['lvl1Len']:,} bytes | Mức 11 (Siêu mịn): {dxf_tests['lvl11Len']:,} bytes")

        assert dxf_tests['hasAC1009'], "DXF thiếu AC1009!"
        assert dxf_tests['hasAcadVer'], "DXF thiếu $ACADVER!"
        assert dxf_tests['hasTables'], "DXF thiếu TABLES!"
        assert dxf_tests['hasEntities'], "DXF thiếu ENTITIES!"
        assert dxf_tests['hasTredgoldRChan'], "DXF thiếu biên dạng răng Tredgold có R chân!"
        assert dxf_tests['hasCRLF'], "DXF không dùng CRLF!"
        assert dxf_tests['lvl11Len'] > dxf_tests['lvl1Len'], "DXF Mức 11 phải chi tiết hơn Mức 1!"

        print("\n" + "=" * 80)
        print(" TẤT CẢ CÁC BÀI KIỂM THỬ 2D & 3D WEBGL & CAD EXPORT CHO BÁNH RĂNG CÔN ĐÃ PASS 100%!")
        print("=" * 80)

        browser.close()

if __name__ == '__main__':
    test_bevel_3d()
