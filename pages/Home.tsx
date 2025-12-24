
import React, { useState, useEffect, useMemo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ArrowUpRight, Star, ShieldCheck, TrendingUp, Clock, Quote, Award, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { INITIAL_TESTIMONIALS } from '../constants';

// --- 极致细节：电影级噪点背景 (Cinematic Noise & Depth) ---
const CinematicOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 动态流体色块：模拟深空极光 */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-radial from-blue-900/40 via-transparent to-transparent"
      />
      
      {/* 极细微星尘粒子 */}
      {Array.from({ length: 120 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/40"
          style={{ 
            width: Math.random() * 1.5 + 0.5, 
            height: Math.random() * 1.5 + 0.5, 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Awwwards 风格必备：全局噪点滤镜层 */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>
    </div>
  );
};

// --- Awwwards 设计：分形交织数字 8 ---
const FractalEight = () => {
  const pathData = "M50 40 C65 40 75 50 75 60 C75 75 50 80 50 80 C50 80 25 85 25 100 C25 115 40 125 50 125 C65 125 75 115 75 100 C75 85 50 80 50 80 C50 80 25 75 25 60 C25 45 35 40 50 40 Z";

  return (
    <div className="relative w-64 h-80 md:w-80 md:h-96">
      <svg viewBox="0 0 100 140" className="w-full h-full filter drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
        <defs>
          <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBDF93" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFFBEB" />
            <stop offset="75%" stopColor="#C5A028" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
          
          {/* 复杂光效滤镜 */}
          <filter id="metalGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor="#FFFBEB" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceGraphic" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>

        {/* 1. 底层：深色建筑线条，提供体积感 */}
        <path d={pathData} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="12" strokeLinecap="round" />

        {/* 2. 中层：多重交织纤维路径 */}
        {[0, 2, 4].map((offset, i) => (
          <motion.path
            key={i}
            d={pathData}
            fill="none"
            stroke="url(#luxuryGold)"
            strokeWidth={10 - i * 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: 1, pathOffset: 0 }}
            transition={{ 
              duration: 3 + i, 
              ease: [0.16, 1, 0.3, 1], // Expo Out
              delay: 0.2 + i * 0.1 
            }}
            filter="url(#metalGlow)"
            style={{ opacity: 0.8 - i * 0.2 }}
          />
        ))}

        {/* 3. 顶层：流金填充，带有“呼吸”不透明度 */}
        <motion.path
          d={pathData}
          fill="url(#luxuryGold)"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 2.2, ease: "easeOut" }}
          style={{ mixBlendMode: 'soft-light' }}
        />

        {/* 4. 动态掠过光束 */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0.1, pathOffset: 0, opacity: 0 }}
          animate={{ pathOffset: [0, 1.5], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      </svg>
    </div>
  );
};

// --- 文字高级呈现：字符级浮现 ---
const StaggeredText = ({ text, delay = 0, className = "" }) => {
  const letters = text.split("");
  return (
    <h2 className={className}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ 
            duration: 1, 
            delay: delay + i * 0.05,
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
};

const Home: React.FC = () => {
  const [showAnniversary, setShowAnniversary] = useState(false);
  const settings = storageService.getSettings();
  const content = storageService.getPageContent().home;
  const partners = storageService.getPartners();
  const services = storageService.getServices().slice(0, 4);

  useEffect(() => {
    // 采用更具辨识度的缓存版本号，确保重新设计的视觉能被用户看到
    const hasShown = sessionStorage.getItem('yanyun_8th_grand_v3');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowAnniversary(true);
        sessionStorage.setItem('yanyun_8th_grand_v3', 'true');
      }, 1200);
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
      {/* --- 8 周年【金石重构 · 极境艺术】庆典弹窗 --- */}
      <AnimatePresence>
        {showAnniversary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* 全屏背景引力场 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-[20px] z-0"
              onClick={() => setShowAnniversary(false)}
            >
              <CinematicOverlay />
              
              {/* 引力波环 */}
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10"
              />
            </motion.div>
            
            {/* 弹窗主体：采用了 Awwwards 偏爱的卡片设计，不对称的光影与极致的排版 */}
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.9, rotateX: 15 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ y: 50, opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              transition={{ type: "spring", damping: 30, stiffness: 80 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[3rem] shadow-[0_60px_150px_rgba(0,0,0,0.9)] overflow-hidden border border-white/5 z-10"
              style={{ perspective: "2000px" }}
            >
              <div className="relative z-10 p-12 md:p-20 flex flex-col items-center">
                {/* 核心艺术：分形数字 8 */}
                <div className="relative mb-14">
                  <FractalEight />
                  
                  {/* 周年浮雕勋章 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 1 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl px-8 py-2 rounded-full border border-white/10 shadow-2xl"
                  >
                    <span className="text-[#D4AF37] text-[11px] font-black tracking-[0.5em] uppercase">
                       8th ANNIVERSARY
                    </span>
                  </motion.div>
                </div>

                {/* 文字艺术排版：不再使用普通段落，通过间距与字重营造高级感 */}
                <div className="text-center space-y-10">
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 2.5, duration: 1.5 }}
                      className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-6"
                    />
                    
                    <StaggeredText 
                      text="热烈祝贺" 
                      delay={2.6} 
                      className="text-4xl md:text-5xl font-bold text-white tracking-widest"
                    />
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.2, duration: 1.5 }}
                      className="text-white/40 font-light text-lg tracking-[0.2em]"
                    >
                      江苏盐韵工程项目管理有限公司
                    </motion.p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="space-y-2"
                  >
                    <p className="text-[#D4AF37] font-bold text-sm tracking-[0.4em] uppercase">八载峥嵘 · 韵筑精品</p>
                    <div className="text-white/30 text-xs leading-relaxed max-w-[360px] mx-auto font-light">
                       于时光中雕琢工程艺术，于细节中守护基石承诺。<br/>
                       感恩八载同行，每一份托付皆是荣光。
                    </div>
                  </motion.div>
                </div>

                {/* 交互按钮：极简设计，通过微小的 Hover 效果传达品质 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 }}
                  className="mt-14"
                >
                  <button 
                    onClick={() => setShowAnniversary(false)}
                    className="group relative px-12 py-4 rounded-xl overflow-hidden transition-all"
                  >
                    <div className="absolute inset-0 bg-[#D4AF37] group-hover:bg-white transition-colors duration-500" />
                    <span className="relative z-10 text-black font-bold tracking-[0.3em] text-sm uppercase group-hover:text-black transition-colors">
                      携手启新 <ArrowRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              </div>

              {/* 装饰边线：增加层次感 */}
              <div className="absolute inset-4 border border-white/5 rounded-[2.5rem] pointer-events-none" />
              
              <button 
                onClick={() => setShowAnniversary(false)}
                className="absolute top-8 right-8 p-3 text-white/20 hover:text-white transition-all z-30"
              >
                <X size={24} />
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
