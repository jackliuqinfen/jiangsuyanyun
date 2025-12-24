
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';

// --- Visual Components ---

// 1. Firework Particle Engine
const FireworkParticle: React.FC<{ delay: number; x: string; y: string; color: string }> = ({ delay, x, y, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0.5],
      x: [0, (Math.random() - 0.5) * 200], // Explode outwards
      y: [0, (Math.random() - 0.5) * 200],
    }}
    transition={{
      duration: 1.5,
      delay: delay,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 2 // Randomize repeat
    }}
    style={{ left: x, top: y, backgroundColor: color }}
    className="absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
  />
);

const BackgroundFireworks = () => {
  // Generate random burst centers
  const bursts = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: `${Math.random() * 80 + 10}%`,
    y: `${Math.random() * 80 + 10}%`,
    color: ['#FBBF24', '#F472B6', '#60A5FA', '#34D399'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bursts.map(burst => (
        <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
           {/* Each burst creates multiple particles */}
           {Array.from({ length: 12 }).map((_, i) => (
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
        duration: 2.5, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      } 
    }
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
      
      <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FFF" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        
        {/* The Figure 8 Path */}
        <motion.path
          d="M50 75 C 80 75, 90 40, 50 40 C 10 40, 20 75, 50 75 C 80 75, 90 110, 50 110 C 10 110, 20 75, 50 75 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Overlay for gloss */}
        <motion.path
          d="M50 75 C 80 75, 90 40, 50 40 C 10 40, 20 75, 50 75 C 80 75, 90 110, 50 110 C 10 110, 20 75, 50 75 Z"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// --- Main Component ---

const AnniversaryPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // CRITICAL FIX: Initialize state, but also listen for updates
  const [settings, setSettings] = useState(storageService.getSettings());

  useEffect(() => {
    // 1. Setup Event Listener for Real-time Preview from Admin
    const handleSettingsChange = () => {
      const newSettings = storageService.getSettings();
      setSettings(newSettings);
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);

    // 2. Logic to determine visibility
    // Check immediately on mount and whenever settings change
    const hasSeen = sessionStorage.getItem('yanyun_anniversary_seen');
    
    if (settings.enableAnniversary && !hasSeen) {
      // Small delay for smoother entry after page load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // If setting is turned off while open, close it (good for admin testing)
      if (!settings.enableAnniversary) {
        setIsOpen(false);
      }
    }

    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, [settings.enableAnniversary]); // Depend on the specific flag

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('yanyun_anniversary_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            onClick={handleClose}
          >
             <BackgroundFireworks />
          </motion.div>

          {/* 2. Main Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
            className="relative w-full max-w-md bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-amber-500/30 rounded-[2.5rem] shadow-2xl overflow-hidden"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.15)' }} // Custom amber glow
          >
             {/* Decorative Top Shine */}
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

             {/* Close Button */}
             <button 
                onClick={handleClose}
                className="absolute top-5 right-5 z-20 text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
             >
                <X size={20} />
             </button>

             <div className="relative z-10 px-8 py-10 flex flex-col items-center text-center">
                
                {/* Hero Graphic */}
                <motion.div 
                   initial={{ scale: 0, rotate: -180 }}
                   animate={{ scale: 1, rotate: 0 }}
                   transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                   className="mb-6"
                >
                   <LiquidEight />
                </motion.div>

                {/* Text Content */}
                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6, duration: 0.8 }}
                >
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                      <Sparkles size={12} /> Celebrating Excellence
                   </div>
                   
                   <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                      辉煌八载 · <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">感恩同行</span>
                   </h2>
                   
                   <div className="w-12 h-1 bg-amber-500/50 rounded-full mx-auto mb-6"></div>

                   <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                      从 2017 到 2025，每一个里程碑都凝聚着您的信任。我们准备了一份专属的周年回顾。
                   </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.9, type: "spring" }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleClose} // In a real app, this might go to a special page
                   className="group relative w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-bold text-white shadow-lg shadow-amber-500/20 overflow-hidden"
                >
                   <span className="relative z-10 flex items-center justify-center gap-2">
                      探索历程 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                   </span>
                   {/* Shimmer Effect */}
                   <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>
                </motion.button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnniversaryPopup;
