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

print(f"Testing step-by-step rolling motion on {file_url}...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page.goto(file_url)
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    
    # 1. Switch to tabCanvas & 3D WebGL
    page.click("button[data-target='tabCanvas']")
    time.sleep(1)
    page.click("#btnMode3D")
    time.sleep(2)
    
    # 2. Toggle Flank Only and TCA
    page.click("#btnToggleFlankOnly")
    time.sleep(0.5)
    page.click("#btnToggleContactTCA")
    time.sleep(0.5)

    # Freeze animation
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.isAnimating = false;
        vis.pinionAngle = 0;
        vis.gearAngle = vis.initialGearAngle;
        vis.updateGearRotations();
    }""")
    time.sleep(0.5)

    # 3. Position camera looking directly into the active contact zone from the front-side
    # so both Pinion and Gear contacting teeth are clearly visible side-by-side
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        // Angle camera to see into the contact gap between Pinion and Gear flanks
        vis.camera.position.set(xc + 65, yc + 35, zc + 85);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
    }""")
    time.sleep(1)

    # Capture Mode 1 (Gleason Rolled Pattern)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.setTCAPatternType(1); // Gleason Rolled
    }""")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(artifact_dir, "step_roll_gleason_mode1.png"))
    print("Saved step_roll_gleason_mode1.png")

    # Capture Mode 0 (Dynamic Rolling Locus) at 5 steps of rotation (-2 deg to +2 deg)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        vis.setTCAPatternType(0); // Dynamic Rolling Locus
    }""")
    time.sleep(0.5)

    for i, deg in enumerate([-2.0, -1.0, 0.0, 1.0, 2.0]):
        page.evaluate(f"""() => {{
            const vis = window.bevel3DVisualizer;
            const a1 = {deg} * Math.PI / 180.0;
            vis.pinionAngle = a1;
            vis.gearAngle = vis.initialGearAngle - a1 / vis.gearRatio;
            vis.updateGearRotations();
        }}""")
        time.sleep(0.5)
        path = os.path.join(artifact_dir, f"dynamic_roll_step_{i+1}_deg{deg:+.1f}.png")
        page.screenshot(path=path)
        print(f"Saved {path}")

    browser.close()

print("Motion testing completed!")
