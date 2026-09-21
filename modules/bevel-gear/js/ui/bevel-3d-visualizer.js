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

        // Tooth Contact Analysis (TCA) Dynamic Highlighting Engine
        this.tcaEnabled = false;
        this.tcaWidth = 2.2;
        this.tcaColorMode = 0; // 0: Laser Ruby / Neon Flame, 1: Prussian Blue, 2: Thermal Heatmap
        this.tcaUniforms = {
            uTcaEnabled: { value: 0.0 },
            uTcaWidth: { value: 2.2 },
            uTcaColorMode: { value: 0 },
            uCosD: { value: 0.928 },
            uSinD: { value: 0.371 },
            uRe: { value: 338.0 },
            uRi: { value: 221.0 },
            uRm: { value: 279.5 },
            uB: { value: 117.0 },
            uMmn: { value: 10.0 },
            uBetaRad: { value: 0.0 },
            uIsSpiral: { value: 0.0 },
            uRBore1: { value: 25.0 },
            uRBore2: { value: 50.0 }
        };

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
        this.gearPivot = new THREE.Group();
        this.gearGroup = new THREE.Group();
        this.gearPivot.add(this.gearGroup);
        this.scene.add(this.pinionGroup);
        this.scene.add(this.gearPivot);

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
        const beta_deg = (geom.beta_deg !== undefined ? parseFloat(geom.beta_deg) : (geom.beta !== undefined ? parseFloat(geom.beta) : 0.0));
        const beta = (beta_deg * Math.PI) / 180.0;
        const gearingType = geom.gearingType || 'gleason';

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

        // Extract authentic MITCalc tip and pitch tooth thicknesses and blank offsets
        const ha_e1 = parseFloat(geom.hae1) || (ha1 * (Re / Rm));
        const hf_e1 = parseFloat(geom.hfe1) || (hf1 * (Re / Rm));
        const sa_e1 = parseFloat(geom.sae1) || (mmn * 0.88);
        const sn_e1 = parseFloat(geom.sne1) || (mmn * 1.84);

        const ha_e2 = parseFloat(geom.hae2) || (ha2 * (Re / Rm));
        const hf_e2 = parseFloat(geom.hfe2) || (hf2 * (Re / Rm));
        const sa_e2 = parseFloat(geom.sae2) || (mmn * 1.35);
        const sn_e2 = parseFloat(geom.sne2) || (mmn * 1.30);

        const Hin1 = parseFloat(geom.H1in) || 4.836;
        const Hout1 = parseFloat(geom.H1out) || 13.300;
        const Hin2 = parseFloat(geom.H2in) || 5.911;
        const Hout2 = parseFloat(geom.H2out) || 19.950;

        const dBore1 = parseFloat(geom.dBore1) || 50.0;
        const dBore2 = parseFloat(geom.dBore2) || 100.0;

        // 1. Generate Pinion 1 Mesh (Authentic MITCalc Data1 & Section 3D)
        this.mesh1Data = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1,
            ha_e: ha_e1, hf_e: hf_e1, sa_e: sa_e1, sn_e: sn_e1,
            Hin: Hin1, Hout: Hout1, dBore: dBore1,
            hand: 1, gearingType
        });

        // 2. Generate Gear 2 Mesh (Authentic MITCalc Data1 & Section 3D, hand: -1)
        this.mesh2Data = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2,
            ha_e: ha_e2, hf_e: hf_e2, sa_e: sa_e2, sn_e: sn_e2,
            Hin: Hin2, Hout: Hout2, dBore: dBore2,
            hand: -1, gearingType
        });

        // Update TCA Uniforms for Bevel Gear
        this.tcaUniforms.uCosD.value = Math.cos(delta1);
        this.tcaUniforms.uSinD.value = Math.sin(delta1);
        this.tcaUniforms.uRe.value = Re;
        this.tcaUniforms.uRi.value = Ri;
        this.tcaUniforms.uRm.value = Rm;
        this.tcaUniforms.uB.value = b;
        this.tcaUniforms.uMmn.value = mmn;
        this.tcaUniforms.uBetaRad.value = beta;
        this.tcaUniforms.uIsSpiral.value = (Math.abs(beta_deg) > 1e-4 && gearingType !== 'straight_type1') ? 1.0 : 0.0;
        this.tcaUniforms.uRBore1.value = dBore1 / 2.0;
        this.tcaUniforms.uRBore2.value = dBore2 / 2.0;

        this.updateMeshes();

        // 3. Analytical Conjugate Phase Offset (Zero-Collision Conjugate Mesh)
        // Pinion rotates around X, Gear rotates around Y (or Sigma via gearPivot).
        // Pitch contact line lies in XY plane (Z = 0) at angle delta1 from X axis.
        // Pinion tooth 0 crest is at angle 0 along the contact line.
        // Gear 2 has tooth space (half pitch -pi/z2) at the contact line:
        this.initialGearAngle = -Math.PI / z2;
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

        // Apply TCA (Tooth Contact Analysis) Dynamic Shader
        this.applyTCAShader(matPinion, true);
        this.applyTCAShader(matGear, false);

        // 1. Pinion BufferGeometry
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        this.pinionMesh = new THREE.Mesh(geo1, matPinion);
        this.pinionMesh.castShadow = true;
        this.pinionMesh.receiveShadow = true;
        this.pinionGroup.add(this.pinionMesh);

        // Align Pinion along +X axis:
        // Local Z -> World +X (Pinion axis)
        // Local X -> World +Y (Tooth 0 points along +Y, exactly towards the contact line in XY plane)
        // Local Y -> World +Z
        this.pinionMesh.rotation.set(0, Math.PI / 2.0, Math.PI / 2.0);

        // 2. Gear BufferGeometry
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        this.gearMesh = new THREE.Mesh(geo2, matGear);
        this.gearMesh.castShadow = true;
        this.gearMesh.receiveShadow = true;
        this.gearGroup.add(this.gearMesh);

        // Align Gear along +Y axis (inside gearPivot):
        // Local Z -> World +Y (Gear axis)
        // Local X -> World +X (Tooth 0 points along +X, exactly towards the contact line in XY plane)
        // Local Y -> World -Z
        this.gearMesh.rotation.set(-Math.PI / 2.0, 0, 0);

        // Rotate gearPivot for general shaft angle Sigma:
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        this.gearPivot.rotation.z = sigma - Math.PI / 2.0;
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
        const dist = Re * 2.2;

        const Rm = this.geom ? (parseFloat(this.geom.Rm) || (Re * 0.8)) : (Re * 0.8);
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4)) : (Math.PI / 4);
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);

        const cenX = 0;
        const cenY = 20;
        const cenZ = 0;
        const viewDist = Re * 2.8;

        switch (preset) {
            case 'front': // Axial Section view (looking straight at XY plane from +Z)
                this.camera.position.set(cenX, cenY, viewDist * 1.05);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'pinion': // Looking along X axis from +X towards Pinion
                this.camera.position.set(viewDist * 1.1, cenY, 0);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(mx, my, 0);
                break;
            case 'gear': // Looking along Y axis from +Y towards Gear
                this.camera.position.set(cenX, viewDist * 1.1, 0);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(mx, my, 0);
                break;
            case 'top': // Top view (looking down Y axis)
                this.camera.position.set(cenX, viewDist * 1.15, 0);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'bottom': // Bottom view
                this.camera.position.set(cenX, -viewDist * 1.15, 0);
                this.camera.up.set(0, 0, 1);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'right': // Right view looking along +X axis
                this.camera.position.set(viewDist * 1.15, cenY, 0);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'left': // Left view
                this.camera.position.set(-viewDist * 1.15, cenY, 0);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'mesh': // Close up on pitch contact zone looking at engaging teeth
                this.camera.position.set(mx + 70, my + 45, 120);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(mx, my, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(viewDist * 0.65, viewDist * 0.45, viewDist * 0.70);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
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
        const alfa = (parseFloat(this.geom.alfa_deg !== undefined ? this.geom.alfa_deg : 20.0) * Math.PI) / 180.0;
        const beta_deg = (this.geom.beta_deg !== undefined ? parseFloat(this.geom.beta_deg) : (this.geom.beta !== undefined ? parseFloat(this.geom.beta) : 0.0));
        const beta = (beta_deg * Math.PI) / 180.0;
        const gearingType = this.geom.gearingType || 'gleason';
        const x1 = parseFloat(this.geom.x1 !== undefined ? this.geom.x1 : 0.0);
        const x2 = parseFloat(this.geom.x2 !== undefined ? this.geom.x2 : -x1);
        const xt1 = parseFloat(this.geom.xt1 !== undefined ? this.geom.xt1 : 0.0);
        const xt2 = parseFloat(this.geom.xt2 !== undefined ? this.geom.xt2 : -xt1);
        const ha1 = parseFloat(this.geom.ha1 !== undefined ? this.geom.ha1 : (mmn * (1.0 + x1)));
        const ha2 = parseFloat(this.geom.ha2 !== undefined ? this.geom.ha2 : (mmn * (1.0 + x2)));
        const hf1 = parseFloat(this.geom.hf1 !== undefined ? this.geom.hf1 : (mmn * (1.2 - x1)));
        const hf2 = parseFloat(this.geom.hf2 !== undefined ? this.geom.hf2 : (mmn * (1.2 - x2)));
        const delta_a1 = parseFloat(this.geom.delta_a1 !== undefined ? this.geom.delta_a1 : (delta1 + Math.atan(ha1 / Rm)));
        const delta_a2 = parseFloat(this.geom.delta_a2 !== undefined ? this.geom.delta_a2 : (delta2 + Math.atan(ha2 / Rm)));
        const delta_f1 = parseFloat(this.geom.delta_f1 !== undefined ? this.geom.delta_f1 : (delta1 - Math.atan(hf1 / Rm)));
        const delta_f2 = parseFloat(this.geom.delta_f2 !== undefined ? this.geom.delta_f2 : (delta2 - Math.atan(hf2 / Rm)));

        const ha_e1 = parseFloat(this.geom.hae1) || (ha1 * (Re / Rm));
        const hf_e1 = parseFloat(this.geom.hfe1) || (hf1 * (Re / Rm));
        const sa_e1 = parseFloat(this.geom.sae1) || (mmn * 0.88);
        const sn_e1 = parseFloat(this.geom.sne1) || (mmn * 1.84);

        const ha_e2 = parseFloat(this.geom.hae2) || (ha2 * (Re / Rm));
        const hf_e2 = parseFloat(this.geom.hfe2) || (hf2 * (Re / Rm));
        const sa_e2 = parseFloat(this.geom.sae2) || (mmn * 1.35);
        const sn_e2 = parseFloat(this.geom.sne2) || (mmn * 1.30);

        const Hin1 = parseFloat(this.geom.H1in) || 4.836;
        const Hout1 = parseFloat(this.geom.H1out) || 13.300;
        const Hin2 = parseFloat(this.geom.H2in) || 5.911;
        const Hout2 = parseFloat(this.geom.H2out) || 19.950;

        const dBore1 = parseFloat(this.geom.dBore1) || 50.0;
        const dBore2 = parseFloat(this.geom.dBore2) || 100.0;

        if (type === 'pinion') {
            const m1 = Bevel3DGenerator.generateGearMesh({
                z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
                Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1,
                ha_e: ha_e1, hf_e: hf_e1, sa_e: sa_e1, sn_e: sn_e1,
                Hin: Hin1, Hout: Hout1, dBore: dBore1,
                hand: 1, gearingType, surfaceOnly
            });
            return m1.rawTriangles;
        }

        if (type === 'gear') {
            const m2 = Bevel3DGenerator.generateGearMesh({
                z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
                Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2,
                ha_e: ha_e2, hf_e: hf_e2, sa_e: sa_e2, sn_e: sn_e2,
                Hin: Hin2, Hout: Hout2, dBore: dBore2,
                hand: -1, gearingType, surfaceOnly
            });
            return m2.rawTriangles;
        }

        // Assembly Pair: transform both to common apex V(0,0,0) and conjugate engagement line
        const m1 = Bevel3DGenerator.generateGearMesh({
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1,
            ha_e: ha_e1, hf_e: hf_e1, sa_e: sa_e1, sn_e: sn_e1,
            Hin: Hin1, Hout: Hout1, dBore: dBore1,
            hand: 1, gearingType, surfaceOnly
        });
        const m2 = Bevel3DGenerator.generateGearMesh({
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2,
            ha_e: ha_e2, hf_e: hf_e2, sa_e: sa_e2, sn_e: sn_e2,
            Hin: Hin2, Hout: Hout2, dBore: dBore2,
            hand: -1, gearingType, surfaceOnly
        });

        // Pinion: Local (x, y, z) -> World (z, x, y)
        const tPinion = m1.rawTriangles.map(([p1, p2, p3, n]) => [
            [p1[2], p1[0], p1[1]],
            [p2[2], p2[0], p2[1]],
            [p3[2], p3[0], p3[1]],
            [n[2], n[0], n[1]]
        ]);

        // Gear: Local (x, y, z) -> (x, z, -y), then rotate Y by initialGearAngle, then rotate Z by (sigma - 90 deg)
        const phi = this.initialGearAngle;
        const cosP = Math.cos(phi), sinP = Math.sin(phi);
        const rotZ = (this.sigmaRad || (Math.PI / 2.0)) - Math.PI / 2.0;
        const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

        function xformGear(p) {
            // 1. Base orientation: local X -> X, local Z -> Y, local Y -> -Z
            const bx = p[0], by = p[2], bz = -p[1];
            // 2. Rotate around Y by phi (initial conjugate phase)
            const rx = bx * cosP + bz * sinP;
            const ry = by;
            const rz = -bx * sinP + bz * cosP;
            // 3. Rotate around Z by rotZ (shaft angle sigma)
            const fx = rx * cosZ - ry * sinZ;
            const fy = rx * sinZ + ry * cosZ;
            const fz = rz;
            return [fx, fy, fz];
        }

        const tGear = m2.rawTriangles.map(([p1, p2, p3, n]) => [
            xformGear(p1),
            xformGear(p2),
            xformGear(p3),
            xformGear(n)
        ]);

        return tPinion.concat(tGear);
    }

    /**
     * Tooth Contact Analysis (TCA) - Custom GPU Shader Hook
     * Colors only the active contact zone/strip where the teeth meet in real time.
     */
    applyTCAShader(material, isPinion) {
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.tcaUniforms);
            shader.uniforms.uIsPinion = { value: isPinion ? 1.0 : 0.0 };

            shader.vertexShader = `
                varying vec3 vTcaWorldPos;
                varying vec3 vTcaWorldNorm;
            ` + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `#include <worldpos_vertex>
                vTcaWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                vTcaWorldNorm = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                `
            );

            shader.fragmentShader = `
                uniform float uTcaEnabled;
                uniform float uTcaWidth;
                uniform int uTcaColorMode;
                uniform float uCosD;
                uniform float uSinD;
                uniform float uRe;
                uniform float uRi;
                uniform float uRm;
                uniform float uB;
                uniform float uMmn;
                uniform float uBetaRad;
                uniform float uIsSpiral;
                uniform float uIsPinion;
                uniform float uRBore1;
                uniform float uRBore2;
                varying vec3 vTcaWorldPos;
                varying vec3 vTcaWorldNorm;
            ` + shader.fragmentShader;

            const tcaFragmentLogic = `
                #include <dithering_fragment>
                if (uTcaEnabled > 0.5) {
                    float s = vTcaWorldPos.x * uCosD + vTcaWorldPos.y * uSinD;
                    float h = -vTcaWorldPos.x * uSinD + vTcaWorldPos.y * uCosD;
                    float z = vTcaWorldPos.z;
                    
                    float rAxis = (uIsPinion > 0.5) ? length(vTcaWorldPos.yz) : length(vTcaWorldPos.xz);
                    float minBore = (uIsPinion > 0.5) ? (uRBore1 + 2.0) : (uRBore2 + 2.0);

                    if (s >= (uRi - 2.0) && s <= (uRe + 2.0) && abs(h) <= (uMmn * 1.6) && rAxis > minBore) {
                        float uNorm = clamp((s - uRm) / (uB * 0.5), -1.0, 1.0);
                        float zOffset = (uIsSpiral > 0.5) ? (uNorm * uB * tan(uBetaRad) * 0.35) : 0.0;
                        
                        float dContact = length(vec2(h * 0.85, z - zOffset));
                        
                        if (dContact < uTcaWidth) {
                            float t = clamp(1.0 - (dContact / uTcaWidth), 0.0, 1.0);
                            t = smoothstep(0.0, 1.0, t);
                            
                            vec3 contactCol = vec3(1.0, 0.08, 0.25); // Mode 0: Laser Ruby / Neon Flame
                            vec3 glowCol = vec3(1.0, 0.95, 0.5);
                            
                            if (uTcaColorMode == 1) {
                                // Mode 1: Prussian Blue (Bột màu rà vết cơ khí)
                                contactCol = mix(vec3(0.04, 0.32, 0.95), vec3(0.35, 0.8, 1.0), t);
                                glowCol = vec3(0.65, 0.92, 1.0);
                            } else if (uTcaColorMode == 2) {
                                // Mode 2: Thermal Heatmap (Bản đồ nhiệt áp lực)
                                vec3 colA = vec3(0.08, 0.85, 0.22);
                                vec3 colB = vec3(1.0, 0.85, 0.1);
                                vec3 colC = vec3(1.0, 0.08, 0.15);
                                contactCol = t < 0.5 ? mix(colA, colB, t * 2.0) : mix(colB, colC, (t - 0.5) * 2.0);
                                glowCol = vec3(1.0, 1.0, 0.4);
                            }
                            
                            gl_FragColor.rgb = mix(gl_FragColor.rgb, contactCol, t * 0.95);
                            gl_FragColor.rgb += glowCol * pow(t, 2.5) * 0.85;
                        }
                    }
                }
            `;

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                tcaFragmentLogic
            );
        };
        material.needsUpdate = true;
    }

    toggleContactTCA() {
        this.tcaEnabled = !this.tcaEnabled;
        this.tcaUniforms.uTcaEnabled.value = this.tcaEnabled ? 1.0 : 0.0;
        return this.tcaEnabled;
    }

    setTCAWidth(width) {
        this.tcaWidth = Math.max(0.5, Math.min(5.0, parseFloat(width) || 2.2));
        this.tcaUniforms.uTcaWidth.value = this.tcaWidth;
    }

    setTCAColorMode(mode) {
        this.tcaColorMode = parseInt(mode) || 0;
        this.tcaUniforms.uTcaColorMode.value = this.tcaColorMode;
    }
}
