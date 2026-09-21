import os
from playwright.sync_api import sync_playwright

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_path = os.path.join(base_dir, "modules", "bevel-gear", "index.html")
file_url = "file:///" + target_path.replace("\\", "/")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1400, 'height': 900})
    page.goto(file_url)
    page.wait_for_timeout(1000)

    page.click('button[data-target="tabCanvas"]')
    page.wait_for_timeout(300)
    page.click('#btnMode3D')
    page.wait_for_timeout(500)

    # Check the tooth slant direction for Left-hand Pinion vs Right-hand Pinion
    # In ISO 23509:
    # A Left-hand spiral pinion has teeth that curve counter-clockwise as they recede towards the apex.
    # Looking from the back (Heel) towards Apex:
    # As you move from Heel to Toe (towards apex), a Left-hand spiral curves to the LEFT!
    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const geom = v.geom;
        const Re = geom.Re, Ri = geom.Ri, Rm = geom.Rm, b = geom.b;
        const beta = 30 * Math.PI / 180;
        const R_tool = 1.5 * b;

        // Heel (u = +0.5), Toe (u = -0.5)
        const termHeel = 0.5 * b + R_tool * Math.sin(beta);
        const W_Heel = (R_tool * Math.cos(beta) - Math.sqrt(R_tool * R_tool - termHeel * termHeel));

        const termToe = -0.5 * b + R_tool * Math.sin(beta);
        const W_Toe = (R_tool * Math.cos(beta) - Math.sqrt(R_tool * R_tool - termToe * termToe));

        return {
            W_Heel: W_Heel.toFixed(3),
            W_Toe: W_Toe.toFixed(3),
            deltaW_from_Heel_to_Toe: (W_Toe - W_Heel).toFixed(3)
        };
    }''')
    print("Spiral displacement W:", res)
    b.close()
