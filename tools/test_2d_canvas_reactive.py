import asyncio
import os
from playwright.async_api import async_playwright

async def test_2d_canvas():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        file_url = "file:///" + os.path.abspath("modules/bevel-gear/index.html").replace("\\", "/")
        print(f"Loading: {file_url}")
        await page.goto(file_url, wait_until="networkidle")

        # 1. Check Initial State
        print("\n--- CASE 1: Default Parameters (z1=18, z2=45) ---")
        tab_canvas_btn = page.locator('[data-target="tabCanvas"]')
        await tab_canvas_btn.click()
        await page.wait_for_timeout(500)

        # Switch to 2D mode if not already
        btn_2d = page.locator('#btnMode2D')
        if await btn_2d.is_visible():
            await btn_2d.click()
            await page.wait_for_timeout(500)

        g1 = await page.evaluate("() => ({ z1: window.bevelCanvas.geom.z1, z2: window.bevelCanvas.geom.z2, b: window.bevelCanvas.geom.b, Re: window.bevelCanvas.geom.Re, Ri: window.bevelCanvas.geom.Ri })")
        print(f"Case 1 Canvas Geom: {g1}")
        assert g1['z1'] == 18 and g1['z2'] == 45, f"Expected 18/45, got {g1}"
        assert g1['Ri'] > 0, f"Ri must be positive! Got {g1['Ri']}"

        await page.locator('#bevelCanvas').screenshot(path="scratch/test_2d_case1_axial.png")
        
        # Switch to Tredgold Dual View
        btn_tredgold = page.locator('#btn2DViewMesh')
        await btn_tredgold.click()
        await page.wait_for_timeout(300)
        await page.locator('#bevelCanvas').screenshot(path="scratch/test_2d_case1_tredgold.png")
        print("Case 1 screenshots saved.")

        # 2. Case 2: Change to user's small teeth test set (z1=11, z2=16, met=8, b=30)
        print("\n--- CASE 2: Small Teeth (z1=11, z2=16, met=8, b=30) ---")
        tab_calc_btn = page.locator('[data-target="tabCalculator"]')
        await tab_calc_btn.click()
        await page.wait_for_timeout(300)

        # Fill inputs
        await page.fill('#inp_z1', '11')
        await page.wait_for_timeout(100)
        await page.fill('#inp_z2', '16')
        await page.wait_for_timeout(100)
        await page.fill('#inp_mmn', '8.0')
        await page.wait_for_timeout(100)
        await page.fill('#inp_b', '30.0')
        await page.wait_for_timeout(300)

        # Switch to Canvas Tab
        await tab_canvas_btn.click()
        await page.wait_for_timeout(500)

        # Check Axial view
        btn_axial = page.locator('#btn2DViewAxial')
        await btn_axial.click()
        await page.wait_for_timeout(300)

        g2 = await page.evaluate("() => ({ z1: window.bevelCanvas.geom.z1, z2: window.bevelCanvas.geom.z2, b: window.bevelCanvas.geom.b, Re: window.bevelCanvas.geom.Re, Ri: window.bevelCanvas.geom.Ri })")
        print(f"Case 2 Canvas Geom: {g2}")
        assert g2['z1'] == 11 and g2['z2'] == 16, f"Expected 11/16, got {g2}"
        assert g2['b'] == 30, f"Expected b=30, got {g2['b']}"
        assert g2['Ri'] > 0, f"Ri must be positive! Got {g2['Ri']}"

        await page.locator('#bevelCanvas').screenshot(path="scratch/test_2d_case2_axial.png")

        # Check Tredgold view
        await btn_tredgold.click()
        await page.wait_for_timeout(300)
        await page.locator('#bevelCanvas').screenshot(path="scratch/test_2d_case2_tredgold.png")
        print("Case 2 screenshots saved.")

        # 3. Case 3: Another change (z1=25, z2=50, mmn=6, b=45)
        print("\n--- CASE 3: Another Set (z1=25, z2=50, b=45) ---")
        await tab_calc_btn.click()
        await page.wait_for_timeout(300)

        await page.fill('#inp_z1', '25')
        await page.wait_for_timeout(100)
        await page.fill('#inp_z2', '50')
        await page.wait_for_timeout(100)
        await page.fill('#inp_b', '45.0')
        await page.wait_for_timeout(300)

        await tab_canvas_btn.click()
        await page.wait_for_timeout(500)

        g3 = await page.evaluate("() => ({ z1: window.bevelCanvas.geom.z1, z2: window.bevelCanvas.geom.z2, b: window.bevelCanvas.geom.b, Re: window.bevelCanvas.geom.Re, Ri: window.bevelCanvas.geom.Ri })")
        print(f"Case 3 Canvas Geom: {g3}")
        assert g3['z1'] == 25 and g3['z2'] == 50, f"Expected 25/50, got {g3}"
        assert g3['b'] == 45, f"Expected b=45, got {g3['b']}"
        assert g3['Ri'] > 0, f"Ri must be positive! Got {g3['Ri']}"

        await btn_axial.click()
        await page.wait_for_timeout(300)
        await page.locator('#bevelCanvas').screenshot(path="scratch/test_2d_case3_axial.png")
        print("Case 3 screenshot saved.")

        print(f"\nTotal console errors: {len(console_errors)}")
        if console_errors:
            print("Errors:", console_errors)
        assert len(console_errors) == 0, f"Encountered console errors: {console_errors}"

        print("\n>>> ALL 2D CANVAS REACTIVE TESTS PASSED WITH 0 ERRORS! <<<")
        await browser.close()

if __name__ == "__main__":
    os.makedirs("scratch", exist_ok=True)
    asyncio.run(test_2d_canvas())
