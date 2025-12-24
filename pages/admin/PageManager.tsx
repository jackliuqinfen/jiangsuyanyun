import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PageContent, PageHeaderConfig } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const PageManager: React.FC = () => {
  const [content, setContent] = useState<PageContent>(storageService.getPageContent());
  const [activeTab, setActiveTab] = useState<'headers' | 'home' | 'about' | 'services'>('home');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    storageService.savePageContent(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Helper to update deep nested state
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">页面内容管理</h1>
           <p className="text-sm text-gray-500">编辑网站各页面的静态文案、图片与板块配置</p>
        </div>
        <button 
           onClick={handleSave} 
           className="flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-all font-bold shadow-lg"
        >
           {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
           <span>{isSaved ? '已保存' : '保存更改'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2">
         {['home', 'about', 'services', 'headers'].map(tab => (
            <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
               {tab === 'home' && '首页配置'}
               {tab === 'about' && '关于我们'}
               {tab === 'services' && '业务与问答'}
               {tab === 'headers' && '页面页头(Banner)'}
            </button>
         ))}
      </div>

      <div className="bg-white p-8 rounded-b-xl shadow-sm border border-gray-200 space-y-8">
         
         {/* --- HOME TAB --- */}
         {activeTab === 'home' && (
            <>
               <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Hero 区域 (首屏)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">小标题 (Badge)</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.home.hero.badge} onChange={e => updateContent(['home', 'hero', 'badge'], e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">主标题第一行</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.home.hero.titleLine1} onChange={e => updateContent(['home', 'hero', 'titleLine1'], e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">高亮标题</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.home.hero.titleHighlight} onChange={e => updateContent(['home', 'hero', 'titleHighlight'], e.target.value)} />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">描述文本</label>
                        <textarea rows={2} className="w-full px-3 py-2 border rounded-lg" value={content.home.hero.description} onChange={e => updateContent(['home', 'hero', 'description'], e.target.value)} />
                     </div>
                     <ImageUpload label="Hero 背景图" value={content.home.hero.bgImage} onChange={v => updateContent(['home', 'hero', 'bgImage'], v)} />
                  </div>
               </section>

               <section className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">数据统计栏</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                           <div className="mb-2">
                              <label className="text-xs text-gray-500">数值 {i}</label>
                              <input type="text" className="w-full px-2 py-1 border rounded" value={(content.home.stats as any)[`stat${i}`].value} onChange={e => updateContent(['home', 'stats', `stat${i}`, 'value'], e.target.value)} />
                           </div>
                           <div>
                              <label className="text-xs text-gray-500">标签 {i}</label>
                              <input type="text" className="w-full px-2 py-1 border rounded" value={(content.home.stats as any)[`stat${i}`].label} onChange={e => updateContent(['home', 'stats', `stat${i}`, 'label'], e.target.value)} />
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">流程板块</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">板块标题</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.home.process.title} onChange={e => updateContent(['home', 'process', 'title'], e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">板块描述</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.home.process.description} onChange={e => updateContent(['home', 'process', 'description'], e.target.value)} />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {content.home.process.steps.map((step, idx) => (
                        <div key={idx} className="p-3 border rounded-lg">
                           <p className="text-xs font-bold text-gray-400 mb-2">步骤 {idx + 1}</p>
                           <input type="text" className="w-full px-2 py-1 border rounded mb-2" value={step.title} onChange={e => {
                              const newSteps = [...content.home.process.steps];
                              newSteps[idx].title = e.target.value;
                              updateContent(['home', 'process', 'steps'], newSteps);
                           }} />
                           <input type="text" className="w-full px-2 py-1 border rounded" value={step.desc} onChange={e => {
                              const newSteps = [...content.home.process.steps];
                              newSteps[idx].desc = e.target.value;
                              updateContent(['home', 'process', 'steps'], newSteps);
                           }} />
                        </div>
                     ))}
                  </div>
               </section>
            </>
         )}

         {/* --- ABOUT TAB --- */}
         {activeTab === 'about' && (
            <>
               <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">公司简介板块</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">标题</label>
                           <input type="text" className="w-full px-3 py-2 border rounded-lg" value={content.about.intro.title} onChange={e => updateContent(['about', 'intro', 'title'], e.target.value)} />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">段落 1</label>
                           <textarea rows={4} className="w-full px-3 py-2 border rounded-lg" value={content.about.intro.content1} onChange={e => updateContent(['about', 'intro', 'content1'], e.target.value)} />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">段落 2</label>
                           <textarea rows={4} className="w-full px-3 py-2 border rounded-lg" value={content.about.intro.content2} onChange={e => updateContent(['about', 'intro', 'content2'], e.target.value)} />
                        </div>
                     </div>
                     <div>
                        <ImageUpload label="简介配图" value={content.about.intro.imageUrl} onChange={v => updateContent(['about', 'intro', 'imageUrl'], v)} />
                     </div>
                  </div>
               </section>

               <section className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">企业文化</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">企业使命</label>
                        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={content.about.culture.mission} onChange={e => updateContent(['about', 'culture', 'mission'], e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">核心价值观</label>
                        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={content.about.culture.values} onChange={e => updateContent(['about', 'culture', 'values'], e.target.value)} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">管理理念</label>
                        <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={content.about.culture.management} onChange={e => updateContent(['about', 'culture', 'management'], e.target.value)} />
                     </div>
                  </div>
               </section>
            </>
         )}

         {/* --- SERVICES TAB --- */}
         {activeTab === 'services' && (
            <>
               <section className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">常见问题解答 (FAQ)</h3>
                  {content.services.faqs.map((faq, idx) => (
                     <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                        <span className="font-bold text-gray-400 mt-2">{idx + 1}</span>
                        <div className="flex-1 space-y-2">
                           <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-lg font-bold" 
                              value={faq.q} 
                              onChange={e => {
                                 const newFaqs = [...content.services.faqs];
                                 newFaqs[idx].q = e.target.value;
                                 updateContent(['services', 'faqs'], newFaqs);
                              }}
                              placeholder="问题"
                           />
                           <textarea 
                              rows={2} 
                              className="w-full px-3 py-2 border rounded-lg" 
                              value={faq.a} 
                              onChange={e => {
                                 const newFaqs = [...content.services.faqs];
                                 newFaqs[idx].a = e.target.value;
                                 updateContent(['services', 'faqs'], newFaqs);
                              }}
                              placeholder="回答"
                           />
                        </div>
                        <button 
                           onClick={() => {
                              const newFaqs = content.services.faqs.filter((_, i) => i !== idx);
                              updateContent(['services', 'faqs'], newFaqs);
                           }}
                           className="text-red-500 hover:bg-red-50 p-2 rounded"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
                  <button 
                     onClick={() => updateContent(['services', 'faqs'], [...content.services.faqs, { q: '', a: '' }])}
                     className="text-primary font-medium text-sm flex items-center hover:underline"
                  >
                     <Plus size={16} className="mr-1" /> 添加常见问题
                  </button>
               </section>
            </>
         )}

         {/* --- HEADERS TAB --- */}
         {activeTab === 'headers' && (
            <div className="space-y-8">
               {/* Fix: cast Object.entries to explicit [string, PageHeaderConfig][] to avoid "unknown" type error on header properties */}
               {(Object.entries(content.headers) as [string, PageHeaderConfig][]).map(([key, header]) => (
                  <div key={key} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 capitalize">{key} 页面头部</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">主标题</label>
                              <input 
                                 type="text" 
                                 className="w-full px-3 py-2 border rounded-lg" 
                                 value={header.title} 
                                 onChange={e => updateContent(['headers', key, 'title'], e.target.value)} 
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">副标题</label>
                              <input 
                                 type="text" 
                                 className="w-full px-3 py-2 border rounded-lg" 
                                 value={header.subtitle} 
                                 onChange={e => updateContent(['headers', key, 'subtitle'], e.target.value)} 
                              />
                           </div>
                        </div>
                        <div>
                           <ImageUpload 
                              label="背景图片" 
                              value={header.backgroundImage} 
                              onChange={v => updateContent(['headers', key, 'backgroundImage'], v)} 
                           />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default PageManager;