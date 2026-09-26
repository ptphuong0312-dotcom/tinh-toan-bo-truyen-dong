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

        // Inspection Mode: Chỉ Mặt Bên (Flank Only - Ẩn khối phôi đặc, chỉ hiện bề mặt sườn thân khai để quan sát vết ăn khớp)
        this.flankOnlyMode = false;
        this.pinionSurfMesh = null;
        this.gearSurfMesh = null;
        this.surf1Data = null;
        this.surf2Data = null;
        this.meshDensityLevel = 6; // 8 Cấp Độ Mịn Lưới Thân Khai (Mặc định Cấp 6: Siêu Mịn CAM/CNC)
        this.contactMode = 'theory'; // 'theory' (Mặc định: Chuẩn lý thuyết đường thẳng dọc nón) | 'gleason' (Vết elip có độ vồng)

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
        this.scene.background = new THREE.Color(0x111827);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1.0, 10000);
        this.camera.position.set(250, 250, 350);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

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
        this.gridHelper = new THREE.GridHelper(1000, 50, 0x334155, 0x1e293b);
        this.gridHelper.position.set(0, 0, -50);
        this.scene.add(this.gridHelper);

        // 8. Resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Animation loop
        this.animate();
    }

    setupLighting() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.55);
        hemiLight.position.set(0, 400, 400);
        this.scene.add(hemiLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
        this.scene.add(ambientLight);

        // Main key light
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.92);
        dirLight1.position.set(350, 500, 450);
        this.scene.add(dirLight1);

        // Fill light
        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.55);
        dirLight2.position.set(-400, -250, -350);
        this.scene.add(dirLight2);

        // Rim light
        const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.45);
        dirLight3.position.set(0, -450, 350);
        this.scene.add(dirLight3);

        // Back-top light for bevel hub & tooth backs
        const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.30);
        dirLight4.position.set(-200, 400, -400);
        this.scene.add(dirLight4);
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
            meshDensityLevel: this.meshDensityLevel,
            contactMode: this.contactMode || 'theory'
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
            meshDensityLevel: this.meshDensityLevel,
            contactMode: this.contactMode || 'theory'
        };
        this.mesh2Data = Bevel3DGenerator.generateGearMesh(opt2);
        this.surf2Data = Bevel3DGenerator.generateGearSurfaceMesh(opt2);
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

        // PBR Materials: Pinion Solid (Vivid Cobalt-Cyan #0284c7), Gear Solid (Vivid Coral-Orange #ea580c)
        const matPinion = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Vivid Cobalt-Cyan Blue
            emissive: 0x0369a1,
            emissiveIntensity: 0.12,
            metalness: 0.18,
            roughness: 0.42,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        const matGear = new THREE.MeshStandardMaterial({
            color: 0xea580c, // Vivid Coral-Orange Copper
            emissive: 0x9a3412,
            emissiveIntensity: 0.12,
            metalness: 0.18,
            roughness: 0.42,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Surface-Only Materials: Pinion Flank (Vivid Electric Blue #00a8ff), Gear Flank (Vivid Flame Orange #ff5722)
        // In "Chỉ Mặt Bên" mode, contact is directly observed through the conjugate surface intersection
        const matPinionSurf = new THREE.MeshStandardMaterial({
            color: 0x00a8ff, // Vivid electric cyan-blue for pinion flank
            emissive: 0x0284c7,
            emissiveIntensity: 0.14,
            metalness: 0.15,
            roughness: 0.40,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        const matGearSurf = new THREE.MeshStandardMaterial({
            color: 0xff5722, // Vivid flame coral-orange for gear flank
            emissive: 0xc2410c,
            emissiveIntensity: 0.14,
            metalness: 0.15,
            roughness: 0.40,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

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
            const step = this.rotSpeedBase * this.animSpeed * (this.animDirection || 1);
            this.pinionAngle += step;
            // Kinematic conjugate synchronization:
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;
            this.updateGearRotations();
        }

        if (this.controls) {
            this.controls.update();
            if (this.camera) {
                const camDist = this.camera.position.distanceTo(this.controls.target);
                const newNear = Math.max(2.0, Math.min(60.0, camDist * 0.18));
                const newFar = Math.max(500.0, camDist * 6.0);
                if (Math.abs(this.camera.near - newNear) > 1.0 || Math.abs(this.camera.far - newFar) > 20.0) {
                    this.camera.near = newNear;
                    this.camera.far = newFar;
                    this.camera.updateProjectionMatrix();
                }
            }
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
        this.updateGearRotations();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return this.animDirection;
    }

    toggleAnimDirection() {
        this.animDirection = (this.animDirection === 1) ? -1 : 1;
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

    setContactMode(mode) {
        this.contactMode = (mode === 'gleason') ? 'gleason' : 'theory';
        if (this.geom) {
            const curPinionAngle = this.pinionAngle;
            const curGearAngle = this.gearAngle;
            this.setGeometry(this.geom);
            this.pinionAngle = curPinionAngle;
            this.gearAngle = curGearAngle;
            this.updateGearRotations();
        }
        return this.contactMode;
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
            case 'mesh': // Close up on pitch contact zone looking directly along tooth groove (shows contact on both flanks)
                const cosD_m = Math.cos(delta1);
                const sinD_m = Math.sin(delta1);
                this.camera.position.set(
                    mx + 95 * cosD_m - 20 * sinD_m,
                    my + 95 * sinD_m + 20 * cosD_m,
                    55
                );
                this.camera.up.set(0, 0, 1);
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
     * Chế Độ "Chỉ Mặt Bên" (Flank Only Mode)
     * Ẩn toàn bộ khối phôi đặc, chỉ hiển thị bề mặt sườn thân khai của 2 bánh răng
     * Vết ăn khớp tiếp xúc hình học được quan sát trực tiếp qua giao tuyến ăn khớp giữa 2 mặt bên
     */
    toggleFlankOnly() {
        this.flankOnlyMode = !this.flankOnlyMode;
        if (this.pinionMesh) this.pinionMesh.visible = !this.flankOnlyMode;
        if (this.gearMesh) this.gearMesh.visible = !this.flankOnlyMode;
        if (this.pinionSurfMesh) this.pinionSurfMesh.visible = this.flankOnlyMode;
        if (this.gearSurfMesh) this.gearSurfMesh.visible = this.flankOnlyMode;
        return this.flankOnlyMode;
    }
}
