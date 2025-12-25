
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, ChevronRight, Calendar, User, Tag, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { PerformanceItem, PerformanceCategory } from '../types';

const MotionDiv = motion.div as any;

const Performances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PerformanceCategory>('招标代理');
  const [performances, setPerformances] = useState<PerformanceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const header = storageService.getPageContent().headers.performances || {
    title: '公司业绩',
    subtitle: '专业积累，铸就品牌信赖',
    backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await storageService.getPerformances();
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPerformances(sorted);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories: { id: PerformanceCategory; label: string; icon: any }[] = [
    { id: '招标代理', label: '招标代理', icon: Briefcase },
    { id: '监理服务', label: '监理服务', icon: FileText },
    { id: '造价咨询', label: '造价咨询', icon: Tag },
    { id: '其他咨询服务', label: '其他咨询', icon: User },
  ];

  const filteredItems = performances.filter(item => {
    const matchesTab = item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.projectNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-surface min-h-screen">
      <PageHeader 
        title={header.title} 
        subtitle={header.subtitle}
        backgroundImage={header.backgroundImage}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          {/* Top Bar with Tabs and Search */}
          <div className="flex flex-col md:flex-row border-b border-gray-100">
            <div className="flex-1 flex overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2 px-8 py-6 font-bold text-sm transition-all whitespace-nowrap border-b-2 relative ${
                      isActive 
                        ? 'text-primary border-primary bg-primary/5' 
                        : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400'} />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="p-4 md:border-l border-gray-100 bg-gray-50/50 flex items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索业绩名称或编号..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm">正在加载业绩数据...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <MotionDiv layout className="space-y-4">
                <AnimatePresence>
                  {filteredItems.map((item, idx) => (
                    <MotionDiv
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id}
                    >
                      <Link 
                        to={`/performances/${item.id}`}
                        className="block group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer relative"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border bg-blue-50 text-blue-700 border-blue-100`}>
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
                                {item.projectNo}
                              </span>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                委托方：{item.client}
                              </div>
                              {item.externalUrl && (
                                <div className="flex items-center gap-1 text-primary">
                                  <ExternalLink size={12} />
                                  含公示链接
                                </div>
                              )}
                              {item.fileUrl && (
                                <div className="flex items-center gap-1 text-emerald-600">
                                  <FileText size={12} />
                                  含证明文件
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 min-w-[140px] border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                            <div className="text-right">
                              <div className="flex items-center text-gray-900 font-bold text-sm">
                                <Calendar size={14} className="mr-1.5 text-gray-400" />
                                {item.date}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1">完成日期</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all">
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </MotionDiv>
                  ))}
                </AnimatePresence>
              </MotionDiv>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="inline-flex p-4 bg-white rounded-full text-gray-300 mb-4 shadow-sm">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">未找到业绩记录</h3>
                <p className="text-gray-500 text-sm">请尝试调整搜索关键词或切换分类</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performances;
