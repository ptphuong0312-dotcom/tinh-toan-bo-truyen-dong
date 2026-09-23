import os
import sys
import time
from playwright.sync_api import sync_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

base_dir = r"F:\Antigravity\MITCalc-Gear-Engineering"
artifact_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
file_url = "file:///" + os.path.join(base_dir, "modules", "bevel-gear", "index.html").replace("\\", "/")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page.goto(file_url)
    page.wait_for_load_state("networkidle")
    time.sleep(1.5)
    
    # Switch to 3D tab
    page.click("button[data-target='tabCanvas']")
    time.sleep(0.5)
    page.click("#btnMode3D")
    time.sleep(1.5)
    
    # Enable TCA Contact Mark & Prussian Blue
    page.click("#btnToggleContactTCA")
    time.sleep(0.3)
    page.select_option("#selTCAPatternType", "1") # Cumulative Gleason Rolled Pattern
    page.select_option("#selTCAColorMode", "1")    # Prussian Blue
    time.sleep(0.5)
    
    # 1. Forward Rotation (+1) - Solid Assembly Full View
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.isAnimating = false;
        vis.animDirection = 1;
        vis.tcaUniforms.uAnimDirection.value = 1.0;
        vis.pinionAngle = 0.0;
        vis.gearAngle = vis.initialGearAngle;
        vis.updateGearRotations();
        
        // Center on contact pitch point
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 220, yc + 180, zc + 280);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_forward_solid_iso_prussian_blue.png"))
    print("Saved bevel_forward_solid_iso_prussian_blue.png")
    
    # 2. Forward Rotation (+1) - Close-up Contact Flank Zoom
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 75, yc + 55, zc + 110);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_forward_contact_mesh_zoom.png"))
    print("Saved bevel_forward_contact_mesh_zoom.png")
    
    # 3. Forward Rotation (+1) - View from BEHIND the teeth ("phía sau của bánh răng")
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        // Look from the back side (negative Z, looking toward contact zone)
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 50, yc + 70, zc - 160);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_forward_behind_teeth_view.png"))
    print("Saved bevel_forward_behind_teeth_view.png")
    
    # 4. TOGGLE TO REVERSE ROTATION (-1)
    page.click("#btn3DAnimDirection")
    time.sleep(0.5)
    
    # 5. Reverse Rotation (-1) - Close-up Contact Flank Zoom (Coast Flanks Active!)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 75, yc + 55, zc + 110);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_reverse_contact_mesh_zoom.png"))
    print("Saved bevel_reverse_contact_mesh_zoom.png")
    
    # 6. Reverse Rotation (-1) - View from BEHIND the teeth
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 50, yc + 70, zc - 160);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_reverse_behind_teeth_view.png"))
    print("Saved bevel_reverse_behind_teeth_view.png")
    
    # 7. Reverse Rotation (-1) - Solid Assembly Full View
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = 0.0;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 220, yc + 180, zc + 280);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
        vis.renderer.render(vis.scene, vis.camera);
    }""")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(artifact_dir, "bevel_reverse_solid_iso_prussian_blue.png"))
    print("Saved bevel_reverse_solid_iso_prussian_blue.png")
    
    browser.close()
    print("ALL 6 PRESENTATION SCREENSHOTS SAVED SUCCESSFULLY!")
