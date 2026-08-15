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
  Building2
} from 'lucide-react';

/**
 * Procedural 3D Villa Model for R3F
 * Constructs both glowing brass wireframe linework & solid materials
 * transitionable via scroll progress (0.0 to 1.0)
 */
function VillaModel({ scrollProgress }) {
  const groupRef = useRef();

  // Color Palette Definitions (Strictly Forest & Brass)
  const brassColor = useMemo(() => new THREE.Color('#B08D57'), []);
  const wallColor = useMemo(() => new THREE.Color('#1E2E25'), []);
  const roofColor = useMemo(() => new THREE.Color('#141F19'), []);
  const glassColor = useMemo(() => new THREE.Color('#7A9E84'), []);
  const poolColor = useMemo(() => new THREE.Color('#3A6658'), []);
  const treeColor = useMemo(() => new THREE.Color('#364E3E'), []);

  // Compute smooth material properties based on scroll phase
  // Phase 1 (0-0.25): Pure wireframe
  // Phase 2 (0.25-0.65): Solid extrudes & material opacity ramps up
  // Phase 3 (0.65-1.0): Complete villa with warm light
  const wireOpacity = Math.max(0.2, 1.0 - scrollProgress * 0.8);
  const solidOpacity = Math.min(1.0, Math.max(0.0, (scrollProgress - 0.2) * 2.5));
  const lightIntensity = Math.min(1.5, Math.max(0.0, (scrollProgress - 0.4) * 3.5));

  // Slow ambient rotation driven by scroll
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 0.4 + delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 1. GROUND & LANDSCAPING */}
      {/* Lawn Base */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.5, 0.2, 32]} />
        <meshStandardMaterial
          color="#121B15"
          roughness={0.9}
          transparent
          opacity={solidOpacity}
        />
      </mesh>
      {/* Ground Wireframe Ring */}
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

      {/* Low-Poly Trees / Foliage */}
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
            <meshStandardMaterial color="#2E2117" transparent opacity={solidOpacity} />
          </mesh>
        </group>
      ))}

      {/* 2. MAIN BUILDING STRUCTURE */}
      {/* Ground Floor Main Block */}
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

      {/* First Floor Cantilevered Master Suite */}
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

      {/* Floor Overhang Roof Slab */}
      <mesh position={[0.5, 3.1, 0]}>
        <boxGeometry args={[5.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#0A120D" roughness={0.2} transparent opacity={solidOpacity} />
      </mesh>
      <lineSegments position={[0.5, 3.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(5.2, 0.2, 4.2)]} />
        <lineBasicMaterial color={brassColor} transparent opacity={wireOpacity} />
      </lineSegments>

      {/* Architectural Pillars / Support Columns */}
      {[-2.5, 2.5].map((x, idx) => (
        <mesh key={idx} position={[x, 0.8, 1.5]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 12]} />
          <meshStandardMaterial color="#B08D57" metalness={0.8} roughness={0.2} transparent opacity={solidOpacity} />
        </mesh>
      ))}

      {/* 3. GLASS WINDOW PANELS & INTERIOR LIGHTING */}
      {/* Front Glass Facade */}
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
      {/* Ground Glass Sliding Doors */}
      <mesh position={[-0.5, 0.8, 1.28]}>
        <planeGeometry args={[4.2, 1.4]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.8}
          opacity={solidOpacity * 0.8}
          transparent
          roughness={0.1}
        />
      </mesh>

      {/* Warm Interior Emissive Lights */}
      <pointLight position={[0.5, 2.3, 0.5]} intensity={lightIntensity * 2} color="#FFD18C" distance={6} />
      <pointLight position={[-0.5, 0.8, 0]} intensity={lightIntensity * 1.5} color="#FFB85C" distance={5} />

      {/* Interior Emissive Glow Cubes */}
      <mesh position={[0.5, 2.3, 0.2]}>
        <boxGeometry args={[4.0, 1.0, 3.0]} />
        <meshBasicMaterial color="#FFD18C" transparent opacity={solidOpacity * 0.25} />
      </mesh>

      {/* 4. 3D BLUEPRINT CALLOUT ANNOTATIONS */}
      {scrollProgress < 0.65 && (
        <>
          <Html position={[-2.6, 2.5, 1.8]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#16231C]/90 backdrop-blur-md border border-[#B08D57]/40 px-3 py-1.5 rounded-lg text-[10px] text-[#EFEAE1] font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] animate-pulse" />
              <span>3,800 SQ.FT LIVING</span>
            </div>
          </Html>

          <Html position={[2.6, 2.9, -0.5]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#16231C]/90 backdrop-blur-md border border-[#B08D57]/40 px-3 py-1.5 rounded-lg text-[10px] text-[#EFEAE1] font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C7A63]" />
              <span>CANTILEVER MASTER SUITE</span>
            </div>
          </Html>

          <Html position={[2.5, 0.2, 2.2]} distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-[#16231C]/90 backdrop-blur-md border border-[#B08D57]/40 px-3 py-1.5 rounded-lg text-[10px] text-[#EFEAE1] font-mono tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
              <span>HEATED INFINITY POOL</span>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

/**
 * Camera Controller linking scroll position to camera translation & tilt
 */
function CameraController({ scrollProgress }) {
  useFrame(({ camera }) => {
    // Phase 1 (0-0.25): Floating front wireframe view
    // Phase 2 (0.25-0.65): Orbit around structure
    // Phase 3 (0.65-1.0): Pull back and tilt down to view full property
    let targetX, targetY, targetZ;

    if (scrollProgress < 0.25) {
      const p = scrollProgress / 0.25;
      targetX = Math.sin(p * 0.4) * 2;
      targetY = 2.0 + p * 0.5;
      targetZ = 8.5 - p * 0.5;
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

/**
 * Main 3D Hero Section Component: "The Blueprint Reveal"
 * Palette: Forest (#0D1410), Surface (#16231C), Accent Brass (#B08D57), Sage (#5C7A63), Linen Text (#EFEAE1)
 */
export default function HeroBlueprintReveal({ onOpenBooking, onSelectProperty }) {
  const containerRef = useRef(null);
  const [scrollProgVal, setScrollProgVal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkMotion = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkMotion();
    window.addEventListener('resize', checkMobile);

    const unsubscribe = smoothProgress.on('change', (latest) => {
      setScrollProgVal(latest);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubscribe();
    };
  }, [smoothProgress]);

  // Transform values for text overlay transitions
  const p1Opacity = useTransform(smoothProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const p1Y = useTransform(smoothProgress, [0, 0.25], [0, -40]);

  const p2Opacity = useTransform(smoothProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const p2Y = useTransform(smoothProgress, [0.25, 0.35, 0.55, 0.65], [40, 0, 0, -40]);

  const p3Opacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const p3Y = useTransform(smoothProgress, [0.65, 0.75], [40, 0]);

  const ctaOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#0D1410] text-[#EFEAE1] font-sans">
      
      {/* Dynamic Font Injection for Fraunces Serif Heading */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif-fraunces { font-family: 'Fraunces', serif; }
      `}</style>

      {/* STICKY FULL-VIEWPORT CANVAS CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-4 sm:p-8 border-b border-[#B08D57]/10">

        {/* BACKGROUND 3D CANVAS OR MOBILE / REDUCED MOTION FALLBACK */}
        <div className="absolute inset-0 z-0">
          {!isMobile && !reducedMotion ? (
            <Canvas
              shadows
              camera={{ position: [0, 2, 8.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <color attach="background" args={['#0D1410']} />
              <fog attach="fog" args={['#0D1410', 8, 22]} />

              {/* Lighting Setup */}
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[8, 12, 6]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#5C7A63" />

              {/* 3D Villa Scene */}
              <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
                <VillaModel scrollProgress={scrollProgVal} />
              </Float>

              {/* Camera Scroll Controller */}
              <CameraController scrollProgress={scrollProgVal} />
            </Canvas>
          ) : (
            /* MOBILE / REDUCED MOTION 2D PARALLAX FALLBACK */
            <div className="relative w-full h-full bg-gradient-to-b from-[#0D1410] via-[#16231C] to-[#0D1410] flex items-center justify-center p-6">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80')`,
                  filter: `grayscale(${Math.max(0, 1 - scrollProgVal * 1.5)}) brightness(${0.4 + scrollProgVal * 0.4})`
                }}
              />
              <div className="absolute inset-0 bg-radial from-transparent via-[#0D1410]/80 to-[#0D1410]" />
            </div>
          )}
        </div>

        {/* GRID OVERLAY BACKGROUND ACCENT */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #B08D57 1px, transparent 1px), linear-gradient(to bottom, #B08D57 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* TOP STATUS BAR OVERLAY */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-16 sm:pt-20">
          <div className="flex items-center gap-3 bg-[#16231C]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#B08D57]/30 shadow-xl">
            <Compass className="w-4 h-4 text-[#B08D57] animate-spin-slow" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#EFEAE1]">
              THE BLUEPRINT REVEAL
            </span>
          </div>

          {/* Phase Badge Gauge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#16231C]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#5C7A63]/40 text-xs font-mono text-[#5C7A63]">
            <Layers className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>
              {scrollProgVal < 0.25
                ? 'PHASE 01 // WIREFRAME ARCHITECTURE'
                : scrollProgVal < 0.65
                ? 'PHASE 02 // STRUCTURAL MATERIALIZATION'
                : 'PHASE 03 // COMPLETED ESTATE'}
            </span>
            <span className="ml-2 text-[#B08D57] font-bold">
              {Math.round(scrollProgVal * 100)}%
            </span>
          </div>
        </div>

        {/* CENTER CONTENT OVERLAYS - SCROLL DRIVEN BEATS */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex-grow flex items-center justify-center my-auto">
          
          {/* PHASE 1 OVERLAY (0 - 0.25): Wireframe Blueprint & Title */}
          <motion.div
            style={{ opacity: p1Opacity, y: p1Y }}
            className="text-center max-w-3xl space-y-6 pointer-events-none px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#B08D57]/10 border border-[#B08D57]/30 text-[#B08D57] text-[11px] uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              ARCHITECTURAL DRAFTING & CONCEPT
            </div>

            <h1 className="font-serif-fraunces text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#EFEAE1] tracking-tight leading-tight">
              Where Vision Materializes Into <span className="text-[#B08D57] italic">Pure Living</span>
            </h1>

            <p className="text-sm sm:text-base text-[#EFEAE1]/70 max-w-xl mx-auto font-light leading-relaxed">
              Scroll down to witness an ultra-luxury Madurai villa transition from raw 3D blueprint linework into fully rendered architectural perfection.
            </p>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs font-mono text-[#B08D57]">
              <span>SCROLL TO CONSTRUCT</span>
              <span className="animate-bounce">↓</span>
            </div>
          </motion.div>

          {/* PHASE 2 OVERLAY (0.25 - 0.65): Materialization Progress Readout */}
          <motion.div
            style={{ opacity: p2Opacity, y: p2Y }}
            className="text-center max-w-2xl space-y-6 pointer-events-none px-4"
          >
            <div className="bg-[#16231C]/90 backdrop-blur-xl border border-[#B08D57]/40 p-6 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-[#B08D57]">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  FACADE MATERIALIZATION PIPELINE
                </span>
                <span>{Math.round(scrollProgVal * 100)}% COMPLETE</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#0D1410] h-2 rounded-full overflow-hidden border border-[#B08D57]/20">
                <div
                  className="bg-gradient-to-r from-[#5C7A63] to-[#B08D57] h-full transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgVal * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-left pt-2 border-t border-white/5 text-[11px] font-mono text-[#EFEAE1]/80">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase">SLAB EXTRUSION</span>
                  <span className="font-bold text-[#B08D57]">450mm Reinforced</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase">FACADE GLASS</span>
                  <span className="font-bold text-[#EFEAE1]">Low-E Triple Glazed</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase">SOLAR GRID</span>
                  <span className="font-bold text-[#5C7A63]">12.5 kW Integrated</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PHASE 3 OVERLAY (0.65 - 1.0): Completed Estate Cards */}
          <motion.div
            style={{ opacity: p3Opacity, y: p3Y }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto px-4"
          >
            {/* Left Card: Property Specifications */}
            <div className="bg-[#16231C]/90 backdrop-blur-xl border border-[#B08D57]/30 p-6 rounded-3xl space-y-4 shadow-2xl">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#B08D57]">
                THE GRAND ROYALE VILLA
              </span>
              <h3 className="font-serif-fraunces text-2xl font-bold text-[#EFEAE1]">
                3,800 Sq.Ft Italian Modern Architecture
              </h3>
              <p className="text-xs text-[#EFEAE1]/70 leading-relaxed font-light">
                Featuring 4 Master Suites, private heated infinity pool, smart home automation, and 24/7 biometric security.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="bg-[#0D1410]/60 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-500 text-[10px] block">LOCATION</span>
                  <span className="font-semibold text-[#EFEAE1]">Anna Nagar, Madurai</span>
                </div>
                <div className="bg-[#0D1410]/60 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-500 text-[10px] block">INVESTMENT PRICE</span>
                  <span className="font-bold text-[#B08D57]">₹1.85 Cr</span>
                </div>
              </div>
            </div>

            {/* Right Card: High Yield & Key Highlights */}
            <div className="bg-[#16231C]/90 backdrop-blur-xl border border-[#B08D57]/30 p-6 rounded-3xl space-y-4 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#5C7A63]">
                  SUSTAINABLE LUXURY FEATURES
                </span>
                <h4 className="font-serif-fraunces text-xl font-bold text-[#EFEAE1] mt-1">
                  Private Infinity Pool & Sky Terrace
                </h4>
                
                <ul className="mt-3 space-y-2 text-xs text-[#EFEAE1]/80 font-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>DTCP & RERA Approved Master Planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>18.4% Projected Annual Capital Appreciation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>Italian Marble Flooring & Concealed Smart Grid</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>RERA ID: TN/01/2026/982</span>
                <span className="text-[#B08D57]">READY FOR POSSESSION</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM CALL TO ACTION BAR (AT SCROLL END) */}
        <motion.div
          style={{ opacity: ctaOpacity }}
          className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-t border-[#B08D57]/20 pt-4"
        >
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-400 font-mono block">READY TO EXPERIENCE THIS ESTATE?</span>
            <span className="font-serif-fraunces font-bold text-lg text-[#EFEAE1]">Schedule an Exclusive Private Tour</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="flex-1 sm:flex-initial bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-[#B08D57]/30 flex items-center justify-center gap-2"
            >
              <span>Book VIP Site Visit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onSelectProperty && (
              <button
                onClick={() => onSelectProperty({ title: 'The Grand Royale Estate', slug: 'grand-royale-estate' })}
                className="flex-1 sm:flex-initial bg-[#16231C] hover:bg-[#203127] text-[#EFEAE1] border border-[#B08D57]/40 font-semibold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#B08D57]" />
                <span>Explore Details</span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
