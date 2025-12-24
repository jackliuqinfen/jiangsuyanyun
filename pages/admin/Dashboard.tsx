import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, Briefcase, Award, ArrowUpRight } from 'lucide-react';
import { storageService } from '../../services/storageService';

const Dashboard: React.FC = () => {
  // Real Data State
  const [stats, setStats] = useState({
    newsCount: 0,
    projectCount: 0,
    serviceCount: 0,
    honorCount: 0
  });

  useEffect(() => {
    setStats({
      newsCount: storageService.getNews().length,
      projectCount: storageService.getProjects().length,
      serviceCount: storageService.getServices().length,
      honorCount: storageService.getHonors().length
    });
  }, []);
  
  // Mock Data for Charts (Enhanced)
  const visitData = [
    { name: '周一', visits: 120 },
    { name: '周二', visits: 132 },
    { name: '周三', visits: 101 },
    { name: '周四', visits: 134 },
    { name: '周五', visits: 190 },
    { name: '周六', visits: 230 },
    { name: '周日', visits: 210 },
  ];

  const projectData = [
    { name: '市政', count: 4 },
    { name: '住宅', count: 8 },
    { name: '商业', count: 3 },
    { name: '工业', count: 5 },
  ];

  const statCards = [
    { title: '新闻动态', value: stats.newsCount, icon: FileText, color: 'bg-blue-500', link: '/admin/news' },
    { title: '项目案例', value: stats.projectCount, icon: Briefcase, color: 'bg-green-500', link: '/admin/projects' },
    { title: '服务领域', value: stats.serviceCount, icon: Users, color: 'bg-orange-500', link: '/admin/services' },
    { title: '荣誉资质', value: stats.honorCount, icon: Award, color: 'bg-purple-500', link: '/admin/honors' },
  ];

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-gray-800">管理控制台</h1>
         <p className="text-gray-500 text-sm mt-1">欢迎回来，这里是网站运营数据的实时概览</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between group hover:shadow-md transition-all">
               <div className="flex items-center">
                  <div className={`${stat.color} p-4 rounded-xl text-white mr-4 shadow-lg shadow-gray-200`}>
                     <Icon size={24} />
                  </div>
                  <div>
                     <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{stat.title}</p>
                     <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                  </div>
               </div>
               <ArrowUpRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800">本周访问趋势</h3>
             <select className="text-xs border-none bg-gray-50 rounded px-2 py-1 text-gray-600 outline-none">
                <option>最近7天</option>
                <option>最近30天</option>
             </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="visits" stroke="#2C388B" strokeWidth={3} dot={{r: 4, fill: '#2C388B', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">项目分布概况</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="count" fill="#4a5ed1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
