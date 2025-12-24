
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Filter } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { NewsItem } from '../../types';
import PermissionGate from '../../components/PermissionGate';

// This is a robust template for any Content Management page
const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    category: '公司新闻',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1932&auto=format&fit=crop'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setNews(storageService.getNews());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条新闻吗？此操作不可恢复。')) {
      const updated = news.filter(n => n.id !== id);
      storageService.saveNews(updated);
      setNews(updated);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '公司新闻',
      summary: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1932&auto=format&fit=crop'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Update
      const updated = news.map(n => n.id === editingItem.id ? { ...n, ...formData } as NewsItem : n);
      storageService.saveNews(updated);
      setNews(updated);
    } else {
      // Create
      const newItem: NewsItem = {
        ...formData as NewsItem,
        id: Date.now().toString(),
      };
      const updated = [newItem, ...news];
      storageService.saveNews(updated);
      setNews(updated);
    }
    setIsModalOpen(false);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">新闻动态管理</h1>
           <p className="text-gray-500 text-sm">发布公司新闻、行业动态及通知公告</p>
        </div>
        <PermissionGate resource="news" action="write">
          <button 
            onClick={handleAddNew}
            className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm"
          >
            <Plus size={18} className="mr-2" /> 发布新闻
          </button>
        </PermissionGate>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索新闻标题..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter size={18} className="text-gray-400" />
           <select 
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
           >
              <option value="all">所有分类</option>
              <option value="公司新闻">公司新闻</option>
              <option value="行业动态">行业动态</option>
              <option value="通知公告">通知公告</option>
           </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">标题</th>
                <th className="px-6 py-4 font-semibold">分类</th>
                <th className="px-6 py-4 font-semibold">发布日期</th>
                <th className="px-6 py-4 font-semibold">状态</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                         {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={item.title}>{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="预览">
                          <Eye size={16} />
                       </button>
                       <PermissionGate resource="news" action="write">
                         <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="编辑"
                         >
                            <Edit size={16} />
                         </button>
                       </PermissionGate>
                       <PermissionGate resource="news" action="delete">
                         <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="删除"
                         >
                            <Trash2 size={16} />
                         </button>
                       </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNews.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                       未找到相关新闻数据
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">{editingItem ? '编辑新闻' : '发布新文章'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              {/* ... form fields remain the same ... */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">标题</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                     <select 
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                     >
                        <option value="公司新闻">公司新闻</option>
                        <option value="行业动态">行业动态</option>
                        <option value="通知公告">通知公告</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">日期</label>
                     <input 
                       type="date" 
                       value={formData.date}
                       onChange={(e) => setFormData({...formData, date: e.target.value})}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                     />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">封面图 URL</label>
                   <input 
                     type="text" 
                     value={formData.imageUrl}
                     onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">摘要</label>
                  <textarea 
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">正文内容</label>
                  <textarea 
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                   <input 
                      type="checkbox" 
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                   />
                   <label htmlFor="published" className="ml-2 text-sm text-gray-700">立即发布</label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   取消
                 </button>
                 <button 
                   type="submit"
                   className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-lg shadow-primary/30"
                 >
                   保存
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
