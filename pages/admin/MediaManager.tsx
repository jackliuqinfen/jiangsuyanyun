
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Filter, Image as ImageIcon, Video, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { MediaItem } from '../../types';
import PermissionGate from '../../components/PermissionGate';
import ImageUpload from '../../components/ImageUpload';

const MediaManager: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    name: '',
    type: 'image',
    category: '未分类',
    url: '',
  });
  
  // Custom video link input state
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    setMedia(storageService.getMedia());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除此资源吗？')) {
      const updated = media.filter(m => m.id !== id);
      storageService.saveMedia(updated);
      setMedia(updated);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      type: 'image',
      category: '未分类',
      url: ''
    });
    setVideoLink('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MediaItem = {
      ...formData as MediaItem,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      url: formData.type === 'video' ? videoLink : formData.url,
      size: formData.type === 'image' ? 'Local' : 'External Link'
    };

    const updated = [newItem, ...media];
    storageService.saveMedia(updated);
    setMedia(updated);
    setIsModalOpen(false);
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">媒体资源库</h1>
           <p className="text-gray-500 text-sm">集中管理图片与视频素材，可快速复制链接至其他模块使用</p>
        </div>
        <PermissionGate resource="media" action="write">
          <button 
            onClick={handleAddNew}
            className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm"
          >
            <Plus size={18} className="mr-2" /> 上传资源
          </button>
        </PermissionGate>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索资源名称..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter size={18} className="text-gray-400" />
           <select 
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
           >
              <option value="all">所有类型</option>
              <option value="image">图片</option>
              <option value="video">视频</option>
           </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
         {filteredMedia.map(item => (
            <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all relative">
               <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {item.type === 'image' ? (
                     <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <Video size={32} />
                     </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button 
                        onClick={() => copyToClipboard(item.url, item.id)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors"
                        title="复制链接"
                     >
                        {copiedId === item.id ? <Check size={18} className="text-green-600"/> : <LinkIcon size={18} />}
                     </button>
                     <PermissionGate resource="media" action="delete">
                        <button 
                           onClick={() => handleDelete(item.id)}
                           className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                           title="删除"
                        >
                           <Trash2 size={18} />
                        </button>
                     </PermissionGate>
                  </div>
                  
                  <div className="absolute top-2 left-2">
                     {item.type === 'image' ? (
                        <span className="bg-blue-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">IMG</span>
                     ) : (
                        <span className="bg-red-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">VID</span>
                     )}
                  </div>
               </div>
               
               <div className="p-3">
                  <h4 className="font-bold text-gray-800 text-sm truncate mb-1" title={item.name}>{item.name}</h4>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                     <span>{item.category}</span>
                     <span>{item.uploadDate}</span>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {filteredMedia.length === 0 && (
         <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <ImageIcon size={24} />
            </div>
            <p className="text-gray-500">暂无媒体资源，点击右上角上传</p>
         </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
               <h2 className="text-xl font-bold mb-6">上传新资源</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">资源名称</label>
                     <input 
                        type="text" 
                        required 
                        className="w-full px-3 py-2 border rounded-lg" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="例如：项目现场图01"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">资源类型</label>
                        <select 
                           className="w-full px-3 py-2 border rounded-lg bg-white"
                           value={formData.type}
                           onChange={e => setFormData({...formData, type: e.target.value as any})}
                        >
                           <option value="image">图片 (本地上传)</option>
                           <option value="video">视频 (外部链接)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                        <select 
                           className="w-full px-3 py-2 border rounded-lg bg-white"
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                           <option>工程现场</option>
                           <option>团队风采</option>
                           <option>企业荣誉</option>
                           <option>宣传资料</option>
                           <option>未分类</option>
                        </select>
                     </div>
                  </div>

                  {formData.type === 'image' ? (
                     <ImageUpload 
                        label="选择图片" 
                        value={formData.url} 
                        onChange={b64 => setFormData({...formData, url: b64})} 
                     />
                  ) : (
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">视频链接 (YouTube/Youku/MP4)</label>
                        <input 
                           type="text" 
                           required 
                           className="w-full px-3 py-2 border rounded-lg" 
                           value={videoLink} 
                           onChange={e => setVideoLink(e.target.value)}
                           placeholder="https://..."
                        />
                     </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                     <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">保存资源</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default MediaManager;
