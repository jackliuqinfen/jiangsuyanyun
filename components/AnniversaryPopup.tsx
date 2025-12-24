
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';

// --- Visual Components ---

// 1. Firework Particle Engine (Enhanced for "Delicate" & "Many" effect)
const FireworkParticle: React.FC<{ delay: number; x: string; y: string; color: string }> = ({ delay, x, y, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 0.8, 0.5],
      x: [0, (Math.random() - 0.5) * 300], // Increased spread
      y: [0, (Math.random() - 0.5) * 300],
    }}
    transition={{
      duration: 2,
      delay: delay,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: Math.random() * 2 // More frequent repeats
    }}
    style={{ left: x, top: y, backgroundColor: color, boxShadow: `0 0 10px 2px ${color}` }}
    className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
  />
);

const BackgroundFireworks = () => {
  // Increased burst count significantly
  const bursts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: `${Math.random() * 90 + 5}%`,
    y: `${Math.random() * 90 + 5}%`,
    color: ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#A78BFA', '#FB7185'][Math.floor(Math.random() * 6)],
    delay: Math.random() * 3
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bursts.map(burst => (
        <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
           {/* More particles per burst */}
           {Array.from({ length: 16 }).map((_, i) => (
             <FireworkParticle key={i} delay={burst.delay} x="0" y="0" color={burst.color} />
           ))}
        </div>
      ))}
    </div>
  );
};

// 2. Liquid Glowing "8" SVG Component
const LiquidEight = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 3, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      } 
    }
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-amber-500/30 blur-[80px] rounded-full animate-pulse"></div>
      
      <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FFF" />
          </linearGradient>
        </defs>
        
        {/* The Figure 8 Path - Infinite Loop Shape */}
        <motion.path
          d="M50 75 C 80 75, 90 40, 50 40 C 10 40, 20 75, 50 75 C 80 75, 90 110, 50 110 C 10 110, 20 75, 50 75 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Shine Overlay */}
        <motion.path
          d="M50 75 C 80 75, 90 40, 50 40 C 10 40, 20 75, 50 75 C 80 75, 90 110, 50 110 C 10 110, 20 75, 50 75 Z"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.8"
          initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 100 }}
          animate={{ pathLength: 0.3, opacity: 1, strokeDashoffset: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
};

// --- Main Component ---

const AnniversaryPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Check initial state
    const currentSettings = storageService.getSettings();
    const hasSeen = sessionStorage.getItem('yanyun_anniversary_seen');
    if (currentSettings.enableAnniversary && !hasSeen) {
       setTimeout(() => setIsOpen(true), 1000);
    }

    // 2. Listen for settings updates (Real-time Preview)
    const handleSettingsChange = () => {
       const newSettings = storageService.getSettings();
       
       if (newSettings.enableAnniversary) {
          // If toggled ON, force show it (reset seen status for preview)
          sessionStorage.removeItem('yanyun_anniversary_seen');
          setIsOpen(true);
       } else {
          // If toggled OFF, close immediately
          setIsOpen(false);
       }
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('yanyun_anniversary_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* 1. Backdrop with heavy blur and particles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gray-900/90 backdrop-blur-lg"
            onClick={handleClose}
          >
             <BackgroundFireworks />
          </motion.div>

          {/* 2. Main Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
             {/* Gradient Borders */}
             <div className="absolute inset-0 rounded-[3rem] border border-transparent [mask:linear-gradient(#fff_0_0) padding-box,linear-gradient(#fff_0_0)]" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.5), transparent, rgba(251,191,36,0.2)) border-box' }}></div>

             {/* Close Button */}
             <button 
                onClick={handleClose}
                className="absolute top-6 right-6 z-20 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-md"
             >
                <X size={24} />
             </button>

             <div className="relative z-10 px-8 py-12 flex flex-col items-center text-center">
                
                {/* Hero Graphic */}
                <motion.div 
                   initial={{ scale: 0, rotate: -180 }}
                   animate={{ scale: 1, rotate: 0 }}
                   transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                   className="mb-8"
                >
                   <LiquidEight />
                </motion.div>

                {/* Text Content */}
                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6, duration: 0.8 }}
                >
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-glow">
                      <Sparkles size={12} className="fill-current" /> Anniversary Celebration
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-lg">
                      辉煌八载 <br/> 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">感恩同行</span>
                   </h2>
                   
                   <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-xs mx-auto font-medium">
                      从 2017 到 2025，每一个里程碑都凝聚着您的信任。
                   </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.9, type: "spring" }}
                   whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.6)" }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleClose}
                   className="group relative w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl font-bold text-white shadow-2xl shadow-amber-500/30 overflow-hidden text-lg"
                >
                   <span className="relative z-10 flex items-center justify-center gap-2">
                      开启新篇章 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                   </span>
                   {/* Shimmer Effect */}
                   <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"></div>
                </motion.button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnniversaryPopup;
