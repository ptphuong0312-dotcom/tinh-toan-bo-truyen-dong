from playwright.sync_api import sync_playwright
import os

url = 'file:///' + os.path.abspath('modules/bevel-gear/index.html').replace('\\', '/')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1200, 'height': 800})
    page.goto(url)
    page.wait_for_timeout(1000)
    
    # Input parameters
    page.fill('#inp_z1', '11')
    page.dispatch_event('#inp_z1', 'input')
    page.fill('#inp_z2', '16')
    page.dispatch_event('#inp_z2', 'input')
    page.fill('#inp_alfa', '25.0')
    page.dispatch_event('#inp_alfa', 'input')
    page.fill('#inp_beta', '0.0')
    page.dispatch_event('#inp_beta', 'input')
    page.select_option('#selModuleType', 'transverse_outer')
    page.fill('#inp_mmn', '8.0')
    page.dispatch_event('#inp_mmn', 'input')
    page.fill('#inp_b', '30.0')
    page.dispatch_event('#inp_b', 'input')
    page.wait_for_timeout(500)
    
    page.click('.tab-btn[data-target="tabCanvas"]')
    page.click('#btnMode3D')
    page.wait_for_timeout(1500)
    
    eval_code = '''() => {
        const vis = window.appUI.visualizer3D;
        vis.gearAngle = vis.initialGearAngle; // Math.PI / 16
        vis.updateGearRotations();
        vis.pinionGroup.updateMatrixWorld(true);
        vis.gearGroup.updateMatrixWorld(true);
        
        const g1 = vis.pinionMesh.geometry;
        const g2 = vis.gearMesh.geometry;
        const pos1 = g1.attributes.position;
        const pos2 = g2.attributes.position;
        
        // Find pairs of vertices with distance < 2.0 mm
        const closePairs = [];
        for (let i = 0; i < pos1.count; i += 5) {
            const p1 = new THREE.Vector3(pos1.getX(i), pos1.getY(i), pos1.getZ(i)).applyMatrix4(vis.pinionMesh.matrixWorld);
            if (p1.x < 30 || p1.x > 70 || p1.y < 20 || p1.y > 50) continue;
            for (let j = 0; j < pos2.count; j += 5) {
                const p2 = new THREE.Vector3(pos2.getX(j), pos2.getY(j), pos2.getZ(j)).applyMatrix4(vis.gearMesh.matrixWorld);
                const d = p1.distanceTo(p2);
                if (d < 1.0) {
                    closePairs.push({
                        d: d.toFixed(3),
                        p1: { x: p1.x.toFixed(2), y: p1.y.toFixed(2), z: p1.z.toFixed(2) },
                        p2: { x: p2.x.toFixed(2), y: p2.y.toFixed(2), z: p2.z.toFixed(2) }
                    });
                    if (closePairs.length >= 8) return closePairs;
                }
            }
        }
        return closePairs;
    }'''
    
    pairs = page.evaluate(eval_code)
    print('Close pairs (d < 1mm):')
    for p in pairs:
        print(p)
    browser.close()
