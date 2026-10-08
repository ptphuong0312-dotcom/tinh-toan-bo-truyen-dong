import os
from playwright.sync_api import sync_playwright

def run_test():
    artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
    html_path = os.path.abspath("modules/shaft-keys/index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"

    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 1100})

        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}") if msg.type in ['error', 'warning'] else None)
        page.on("pageerror", lambda err: errors.append(str(err)))

        print(f"Loading {file_url}...")
        page.goto(file_url, wait_until="networkidle")

        # 1. Check Section 1.0 is collapsed
        sec1_collapsed = page.eval_on_selector("#sec1Inputs", "el => el.classList.contains('collapsed')")
        print(f"Section 1.0 collapsed: {sec1_collapsed}")

        # 2. Check font color and styling for input boxes
        d_color = page.eval_on_selector("#txtParallelDiam", "el => window.getComputedStyle(el).color")
        d_weight = page.eval_on_selector("#txtParallelDiam", "el => window.getComputedStyle(el).fontWeight")
        print(f"txtParallelDiam color: {d_color}, font-weight: {d_weight}")

        # 3. Check highlight on d1 and d2
        d1_highlight = page.eval_on_selector("#outParallelD1", "el => el.classList.contains('highlight-key-param')")
        d2_highlight = page.eval_on_selector("#outParallelD2", "el => el.classList.contains('highlight-key-param')")
        lf_highlight = page.eval_on_selector("#outParallelLf", "el => el.classList.contains('highlight-key-param')")
        print(f"Highlight check -> d1: {d1_highlight}, d2: {d2_highlight}, Lf: {lf_highlight}")

        # 4. Check dropdown default
        sel_val = page.eval_on_selector("#selParallelType", "el => el.value")
        sel_text = page.eval_on_selector("#selParallelType", "el => el.options[el.selectedIndex].text")
        print(f"Default standard: {sel_val} -> {sel_text}")

        # Screenshot 1: 1 then (Default)
        shot1 = os.path.join(artifacts_dir, "keys_2views_1key.png")
        page.screenshot(path=shot1, full_page=True)
        print(f"Saved: {shot1}")

        # Zoom into Canvas
        canvas_box = page.locator(".canvas-container-box")
        shot_canvas_1key = os.path.join(artifacts_dir, "keys_canvas_2views_1key.png")
        canvas_box.screenshot(path=shot_canvas_1key)
        print(f"Saved: {shot_canvas_1key}")

        # Screenshot 2: 2 thens
        page.select_option("#selParallelNumKeys", "2")
        page.wait_for_timeout(300)
        shot_canvas_2keys = os.path.join(artifacts_dir, "keys_canvas_2views_2keys.png")
        canvas_box.screenshot(path=shot_canvas_2keys)
        print(f"Saved: {shot_canvas_2keys}")

        # Screenshot 3: 3 thens
        page.select_option("#selParallelNumKeys", "3")
        page.wait_for_timeout(300)
        shot_canvas_3keys = os.path.join(artifacts_dir, "keys_canvas_2views_3keys.png")
        canvas_box.screenshot(path=shot_canvas_3keys)
        print(f"Saved: {shot_canvas_3keys}")

        # Screenshot 4: 4 thens
        page.select_option("#selParallelNumKeys", "4")
        page.wait_for_timeout(300)
        shot_canvas_4keys = os.path.join(artifacts_dir, "keys_canvas_2views_4keys.png")
        canvas_box.screenshot(path=shot_canvas_4keys)
        print(f"Saved: {shot_canvas_4keys}")

        # Reset back to 1 then
        page.select_option("#selParallelNumKeys", "1")
        page.wait_for_timeout(300)

        browser.close()

    if errors:
        print("ERRORS DETECTED:")
        for e in errors:
            print(" -", e)
    else:
        print("ALL TESTS PASSED WITH 0 ERRORS!")

if __name__ == "__main__":
    run_test()
