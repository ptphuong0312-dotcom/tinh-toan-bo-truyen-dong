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
        this.animDirection = 1; // 1: Thuận, -1: Nghịch
        this.rotSpeedBase = 0.015; // rad per frame at 1.0x
        this.pinionAngle = 0;
        this.gearAngle = 0;
        this.initialGearAngle = 0;
        this.gearRatio = 2.5;

        this.wireframeMode = false;
        this.showAxes = true;

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
            uAnimDirection: { value: 1.0 },
            uRw1: { value: 57.0 },
            uAw: { value: 201.0 },
            uMn: { value: 6.0 },
            uB: { value: 120.0 },
            uCosAlfa: { value: 0.93969 },
            uSinAlfa: { value: 0.34202 },
            uTanBeta: { value: 0.0 },
            uRBore1: { value: 20.0 },
            uRBore2: { value: 50.0 }
        };

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
     * @param {Object} [resolution=null] - { noPtHead, noPtEv, cuttStep }
     */
    setGeometry(geom, resolution = null) {
        this.geom = geom;
        if (resolution) this.resolution = resolution;
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

        const resOpts = this.resolution || {};

        // 1. Generate 3D mesh for Pinion 1 (Hand: +1)
        this.mesh1Data = Gear3DGenerator.generateGearMesh(Object.assign({
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
        }, resOpts));

        // 2. Generate 3D mesh for Gear 2 (Hand: -1 for helical conjugate mesh!)
        this.mesh2Data = Gear3DGenerator.generateGearMesh(Object.assign({
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
        }, resOpts));

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

        // Update TCA Uniforms for Spur / Helical Gears
        const rw1 = geom.d1 / 2.0;
        const bMax = Math.max(geom.b1, geom.b2) || 120.0;
        const alfaVal = (geom.alfa_t || geom.alfa_n || 20.0) * Math.PI / 180.0;
        const betaVal = (geom.beta || 0.0) * Math.PI / 180.0;

        this.tcaUniforms.uRw1.value = rw1;
        this.tcaUniforms.uAw.value = geom.aw;
        this.tcaUniforms.uMn.value = geom.mn;
        this.tcaUniforms.uB.value = bMax;
        this.tcaUniforms.uCosAlfa.value = Math.cos(alfaVal);
        this.tcaUniforms.uSinAlfa.value = Math.sin(alfaVal);
        this.tcaUniforms.uTanBeta.value = Math.tan(betaVal);
        this.tcaUniforms.uRBore1.value = geom.df1 * 0.225;
        this.tcaUniforms.uRBore2.value = geom.df2 * 0.225;

        // Apply TCA (Tooth Contact Analysis) Dynamic Shader
        this.applyTCAShader(mat1, true);
        this.applyTCAShader(mat2, false);

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

    setAnimDirection(dir) {
        this.animDirection = (dir === -1 || dir < 0) ? -1 : 1;
        if (this.tcaUniforms && this.tcaUniforms.uAnimDirection) {
            this.tcaUniforms.uAnimDirection.value = this.animDirection;
        }
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
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        return this.animDirection;
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        return this.isAnimating;
    }

    animate() {
        requestAnimationFrame(this.animate);

        if (this.isAnimating && this.pinionGroup && this.gearGroup) {
            const dTheta = this.rotSpeedBase * this.animSpeed * (this.animDirection || 1);
            this.pinionAngle += dTheta;
            // Lock gearAngle directly to conjugate rolling phase (zero accumulation drift):
            this.gearAngle = this.initialGearAngle - this.pinionAngle / this.gearRatio;

            this.pinionGroup.rotation.z = this.pinionAngle;
            this.gearGroup.rotation.z = this.gearAngle;
            if (this.tcaUniforms && this.tcaUniforms.uAnimDirection) {
                this.tcaUniforms.uAnimDirection.value = parseFloat(this.animDirection) || 1.0;
            }
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Gets raw triangle data for export (Solid or Hollow Open Surface Shell)
     * @param {'pinion'|'gear'|'assembly'} type
     * @param {boolean} [surfaceOnly=false]
     * @returns {Array} rawTriangles
     */
    getExportTriangles(type = 'pinion', surfaceOnly = false) {
        if (!this.geom) return [];

        let m1 = this.mesh1Data;
        let m2 = this.mesh2Data;

        const resOpts = this.resolution || {};

        if (surfaceOnly) {
            m1 = Gear3DGenerator.generateGearSurfaceMesh(Object.assign({
                z: this.geom.z1,
                mn: this.geom.mn,
                alfa_n: this.geom.alfa_n,
                beta: this.geom.beta,
                b: this.geom.b1,
                x: this.geom.x1,
                d: this.geom.d1,
                db: this.geom.db1,
                da: this.geom.da1,
                df: this.geom.df1,
                hand: +1,
                dBore: this.geom.df1 * 0.45
            }, resOpts));
            m2 = Gear3DGenerator.generateGearSurfaceMesh(Object.assign({
                z: this.geom.z2,
                mn: this.geom.mn,
                alfa_n: this.geom.alfa_n,
                beta: this.geom.beta,
                b: this.geom.b2,
                x: this.geom.x2,
                d: this.geom.d2,
                db: this.geom.db2,
                da: this.geom.da2,
                df: this.geom.df2,
                hand: -1,
                dBore: this.geom.df2 * 0.45
            }, resOpts));
        }

        if (!m1 || !m2) return [];

        if (type === 'pinion') {
            return m1.rawTriangles;
        } else if (type === 'gear') {
            return m2.rawTriangles;
        } else if (type === 'assembly') {
            // Transform gear 2 triangles to center distance aw and initial mesh angle
            const aw = (this.geom && this.geom.aw) ? this.geom.aw : 100.0;
            const rotZ = this.initialGearAngle;
            const cosR = Math.cos(rotZ);
            const sinR = Math.sin(rotZ);

            const transformedGear2 = m2.rawTriangles.map(([p1, p2, p3, n]) => {
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

            return m1.rawTriangles.concat(transformedGear2);
        }
        return [];
    }

    /**
     * Tooth Contact Analysis (TCA) - Custom GPU Shader Hook for Spur & Helical Gears
     * Colors only the active contact zone where the teeth meet in real time.
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
                uniform float uAnimDirection;
                uniform float uRw1;
                uniform float uAw;
                uniform float uMn;
                uniform float uB;
                uniform float uCosAlfa;
                uniform float uSinAlfa;
                uniform float uTanBeta;
                uniform float uIsPinion;
                uniform float uRBore1;
                uniform float uRBore2;
                varying vec3 vTcaWorldPos;
                varying vec3 vTcaWorldNorm;
            ` + shader.fragmentShader;

            const tcaFragmentLogic = `
                #include <dithering_fragment>
                if (uTcaEnabled > 0.5) {
                    float x = vTcaWorldPos.x;
                    float y = vTcaWorldPos.y;
                    float z = vTcaWorldPos.z;

                    float rAxis = (uIsPinion > 0.5) ? length(vec2(x, y)) : length(vec2(x - uAw, y));
                    float minBore = (uIsPinion > 0.5) ? (uRBore1 + 2.0) : (uRBore2 + 2.0);

                    // Active meshing zone around pitch point (uRw1, 0)
                    if (abs(x - uRw1) <= (uMn * 1.8) && abs(y) <= (uMn * 2.2) && abs(z) <= (uB * 0.5 + 2.0) && rAxis > minBore) {
                        // Conjugate Line of Action distance with direction-aware sign:
                        float dLoa = abs((x - uRw1) * uCosAlfa + uAnimDirection * y * uSinAlfa - z * uTanBeta * uSinAlfa);

                        if (dLoa < uTcaWidth) {
                            float t = clamp(1.0 - (dLoa / uTcaWidth), 0.0, 1.0);
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
