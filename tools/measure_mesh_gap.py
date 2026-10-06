from playwright.sync_api import sync_playwright
import os, json

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
    
    # Compute tooth centers and contact at pitch line
    eval_code = '''() => {
        const vis = window.appUI.visualizer3D;
        const g1 = vis.pinionMesh.geometry;
        const g2 = vis.gearMesh.geometry;
        
        // Transform a point by pinionGroup or gearGroup
        vis.pinionGroup.updateMatrixWorld(true);
        vis.gearGroup.updateMatrixWorld(true);
        
        const pos1 = g1.attributes.position;
        const pos2 = g2.attributes.position;
        
        // Find pinion vertices near Rm that have Z near 0 (near the contact plane)
        // Rm is ~62.7
        const testOffsets = [];
        const z2 = 16;
        const pitch = 2.0 * Math.PI / z2;
        
        // For offsets across one pitch
        for (let step = 0; step < 20; step++) {
            const testAngle = (step / 20.0) * pitch;
            vis.gearAngle = testAngle;
            vis.updateGearRotations();
            vis.gearGroup.updateMatrixWorld(true);
            
            // Check minimum distance between tooth tips/flanks near contact zone
            // Contact zone is around X in [30, 70], Y in [20, 50], Z in [-15, 15]
            let minD = 999999;
            let countNear = 0;
            
            // Sample vertices near contact zone
            const pts1 = [];
            for (let i = 0; i < pos1.count; i += 2) {
                const p = new THREE.Vector3(pos1.getX(i), pos1.getY(i), pos1.getZ(i));
                p.applyMatrix4(vis.pinionMesh.matrixWorld);
                if (p.x >= 30 && p.x <= 70 && p.y >= 20 && p.y <= 50 && Math.abs(p.z) <= 12) {
                    pts1.push(p);
                }
            }
            
            const pts2 = [];
            for (let j = 0; j < pos2.count; j += 2) {
                const p = new THREE.Vector3(pos2.getX(j), pos2.getY(j), pos2.getZ(j));
                p.applyMatrix4(vis.gearMesh.matrixWorld);
                if (p.x >= 30 && p.x <= 70 && p.y >= 20 && p.y <= 50 && Math.abs(p.z) <= 12) {
                    pts2.push(p);
                }
            }
            
            let penetrations = 0;
            for (let a = 0; a < pts1.length; a += 3) {
                for (let b = 0; b < pts2.length; b += 3) {
                    const d = pts1[a].distanceTo(pts2[b]);
                    if (d < minD) minD = d;
                    if (d < 1.0) penetrations++;
                }
            }
            testOffsets.push({
                offset: testAngle,
                frac: (step / 20.0).toFixed(2),
                minD: minD.toFixed(3),
                penetrations,
                n1: pts1.length,
                n2: pts2.length
            });
        }
        return testOffsets;
    }'''
    
    offsets = page.evaluate(eval_code)
    for row in offsets:
        print(f"Frac {row['frac']} (angle {row['offset']:.4f}): minD = {row['minD']}, penetrations = {row['penetrations']}")

    browser.close()
