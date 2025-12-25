
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Gift, Award } from 'lucide-react';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion component for TS
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
  
  // Fireworks System Refs
  const fireworksRef = useRef<any[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Unique session key to ensure it only shows once per session unless settings change
  const SESSION_KEY = 'yanyun_anniversary_v8_final';

  useEffect(() => {
    // 1. Check Global Settings from Storage
    const currentSettings = storageService.getSettingsSync();
    setSettings(currentSettings); 
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    
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

    // Rising Gold Dust
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = [];
    const dustSpeeds = [];
    for(let i=0; i<dustCount; i++) {
        dustPos.push((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 200);
        dustSpeeds.push(0.05 + Math.random() * 0.1);
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xFFD700, size: 1.2, transparent: true, opacity: 0.4 });
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
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.1 }}
            className="relative z-10 w-[92%] max-w-[480px]"
        >
           {/* Glassmorphism Card */}
           <div className="absolute inset-0 bg-red-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(220,38,38,0.5)]"></div>
           
           {/* Decorative Elements */}
           <div className="absolute inset-4 border border-yellow-500/20 rounded-[2rem] pointer-events-none"></div>

           <div className="relative p-12 text-center flex flex-col items-center">
                {/* FULL COMPANY NAME */}
                <MotionH2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-lg md:text-xl font-bold tracking-[0.1em] mb-4 drop-shadow-lg"
                >
                    江苏盐韵工程项目管理有限公司
                </MotionH2>

                {/* Badge */}
                <MotionDiv 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/50 border border-yellow-500/30 mb-8"
                >
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-[10px] font-black text-yellow-100 tracking-widest uppercase">Eight Year Anniversary</span>
                </MotionDiv>

                {/* Big Number */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full animate-pulse"></div>
                    <MotionH1 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.5 }}
                        className="text-[160px] leading-none font-serif font-medium relative z-10"
                        style={{ 
                            background: 'linear-gradient(180deg, #FFF8E7 0%, #FFD700 45%, #E6B800 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 15px 40px rgba(255, 215, 0, 0.3))'
                        }}
                    >
                        8
                    </MotionH1>
                    <MotionDiv 
                        initial={{ opacity: 0, rotate: 10 }}
                        animate={{ opacity: 1, rotate: -5 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-6 right-0 bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded shadow-2xl border border-red-400"
                    >
                        周年庆典
                    </MotionDiv>
                </div>

                {/* Slogan */}
                <div className="space-y-4 mb-12">
                    <MotionH1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-3xl md:text-4xl font-serif font-bold text-white tracking-[0.15em]"
                    >
                        {settings.anniversaryTitle || '"盐"续匠心，"韵"致八载'}
                    </MotionH1>
                    
                    <MotionP 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-sm text-yellow-100/50 font-light tracking-[0.2em]"
                    >
                        {settings.anniversarySubtitle || '感恩一路同行，共鉴品质工程'}
                    </MotionP>
                </div>

                {/* CTA Button */}
                <MotionButton
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(234, 179, 8, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="relative w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 text-white rounded-2xl font-black tracking-[0.3em] text-sm shadow-2xl shadow-yellow-900/50 flex items-center justify-center gap-3 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Gift size={18} /> 开启盐韵新篇
                </MotionButton>

                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <X size={24} />
                </button>
           </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
};

export default AnniversaryPopup;
