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

    # Inject CAD 360 Orbit rotation into visualizer
    res = page.evaluate('''() => {
        const v = window.appUI.visualizer3D;
        const cam = v.camera;
        const target = v.controls.target;

        // Implement CAD 360 quaternion orbit function:
        function cadOrbit(deltaX, deltaY) {
            const offset = cam.position.clone().sub(target);
            const up = cam.up.clone().normalize();
            const forward = offset.clone().normalize();
            const right = new THREE.Vector3().crossVectors(up, forward).normalize();

            const qYaw = new THREE.Quaternion().setFromAxisAngle(up, -deltaX);
            const qPitch = new THREE.Quaternion().setFromAxisAngle(right, -deltaY);

            const q = new THREE.Quaternion().multiplyQuaternions(qPitch, qYaw);
            offset.applyQuaternion(q);
            up.applyQuaternion(q);

            cam.position.copy(target).add(offset);
            cam.up.copy(up).normalize();
            cam.lookAt(target);
        }

        // Test rotating full 360 degrees vertically (pitch by 2*PI in 8 steps)
        const trajectory = [];
        for (let step = 0; step <= 8; step++) {
            trajectory.push({
                step,
                pos: { x: cam.position.x.toFixed(1), y: cam.position.y.toFixed(1), z: cam.position.z.toFixed(1) },
                up: { x: cam.up.x.toFixed(2), y: cam.up.y.toFixed(2), z: cam.up.z.toFixed(2) }
            });
            cadOrbit(0, (2 * Math.PI) / 8);
        }
        return trajectory;
    }''')

    print("CAD 360 Orbit vertical rotation trajectory (8 steps = 360°):")
    for pt in res:
        print(f"Step {pt['step']}: pos={pt['pos']} | up={pt['up']}")

    b.close()
