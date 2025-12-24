
import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SiteSettings } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleGraphicLogoChange = (base64: string) => {
    setSettings(prev => ({ ...prev, graphicLogoUrl: base64 }));
  };

  const handleTextLogoChange = (base64: string) => {
    setSettings(prev => ({ ...prev, textLogoUrl: base64 }));
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
           <p className="text-gray-500 text-sm mt-1">配置网站的基本信息、品牌标识及联系方式</p>
        </div>
        {isSaved && (
          <span className="text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded animate-in fade-in slide-in-from-top-2">
             <CheckCircle2 size={16} className="mr-2"/> 保存成功
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Visual Identity */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">视觉识别系统 (Logo 分离)</h2>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">网站名称</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">主题主色调</label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        name="themeColor"
                        value={settings.themeColor}
                        onChange={handleChange}
                        className="h-12 w-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      name="themeColor"
                      value={settings.themeColor}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <ImageUpload 
                    label="图形 Logo (始终保持彩色)" 
                    value={settings.graphicLogoUrl} 
                    onChange={handleGraphicLogoChange} 
                 />
                 <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                      提示：图形 Logo 通常是您的品牌徽标。
                    </p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100">
               <ImageUpload 
                  label="文本 Logo (上传白色，系统将根据背景自动反色)" 
                  value={settings.textLogoUrl} 
                  onChange={handleTextLogoChange} 
                  className="max-w-md"
               />
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-bold text-primary mb-1">智能变色说明：</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    为了确保最佳视觉效果，请务必上传<b>纯白色且背景透明</b>的文本部分。
                    系统在深色背景下将显示原色（白色），在白色背景下会自动将其渲染为黑色。
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">联系信息配置</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">联系电话</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">联系邮箱</label>
              <input
                type="text"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">公司地址</label>
              <textarea
                name="contactAddress"
                rows={2}
                value={settings.contactAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
             <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">版权信息</label>
              <input
                type="text"
                name="copyrightText"
                value={settings.copyrightText}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 font-bold shadow-lg shadow-primary/30"
            style={{ backgroundColor: settings.themeColor }}
          >
            <Save size={20} />
            <span>保存全局更改</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
