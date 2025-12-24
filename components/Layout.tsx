
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../services/storageService';
import { SiteSettings } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Refresh settings (in case they changed in admin)
    setSettings(storageService.getSettings());

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '关于盐韵', path: '/about' },
    { name: '业务领域', path: '/services' },
    { name: '经典案例', path: '/cases' },
    { name: '新闻动态', path: '/news' },
    { name: '分支机构', path: '/branches' },
  ];

  const footerLinks = [
    { name: '关于我们', path: '/about' },
    { name: '业务领域', path: '/services' },
    { name: '经典案例', path: '/cases' },
    { name: '网址导航', path: '/navigation' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAtHome = location.pathname === '/';
  
  // 核心逻辑：判断当前导航栏是否处于“浅色模式（白底）”
  const isLightHeader = scrolled || !isAtHome;

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans text-gray-800">
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-300 py-2.5 text-xs font-medium tracking-wide hidden md:block z-50 relative">
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
                <a 
                  href="http://106.14.157.201:8088/login" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-left"
                >
                  OA办公系统
                </a>
                <Link 
                  to="/admin/login" 
                  className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors text-left"
                >
                  后台管理系统
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isLightHeader ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        } md:top-[40px]`} 
        style={{ top: scrolled ? 0 : undefined }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Split Logo with Adaptive Color */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Graphic Logo - Always in color */}
              <img 
                src={settings.graphicLogoUrl} 
                alt="Logo Graphic" 
                className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Text Logo - Adaptive black/white */}
              <img 
                src={settings.textLogoUrl} 
                alt={settings.siteName} 
                className={`h-5 md:h-6 w-auto object-contain transition-all duration-500 ease-in-out ${
                  isLightHeader ? 'brightness-0' : 'brightness-100'
                }`}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-2">
              <nav className="flex space-x-1 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary'
                        : (isLightHeader ? 'text-gray-600 hover:text-primary hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10')
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <Link 
                to="/contact" 
                className={`flex items-center px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  isLightHeader
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-white text-primary hover:bg-gray-100'
                }`}
              >
                立即咨询 <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden transition-colors ${isLightHeader ? 'text-gray-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-bold text-white bg-primary mt-4 text-center shadow-lg"
                >
                  立即咨询
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-[40px] md:pt-0"> 
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                 <img 
                    src={settings.graphicLogoUrl} 
                    alt="Logo Graphic" 
                    className="h-10 w-auto object-contain"
                  />
                  <img 
                    src={settings.textLogoUrl} 
                    alt={settings.siteName} 
                    className="h-6 w-auto object-contain brightness-100"
                  />
              </div>
              <p className="text-gray-400 text-sm leading-7">
                我们致力于为每一位客户提供最专业的工程咨询与管理服务。以匠心致初心，以品质筑未来。
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">快速导航</h4>
              <ul className="space-y-4">
                {footerLinks.map((item, i) => (
                  <li key={i}>
                    <Link to={item.path} className="text-gray-400 hover:text-accent transition-colors text-sm flex items-center group">
                      <ChevronRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">联系信息</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-primary mt-0.5 flex-shrink-0" /> 
                  <span className="whitespace-pre-line">{settings.contactAddress}</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 text-primary flex-shrink-0" /> 
                  <span>{settings.contactPhone}</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-primary flex-shrink-0" /> 
                  <span>{settings.contactEmail}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
            <p>{settings.copyrightText}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">网站地图</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
