
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, ArrowRight, ArrowUp, UserCircle, Briefcase, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../services/storageService';
import { SiteSettings, PageContent } from '../types';
import AnniversaryPopup from './AnniversaryPopup'; 

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;
const MotionButton = motion.button as any;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettingsSync());
  const [pageContent, setPageContent] = useState<PageContent>(storageService.getPageContent());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
    };
    
    const handleSettingsUpdate = () => {
      setSettings(storageService.getSettingsSync());
      setPageContent(storageService.getPageContent());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('settingsChanged', handleSettingsUpdate);
    
    setSettings(storageService.getSettingsSync());
    setPageContent(storageService.getPageContent());

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('settingsChanged', handleSettingsUpdate);
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get dynamic nav from content, sorted by order
  const navLinks = pageContent.topNav
    ?.filter(l => l.isVisible)
    ?.sort((a, b) => a.order - b.order) || [];

  const quickLinks = pageContent.footer?.quickLinks?.filter(l => l.isVisible) || [];
  const isAtHome = location.pathname === '/';
  const isLightHeader = scrolled || !isAtHome;
  const showPopup = location.pathname === '/' && !location.pathname.startsWith('/admin');

  const isActive = (path: string, currentPath: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-surface">
      {showPopup && <AnniversaryPopup />}

      <MotionDiv 
        animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -40 : 0 }}
        className="bg-gray-950 text-gray-400 py-2.5 text-xs font-medium tracking-wide hidden lg:block z-50 relative border-b border-white/5"
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-8">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer group">
              <Phone size={13} className="mr-2 text-blue-400 group-hover:text-white transition-colors" /> 
              <span className="font-mono tracking-wider">{settings.contactPhone}</span>
            </span>
            <span className="flex items-center hover:text-white transition-colors cursor-pointer group">
              <Mail size={13} className="mr-2 text-blue-400 group-hover:text-white transition-colors" /> 
              {settings.contactEmail}
            </span>
          </div>
          <div className="flex space-x-6 items-center">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:border-white/20 transition-all duration-300 focus:outline-none">
                <UserCircle size={14} className="text-blue-400" />
                <span className="text-gray-300 group-hover:text-white text-[10px] font-bold uppercase tracking-wider">业务系统</span>
                <ChevronDown size={10} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 hidden group-hover:block z-[60] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <a href="http://106.14.157.201:8088/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                   <Briefcase size={14} className="text-primary"/>
                   <span className="text-xs font-bold">OA 协同办公</span>
                </a>
                <Link to="/admin/login" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                   <ShieldCheck size={14} className="text-orange-600"/>
                   <span className="text-xs font-bold">后台管理中心</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isLightHeader ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'} ${scrolled ? 'md:top-0' : 'lg:top-[40px]'}`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group z-50">
              <MotionImg src={settings.graphicLogoUrl} className="h-10 w-auto object-contain" />
              <MotionImg src={settings.textLogoUrl} alt={settings.siteName} className={`h-10 w-auto object-contain ${isLightHeader ? 'brightness-0 opacity-90' : 'invert(1) brightness(2)'}`} />
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.path, location.pathname);
                const activeClass = isLightHeader ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-900 shadow-xl';
                const inactiveClass = isLightHeader ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white hover:bg-white/10';
                return (
                  <Link key={link.id} to={link.path} className={`px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all duration-300 ${active ? activeClass : inactiveClass}`}>
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/contact" className={`ml-4 flex items-center px-5 py-2 rounded-full text-xs font-bold shadow-lg transition-all ${isLightHeader ? 'bg-gray-900 text-white' : 'bg-white text-primary'}`}>
                <span>联系我们</span>
                <ArrowRight size={14} className="ml-2" />
              </Link>
            </nav>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 z-50 ${isMobileMenuOpen || isLightHeader ? 'text-gray-800' : 'text-white'}`}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-40 bg-white lg:hidden flex flex-col pt-24 px-6 pb-6">
            <nav className="flex flex-col space-y-4 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.id} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-bold ${isActive(link.path, location.pathname) ? 'text-primary' : 'text-gray-800'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-950 text-white pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                 <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1">
                    <img src={settings.graphicLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <span className="text-lg font-bold tracking-tight">{settings.siteName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">专业的工程项目管理咨询服务商。</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">快速导航</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {quickLinks.map(link => <li key={link.id}><Link to={link.path} className="hover:text-white">{link.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">业务领域</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>工程监理</li><li>项目管理</li><li>造价咨询</li><li>招标代理</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">联系信息</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3"><MapPin size={16} className="shrink-0 text-blue-400" /> {settings.contactAddress}</li>
                <li className="flex items-center gap-3"><Phone size={16} className="shrink-0 text-blue-400" /> {settings.contactPhone}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-xs text-gray-500">
            <p>{settings.copyrightText}</p>
          </div>
        </div>
      </footer>
      <AnimatePresence>{showBackToTop && <MotionButton initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg z-40"><ArrowUp size={20} /></MotionButton>}</AnimatePresence>
    </div>
  );
};

export default Layout;
