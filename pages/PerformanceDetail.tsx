
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Added ChevronRight to imports
import { ArrowLeft, Calendar, User, Printer, Share2, FileText, ExternalLink, Briefcase, Download, Info, ChevronRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { PerformanceItem } from '../types';

const MotionDiv = motion.div as any;

const PerformanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<PerformanceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const item = await storageService.getPerformanceById(id);
        if (item) {
          setPerformance(item);
        } else {
          navigate('/performances');
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (!performance) return null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 pt-20">
         <div className="container mx-auto px-6 py-4">
            <Link to="/performances" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
               <ArrowLeft size={16} className="mr-1" /> 返回业绩列表
            </Link>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
         <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
         >
            <div className="p-8 md:p-12 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
               <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                     {performance.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-mono border border-gray-200">
                     {performance.projectNo}
                  </span>
               </div>

               <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-8">
                  {performance.title}
               </h1>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <User size={18} className="mr-3 text-primary" />
                     <span>委托单位：<span className="text-gray-900 font-bold">{performance.client}</span></span>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <Calendar size={18} className="mr-3 text-primary" />
                     <span>完成日期：<span className="text-gray-900 font-bold">{performance.date}</span></span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
               <div className="lg:col-span-2 p-8 md:p-12">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                     <Info size={20} className="mr-2 text-primary" /> 业绩详细说明
                  </h3>
                  <div 
                     className="prose prose-lg prose-blue max-w-none text-gray-700 leading-loose"
                     dangerouslySetInnerHTML={{ __html: performance.content || '<p class="text-gray-400 italic">暂无详细正文内容。</p>' }}
                  />
               </div>

               <div className="p-8 md:p-12 bg-gray-50/30">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">相关证明</h3>
                  <div className="space-y-4">
                     {performance.fileUrl ? (
                        <a 
                          href={performance.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-all group shadow-sm"
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                 <FileText size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-gray-900 group-hover:text-primary">业绩证明文件</div>
                                 <div className="text-[10px] text-gray-400 uppercase font-black">Click to Download</div>
                              </div>
                           </div>
                           <Download size={18} className="text-gray-300 group-hover:text-primary" />
                        </a>
                     ) : (
                        <div className="p-4 bg-white border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs">
                           未上传纸质证明扫描件
                        </div>
                     )}

                     {performance.externalUrl ? (
                        <a 
                          href={performance.externalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-all group shadow-sm"
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                                 <ExternalLink size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-gray-900 group-hover:text-primary">业绩公示网址</div>
                                 <div className="text-[10px] text-gray-400 uppercase font-black">Official Publication</div>
                              </div>
                           </div>
                           <ChevronRight size={18} className="text-gray-300 group-hover:text-primary" />
                        </a>
                     ) : (
                        <div className="p-4 bg-white border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs">
                           无外部公示链接
                        </div>
                     )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-3">
                     <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
                        <Printer size={16} /> 打印本页
                     </button>
                     <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
                        <Share2 size={16} /> 转发业绩
                     </button>
                  </div>
               </div>
            </div>
         </MotionDiv>
      </div>
      
      <style>{`
        .tender-content h3 { border-left: 4px solid #2C388B; padding-left: 1rem; }
      `}</style>
    </div>
  );
};

export default PerformanceDetail;
