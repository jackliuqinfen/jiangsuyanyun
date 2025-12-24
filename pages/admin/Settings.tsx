
import React, { useState } from 'react';
import { Save, CheckCircle2, Eye } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SiteSettings } from '../../types';
import MediaSelector from '../../components/MediaSelector';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">品牌视觉识别 (Logo 系统)</h2>
          
          <div className="mb-10 bg-gray-950 p-8 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-4 left-4 flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                <Eye size={12} /> 实时组合预览 (Dark Mode Preview)
             </div>
             <div className="flex items-center justify-center space-x-4 h-16 md:h-20 border border-white/5 rounded-xl bg-white/[0.02]">
                {settings.graphicLogoUrl ? <img src={settings.graphicLogoUrl} alt="G-Logo" className="h-full w-auto object-contain" /> : <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />}
                {settings.textLogoUrl ? <img src={settings.textLogoUrl} alt="T-Logo" className="h-[60%] w-auto object-contain brightness-100" /> : <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <MediaSelector label="图形 Logo" value={settings.graphicLogoUrl} onChange={url => setSettings({...settings, graphicLogoUrl: url})} />
            </div>
            <div className="space-y-6">
               <MediaSelector label="文本 Logo (建议白色底透明背景)" value={settings.textLogoUrl} onChange={url => setSettings({...settings, textLogoUrl: url})} />
            </div>
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
