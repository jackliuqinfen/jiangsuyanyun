
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Calendar, Award } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ProjectCase } from '../../types';
import MediaSelector from '../../components/MediaSelector';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectCase | null>(null);

  const [formData, setFormData] = useState<Partial<ProjectCase>>({
    title: '',
    category: '市政工程',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    isFeatured: false,
    imageUrl: ''
  });

  useEffect(() => {
    setProjects(storageService.getProjects());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      const updated = projects.filter(p => p.id !== id);
      storageService.saveProjects(updated);
      setProjects(updated);
    }
  };

  const handleEdit = (item: ProjectCase) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '市政工程',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      isFeatured: false,
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = projects.map(p => p.id === editingItem.id ? { ...p, ...formData } as ProjectCase : p);
      storageService.saveProjects(updated);
      setProjects(updated);
    } else {
      const newItem: ProjectCase = { ...formData as ProjectCase, id: Date.now().toString() };
      const updated = [newItem, ...projects];
      storageService.saveProjects(updated);
      setProjects(updated);
    }
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">项目案例管理</h1>
           <p className="text-sm text-gray-500">管理公司过往的成功案例与工程业绩</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors">
          <Plus size={18} className="mr-2" /> 新增案例
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
               type="text" 
               placeholder="搜索项目名称..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none transition-all"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
            <div className="h-48 relative overflow-hidden bg-gray-100">
              {project.imageUrl ? (
                 <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">无图片</div>
              )}
              {project.isFeatured && (
                 <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full shadow-md">
                    <Award size={16} />
                 </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                 {project.category}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
              <div className="flex justify-end gap-2 border-t pt-4">
                 <button onClick={() => handleEdit(project)} className="p-2 text-gray-500 hover:text-primary"><Edit size={18} /></button>
                 <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingItem ? '编辑项目' : '新增项目'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 text-xl font-bold">&times;</button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">项目名称</label>
                   <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">项目分类</label>
                      <select className="w-full px-3 py-2 border rounded-lg bg-white outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                         <option>市政工程</option>
                         <option>工业厂房</option>
                         <option>住宅工程</option>
                         <option>基础设施</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">交付日期</label>
                      <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                   </div>
                </div>

                <MediaSelector label="项目展示图" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />

                <div className="flex justify-end gap-3 mt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">取消</button>
                   <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">保存项目</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
