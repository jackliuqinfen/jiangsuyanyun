
import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Trash2, Plus, Layout, Type, Image as ImageIcon, MessageSquare, ArrowUp, ArrowDown, Eye, EyeOff, Layers, Settings2, GripVertical, Activity, Menu, Edit3 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PageContent, PageHeaderConfig, HomeSectionConfig, FooterLink, TopNavItem } from '../../types';
import MediaSelector from '../../components/MediaSelector';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const PageManager: React.FC = () => {
  const [content, setContent] = useState<PageContent>(storageService.getPageContent());
  const [activeTab, setActiveTab] = useState<'home' | 'nav' | 'footer' | 'about' | 'services' | 'headers'>('home');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    storageService.savePageContent(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    window.dispatchEvent(new Event('settingsChanged'));
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

  // --- Home Layout Helpers ---
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...content.home.layout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newLayout.length) {
      [newLayout[index], newLayout[targetIndex]] = [newLayout[targetIndex], newLayout[index]];
      newLayout.forEach((sec, idx) => sec.order = idx + 1);
      updateContent(['home', 'layout'], newLayout);
    }
  };

  const toggleSectionVisibility = (index: number) => {
    const newLayout = [...content.home.layout];
    newLayout[index].isVisible = !newLayout[index].isVisible;
    updateContent(['home', 'layout'], newLayout);
  };

  // --- Nav Helpers ---
  const moveNav = (index: number, direction: 'up' | 'down') => {
    const newNav = [...content.topNav];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newNav.length) {
       [newNav[index], newNav[targetIndex]] = [newNav[targetIndex], newNav[index]];
       newNav.forEach((n, idx) => n.order = idx + 1);
       updateContent(['topNav'], newNav);
    }
  };

  const updateNavLink = (index: number, label: string) => {
    const newNav = [...content.topNav];
    newNav[index].label = label;
    updateContent(['topNav'], newNav);
  };

  const toggleNavVisibility = (index: number) => {
    const newNav = [...content.topNav];
    newNav[index].isVisible = !newNav[index].isVisible;
    updateContent(['topNav'], newNav);
  };

  // --- Footer Helpers ---
  const addFooterLink = () => {
    const newLink: FooterLink = { id: Date.now().toString(), name: '新链接', path: '/', isVisible: true };
    updateContent(['footer', 'quickLinks'], [...content.footer.quickLinks, newLink]);
  };

  const updateFooterLink = (index: number, key: keyof FooterLink, value: any) => {
    const newLinks = [...content.footer.quickLinks];
    newLinks[index] = { ...newLinks[index], [key]: value };
    updateContent(['footer', 'quickLinks'], newLinks);
  };

  const removeFooterLink = (index: number) => {
    const newLinks = content.footer.quickLinks.filter((_, i) => i !== index);
    updateContent(['footer', 'quickLinks'], newLinks);
  };

  const tabs = [
    { id: 'home', label: '首页布局', icon: Layout },
    { id: 'nav', label: '导航菜单', icon: Menu },
    { id: 'footer', label: '页脚链接', icon: Layers },
    { id: 'about', label: '关于详情', icon: Type },
    { id: 'services', label: '业务问答', icon: MessageSquare },
    { id: 'headers', label: '全局页头', icon: ImageIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">页面内容管理</h1>
           <p className="text-sm text-gray-500 mt-1">控制全站静态文案、板块顺序及动态导航栏名称</p>
        </div>
        <button onClick={handleSave} className={`flex items-center space-x-2 px-8 py-3 rounded-xl transition-all font-black shadow-xl ${isSaved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}>
           {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
           <span>{isSaved ? '已保存' : '发布更改'}</span>
        </button>
      </div>

      <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
         {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
              <tab.icon size={16} />{tab.label}
            </button>
         ))}
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200">
         
         {/* TAB: NAV CONFIGURATION */}
         {activeTab === 'nav' && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl"><Menu size={24}/></div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900">头部导航菜单配置</h3>
                     <p className="text-xs text-gray-500">自定义导航标签名称、调整显示顺序或临时隐藏频道</p>
                  </div>
               </div>

               <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  {content.topNav.map((item, index) => (
                     <div key={item.id} className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-all ${item.isVisible ? 'border-gray-200' : 'opacity-60 grayscale'}`}>
                        <div className="flex items-center gap-4 flex-1">
                           <span className="text-gray-300"><GripVertical size={20}/></span>
                           <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                              <div className="w-full md:w-48">
                                 <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">导航显示名称</label>
                                 <div className="relative">
                                    <Edit3 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"/>
                                    <input 
                                       type="text" 
                                       className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:border-primary outline-none" 
                                       value={item.label} 
                                       onChange={e => updateNavLink(index, e.target.value)} 
                                    />
                                 </div>
                              </div>
                              <div className="hidden md:block">
                                 <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">系统路径</label>
                                 <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{item.path}</code>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => moveNav(index, 'up')} disabled={index === 0} className="p-2 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-20"><ArrowUp size={16}/></button>
                           <button onClick={() => moveNav(index, 'down')} disabled={index === content.topNav.length - 1} className="p-2 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-20"><ArrowDown size={16}/></button>
                           <button onClick={() => toggleNavVisibility(index)} className={`ml-4 p-2 rounded-lg transition-colors ${item.isVisible ? 'text-primary bg-blue-50' : 'text-gray-400 bg-gray-100'}`}>
                              {item.isVisible ? <Eye size={18}/> : <EyeOff size={18}/>}
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </MotionDiv>
         )}

         {activeTab === 'home' && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <section className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                  <div className="flex items-center gap-4 mb-6">
                     <Layers size={24} className="text-blue-500"/>
                     <h3 className="text-lg font-bold text-gray-900">首页板块编排</h3>
                  </div>
                  <div className="space-y-3">
                     {content.home.layout.map((section, index) => (
                        <div key={section.id} className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm ${section.isVisible ? 'border-gray-200' : 'opacity-60 bg-gray-50'}`}>
                           <div className="flex items-center gap-4">
                              <GripVertical size={20} className="text-gray-300" />
                              <span className="font-bold text-gray-800">{section.label}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-2 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp size={16}/></button>
                              <button onClick={() => moveSection(index, 'down')} disabled={index === content.home.layout.length - 1} className="p-2 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown size={16}/></button>
                              <button onClick={() => toggleSectionVisibility(index)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${section.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                 {section.isVisible ? <Eye size={14}/> : <EyeOff size={14}/>} {section.isVisible ? '显示中' : '已隐藏'}
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Section 01: Hero */}
               <section className="space-y-6 pt-6 border-t border-dashed">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                     <span className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded flex items-center justify-center text-sm">01</span>
                     首屏 Hero 文案配置
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">浮动勋章</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={content.home.hero.badge} onChange={e => updateContent(['home', 'hero', 'badge'], e.target.value)} />
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">主标题</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={content.home.hero.titleLine1} onChange={e => updateContent(['home', 'hero', 'titleLine1'], e.target.value)} />
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">高亮文字</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-primary font-bold" value={content.home.hero.titleHighlight} onChange={e => updateContent(['home', 'hero', 'titleHighlight'], e.target.value)} />
                     </div>
                     <div>
                        <MediaSelector label="背景底图" value={content.home.hero.bgImage} onChange={v => updateContent(['home', 'hero', 'bgImage'], v)} />
                     </div>
                  </div>
               </section>
            </MotionDiv>
         )}

         {activeTab === 'footer' && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                     <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">快速导航链接池</h4>
                     <button onClick={addFooterLink} className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 font-bold flex items-center">
                        <Plus size={14} className="mr-1"/> 添加链接
                     </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                     {content.footer.quickLinks.map((link, idx) => (
                        <div key={link.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                           <input type="text" className="flex-1 px-3 py-2 border rounded text-sm" placeholder="链接名称" value={link.name} onChange={e => updateFooterLink(idx, 'name', e.target.value)} />
                           <input type="text" className="flex-1 px-3 py-2 border rounded text-sm font-mono text-gray-600" placeholder="/path" value={link.path} onChange={e => updateFooterLink(idx, 'path', e.target.value)} />
                           <button onClick={() => updateFooterLink(idx, 'isVisible', !link.isVisible)} className={`p-2 rounded ${link.isVisible ? 'text-green-600' : 'text-gray-400'}`}><Eye size={16}/></button>
                           <button onClick={() => removeFooterLink(idx)} className="p-2 text-red-400 hover:text-red-600 rounded"><Trash2 size={16}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </MotionDiv>
         )}

         {activeTab === 'headers' && (
            <div className="grid grid-cols-1 gap-12">
               {/* Fixed: Cast header value to PageHeaderConfig to resolve unknown type access errors */}
               {Object.entries(content.headers).map(([key, headerValue]) => {
                  const header = headerValue as PageHeaderConfig;
                  return (
                    <div key={key} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                       <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-widest">{key} 页面 Banner 配置</h3>
                       <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                          <div className="md:col-span-7 space-y-6">
                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">主标题文案</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl" value={header.title} onChange={e => updateContent(['headers', key, 'title'], e.target.value)} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">副标题文案</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl" value={header.subtitle} onChange={e => updateContent(['headers', key, 'subtitle'], e.target.value)} />
                             </div>
                          </div>
                          <div className="md:col-span-5">
                             <MediaSelector label="背景底图" value={header.backgroundImage} onChange={v => updateContent(['headers', key, 'backgroundImage'], v)} />
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>
         )}

         {/* ABOUT & SERVICES tabs follow similar pattern... */}
      </div>
    </div>
  );
};

export default PageManager;
