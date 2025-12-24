
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ArrowLeft, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password check (in a real app, hash check)
    // For this demo, we trust username if it exists in storage, and password 'admin'
    if (password === 'admin') {
      const success = storageService.login(username);
      if (success) {
         navigate('/admin/dashboard');
      } else {
         setError('用户不存在');
      }
    } else {
      setError('认证失败：密码错误 (默认密码: admin)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop" 
          alt="Office" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 px-12 text-center text-white flex flex-col items-center">
          <div className="mb-8 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 w-auto inline-block">
             <img 
                src="https://placehold.co/300x80/transparent/ffffff?text=Jiangsu+Yanyun" 
                alt="Logo" 
                className="h-16 w-auto object-contain"
             />
          </div>
          <h2 className="text-4xl font-bold mb-4">江苏盐韵管理系统</h2>
          <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
            高效、安全、智能的工程项目管理一体化平台。
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> 返回首页
          </Link>
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
            <p className="text-gray-500">请输入您的员工账号以继续</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">账号</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="请输入用户名 (admin)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-gray-700">密码</label>
                <a href="#" className="text-sm text-primary hover:underline">忘记密码?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="默认: admin"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-lg hover:bg-primary-dark transition-all font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5"
            >
              安全登录
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 江苏盐韵工程项目管理有限公司 | 内部系统
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
