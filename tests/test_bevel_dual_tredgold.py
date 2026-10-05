import os
import sys
import ezdxf

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

def test_bevel_dual_tredgold():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
    file_url = "file:///" + target_path.replace("\\", "/")
    print("Navigating to:", file_url)

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={'width': 1400, 'height': 1100})

        console_errors = []
        page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: console_errors.append(str(e)))

        page.goto(file_url)
        page.wait_for_timeout(1000)

        # 1. Verify Audit
        badge = page.locator('#auditSummaryBadge')
        if badge.count() > 0:
            print("Audit Summary:", badge.text_content())

        # 2. Switch to Tab 2 Canvas
        print("Switching to Tab 2 Canvas...")
        page.click('button[data-target="tabCanvas"]')
        page.wait_for_timeout(500)

        # Take screenshot of default View 1 (Axial Cross Section)
        artifact_dir = "C:/Users/AD/.gemini/antigravity/brain/fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
        os.makedirs(artifact_dir, exist_ok=True)
        screenshot1_path = os.path.join(artifact_dir, "bevel_2d_axial_view.png")
        page.screenshot(path=screenshot1_path)
        print("Saved View 1 screenshot to:", screenshot1_path)

        # 3. Switch to View 2 (Dual Tredgold Virtual Mesh)
        print("Switching to 2D View Mode: Dual Tredgold Virtual Mesh...")
        btn_view_mesh = page.locator('#btn2DViewMesh')
        assert btn_view_mesh.count() > 0, "btn2DViewMesh not found"
        btn_view_mesh.click()
        page.wait_for_timeout(500)

        # Start animation to test oscillation
        print("Running animation oscillation...")
        btn_anim = page.locator('#btnCanvasAnimate')
        btn_anim.click()
        page.wait_for_timeout(800)

        screenshot2_path = os.path.join(artifact_dir, "bevel_2d_dual_tredgold_view.png")
        page.screenshot(path=screenshot2_path)
        print("Saved View 2 screenshot to:", screenshot2_path)

        # Pause animation
        btn_anim.click()
        page.wait_for_timeout(200)

        # 4. Test Unified DXF Download
        print("Testing Unified DXF export download...")
        btn_menu = page.locator('#btnExportDXFCanvasMenu')
        btn_menu.click()
        page.wait_for_timeout(200)

        btn_unified = page.locator('#expDxfUnifiedCanvas')
        assert btn_unified.count() > 0, "expDxfUnifiedCanvas not found"

        with page.expect_download() as download_info:
            btn_unified.click()
        download = download_info.value
        download_path = os.path.join(base_dir, "scratch", download.suggested_filename)
        download.save_as(download_path)
        print("Downloaded Unified DXF to:", download_path)

        # 5. Verify Downloaded DXF with ezdxf
        assert os.path.exists(download_path), "Downloaded file does not exist"
        doc = ezdxf.readfile(download_path)
        entities = list(doc.modelspace())
        print(f"Verified DXF with ezdxf: {len(entities)} modelspace entities")
        layer_names = [layer.dxf.name for layer in doc.layers]
        print("DXF Layers:", layer_names)

        required_layers = [
            'MESH_OUTER_PINION', 'MESH_OUTER_GEAR',
            'MESH_INNER_PINION', 'MESH_INNER_GEAR',
            'MESH_TIP_ARCS',
            'SLOT_PINION_OUTER_R', 'SLOT_PINION_OUTER_R0',
            'SLOT_PINION_INNER_R', 'SLOT_PINION_INNER_R0',
            'SLOT_GEAR_OUTER_R', 'SLOT_GEAR_OUTER_R0',
            'SLOT_GEAR_INNER_R', 'SLOT_GEAR_INNER_R0',
            'SLOT_TIP_ARCS', 'SLOT_ROOT_ARCS',
            'PITCH_CIRCLES', 'ROOT_CIRCLES', 'TIP_CIRCLES',
            'CENTER_AXES', 'LINE_OF_ACTION',
            'MFG_TABLE'
        ]
        for req in required_layers:
            assert req in layer_names, f"Missing required layer: {req}"
        
        # Verify TRUE ARC entities
        arcs = [e for e in doc.modelspace() if e.dxftype() == 'ARC']
        print(f"Verified true ARC entities in DXF: {len(arcs)} arcs")
        assert len(arcs) >= 28, f"Expected at least 28 ARC entities, got {len(arcs)}"
        print("All required engineering layers and true circular ARCs verified!")

        # 6. Check console errors
        print("Console errors count:", len(console_errors))
        if console_errors:
            for err in console_errors:
                print("   ERROR:", err)
            raise AssertionError("Console errors occurred during execution!")
        else:
            print("ZERO JAVASCRIPT ERRORS! 100% CLEAN RUN!")

        b.close()

if __name__ == '__main__':
    test_bevel_dual_tredgold()
