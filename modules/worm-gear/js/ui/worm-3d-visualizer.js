/**
 * ============================================================================
 * MITCALC WEB APP - 3D WEBGL WORM GEAR VISUALIZER & MESHING SIMULATOR (MODULE 3)
 * ============================================================================
 * Renders real-time 3D conjugate meshing of Cylindrical Worm 1 (ZA/ZN/ZI/ZK)
 * and Globoid Throated Worm Wheel 2 at orthogonal axes (Sigma = 90 deg) and
 * center distance a (DIN 3975 / DIN 3996 / AGMA 6022) using Three.js,
 * PBR metallic materials, OrbitControls (360 deg CAD orbit), and analytical
 * collision-free conjugate screw-wheel kinematics.
 * ============================================================================
 */

class Worm3DVisualizer {
    constructor(containerElement) {
        this.container = typeof containerElement === 'string'
            ? document.getElementById(containerElement)
            : containerElement;

        this.geom = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;

        this.wormGroup = null;
        this.wheelGroup = null;
        this.wormMesh = null;
        this.wheelMesh = null;
        this.wormSurfMesh = null;
        this.wheelSurfMesh = null;
        this.gridHelper = null;

        // Static by default on initialization (Rule 14)
        this.isAnimating = false;
        this.animSpeed = 1.0;
        this.animDirection = 1; // 1: Thuận (forward), -1: Nghịch (reverse)
        this.rotSpeedBase = 0.035; // rad per frame for Worm 1 at 1.0x
        this.wormAngle = 0.0;
        this.wheelAngle = 0.0;
        this.initialWheelAngle = 0.0;
        this.gearRatio = 40.0;
        this.handSign = 1.0;
        this.centerDistA = 103.3663;
        this.viewInitialized = false;

        this.wireframeMode = false;
        this.flankOnlyMode = false;
        this.contactMode = 'theory'; // 'theory' (Mặc định: Đường tiếp xúc liên hợp) | 'crowning' (Vết elip có độ vồng)
        this.meshDensityLevel = 6; // Default Level 6 (CAM/CNC Precision)

        this.mesh1Data = null;
        this.mesh2Data = null;
        this.surf1Data = null;
        this.surf2Data = null;
        this.initialized = false;
    }

    ensureInitialized() {
        if (this.initialized) return true;
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return false;
        }
        if (!this.container) return false;
        this.initialized = true;

        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b1120);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(42, width / height, 1.0, 10000);
        this.camera.position.set(180, -40, 240);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls with full 360-deg CAD orbit
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.cadOrbit360 = true;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.screenSpacePanning = true;
            this.controls.maxDistance = 5000;
            this.controls.minDistance = 8;
        }

        // 5. Studio CAD Lighting
        this.setupLighting();

        // 6. Groups for Worm 1 (at Y = -a, axis along X) and Worm Wheel 2 (at origin, axis along Z)
        this.wormGroup = new THREE.Group();
        this.wheelGroup = new THREE.Group();
        this.scene.add(this.wormGroup);
        this.scene.add(this.wheelGroup);

        // 7. Reference Grid below Worm 1
        this.gridHelper = new THREE.GridHelper(600, 30, 0x334155, 0x1e293b);
        this.gridHelper.position.set(0, -160, 0);
        this.scene.add(this.gridHelper);

        // 8. Window resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Start render loop
        this.animate();
    }

    setupLighting() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.55);
        hemiLight.position.set(0, 300, 300);
        this.scene.add(hemiLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.50);
        this.scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.70);
        dirLight1.position.set(250, 300, 350);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.45);
        dirLight2.position.set(-300, -200, -250);
        this.scene.add(dirLight2);

        const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.40);
        dirLight3.position.set(0, -350, 250);
        this.scene.add(dirLight3);

        const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.30);
        dirLight4.position.set(-200, 250, -300);
        this.scene.add(dirLight4);
    }

    onResize() {
        this.ensureInitialized();
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setGeometry(geom) {
        if (!geom || typeof Worm3DGenerator === 'undefined') return;
        this.ensureInitialized();
        this.geom = geom;

        const z1 = Math.max(1, parseInt(geom.z1) || 1);
        const z2 = Math.max(5, parseInt(geom.z2) || 40);
        this.gearRatio = z2 / z1;
        this.handSign = (parseInt(geom.teethOrientation) === 2) ? -1.0 : 1.0;
        this.centerDistA = parseFloat(geom.a) || 103.3663;

        const da1 = parseFloat(geom.da1) || 44.698;
        if (this.gridHelper) {
            this.gridHelper.position.set(0, -this.centerDistA - da1 * 0.85, 0);
        }

        const genOpts = Object.assign({}, geom, {
            meshDensityLevel: this.meshDensityLevel,
            contactMode: this.contactMode
        });

        // 1. Generate Worm 1 Solid Mesh (High Grade Hardened Steel)
        this.mesh1Data = Worm3DGenerator.generateWormMesh(genOpts);

        // 2. Generate Globoid Worm Wheel 2 Solid Mesh (Centrifugal Tin-Nickel Bronze CuSn12Ni2)
        this.mesh2Data = Worm3DGenerator.generateWheelMesh(genOpts);

        // 3. Generate Worm 1 Flank Surface Mesh (Flank Only)
        this.surf1Data = Worm3DGenerator.generateWormSurfaceMesh(genOpts);

        // 4. Generate Globoid Worm Wheel 2 Flank Surface Mesh (Flank Only)
        this.surf2Data = Worm3DGenerator.generateWheelSurfaceMesh(genOpts);

        this.updateMeshes();

        // Position Worm 1 at (0, -a, 0) and Worm Wheel 2 at (0, 0, 0)
        if (this.wormGroup) {
            this.wormGroup.position.set(0, -this.centerDistA, 0);
        }
        if (this.wheelGroup) {
            this.wheelGroup.position.set(0, 0, 0);
        }

        this.initialWheelAngle = 0.0;
        this.wormAngle = 0.0;
        this.wheelAngle = this.initialWheelAngle;
        this.updateGearRotations();

        if (!this.viewInitialized) {
            this.setViewPreset('iso');
            this.viewInitialized = true;
        }
    }

    updateMeshes() {
        if (!this.mesh1Data || !this.mesh2Data) return;

        if (this.wormMesh) {
            this.wormGroup.remove(this.wormMesh);
            this.wormMesh.geometry.dispose();
            this.wormMesh = null;
        }
        if (this.wheelMesh) {
            this.wheelGroup.remove(this.wheelMesh);
            this.wheelMesh.geometry.dispose();
            this.wheelMesh = null;
        }
        if (this.wormSurfMesh) {
            this.wormGroup.remove(this.wormSurfMesh);
            this.wormSurfMesh.geometry.dispose();
            this.wormSurfMesh = null;
        }
        if (this.wheelSurfMesh) {
            this.wheelGroup.remove(this.wheelSurfMesh);
            this.wheelSurfMesh.geometry.dispose();
            this.wheelSurfMesh = null;
        }

        // PBR Materials (Authentic Mechanical CAD Engineering Standards):
        // Worm 1 Solid: Case-Hardened Ground Alloy Steel (Cobalt-Cyan Metallic)
        const matWorm = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            emissive: 0x013a63,
            emissiveIntensity: 0.08,
            metalness: 0.35,
            roughness: 0.42,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Worm Wheel 2 Solid: Centrifugal Tin-Nickel Bronze CuSn12Ni2 (Coral-Orange Bronze)
        const matWheel = new THREE.MeshStandardMaterial({
            color: 0xea580c,
            emissive: 0x7c2d12,
            emissiveIntensity: 0.08,
            metalness: 0.30,
            roughness: 0.44,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Flank Only Surface Materials (PBR Metallic CAD - High Contrast for Back-face Imprint):
        // Worm 1 Flank: Vivid Electric Cyan-Blue (#00a8ff)
        const matWormSurf = new THREE.MeshStandardMaterial({
            color: 0x00a8ff,
            emissive: 0x0284c7,
            emissiveIntensity: 0.16,
            metalness: 0.20,
            roughness: 0.35,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // Worm Wheel 2 Flank: Vivid Flame Coral-Orange (#ff5722)
        const matWheelSurf = new THREE.MeshStandardMaterial({
            color: 0xff5722,
            emissive: 0xc2410c,
            emissiveIntensity: 0.16,
            metalness: 0.20,
            roughness: 0.35,
            side: THREE.DoubleSide,
            wireframe: this.wireframeMode
        });

        // 1. Worm 1 Solid Mesh
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.vertices, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));
        this.wormMesh = new THREE.Mesh(geo1, matWorm);
        this.wormMesh.visible = !this.flankOnlyMode;
        this.wormGroup.add(this.wormMesh);

        // 2. Worm Wheel 2 Solid Mesh
        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.vertices, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));
        this.wheelMesh = new THREE.Mesh(geo2, matWheel);
        this.wheelMesh.visible = !this.flankOnlyMode;
        this.wheelGroup.add(this.wheelMesh);

        // 3. Worm 1 Surface Mesh (Flank Only)
        if (this.surf1Data) {
            const geoSurf1 = new THREE.BufferGeometry();
            geoSurf1.setAttribute('position', new THREE.BufferAttribute(this.surf1Data.vertices, 3));
            geoSurf1.setAttribute('normal', new THREE.BufferAttribute(this.surf1Data.normals, 3));
            geoSurf1.setIndex(new THREE.BufferAttribute(this.surf1Data.indices, 1));
            this.wormSurfMesh = new THREE.Mesh(geoSurf1, matWormSurf);
            this.wormSurfMesh.visible = this.flankOnlyMode;
            this.wormGroup.add(this.wormSurfMesh);
        }

        // 4. Worm Wheel 2 Surface Mesh (Flank Only)
        if (this.surf2Data) {
            const geoSurf2 = new THREE.BufferGeometry();
            geoSurf2.setAttribute('position', new THREE.BufferAttribute(this.surf2Data.vertices, 3));
            geoSurf2.setAttribute('normal', new THREE.BufferAttribute(this.surf2Data.normals, 3));
            geoSurf2.setIndex(new THREE.BufferAttribute(this.surf2Data.indices, 1));
            this.wheelSurfMesh = new THREE.Mesh(geoSurf2, matWheelSurf);
            this.wheelSurfMesh.visible = this.flankOnlyMode;
            this.wheelGroup.add(this.wheelSurfMesh);
        }
    }

    updateGearRotations() {
        if (!this.wormGroup || !this.wheelGroup) return;
        this.wormGroup.rotation.x = this.wormAngle;
        this.wheelGroup.rotation.z = this.wheelAngle;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.container || this.container.clientWidth === 0 || this.container.clientHeight === 0) {
            return;
        }

        if (this.isAnimating && this.wormGroup && this.wheelGroup) {
            const step = this.rotSpeedBase * this.animSpeed * (this.animDirection || 1);
            this.wormAngle += step;
            // Exact conjugate synchronization between Worm 1 (X-axis) and Worm Wheel 2 (Z-axis):
            this.wheelAngle = this.initialWheelAngle - this.handSign * (this.wormAngle / this.gearRatio);
            this.updateGearRotations();
        }

        if (this.controls) {
            this.controls.update();
            if (this.camera) {
                const camDist = this.camera.position.distanceTo(this.controls.target);
                const newNear = Math.max(1.0, Math.min(40.0, camDist * 0.12));
                const newFar = Math.max(800.0, camDist * 8.0);
                if (Math.abs(this.camera.near - newNear) > 0.8 || Math.abs(this.camera.far - newFar) > 25.0) {
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

    toggleAnimDirection() {
        this.animDirection = (this.animDirection === 1) ? -1 : 1;
        return this.animDirection;
    }

    stepAnimation(direction = 1) {
        this.isAnimating = false;
        const stepRad = (Math.PI / 18.0) * direction; // 10 deg of worm rotation per step
        this.wormAngle += stepRad;
        this.wheelAngle = this.initialWheelAngle - this.handSign * (this.wormAngle / this.gearRatio);
        this.updateGearRotations();
        return this.wormAngle;
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.wormMesh) this.wormMesh.material.wireframe = this.wireframeMode;
        if (this.wheelMesh) this.wheelMesh.material.wireframe = this.wireframeMode;
        if (this.wormSurfMesh) this.wormSurfMesh.material.wireframe = this.wireframeMode;
        if (this.wheelSurfMesh) this.wheelSurfMesh.material.wireframe = this.wireframeMode;
        return this.wireframeMode;
    }

    toggleFlankOnly() {
        this.flankOnlyMode = !this.flankOnlyMode;
        if (this.wormMesh) this.wormMesh.visible = !this.flankOnlyMode;
        if (this.wheelMesh) this.wheelMesh.visible = !this.flankOnlyMode;
        if (this.wormSurfMesh) this.wormSurfMesh.visible = this.flankOnlyMode;
        if (this.wheelSurfMesh) this.wheelSurfMesh.visible = this.flankOnlyMode;
        return this.flankOnlyMode;
    }

    setMeshDensityLevel(level) {
        this.meshDensityLevel = Math.max(1, Math.min(8, parseInt(level) || 6));
        if (this.geom) {
            const curWormAngle = this.wormAngle;
            const curWheelAngle = this.wheelAngle;
            this.setGeometry(this.geom);
            this.wormAngle = curWormAngle;
            this.wheelAngle = curWheelAngle;
            this.updateGearRotations();
        }
        return this.meshDensityLevel;
    }

    setContactMode(mode) {
        this.contactMode = (mode === 'crowning') ? 'crowning' : 'theory';
        if (this.geom) {
            const curWormAngle = this.wormAngle;
            const curWheelAngle = this.wheelAngle;
            this.setGeometry(this.geom);
            this.wormAngle = curWormAngle;
            this.wheelAngle = curWheelAngle;
            this.updateGearRotations();
        }
        return this.contactMode;
    }

    resetView() {
        this.setViewPreset('iso');
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const a = this.centerDistA || 103.3663;
        const de2 = this.geom ? (parseFloat(this.geom.de2) || 183.23) : 183.23;
        const da1 = this.geom ? (parseFloat(this.geom.da1) || 44.7) : 44.7;
        const span = Math.max(120.0, de2 * 0.5 + a + da1 * 0.5);
        const cenX = 0.0;
        // Midpoint between wheel top (+de2/2) and worm bottom (-a - da1/2):
        const cenY = (de2 * 0.5 - (a + da1 * 0.5)) * 0.5;
        const cenZ = 0.0;
        const viewDist = span * 1.62;

        switch (preset) {
            case 'front': // Front View (XY plane from +Z: shows horizontal Worm 1 under Wheel 2)
                this.camera.position.set(cenX, cenY, cenZ + viewDist * 1.05);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
            case 'worm': // Side Throat View along +X axis (YZ plane: shows concave wheel throat wrapping worm!)
                const throatY = -a + (this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23) * 0.5;
                this.camera.position.set(cenX + viewDist * 0.85, throatY, cenZ);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, throatY, cenZ);
                break;
            case 'wheel': // Direct Wheel View from +Z centered on Wheel 2
                this.camera.position.set(0, 0, viewDist * 0.95);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, 0, 0);
                break;
            case 'top': // Top View looking down -Y
                this.camera.position.set(0, viewDist * 1.15, 0);
                this.camera.up.set(0, 0, -1);
                this.controls.target.set(0, -a * 0.5, 0);
                break;
            case 'mesh': // Close-up on Conjugate Meshing Throat Zone at (0, -a + r1, 0)
                const d1 = this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23;
                const b2H = this.geom ? (parseFloat(this.geom.b2H) || 33.57) : 33.57;
                const meshY = -a + d1 * 0.5;
                const meshDist = Math.max(55.0, 1.8 * b2H);
                this.camera.position.set(meshDist * 0.45, meshY - meshDist * 0.15, meshDist * 0.80);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, meshY, 0);
                break;
            case 'rear': // Close-up on Rear Tooth Flank Contact Imprint (Soi Vết In Màu Mặt Sau Sườn Răng)
                const d1_r = this.geom ? (parseFloat(this.geom.d1) || 36.23) : 36.23;
                const b2H_r = this.geom ? (parseFloat(this.geom.b2H) || 33.57) : 33.57;
                const meshY_r = -a + d1_r * 0.5;
                const rearDist = Math.max(50.0, 1.5 * b2H_r);
                this.camera.position.set(-rearDist * 0.35, meshY_r + rearDist * 0.45, rearDist * 0.90);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(0, meshY_r, 0);
                break;
            case 'iso':
            default:
                this.camera.position.set(cenX + viewDist * 0.72, cenY + viewDist * 0.38, cenZ + viewDist * 0.85);
                this.camera.up.set(0, 1, 0);
                this.controls.target.set(cenX, cenY, cenZ);
                break;
        }

        this.camera.lookAt(this.controls.target);
        this.controls.update();
    }

    meshToRawTriangles(meshData) {
        if (!meshData) return [];
        if (meshData.rawTriangles) return meshData.rawTriangles;
        const { vertices, normals, indices } = meshData;
        if (!vertices || !indices) return [];
        const tris = [];
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = indices[i] * 3, i2 = indices[i + 1] * 3, i3 = indices[i + 2] * 3;
            const p1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const p2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
            const p3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];
            const n = normals ? [normals[i1], normals[i1 + 1], normals[i1 + 2]] : [0, 1, 0];
            tris.push([p1, p2, p3, n]);
        }
        return tris;
    }

    /**
     * Extracts raw triangles for 3D CAD export (Worm 1, Worm Wheel 2, or Assembly Pair)
     * @param {string} type - 'worm' ('pinion'), 'wheel' ('gear'), or 'assembly'
     * @param {boolean} surfaceOnly - If true, exports open flank surface only
     * @param {boolean} forStep - Uses compact STEP resolution if true
     */
    getExportTriangles(type = 'worm', surfaceOnly = false, forStep = false) {
        if (!this.geom || typeof Worm3DGenerator === 'undefined') return [];

        const stepOpts = forStep ? {
            numWormSlices: Math.max(36, Math.round(((this.geom.L || 56) / (this.geom.px || 13.3)) * 18)),
            ptsPerStart: 32,
            numWheelSlices: 9,
            ptsPerFlank: 6,
            ptsFillet: 3
        } : {
            meshDensityLevel: this.meshDensityLevel || 6
        };

        const fullOpts = Object.assign({}, this.geom, stepOpts, { surfaceOnly });

        if (type === 'worm' || type === 'pinion') {
            const m1 = surfaceOnly
                ? Worm3DGenerator.generateWormSurfaceMesh(fullOpts)
                : Worm3DGenerator.generateWormMesh(fullOpts);
            return this.meshToRawTriangles(m1);
        }

        if (type === 'wheel' || type === 'gear') {
            const m2 = surfaceOnly
                ? Worm3DGenerator.generateWheelSurfaceMesh(fullOpts)
                : Worm3DGenerator.generateWheelMesh(fullOpts);
            return this.meshToRawTriangles(m2);
        }

        // Assembly Pair: Worm 1 translated to (0, -a, 0) + Worm Wheel 2 at (0, 0, 0)
        const m1 = surfaceOnly
            ? Worm3DGenerator.generateWormSurfaceMesh(fullOpts)
            : Worm3DGenerator.generateWormMesh(fullOpts);
        const m2 = surfaceOnly
            ? Worm3DGenerator.generateWheelSurfaceMesh(fullOpts)
            : Worm3DGenerator.generateWheelMesh(fullOpts);
        const a = this.centerDistA || parseFloat(this.geom.a) || 103.3663;

        const rawM1 = this.meshToRawTriangles(m1);
        const tWorm = rawM1.map(([p1, p2, p3, n]) => [
            [p1[0], p1[1] - a, p1[2]],
            [p2[0], p2[1] - a, p2[2]],
            [p3[0], p3[1] - a, p3[2]],
            [n[0], n[1], n[2]]
        ]);
        const tWheel = this.meshToRawTriangles(m2);

        if (forStep) {
            return [tWorm, tWheel];
        }
        return tWorm.concat(tWheel);
    }
}

if (typeof window !== 'undefined') {
    window.Worm3DVisualizer = Worm3DVisualizer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Worm3DVisualizer;
}
