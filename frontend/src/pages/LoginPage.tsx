import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await api.post('/users/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Login failed');
    }
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="pt-[116px] pb-20 bg-brand-light min-h-[85vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 md:p-14 w-full max-w-md shadow-sm border border-brand-border"
      >
        <h1 className="text-4xl font-heading text-center mb-4 text-brand-dark uppercase tracking-wide">Sign In</h1>
        <p className="text-center text-xs font-body text-brand-muted mb-10 tracking-widest uppercase">Welcome back to Beautina</p>

        <form onSubmit={submitHandler} className="space-y-6 font-body">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Email Address</label>
            <input 
              type="email" 
              className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-brand-muted font-medium">Password</label>
              <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest text-brand-dark hover:text-brand-muted transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-dark text-white py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors mt-8"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-brand-border text-center">
          <p className="text-xs font-body text-brand-muted mb-4 uppercase tracking-widest">
            New to Beautina?
          </p>
          <Link to="/register" className="inline-block border-b border-brand-dark text-brand-dark font-body uppercase tracking-[0.2em] text-[10px] hover:text-brand-muted hover:border-brand-muted transition-colors pb-1">
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
