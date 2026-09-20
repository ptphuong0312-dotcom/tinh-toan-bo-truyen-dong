import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

file_url = 'file:///F:/Antigravity/MITCalc-Gear-Engineering/modules/spur-gear/index.html'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({"width": 1400, "height": 900})
    page.goto(file_url)
    time.sleep(0.5)

    # 1. Switch to 3D
    print('[*] Switching to Tab 2 and 3D mode...')
    page.evaluate('document.querySelector("button[data-target=\'tabCanvas\']").click()')
    page.evaluate('document.getElementById("btnMode3D").click()')
    time.sleep(0.5)

    # 2. Check 3D triangles
    t_info = page.evaluate('''() => {
        const v3d = window.spurApp.visualizer3D;
        const pTris = v3d.getExportTriangles('pinion');
        const gTris = v3d.getExportTriangles('gear');
        const aTris = v3d.getExportTriangles('assembly');
        return {
            pinionTriCount: pTris.length,
            gearTriCount: gTris.length,
            assemblyTriCount: aTris.length
        };
    }''')
    print(f'[+] Triangle counts: Pinion = {t_info["pinionTriCount"]:,} | Gear = {t_info["gearTriCount"]:,} | Assembly = {t_info["assemblyTriCount"]:,}')

    # 3. Test Binary STL generation time
    t0 = time.time()
    stl_len = page.evaluate('''() => {
        const tris = window.spurApp.visualizer3D.getExportTriangles('pinion');
        // Test time to serialize Binary STL buffer
        const numTriangles = tris.length;
        const totalBytes = 84 + numTriangles * 50;
        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);
        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
            const tri = tris[i];
            view.setFloat32(offset, tri[3][0], true);
            view.setFloat32(offset + 4, tri[3][1], true);
            view.setFloat32(offset + 8, tri[3][2], true);
            view.setFloat32(offset + 12, tri[0][0], true);
            view.setFloat32(offset + 16, tri[0][1], true);
            view.setFloat32(offset + 20, tri[0][2], true);
            offset += 50;
        }
        return buffer.byteLength;
    }''')
    print(f'[+] Binary STL generation time: {time.time() - t0:.3f} s ({stl_len:,} bytes)')

    # 4. Test STEP generation time
    t0 = time.time()
    print('[*] Testing STEP export generation...')
    step_res = page.evaluate('''() => {
        const tris = window.spurApp.visualizer3D.getExportTriangles('pinion');
        const vMap = new Map();
        let nextVId = 1;
        const faceDefinitions = [];
        for (let i = 0; i < tris.length; i++) {
            const [p1, p2, p3, n] = tris[i];
            const k1 = `${Math.round(p1[0]*1000)},${Math.round(p1[1]*1000)},${Math.round(p1[2]*1000)}`;
            const k2 = `${Math.round(p2[0]*1000)},${Math.round(p2[1]*1000)},${Math.round(p2[2]*1000)}`;
            const k3 = `${Math.round(p3[0]*1000)},${Math.round(p3[1]*1000)},${Math.round(p3[2]*1000)}`;
            let id1 = vMap.get(k1);
            if (!id1) { id1 = nextVId++; vMap.set(k1, id1); }
            let id2 = vMap.get(k2);
            if (!id2) { id2 = nextVId++; vMap.set(k2, id2); }
            let id3 = vMap.get(k3);
            if (!id3) { id3 = nextVId++; vMap.set(k3, id3); }
            if (id1 !== id2 && id2 !== id3 && id3 !== id1) {
                faceDefinitions.push({ id1, id2, id3 });
            }
        }
        return { uniqueVertices: vMap.size, validFaces: faceDefinitions.length };
    }''')
    print(f'[+] STEP preparation time: {time.time() - t0:.3f} s (Vertices: {step_res["uniqueVertices"]:,}, Faces: {step_res["validFaces"]:,})')

    browser.close()
