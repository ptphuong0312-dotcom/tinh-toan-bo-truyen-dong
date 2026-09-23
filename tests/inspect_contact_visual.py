import os
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
tests_dir = os.path.dirname(os.path.abspath(__file__))
bevel_dir = os.path.join(os.path.dirname(tests_dir), "modules", "bevel-gear")
html_path = os.path.join(bevel_dir, "index.html")
file_url = "file:///" + html_path.replace("\\", "/")

print(f"Loading {file_url}...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page.goto(file_url)
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    
    # 1. Switch to tabCanvas
    page.click("button[data-target='tabCanvas']")
    time.sleep(1)
    
    # 2. Switch to 3D WebGL
    page.click("#btnMode3D")
    time.sleep(2)
    
    # Check if visualizer is ready
    vis_ready = page.evaluate("() => !!window.bevel3DVisualizer")
    print(f"bevel3DVisualizer ready: {vis_ready}")
    
    # 3. Toggle 'Chỉ Mặt Bên' (Flank Only) if not already
    flank_active = page.evaluate("() => window.bevel3DVisualizer ? window.bevel3DVisualizer.flankOnlyMode : false")
    if not flank_active:
        page.click("#btnToggleFlankOnly")
        time.sleep(1)
        
    # 4. Toggle 'Vết Tiếp Xúc' (TCA)
    tca_active = page.evaluate("() => window.bevel3DVisualizer ? window.bevel3DVisualizer.tcaMode : false")
    if not tca_active:
        page.click("#btnToggleContactTCA")
        time.sleep(1)
        
    # Stop animation and freeze at initial contact
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.isAnimating = false;
        vis.pinionAngle = 0;
        vis.gearAngle = vis.initialGearAngle;
        vis.updateGearRotations();
    }""")
    time.sleep(0.5)

    # Screenshot 1: Overview Isometric in Flank Only + TCA mode
    page.screenshot(path=os.path.join(artifact_dir, "user_overview_iso_fixed.png"))
    print("Saved user_overview_iso_fixed.png")

    # Screenshot 2: Select 'Vùng Tiếp Xúc Ăn Khớp (Mesh Zone)' preset
    page.select_option("#sel3DViewPreset", "mesh")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "user_view_mesh_preset_fixed.png"))
    print("Saved user_view_mesh_preset_fixed.png")

    # Screenshot 3: View from behind Pinion looking down the active flank toward Apex
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);
        
        vis.camera.position.set(mx + 80, my - 30, 45);
        vis.controls.target.set(mx, my, -10);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "user_view_behind_pinion_fixed.png"))
    print("Saved user_view_behind_pinion_fixed.png")

    # Screenshot 4: View from behind Gear looking down the mating flank toward Apex
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);
        
        vis.camera.position.set(mx - 30, my + 80, 45);
        vis.controls.target.set(mx, my, -10);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "user_view_behind_gear_fixed.png"))
    print("Saved user_view_behind_gear_fixed.png")

    # Screenshot 5: Solid mode with TCA (turn off Flank Only to see solid gears meshing)
    page.click("#btnToggleFlankOnly")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "user_solid_mesh_fixed.png"))
    print("Saved user_solid_mesh_fixed.png")

    browser.close()

print("All screenshots captured successfully!")
