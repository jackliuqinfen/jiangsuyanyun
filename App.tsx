
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Cases from './pages/Cases';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Branches from './pages/Branches';
import Contact from './pages/Contact';
import Navigation from './pages/Navigation';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import NewsManager from './pages/admin/NewsManager';
import ProjectManager from './pages/admin/ProjectManager';
import ServiceManager from './pages/admin/ServiceManager';
import BranchManager from './pages/admin/BranchManager';
import PartnerManager from './pages/admin/PartnerManager';
import HonorManager from './pages/admin/HonorManager';
import MediaManager from './pages/admin/MediaManager';
import UserManager from './pages/admin/UserManager';
import NavigationManager from './pages/admin/NavigationManager';
import PageManager from './pages/admin/PageManager';
import TeamManager from './pages/admin/TeamManager';
import HistoryManager from './pages/admin/HistoryManager';

// Placeholder for remaining minor pages
const AdminPlaceholder: React.FC<{title: string}> = ({ title }) => (
  <div className="min-h-[50vh] flex items-center justify-center bg-white rounded-lg shadow m-4">
    <div className="text-center">
       <h1 className="text-3xl font-bold text-gray-300 mb-2">{title}</h1>
       <p className="text-gray-400">该模块功能即将上线</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="services" element={<ServiceManager />} />
              <Route path="branches" element={<BranchManager />} />
              <Route path="partners" element={<PartnerManager />} />
              <Route path="team" element={<TeamManager />} />
              <Route path="history" element={<HistoryManager />} />
              <Route path="honors" element={<HonorManager />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Public Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
