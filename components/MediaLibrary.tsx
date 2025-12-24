
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Trash2, Filter, Image as ImageIcon, Video, Link as LinkIcon, Copy, Check, FolderOpen, Upload, Grid, List as ListIcon, X, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MediaItem, MediaCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaLibraryProps {
  mode?: 'manage' | 'select';
  onSelect?: (url: string) => void;
  allowedTypes?: ('image' | 'video')[];
  initialCategory?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  mode = 'manage', 
  onSelect, 
  allowedTypes = ['image', 'video'],
  initialCategory = 'all'
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'image' as 'image' | 'video',
    category: 'site',
    url: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMedia = storageService.getMedia();
    const allCats = storageService.getMediaCategories();
    
    // Update counts
    const updatedCats = allCats.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? allMedia.length 
        : allMedia.filter(m => m.category === cat.id).length
    }));

    setMedia(allMedia);
    setCategories(updatedCats);
  };

  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesType = allowedTypes.includes(item.type);
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [media, searchTerm, activeCategory, allowedTypes]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除此资源吗？')) {
      const updated = media.filter(m => m.id !== id);
      storageService.saveMedia(updated);
      loadData();
    }
  };

  const handleCopy = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("本地存储限制，请上传 2MB 以内的图片");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadForm(prev => ({ 
        ...prev, 
        url: reader.result as string,
        name: prev.name || file.name.split('.')[0]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MediaItem = {
      id: Date.now().toString(),
      name: uploadForm.name || '未命名资源',
      type: uploadForm.type,
      category: uploadForm.category,
      url: uploadForm.url,
      uploadDate: new Date().toISOString().split('T')[0],
      size: uploadForm.type === 'image' ? 'Local' : 'External'
    };

    const updated = [newItem, ...media];
    storageService.saveMedia(updated);
    loadData();
    setIsUploadModalOpen(false);
    setUploadForm({ name: '', type: 'image', category: 'site', url: '' });
  };

  const handleItemClick = (item: MediaItem) => {
    if (mode === 'select') {
      setSelectedId(item.id);
      if (onSelect) onSelect(item.url);
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Left Sidebar: Categories */}
      <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <FolderOpen size={14} className="mr-2" /> 素材分类
          </h3>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white font-bold' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-4 bg-white border-t border-gray-200">
           <button 
             onClick={() => setIsUploadModalOpen(true)}
             className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-primary-dark transition-colors"
           >
             <Plus size={16} className="mr-2" /> 上传素材
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索素材名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Grid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <ListIcon size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
          {filteredMedia.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredMedia.map(item => (
                  <motion.div 
                    layout
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group relative aspect-square bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                      selectedId === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <Video size={32} />
                      </div>
                    )}

                    {/* Checkmark for selection */}
                    {selectedId === item.id && (
                      <div className="absolute top-2 right-2 z-20 text-primary bg-white rounded-full">
                        <CheckCircle2 size={24} fill="currentColor" className="text-white" />
                      </div>
                    )}

                    {/* Overlay for Management Mode */}
                    {mode === 'manage' && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => handleCopy(item.url, item.id, e)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-primary transition-colors"
                          title="复制链接"
                        >
                          {copiedId === item.id ? <CheckCircle2 size={18} className="text-green-500"/> : <LinkIcon size={18} />}
                        </button>
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                    
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[10px] text-white font-medium truncate">{item.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 divide-y overflow-hidden">
                {filteredMedia.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-blue-50' : ''}`}
                  >
                     <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                        {item.type === 'image' ? <img src={item.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white"><Video size={20}/></div>}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.uploadDate} · {item.size}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        {mode === 'manage' && (
                           <>
                              <button onClick={(e) => handleCopy(item.url, item.id, e)} className="p-2 text-gray-400 hover:text-primary"><LinkIcon size={16}/></button>
                              <button onClick={(e) => handleDelete(item.id, e)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                           </>
                        )}
                        {selectedId === item.id && <Check className="text-primary" size={20} />}
                     </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon size={32} />
              </div>
              <p className="text-sm">暂无符合条件的素材</p>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 text-primary font-bold hover:underline"
              >
                立即上传新素材
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsUploadModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900">上传至云库</h2>
                 <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">素材名称</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                      value={uploadForm.name} 
                      onChange={e => setUploadForm({...uploadForm, name: e.target.value})}
                      placeholder="取个好名字方便搜索"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">素材类型</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                        value={uploadForm.type}
                        onChange={e => setUploadForm({...uploadForm, type: e.target.value as any})}
                      >
                         <option value="image">图片</option>
                         <option value="video">视频 (外部链接)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">存入分类</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-lg bg-white outline-none"
                        value={uploadForm.category}
                        onChange={e => setUploadForm({...uploadForm, category: e.target.value})}
                      >
                         {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                 </div>

                 {uploadForm.type === 'image' ? (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">选择文件</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                       >
                          {uploadForm.url ? (
                            <img src={uploadForm.url} className="h-32 w-full object-contain mb-2" />
                          ) : (
                            <Upload className="text-gray-300 mb-2" size={32} />
                          )}
                          <p className="text-sm font-medium text-gray-600">{uploadForm.url ? '点击更换文件' : '点击选择图片'}</p>
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                 ) : (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">视频 URL</label>
                       <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" 
                            value={uploadForm.url} 
                            onChange={e => setUploadForm({...uploadForm, url: e.target.value})}
                            placeholder="https://..."
                          />
                       </div>
                    </div>
                 )}

                 <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium">取消</button>
                    <button type="submit" className="px-8 py-2 bg-primary text-white rounded-lg font-bold shadow-lg hover:shadow-primary/30 transition-all">确认上传并存库</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaLibrary;
