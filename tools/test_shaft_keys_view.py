import os
from playwright.sync_api import sync_playwright

def run_test():
    artifacts_dir = r"C:\Users\AD\.gemini\antigravity\brain\fe6c5191-60b1-4a67-8b96-16595ac3bbf0"
    html_path = os.path.abspath("modules/shaft-keys/index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"

    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 1000})

        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}") if msg.type in ['error', 'warning'] else None)
        page.on("pageerror", lambda err: errors.append(str(err)))

        print(f"Loading {file_url}...")
        page.goto(file_url, wait_until="networkidle")

        # 1. Check dropdown value
        sel_val = page.eval_on_selector("#selParallelType", "el => el.value")
        sel_text = page.eval_on_selector("#selParallelType", "el => el.options[el.selectedIndex].text")
        print(f"Default selected standard: {sel_val} -> {sel_text}")

        # Screenshot 1: Triple View default (1 then)
        shot1 = os.path.join(artifacts_dir, "keys_triple_1key.png")
        page.screenshot(path=shot1, full_page=True)
        print(f"Saved: {shot1}")

        # Screenshot 2: 2 thens
        page.select_option("#selParallelNumKeys", "2")
        page.wait_for_timeout(300)
        shot2 = os.path.join(artifacts_dir, "keys_triple_2keys.png")
        page.screenshot(path=shot2, full_page=True)
        print(f"Saved: {shot2}")

        # Screenshot 3: 3 thens
        page.select_option("#selParallelNumKeys", "3")
        page.wait_for_timeout(300)
        shot3 = os.path.join(artifacts_dir, "keys_triple_3keys.png")
        page.screenshot(path=shot3, full_page=True)
        print(f"Saved: {shot3}")

        # Screenshot 4: 4 thens
        page.select_option("#selParallelNumKeys", "4")
        page.wait_for_timeout(300)
        shot4 = os.path.join(artifacts_dir, "keys_triple_4keys.png")
        page.screenshot(path=shot4, full_page=True)
        print(f"Saved: {shot4}")

        # Switch to Single Assembly View
        page.click("#btnAssemblyView")
        page.wait_for_timeout(300)
        shot_asm = os.path.join(artifacts_dir, "keys_single_assembly.png")
        page.screenshot(path=shot_asm, full_page=True)
        print(f"Saved: {shot_asm}")

        # Switch back to Triple View and select 1 then
        page.click("#btnTripleView")
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
