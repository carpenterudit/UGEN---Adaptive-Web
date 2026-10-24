import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Play, Pause, Eye, Sparkles, Layers } from 'lucide-react';

export function Scene3D({
  model = 'furniture',
  height = 360,
  accentColor = '#EAAA00',
  title = 'Interactive 3D Viewport',
  subtitle = 'Drag to rotate • Scroll to inspect • Real-time WebGL',
  showControls = true,
  autoRotateSpeed = 1.2
}) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeColor, setActiveColor] = useState(accentColor);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References to keep animation loop & controls reactive
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshGroupRef = useRef(null);
  const materialsRef = useRef([]);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationMomentum = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActiveColor(accentColor);
  }, [accentColor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 400;
    const h = height;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(4, 8, 4);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(new THREE.Color(activeColor), 3, 10);
    pointLight.position.set(-3, 2, -2);
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0x3a0f34, 1.2);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // 3. Materials
    materialsRef.current = [];
    const baseColor = new THREE.Color(activeColor);

    const mainMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.45,
      roughness: 0.25,
      wireframe: isWireframe
    });
    materialsRef.current.push(mainMat);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1f1824,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: isWireframe
    });
    materialsRef.current.push(darkMat);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xdde3e8,
      metalness: 0.1,
      roughness: 0.6,
      wireframe: isWireframe
    });
    materialsRef.current.push(woodMat);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xeaaa00,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: isWireframe
    });
    materialsRef.current.push(goldMat);

    // 4. Construct Models based on requested type
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    meshGroupRef.current = rootGroup;

    const lowerModel = (model || '').toLowerCase();

    if (lowerModel.includes('furniture') || lowerModel.includes('chair') || lowerModel.includes('table')) {
      // Modern Architectural Lounge Chair
      const seatGeo = new THREE.CylinderGeometry(1.05, 0.95, 0.22, 32);
      const seatMesh = new THREE.Mesh(seatGeo, mainMat);
      seatMesh.position.y = 0.2;
      seatMesh.castShadow = true;
      rootGroup.add(seatMesh);

      // Backrest
      const backGeo = new THREE.CylinderGeometry(0.95, 1.0, 0.7, 32, 1, false, 0, Math.PI);
      const backMesh = new THREE.Mesh(backGeo, mainMat);
      backMesh.position.set(0, 0.65, -0.1);
      backMesh.rotation.y = Math.PI;
      backMesh.castShadow = true;
      rootGroup.add(backMesh);

      // Cushion Pillow
      const cushionGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.1, 24);
      const cushionMesh = new THREE.Mesh(cushionGeo, darkMat);
      cushionMesh.position.y = 0.33;
      rootGroup.add(cushionMesh);

      // 4 Angled Minimalist Legs
      const legPositions = [
        { x: -0.65, z: 0.65, rotZ: 0.12, rotX: -0.12 },
        { x: 0.65, z: 0.65, rotZ: -0.12, rotX: -0.12 },
        { x: -0.65, z: -0.65, rotZ: 0.12, rotX: 0.12 },
        { x: 0.65, z: -0.65, rotZ: -0.12, rotX: 0.12 },
      ];

      legPositions.forEach(pos => {
        const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.75, 16);
        const legMesh = new THREE.Mesh(legGeo, woodMat);
        legMesh.position.set(pos.x, -0.18, pos.z);
        legMesh.rotation.z = pos.rotZ;
        legMesh.rotation.x = pos.rotX;
        legMesh.castShadow = true;
        rootGroup.add(legMesh);

        // Brass feet tip
        const footGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 16);
        const footMesh = new THREE.Mesh(footGeo, goldMat);
        footMesh.position.set(pos.x * 1.08, -0.48, pos.z * 1.08);
        rootGroup.add(footMesh);
      });

      // Shadow receiver ground disk
      const groundGeo = new THREE.CircleGeometry(2.2, 32);
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = -0.55;
      groundMesh.receiveShadow = true;
      rootGroup.add(groundMesh);

    } else if (lowerModel.includes('portfolio') || lowerModel.includes('sculpture') || lowerModel.includes('art')) {
      // Kinetic Geometric Torus Knot Sculpture with Orbiting Rings
      const knotGeo = new THREE.TorusKnotGeometry(0.85, 0.28, 128, 32);
      const knotMesh = new THREE.Mesh(knotGeo, mainMat);
      knotMesh.castShadow = true;
      rootGroup.add(knotMesh);

      // Gyroscopic Ring 1
      const ring1Geo = new THREE.TorusGeometry(1.6, 0.025, 16, 64);
      const ring1 = new THREE.Mesh(ring1Geo, goldMat);
      ring1.rotation.x = Math.PI / 3;
      rootGroup.add(ring1);

      // Gyroscopic Ring 2
      const ring2Geo = new THREE.TorusGeometry(1.85, 0.025, 16, 64);
      const ring2 = new THREE.Mesh(ring2Geo, darkMat);
      ring2.rotation.y = Math.PI / 4;
      rootGroup.add(ring2);

      // Ambient Point Particles
      const particleGeo = new THREE.BufferGeometry();
      const count = 180;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5;
        positions[i + 1] = (Math.random() - 0.5) * 5;
        positions[i + 2] = (Math.random() - 0.5) * 5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: baseColor,
        size: 0.04,
        transparent: true,
        opacity: 0.65
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      rootGroup.add(particles);

    } else if (lowerModel.includes('product') || lowerModel.includes('gadget') || lowerModel.includes('futuristic')) {
      // Cybernetic Capsule / Smart Device with Volumetric Rings
      const coreGeo = new THREE.IcosahedronGeometry(0.85, 3);
      const coreMesh = new THREE.Mesh(coreGeo, mainMat);
      coreMesh.castShadow = true;
      rootGroup.add(coreMesh);

      const shellGeo = new THREE.IcosahedronGeometry(1.15, 1);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0x3a0f34,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      rootGroup.add(shellMesh);

      // Equatorial Glowing Disc
      const discGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.04, 32);
      const discMesh = new THREE.Mesh(discGeo, goldMat);
      rootGroup.add(discMesh);

      // Floating Sensor Orbs
      for (let i = 0; i < 3; i++) {
        const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const orbMesh = new THREE.Mesh(orbGeo, darkMat);
        const angle = (i * Math.PI * 2) / 3;
        orbMesh.position.set(Math.cos(angle) * 1.6, 0.2, Math.sin(angle) * 1.6);
        rootGroup.add(orbMesh);
      }

    } else {
      // Modern Architectural Polyhedron
      const geo = new THREE.DodecahedronGeometry(1.05, 0);
      const mesh = new THREE.Mesh(geo, mainMat);
      mesh.castShadow = true;
      rootGroup.add(mesh);

      const wireGeo = new THREE.DodecahedronGeometry(1.15, 0);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0xeaaa00,
        wireframe: true
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      rootGroup.add(wireMesh);
    }

    // 5. Animation Loop
    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (meshGroupRef.current) {
        if (isRotating && !isDraggingRef.current) {
          angle += 0.008 * autoRotateSpeed;
          meshGroupRef.current.rotation.y = angle + rotationMomentum.current.y;
          meshGroupRef.current.rotation.x = Math.sin(angle * 0.5) * 0.15 + rotationMomentum.current.x;
        } else {
          meshGroupRef.current.rotation.y += (rotationMomentum.current.y - meshGroupRef.current.rotation.y) * 0.1;
          meshGroupRef.current.rotation.x += (rotationMomentum.current.x - meshGroupRef.current.rotation.x) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Interactive Drag & Pointer Handlers
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotationMomentum.current.y += deltaX * 0.01;
      rotationMomentum.current.x += deltaY * 0.01;
      rotationMomentum.current.x = Math.max(-1.2, Math.min(1.2, rotationMomentum.current.x));
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      renderer.dispose();
      scene.clear();
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, [model, height, isRotating, autoRotateSpeed]);

  // Update dynamic material properties when color or wireframe changes
  useEffect(() => {
    if (materialsRef.current.length > 0) {
      const color = new THREE.Color(activeColor);
      materialsRef.current[0].color = color;
      materialsRef.current.forEach(mat => {
        mat.wireframe = isWireframe;
        mat.needsUpdate = true;
      });
    }
  }, [activeColor, isWireframe]);

  const handleReset = () => {
    rotationMomentum.current = { x: 0, y: 0 };
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const paletteColors = [
    { label: 'Marigold Gold', value: '#EAAA00' },
    { label: 'Aubergine', value: '#3A0F34' },
    { label: 'Ice Silver', value: '#DDE3E8' },
    { label: 'Emerald Jade', value: '#10B981' },
    { label: 'Cyber Cyan', value: '#00F0FF' }
  ];

  if (!webGlSupported) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="w-full rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C] p-6 flex flex-col items-center justify-center text-center space-y-3"
      >
        <Sparkles className="w-8 h-8 text-[#EAAA00]" />
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-[#BDB3C1] max-w-sm">
          WebGL acceleration not active in current environment. Showing fallback high-fidelity composition.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[#DDE3E8]/15 bg-gradient-to-b from-[#19141C] to-[#100D12] overflow-hidden shadow-2xl relative my-6">
      {/* 3D Viewport Header */}
      <div className="px-5 py-3 border-b border-[#DDE3E8]/10 bg-[#241B28]/80 backdrop-blur-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EAAA00] animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/25 font-bold">
              3D WebGL
            </span>
          </div>
          {subtitle && <p className="text-[11px] text-[#BDB3C1] mt-0.5">{subtitle}</p>}
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {/* Color Swatches */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-lg bg-[#100D12] border border-[#DDE3E8]/10">
              {paletteColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActiveColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                    activeColor === c.value ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>

            {/* Wireframe Toggle */}
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                isWireframe
                  ? 'bg-[#EAAA00] text-[#100D12] border-[#EAAA00]'
                  : 'bg-[#19141C] text-[#BDB3C1] border-[#DDE3E8]/15 hover:text-white'
              }`}
              title="Toggle Wireframe mode"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Auto-rotate Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                isRotating
                  ? 'bg-[#3A0F34] text-[#EAAA00] border-[#EAAA00]/30'
                  : 'bg-[#19141C] text-[#BDB3C1] border-[#DDE3E8]/15 hover:text-white'
              }`}
              title={isRotating ? 'Pause rotation' : 'Start auto-rotation'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Camera */}
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-[#19141C] border border-[#DDE3E8]/15 text-[#BDB3C1] hover:text-white transition-colors cursor-pointer"
              title="Reset angle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        style={{ height: `${height}px` }}
        className="w-full relative cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
      />

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-[#DDE3E8]/10 bg-[#100D12]/70 text-[10px] text-[#BDB3C1] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-[#EAAA00]" />
          <span>Interactive Orbit Controls Active</span>
        </span>
        <span className="font-mono text-[#EAAA00]">Three.js Engine</span>
      </div>
    </div>
  );
}
