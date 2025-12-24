
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings, Users, Image, LogOut, Building, Globe, Award, Hexagon, Compass, Layout, History, UserCheck, ShieldCheck, ChevronRight, Clock, Menu, X, Megaphone, Lock } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SiteSettings, ResourceType, User, Role } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionAside = motion.aside as any;

// 侧边栏分组数据配置
const NAV_GROUPS = [
  {
    label: '概览',
    items: [{ name: '仪表盘', path: '/admin/dashboard', icon: LayoutDashboard }]
  },
  {
    label: '内容建设',
    items: [
      { name: '页面文案', path: '/admin/pages', icon: Layout, resource: 'pages' as ResourceType },
      { name: '新闻动态', path: '/admin/news', icon: FileText, resource: 'news' as ResourceType },
      { name: '招标信息', path: '/admin/tenders', icon: Megaphone, resource: 'tenders' as ResourceType },
      { name: '项目案例', path: '/admin/projects', icon: Briefcase, resource: 'projects' as ResourceType },
      { name: '业务领域', path: '/admin/services', icon: Hexagon, resource: 'services' as ResourceType },
    ]
  },
  {
    label: '品牌资产',
    items: [
      { name: '核心团队', path: '/admin/team', icon: UserCheck, resource: 'team' as ResourceType },
      { name: '发展历程', path: '/admin/history', icon: History, resource: 'history' as ResourceType },
      { name: '荣誉资质', path: '/admin/honors', icon: Award, resource: 'honors' as ResourceType },
      { name: '分支机构', path: '/admin/branches', icon: Building, resource: 'branches' as ResourceType },
      { name: '合作伙伴', path: '/admin/partners', icon: Users, resource: 'partners' as ResourceType },
    ]
  },
  {
    label: '资源与系统',
    items: [
      { name: '媒体库', path: '/admin/media', icon: Image, resource: 'media' as ResourceType },
      { name: '外部导航', path: '/admin/navigation', icon: Compass, resource: 'navigation' as ResourceType },
      { name: '权限用户', path: '/admin/users', icon: Users, resource: 'users' as ResourceType }, // Icon changed to Users
      { name: '安全审计', path: '/admin/security', icon: ShieldCheck, resource: 'security' as ResourceType }, // New Security Item
      { name: '站点设置', path: '/admin/settings', icon: Settings, resource: 'settings' as ResourceType },
    ]
  }
];

interface SidebarContentProps {
  currentUser: User | null;
  currentRole: Role | null;
  currentPath: string;
  onLogout: () => void;
  logoUrl?: string; // Add logo prop
  onNavigate?: () => void; // Added for mobile UX
}

const SidebarContent: React.FC<SidebarContentProps> = ({ currentUser, currentRole, currentPath, onLogout, logoUrl, onNavigate }) => (
  <div className="flex flex-col h-full overflow-hidden bg-gray-900 text-white">
    <div className="p-8 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-lg shadow-glow border border-white/10 overflow-hidden">
           {logoUrl ? (
             <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
           ) : (
             <span className="text-primary">Y</span>
           )}
        </div>
        <div>
           <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Yanyun OS</h2>
           <p className="text-[9px] text-white/30 mt-1 font-bold tracking-widest uppercase">Professional Edition</p>
        </div>
      </div>
    </div>
    
    <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-6">
      {NAV_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx}>
          <h3 className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">{group.label}</h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              // 安全优化：权限降级策略
              let hasPermission = false;
              
              if (!item.resource) {
                 hasPermission = true; 
              } else if (currentRole) {
                 const perm = currentRole.permissions[item.resource];
                 if (perm) {
                    hasPermission = perm.read;
                 } else {
                    // 兼容旧数据：如果是超级管理员，允许访问新模块；否则拒绝
                    hasPermission = currentRole.isSystem || false;
                 }
              }
              
              if (!hasPermission) return null;
              
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group touch-manipulation ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    <div className="p-4 bg-black/20 m-4 rounded-2xl border border-white/5 flex-shrink-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 p-0.5 flex-shrink-0">
          <img src={currentUser?.avatar || 'https://placehold.co/100'} className="w-full h-full object-cover rounded-[10px]" alt="user" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{currentUser?.name}</p>
          <div className="flex items-center gap-1 text-[10px] text-white/40 truncate">
             {currentUser?.mfaEnabled && <Lock size={8} className="text-emerald-500" />} 
             {currentRole?.name}
          </div>
        </div>
      </div>
      <button onClick={onLogout} className="w-full py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
        <LogOut size={12} /> 安全退出
      </button>
    </div>
  </div>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [logo, setLogo] = useState(settings.graphicLogoUrl);
  
  // Security State: Prevent rendering before checking auth
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Immediate Auth Check
    const user = storageService.getCurrentUser();
    
    if (!user || !storageService.isAuthenticated()) {
      navigate('/admin/login');
    } else {
      setCurrentUser(user);
      setCurrentRole(storageService.getCurrentUserRole());
      setIsAuthorized(true);
    }

    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    
    const handleSettingsUpdate = () => {
       const newSettings = storageService.getSettings();
       setSettings(newSettings);
       setLogo(newSettings.graphicLogoUrl);
    };
    window.addEventListener('settingsChanged', handleSettingsUpdate);

    return () => {
       clearInterval(timer);
       window.removeEventListener('settingsChanged', handleSettingsUpdate);
    };
  }, [navigate]);

  useEffect(() => {
    const updateFavicon = (url: string) => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = url;
    };
    
    if (settings.faviconUrl) {
      updateFavicon(settings.faviconUrl);
    } else if (settings.graphicLogoUrl) {
      updateFavicon(settings.graphicLogoUrl);
    }
  }, [settings.faviconUrl, settings.graphicLogoUrl]);

  const handleLogout = () => {
    if (window.confirm('确定要退出管理系统吗？')) {
      storageService.logout();
      navigate('/admin/login');
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(Boolean);
    return path.map((p, i) => {
      const allItems = NAV_GROUPS.flatMap(g => g.items);
      const matchedItem = allItems.find(item => item.path.endsWith(p));
      return {
        name: p === 'admin' ? '管理中枢' : (matchedItem?.name || p),
        path: '/' + path.slice(0, i + 1).join('/')
      };
    });
  };

  // Prevent FOUC (Flash of Unauthenticated Content)
  if (!isAuthorized) {
    return null; // Or return a centered loading spinner here
  }

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
      
      {/* Admin Layout no longer includes AnniversaryPopup to prevent disruption */}

      {/* Desktop Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col shadow-2xl z-20 flex-shrink-0">
        <SidebarContent 
          currentUser={currentUser} 
          currentRole={currentRole} 
          currentPath={location.pathname}
          onLogout={handleLogout}
          logoUrl={logo}
        />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MotionAside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent 
                currentUser={currentUser} 
                currentRole={currentRole} 
                currentPath={location.pathname}
                onLogout={handleLogout}
                logoUrl={logo}
                onNavigate={() => setIsMobileMenuOpen(false)} // Close menu on navigation
              />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </MotionAside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 -ml-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg active:scale-90 transition-transform"
             >
               <Menu size={24} />
             </button>

             <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                {getBreadcrumbs().map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight size={12} />}
                    <Link to={crumb.path} className={`hover:text-primary transition-colors py-2 px-1 ${idx === getBreadcrumbs().length - 1 ? 'text-gray-900 font-bold' : ''}`}>
                      {crumb.name}
                    </Link>
                  </React.Fragment>
                ))}
             </div>
             <div className="sm:hidden text-sm font-bold text-gray-900">
                {getBreadcrumbs().pop()?.name || '管理系统'}
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
             <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-gray-400 border-r pr-6 border-gray-100">
                <Clock size={14} className="text-primary" /> {currentTime}
             </div>
             <Link to="/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-primary hover:bg-blue-50 px-3 py-2.5 rounded-lg transition-all active:scale-95">
                <Globe size={16} /> <span className="hidden xs:inline">访问官网</span>
             </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;