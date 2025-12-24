
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, X, Loader2, Building2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Branch } from '../../types';

const BranchManager: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Branch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    address: '',
    phone: '',
    manager: '',
    coordinates: { lat: 33.347, lng: 120.163 }
  });

  useEffect(() => {
    storageService.getBranches().then(setBranches);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`确认删除 [${name}] 分支机构吗？\n删除后该机构的联系方式将从官网“分支机构”页面移除。`)) {
      const updated = branches.filter(b => b.id !== id);
      await storageService.saveBranches(updated);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return alert("机构名称必填");
    
    setIsSubmitting(true);
    let updated;
    if (editingItem) {
      updated = branches.map(b => b.id === editingItem.id ? { ...b, ...formData } as Branch : b);
    } else {
      const newItem: Branch = { ...formData as Branch, id: Date.now().toString() };
      updated = [...branches, newItem];
    }
    await storageService.saveBranches(updated);
    setBranches(updated);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">分支机构管理</h1>
           <p className="text-sm text-gray-500 mt-1">管理公司在全省各地的服务网点与办公场所</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center hover:bg-primary-dark transition-all font-bold shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> 新增网点
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {branches.map(branch => (
            <div key={branch.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-primary/20 transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                     <Building2 size={24} />
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => handleEdit(branch)} className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"><Edit size={16}/></button>
                     <button onClick={() => handleDelete(branch.id, branch.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                  </div>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-4">{branch.name}</h3>
               <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-start">
                     <MapPin size={16} className="mr-3 mt-0.5 flex-shrink-0 text-gray-400" />
                     <span className="leading-relaxed">{branch.address}</span>
                  </div>
                  <div className="flex items-center">
                     <Phone size={16} className="mr-3 flex-shrink-0 text-gray-400" />
                     <span className="font-bold text-gray-700">{branch.phone}</span>
                  </div>
                  <div className="pl-7 text-xs flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     驻点负责人: <span className="font-bold text-gray-900">{branch.manager}</span>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-10 overflow-hidden flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900">{editingItem ? '编辑网点' : '开设新网点'}</h2>
                     <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">Branch Identity Management</p>
                  </div>
                  <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24}/></button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">分支机构全称</label>
                     <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如：南京分公司" />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">办公详细地址</label>
                     <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="省 市 区 街道/写字楼 房号" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">服务热线</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0515-XXXXXXX" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">驻点总负责人</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} />
                     </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-8">
                     <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors">取消</button>
                     <button type="submit" disabled={isSubmitting} className="px-10 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : '保存网点'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default BranchManager;
