
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Gift, Award } from 'lucide-react';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionH2 = motion.h2 as any; 
const MotionP = motion.p as any;
const MotionButton = motion.button as any;

const AnniversaryPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(storageService.getSettingsSync());
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);
  
  const fireworksRef = useRef<any[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);

  const SESSION_KEY = 'yanyun_anniversary_v8_final_branded';

  useEffect(() => {
    const currentSettings = storageService.getSettingsSync();
    setSettings(currentSettings); 
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    
    // Only trigger if enabled and not seen in this session
    if (currentSettings.enableAnniversary && !hasSeen) {
       const timer = setTimeout(() => setIsOpen(true), 1200); 
       return () => clearTimeout(timer);
    }

    const handleSettingsChange = () => {
       const newSettings = storageService.getSettingsSync();
       setSettings(newSettings);
       if (newSettings.enableAnniversary) {
          sessionStorage.removeItem(SESSION_KEY);
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

    // Three.js Fireworks logic
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0505, 0.002); 
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = [];
    const dustSpeeds = [];
    for(let i=0; i<dustCount; i++) {
        dustPos.push((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 200);
        dustSpeeds.push(0.04 + Math.random() * 0.08);
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xFFD700, size: 1.5, transparent: true, opacity: 0.3 });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);
    particlesRef.current = dustSystem;

    const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for(let i=0; i<dustCount; i++) {
                positions[i*3+1] += dustSpeeds[i];
                if (positions[i*3+1] > 150) positions[i*3+1] = -150;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
          className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center font-sans"
          style={{ background: 'radial-gradient(circle at center, #2b0a0a 0%, #000000 100%)' }}
      >
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" />
        
        <MotionDiv 
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
            className="relative z-10 w-[94%] max-w-[500px]"
        >
           {/* Card Background: Oriental Red Glass */}
           <div className="absolute inset-0 bg-red-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_-20px_rgba(220,38,38,0.4)]"></div>
           
           {/* Visual Flourish */}
           <div className="absolute inset-4 border border-yellow-500/20 rounded-[2.5rem] pointer-events-none"></div>
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full blur-[40px] opacity-30"></div>

           <div className="relative p-10 md:p-14 text-center flex flex-col items-center">
                
                {/* FULL COMPANY NAME AS REQUESTED */}
                <MotionH2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-400 to-amber-500 text-lg md:text-xl font-black tracking-widest mb-6 font-serif uppercase"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))' }}
                >
                    江苏盐韵工程项目管理有限公司
                </MotionH2>

                {/* Badge */}
                <MotionDiv 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-900/60 border border-yellow-500/30 mb-8 shadow-inner"
                >
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-[10px] font-black text-yellow-100 tracking-[0.2em] uppercase">8th Anniversary Celebration</span>
                </MotionDiv>

                {/* Celebration "8" */}
                <div className="relative mb-10">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-[70px] rounded-full animate-pulse"></div>
                    <MotionH1 
                        initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 80, delay: 0.5 }}
                        className="text-[180px] leading-none font-serif font-medium relative z-10 select-none"
                        style={{ 
                            background: 'linear-gradient(180deg, #FFF8E7 0%, #FFD700 45%, #E6B800 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 20px 50px rgba(255, 215, 0, 0.4))'
                        }}
                    >
                        8
                    </MotionH1>
                    <MotionDiv 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="absolute bottom-10 right-0 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg shadow-2xl border border-red-400 rotate-[-4deg]"
                    >
                        周年庆典
                    </MotionDiv>
                </div>

                {/* SLOGAN AS REQUESTED */}
                <div className="space-y-4 mb-14">
                    <MotionH1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-3xl md:text-4xl font-serif font-black text-white tracking-[0.2em]"
                    >
                        {settings.anniversaryTitle || '"盐"续匠心，"韵"致八载'}
                    </MotionH1>
                    
                    <MotionP 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-sm text-yellow-100/60 font-medium tracking-[0.3em] uppercase"
                    >
                        {settings.anniversarySubtitle || '感恩一路同行，共鉴品质工程'}
                    </MotionP>
                </div>

                {/* CTA Button */}
                <MotionButton
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(234, 179, 8, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="relative w-full py-4.5 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-800 text-white rounded-2xl font-black tracking-[0.3em] text-sm shadow-2xl shadow-black/40 flex items-center justify-center gap-3 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                    <Gift size={18} className="relative z-10" /> 
                    <span className="relative z-10">开启盐韵新篇章</span>
                </MotionButton>

                {/* Close */}
                <button 
                    onClick={handleClose}
                    className="absolute top-8 right-8 p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <X size={26} />
                </button>
           </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};

export default AnniversaryPopup;
