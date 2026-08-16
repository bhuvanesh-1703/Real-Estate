import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Compass,
  Layers,
  Maximize2,
  Sparkles,
  Shield,
  ArrowRight,
  Eye,
  CheckCircle2,
  Building2,
  Film,
  Camera,
  Play
} from 'lucide-react';
import {
  cameraTheatreObj,
  buildingTheatreObj,
  lightingTheatreObj,
  setTheatreSequencePosition,
  playTheatreSequence
} from '../utils/theatreAnimation';

/**
 * Procedural 3D Villa Model for R3F integrated with Theatre.js Animation Sheet
 */
function VillaModel({ scrollProgress, theatreVals }) {
  const groupRef = useRef();

  // Color Palette Definitions (Sleek Dark Slate & Sapphire Blue)
  const brassColor = useMemo(() => new THREE.Color('#38BDF8'), []);
  const wallColor = useMemo(() => new THREE.Color('#1E293B'), []);
  const roofColor = useMemo(() => new THREE.Color('#0F172A'), []);
  const glassColor = useMemo(() => new THREE.Color('#60A5FA'), []);
  const poolColor = useMemo(() => new THREE.Color('#0284C7'), []);
  const treeColor = useMemo(() => new THREE.Color('#334155'), []);

  // Compute smooth material properties blending scrollProgress & Theatre.js values
  const wireOpacity = Math.max(0.1, (1.0 - scrollProgress * 0.8) * (theatreVals.building?.wireframeOpacity ?? 1));
  const solidOpacity = Math.min(1.0, Math.max(0.0, (scrollProgress - 0.2) * 2.5) * (theatreVals.building?.solidOpacity ?? 1));
  const lightIntensity = Math.min(1.8, Math.max(0.0, (scrollProgress - 0.4) * 3.5) * (theatreVals.lighting?.sunIntensity ?? 1));

  // Slow ambient rotation driven by scroll and Theatre rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      const extraRot = theatreVals.building?.rotationY || 0;
      groupRef.current.rotation.y = scrollProgress * Math.PI * 0.4 + extraRot + delta * 0.05;
      const targetScale = theatreVals.building?.scale || 1;
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 1. GROUND & LANDSCAPING */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.5, 0.2, 32]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.9}
          transparent
          opacity={solidOpacity}
        />
      </mesh>
      <lineSegments position={[0, -0.1, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(7, 7.5, 0.2, 16)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity * 0.5} />
      </lineSegments>

      {/* Infinity Pool */}
      <mesh position={[2.5, 0.02, 2]} receiveShadow>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial
          color={poolColor}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={solidOpacity * 0.9}
        />
      </mesh>
      <lineSegments position={[2.5, 0.02, 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 0.1, 2)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity} />
      </lineSegments>

      {/* Foliage */}
      {[-4.5, -3.8, 4.2, 4.8].map((x, i) => (
        <group key={i} position={[x, 0.8, (i % 2 === 0 ? -3 : 3)]}>
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.7, 1.6, 6]} />
            <meshStandardMaterial color={treeColor} transparent opacity={solidOpacity} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.ConeGeometry(0.7, 1.6, 6)]} />
            <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity * 0.6} />
          </lineSegments>
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 6]} />
            <meshStandardMaterial color="#1E293B" transparent opacity={solidOpacity} />
          </mesh>
        </group>
      ))}

      {/* 2. MAIN BUILDING STRUCTURE */}
      <mesh position={[-0.5, 0.8, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 1.6, 3.5]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={solidOpacity}
        />
      </mesh>
      <lineSegments position={[-0.5, 0.8, -0.5]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4.5, 1.6, 3.5)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity} linewidth={1.5} />
      </lineSegments>

      {/* Master Suite Cantilever Block */}
      <mesh position={[0.5, 2.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.4, 3.8]} />
        <meshStandardMaterial
          color={roofColor}
          roughness={0.3}
          metalness={0.3}
          transparent
          opacity={solidOpacity}
        />
      </mesh>
      <lineSegments position={[0.5, 2.3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4.8, 1.4, 3.8)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity} linewidth={2} />
      </lineSegments>

      {/* Roof Slab */}
      <mesh position={[0.5, 3.1, 0]}>
        <boxGeometry args={[5.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.2} transparent opacity={solidOpacity} />
      </mesh>
      <lineSegments position={[0.5, 3.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(5.2, 0.2, 4.2)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity} />
      </lineSegments>

      {/* Pillars */}
      {[-2.5, 2.5].map((x, idx) => (
        <mesh key={idx} position={[x, 0.8, 1.5]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 12]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.8} roughness={0.2} transparent opacity={solidOpacity} />
        </mesh>
      ))}

      {/* 3. GLASS & INTERIOR LIGHTING */}
      <mesh position={[0.5, 2.3, 1.92]}>
        <planeGeometry args={[4.4, 1.2]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.8}
          opacity={solidOpacity * 0.85}
          transparent
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      <pointLight position={[0.5, 2.3, 0.5]} intensity={lightIntensity * 2.5} color="#38BDF8" distance={7} />
      <pointLight position={[-0.5, 0.8, 0]} intensity={lightIntensity * 2} color="#60A5FA" distance={6} />

      {/* 4. BLUEPRINT CALLOUT ANNOTATIONS */}
      {scrollProgress < 0.65 && (
        <>
          <Html position={[-2.6, 2.5, 1.8]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#1E293B]/90 backdrop-blur-md border border-sky-500/40 px-3 py-1.5 rounded-lg text-[10px] text-white font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>3,800 SQ.FT LIVING</span>
            </div>
          </Html>

          <Html position={[2.6, 2.9, -0.5]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#1E293B]/90 backdrop-blur-md border border-sky-500/40 px-3 py-1.5 rounded-lg text-[10px] text-white font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>CANTILEVER MASTER SUITE</span>
            </div>
          </Html>

          <Html position={[2.5, 0.2, 2.2]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#1E293B]/90 backdrop-blur-md border border-sky-500/40 px-3 py-1.5 rounded-lg text-[10px] text-white font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>HEATED INFINITY POOL</span>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

/**
 * Camera Controller driven by Theatre.js camera object & scroll progress
 */
function CameraController({ scrollProgress, theatreVals }) {
  useFrame(({ camera }) => {
    let targetX, targetY, targetZ;

    if (scrollProgress < 0.25) {
      const p = scrollProgress / 0.25;
      targetX = Math.sin(p * 0.4) * 2;
      targetY = (theatreVals.camera?.height || 2.0) + p * 0.5;
      targetZ = (theatreVals.camera?.dist || 8.5) - p * 0.5;
    } else if (scrollProgress < 0.65) {
      const p = (scrollProgress - 0.25) / 0.4;
      targetX = 2 + p * 4;
      targetY = 2.5 + p * 2.5;
      targetZ = 8 - p * 1.5;
    } else {
      const p = (scrollProgress - 0.65) / 0.35;
      targetX = 6 + p * 2.5;
      targetY = 5.0 + p * 2.5;
      targetZ = 6.5 + p * 4.5;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

    camera.lookAt(0, 1.2, 0);
  });

  return null;
}

export default function HeroBlueprintReveal({ onOpenBooking, onSelectProperty }) {
  const containerRef = useRef(null);
  const [scrollProgVal, setScrollProgVal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activePreset, setActivePreset] = useState('Blueprint');

  // Theatre.js Live Keyframe Values State
  const [theatreVals, setTheatreVals] = useState({
    camera: { dist: 8.5, rotX: 0.35, rotY: 0.85, height: 2.0 },
    building: { revealProgress: 0.2, scale: 1, rotationY: 0, wireframeOpacity: 0.8, solidOpacity: 0.9 },
    lighting: { sunIntensity: 1.8 }
  });

  // Measure Scroll Progress over 300vh sticky track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    checkMobile();
    checkMotion();
    window.addEventListener('resize', checkMobile);

    const unsubscribe = smoothProgress.on('change', (latest) => {
      setScrollProgVal(latest);
      // Map scroll progress to Theatre sequence timeline
      setTheatreSequencePosition(latest * 5);
    });

    // Listen to Theatre.js values changes
    const unsubCam = cameraTheatreObj.onValuesChange((v) => setTheatreVals((prev) => ({ ...prev, camera: v })));
    const unsubBldg = buildingTheatreObj.onValuesChange((v) => setTheatreVals((prev) => ({ ...prev, building: v })));
    const unsubLight = lightingTheatreObj.onValuesChange((v) => setTheatreVals((prev) => ({ ...prev, lighting: v })));

    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubscribe();
      unsubCam();
      unsubBldg();
      unsubLight();
    };
  }, [smoothProgress]);

  // Handle Preset Camera Keyframe Selection
  const handleSelectPreset = (presetName, seqPos) => {
    setActivePreset(presetName);
    setTheatreSequencePosition(seqPos);
  };

  // Transform values for text overlay transitions
  const p1Opacity = useTransform(smoothProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const p1Y = useTransform(smoothProgress, [0, 0.25], [0, -40]);

  const p2Opacity = useTransform(smoothProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const p2Y = useTransform(smoothProgress, [0.25, 0.35, 0.55, 0.65], [40, 0, 0, -40]);

  const p3Opacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const p3Y = useTransform(smoothProgress, [0.65, 0.75], [40, 0]);

  const ctaOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#0F172A] text-[#F8FAFC] font-sans">
      
      {/* STICKY FULL-VIEWPORT CANVAS CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-8 border-b border-slate-700/60">

        {/* BACKGROUND 3D CANVAS OR MOBILE / REDUCED MOTION FALLBACK */}
        <div className="absolute inset-0 z-0">
          {!isMobile && !reducedMotion ? (
            <Canvas
              shadows
              camera={{ position: [0, 2, 8.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <color attach="background" args={['#0F172A']} />
              <fog attach="fog" args={['#0F172A', 8, 24]} />

              {/* Lighting Setup */}
              <ambientLight intensity={0.7} />
              <directionalLight
                position={[15, 25, 10]}
                intensity={theatreVals.lighting?.sunIntensity || 1.8}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight position={[-6, 8, -4]} intensity={0.5} color="#38BDF8" />

              {/* 3D Villa Scene */}
              <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
                <VillaModel scrollProgress={scrollProgVal} theatreVals={theatreVals} />
              </Float>

              {/* Camera Controller */}
              <CameraController scrollProgress={scrollProgVal} theatreVals={theatreVals} />
            </Canvas>
          ) : (
            <div className="relative w-full h-full bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-6">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80')`,
                  filter: `grayscale(${Math.max(0, 1 - scrollProgVal * 1.5)}) brightness(${0.4 + scrollProgVal * 0.4})`
                }}
              />
            </div>
          )}
        </div>

        {/* TOP STATUS BAR & THEATRE.JS PRESET BUTTONS */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-16 sm:pt-20">
          
          <div className="flex items-center gap-3 bg-[#1E293B]/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/60 shadow-xl">
            <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-200">
              THEATRE.JS CINEMATIC BLUEPRINT
            </span>
          </div>

          {/* Theatre Preset Buttons */}
          <div className="flex items-center gap-2 bg-[#1E293B]/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 font-mono text-xs shadow-xl">
            <span className="px-2.5 py-1 text-[10px] text-sky-400 font-bold flex items-center gap-1">
              <Film className="w-3 h-3" />
              Presets:
            </span>

            {[
              { name: 'Blueprint', pos: 0 },
              { name: 'Structure', pos: 2.5 },
              { name: 'Full Render', pos: 4.8 }
            ].map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p.name, p.pos)}
                className={`px-3 py-1 rounded-xl transition-all text-[11px] ${
                  activePreset === p.name
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

        </div>

        {/* CENTER CONTENT OVERLAYS */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex-grow flex items-center justify-center my-auto">
          
          {/* PHASE 1 OVERLAY */}
          <motion.div
            style={{ opacity: p1Opacity, y: p1Y }}
            className="text-center max-w-3xl space-y-6 pointer-events-none px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              THEATRE.JS ANIMATED ARCHITECTURE
            </div>

            <h1 className="font-serif-fraunces text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Where Vision Materializes Into <span className="text-sky-400 italic">Pure Living</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
              Experience dynamic keyframe timelines as an ultra-luxury Madurai villa transitions from raw 3D blueprint vectors into fully rendered architectural perfection.
            </p>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs font-mono text-sky-400">
              <span>SCROLL TO CONSTRUCT</span>
              <span className="animate-bounce">↓</span>
            </div>
          </motion.div>

          {/* PHASE 2 OVERLAY */}
          <motion.div
            style={{ opacity: p2Opacity, y: p2Y }}
            className="text-center max-w-2xl space-y-6 pointer-events-none px-4"
          >
            <div className="bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700/80 p-6 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  FACADE MATERIALIZATION PIPELINE
                </span>
                <span>{Math.round(scrollProgVal * 100)}% COMPLETE</span>
              </div>

              <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-blue-600 to-sky-400 h-full transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgVal * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-left pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">SLAB EXTRUSION</span>
                  <span className="font-bold text-sky-400">450mm Reinforced</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">FACADE GLASS</span>
                  <span className="font-bold text-white">Low-E Triple Glazed</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">SOLAR GRID</span>
                  <span className="font-bold text-sky-400">12.5 kW Integrated</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PHASE 3 OVERLAY */}
          <motion.div
            style={{ opacity: p3Opacity, y: p3Y }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto px-4"
          >
            <div className="bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl space-y-4 shadow-2xl">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-400">
                THE GRAND ROYALE VILLA
              </span>
              <h3 className="font-serif-fraunces text-2xl font-bold text-white">
                3,800 Sq.Ft Italian Modern Architecture
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Featuring 4 Master Suites, private heated infinity pool, smart home automation, and 24/7 biometric security.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="bg-[#0F172A]/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">LOCATION</span>
                  <span className="font-semibold text-white">Anna Nagar, Madurai</span>
                </div>
                <div className="bg-[#0F172A]/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">INVESTMENT PRICE</span>
                  <span className="font-bold text-sky-400">₹1.85 Cr</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl space-y-4 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-400">
                  SUSTAINABLE LUXURY FEATURES
                </span>
                <h4 className="font-serif-fraunces text-xl font-bold text-white mt-1">
                  Private Infinity Pool & Sky Terrace
                </h4>
                
                <ul className="mt-3 space-y-2 text-xs text-slate-300 font-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>DTCP & RERA Approved Master Planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>18.4% Projected Annual Capital Appreciation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Italian Marble Flooring & Concealed Smart Grid</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>RERA ID: TN/01/2026/982</span>
                <span className="text-sky-400 font-bold">READY FOR POSSESSION</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM CTA BAR */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-t border-slate-800 pt-4"
        >
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 font-mono block">READY TO EXPERIENCE THIS ESTATE?</span>
            <span className="font-serif-fraunces font-bold text-lg text-white">Schedule an Exclusive Private Tour</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <span>Book VIP Site Visit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onSelectProperty && (
              <button
                onClick={() => onSelectProperty({ title: 'The Grand Royale Estate', slug: 'grand-royale-estate' })}
                className="flex-1 sm:flex-initial bg-[#1E293B] hover:bg-slate-800 text-white border border-slate-700 font-semibold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Explore Details</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
