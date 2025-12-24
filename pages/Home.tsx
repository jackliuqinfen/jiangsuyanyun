
import React, { useState, useEffect, useMemo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ArrowUpRight, Star, ShieldCheck, TrendingUp, Clock, Quote, Award, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { INITIAL_TESTIMONIALS } from '../constants';

// --- 高级视觉：景深仿真烟花 (Bokeh Firework) ---
const BokehFirework = ({ delay = 0, color = "#FFD700", size = "small" }) => {
  const count = size === "large" ? 45 : 30;
  const particles = useMemo(() => Array.from({ length: count }), [count]);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const isBlurry = useMemo(() => Math.random() > 0.4, []); 

  useEffect(() => {
    setPos({ x: 5 + Math.random() * 90, y: 10 + Math.random() * 60 });
  }, []);

  return (
    <div className={`absolute ${isBlurry ? 'blur-[5px] opacity-30 scale-75' : 'z-10'}`} style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
      {particles.map((_, i) => {
        const angle = (i * (360 / count)) * (Math.PI / 180);
        const distance = size === "large" ? 180 : 120;
        const velocity = (distance * 0.8) + Math.random() * (distance * 0.4);
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * velocity,
              y: Math.sin(angle) * velocity + 50, 
              opacity: 0,
              scale: [1, 1.8, 0]
            }}
            transition={{
              duration: 3.5,
              ease: [0.1, 0.8, 0.2, 1],
              delay: delay,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 4
            }}
            className="absolute rounded-full"
            style={{ 
              width: size === "large" ? '3px' : '2px',
              height: size === "large" ? '3px' : '2px',
              backgroundColor: color,
              boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` 
            }}
          />
        );
      })}
    </div>
  );
};

// --- 高级礼花：高分子彩带系统 (Confetti Rain) ---
const ConfettiRain = ({ count = 50 }) => {
  const colors = ['#D4AF37', '#FDE68A', '#FFFFFF', '#FFD700', '#B45309'];
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ top: -20, left: `${Math.random() * 100}%`, rotate: 0, opacity: 0 }}
          animate={{ 
            top: '110%', 
            rotate: 1080,
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 3, 
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-4 sm:w-3 sm:h-5"
          style={{ 
            backgroundColor: colors[i % colors.length],
            borderRadius: '2px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        />
      ))}
    </div>
  );
};

// --- 建筑纹理：极细测绘背纹 ---
const ArchitecturalGrid = () => (
  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
    style={{ 
      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
      backgroundSize: '30px 30px'
    }} 
  />
);

const Home: React.FC = () => {
  const [showAnniversary, setShowAnniversary] = useState(false);
  const services = storageService.getServices().slice(0, 4);
  const projects = storageService.getProjects().filter(p => p.isFeatured).slice(0, 3);
  const partners = storageService.getPartners();
  const honors = storageService.getHonors().slice(0, 4);
  const content = storageService.getPageContent().home;

  useEffect(() => {
    const hasShown = sessionStorage.getItem('yanyun_anniversary_v12_ultra_final');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowAnniversary(true);
        sessionStorage.setItem('yanyun_anniversary_v12_ultra_final', 'true');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="overflow-hidden bg-white font-sans">
      {/* --- 8 周年【金石筑梦 · 极境流光】终极庆典弹窗 --- */}
      <AnimatePresence>
        {showAnniversary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            {/* 背景置灰层 + 景深烟花 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#020617] z-0"
              onClick={() => setShowAnniversary(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[15px]" />
              <BokehFirework delay={0.2} color="#D4AF37" size="large" />
              <BokehFirework delay={1.8} color="#FFFBEB" size="small" />
              <BokehFirework delay={3.5} color="#F59E0B" size="large" />
              <BokehFirework delay={0.8} color="#FFFFFF" size="small" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(44,56,139,0.15),transparent_70%)]" />
            </motion.div>
            
            {/* 弹窗主体：高奢材质容器 */}
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, y: 60, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30, transition: { duration: 0.4, ease: "backIn" } }}
              transition={{ type: "spring", damping: 22, stiffness: 120, delay: 0.1 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#4c0519] via-[#881337] to-[#1e1b4b] rounded-[3.5rem] shadow-[0_100px_200px_rgba(0,0,0,0.9),inset_0_2px_40px_rgba(255,255,255,0.1)] overflow-hidden border border-white/10 z-10"
              style={{ perspective: "1200px" }}
            >
              <ArchitecturalGrid />
              <ConfettiRain />

              {/* 弹窗内部光效爆发 */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0 rounded-full border-[3px] border-yellow-500/20 pointer-events-none z-0"
              />

              <div className="relative z-10 p-12 md:p-16 flex flex-col items-center">
                {/* 视觉核心：【液态金】3D 数字 8 */}
                <div className="relative mb-16 select-none group">
                  <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.5, rotateY: -30 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 90 }}
                    className="relative"
                  >
                    {/* 环境遮蔽阴影 */}
                    <span className="absolute inset-0 text-[200px] md:text-[260px] font-black leading-[0.8] text-black/60 translate-y-6 blur-2xl">8</span>
                    
                    {/* 数字本体：多层渐变模拟厚重金属 */}
                    <span className="relative inline-block text-[200px] md:text-[260px] font-black leading-[0.8] bg-gradient-to-b from-[#FFFBEB] via-[#D4AF37] via-[#92400E] to-[#451A03] bg-clip-text text-transparent filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] tracking-tighter">
                      8
                    </span>

                    {/* 铂金冷光扫光 (Specular Flow) */}
                    <motion.div 
                      animate={{ 
                        left: ['-150%', '250%'],
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-35deg] pointer-events-none mix-blend-overlay"
                    />
                  </motion.div>
                  
                  {/* 周年浮雕勋章 */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  >
                    <div className="bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#D4AF37] p-[1px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                      <div className="bg-[#450a0a] px-12 py-3 rounded-2xl border border-white/10">
                        <span className="text-white text-[11px] font-black tracking-[0.9em] uppercase flex items-center">
                          <Star size={12} className="mr-3 text-yellow-400 fill-yellow-400" />
                          Anniversary
                          <Star size={12} className="ml-3 text-yellow-400 fill-yellow-400" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 艺术排版：生长感动效 */}
                <div className="text-center space-y-10">
                  <div className="space-y-4">
                    <motion.p 
                      initial={{ opacity: 0, letterSpacing: "0.2em" }}
                      animate={{ opacity: 1, letterSpacing: "0.6em" }}
                      transition={{ delay: 1.1, duration: 1.2 }}
                      className="text-yellow-500/90 font-bold text-xs uppercase"
                    >
                      八载峥嵘 · 韵筑精品
                    </motion.p>
                    
                    <div className="overflow-hidden">
                      <motion.h2 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-[0.05em] drop-shadow-lg"
                      >
                        热烈祝贺
                      </motion.h2>
                    </div>

                    <div className="overflow-hidden">
                      <motion.p 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xl md:text-2xl font-light text-white/90"
                      >
                        江苏盐韵工程项目管理有限公司
                      </motion.p>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.7, duration: 1.2, ease: "circOut" }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto w-3/4"
                  />

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 }}
                    className="text-white/60 text-sm leading-loose max-w-[420px] mx-auto font-light"
                  >
                    始于 2017，以匠心筑造时代丰碑。<br/>
                    感恩八载同行，每一份托付，我们必全力以赴。
                  </motion.div>
                </div>

                {/* 交互按钮：液态金动效 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, type: "spring" }}
                  className="mt-16"
                >
                  <button 
                    onClick={() => setShowAnniversary(false)}
                    className="relative group px-16 py-5 rounded-2xl overflow-hidden transition-all transform hover:scale-[1.05] active:scale-[0.96]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#D4AF37] transition-all duration-500 group-hover:brightness-110 shadow-[0_20px_60px_rgba(212,175,55,0.4)]" />
                    <span className="relative z-10 flex items-center text-[#4A0000] font-black text-2xl tracking-widest">
                      携手共进 <Sparkles size={24} className="ml-4 animate-pulse" />
                    </span>
                    
                    {/* 按钮微光扫过 */}
                    <motion.div 
                       animate={{ x: [-200, 400] }}
                       transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                       className="absolute inset-0 w-24 h-full bg-white/40 skew-x-[-30deg] pointer-events-none"
                    />
                  </button>
                </motion.div>
              </div>

              {/* 装饰细节：极细铂金双边框 */}
              <div className="absolute inset-6 border border-white/5 rounded-[3rem] pointer-events-none" />
              <div className="absolute inset-8 border border-white/[0.03] rounded-[2.8rem] pointer-events-none" />
              
              <button 
                onClick={() => setShowAnniversary(false)}
                className="absolute top-10 right-10 p-3 text-white/30 hover:text-white/100 hover:bg-white/10 rounded-full transition-all z-30"
              >
                <X size={32} strokeWidth={1.5} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.hero.bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/40"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
             <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
                <span className="text-white text-sm font-medium">{content.hero.badge}</span>
             </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {content.hero.titleLine1} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">{content.hero.titleHighlight}</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
              {content.hero.description}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-lg font-bold transition-all shadow-glow hover:shadow-lg hover:-translate-y-1 flex items-center justify-center text-lg">
                获取项目预估方案 <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/cases" className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold transition-all flex items-center justify-center">
                查看成功案例
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-16 flex items-center space-x-8 text-gray-400 text-sm font-medium">
               <div className="flex items-center"><ShieldCheck size={18} className="mr-2 text-primary" /> 国家甲级监理资质</div>
               <div className="flex items-center"><TrendingUp size={18} className="mr-2 text-primary" /> ISO9001 认证体系</div>
               <div className="flex items-center"><Clock size={18} className="mr-2 text-primary" /> 24h 应急响应机制</div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/10 py-6 hidden md:block">
           <div className="container mx-auto px-6 flex justify-between items-center text-white">
              {[content.stats.stat1, content.stats.stat2, content.stats.stat3, content.stats.stat4].map((stat, i) => (
                <React.Fragment key={i}>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                  </div>
                  {i < 3 && <div className="w-px h-10 bg-white/10"></div>}
                </React.Fragment>
              ))}
           </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">合作伙伴</h2>
            <p className="text-gray-500 text-sm mt-2">携手行业领军企业，共创精品工程</p>
        </div>

        <div className="relative w-full max-w-[1920px] mx-auto">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

            <div className="flex overflow-hidden">
                <motion.div
                    className="flex gap-8 md:gap-12 items-center flex-nowrap pl-16"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        ease: "linear",
                        duration: 60,
                        repeat: Infinity,
                    }}
                >
                    {[...partners, ...partners].map((partner, idx) => {
                        let logoSrc = partner.logoUrl;
                        if (partner.website) {
                            try {
                                const hostname = new URL(partner.website).hostname;
                                logoSrc = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
                            } catch (e) {}
                        }

                        return (
                          <a 
                              key={`${partner.id}-${idx}`}
                              href={partner.website || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 group relative flex flex-col items-center justify-center p-4 w-[160px] h-[120px] bg-gray-50/50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300"
                              title={partner.name}
                          >
                               <div className="w-16 h-16 mb-2 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100">
                                  <img 
                                      src={logoSrc} 
                                      alt={partner.name} 
                                      className="w-full h-full object-contain"
                                      loading="lazy"
                                  />
                               </div>
                               <span className="text-xs font-bold text-gray-400 group-hover:text-gray-800 transition-colors opacity-0 group-hover:opacity-100 absolute bottom-3 translate-y-2 group-hover:translate-y-0 duration-300">
                                  {partner.name}
                               </span>
                          </a>
                        );
                    })}
                </motion.div>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">我们的解决方案</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">不仅是监管，更是价值创造</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors font-medium group">
              查看全部服务 <ArrowUpRight size={20} className="ml-2 group-hover:rotate-45 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-primary/10"></div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors relative z-10">
                   <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors relative z-10">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10 min-h-[60px]">
                  {service.description}
                </p>
                <div className="flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                  了解详情 <ArrowRight size={14} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
           <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">客户评价</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {INITIAL_TESTIMONIALS.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                   <Quote className="absolute top-6 right-6 text-gray-100 fill-current" size={48} />
                   <p className="text-gray-600 leading-relaxed mb-6 relative z-10 italic">"{item.content}"</p>
                   <div className="flex items-center">
                      <img src={item.avatarUrl} alt={item.author} className="w-12 h-12 rounded-full object-cover mr-4" />
                      <div>
                         <h4 className="font-bold text-gray-900">{item.author}</h4>
                         <p className="text-xs text-gray-500">{item.position} · {item.company}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.cta.title}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            {content.cta.description}
          </p>
          <Link to="/contact" className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 hover:scale-105 transition-all">
            立即咨询
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
