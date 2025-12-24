
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { HistoryEvent } from '../../types';

const HistoryManager: React.FC = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoryEvent | null>(null);

  const [formData, setFormData] = useState<Partial<HistoryEvent>>({
    year: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    setHistory(storageService.getHistory().sort((a, b) => parseInt(a.year) - parseInt(b.year)));
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该历史事件吗？')) {
      const updated = history.filter(h => h.id !== id);
      storageService.saveHistory(updated);
      setHistory(updated);
    }
  };

  const handleEdit = (item: HistoryEvent) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = history.map(h => h.id === editingItem.id ? { ...h, ...formData } as HistoryEvent : h);
      updated.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      storageService.saveHistory(updated);
      setHistory(updated);
    } else {
      const newItem: HistoryEvent = { ...formData as HistoryEvent, id: Date.now().toString() };
      const updated = [...history, newItem].sort((a, b) => parseInt(a.year) - parseInt(b.year));
      storageService.saveHistory(updated);
      setHistory(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">发展历程管理</h1>
           <p className="text-sm text-gray-500">记录公司重要里程碑事件</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors">
          <Plus size={18} className="mr-2" /> 新增事件
        </button>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-6 space-y-8 py-4">
         {history.map(event => (
            <div key={event.id} className="relative pl-8">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary"></div>
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-2xl font-bold text-primary">{event.year}</span>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(event)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                     </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.description}</p>
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
               <h2 className="text-xl font-bold mb-6">{editingItem ? '编辑事件' : '新增事件'}</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">年份</label>
                        <input type="number" required className="w-full px-3 py-2 border rounded-lg" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">事件标题</label>
                        <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">详细描述</label>
                     <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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

export default HistoryManager;
