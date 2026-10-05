/**
 * 3D Holographic NLE Timeline & Video Editing Suite (Three.js)
 * Visually iconic 3D representation of professional video editing (المونتاج).
 * Features multi-track 3D clip blocks (V2, V1, A1, A2), audio waveform slabs,
 * glowing diamond keyframes, and an interactive 3D Playhead that follows cursor movement!
 */

class Hero3DVideoTimelineSuite {
  constructor() {
    this.container = document.getElementById('hero-3d-canvas-container');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Groups & Meshes
    this.timelineRig = null;
    this.playheadGroup = null;
    this.playheadLaser = null;
    this.trackClips = [];
    this.waveforms = [];
    this.keyframeNodes = [];
    this.ambientParticles = null;

    // Interaction State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, normalizedX: 0 };
    this.isHovered = false;
    this.pulse = 0;
    this.time = 0;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js is not loaded.');
      return;
    }

    const width = this.container.clientWidth || 440;
    const height = this.container.clientHeight || 440;

    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5.4);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Build 3D NLE Editing Timeline
    this.buildNLETimeline();

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Bind Events
    this.bindEvents();

    // 7. Animation Loop
    this.animate();
  }

  buildNLETimeline() {
    this.timelineRig = new THREE.Group();

    // =========================================================================
    // 1. TIMELINE BASEBOARD (Sleek Glassmorphic Grid Plate)
    // =========================================================================
    const baseGeo = new THREE.BoxGeometry(3.6, 2.6, 0.08);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x070b14,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const basePlate = new THREE.Mesh(baseGeo, baseMat);
    this.timelineRig.add(basePlate);

    // Outer Neon Glow Border around Baseboard
    const borderGeo = new THREE.EdgesGeometry(baseGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.4 });
    const borderLines = new THREE.LineSegments(borderGeo, borderMat);
    this.timelineRig.add(borderLines);

    // =========================================================================
    // 2. MULTI-TRACK 3D VIDEO & AUDIO CLIPS (V2, V1, A1, A2)
    // =========================================================================
    const tracksData = [
      // Track V2: VFX & 3D Motion (Blue / Cyan Glow)
      { y: 0.8, x: -0.4, w: 1.6, h: 0.38, color: 0x3a86ff, emissive: 0x1d4ed8, label: 'V2_VFX' },
      { y: 0.8, x: 0.9, w: 0.9, h: 0.38, color: 0x00f5d4, emissive: 0x0d9488, label: 'V2_3D_TITLE' },

      // Track V1: Master Cut & Color Grade (Deep Purple / Magenta)
      { y: 0.3, x: -0.85, w: 1.3, h: 0.42, color: 0x8338ec, emissive: 0x6b21a8, label: 'V1_CAM_A' },
      { y: 0.3, x: 0.35, w: 1.8, h: 0.42, color: 0x7209b7, emissive: 0x581c87, label: 'V1_CAM_B_ACES' },

      // Track A1: Dialogue & Foley (Emerald Green)
      { y: -0.3, x: -0.5, w: 2.2, h: 0.38, color: 0x06d6a0, emissive: 0x047857, label: 'A1_VOX_FOLEY' },
      { y: -0.3, x: 1.0, w: 0.7, h: 0.38, color: 0x10b981, emissive: 0x065f46, label: 'A1_FX' },

      // Track A2: Score & Hybrid Synth (Amber Gold)
      { y: -0.8, x: 0.0, w: 3.1, h: 0.38, color: 0xffbe0b, emissive: 0xb45309, label: 'A2_CINEMA_SCORE' }
    ];

    tracksData.forEach(data => {
      const clipGeo = new THREE.BoxGeometry(data.w, data.h, 0.12);
      const clipMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.emissive,
        emissiveIntensity: 0.4,
        roughness: 0.25,
        metalness: 0.75
      });
      const clip = new THREE.Mesh(clipGeo, clipMat);
      clip.position.set(data.x, data.y, 0.1);
      
      // Clip outline wireframe
      const clipEdgeGeo = new THREE.EdgesGeometry(clipGeo);
      const clipEdgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
      const clipEdges = new THREE.LineSegments(clipEdgeGeo, clipEdgeMat);
      clip.add(clipEdges);

      this.trackClips.push(clip);
      this.timelineRig.add(clip);
    });

    // =========================================================================
    // 3. 3D AUDIO WAVEFORM BARS (Animated Frequency Slabs)
    // =========================================================================
    const barCount = 28;
    const waveGroup = new THREE.Group();
    for (let i = 0; i < barCount; i++) {
      const barGeo = new THREE.BoxGeometry(0.06, 0.2, 0.08);
      const barMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(-1.4 + (i * 0.1), -0.8, 0.18);
      this.waveforms.push({ mesh: bar, baseH: 0.2 + Math.random() * 0.15, offset: i * 0.3 });
      waveGroup.add(bar);
    }
    this.timelineRig.add(waveGroup);

    // =========================================================================
    // 4. INTERACTIVE 3D PLAYHEAD SCRUBBER (Amber Laser Beam)
    // =========================================================================
    this.playheadGroup = new THREE.Group();

    // Top Playhead Scrubber Triangle Cap
    const capShape = new THREE.Shape();
    capShape.moveTo(-0.12, 0);
    capShape.lineTo(0.12, 0);
    capShape.lineTo(0.12, -0.08);
    capShape.lineTo(0, -0.2);
    capShape.lineTo(-0.12, -0.08);
    capShape.closePath();

    const capGeo = new THREE.ShapeGeometry(capShape);
    const capMat = new THREE.MeshBasicMaterial({ color: 0xff3366, side: THREE.DoubleSide });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 1.25, 0.25);
    this.playheadGroup.add(cap);

    // Glowing Laser Line
    const laserGeo = new THREE.BoxGeometry(0.025, 2.45, 0.08);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    this.playheadLaser = new THREE.Mesh(laserGeo, laserMat);
    this.playheadLaser.position.set(0, 0, 0.22);
    this.playheadGroup.add(this.playheadLaser);

    // Laser Glow Halo
    const haloGeo = new THREE.BoxGeometry(0.06, 2.45, 0.04);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.4 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0, 0.22);
    this.playheadGroup.add(halo);

    this.playheadGroup.position.x = 0;
    this.timelineRig.add(this.playheadGroup);

    // =========================================================================
    // 5. 3D FLOATING KEYFRAME DIAMOND NODES (Bezier Speed-Ramps)
    // =========================================================================
    const kfCoords = [
      { x: -1.2, y: 0.3, color: 0x00f5d4 },
      { x: -0.2, y: 0.3, color: 0xffbe0b },
      { x: 0.7, y: 0.8, color: 0xf72585 },
      { x: 1.3, y: 0.8, color: 0x00f5d4 }
    ];

    kfCoords.forEach(c => {
      const kfGeo = new THREE.OctahedronGeometry(0.1, 0);
      const kfMat = new THREE.MeshStandardMaterial({
        color: c.color,
        emissive: c.color,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.1
      });
      const kf = new THREE.Mesh(kfGeo, kfMat);
      kf.position.set(c.x, c.y, 0.28);
      this.keyframeNodes.push(kf);
      this.timelineRig.add(kf);
    });

    // =========================================================================
    // 6. AMBIENT PARTICLES / RENDER DUST
    // =========================================================================
    const particleCount = 80;
    const partGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f5d4);
    const c2 = new THREE.Color(0x7209b7);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;

      const col = i % 2 === 0 ? c1 : c2;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(partGeo, partMat);
    this.timelineRig.add(this.ambientParticles);

    // Set initial dynamic angle
    this.timelineRig.rotation.x = 0.25;
    this.timelineRig.rotation.y = -0.35;
    this.timelineRig.rotation.z = 0.05;

    this.scene.add(this.timelineRig);
  }

  setupLighting() {
    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    // Key Light (Neon Cyan)
    const key = new THREE.DirectionalLight(0x00f5d4, 3.2);
    key.position.set(4, 5, 5);
    this.scene.add(key);

    // Rim Light (Deep Violet / Magenta)
    const rim = new THREE.DirectionalLight(0xf72585, 2.5);
    rim.position.set(-5, -4, 4);
    this.scene.add(rim);

    // Top Fill
    const fill = new THREE.PointLight(0x00b4d8, 2.0, 15);
    fill.position.set(0, 3, 4);
    this.scene.add(fill);
  }

  bindEvents() {
    // Mouse movement: Controls 3D tilt AND moves the Playhead Scrubber!
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth / 2);
      this.mouse.targetY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Playhead follows normalized X within container (-1.4 to 1.4)
      const relX = (e.clientX - rect.left) / rect.width;
      this.mouse.normalizedX = (relX - 0.5) * 2.8;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        this.mouse.targetX = (touch.clientX - centerX) / (window.innerWidth / 2);
        this.mouse.targetY = (touch.clientY - centerY) / (window.innerHeight / 2);

        const relX = (touch.clientX - rect.left) / rect.width;
        this.mouse.normalizedX = (relX - 0.5) * 2.8;
      }
    }, { passive: true });

    // Hover state
    this.container.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    // Click: Razor cut edit slice flare pulse
    this.container.addEventListener('click', () => {
      this.pulse = 1.0;
      if (window.soundFX) window.soundFX.playClick();
    });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth || 440;
      const h = this.container.clientHeight || 440;

      if (this.camera && this.renderer) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
  }

  animate() {
    this.time += 0.02;

    // Smooth inertia lerp for 3D tilt
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Decay click pulse
    if (this.pulse > 0) {
      this.pulse -= 0.04;
      if (this.pulse < 0) this.pulse = 0;
    }

    if (this.timelineRig) {
      // 1. Natural floating levitation
      this.timelineRig.position.y = Math.sin(this.time * 1.4) * 0.08;
      this.timelineRig.position.x = Math.cos(this.time * 1.0) * 0.04;

      // 2. Direct cursor perspective rotation (Fluid 3D tilt)
      const targetRotY = -0.35 + (this.mouse.x * 0.85);
      const targetRotX = 0.25 - (this.mouse.y * 0.75);
      const targetRotZ = 0.05 + (this.mouse.x * 0.2);

      this.timelineRig.rotation.y += (targetRotY - this.timelineRig.rotation.y) * 0.08;
      this.timelineRig.rotation.x += (targetRotX - this.timelineRig.rotation.x) * 0.08;
      this.timelineRig.rotation.z += (targetRotZ - this.timelineRig.rotation.z) * 0.08;

      // Pulse bounce on click
      const scale = 1.0 + (this.pulse * 0.1);
      this.timelineRig.scale.set(scale, scale, scale);
    }

    // 3. Playhead scrubber follows cursor smoothly across timeline
    if (this.playheadGroup) {
      const targetPlayheadX = this.isHovered 
        ? Math.max(-1.5, Math.min(1.5, this.mouse.normalizedX))
        : Math.sin(this.time * 1.2) * 1.2;

      this.playheadGroup.position.x += (targetPlayheadX - this.playheadGroup.position.x) * 0.1;
    }

    // 4. Animate audio waveform bars dynamically
    const waveSpeed = this.isHovered ? 4.0 : 2.0;
    this.waveforms.forEach(w => {
      const val = Math.sin(this.time * waveSpeed + w.offset) * 0.15 + w.baseH;
      w.mesh.scale.y = Math.max(0.2, val);
    });

    // 5. Rotate keyframe diamond crystals
    this.keyframeNodes.forEach(kf => {
      kf.rotation.x += 0.03;
      kf.rotation.y += 0.04;
    });

    // 6. Drift particles
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y += 0.002;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.hero3D = new Hero3DVideoTimelineSuite();
});
