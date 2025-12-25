
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter, X, Save, ExternalLink, List, Settings, CheckCircle2, Layout, Type, Calendar, Briefcase, User, Link as LinkIcon, FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { PerformanceItem, PerformanceCategory, PageHeaderConfig } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';
import MediaSelector from '../../components/MediaSelector';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const PerformanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');
  const [performances, setPerformances] = useState<PerformanceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [headerConfig, setHeaderConfig] = useState<PageHeaderConfig>(storageService.getPageContent().headers.performances);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PerformanceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<PerformanceItem>>({
    title: '',
    projectNo: '',
    category: '招标代理',
    client: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    fileUrl: '',
    externalUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await storageService.getPerformances();
    setPerformances(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setHeaderConfig(storageService.getPageContent().headers.performances);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      projectNo: '',
      category: '招标代理',
      client: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      fileUrl: '',
      externalUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: PerformanceItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除此条业绩吗？')) {
      const updated = performances.filter(p => p.id !== id);
      await storageService.savePerformances(updated);
      setPerformances(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let updated;
    if (editingItem) {
      updated = performances.map(p => p.id === editingItem.id ? { ...p, ...formData } as PerformanceItem : p);
    } else {
      const newItem: PerformanceItem = { ...formData as PerformanceItem, id: Date.now().toString() };
      updated = [newItem, ...performances];
    }
    await storageService.savePerformances(updated);
    setPerformances(updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleSaveSettings = () => {
    const content = storageService.getPageContent();
    content.headers.performances = headerConfig;
    storageService.savePageContent(content);
    setIsSettingsSaved(true);
    setTimeout(() => setIsSettingsSaved(false), 2000);
  };

  const filteredItems = performances.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.projectNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">公司业绩管理</h1>
           <p className="text-gray-500 text-sm mt-1">记录完成的各类工程咨询项目，打造企业核心竞争力底座</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
         <button onClick={() => setActiveTab('list')} className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
           <List size={16} /> 业绩列表
         </button>
         <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
           <Settings size={16} /> 页面配置
         </button>
      </div>

      {activeTab === 'list' && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="搜索项目..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <select className="border border-gray-200 rounded-lg px-4 py-2 outline-none bg-white" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
               <option value="all">所有分类</option>
               <option value="招标代理">招标代理</option>
               <option value="监理服务">监理服务</option>
               <option value="造价咨询">造价咨询</option>
               <option value="其他咨询服务">其他咨询服务</option>
            </select>
            <button onClick={handleAddNew} className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-dark">
               <Plus size={18} /> 新增业绩
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-black">
                  <th className="px-6 py-4">项目编号 / 名称</th>
                  <th className="px-6 py-4">委托方</th>
                  <th className="px-6 py-4">分类</th>
                  <th className="px-6 py-4">日期</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="text-gray-400 text-[10px] mb-1">{item.projectNo}</div>
                      <div className="font-bold text-gray-800 line-clamp-1">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.client}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-primary text-[10px] font-bold rounded">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-primary"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionDiv>
      )}

      {activeTab === 'settings' && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold">频道页面配置</h2>
                 {isSettingsSaved && <span className="text-emerald-600 text-sm font-bold flex items-center"><CheckCircle2 size={16} className="mr-1"/> 已保存</span>}
              </div>
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">主标题文案</label>
                       <input type="text" className="w-full px-4 py-3 border rounded-xl" value={headerConfig.title} onChange={e => setHeaderConfig({...headerConfig, title: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">副标题文案</label>
                       <input type="text" className="w-full px-4 py-3 border rounded-xl" value={headerConfig.subtitle} onChange={e => setHeaderConfig({...headerConfig, subtitle: e.target.value})} />
                    </div>
                 </div>
                 <MediaSelector label="Banner 背景图" value={headerConfig.backgroundImage} onChange={url => setHeaderConfig({...headerConfig, backgroundImage: url})} />
                 <div className="flex justify-end pt-4">
                    <button onClick={handleSaveSettings} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center">
                       <Save size={18} className="mr-2" /> 保存页面设置
                    </button>
                 </div>
              </div>
           </div>
        </MotionDiv>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <MotionDiv initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
             <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold">{editingItem ? '编辑业绩' : '新增业绩'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
             </div>
             
             <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">项目名称 *</label>
                      <input type="text" required className="w-full px-4 py-3 border rounded-xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">项目编号 *</label>
                      <input type="text" required className="w-full px-4 py-3 border rounded-xl font-mono" value={formData.projectNo} onChange={e => setFormData({...formData, projectNo: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">所属分类</label>
                      <select className="w-full px-4 py-3 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as PerformanceCategory})}>
                         <option value="招标代理">招标代理</option>
                         <option value="监理服务">监理服务</option>
                         <option value="造价咨询">造价咨询</option>
                         <option value="其他咨询服务">其他咨询服务</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">委托方 / 业主</label>
                      <input type="text" className="w-full px-4 py-3 border rounded-xl" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">完成日期</label>
                      <input type="date" className="w-full px-4 py-3 border rounded-xl" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="block text-xs font-bold text-gray-400 uppercase">附件与外链</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Download size={14}/> 证明文件 (PDF/JPG)</div>
                         <MediaSelector value={formData.fileUrl} onChange={url => setFormData({...formData, fileUrl: url})} />
                      </div>
                      <div className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><LinkIcon size={14}/> 业绩公示网址</div>
                         <input type="url" placeholder="https://..." className="w-full px-4 py-3 border rounded-xl" value={formData.externalUrl} onChange={e => setFormData({...formData, externalUrl: e.target.value})} />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-xs font-bold text-gray-400 uppercase">详细介绍</label>
                   <RichTextEditor value={formData.content || ''} onChange={val => setFormData({...formData, content: val})} className="min-h-[300px]" />
                </div>
             </form>

             <div className="p-6 border-t bg-white flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg">取消</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2 bg-primary text-white rounded-lg font-bold flex items-center">
                   {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18}/> : <Save size={18} className="mr-2"/>} 保存业绩
                </button>
             </div>
          </MotionDiv>
        </div>
      )}
    </div>
  );
};

export default PerformanceManager;
