
import React, { useState } from 'react';
import { ExternalLink, Building2, Gavel, FileText, Globe, MapPin, Search, ChevronRight, Calculator, BookOpen, Layers, Users, Briefcase } from 'lucide-react';
import { storageService } from '../services/storageService';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const links = storageService.getLinks();
  
  // Filter links based on search term
  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = Array.from(new Set(filteredLinks.map(l => l.category)));

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case '政府监管平台': return Building2;
      case '招投标与采购平台': return Gavel;
      case '工程造价与材料信息': return Calculator;
      case '工程技术资料与标准': return BookOpen;
      case 'BIM与工程技术应用': return Layers;
      case '工程人才与企业服务': return Users;
      case '工程管理与施工服务': return Briefcase;
      default: return Globe;
    }
  };

  return (
    <div className="py-16 bg-surface min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">行业资源导航</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            汇集权威网站，助您快速获取行业政策与商机。
          </p>
        </div>

        {/* Local Link Filter Search */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
             <Search className="text-gray-400 mr-3" size={20} />
             <input 
               type="text" 
               placeholder="筛选下方链接列表..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
             />
             {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                >
                  清除
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dynamic Categories */}
          {categories.map((category, idx) => {
             const Icon = getCategoryIcon(category);
             const categoryLinks = filteredLinks.filter(l => l.category === category);
             
             return (
              <motion.div 
                key={category} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-blue-50 text-primary rounded-lg">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-4 content-start">
                  {categoryLinks.map((link) => {
                    let hostname = '';
                    try {
                        hostname = new URL(link.url).hostname;
                    } catch (e) {
                        hostname = link.url;
                    }

                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/30 hover:shadow-sm transition-all bg-white"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 pt-0.5">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1.5 group-hover:bg-white transition-colors">
                                  <img 
                                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`} 
                                      alt={link.title}
                                      className="w-full h-full object-contain"
                                      loading="lazy"
                                  />
                              </div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-gray-800 group-hover:text-primary transition-colors truncate w-full">{link.title}</span>
                                  <ExternalLink size={14} className="text-gray-300 group-hover:text-primary flex-shrink-0 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                              {link.description && (
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2 min-h-[2.5em]">
                                  {link.description}
                                </p>
                              )}
                              <div className="text-[10px] text-gray-400 truncate flex items-center group-hover:text-primary/60 transition-colors">
                                  <Globe size={10} className="mr-1" /> {hostname}
                              </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
             );
          })}

          {/* Important Places Card (Always visible unless filtered out by stricter logic, but for now kept separate or could be data-driven too) */}
          {categories.length > 0 && searchTerm === '' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white h-full"
            >
               <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
                  <div className="p-2 bg-white/10 rounded-lg text-accent">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-xl font-bold">重要办事地点</h2>
                </div>
                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="font-bold text-white mb-1">江苏省政务服务中心</div>
                      <div className="text-xs text-gray-400 flex items-start">
                         <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                         南京市建邺区汉中门大街145号
                      </div>
                   </div>
                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="font-bold text-white mb-1">盐城市行政审批局</div>
                      <div className="text-xs text-gray-400 flex items-start">
                         <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                         盐城市府西路1号
                      </div>
                   </div>
                   <div className="pt-4 mt-4 border-t border-gray-700/50">
                      <a href="https://map.baidu.com" target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                         查看更多办事点 <ChevronRight size={14} className="ml-1" />
                      </a>
                   </div>
                </div>
            </motion.div>
          )}

          {filteredLinks.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
                   <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-600">未找到相关链接</h3>
                <p className="text-gray-400">请尝试更换关键词搜索</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
