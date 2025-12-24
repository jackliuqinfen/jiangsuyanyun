
import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ArrowUpRight, Star, ShieldCheck, TrendingUp, Clock, Quote, Award, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { INITIAL_TESTIMONIALS } from '../constants';

// --- 资深设计：物理仿真彩带系统 ---
const CelebrationParticles = ({ count = 80 }) => {
  const colors = ['#FFD700', '#FDB931', '#FF4D4D', '#FFFFFF', '#FF8C00'];
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: "50%", 
            left: "50%", 
            scale: 0,
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            top: [`50%`, `${10 + Math.random() * 80}%`], 
            left: [`50%`, `${10 + Math.random() * 80}%`],
            scale: [0, Math.random() * 1.2 + 0.4, 0],
            rotate: Math.random() * 1440,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 2, 
            ease: [0.22, 1, 0.36, 1],
            delay: Math.random() * 0.4,
            repeat: Infinity,
            repeatDelay: Math.random() * 3
          }}
          className="absolute"
          style={{ 
            width: Math.random() * 12 + 4, 
            height: Math.random() * 12 + 4,
            backgroundColor: colors[i % colors.length],
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            boxShadow: '0 0 10px rgba(255,215,0,0.3)',
          }}
        />
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const [showAnniversary, setShowAnniversary] = useState(false);
  const services = storageService.getServices().slice(0, 4);
  const projects = storageService.getProjects().filter(p => p.isFeatured).slice(0, 3);
  const partners = storageService.getPartners();
  const honors = storageService.getHonors().slice(0, 4);
  const content = storageService.getPageContent().home;

  useEffect(() => {
    const hasShown = sessionStorage.getItem('yanyun_anniversary_luxury_v5');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowAnniversary(true);
        sessionStorage.setItem('yanyun_anniversary_luxury_v5', 'true');
      }, 1000);
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
      {/* --- 8 周年“殿堂级”限定弹窗 (排版优化版) --- */}
      <AnimatePresence>
        {showAnniversary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnniversary(false)}
              className="absolute inset-0 bg-gray-950/85 backdrop-blur-[12px]"
            />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 150, delay: 0.1 }}
              className="relative w-full max-w-lg bg-[#7A0000] rounded-[3.5rem] shadow-[0_50px_150px_rgba(0,0,0,0.9)] overflow-hidden border border-white/10"
            >
              <CelebrationParticles />

              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-yellow-500/25 to-transparent" />
                <motion.div 
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-15"
                />
              </div>

              <div className="relative z-10 p-10 md:p-14 flex flex-col items-center">
                {/* 仪式感核心：3D 金属质感数字 8 */}
                <div className="relative mb-8 group">
                  <motion.div
                    initial={{ scale: 0.5, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", delay: 0.4, damping: 15 }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="inline-block text-[140px] md:text-[180px] font-black leading-[1] select-none bg-gradient-to-b from-[#FFFBEB] via-[#FDE68A] via-[#D4AF37] via-[#B45309] to-[#451A03] bg-clip-text text-transparent filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                        8
                      </span>
                      <motion.div 
                        animate={{ x: [-250, 250], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, delay: 1.5, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] mix-blend-overlay"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#FDE68A] text-[#4A0000] px-8 py-2 rounded-full text-xs font-black tracking-[0.5em] shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-white/30 whitespace-nowrap"
                  >
                    ANNIVERSARY
                  </motion.div>
                </div>

                <div className="text-center space-y-4">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-yellow-400/70 font-bold tracking-[0.6em] text-[10px] uppercase"
                  >
                    八载峥嵘 · 筑梦未来
                  </motion.p>
                  
                  {/* --- 优化后的换行排版 --- */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex flex-col gap-2 md:gap-3"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest">
                      热烈祝贺
                    </h2>
                    <h3 className="text-lg md:text-xl font-medium text-white/90 tracking-normal px-2">
                      江苏盐韵工程项目管理有限公司
                    </h3>
                    <div className="text-2xl md:text-3xl font-black italic">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">成立 8 周年</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4"
                  />

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-white/60 text-sm leading-relaxed max-w-[340px] mx-auto font-light mt-4"
                  >
                    始于 2016，我们以匠心致初心。<br/>
                    感恩八年同行，携手共筑品质工程。
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 }}
                  className="mt-10"
                >
                  <button 
                    onClick={() => setShowAnniversary(false)}
                    className="relative group px-14 py-4 bg-gradient-to-b from-[#FDE68A] to-[#D4AF37] text-[#4A0000] rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_60px_rgba(212,175,55,0.4)] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      共庆华章 <Sparkles size={20} className="ml-3 text-[#4A0000] animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
              </div>

              <div className="absolute inset-6 border border-white/5 rounded-[3rem] pointer-events-none" />
              
              <button 
                onClick={() => setShowAnniversary(false)}
                className="absolute top-8 right-8 p-3 text-white/30 hover:text-white transition-all z-20 hover:bg-white/10 rounded-full"
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

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{content.process.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{content.process.description}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

              {content.process.steps.map((item, i) => (
                 <div key={i} className="relative z-10 bg-white p-6 rounded-xl border border-gray-100 text-center hover:border-primary transition-colors group">
                    <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                       0{i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Honors Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-medium tracking-wider mb-4">
              <Star size={12} className="mr-2 text-accent" /> 资质荣誉
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">实力见证 品质保障</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
               多年来，我们始终坚持高标准、严要求，获得了行业内多项权威认证与荣誉表彰。
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {honors.map((honor) => (
              <motion.div 
                key={honor.id}
                variants={fadeInUp}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={honor.imageUrl} 
                    alt={honor.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 z-20">
                     <Award className="text-accent mb-1" size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">{honor.title}</h3>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{honor.issuingAuthority}</span>
                  <span>{honor.issueDate}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">精选案例展示</h2>
            <p className="text-gray-500">
              从市政公用到商业地产，我们以严谨的态度见证每一个地标的诞生。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer ${idx === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3] md:aspect-auto'}`}
              >
                <div className="absolute inset-0 bg-gray-900 z-0">
                   <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center space-x-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    <span>{project.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <Link to="/cases" className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-medium">
              浏览所有案例
            </Link>
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
