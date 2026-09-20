/**
 * MITCalc Web App - 3D WebGL Bevel Gear Visualizer & Meshing Simulator (Module 2)
 * Renders real-time 3D conjugate meshing of Bevel Gears (Straight & Spiral)
 * at shaft angle Sigma (ISO 23509) using Three.js, PBR metallic materials, OrbitControls,
 * and analytical conjugate rotation with collision-free phase alignment.
 */

import { Bevel3DGenerator } from '../engine/bevel-3d-generator.js';

export class Bevel3DVisualizer {
    constructor(containerElement) {
        this.container = typeof containerElement === 'string'
            ? document.getElementById(containerElement)
            : containerElement;

        this.geom = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;

        this.pinionGroup = null;
        this.gearGroup = null;
        this.pinionMesh = null;
        this.gearMesh = null;
        this.gridHelper = null;

        this.isAnimating = true;
        this.animSpeed = 1.0;
        this.rotSpeedBase = 0.015; // rad per frame at 1.0x
        this.pinionAngle = 0;
        this.gearAngle = 0;
        this.initialGearAngle = 0;
        this.gearRatio = 2.5;
        this.sigmaRad = Math.PI / 2.0;

        this.wireframeMode = false;
        this.mesh1Data = null;
        this.mesh2Data = null;

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return;
        }

        if (!this.container) return;

        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b0f19);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1.0, 10000);
        this.camera.position.set(250, 250, 350);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.screenSpacePanning = true;
            this.controls.maxDistance = 5000;
            this.controls.minDistance = 10;
        }

        // 5. Lighting
        this.setupLighting();

        // 6. Groups for independent rotation & orientation
        this.pinionGroup = new THREE.Group();
        this.gearGroup = new THREE.Group();
        this.scene.add(this.pinionGroup);
        this.scene.add(this.gearGroup);

        // 7. Grid helper at apex
        this.gridHelper = new THREE.GridHelper(1000, 50, 0x1e293b, 0x0f172a);
        this.gridHelper.position.set(0, 0, -50);
        this.scene.add(this.gridHelper);

        // 8. Resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Animation loop
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        // Main key light
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
        dirLight1.position.set(300, 500, 400);
        dirLight1.castShadow = true;
        dirLight1.shadow.mapSize.width = 2048;
        dirLight1.shadow.mapSize.height = 2048;
        dirLight1.shadow.bias = -0.0001;
        this.scene.add(dirLight1);

        // Fill light (blue tone)
        const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.7);
        dirLight2.position.set(-400, -200, -300);
        this.scene.add(dirLight2);

        // Rim light (amber tone)
        const dirLight3 = new THREE.DirectionalLight(0xfef08a, 0.8);
        dirLight3.position.set(0, -400, 300);
        this.scene.add(dirLight3);
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setGeometry(geom) {
        if (!geom) return;
        this.geom = geom;

        const z1 = parseInt(geom.z1) || 18;
        const z2 = parseInt(geom.z2) || 45;
        this.gearRatio = z2 / z1;

        const Sigma_deg = parseFloat(geom.Sigma_deg !== undefined ? geom.Sigma_deg : geom.Sigma) || 90.0;
        this.sigmaRad = (Sigma_deg * Math.PI) / 180.0;

        const mmn = parseFloat(geom.mmn) || 10.0;
        const b = parseFloat(geom.b) || 117.0;
        const Re = parseFloat(geom.Re) || 338.0;
        const Rm = parseFloat(geom.Rm) || (Re - b / 2.0);
        const Ri = parseFloat(geom.Ri) || (Re - b);

        const delta1 = parseFloat(geom.delta1) || Math.atan(Math.sin(this.sigmaRad) / (this.gearRatio + Math.cos(this.sigmaRad)));
        const delta2 = this.sigmaRad - delta1;

        const alfa = (parseFloat(geom.alfa_deg !== undefined ? geom.alfa_deg : 20.0) * Math.PI) / 180.0;
        const beta = (parseFloat(geom.beta_deg !== undefined ? geom.beta_deg : 0.0) * Math.PI) / 180.0;

        const x1 = parseFloat(geom.x1 !== undefined ? geom.x1 : 0.0);
        const x2 = parseFloat(geom.x2 !== undefined ? geom.x2 : -x1);
        const xt1 = parseFloat(geom.xt1 !== undefined ? geom.xt1 : 0.0);
        const xt2 = parseFloat(geom.xt2 !== undefined ? geom.xt2 : -xt1);

        const ha1 = parseFloat(geom.ha1 !== undefined ? geom.ha1 : (mmn * (1.0 + x1)));
        const ha2 = parseFloat(geom.ha2 !== undefined ? geom.ha2 : (mmn * (1.0 + x2)));
        const hf1 = parseFloat(geom.hf1 !== undefined ? geom.hf1 : (mmn * (1.2 - x1)));
        const hf2 = parseFloat(geom.hf2 !== undefined ? geom.hf2 : (mmn * (1.2 - x2)));

        const delta_a1 = parseFloat(geom.delta_a1 !== undefined ? geom.delta_a1 : (delta1 + Math.atan(ha1 / Rm)));
        const delta_a2 = parseFloat(geom.delta_a2 !== undefined ? geom.delta_a2 : (delta2 + Math.atan(ha2 / Rm)));
        const delta_f1 = parseFloat(geom.delta_f1 !== undefined ? geom.delta_f1 : (delta1 - Math.atan(hf1 / Rm)));
        const delta_f2 = parseFloat(geom.delta_f2 !== undefined ? geom.delta_f2 : (delta2 - Math.atan(hf2 / Rm)));

        // 1. Generate Pinion 1 Mesh
        this.mesh1Data = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
            hand: 1
        });

        // 2. Generate Gear 2 Mesh (opposite spiral hand for conjugate engagement)
        this.mesh2Data = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
            hand: -1
        });

        this.updateMeshes();

        // 3. Analytical Conjugate Phase Offset (Zero-Collision Conjugate Mesh)
        // Pinion rotates around X, Gear rotates around Y.
        // Pitch contact line lies in XY plane (Z = 0) at angle delta1 from X axis.
        // Pinion tooth phase at contact line: (z1 / 4) mod 1
        // Gear tooth phase at contact line: 0 (crest).
        // Gear 2 is phase-shifted so tooth crest enters tooth space center with zero collision:
        const p1_teeth_at_contact = z1 / 4.0;
        const p1_phase = p1_teeth_at_contact - Math.floor(p1_teeth_at_contact);
        this.initialGearAngle = (p1_phase - 0.5) * (2.0 * Math.PI / z2);
        this.pinionAngle = 0;
        this.gearAngle = this.initialGearAngle;

        this.updateGearRotations();
        this.setViewPreset('iso');
    }

    updateMeshes() {
        if (!this.mesh1Data || !this.mesh2Data) return;

        // Clean previous meshes
        if (this.pinionMesh) {
            this.pinionGroup.remove(this.pinionMesh);
            this.pinionMesh.geometry.dispose();
            this.pinionMesh = null;
        }
        if (this.gearMesh) {
            this.gearGroup.remove(this.gearMesh);
            this.gearMesh.geometry.dispose();
            this.gearMesh = null;
        }

        // PBR Materials: Pinion (Cyan Steel), Gear (Gold/Bronze Steel)
        const matPinion = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant cyan-blue
            metalness: 0.85,
            roughness: 0.25,
            wireframe: this.wireframeMode
        });

        const matGear = new THREE.MeshStandardMaterial({
            color: 0xf59e0b, // Warm amber-gold
            metalness: 0.85,
            roughness: 0.28,
            wireframe: this.wireframeMode
        });

        // 1. Pinion BufferGeometry
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        this.pinionMesh = new THREE.Mesh(geo1, matPinion);
        this.pinionMesh.castShadow = true;
        this.pinionMesh.receiveShadow = true;
        this.pinionGroup.add(this.pinionMesh);

        // Align Pinion along X-axis: rotate mesh so its Z-axis lies along +X
        // Mesh local Z is rotation axis. To put local Z along +X, rotate Y by +90 deg
        this.pinionMesh.rotation.set(0, Math.PI / 2.0, 0);

        // 2. Gear BufferGeometry
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        this.gearMesh = new THREE.Mesh(geo2, matGear);
        this.gearMesh.castShadow = true;
        this.gearMesh.receiveShadow = true;
        this.gearGroup.add(this.gearMesh);

        // Align Gear along direction of Shaft Angle Sigma:
        // When Sigma = 90 deg, Gear axis is along +Y.
        // To put local Z along +Y, rotate X by -90 deg
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        this.gearMesh.rotation.set(-Math.PI / 2.0, 0, Math.PI / 2.0 - sigma);
    }

    updateGearRotations() {
        if (!this.pinionGroup || !this.gearGroup) return;
        // Pinion rotates around X axis
        this.pinionGroup.rotation.x = this.pinionAngle;
        // Gear rotates around Y axis (or axis at angle Sigma)
        this.gearGroup.rotation.y = this.gearAngle;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isAnimating && this.pinionGroup && this.gearGroup) {
            const step = this.rotSpeedBase * this.animSpeed;
            this.pinionAngle += step;
            // Kinematic conjugate synchronization:
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;
            this.updateGearRotations();
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.1, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.pinionMesh) this.pinionMesh.material.wireframe = this.wireframeMode;
        if (this.gearMesh) this.gearMesh.material.wireframe = this.wireframeMode;
        return this.wireframeMode;
    }

    resetView() {
        this.setViewPreset('iso');
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const Re = this.geom ? (parseFloat(this.geom.Re) || 300.0) : 300.0;
        const dist = Re * 1.6;

        // Center on mean pitch contact point
        const Rm = this.geom ? (parseFloat(this.geom.Rm) || (Re * 0.8)) : (Re * 0.8);
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4)) : (Math.PI / 4);
        const cx = Rm * Math.cos(delta1) * 0.5;
        const cy = Rm * Math.sin(delta1) * 0.5;
        const cz = 0;

        switch (preset) {
            case 'front': // Axial Section view (XY plane)
                this.camera.position.set(cx, cy, dist * 1.4);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'pinion': // Front face of Pinion (looking along X axis from +X)
                this.camera.position.set(dist * 1.5, cy, 0);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'gear': // Front face of Gear (looking along Y axis from +Y)
                this.camera.position.set(cx, dist * 1.5, 0);
                this.controls.target.set(cx, cy, 0);
                break;
            case 'top': // Top view (XZ plane)
                this.camera.position.set(cx, dist * 1.5, cz);
                this.controls.target.set(cx, 0, cz);
                break;
            case 'bottom': // Bottom view
                this.camera.position.set(cx, -dist * 1.5, cz);
                this.controls.target.set(cx, 0, cz);
                break;
            case 'right': // Right view
                this.camera.position.set(dist * 1.5, cy, cz);
                this.controls.target.set(0, cy, cz);
                break;
            case 'left': // Left view
                this.camera.position.set(-dist * 1.5, cy, cz);
                this.controls.target.set(0, cy, cz);
                break;
            case 'mesh': // Close up of pitch contact zone (looking along tooth face from Re to Ri)
                const mx = Rm * Math.cos(delta1);
                const my = Rm * Math.sin(delta1);
                const ex = Re * Math.cos(delta1);
                const ey = Re * Math.sin(delta1);
                this.camera.position.set(ex + 80, ey + 40, 60);
                this.controls.target.set(mx, my, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(dist * 0.9, dist * 0.9, dist * 1.1);
                this.controls.target.set(cx, cy, 0);
                break;
        }

        this.controls.update();
    }

    /**
     * Extracts raw triangles for CAD export (Pinion, Gear, or Assembly Pair)
     * @param {string} type - 'pinion', 'gear', or 'assembly'
     * @param {boolean} surfaceOnly - If true, generates surface-only mesh on demand
     * @returns {Array} Triangle array
     */
    getExportTriangles(type = 'pinion', surfaceOnly = false) {
        if (!this.geom) return [];

        const z1 = parseInt(this.geom.z1) || 18;
        const z2 = parseInt(this.geom.z2) || 45;
        const mmn = parseFloat(this.geom.mmn) || 10.0;
        const b = parseFloat(this.geom.b) || 117.0;
        const Re = parseFloat(this.geom.Re) || 338.0;
        const Rm = parseFloat(this.geom.Rm) || (Re - b / 2.0);
        const Ri = parseFloat(this.geom.Ri) || (Re - b);
        const delta1 = parseFloat(this.geom.delta1) || Math.atan(1.0 / this.gearRatio);
        const delta2 = this.sigmaRad - delta1;
        const alfa = (parseFloat(this.geom.alfa_deg || 20.0) * Math.PI) / 180.0;
        const beta = (parseFloat(this.geom.beta_deg || 0.0) * Math.PI) / 180.0;
        const x1 = parseFloat(this.geom.x1 || 0.0);
        const x2 = parseFloat(this.geom.x2 || -x1);
        const xt1 = parseFloat(this.geom.xt1 || 0.0);
        const xt2 = parseFloat(this.geom.xt2 || -xt1);
        const ha1 = parseFloat(this.geom.ha1 || (mmn * (1.0 + x1)));
        const ha2 = parseFloat(this.geom.ha2 || (mmn * (1.0 + x2)));
        const hf1 = parseFloat(this.geom.hf1 || (mmn * (1.2 - x1)));
        const hf2 = parseFloat(this.geom.hf2 || (mmn * (1.2 - x2)));
        const delta_a1 = parseFloat(this.geom.delta_a1 || (delta1 + Math.atan(ha1 / Rm)));
        const delta_a2 = parseFloat(this.geom.delta_a2 || (delta2 + Math.atan(ha2 / Rm)));
        const delta_f1 = parseFloat(this.geom.delta_f1 || (delta1 - Math.atan(hf1 / Rm)));
        const delta_f2 = parseFloat(this.geom.delta_f2 || (delta2 - Math.atan(hf2 / Rm)));

        // Helper to transform triangle: [[p1], [p2], [p3], [n]]
        function transformTriangles(tris, rotY_rad, rotX_rad, rotZ_rad = 0) {
            const cosY = Math.cos(rotY_rad), sinY = Math.sin(rotY_rad);
            const cosX = Math.cos(rotX_rad), sinX = Math.sin(rotX_rad);
            const cosZ = Math.cos(rotZ_rad), sinZ = Math.sin(rotZ_rad);

            function rotPt(p) {
                // Rotate around Y
                let x1 = p[0] * cosY + p[2] * sinY;
                let y1 = p[1];
                let z1 = -p[0] * sinY + p[2] * cosY;
                // Rotate around X
                let x2 = x1;
                let y2 = y1 * cosX - z1 * sinX;
                let z2 = y1 * sinX + z1 * cosX;
                // Rotate around Z
                let x3 = x2 * cosZ - y2 * sinZ;
                let y3 = x2 * sinZ + y2 * cosZ;
                let z3 = z2;
                return [x3, y3, z3];
            }

            return tris.map(([p1, p2, p3, n]) => {
                return [rotPt(p1), rotPt(p2), rotPt(p3), rotPt(n)];
            });
        }

        if (type === 'pinion') {
            const m1 = Bevel3DGenerator.generateGearMesh({
                z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
                Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
                hand: 1, surfaceOnly
            });
            return m1.rawTriangles;
        }

        if (type === 'gear') {
            const m2 = Bevel3DGenerator.generateGearMesh({
                z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
                Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
                hand: -1, surfaceOnly
            });
            return m2.rawTriangles;
        }

        // Assembly Pair
        const m1 = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1, ha: ha1, hf: hf1,
            hand: 1, surfaceOnly
        });
        const m2 = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2, ha: ha2, hf: hf2,
            hand: -1, surfaceOnly
        });

        // Pinion transformed to Axis 1 (along +X)
        const tPinion = transformTriangles(m1.rawTriangles, Math.PI / 2.0, 0, 0);

        // Gear transformed to Axis 2 (along direction of Sigma)
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        const tGear = transformTriangles(m2.rawTriangles, 0, -Math.PI / 2.0, Math.PI / 2.0 - sigma);

        return tPinion.concat(tGear);
    }
}
