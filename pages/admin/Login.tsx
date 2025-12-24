
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ArrowLeft, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (password !== 'admin') {
        throw new Error('认证失败：密码错误 (默认: admin)');
      }
      const res = await storageService.login(username);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        throw new Error('账号不存在');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
           </div>
           <div className="relative z-10">
              <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-12">
                 <ArrowLeft size={18} className="mr-2" /> 返回官网首页
              </Link>
              <h2 className="text-4xl font-black mb-6 leading-tight">Yanyun OS<br/>管理中枢</h2>
              <p className="text-blue-100/60 leading-relaxed font-medium">江苏盐韵工程项目管理一体化协作平台，实时监控、数字化交付、智能预警。</p>
           </div>
           <div className="relative z-10 pt-10">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><ShieldCheck size={20}/></div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/80">Security Level: Grade III</div>
              </div>
           </div>
        </div>

        <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
           <div className="mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">身份核验</h1>
              <p className="text-gray-400 text-sm mt-2">请输入您的业务授权账号</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
                   {error}
                </motion.div>
              )}
              
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium" 
                      placeholder="admin"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-[10px] font-bold text-primary hover:underline">密保申诉</button>
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium" 
                      placeholder="••••••••"
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
              >
                 {isLoading ? <Loader2 size={20} className="animate-spin" /> : '进入系统'}
              </button>
           </form>
           
           <div className="mt-12 text-center">
              <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">© 2025 Jiangsu Yanyun Technical Center</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
