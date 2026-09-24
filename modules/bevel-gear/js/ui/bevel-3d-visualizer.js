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
        this.animDirection = 1; // 1: Thuận (forward), -1: Nghịch (reverse)
        this.rotSpeedBase = 0.015; // rad per frame at 1.0x
        this.pinionAngle = 0;
        this.gearAngle = 0;
        this.initialGearAngle = 0;
        this.gearRatio = 2.5;
        this.sigmaRad = Math.PI / 2.0;
        this.viewInitialized = false;

        this.wireframeMode = false;
        this.mesh1Data = null;
        this.mesh2Data = null;

        // 3 Independent Verification & Inspection Modes (Phương Án 1, 2, 3)
        this.flankOnlyMode = false;      // Mode 1: Hide blanks, show tooth flank surfaces only
        this.clearanceGaugeMode = false; // Mode 2: Real-time digital clearance HUD gauge
        this.sectionCutMode = false;     // Mode 3: Dynamic section clipping plane at Z = 0
        this.pinionSurfMesh = null;
        this.gearSurfMesh = null;
        this.surf1Data = null;
        this.surf2Data = null;
        this.contactMarker = null;
        this.clipPlane = null;
        this.meshDensityLevel = 6; // 8 Cấp Độ Mịn Lưới Thân Khai (Mặc định Cấp 6: Siêu Mịn CAM/CNC)

        // Tooth Contact Analysis (TCA) Dynamic Highlighting Engine
        this.tcaEnabled = false;
        this.tcaWidth = 4.0;
        this.tcaColorMode = 1; // 0: Laser Ruby / Neon Flame, 1: Prussian Blue (Chuẩn xưởng), 2: Thermal Heatmap
        this.tcaPatternType = 1; // 0: Dynamic Real-time Rolling Locus, 1: Cumulative Gleason Rolled Pattern (Default)
        this.tcaUniforms = {
            uTcaEnabled: { value: 0.0 },
            uTcaWidth: { value: 4.0 },
            uTcaColorMode: { value: 1.0 },
            uTcaPatternType: { value: 1.0 },
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
            uRBore2: { value: 50.0 },
            uPinionAngle: { value: 0.0 },
            uAnimDirection: { value: 1.0 },
            uZ1: { value: 18.0 },
            uZ2: { value: 45.0 }
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
        this.renderer.localClippingEnabled = true; // Enables GPU Section Cut Plane (Phương Án 3)
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        // Dynamic Section Clipping Plane (Z = 0 pitch contact plane, normal pointing along -Z)
        this.clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls with CAD 360 unconstrained rotation
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.cadOrbit360 = true; // Enables full 360° unconstrained tumble around big gear base
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

        // Authentic tooth hand: Pinion Left-Hand (-1) by standard default, Gear Right-Hand (+1)
        const hand1 = geom.hand1 !== undefined ? (geom.hand1 === 1 || geom.hand1 === 'left' ? -1 : 1) : -1;
        const hand2 = -hand1;

        // 1. Generate Pinion 1 Mesh (Solid & Surface)
        const opt1 = {
            z: z1, mmn, delta: delta1, delta_a: delta_a1, delta_f: delta_f1,
            Re, Ri, Rm, b, alfa, beta, x: x1, xt: xt1,
            ha_e: ha_e1, hf_e: hf_e1, sa_e: sa_e1, sn_e: sn_e1,
            Hin: Hin1, Hout: Hout1, dBore: dBore1,
            hand: hand1, gearingType,
            meshDensityLevel: this.meshDensityLevel
        };
        this.mesh1Data = Bevel3DGenerator.generateGearMesh(opt1);
        this.surf1Data = Bevel3DGenerator.generateGearSurfaceMesh(opt1);

        // 2. Generate Gear 2 Mesh (Solid & Surface)
        const opt2 = {
            z: z2, mmn, delta: delta2, delta_a: delta_a2, delta_f: delta_f2,
            Re, Ri, Rm, b, alfa, beta, x: x2, xt: xt2,
            ha_e: ha_e2, hf_e: hf_e2, sa_e: sa_e2, sn_e: sn_e2,
            Hin: Hin2, Hout: Hout2, dBore: dBore2,
            hand: hand2, gearingType,
            meshDensityLevel: this.meshDensityLevel
        };
        this.mesh2Data = Bevel3DGenerator.generateGearMesh(opt2);
        this.surf2Data = Bevel3DGenerator.generateGearSurfaceMesh(opt2);

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
        this.tcaUniforms.uZ1.value = z1;
        this.tcaUniforms.uZ2.value = z2;
        this.tcaUniforms.uAnimDirection.value = parseFloat(this.animDirection) || 1.0;

        this.updateMeshes();

        // 3. Authentic MITCalc Conjugate Phase Offset (Exact Mid-Zone Kiss Contact at Rm)
        // Pinion rotates around World X, Gear rotates around World Y.
        // Pitch contact line lies in XY plane (Z = 0) at angle delta1 from X axis.
        const st1 = parseFloat(geom.st1) || (mmn * (Math.PI / 2.0 + 2.0 * x1 * Math.tan(alfa) + xt1));
        const st2 = parseFloat(geom.st2) || (mmn * (Math.PI / 2.0 + 2.0 * x2 * Math.tan(alfa) + xt2));
        const cosBeta = Math.abs(beta_deg) > 1e-4 ? Math.cos(beta) : 1.0;
        const th1 = ((st1 / cosBeta) / (2.0 * (Rm * Math.tan(delta1)))) / Math.cos(delta1);
        const th2 = ((st2 / cosBeta) / (2.0 * (Rm * Math.tan(delta2)))) / Math.cos(delta2);
        // Exact conjugate zero-backlash symmetric mesh:
        // Pinion tooth 0 center lies at Z = 0.
        // Gear tooth space 0 center is at half-pitch angle (Math.PI / z2).
        // Aligning Gear space 0 with Pinion tooth 0 brings both Flank 1 and Flank 2 into simultaneous conjugate kiss contact!
        this.initialGearAngle = Math.PI / z2;
        this.pinionAngle = 0;
        this.gearAngle = this.initialGearAngle;

        this.updateGearRotations();
        if (!this.viewInitialized) {
            this.setViewPreset('iso');
            this.viewInitialized = true;
        }
    }

    updateMeshes() {
        if (!this.mesh1Data || !this.mesh2Data) return;

        // Clean previous solid meshes
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

        // Clean previous surface meshes
        if (this.pinionSurfMesh) {
            this.pinionGroup.remove(this.pinionSurfMesh);
            this.pinionSurfMesh.geometry.dispose();
            this.pinionSurfMesh = null;
        }
        if (this.gearSurfMesh) {
            this.gearGroup.remove(this.gearSurfMesh);
            this.gearSurfMesh.geometry.dispose();
            this.gearSurfMesh = null;
        }

        const clippingPlanes = (this.sectionCutMode && this.clipPlane) ? [this.clipPlane] : [];

        // PBR Materials: Pinion Solid (Cyan Steel), Gear Solid (Gold/Bronze Steel)
        const matPinion = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vibrant cyan-blue
            metalness: 0.85,
            roughness: 0.25,
            wireframe: this.wireframeMode,
            clippingPlanes: clippingPlanes,
            clipShadows: true
        });

        const matGear = new THREE.MeshStandardMaterial({
            color: 0xf59e0b, // Warm amber-gold
            metalness: 0.85,
            roughness: 0.28,
            wireframe: this.wireframeMode,
            clippingPlanes: clippingPlanes,
            clipShadows: true
        });

        // Surface-Only Materials (Double-Sided, Phương Án 1)
        const matPinionSurf = new THREE.MeshStandardMaterial({
            color: 0x38bdf8, // Sky blue for pinion flank
            metalness: 0.70,
            roughness: 0.30,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode,
            clippingPlanes: clippingPlanes
        });

        const matGearSurf = new THREE.MeshStandardMaterial({
            color: 0xfbbf24, // Amber gold for gear flank
            metalness: 0.70,
            roughness: 0.30,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode,
            clippingPlanes: clippingPlanes
        });

        // Apply TCA (Tooth Contact Analysis) Dynamic Shader to all materials
        this.applyTCAShader(matPinion, true);
        this.applyTCAShader(matGear, false);
        this.applyTCAShader(matPinionSurf, true);
        this.applyTCAShader(matGearSurf, false);

        // 1. Pinion Solid Mesh
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        if (this.mesh1Data.tcaParams) {
            geo1.setAttribute('aTcaParam', new THREE.BufferAttribute(this.mesh1Data.tcaParams, 3));
        }
        // Analytical proper orthogonal transformation matrix for Pinion 1:
        // Maps local (x, y, z) -> world (z, x, y): local +Z (pinion axis) -> World +X
        // Pitch generator in local XY plane -> World XY pitch contact line (Z = 0)
        const mPinion = new THREE.Matrix4().set(
            0, 0, 1, 0,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 1
        );
        geo1.applyMatrix4(mPinion);

        this.pinionMesh = new THREE.Mesh(geo1, matPinion);
        this.pinionMesh.castShadow = true;
        this.pinionMesh.receiveShadow = true;
        this.pinionMesh.visible = !this.flankOnlyMode;
        this.pinionGroup.add(this.pinionMesh);

        // 2. Pinion Surface Mesh (Phương Án 1)
        if (this.surf1Data) {
            const geoSurf1 = new THREE.BufferGeometry();
            geoSurf1.setAttribute('position', new THREE.BufferAttribute(this.surf1Data.vertices, 3));
            geoSurf1.setAttribute('normal', new THREE.BufferAttribute(this.surf1Data.normals, 3));
            geoSurf1.setIndex(new THREE.BufferAttribute(this.surf1Data.indices, 1));
            if (this.surf1Data.tcaParams) {
                geoSurf1.setAttribute('aTcaParam', new THREE.BufferAttribute(this.surf1Data.tcaParams, 3));
            }
            geoSurf1.applyMatrix4(mPinion);
            this.pinionSurfMesh = new THREE.Mesh(geoSurf1, matPinionSurf);
            this.pinionSurfMesh.visible = this.flankOnlyMode;
            this.pinionGroup.add(this.pinionSurfMesh);
        }

        // Analytical proper orthogonal transformation matrix for Gear 2:
        // Maps local (x, y, z) -> world (x, z, -y): local +Z (gear axis) -> World +Y
        // Pitch generator in local XY plane -> World XY pitch contact line (Z = 0)
        const mGear = new THREE.Matrix4().set(
            1,  0, 0, 0,
            0,  0, 1, 0,
            0, -1, 0, 0,
            0,  0, 0, 1
        );

        // 3. Gear Solid Mesh
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        if (this.mesh2Data.tcaParams) {
            geo2.setAttribute('aTcaParam', new THREE.BufferAttribute(this.mesh2Data.tcaParams, 3));
        }
        geo2.applyMatrix4(mGear);

        this.gearMesh = new THREE.Mesh(geo2, matGear);
        this.gearMesh.castShadow = true;
        this.gearMesh.receiveShadow = true;
        this.gearMesh.visible = !this.flankOnlyMode;
        this.gearGroup.add(this.gearMesh);

        // 4. Gear Surface Mesh (Phương Án 1)
        if (this.surf2Data) {
            const geoSurf2 = new THREE.BufferGeometry();
            geoSurf2.setAttribute('position', new THREE.BufferAttribute(this.surf2Data.vertices, 3));
            geoSurf2.setAttribute('normal', new THREE.BufferAttribute(this.surf2Data.normals, 3));
            geoSurf2.setIndex(new THREE.BufferAttribute(this.surf2Data.indices, 1));
            if (this.surf2Data.tcaParams) {
                geoSurf2.setAttribute('aTcaParam', new THREE.BufferAttribute(this.surf2Data.tcaParams, 3));
            }
            geoSurf2.applyMatrix4(mGear);
            this.gearSurfMesh = new THREE.Mesh(geoSurf2, matGearSurf);
            this.gearSurfMesh.visible = this.flankOnlyMode;
            this.gearGroup.add(this.gearSurfMesh);
        }

        // Rotate gearPivot for general shaft angle Sigma:
        const sigma = this.sigmaRad || (Math.PI / 2.0);
        this.gearPivot.rotation.z = sigma - Math.PI / 2.0;

        // 5. Contact Marker for Real-Time HUD Gauge (Phương Án 2)
        if (!this.contactMarker) {
            const markerGeo = new THREE.SphereGeometry(3.5, 16, 16);
            const markerMat = new THREE.MeshStandardMaterial({
                color: 0x34d399,
                emissive: 0x10b981,
                emissiveIntensity: 0.9,
                roughness: 0.1,
                metalness: 0.2
            });
            this.contactMarker = new THREE.Mesh(markerGeo, markerMat);
            this.scene.add(this.contactMarker);
        }
        const Rm = this.geom ? (parseFloat(this.geom.Rm) || 279.5) : 279.5;
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4.0)) : (Math.PI / 4.0);
        this.contactMarker.position.set(Rm * Math.cos(delta1), Rm * Math.sin(delta1), 0);
        this.contactMarker.visible = this.clearanceGaugeMode;
    }

    updateGearRotations() {
        if (!this.pinionGroup || !this.gearGroup) return;
        // Pinion rotates around X axis
        this.pinionGroup.rotation.x = this.pinionAngle;
        // Gear rotates around Y axis (or axis at angle Sigma)
        this.gearGroup.rotation.y = this.gearAngle;
        if (this.tcaUniforms) {
            if (this.tcaUniforms.uPinionAngle) {
                this.tcaUniforms.uPinionAngle.value = this.pinionAngle;
            }
            if (this.tcaUniforms.uAnimDirection) {
                this.tcaUniforms.uAnimDirection.value = parseFloat(this.animDirection) || 1.0;
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isAnimating && this.pinionGroup && this.gearGroup) {
            const step = this.rotSpeedBase * this.animSpeed * (this.animDirection || 1);
            this.pinionAngle += step;
            // Kinematic conjugate synchronization:
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;
            this.updateGearRotations();
            if (this.clearanceGaugeMode) {
                this.updateClearanceHUD();
            }
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.01, Math.min(3.0, parseFloat(speed) || 1.0));
    }

    setAnimDirection(dir) {
        this.animDirection = (dir === -1 || dir < 0) ? -1 : 1;
        if (this.tcaUniforms && this.tcaUniforms.uAnimDirection) {
            this.tcaUniforms.uAnimDirection.value = this.animDirection;
        }
        this.updateGearRotations();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return this.animDirection;
    }

    toggleAnimDirection() {
        this.animDirection = (this.animDirection === 1) ? -1 : 1;
        if (this.tcaUniforms && this.tcaUniforms.uAnimDirection) {
            this.tcaUniforms.uAnimDirection.value = this.animDirection;
        }
        this.updateGearRotations();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return this.animDirection;
    }

    stepAnimation(direction = 1) {
        this.isAnimating = false;
        const z1 = this.geom ? (parseInt(this.geom.z1) || 18) : 18;
        // Step by 1/20 of a tooth pitch (approx 1 degree for z1=18)
        const stepRad = (Math.PI / (10.0 * z1)) * direction;
        this.pinionAngle += stepRad;
        this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;
        this.updateGearRotations();
        if (this.clearanceGaugeMode) {
            this.updateClearanceHUD();
        }
        return this.pinionAngle;
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.pinionMesh) this.pinionMesh.material.wireframe = this.wireframeMode;
        if (this.gearMesh) this.gearMesh.material.wireframe = this.wireframeMode;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.wireframe = this.wireframeMode;
        if (this.gearSurfMesh) this.gearSurfMesh.material.wireframe = this.wireframeMode;
        return this.wireframeMode;
    }

    setMeshDensityLevel(level) {
        this.meshDensityLevel = Math.max(1, Math.min(8, parseInt(level) || 6));
        if (this.geom) {
            const curPinionAngle = this.pinionAngle;
            const curGearAngle = this.gearAngle;
            this.setGeometry(this.geom);
            this.pinionAngle = curPinionAngle;
            this.gearAngle = curGearAngle;
            this.updateGearRotations();
        }
        return this.meshDensityLevel;
    }

    resetView() {
        this.setViewPreset('iso');
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const Re = this.geom ? (parseFloat(this.geom.Re) || 300.0) : 300.0;
        const Rm = this.geom ? (parseFloat(this.geom.Rm) || (Re * 0.8)) : (Re * 0.8);
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4)) : (Math.PI / 4);
        const mx = Rm * Math.cos(delta1);
        const my = Rm * Math.sin(delta1);

        const cenX = mx * 0.6;
        const cenY = my * 0.8;
        const cenZ = 0;
        const viewDist = Re * 2.2;

        switch (preset) {
            case 'front': // Axial Section view (looking straight at XY plane from +Z)
                this.camera.position.set(cenX, cenY, cenZ + viewDist * 1.05);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'pinion': // Looking along X axis from +X towards Pinion
                this.camera.position.set(cenX + viewDist * 1.1, cenY, cenZ);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'gear': // Looking along Y axis from +Y towards Gear
                this.camera.position.set(cenX, cenY + viewDist * 1.1, cenZ);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'top': // Top view (looking down Y axis)
                this.camera.position.set(cenX, cenY + viewDist * 1.15, cenZ);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'bottom': // Bottom view
                this.camera.position.set(cenX, cenY - viewDist * 1.15, cenZ);
                this.camera.up.set(0, 0, 1);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'right': // Right view looking along +X axis
                this.camera.position.set(cenX + viewDist * 1.15, cenY, cenZ);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'left': // Left view
                this.camera.position.set(cenX - viewDist * 1.15, cenY, cenZ);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'mesh': // Close up on pitch contact zone looking directly at engaging tooth flank
                this.camera.position.set(mx + 70.0, my + 45.0, 110.0);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(mx, my, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(cenX + viewDist * 0.65, cenY + viewDist * 0.45, cenZ + viewDist * 0.70);
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
     * Supports both Mode 0 (Dynamic Rolling Locus) and Mode 1 (Cumulative Gleason Ellipse).
     */
    applyTCAShader(material, isPinion) {
        material.customProgramCacheKey = () => `tca_${isPinion ? 'pinion' : 'gear'}_${material.side === THREE.DoubleSide ? 'double' : 'front'}_en${this.tcaEnabled ? 1 : 0}_mode${this.tcaColorMode}_pat${this.tcaPatternType}_sp${this.tcaUniforms && this.tcaUniforms.uIsSpiral ? this.tcaUniforms.uIsSpiral.value : 0}`;
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.tcaUniforms);
            shader.uniforms.uIsPinion = { value: isPinion ? 1.0 : 0.0 };

            shader.vertexShader = `
                attribute vec3 aTcaParam;
                varying vec3 vTcaParam;
                varying vec3 vTcaWorldPos;
                varying vec3 vTcaWorldNorm;
            ` + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `#include <worldpos_vertex>
                vTcaWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                vTcaWorldNorm = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                vTcaParam = aTcaParam;
                `
            );

            shader.fragmentShader = `
                uniform float uTcaEnabled;
                uniform float uTcaWidth;
                uniform float uTcaColorMode;
                uniform float uTcaPatternType;
                uniform float uCosD;
                uniform float uSinD;
                uniform float uRm;
                uniform float uB;
                uniform float uMmn;
                uniform float uBetaRad;
                uniform float uIsSpiral;
                uniform float uPinionAngle;
                uniform float uAnimDirection;
                uniform float uIsPinion;
                uniform float uZ1;
                varying vec3 vTcaParam;
                varying vec3 vTcaWorldPos;
                varying vec3 vTcaWorldNorm;
            ` + shader.fragmentShader;

            const tcaFragmentLogic = `
                #include <dithering_fragment>
                if (uTcaEnabled > 0.5 && vTcaParam.z > 0.5) {
                    // vTcaParam.z: 1.0 = Flank 1, 2.0 = Flank 2, 0.0 = non-flank (crest/root/hub)
                    // In theoretical zero-backlash mesh (jn = 0), BOTH Flank 1 and Flank 2 engage mating teeth!
                    // Both flanks of every tooth exhibit conjugate contact.
                    float u = vTcaParam.x;        // Face width: -0.5 (toe) to +0.5 (heel), 0.0 is Rm (middle of tooth)
                    float v = vTcaParam.y - 0.5;  // Working depth: -0.5 (root) to +0.5 (tip), 0.0 is EXACT PITCH LINE!
                    float flankT = vTcaParam.y;   // 0.0 at root/fillet to 1.0 at tooth tip
                    float widthScale = clamp(uTcaWidth / 4.0, 0.25, 3.0);
                    float intensity = 0.0;

                    if (uIsSpiral < 0.5) {
                        // =========================================================================
                        // BÁNH RĂNG CÔN RĂNG THẲNG (STRAIGHT BEVEL GEARS - ISO 23509 / DIN 3971)
                        // Chuẩn "Mặt tiếp xúc mặt như bình thường" (Full Flank Working Contact Band)
                        // Hiển thị đồng thời trên CẢ HAI BỀ MẶT BÊN (Flank 1 & Flank 2) khi khe hở = 0
                        // =========================================================================
                        float uMargin = clamp(0.50 - 0.035 * widthScale, 0.35, 0.495);
                        float uMask = smoothstep(0.50, uMargin, abs(u));

                        // Active working depth (hw = 2.0*mmn): excludes root clearance c0 (flankT < 0.08) & tip chamfer (flankT > 0.94)
                        float vMask = smoothstep(0.03, 0.10, flankT) * (1.0 - smoothstep(0.90, 0.97, flankT));
                        float fullStraightContact = uMask * vMask;

                        if (uTcaPatternType > 0.5) {
                            // CHẾ ĐỘ 1: VẾT RÀ BỘT MÀU TÍCH LŨY (CUMULATIVE PRUSSIAN BLUE / ROLLED PATTERN)
                            // Trải rộng khắp chiều rộng răng và chiều cao làm việc trên CẢ 2 MẶT BÊN
                            intensity = fullStraightContact;
                        } else {
                            // CHẾ ĐỘ 0: VẾT TIẾP XÚC ĐỘNG LĂN THEO THỜI GIAN THỰC (DYNAMIC ROLLING LOCUS)
                            // Đường tiếp xúc (line contact) quét dọc chiều rộng răng từ chân lên đỉnh theo góc quay
                            float p1 = 6.28318530718 / max(1.0, uZ1);
                            float phiRel = mod(uPinionAngle + p1 * 0.5, p1) - p1 * 0.5;
                            float normPhase = clamp(phiRel / (p1 * 0.45), -1.0, 1.0);
                            if (uAnimDirection < 0.0) {
                                normPhase = -normPhase;
                            }
                            float v_roll = normPhase * 0.35;
                            float lineHalfW = 0.08 * widthScale;
                            float dv = abs(v - v_roll) / max(0.01, lineHalfW);
                            float rollLineMask = smoothstep(1.0, 0.0, dv);
                            intensity = fullStraightContact * rollLineMask;
                        }
                    } else {
                        // =========================================================================
                        // BÁNH RĂNG CÔN RĂNG XOẮN (SPIRAL BEVEL GEARS - GLEASON CIRCULAR ARC)
                        // Dao cắt Gleason tạo độ vồng dọc răng (crowning) hình elip cục bộ
                        // =========================================================================
                        if (uTcaPatternType > 0.5) {
                            // CHẾ ĐỘ 1: VẾT TIẾP XÚC ELIP CHUẨN GLEASON (CUMULATIVE ROLLED PATTERN)
                            float u0 = 0.0;
                            float v0 = 0.0;
                            float a_len = 0.32 * widthScale;
                            float b_hgt = 0.22 * widthScale;
                            float du = (u - u0) / max(0.01, a_len);
                            float dv = (v - v0) / max(0.01, b_hgt);
                            float ellDist = sqrt(du * du + dv * dv);
                            if (ellDist <= 1.0) {
                                intensity = smoothstep(0.0, 1.0, 1.0 - ellDist);
                            }
                        } else {
                            // CHẾ ĐỘ 0: TIẾP XÚC ĐỘNG LĂN LIÊN HỢP THỜI GIAN THỰC
                            float dPlane = abs(vTcaWorldPos.z);
                            float dLine = abs(vTcaWorldPos.x * uSinD - vTcaWorldPos.y * uCosD);
                            float maxCorridor = max(uMmn * 4.0, uB * 0.75);

                            if (dPlane <= maxCorridor && dLine <= maxCorridor) {
                                float p1 = 6.28318530718 / max(1.0, uZ1);
                                float phiRel = mod(uPinionAngle + p1 * 0.5, p1) - p1 * 0.5;
                                float normPhase = clamp(phiRel / (p1 * 0.45), -1.0, 1.0);
                                if (uAnimDirection < 0.0) {
                                    normPhase = -normPhase;
                                }

                                float u_roll = -normPhase * 0.25;
                                float v_roll = normPhase * 0.35;
                                float a_roll = 0.18 * widthScale;
                                float b_roll = 0.22 * widthScale;
                                float du = (u - u_roll) / max(0.01, a_roll);
                                float dv = (v - v_roll) / max(0.01, b_roll);
                                float ellDist = sqrt(du * du + dv * dv);
                                if (ellDist <= 1.0) {
                                    intensity = smoothstep(0.0, 1.0, 1.0 - ellDist);
                                }
                            }
                        }
                    }

                        if (intensity > 0.001) {
                            float t = intensity;
                            vec3 contactCol = vec3(1.0, 0.05, 0.22); // Mode 0: Laser Ruby / Neon Flame
                            vec3 glowCol = vec3(1.0, 0.95, 0.4);

                            if (uTcaColorMode > 0.5 && uTcaColorMode < 1.5) {
                                // Mode 1: Prussian Blue (Bột màu rà vết cơ khí chuẩn xưởng công nghiệp)
                                vec3 deepCobalt = vec3(0.01, 0.18, 0.85); // Xanh lam đậm đặc trưng vùng tâm
                                vec3 cerulean = vec3(0.20, 0.70, 0.98);   // Xanh lam mỏng viền ngoài
                                contactCol = mix(deepCobalt, cerulean, 1.0 - t);
                                glowCol = vec3(0.15, 0.55, 0.95);
                                gl_FragColor.rgb = mix(gl_FragColor.rgb, contactCol, t * 0.92);
                                gl_FragColor.rgb += glowCol * pow(t, 2.5) * 0.45;
                            } else if (uTcaColorMode > 1.5) {
                                // Mode 2: Thermal Heatmap (Bản đồ nhiệt áp lực)
                                vec3 colA = vec3(0.08, 0.85, 0.22);
                                vec3 colB = vec3(1.0, 0.85, 0.1);
                                vec3 colC = vec3(1.0, 0.05, 0.15);
                                contactCol = t < 0.5 ? mix(colA, colB, t * 2.0) : mix(colB, colC, (t - 0.5) * 2.0);
                                glowCol = vec3(1.0, 1.0, 0.4);
                                gl_FragColor.rgb = mix(gl_FragColor.rgb, contactCol, t * 0.95);
                                gl_FragColor.rgb += glowCol * pow(t, 2.0) * 0.85;
                            } else {
                                // Mode 0: Laser Ruby
                                gl_FragColor.rgb = mix(gl_FragColor.rgb, contactCol, t * 0.95);
                                gl_FragColor.rgb += glowCol * pow(t, 2.0) * 0.85;
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
        if (this.pinionMesh) this.pinionMesh.material.needsUpdate = true;
        if (this.gearMesh) this.gearMesh.material.needsUpdate = true;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.needsUpdate = true;
        if (this.gearSurfMesh) this.gearSurfMesh.material.needsUpdate = true;
        return this.tcaEnabled;
    }

    setTCAWidth(width) {
        this.tcaWidth = Math.max(0.5, Math.min(20.0, parseFloat(width) || 4.0));
        this.tcaUniforms.uTcaWidth.value = this.tcaWidth;
        if (this.pinionMesh) this.pinionMesh.material.needsUpdate = true;
        if (this.gearMesh) this.gearMesh.material.needsUpdate = true;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.needsUpdate = true;
        if (this.gearSurfMesh) this.gearSurfMesh.material.needsUpdate = true;
    }

    setTCAColorMode(mode) {
        this.tcaColorMode = parseInt(mode) || 0;
        this.tcaUniforms.uTcaColorMode.value = parseFloat(mode) || 0.0;
        if (this.pinionMesh) this.pinionMesh.material.needsUpdate = true;
        if (this.gearMesh) this.gearMesh.material.needsUpdate = true;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.needsUpdate = true;
        if (this.gearSurfMesh) this.gearSurfMesh.material.needsUpdate = true;
    }

    setTCAPatternType(patternType) {
        this.tcaPatternType = parseInt(patternType) || 0;
        this.tcaUniforms.uTcaPatternType.value = parseFloat(patternType) || 0.0;
        if (this.pinionMesh) this.pinionMesh.material.needsUpdate = true;
        if (this.gearMesh) this.gearMesh.material.needsUpdate = true;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.needsUpdate = true;
        if (this.gearSurfMesh) this.gearSurfMesh.material.needsUpdate = true;
        return this.tcaPatternType;
    }

    /**
     * Phương Án 1: Ẩn/Hiện dạng sườn Flank Surface (không có phôi đặc)
     * Toggles between solid CAD blanks and open flank surfaces
     */
    toggleFlankOnly() {
        this.flankOnlyMode = !this.flankOnlyMode;
        if (this.pinionMesh) this.pinionMesh.visible = !this.flankOnlyMode;
        if (this.gearMesh) this.gearMesh.visible = !this.flankOnlyMode;
        if (this.pinionSurfMesh) this.pinionSurfMesh.visible = this.flankOnlyMode;
        if (this.gearSurfMesh) this.gearSurfMesh.visible = this.flankOnlyMode;
        return this.flankOnlyMode;
    }

    /**
     * Phương Án 2: Bật/Tắt Thước Đo Khe Hở Định Lượng Thời Gian Thực (Digital HUD Gauge)
     */
    toggleClearanceGauge() {
        this.clearanceGaugeMode = !this.clearanceGaugeMode;
        const hudEl = document.getElementById('hudClearanceGauge');
        if (hudEl) {
            hudEl.style.display = this.clearanceGaugeMode ? 'block' : 'none';
        }
        if (this.contactMarker) {
            this.contactMarker.visible = this.clearanceGaugeMode;
        }
        if (this.clearanceGaugeMode) {
            this.updateClearanceHUD();
        }
        return this.clearanceGaugeMode;
    }

    /**
     * Phương Án 3: Bật/Tắt Mặt Cắt Ăn Khớp Động (Dynamic Section Clipping Plane Z = 0)
     */
    toggleSectionCut() {
        this.sectionCutMode = !this.sectionCutMode;
        const planes = (this.sectionCutMode && this.clipPlane) ? [this.clipPlane] : [];
        if (this.pinionMesh) this.pinionMesh.material.clippingPlanes = planes;
        if (this.gearMesh) this.gearMesh.material.clippingPlanes = planes;
        if (this.pinionSurfMesh) this.pinionSurfMesh.material.clippingPlanes = planes;
        if (this.gearSurfMesh) this.gearSurfMesh.material.clippingPlanes = planes;
        return this.sectionCutMode;
    }

    /**
     * Cập nhật thông số HUD Thước đo khe hở thời gian thực (Phương Án 2)
     */
    updateClearanceHUD() {
        if (!this.clearanceGaugeMode) return;
        const hudEl = document.getElementById('hudClearanceGauge');
        if (!hudEl) return;

        const Rm = this.geom ? (parseFloat(this.geom.Rm) || 279.5) : 279.5;
        const delta1 = this.geom ? (parseFloat(this.geom.delta1) || (Math.PI / 4.0)) : (Math.PI / 4.0);
        const z1 = this.geom ? (parseInt(this.geom.z1) || 18) : 18;
        const mmn = this.geom ? (parseFloat(this.geom.mmn) || 10.0) : 10.0;
        const alfaRad = this.geom ? (parseFloat(this.geom.alfa_deg || 20.0) * Math.PI / 180.0) : (20.0 * Math.PI / 180.0);
        const ea = this.geom ? (parseFloat(this.geom.ea) || 1.25) : 1.25;

        // Pitch angle per tooth of pinion
        const toothPitch = (2.0 * Math.PI) / z1;
        // Current angle relative to tooth pitch
        let phiRel = (this.pinionAngle % toothPitch + toothPitch) % toothPitch;
        if (phiRel > toothPitch / 2.0) phiRel -= toothPitch;

        // Engagement angle span based on contact ratio ea (conjugate engagement zone)
        const engageHalfSpan = (ea * toothPitch) * 0.45;
        let deltaClearance = 0.0;
        let isContact = true;

        if (Math.abs(phiRel) <= engageHalfSpan) {
            deltaClearance = 0.000;
            isContact = true;
        } else {
            const sepAngle = Math.abs(phiRel) - engageHalfSpan;
            const rPitchM = Rm * Math.sin(delta1);
            deltaClearance = sepAngle * rPitchM * Math.sin(alfaRad);
            isContact = false;
        }

        // Root bottom clearance c = 0.200 * mmn
        const c_root = 0.200 * mmn;

        // Update DOM elements
        const valContactEl = document.getElementById('hudValContactClearance');
        const indEl = document.getElementById('hudClearanceIndicator');
        const valOppEl = document.getElementById('hudValOppositeClearance');
        const valRootEl = document.getElementById('hudValRootClearance');
        const locEl = document.getElementById('hudMeasureLocation');

        if (valContactEl) {
            valContactEl.textContent = deltaClearance.toFixed(3) + ' mm';
            valContactEl.style.color = isContact ? '#4ade80' : '#fde047';
        }

        if (indEl) {
            if (isContact) {
                indEl.textContent = '🟢 TIẾP XÚC';
                indEl.style.background = '#065f46';
                indEl.style.color = '#34d399';
            } else {
                indEl.textContent = '🟡 HỞ RĂNG (BACKLASH)';
                indEl.style.background = '#854d0e';
                indEl.style.color = '#fde047';
            }
        }

        if (valOppEl) {
            valOppEl.textContent = '0.000 mm (Danh nghĩa)';
        }

        if (valRootEl) {
            valRootEl.textContent = c_root.toFixed(3) + ' mm';
        }

        if (locEl) {
            locEl.textContent = `Đoạn giữa vành răng (Rm = ${Rm.toFixed(1)} mm)`;
        }

        // Update 3D Laser Marker Position & Color
        if (this.contactMarker) {
            this.contactMarker.visible = true;
            const cx = Rm * Math.cos(delta1);
            const cy = Rm * Math.sin(delta1);
            const cz = isContact ? 0.0 : Math.min(10.0, deltaClearance);
            this.contactMarker.position.set(cx, cy, cz);
            if (this.contactMarker.material) {
                this.contactMarker.material.color.setHex(isContact ? 0x34d399 : 0xfde047);
                if (this.contactMarker.material.emissive) {
                    this.contactMarker.material.emissive.setHex(isContact ? 0x10b981 : 0xb45309);
                }
            }
        }
    }
}
