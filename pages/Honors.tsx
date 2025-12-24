
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { Honor, HonorCategory } from '../types';

const MotionDiv = motion.div as any;

const Honors: React.FC = () => {
  const [honors, setHonors] = useState<Honor[]>([]);
  const [categories, setCategories] = useState<HonorCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  const header = storageService.getPageContent().headers.honors || {
    title: '荣誉资质',
    subtitle: '实力见证，载誉前行',
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop'
  };

  useEffect(() => {
    const fetchData = async () => {
      const [h, c] = await Promise.all([
        storageService.getHonors(),
        storageService.getHonorCategories()
      ]);
      setHonors(h);
      setCategories(c.sort((a, b) => a.order - b.order));
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderHonorCard = (honor: Honor) => (
      <MotionDiv
         layout
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true, margin: "-50px" }}
         transition={{ duration: 0.4 }}
         key={honor.id}
         className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
      >
         <Link to={`/honors/${honor.id}`} className="block h-full flex flex-col">
            <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden relative mb-6 border border-gray-100">
                {honor.imageUrl ? (
                <img src={honor.imageUrl} alt={honor.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Award size={48} />
                </div>
                )}
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 min-h-[3.5rem] group-hover:text-primary transition-colors">{honor.title}</h3>
            <div className="space-y-1 mt-auto">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">{honor.issuingAuthority}</p>
                <p className="text-xs text-gray-400 flex items-center">
                <Calendar size={12} className="mr-1" /> {honor.issueDate}
                </p>
            </div>
         </Link>
      </MotionDiv>
  );

  const renderEmptyState = () => (
    <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
       <Award size={48} className="mx-auto mb-4 opacity-20" />
       <p>该分类下暂无证书展示</p>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="bg-surface min-h-screen">
      <PageHeader 
        title={header.title} 
        subtitle={header.subtitle}
        backgroundImage={header.backgroundImage}
      />

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-24">
                <button
                   onClick={() => setActiveCategory('all')}
                   className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center mb-1 ${
                      activeCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50'
                   }`}
                >
                   全部资质
                   {activeCategory === 'all' && <CheckCircle2 size={16} />}
                </button>
                {categories.map(cat => (
                   <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center mb-1 ${
                         activeCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                   >
                      {cat.name}
                      {activeCategory === cat.id && <CheckCircle2 size={16} />}
                   </button>
                ))}
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
             {activeCategory === 'all' ? (
                <div className="space-y-16">
                   {categories.map(cat => {
                      const catHonors = honors.filter(h => h.categoryId === cat.id);
                      if (catHonors.length === 0) return null;
                      return (
                         <div key={cat.id}>
                            <div className="mb-6 flex items-center gap-4">
                               <h2 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">{cat.name}</h2>
                               <div className="h-px flex-1 bg-gray-200"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                               {catHonors.map(renderHonorCard)}
                            </div>
                         </div>
                      );
                   })}
                   {honors.length === 0 && renderEmptyState()}
                </div>
             ) : (
                <>
                   <div className="mb-8 flex items-end gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                         {categories.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <div className="h-px flex-1 bg-gray-200 mb-2"></div>
                      <span className="text-sm font-medium text-gray-400 mb-1">
                         共 {honors.filter(h => h.categoryId === activeCategory).length} 项
                      </span>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {honors.filter(h => h.categoryId === activeCategory).map(renderHonorCard)}
                   </div>
                   
                   {honors.filter(h => h.categoryId === activeCategory).length === 0 && renderEmptyState()}
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Honors;
