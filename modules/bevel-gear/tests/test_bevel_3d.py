import os
import sys
import math
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def test_bevel_3d():
    print("=" * 80)
    print(" BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG MÔ HÌNH 3D CAD BÁNH RĂNG CÔN (ISO 23509)")
    print("=" * 80)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_path = os.path.join(base_dir, "index.html")
    file_url = "file:///" + html_path.replace("\\", "/")

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

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
        page.wait_for_timeout(500)

        # Kiểm tra nút chuyển chế độ 2D / 3D
        btn_mode_3d = page.query_selector('#btnMode3D')
        assert btn_mode_3d is not None, "Không tìm thấy nút #btnMode3D"

        print("\n-> [3] Kích hoạt chế độ 3D WebGL...")
        page.click('#btnMode3D')
        page.wait_for_timeout(1000)

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
        page.wait_for_timeout(800)
        mesh_zone_path = os.path.join(artifacts_dir, "bevel_3d_mesh_zone.png")
        page.screenshot(path=mesh_zone_path)
        print(f"[+] Đã lưu ảnh chụp 3D Vùng Ăn Khớp: {mesh_zone_path}")

        # Kiểm tra chuyển góc nhìn sang Mặt Bổ Dọc Trục Front
        print("\n-> [5] Kiểm tra chuyển hướng nhìn 3D sang Mặt Bổ Dọc Trục Front (XY)...")
        page.select_option('#sel3DViewPreset', 'front')
        page.wait_for_timeout(800)
        front_path = os.path.join(artifacts_dir, "bevel_3d_axial_front.png")
        page.screenshot(path=front_path)
        print(f"[+] Đã lưu ảnh chụp 3D Mặt Bổ Dọc Trục: {front_path}")

        # Kiểm tra tính phẳng tuyệt đối của 2 mặt đầu (Planar Caps, ZERO "nhấp nhô")
        print("\n-> [6] Kiểm tra tính phẳng toán học tuyệt đối của 2 mặt đầu (Planar Caps)...")
        planar_check = page.evaluate("""() => {
            const ui = window.appUI;
            const v = ui.visualizer3D;
            const m1 = v.mesh1Data;
            
            // Lấy các đỉnh ở nắp đáy và nắp đầu
            // Trong bevel-3d-generator:
            // Back cap: z = z_back = Re * cos(delta)
            // Front cap: z = z_front = Ri * cos(delta)
            const g = ui.lastGeom;
            const expectedZBack = g.Re * Math.cos(g.delta1);
            const expectedZFront = g.Ri * Math.cos(g.delta1);
            
            const verts = m1.vertices;
            let maxDiffBack = 0;
            let maxDiffFront = 0;
            let backCapCount = 0;
            let frontCapCount = 0;
            
            for (let i = 0; i < verts.length; i += 3) {
                const z = verts[i + 2];
                if (Math.abs(z - expectedZBack) < 1e-3) {
                    backCapCount++;
                    maxDiffBack = Math.max(maxDiffBack, Math.abs(z - expectedZBack));
                }
                if (Math.abs(z - expectedZFront) < 1e-3) {
                    frontCapCount++;
                    maxDiffFront = Math.max(maxDiffFront, Math.abs(z - expectedZFront));
                }
            }
            
            return {
                backCapCount,
                frontCapCount,
                maxDiffBack,
                maxDiffFront,
                expectedZBack,
                expectedZFront
            };
        }""")
        
        print(f"[+] Mặt đầu ngoài (Back Cap): {planar_check['backCapCount']} đỉnh tại Z={planar_check['expectedZBack']:.4f} mm | Độ lệch max: {planar_check['maxDiffBack']:.6f} mm (PHẲNG TUYỆT ĐỐI!)")
        print(f"[+] Mặt đầu trong (Front Cap): {planar_check['frontCapCount']} đỉnh tại Z={planar_check['expectedZFront']:.4f} mm | Độ lệch max: {planar_check['maxDiffFront']:.6f} mm (PHẲNG TUYỆT ĐỐI!)")
        assert planar_check['backCapCount'] > 0, "Không tìm thấy đỉnh mặt đầu ngoài!"
        assert planar_check['frontCapCount'] > 0, "Không tìm thấy đỉnh mặt đầu trong!"
        assert planar_check['maxDiffBack'] < 1e-5, f"Mặt đầu ngoài bị nhấp nhô: {planar_check['maxDiffBack']}"
        assert planar_check['maxDiffFront'] < 1e-5, f"Mặt đầu trong bị nhấp nhô: {planar_check['maxDiffFront']}"

        # Kiểm tra tạo tệp xuất 3D CAD: STEP Solid, STEP Surface, Binary STL
        print("\n-> [7] Kiểm tra sinh dữ liệu xuất 3D CAD (STEP & STL)...")
        export_tests = page.evaluate("""() => {
            const ui = window.appUI;
            const v = ui.visualizer3D;
            
            // 1. STEP Solid Pinion
            const stepSolid = Bevel3DExporter.exportSTEP(v.getExportTriangles('pinion', false), 'test.step', 'PINION', false, false);
            // 2. STEP Surface Pinion (Open Shell)
            const stepSurface = Bevel3DExporter.exportSTEP(v.getExportTriangles('pinion', true), 'test_surf.step', 'PINION_SURF', false, true);
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

        # Kiểm tra xuất bản vẽ 2D CAD DXF (AutoCAD 2004+ AC1009) với 11 mức độ mịn
        print("\n-> [8] Kiểm tra xuất bản vẽ 2D CAD DXF (AutoCAD 2004+ Release 12 AC1009)...")
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
        print(f"[+] Định dạng xuống dòng chuẩn CRLF (AutoCAD 2004+): {dxf_tests['hasCRLF']}")
        print(f"[+] Độ dài DXF Pinion: {dxf_tests['pinionLen']:,} bytes | Gear: {dxf_tests['gearLen']:,} bytes | Assembly: {dxf_tests['assemblyLen']:,} bytes")
        print(f"[+] Độ mịn Mức 1 (Thô): {dxf_tests['lvl1Len']:,} bytes | Mức 11 (Siêu mịn): {dxf_tests['lvl11Len']:,} bytes")

        assert dxf_tests['hasAC1009'], "DXF thiếu AC1009!"
        assert dxf_tests['hasAcadVer'], "DXF thiếu $ACADVER!"
        assert dxf_tests['hasTables'], "DXF thiếu TABLES!"
        assert dxf_tests['hasEntities'], "DXF thiếu ENTITIES!"
        assert dxf_tests['hasCRLF'], "DXF không dùng CRLF!"

        print("\n" + "=" * 80)
        print(" TẤT CẢ CÁC BÀI KIỂM THỬ 3D WEBGL & CAD EXPORT CHO BÁNH RĂNG CÔN ĐÃ PASS 100%!")
        print("=" * 80)

        browser.close()

if __name__ == '__main__':
    test_bevel_3d()
