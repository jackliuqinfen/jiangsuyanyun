
import React, { useState, useEffect, useRef } from 'react';
import { Save, CheckCircle2, Eye, Sparkles, Database, Download, Upload, HardDrive } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SiteSettings } from '../../types';
import MediaSelector from '../../components/MediaSelector';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettingsSync());
  const [isSaved, setIsSaved] = useState(false);
  const [storageUsage, setStorageUsage] = useState<string>('0');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStorageUsage(storageService.getStorageUsage());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = async () => {
    const data = await storageService.exportSystemData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yanyun_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    if (window.confirm('⚠️ 警告：导入数据将覆盖当前系统的所有内容（包括文章、项目、图片等）。\n\n确定要继续吗？建议先导出备份。')) {
      fileInputRef.current?.click();
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const json = event.target?.result as string;
      if (json) {
        const result = await storageService.importSystemData(json);
        if (result.success) {
          alert('数据导入成功！页面将刷新以应用更改。');
          window.location.reload();
        } else {
          alert(`导入失败: ${result.message}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">全局系统设置</h1>
           <p className="text-gray-500 text-sm mt-1">配置网站品牌标识及联系方式，集成全站媒体库</p>
        </div>
        {isSaved && (
          <span className="text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded">
             <CheckCircle2 size={16} className="mr-2"/> 保存成功
          </span>
        )}
      </div>

      {/* Data Maintenance Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <Database size={20} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-gray-900">数据维护与迁移</h2>
               <p className="text-xs text-gray-500">本系统为纯前端演示版，数据存储在本地浏览器。更换电脑前请务必导出数据。</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-2">
               <div className="flex justify-between text-sm font-bold text-gray-700">
                  <span className="flex items-center gap-2"><HardDrive size={16}/> 本地存储用量</span>
                  <span className={parseFloat(storageUsage) > 4000 ? 'text-red-500' : 'text-primary'}>{storageUsage} KB</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                     className={`h-2.5 rounded-full ${parseFloat(storageUsage) > 4000 ? 'bg-red-500' : 'bg-primary'}`} 
                     style={{ width: `${Math.min((parseFloat(storageUsage) / 5120) * 100, 100)}%` }}
                  ></div>
               </div>
               <p className="text-[10px] text-gray-400">浏览器通常限制为 5MB (5120KB)。若图片过多，请使用外部图床链接。</p>
            </div>

            <div className="flex gap-4">
               <button 
                  type="button"
                  onClick={handleExport}
                  className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-primary font-bold gap-2 group"
               >
                  <Download size={24} className="group-hover:-translate-y-1 transition-transform"/>
                  <span>导出全站备份 (JSON)</span>
               </button>
               
               <button 
                  type="button"
                  onClick={handleImportClick}
                  className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-colors text-gray-600 font-bold gap-2 group"
               >
                  <Upload size={24} className="group-hover:-translate-y-1 transition-transform"/>
                  <span>导入恢复数据</span>
               </button>
               <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileImport} className="hidden" />
            </div>
         </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">品牌视觉识别 (Logo 系统)</h2>
          
          <div className="mb-10 bg-gray-950 p-8 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-4 left-4 flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                <Eye size={12} /> 实时组合预览 (Dark Mode Preview)
             </div>
             <div className="flex items-center justify-center space-x-4 h-16 md:h-20 border border-white/5 rounded-xl bg-white/[0.02]">
                {settings.graphicLogoUrl ? <img src={settings.graphicLogoUrl} alt="G-Logo" className="h-full w-auto object-contain" /> : <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />}
                {settings.textLogoUrl ? <img src={settings.textLogoUrl} alt="T-Logo" className="h-full w-auto object-contain brightness-100" /> : <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
               <MediaSelector label="图形 Logo" value={settings.graphicLogoUrl} onChange={url => setSettings({...settings, graphicLogoUrl: url})} />
            </div>
            <div className="space-y-6">
               <MediaSelector label="文本 Logo (建议白色底透明背景)" value={settings.textLogoUrl} onChange={url => setSettings({...settings, textLogoUrl: url})} />
            </div>
            <div className="space-y-6">
               <MediaSelector label="浏览器图标 (Favicon - 建议32x32)" value={settings.faviconUrl} onChange={url => setSettings({...settings, faviconUrl: url})} />
            </div>
          </div>
        </div>

        {/* Anniversary Settings */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                 <Sparkles size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">营销与活动配置</h2>
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div>
                    <span className="block font-bold text-gray-800">8 周年庆典弹窗</span>
                    <span className="text-xs text-gray-500">开启后，用户访问首页时将看到全屏庆祝动画（每位访客仅显示一次）</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                       type="checkbox" 
                       name="enableAnniversary" 
                       className="sr-only peer" 
                       checked={settings.enableAnniversary || false} 
                       onChange={handleToggle} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                 </label>
              </div>

              {settings.enableAnniversary && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-l-4 border-amber-200 bg-amber-50/30 rounded-r-xl">
                    <div className="col-span-2 md:col-span-1">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">庆典主标题</label>
                       <input 
                          type="text" 
                          name="anniversaryTitle" 
                          value={settings.anniversaryTitle || '辉煌八载 · 智绘未来'} 
                          onChange={handleChange} 
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                       />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">顶部徽章年份</label>
                       <input 
                          type="text" 
                          name="anniversaryBadgeLabel" 
                          value={settings.anniversaryBadgeLabel || '2017 - 2025'} 
                          onChange={handleChange} 
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">副标题 / 描述</label>
                       <input 
                          type="text" 
                          name="anniversarySubtitle" 
                          value={settings.anniversarySubtitle || '感恩一路同行，共鉴品质工程'} 
                          onChange={handleChange} 
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                       />
                    </div>
                 </div>
              )}
           </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">网站名称</label>
              <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">联系电话</label>
              <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center space-x-2 bg-primary text-white px-10 py-4 rounded-xl hover:bg-primary-dark transition-all font-bold shadow-xl shadow-primary/30">
            <Save size={20} />
            <span>发布全局设置</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
