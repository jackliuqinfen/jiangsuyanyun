
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Gift, Award } from 'lucide-react';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion component for TS
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionButton = motion.button as any;

const AnniversaryPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(storageService.getSettings());
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);
  
  // Fireworks System Refs
  const fireworksRef = useRef<any[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Unique session key to ensure it only shows once per session unless settings change
  const SESSION_KEY = 'yanyun_anniversary_oriental_v8';

  useEffect(() => {
    // 1. Check Global Settings from Storage
    const currentSettings = storageService.getSettings();
    setSettings(currentSettings); // Update local state for text binding
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    
    // Only open if enabled in Admin -> Settings AND hasn't been seen in this session
    if (currentSettings.enableAnniversary && !hasSeen) {
       // Small delay for better UX upon page load
       const timer = setTimeout(() => setIsOpen(true), 1500); 
       return () => clearTimeout(timer);
    }

    // Listener for real-time preview from Admin Panel
    const handleSettingsChange = () => {
       const newSettings = storageService.getSettings();
       setSettings(newSettings);
       if (newSettings.enableAnniversary) {
          sessionStorage.removeItem(SESSION_KEY); // Reset seen state for preview
          setIsOpen(true);
       } else {
          setIsOpen(false);
       }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    // Background: Deep dark red/purple blend for night sky feel
    scene.fog = new THREE.FogExp2(0x1a0505, 0.002); 
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); 
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- TEXTURES ---
    const getParticleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 32, 32);
        }
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };
    const particleTexture = getParticleTexture();

    // --- 1. AMBIENT PARTICLES (Rising Gold Dust) ---
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = [];
    const dustSpeeds = [];
    
    for(let i=0; i<dustCount; i++) {
        dustPos.push((Math.random() - 0.5) * 300);
        dustPos.push((Math.random() - 0.5) * 200);
        dustPos.push((Math.random() - 0.5) * 150);
        dustSpeeds.push(0.02 + Math.random() * 0.05);
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
    
    const dustMat = new THREE.PointsMaterial({
        color: 0xFFD700, // Gold
        size: 1.5,
        map: particleTexture,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);
    particlesRef.current = dustSystem;

    // --- 2. FIREWORKS ENGINE ---
    const vibrantColors = [
        new THREE.Color(0xFF00FF), // Neon Magenta
        new THREE.Color(0x00FFFF), // Cyan
        new THREE.Color(0x00FF00), // Lime Green
        new THREE.Color(0xFFDD00), // Bright Gold
        new THREE.Color(0xFF4500), // Orange Red
        new THREE.Color(0x9D00FF), // Electric Purple
    ];

    const createFirework = () => {
        // Start much lower to simulate launch from ground
        const x = (Math.random() - 0.5) * 180;
        const y = -120; 
        const targetY = 20 + Math.random() * 50; // Explode in the upper half
        
        const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, 0]), 3));
        
        const material = new THREE.PointsMaterial({
            size: 3, // Rocket head size
            color: color,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 1
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        return {
            mesh: points,
            phase: 'launch',
            velocity: new THREE.Vector3(0, 3.5 + Math.random() * 1.5, 0), // Higher launch velocity
            targetY: targetY,
            color: color,
            age: 0,
            velocities: [] as any[]
        };
    };

    const explodeFirework = (fw: any) => {
        scene.remove(fw.mesh);
        fw.mesh.geometry.dispose();
        
        const particleCount = 150 + Math.floor(Math.random() * 100);
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const launchPos = fw.mesh.geometry.attributes.position.array;
        
        const velocities = [];

        for(let i=0; i<particleCount; i++) {
            positions[i*3] = launchPos[0];
            positions[i*3+1] = launchPos[1];
            positions[i*3+2] = launchPos[2];

            // Explosion pattern: Sphere with random magnitude
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const speed = 0.8 + Math.random() * 2.0; // Higher explosive speed
            
            velocities.push({
                x: speed * Math.sin(phi) * Math.cos(theta),
                y: speed * Math.sin(phi) * Math.sin(theta),
                z: speed * Math.cos(phi)
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            size: 2.5,
            color: fw.color,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 1
        });

        const explosionMesh = new THREE.Points(geo, mat);
        scene.add(explosionMesh);

        fw.mesh = explosionMesh;
        fw.phase = 'explode';
        fw.velocities = velocities;
        fw.age = 0;
    };

    // --- ANIMATION LOOP ---
    let frameCount = 0;
    const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        frameCount++;

        // Launch frequency
        if (frameCount % 40 === 0 && fireworksRef.current.length < 12) {
            fireworksRef.current.push(createFirework());
        }

        // Ambient Particles Rising
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for(let i=0; i<dustCount; i++) {
                positions[i*3+1] += dustSpeeds[i];
                if (positions[i*3+1] > 80) positions[i*3+1] = -80;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Fireworks Update
        for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
            const fw = fireworksRef.current[i];

            if (fw.phase === 'launch') {
                const positions = fw.mesh.geometry.attributes.position.array;
                positions[1] += fw.velocity.y;
                
                // Slow down slightly as it reaches apex, but mostly keep momentum for "high energy" feel
                fw.velocity.y *= 0.98; 
                fw.mesh.geometry.attributes.position.needsUpdate = true;

                // Scale down size as it goes up (perspective trick)
                fw.mesh.material.size = Math.max(1, fw.mesh.material.size * 0.99);

                if (positions[1] >= fw.targetY || fw.velocity.y < 0.5) {
                    explodeFirework(fw);
                }
            } else if (fw.phase === 'explode') {
                fw.age++;
                const positions = fw.mesh.geometry.attributes.position.array;
                
                for(let j=0; j<fw.velocities.length; j++) {
                    positions[j*3] += fw.velocities[j].x;
                    positions[j*3+1] += fw.velocities[j].y;
                    positions[j*3+2] += fw.velocities[j].z;
                    
                    fw.velocities[j].y -= 0.02; // Gravity
                    fw.velocities[j].x *= 0.96; // Air resistance
                    fw.velocities[j].y *= 0.96;
                    fw.velocities[j].z *= 0.96;
                }
                fw.mesh.geometry.attributes.position.needsUpdate = true;
                
                // Fade out
                fw.mesh.material.opacity = Math.max(0, 1 - (fw.age / 80));
                
                if (fw.age > 80) {
                    scene.remove(fw.mesh);
                    fw.mesh.geometry.dispose();
                    fw.mesh.material.dispose();
                    fireworksRef.current.splice(i, 1);
                }
            }
        }

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameIdRef.current);
        if (rendererRef.current) {
            rendererRef.current.dispose();
            containerRef.current?.removeChild(rendererRef.current.domElement);
        }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center font-sans"
          style={{ 
              background: 'radial-gradient(circle at center, #2b0a0a 0%, #000000 100%)' 
          }}
      >
        {/* Background Animation (Three.js) */}
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />
        
        {/* Main Card */}
        <MotionDiv 
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
            className="relative z-10 w-[90%] max-w-[480px]"
        >
           {/* Card Container: Deep Blur Glass with Red Glow */}
           <div className="absolute inset-0 bg-red-950/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_0_60px_-15px_rgba(220,38,38,0.3)]"></div>
           
           {/* Decorative Border (Double Line - Premium Print Style) */}
           <div className="absolute inset-3 border border-yellow-500/30 rounded-2xl pointer-events-none"></div>
           <div className="absolute inset-4 border border-dashed border-yellow-500/10 rounded-xl pointer-events-none"></div>

           {/* Inner Content */}
           <div className="relative p-10 text-center flex flex-col items-center">
                
                {/* Top Badge */}
                <MotionDiv 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-800/50 to-red-900/50 border border-yellow-500/30 mb-8"
                >
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-100 tracking-widest">{settings.anniversaryBadgeLabel || '2017 - 2025'}</span>
                </MotionDiv>

                {/* The "8" Composition */}
                <div className="relative mb-6 w-full flex justify-center items-center py-4">
                    {/* Glowing Aura behind number */}
                    <div className="absolute w-40 h-40 bg-yellow-600/20 blur-[50px] rounded-full animate-pulse"></div>
                    
                    <MotionH1 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.4 }}
                        className="text-[160px] leading-none font-serif font-medium relative z-10"
                        style={{ 
                            background: 'linear-gradient(180deg, #FFF8E7 0%, #FFD700 45%, #E6B800 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 10px 30px rgba(255, 215, 0, 0.2))'
                        }}
                    >
                        8
                    </MotionH1>
                    
                    {/* Floating Text Overlay */}
                    <MotionDiv 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="absolute bottom-6 right-[15%] bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg border border-red-400 rotate-[-5deg]"
                    >
                        周年庆典
                    </MotionDiv>
                </div>

                {/* Headings - Chinese Typography */}
                <div className="space-y-3 mb-10">
                    <MotionH1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-3xl font-serif font-bold text-white tracking-widest"
                    >
                        {settings.anniversaryTitle || '辉煌八载 · 智绘未来'}
                    </MotionH1>
                    
                    <MotionP 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm text-yellow-100/60 font-light tracking-wider"
                    >
                        {settings.anniversarySubtitle || '感恩一路同行，共鉴品质工程'}
                    </MotionP>
                </div>

                {/* Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mb-10"></div>

                {/* CTA Button */}
                <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="group relative w-full py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl shadow-lg shadow-yellow-900/40 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2 font-bold tracking-[0.2em] text-sm">
                        <Gift size={16} /> 开启新篇章
                    </span>
                </MotionButton>

                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <X size={20} />
                </button>
           </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};

export default AnniversaryPopup;