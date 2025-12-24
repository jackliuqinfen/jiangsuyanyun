
import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Trash2, Plus, Layout, Type, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PageContent, PageHeaderConfig } from '../../types';
import MediaSelector from '../../components/MediaSelector';
import { motion } from 'framer-motion';

// Cast motion component to bypass strict type errors for framer-motion props
const MotionDiv = motion.div as any;

const PageManager: React.FC = () => {
  const [content, setContent] = useState<PageContent>(storageService.getPageContent());
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'headers'>('home');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    storageService.savePageContent(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateContent = (path: string[], value: any) => {
    setContent(prev => {
       const newContent = JSON.parse(JSON.stringify(prev));
       let current = newContent;
       for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
       }
       current[path[path.length - 1]] = value;
       return newContent;
    });
  };

  const tabs = [
    { id: 'home', label: '首页配置', icon: Layout },
    { id: 'about', label: '关于我们', icon: Type },
    { id: 'services', label: '业务/问答', icon: ImageIcon },
    { id: 'headers', label: '全局页头', icon: ImageIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">页面内容管理系统</h1>
           <p className="text-sm text-gray-500 mt-1">控制全站 90% 以上的静态文案、图片及板块显示</p>
        </div>
        <button 
           onClick={handleSave} 
           className={`flex items-center space-x-2 px-8 py-3 rounded-xl transition-all font-black shadow-xl ${
             isSaved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
           }`}
        >
           {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
           <span>{isSaved ? '配置已同步' : '立即发布更改'}</span>
        </button>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
         {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
         })}
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 space-y-12">
         
         {activeTab === 'home' && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <section className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                     <span className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold">01</span>
                     <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Hero 核心首屏展示</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">浮动勋章文案 (Badge)</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={content.home.hero.badge} onChange={e => updateContent(['home', 'hero', 'badge'], e.target.value)} />
                        
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">主标题 (Line 1)</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={content.home.hero.titleLine1} onChange={e => updateContent(['home', 'hero', 'titleLine1'], e.target.value)} />
                        
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">高亮关键词 (Highlight)</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-primary" value={content.home.hero.titleHighlight} onChange={e => updateContent(['home', 'hero', 'titleHighlight'], e.target.value)} />
                     </div>
                     <MediaSelector label="Hero 背景视觉图" value={content.home.hero.bgImage} onChange={v => updateContent(['home', 'hero', 'bgImage'], v)} />
                  </div>
               </section>

               <section className="space-y-6 pt-10 border-t">
                  <div className="flex items-center gap-4 mb-4">
                     <span className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-bold">02</span>
                     <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">关键数据统计栏</h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">数值</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border rounded-lg text-lg font-black text-primary" value={(content.home.stats as any)[`stat${i}`].value} onChange={e => updateContent(['home', 'stats', `stat${i}`, 'value'], e.target.value)} />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">描述</label>
                              <input type="text" className="w-full px-3 py-2 bg-white border rounded-lg text-xs" value={(content.home.stats as any)[`stat${i}`].label} onChange={e => updateContent(['home', 'stats', `stat${i}`, 'label'], e.target.value)} />
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </MotionDiv>
         )}

         {activeTab === 'about' && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <section className="space-y-8">
                  <div className="flex items-center gap-4">
                     <span className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center font-bold">01</span>
                     <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">公司概览配置</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                     <div className="md:col-span-7 space-y-6">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">板块主标题</label>
                           <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={content.about.intro.title} onChange={e => updateContent(['about', 'intro', 'title'], e.target.value)} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">介绍段落一</label>
                           <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none leading-loose" value={content.about.intro.content1} onChange={e => updateContent(['about', 'intro', 'content1'], e.target.value)} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">介绍段落二</label>
                           <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none leading-loose" value={content.about.intro.content2} onChange={e => updateContent(['about', 'intro', 'content2'], e.target.value)} />
                        </div>
                     </div>
                     <div className="md:col-span-5">
                        <MediaSelector label="简介板块插图" value={content.about.intro.imageUrl} onChange={v => updateContent(['about', 'intro', 'imageUrl'], v)} />
                     </div>
                  </div>
               </section>

               <section className="pt-10 border-t space-y-8">
                  <div className="flex items-center gap-4">
                     <span className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center font-bold">02</span>
                     <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">企业文化内核</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {['mission', 'values', 'management'].map((key) => (
                        <div key={key} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                              {key === 'mission' ? '企业使命' : key === 'values' ? '核心价值观' : '管理理念'}
                           </label>
                           <textarea rows={4} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none" value={(content.about.culture as any)[key]} onChange={e => updateContent(['about', 'culture', key], e.target.value)} />
                        </div>
                     ))}
                  </div>
               </section>
            </MotionDiv>
         )}

         {activeTab === 'services' && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                        <MessageSquare size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">FAQ 常见问题库</h3>
                  </div>
                  <button 
                     onClick={() => updateContent(['services', 'faqs'], [...content.services.faqs, { q: '', a: '' }])}
                     className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                     <Plus size={14} className="inline-block mr-1" /> 新增问答条目
                  </button>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  {content.services.faqs.map((faq, idx) => (
                     <div key={idx} className="group relative bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => updateContent(['services', 'faqs'], content.services.faqs.filter((_, i) => i !== idx))} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                           </button>
                        </div>
                        <div className="space-y-4">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">问题 0{idx + 1}</label>
                              <input type="text" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold" value={faq.q} onChange={e => {
                                 const newFaqs = [...content.services.faqs];
                                 newFaqs[idx].q = e.target.value;
                                 updateContent(['services', 'faqs'], newFaqs);
                              }} />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">标准回答内容</label>
                              <textarea rows={3} className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none" value={faq.a} onChange={e => {
                                 const newFaqs = [...content.services.faqs];
                                 newFaqs[idx].a = e.target.value;
                                 updateContent(['services', 'faqs'], newFaqs);
                              }} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </MotionDiv>
         )}

         {activeTab === 'headers' && (
            <div className="grid grid-cols-1 gap-12">
               {(Object.entries(content.headers) as [string, PageHeaderConfig][]).map(([key, header]) => (
                  <MotionDiv key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center font-black text-primary capitalize">{key.charAt(0)}</div>
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{key} 页面视觉配置</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banner Section Configuration</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        <div className="md:col-span-7 space-y-6">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">主标题文案</label>
                              <input type="text" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none" value={header.title} onChange={e => updateContent(['headers', key, 'title'], e.target.value)} />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">副标题文案</label>
                              <input type="text" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 outline-none" value={header.subtitle} onChange={e => updateContent(['headers', key, 'subtitle'], e.target.value)} />
                           </div>
                        </div>
                        <div className="md:col-span-5">
                           <MediaSelector label="Banner 背景底图" value={header.backgroundImage} onChange={v => updateContent(['headers', key, 'backgroundImage'], v)} />
                        </div>
                     </div>
                  </MotionDiv>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default PageManager;
