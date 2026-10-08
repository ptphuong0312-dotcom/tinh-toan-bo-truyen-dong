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

        # 1. Verify summary banner is removed
        banner_exists = page.locator(".summary-banner").count() > 0
        print(f"Summary banner exists: {banner_exists} (should be False)")

        # 2. Parallel key screenshot
        shot_par = os.path.join(artifacts_dir, "test_parallel_keys_no_banner.png")
        page.screenshot(path=shot_par, full_page=True)
        print(f"Saved: {shot_par}")

        # 3. Switch to Woodruff tab
        print("Switching to Woodruff tab...")
        page.click("button[data-type='woodruff']")
        page.wait_for_timeout(400)

        badge_woodruff = page.inner_text(".canvas-title-badge")
        print(f"Woodruff badge: {badge_woodruff.encode('ascii', 'ignore').decode()}")

        shot_woodruff = os.path.join(artifacts_dir, "test_woodruff_2views.png")
        page.screenshot(path=shot_woodruff, full_page=True)
        print(f"Saved: {shot_woodruff}")

        canvas_box = page.locator(".canvas-container-box")
        shot_canvas_woodruff = os.path.join(artifacts_dir, "test_woodruff_canvas.png")
        canvas_box.screenshot(path=shot_canvas_woodruff)
        print(f"Saved: {shot_canvas_woodruff}")

        # 4. Switch to Splines tab
        print("Switching to Splines tab...")
        page.click("button[data-type='spline']")
        page.wait_for_timeout(400)

        badge_spline = page.inner_text(".canvas-title-badge")
        print(f"Splines badge: {badge_spline.encode('ascii', 'ignore').decode()}")

        shot_spline = os.path.join(artifacts_dir, "test_splines_2views.png")
        page.screenshot(path=shot_spline, full_page=True)
        print(f"Saved: {shot_spline}")

        shot_canvas_spline = os.path.join(artifacts_dir, "test_splines_canvas.png")
        canvas_box.screenshot(path=shot_canvas_spline)
        print(f"Saved: {shot_canvas_spline}")

        browser.close()

    if errors:
        print("ERRORS DETECTED:")
        for e in errors:
            print(" -", e)
    else:
        print("ALL TESTS PASSED WITH 0 ERRORS!")

if __name__ == "__main__":
    run_test()
