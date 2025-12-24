
import React, { useState, useEffect } from 'react';
// Fix react-router-dom export errors by ensuring standard v6 imports
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, ArrowRight, ChevronDown, Monitor, ShieldCheck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../services/storageService';
import { SiteSettings } from '../types';

// Cast motion components to any to resolve property 'animate'/'initial' etc. missing errors in current type environment
const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;
const MotionNav = motion.nav as any;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    setSettings(storageService.getSettings());
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // 禁止移动端菜单开启时背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '关于盐韵', path: '/about' },
    { name: '业务领域', path: '/services' },
    { name: '经典案例', path: '/cases' },
    { name: '新闻动态', path: '/news' },
    { name: '分支机构', path: '/branches' },
  ];

  const isAtHome = location.pathname === '/';
  const isLightHeader = scrolled || !isAtHome;

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans text-gray-800">
      {/* Top Bar - Desktop Only */}
      <MotionDiv 
        animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -40 : 0 }}
        className="bg-gray-900 text-gray-300 py-2.5 text-xs font-medium tracking-wide hidden lg:block z-50 relative"
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-8">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Phone size={14} className="mr-2 text-accent" /> {settings.contactPhone}
            </span>
            <span className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Mail size={14} className="mr-2 text-accent" /> {settings.contactEmail}
            </span>
          </div>
          <div className="flex space-x-6 items-center">
            <div className="relative group">
              <button className="flex items-center hover:text-accent transition-colors focus:outline-none py-1">
                员工入口 <ChevronDown size={12} className="ml-1" />
              </button>
              <div className="absolute right-0 top-full mt-0 w-36 bg-white rounded-md shadow-xl py-2 hidden group-hover:block text-gray-800 z-[60] border border-gray-100 origin-top-right transition-all">
                <a href="http://106.14.157.201:8088/login" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-left">OA办公系统</a>
                <Link to="/admin/login" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-left">后台管理系统</Link>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isLightHeader ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'
        } ${scrolled ? 'md:top-0' : 'lg:top-[40px]'}`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group h-10 md:h-12 relative z-50">
              <MotionImg 
                src={settings.graphicLogoUrl} 
                alt="Logo Graphic" 
                className="h-full w-auto object-contain"
                animate={{
                  filter: isLightHeader 
                    ? 'drop-shadow(0 0 0px rgba(255,255,255,0))' 
                    : 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                }}
                transition={{ duration: 0.5 }}
              />
              <MotionImg 
                src={settings.textLogoUrl} 
                alt={settings.siteName} 
                className="h-[60%] md:h-[65%] w-auto object-contain"
                initial={false}
                animate={{
                  filter: isLightHeader 
                    ? 'brightness(0) opacity(0.9)' 
                    : 'invert(1) brightness(2) opacity(1)',
                  scale: scrolled ? 0.95 : 1
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-2">
              <nav className="flex space-x-1 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive(link.path, location.pathname)
                        ? 'bg-primary/10 text-primary'
                        : (isLightHeader ? 'text-gray-600 hover:text-primary hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10')
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <Link 
                to="/contact" 
                className={`flex items-center px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
                  isLightHeader
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20' 
                  : 'bg-white text-primary hover:shadow-white/20'
                }`}
              >
                立即咨询 <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-all relative z-50 outline-none flex items-center justify-center min-h-[44px] min-w-[44px] ${
                isLightHeader || isMobileMenuOpen ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Background Backdrop */}
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-gray-950/40 backdrop-blur-md z-[45] lg:hidden"
              />
              
              {/* Drawer Container */}
              <MotionDiv 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-white z-[50] lg:hidden shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto px-8 pt-24 pb-10">
                  <div className="space-y-8">
                    {/* Navigation Section */}
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">主菜单</h4>
                      <MotionNav className="space-y-2">
                        {navLinks.map((link, i) => (
                          <MotionDiv
                            key={link.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link
                              to={link.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-bold transition-all border ${
                                isActive(link.path, location.pathname)
                                  ? 'bg-primary/5 text-primary border-primary/20 shadow-sm'
                                  : 'text-gray-700 border-transparent hover:bg-gray-50 active:scale-95'
                              }`}
                            >
                              {link.name}
                              <ChevronRight size={18} className={isActive(link.path, location.pathname) ? 'opacity-100' : 'opacity-20'} />
                            </Link>
                          </MotionDiv>
                        ))}
                      </MotionNav>
                    </div>

                    {/* Staff Entrance Section (Retained for Mobile) */}
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">员工入口</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <a 
                          href="http://106.14.157.201:8088/login" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-xl border border-gray-100 active:scale-95 transition-transform"
                        >
                          <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-primary">
                            <Monitor size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">OA 办公系统</p>
                            <p className="text-[10px] text-gray-400">协同办公与审批流水</p>
                          </div>
                          <ExternalLink size={14} className="text-gray-300" />
                        </a>
                        <Link 
                          to="/admin/login" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-xl border border-gray-100 active:scale-95 transition-transform"
                        >
                          <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-secondary">
                            <ShieldCheck size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">管理后台</p>
                            <p className="text-[10px] text-gray-400">网站内容与数据运维</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </Link>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Phone size={16} className="mr-3 text-primary" /> {settings.contactPhone}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Mail size={16} className="mr-3 text-primary" /> {settings.contactEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Inquiry Button at bottom */}
                <div className="p-8 border-t border-gray-50">
                  <Link 
                    to="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                  >
                    立即咨询 <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </MotionDiv>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow"> 
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 h-12">
                 <img src={settings.graphicLogoUrl} alt="G-Logo" className="h-full w-auto object-contain" />
                 <img src={settings.textLogoUrl} alt="T-Logo" className="h-[65%] w-auto object-contain invert brightness-200" />
              </div>
              <p className="text-gray-400 text-sm leading-8 max-w-sm">
                以匠心致初心，以品质筑未来。作为江苏领先的工程管理机构，我们始终坚持数字化管控与卓越交付。
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-gray-500">快速导航</h4>
              <ul className="space-y-5">
                {[
                  { name: '关于盐韵', path: '/about' },
                  { name: '服务体系', path: '/services' },
                  { name: '案例展示', path: '/cases' },
                  { name: '行业资源', path: '/navigation' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.path} className="text-gray-300 hover:text-white transition-all text-sm flex items-center group">
                      <span className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-3 transition-all duration-300"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-gray-500">联系信息</h4>
              <ul className="space-y-6 text-gray-300 text-sm">
                <li className="flex items-start group">
                  <MapPin size={18} className="mr-4 text-primary flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{settings.contactAddress}</span>
                </li>
                <li className="flex items-center group">
                  <Phone size={18} className="mr-4 text-primary flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors font-bold text-lg">{settings.contactPhone}</span>
                </li>
                <li className="flex items-center group">
                  <Mail size={18} className="mr-4 text-primary flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{settings.contactEmail}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs tracking-widest uppercase">
            <p>{settings.copyrightText}</p>
            <div className="flex space-x-8 mt-6 md:mt-0 font-bold">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const isActive = (path: string, current: string) => path === current;

export default Layout;
