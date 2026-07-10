import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await api.post('/users', userData);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Registration failed');
    }
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    registerMutation.mutate({ firstName, lastName, email, password });
  };

  return (
    <div className="pt-[116px] pb-20 bg-brand-light min-h-[85vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 md:p-14 w-full max-w-lg shadow-sm border border-brand-border my-10"
      >
        <h1 className="text-4xl font-heading text-center mb-4 text-brand-dark uppercase tracking-wide">Join Us</h1>
        <p className="text-center text-xs font-body text-brand-muted mb-10 tracking-widest uppercase">Create your Beautina account</p>

        <form onSubmit={submitHandler} className="space-y-6 font-body">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">First Name</label>
              <input 
                type="text" 
                className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            <div className="w-1/2">
              <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Last Name</label>
              <input 
                type="text" 
                className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
          </div>

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
            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Password</label>
            <input 
              type="password" 
              className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Confirm Password</label>
            <input 
              type="password" 
              className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-dark text-white py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors mt-8"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-brand-border text-center">
          <p className="text-xs font-body text-brand-muted mb-4 uppercase tracking-widest">
            Already have an account?
          </p>
          <Link to="/login" className="inline-block border-b border-brand-dark text-brand-dark font-body uppercase tracking-[0.2em] text-[10px] hover:text-brand-muted hover:border-brand-muted transition-colors pb-1">
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
