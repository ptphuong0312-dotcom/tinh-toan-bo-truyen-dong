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
        const g1 = vis.pinionMesh.geometry;
        const g2 = vis.gearMesh.geometry;
        vis.pinionGroup.updateMatrixWorld(true);
        
        const pos1 = g1.attributes.position;
        const pos2 = g2.attributes.position;
        
        // Find pinion tooth 0 tip/flank points near Rm
        // Rm is ~62.7, delta1 is 34.5 deg -> mx = 51.6, my = 35.5
        const p1_flankL = []; // Z < 0
        const p1_flankR = []; // Z > 0
        
        for (let i = 0; i < pos1.count; i++) {
            const p = new THREE.Vector3(pos1.getX(i), pos1.getY(i), pos1.getZ(i)).applyMatrix4(vis.pinionMesh.matrixWorld);
            if (p.x >= 45 && p.x <= 58 && p.y >= 30 && p.y <= 42) {
                if (p.z < -0.5) p1_flankL.push(p);
                else if (p.z > 0.5) p1_flankR.push(p);
            }
        }
        
        // Test fine angles around 0
        const results = [];
        for (let a = -0.04; a <= 0.04; a += 0.005) {
            vis.gearAngle = a;
            vis.updateGearRotations();
            vis.gearGroup.updateMatrixWorld(true);
            
            let minDL = 999;
            let minDR = 999;
            
            for (let j = 0; j < pos2.count; j += 2) {
                const p2 = new THREE.Vector3(pos2.getX(j), pos2.getY(j), pos2.getZ(j)).applyMatrix4(vis.gearMesh.matrixWorld);
                if (p2.x >= 45 && p2.x <= 58 && p2.y >= 30 && p2.y <= 42) {
                    if (p2.z < 0) {
                        for (let k = 0; k < p1_flankL.length; k += 2) {
                            const d = p1_flankL[k].distanceTo(p2);
                            if (d < minDL) minDL = d;
                        }
                    } else {
                        for (let k = 0; k < p1_flankR.length; k += 2) {
                            const d = p1_flankR[k].distanceTo(p2);
                            if (d < minDR) minDR = d;
                        }
                    }
                }
            }
            results.push({
                angle: a.toFixed(4),
                minDL: minDL.toFixed(3),
                minDR: minDR.toFixed(3),
                diff: (minDR - minDL).toFixed(3)
            });
        }
        return results;
    }'''
    
    rows = page.evaluate(eval_code)
    for r in rows:
        print(f"Angle {r['angle']}: gapLeft = {r['minDL']}, gapRight = {r['minDR']}, diff = {r['diff']}")

    browser.close()
