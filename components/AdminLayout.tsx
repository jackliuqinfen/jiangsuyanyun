
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings, Users, Image, LogOut, Building, Globe, Award, Hexagon, Compass, Layout, History, UserCheck } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SiteSettings, ResourceType } from '../types';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(storageService.getSettings());
  const [currentUser, setCurrentUser] = useState(storageService.getCurrentUser());
  const [currentRole, setCurrentRole] = useState(storageService.getCurrentUserRole());

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
    } else {
      setCurrentUser(user);
      setCurrentRole(storageService.getCurrentUserRole());
    }
  }, [navigate]);

  const handleLogout = () => {
    storageService.logout();
    navigate('/admin/login');
  };

  const menuItems: { name: string; path: string; icon: any; resource?: ResourceType }[] = [
    { name: '仪表盘', path: '/admin/dashboard', icon: LayoutDashboard }, // No resource needed, open to all valid users
    { name: '页面内容', path: '/admin/pages', icon: Layout, resource: 'pages' },
    { name: '新闻管理', path: '/admin/news', icon: FileText, resource: 'news' },
    { name: '项目管理', path: '/admin/projects', icon: Briefcase, resource: 'projects' },
    { name: '服务管理', path: '/admin/services', icon: Hexagon, resource: 'services' }, 
    { name: '分支机构', path: '/admin/branches', icon: Building, resource: 'branches' },
    { name: '合作伙伴', path: '/admin/partners', icon: Users, resource: 'partners' },
    { name: '核心团队', path: '/admin/team', icon: UserCheck, resource: 'team' },
    { name: '发展历程', path: '/admin/history', icon: History, resource: 'history' },
    { name: '荣誉资质', path: '/admin/honors', icon: Award, resource: 'honors' },
    { name: '网址导航', path: '/admin/navigation', icon: Compass, resource: 'navigation' },
    { name: '媒体资源', path: '/admin/media', icon: Image, resource: 'media' },
    { name: '全局设置', path: '/admin/settings', icon: Settings, resource: 'settings' },
    { name: '用户与权限', path: '/admin/users', icon: Users, resource: 'users' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col shadow-xl z-20" style={{ backgroundColor: siteSettings.themeColor }}>
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">后台管理系统</h2>
          <p className="text-xs text-white/60 mt-1">{siteSettings.siteName}</p>
        </div>
        
        {/* User Profile Snippet */}
        <div className="px-6 pb-6 mb-2 border-b border-white/10 flex items-center">
           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold mr-3 overflow-hidden">
             {currentUser?.avatar ? <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover"/> : currentUser?.name?.charAt(0)}
           </div>
           <div>
              <div className="text-sm font-bold truncate w-32">{currentUser?.name}</div>
              <div className="text-xs text-white/50">{currentRole?.name}</div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            // Permission Check
            if (item.resource && currentRole) {
               if (!currentRole.permissions[item.resource]?.read) return null;
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-white text-primary font-bold shadow-md' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                style={isActive ? { color: siteSettings.themeColor } : {}}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" target="_blank" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white mb-2 rounded-lg hover:bg-white/5">
             <Globe size={18} />
             <span>访问前台</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:hidden z-10">
          <span className="font-bold text-gray-800">管理后台</span>
          <button onClick={handleLogout} className="text-gray-600">
            <LogOut size={20} />
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
