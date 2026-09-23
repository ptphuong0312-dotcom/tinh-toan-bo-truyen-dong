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

print(f"Testing centered contact view on {file_url}...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page.goto(file_url)
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    
    # 1. Switch to tabCanvas & 3D
    page.click("button[data-target='tabCanvas']")
    time.sleep(1)
    page.click("#btnMode3D")
    time.sleep(2)
    
    # 2. Toggle 'Chỉ Mặt Bên' (Flank Only) and 'Vết Tiếp Xúc' (TCA) via DOM click
    page.click("#btnToggleFlankOnly")
    time.sleep(0.5)
    page.click("#btnToggleContactTCA")
    time.sleep(0.5)
    
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.setTCAPatternType(1); // Gleason Rolled Pattern
        vis.isAnimating = false;
        vis.pinionAngle = 0;
        vis.gearAngle = vis.initialGearAngle;
        vis.updateGearRotations();
    }""")
    time.sleep(0.5)

    # 3. View A: Centered Isometric directly on contact spot (Xc, Yc, Zc)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 75, yc + 55, zc + 110);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "centered_contact_iso.png"))
    print("Saved centered_contact_iso.png")

    # 4. View B: Looking from outside along the pitch cone line toward Apex (Frontal-Side View)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 120, yc + 50, zc + 30);
        vis.camera.up.set(0, 0, 1);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "centered_contact_along_pitch.png"))
    print("Saved centered_contact_along_pitch.png")

    # 5. View C: User View - looking from behind Pinion tooth looking down into the tooth space
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        vis.camera.position.set(xc + 40, yc - 90, zc + 60);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "centered_contact_user_flank_view.png"))
    print("Saved centered_contact_user_flank_view.png")

    # 6. View D: Prussian Blue mode (mode 1)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.setTCAColorMode(1); // Prussian Blue
    }""")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(artifact_dir, "centered_contact_prussian_blue.png"))
    print("Saved centered_contact_prussian_blue.png")

    browser.close()

print("Finished centered contact inspection!")
