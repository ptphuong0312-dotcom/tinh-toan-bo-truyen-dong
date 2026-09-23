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

print(f"Testing two-sided contact inspection on {file_url}...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    page.goto(file_url)
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    
    # Switch to 3D, Flank Only, TCA
    page.click("button[data-target='tabCanvas']")
    time.sleep(1)
    page.click("#btnMode3D")
    time.sleep(2)
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

    # VIEW 1: Look at the mating Gear Flank 1 directly (from -Z side of the contact plane)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        // Position camera on the -Z side looking directly at Gear Flank 1!
        vis.camera.position.set(xc + 40, yc + 50, zc - 90);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "gear_flank1_contact_mark.png"))
    print("Saved gear_flank1_contact_mark.png")

    # VIEW 2: Look at Pinion Flank 1 directly (from +Z side of the contact plane)
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        // Position camera on the +Z side looking directly at Pinion Flank 1!
        vis.camera.position.set(xc + 40, yc + 50, zc + 90);
        vis.camera.up.set(0, 1, 0);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "pinion_flank1_contact_mark.png"))
    print("Saved pinion_flank1_contact_mark.png")

    # VIEW 3: Top-Down view looking directly into the mesh gap between Pinion and Gear teeth
    page.evaluate("""() => {
        const vis = window.bevel3DVisualizer;
        const Rm = vis.geom ? parseFloat(vis.geom.Rm) : 280;
        const delta1 = vis.geom ? parseFloat(vis.geom.delta1) : 0.38;
        const xc = Rm * Math.cos(delta1);
        const yc = Rm * Math.sin(delta1);
        const zc = -10.6;
        
        vis.controls.target.set(xc, yc, zc);
        // Look along the contact tangent from above (looking down the face width from Heel to Apex)
        vis.camera.position.set(xc + 110, yc + 110, zc);
        vis.camera.up.set(0, 0, 1);
        vis.controls.update();
    }""")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "contact_interface_looking_to_apex.png"))
    print("Saved contact_interface_looking_to_apex.png")

    browser.close()

print("All two-sided views saved!")
