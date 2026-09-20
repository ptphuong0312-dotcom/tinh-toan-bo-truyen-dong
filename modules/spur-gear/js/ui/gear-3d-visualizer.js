/**
 * MITCalc Web App - 3D WebGL Gear Visualizer & Meshing Simulator
 * Renders real-time 3D meshing of Spur (beta = 0) and Helical (beta != 0) gears
 * using Three.js with PBR metallic materials, OrbitControls, and animated conjugate rotation.
 */

import { Gear3DGenerator } from '../engine/gear-3d-generator.js';

export class Gear3DVisualizer {
    constructor(containerElement) {
        this.container = containerElement;
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

        this.wireframeMode = false;
        this.showAxes = true;

        this.mesh1Data = null;
        this.mesh2Data = null;

        this.init();
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return;
        }

        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0b0f19);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1.0, 10000);
        this.camera.position.set(0, -350, 450);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // Clean existing children
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

        // 6. Groups for independent rotation
        this.pinionGroup = new THREE.Group();
        this.gearGroup = new THREE.Group();
        this.scene.add(this.pinionGroup);
        this.scene.add(this.gearGroup);

        // 7. Grid helper
        this.gridHelper = new THREE.GridHelper(1000, 50, 0x1e293b, 0x0f172a);
        this.gridHelper.rotation.x = Math.PI / 2; // Lie on XY or XZ plane
        this.gridHelper.position.z = -100;
        this.scene.add(this.gridHelper);

        // 8. Resize listener
        window.addEventListener('resize', () => this.onResize());

        // 9. Start render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    setupLighting() {
        const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(200, 300, 500);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
        fillLight.position.set(-300, -200, 300);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0xfef08a, 0.6);
        backLight.position.set(0, 400, -300);
        this.scene.add(backLight);
    }

    onResize() {
        if (!this.renderer || !this.camera) return;
        const width = this.container.clientWidth || 1200;
        const height = this.container.clientHeight || 650;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Updates 3D gear pair from calculation geometry
     * @param {Object} geom - Calculation results from GearGeometry.calculate
     */
    setGeometry(geom) {
        this.geom = geom;
        if (!geom || !this.scene) return;

        const isHelical = Math.abs(geom.beta || 0.0) > 1e-4;

        // Clear existing meshes
        while (this.pinionGroup.children.length > 0) {
            const obj = this.pinionGroup.children[0];
            if (obj.geometry) obj.geometry.dispose();
            this.pinionGroup.remove(obj);
        }
        while (this.gearGroup.children.length > 0) {
            const obj = this.gearGroup.children[0];
            if (obj.geometry) obj.geometry.dispose();
            this.gearGroup.remove(obj);
        }

        // 1. Generate 3D mesh for Pinion 1 (Hand: +1)
        this.mesh1Data = Gear3DGenerator.generateGearMesh({
            z: geom.z1,
            mn: geom.mn,
            alfa_n: geom.alfa_n,
            beta: geom.beta,
            b: geom.b1,
            x: geom.x1,
            d: geom.d1,
            db: geom.db1,
            da: geom.da1,
            df: geom.df1,
            hand: +1,
            dBore: geom.df1 * 0.45
        });

        // 2. Generate 3D mesh for Gear 2 (Hand: -1 for helical conjugate mesh!)
        this.mesh2Data = Gear3DGenerator.generateGearMesh({
            z: geom.z2,
            mn: geom.mn,
            alfa_n: geom.alfa_n,
            beta: geom.beta,
            b: geom.b2,
            x: geom.x2,
            d: geom.d2,
            db: geom.db2,
            da: geom.da2,
            df: geom.df2,
            hand: -1,
            dBore: geom.df2 * 0.45
        });

        // 3. Create Three.js BufferGeometries
        const geo1 = new THREE.BufferGeometry();
        geo1.setAttribute('position', new THREE.BufferAttribute(this.mesh1Data.positions, 3));
        geo1.setAttribute('normal', new THREE.BufferAttribute(this.mesh1Data.normals, 3));
        geo1.setIndex(new THREE.BufferAttribute(this.mesh1Data.indices, 1));

        const geo2 = new THREE.BufferGeometry();
        geo2.setAttribute('position', new THREE.BufferAttribute(this.mesh2Data.positions, 3));
        geo2.setAttribute('normal', new THREE.BufferAttribute(this.mesh2Data.normals, 3));
        geo2.setIndex(new THREE.BufferAttribute(this.mesh2Data.indices, 1));

        // 4. Materials (PBR Metallic)
        // Pinion: Golden Amber / Brass
        const mat1 = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.7,
            roughness: 0.3,
            wireframe: this.wireframeMode,
            side: THREE.DoubleSide
        });

        // Gear: Engineering Cyan / Titanium Steel
        const mat2 = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            metalness: 0.75,
            roughness: 0.25,
            wireframe: this.wireframeMode,
            side: THREE.DoubleSide
        });

        this.pinionMesh = new THREE.Mesh(geo1, mat1);
        this.gearMesh = new THREE.Mesh(geo2, mat2);

        this.pinionGroup.add(this.pinionMesh);
        this.gearGroup.add(this.gearMesh);

        // 5. Kinematic positioning
        this.pinionGroup.position.set(0, 0, 0);
        this.gearGroup.position.set(geom.aw, 0, 0);

        // Exact conjugate rolling phase: tooth crest of Pinion 1 meshes cleanly into tooth gap of Gear 2
        this.gearRatio = geom.z2 / geom.z1;
        this.initialGearAngle = (Math.PI / geom.z2) + (Math.PI / 2.0) * (1.0 - geom.z1 / geom.z2);
        this.pinionAngle = 0.0;
        this.gearAngle = this.initialGearAngle;

        this.pinionGroup.rotation.z = this.pinionAngle;
        this.gearGroup.rotation.z = this.gearAngle;

        // Auto position grid helper under the assembly
        const maxRadius = Math.max(geom.da1, geom.da2) / 2.0;
        this.gridHelper.position.set(geom.aw / 2.0, 0, -(Math.max(geom.b1, geom.b2) / 2.0 + 15));

        // Auto-fit camera
        this.autoFitCamera();
    }

    autoFitCamera() {
        if (!this.geom || !this.camera) return;
        const totalSpan = this.geom.aw + (this.geom.da1 + this.geom.da2) / 2.0;
        const maxDim = Math.max(totalSpan, this.geom.da2);

        const centerX = this.geom.aw / 2.0;
        const centerY = 0;
        const centerZ = 0;

        if (this.controls) {
            this.controls.target.set(centerX, centerY, centerZ);
        }

        const dist = maxDim * 1.5;
        this.camera.position.set(centerX, -dist * 0.9, dist * 0.8);
        this.camera.lookAt(centerX, centerY, centerZ);

        if (this.controls) {
            this.controls.update();
        }
    }

    /**
     * Standard 3D CAD Camera View Presets (SolidWorks / Mastercam standard)
     * @param {'iso'|'front'|'back'|'top'|'bottom'|'right'|'left'|'mesh'} viewType
     */
    setCameraView(viewType) {
        if (!this.geom || !this.camera) return;
        const centerX = this.geom.aw / 2.0;
        const totalSpan = this.geom.aw + (this.geom.da1 + this.geom.da2) / 2.0;
        const dist = Math.max(totalSpan, this.geom.da2) * 1.5;

        if (this.controls) {
            this.controls.target.set(centerX, 0, 0);
        }

        switch (viewType) {
            case 'front': // Looking down +Z at XY front face
                this.camera.position.set(centerX, 0, dist * 1.3);
                this.camera.up.set(0, 1, 0);
                break;
            case 'back': // Looking up -Z at XY back face
                this.camera.position.set(centerX, 0, -dist * 1.3);
                this.camera.up.set(0, 1, 0);
                break;
            case 'top': // Looking from top +Y down at XZ plane
                this.camera.position.set(centerX, dist * 1.3, 0);
                this.camera.up.set(0, 0, 1);
                break;
            case 'bottom': // Looking from bottom -Y up at XZ plane
                this.camera.position.set(centerX, -dist * 1.3, 0);
                this.camera.up.set(0, 0, 1);
                break;
            case 'right': // Looking from right +X along shaft axis
                this.camera.position.set(centerX + dist * 1.3, 0, 0);
                this.camera.up.set(0, 0, 1);
                break;
            case 'left': // Looking from left -X along shaft axis
                this.camera.position.set(centerX - dist * 1.3, 0, 0);
                this.camera.up.set(0, 0, 1);
                break;
            case 'mesh': // Close-up on the pitch point contact zone
                const pitchPtX = (this.geom.d1 || 100) / 2.0;
                if (this.controls) this.controls.target.set(pitchPtX, 0, 0);
                this.camera.position.set(pitchPtX, -(this.geom.mn * 14), this.geom.mn * 16);
                this.camera.up.set(0, 0, 1);
                break;
            case 'iso': // Standard Isometric view
            default:
                this.camera.position.set(centerX, -dist * 0.85, dist * 0.75);
                this.camera.up.set(0, 0, 1);
                break;
        }

        if (this.controls) {
            this.controls.update();
        }
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        if (this.pinionMesh && this.pinionMesh.material) {
            this.pinionMesh.material.wireframe = this.wireframeMode;
        }
        if (this.gearMesh && this.gearMesh.material) {
            this.gearMesh.material.wireframe = this.wireframeMode;
        }
    }

    setAnimSpeed(speed) {
        this.animSpeed = Math.max(0.1, Math.min(5.0, speed));
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    animate() {
        requestAnimationFrame(this.animate);

        if (this.isAnimating && this.pinionGroup && this.gearGroup) {
            const dTheta = this.rotSpeedBase * this.animSpeed;
            this.pinionAngle += dTheta;
            // Lock gearAngle directly to conjugate rolling phase (zero accumulation drift):
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;

            this.pinionGroup.rotation.z = this.pinionAngle;
            this.gearGroup.rotation.z = this.gearAngle;
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Gets raw triangle data for export
     * @param {'pinion'|'gear'|'assembly'} type
     * @returns {Array} rawTriangles
     */
    getExportTriangles(type = 'pinion') {
        if (!this.mesh1Data || !this.mesh2Data) return [];

        if (type === 'pinion') {
            return this.mesh1Data.rawTriangles;
        } else if (type === 'gear') {
            return this.mesh2Data.rawTriangles;
        } else if (type === 'assembly') {
            // Transform gear 2 triangles to center distance aw and initial mesh angle
            const aw = (this.geom && this.geom.aw) ? this.geom.aw : 100.0;
            const rotZ = this.initialGearAngle;
            const cosR = Math.cos(rotZ);
            const sinR = Math.sin(rotZ);

            const transformedGear2 = this.mesh2Data.rawTriangles.map(([p1, p2, p3, n]) => {
                const trPt = (p) => [
                    p[0] * cosR - p[1] * sinR + aw,
                    p[0] * sinR + p[1] * cosR,
                    p[2]
                ];
                const trVec = (v) => [
                    v[0] * cosR - v[1] * sinR,
                    v[0] * sinR + v[1] * cosR,
                    v[2]
                ];
                return [trPt(p1), trPt(p2), trPt(p3), trVec(n)];
            });

            return this.mesh1Data.rawTriangles.concat(transformedGear2);
        }
        return [];
    }
}
