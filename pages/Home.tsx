
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ArrowUpRight, ShieldCheck, Activity, BarChart3, PieChart, Database, CheckCircle2, Server } from 'lucide-react';
import { storageService } from '../services/storageService';

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

const Home: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [partners, services, content] = await Promise.all([
        storageService.getPartners(),
        storageService.getServices(),
        storageService.getPageContent()
      ]);
      setData({ partners, services: services.slice(0, 4), content: content.home });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
           <p className="mt-6 text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Data Nodes...</p>
        </div>
      </div>
    );
  }

  const { content, partners, services } = data;

  return (
    <div className="bg-white">
      {/* 沉浸式 Hero 区块 */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MotionImg 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             src={content.hero.bgImage} 
             className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/90 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl pt-20">
             <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 mb-10"
             >
                <div className="w-2 h-2 bg-accent rounded-full animate-ping mr-3"></div>
                <span className="text-white text-xs font-black uppercase tracking-widest">{content.hero.badge}</span>
             </MotionDiv>

             <MotionH1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8"
             >
                <span className="block mb-2">{content.hero.titleLine1}</span>
                <span className="relative inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-accent italic drop-shadow-sm">
                  {content.hero.titleHighlight}
                </span>
             </MotionH1>

             <MotionP 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-medium"
             >
                {content.hero.description}
             </MotionP>

             <MotionDiv 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-5"
             >
                <Link to="/contact" className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary-light transition-all active:scale-95 flex items-center gap-3 group">
                   启动您的项目 <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/cases" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3">
                   案例巡礼
                </Link>
             </MotionDiv>
          </div>
        </div>
      </section>

      {/* 数字化管控中心展示 */}
      <section className="py-24 bg-surface overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
               <div className="lg:col-span-5">
                  <div className="p-3 bg-primary text-white rounded-2xl inline-block mb-6 shadow-xl shadow-primary/20"><Activity size={24}/></div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">全过程数字化<br/>管控系统 (Yy-PMS)</h2>
                  <p className="text-gray-500 leading-relaxed font-medium mb-10">
                     我们将工程监理与项目管理深度集成于数字化底座，实现从“事后纠偏”向“事前预警”的范式转变，确保每一个关键节点皆在掌控之中。
                  </p>
                  
                  <div className="grid grid-cols-1 gap-6">
                     {[
                        { icon: Database, title: '数据驱动', desc: '实时汇总现场5D数据，精准匹配投资强度。' },
                        { icon: ShieldCheck, title: '智能合规', desc: '全自动化风险扫描，规避法律及施工红线。' },
                        { icon: Server, title: '云端交付', desc: '工程文档全数字化存档，支持全周期可追溯查询。' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                           <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                              <item.icon size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:col-span-7">
                  <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/10 group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                     
                     <div className="relative z-10 flex flex-col gap-8">
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Real-time Control Center</span>
                           </div>
                           <div className="flex gap-2">
                              <div className="w-1 h-3 bg-white/10 rounded-full"></div>
                              <div className="w-1 h-3 bg-white/30 rounded-full"></div>
                              <div className="w-1 h-3 bg-white/10 rounded-full"></div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                              <PieChart className="text-blue-400 mb-4" size={24} />
                              <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Cost Control</p>
                              <p className="text-2xl font-black text-white">98.2%</p>
                           </div>
                           <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                              <BarChart3 className="text-accent mb-4" size={24} />
                              <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Safety Index</p>
                              <p className="text-2xl font-black text-white">Score: 99</p>
                           </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                           <div className="flex justify-between items-center mb-6">
                              <p className="text-xs font-bold text-white">全省项目覆盖密度</p>
                              <span className="text-[10px] text-emerald-400 font-black">+15.4% YoY</span>
                           </div>
                           <div className="space-y-4">
                              {[80, 65, 90].map((w, i) => (
                                 <div key={i} className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: `${w}%` }}
                                       transition={{ duration: 1.5, delay: i * 0.2 }}
                                       className="h-full bg-gradient-to-r from-primary to-blue-400"
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     
                     <div className="mt-10 flex justify-center">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover:text-white/40 transition-colors">Yanyun Intelligent Engine</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 核心业务网格 */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
              <div className="max-w-2xl">
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">超越传统的<br/>工程咨询标准</h2>
                 <p className="text-gray-500 font-medium">我们将数字化双胞胎与标准化现场管理相结合，确保每一个交付件都经得起时间的考验。</p>
              </div>
              <Link to="/services" className="px-8 py-3 bg-gray-50 text-gray-900 rounded-xl font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-colors flex items-center gap-2">
                 探索服务体系 <ArrowUpRight size={18} />
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((s: any, i: number) => (
                 <MotionDiv 
                    key={s.id}
                    whileHover={{ y: -15 }}
                    className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 group transition-all hover:bg-primary hover:border-primary cursor-pointer shadow-soft"
                 >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110">
                       <Zap className="text-primary" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-white mb-4 tracking-tight leading-snug">{s.title}</h3>
                    <p className="text-sm text-gray-500 group-hover:text-blue-100 leading-relaxed font-medium mb-10">{s.description}</p>
                    <div className="pt-6 border-t border-gray-200 group-hover:border-white/20">
                       <span className="text-xs font-black text-primary group-hover:text-white uppercase tracking-widest">Detail Architecture</span>
                    </div>
                 </MotionDiv>
              ))}
           </div>
        </div>
      </section>

      {/* 伙伴名单 */}
      <section className="py-20 bg-gray-950 overflow-hidden border-y border-white/5">
         <div className="container mx-auto px-6 mb-12 flex justify-between items-center">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs">The Trusted Alliance</h3>
            <div className="h-px bg-white/10 flex-1 mx-10"></div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Client Portfolio</p>
         </div>
         <div className="relative flex">
            <MotionDiv 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="flex gap-20 items-center whitespace-nowrap pr-20"
            >
               {[...partners, ...partners].map((p: any, i: number) => (
                  <div key={i} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                     <span className="text-2xl font-black text-white tracking-tighter italic select-none">{p.name}</span>
                  </div>
               ))}
            </MotionDiv>
         </div>
      </section>
    </div>
  );
};

export default Home;
