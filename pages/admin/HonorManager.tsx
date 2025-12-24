import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Honor } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const HonorManager: React.FC = () => {
  const [honors, setHonors] = useState<Honor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Honor | null>(null);

  const [formData, setFormData] = useState<Partial<Honor>>({
    title: '',
    issueDate: '',
    issuingAuthority: '',
    imageUrl: ''
  });

  useEffect(() => {
    setHonors(storageService.getHonors());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该荣誉吗？')) {
      const updated = honors.filter(h => h.id !== id);
      storageService.saveHonors(updated);
      setHonors(updated);
    }
  };

  const handleEdit = (item: Honor) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      issueDate: new Date().toISOString().split('T')[0],
      issuingAuthority: '',
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = honors.map(h => h.id === editingItem.id ? { ...h, ...formData } as Honor : h);
      storageService.saveHonors(updated);
      setHonors(updated);
    } else {
      const newItem: Honor = { ...formData as Honor, id: Date.now().toString() };
      const updated = [...honors, newItem];
      storageService.saveHonors(updated);
      setHonors(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">荣誉资质管理</h1>
           <p className="text-sm text-gray-500">展示企业获奖证书与资质证明</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors">
          <Plus size={18} className="mr-2" /> 新增荣誉
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {honors.map(honor => (
            <div key={honor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all">
               <div className="aspect-[3/4] bg-gray-100 relative">
                  <img src={honor.imageUrl} alt={honor.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button onClick={() => handleEdit(honor)} className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"><Edit size={20}/></button>
                     <button onClick={() => handleDelete(honor.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 size={20}/></button>
                  </div>
               </div>
               <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] mb-2">{honor.title}</h3>
                  <div className="text-xs text-gray-500 space-y-1">
                     <p>颁发机构: {honor.issuingAuthority}</p>
                     <p>颁发时间: {honor.issueDate}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
               <h2 className="text-xl font-bold mb-6">{editingItem ? '编辑荣誉' : '新增荣誉'}</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">荣誉名称</label>
                     <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  
                  <ImageUpload label="证书图片" value={formData.imageUrl} onChange={b64 => setFormData({...formData, imageUrl: b64})} />

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">颁发机构</label>
                     <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.issuingAuthority} onChange={e => setFormData({...formData, issuingAuthority: e.target.value})} />
                  </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">颁发日期</label>
                     <input type="month" required className="w-full px-3 py-2 border rounded-lg" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">取消</button>
                     <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">保存</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default HonorManager;
