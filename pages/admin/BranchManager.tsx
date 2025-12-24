import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Branch } from '../../types';

const BranchManager: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Branch | null>(null);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    address: '',
    phone: '',
    manager: '',
    coordinates: { lat: 33.347, lng: 120.163 }
  });

  useEffect(() => {
    setBranches(storageService.getBranches());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该分支机构吗？')) {
      const updated = branches.filter(b => b.id !== id);
      storageService.saveBranches(updated);
      setBranches(updated);
    }
  };

  const handleEdit = (item: Branch) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      manager: '',
      coordinates: { lat: 33.347, lng: 120.163 }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = branches.map(b => b.id === editingItem.id ? { ...b, ...formData } as Branch : b);
      storageService.saveBranches(updated);
      setBranches(updated);
    } else {
      const newItem: Branch = { ...formData as Branch, id: Date.now().toString() };
      const updated = [...branches, newItem];
      storageService.saveBranches(updated);
      setBranches(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">分支机构管理</h1>
           <p className="text-sm text-gray-500">管理公司在各地的分公司与办事处信息</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors">
          <Plus size={18} className="mr-2" /> 新增机构
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {branches.map(branch => (
            <div key={branch.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                  <div className="flex gap-2">
                     <button onClick={() => handleEdit(branch)} className="text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                     <button onClick={() => handleDelete(branch.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
               </div>
               <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                     <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                     {branch.address}
                  </div>
                  <div className="flex items-center">
                     <Phone size={16} className="mr-2 flex-shrink-0 text-gray-400" />
                     {branch.phone}
                  </div>
                  <div className="pl-6 text-xs text-gray-500">
                     负责人: {branch.manager}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
               <h2 className="text-xl font-bold mb-6">{editingItem ? '编辑机构' : '新增机构'}</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">机构名称</label>
                     <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">详细地址</label>
                     <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">联系电话</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">负责人</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} />
                     </div>
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

export default BranchManager;
