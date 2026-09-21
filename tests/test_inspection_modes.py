import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

html_path = "file:///" + os.path.abspath("modules/bevel-gear/index.html").replace("\\", "/")
screenshots_dir = "scratch/inspection_tests"
os.makedirs(screenshots_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    
    print("[1] Navigating to Bevel Gear Web App...")
    page.goto(html_path)
    page.wait_for_load_state("networkidle")
    
    print("[2] Switching to 3D Simulation Tab...")
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(600)
    
    # Switch view preset to mesh zone for best inspection clarity
    page.select_option('#sel3DViewPreset', 'mesh')
    page.wait_for_timeout(400)
    
    # -------------------------------------------------------------
    # TEST MODE 1: Flank Surface Only
    # -------------------------------------------------------------
    print("[3] Testing Mode 1: Flank Surface Only (#btnToggleFlankOnly)...")
    page.click('#btnToggleFlankOnly')
    page.wait_for_timeout(400)
    
    m1_state = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        return {
            flankOnlyMode: v.flankOnlyMode,
            pinionSolidVisible: v.pinionMesh.visible,
            gearSolidVisible: v.gearMesh.visible,
            pinionSurfVisible: v.pinionSurfMesh ? v.pinionSurfMesh.visible : false,
            gearSurfVisible: v.gearSurfMesh ? v.gearSurfMesh.visible : false,
            btnText: document.getElementById('btnToggleFlankOnly').innerText
        };
    }''')
    print("    Mode 1 ON State:", m1_state)
    assert m1_state['flankOnlyMode'] == True
    assert m1_state['pinionSolidVisible'] == False
    assert m1_state['pinionSurfVisible'] == True
    page.screenshot(path=os.path.join(screenshots_dir, 'mode1_flank_only.png'))
    
    # Toggle OFF
    page.click('#btnToggleFlankOnly')
    page.wait_for_timeout(300)
    
    # -------------------------------------------------------------
    # TEST MODE 2: Digital Clearance HUD Gauge
    # -------------------------------------------------------------
    print("[4] Testing Mode 2: Clearance HUD Gauge (#btnToggleClearanceGauge)...")
    page.click('#btnToggleClearanceGauge')
    page.wait_for_timeout(400)
    
    m2_state = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const hud = document.getElementById('hudClearanceGauge');
        return {
            clearanceGaugeMode: v.clearanceGaugeMode,
            hudDisplay: hud ? hud.style.display : 'none',
            contactVal: document.getElementById('hudValContactClearance').innerText,
            rootVal: document.getElementById('hudValRootClearance').innerText,
            indicator: document.getElementById('hudClearanceIndicator').innerText,
            markerVisible: v.contactMarker ? v.contactMarker.visible : false,
            btnText: document.getElementById('btnToggleClearanceGauge').innerText
        };
    }''')
    print("    Mode 2 ON State:", m2_state)
    assert m2_state['clearanceGaugeMode'] == True
    assert m2_state['hudDisplay'] == 'block'
    assert '0.000' in m2_state['contactVal']
    assert '2.000' in m2_state['rootVal']
    assert 'TIẾP XÚC' in m2_state['indicator']
    page.screenshot(path=os.path.join(screenshots_dir, 'mode2_clearance_gauge.png'))
    
    # Toggle OFF
    page.click('#btnToggleClearanceGauge')
    page.wait_for_timeout(300)
    
    # -------------------------------------------------------------
    # TEST MODE 3: Section Cut Plane
    # -------------------------------------------------------------
    print("[5] Testing Mode 3: Section Cut Plane (#btnToggleSectionCut)...")
    page.click('#btnToggleSectionCut')
    page.wait_for_timeout(400)
    
    m3_state = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        return {
            sectionCutMode: v.sectionCutMode,
            pinionPlanesCount: v.pinionMesh.material.clippingPlanes.length,
            gearPlanesCount: v.gearMesh.material.clippingPlanes.length,
            btnText: document.getElementById('btnToggleSectionCut').innerText
        };
    }''')
    print("    Mode 3 ON State:", m3_state)
    assert m3_state['sectionCutMode'] == True
    assert m3_state['pinionPlanesCount'] == 1
    page.screenshot(path=os.path.join(screenshots_dir, 'mode3_section_cut.png'))
    
    # Toggle OFF
    page.click('#btnToggleSectionCut')
    page.wait_for_timeout(300)
    
    # -------------------------------------------------------------
    # TEST COMBINATION 1+2: Flank Only + Clearance Gauge
    # -------------------------------------------------------------
    print("[6] Testing Combination: Mode 1 + Mode 2...")
    page.click('#btnToggleFlankOnly')
    page.click('#btnToggleClearanceGauge')
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(screenshots_dir, 'combo_1_and_2.png'))
    
    # -------------------------------------------------------------
    # TEST COMBINATION 1+2+3: All Three Modes Active!
    # -------------------------------------------------------------
    print("[7] Testing Combination: ALL 3 MODES ACTIVE (1 + 2 + 3)...")
    page.click('#btnToggleSectionCut')
    page.wait_for_timeout(400)
    
    all_active_state = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        return {
            flankOnly: v.flankOnlyMode,
            gauge: v.clearanceGaugeMode,
            sectionCut: v.sectionCutMode,
            hudDisplay: document.getElementById('hudClearanceGauge').style.display,
            clippingCount: v.pinionSurfMesh.material.clippingPlanes.length
        };
    }''')
    print("    All 3 Active State:", all_active_state)
    assert all_active_state['flankOnly'] == True
    assert all_active_state['gauge'] == True
    assert all_active_state['sectionCut'] == True
    assert all_active_state['clippingCount'] == 1
    page.screenshot(path=os.path.join(screenshots_dir, 'combo_all_three_active.png'))
    
    # -------------------------------------------------------------
    # TEST STEPPING WHILE GAUGE IS ACTIVE
    # -------------------------------------------------------------
    print("[8] Testing Step Forward and Step Backward...")
    for _ in range(5):
        page.click('#btn3DStepFwd')
        page.wait_for_timeout(100)
    
    step_state = page.evaluate('''() => {
        return {
            contactVal: document.getElementById('hudValContactClearance').innerText,
            indicator: document.getElementById('hudClearanceIndicator').innerText
        };
    }''')
    print("    Stepped Forward State:", step_state)
    page.screenshot(path=os.path.join(screenshots_dir, 'stepped_state.png'))
    
    print("[9] Checking Console Errors...")
    print("    Console Errors Count:", len(console_errors))
    if console_errors:
        print("    Errors:", console_errors)
    assert len(console_errors) == 0
    
    browser.close()
    print(">>> ALL INSPECTION MODES TESTS PASSED 100%! <<<")
