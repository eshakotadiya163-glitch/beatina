import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
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

  const firebaseAuthMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data } = await api.post('/users/firebase-auth', { token });
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Firebase Auth failed');
    }
  });

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSendingOtp(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
    } catch (error: any) {
      alert(error.message || 'Error sending OTP');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    try {
      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();
      firebaseAuthMutation.mutate(token);
    } catch (error: any) {
      alert(error.message || 'Invalid OTP');
    }
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleGoogleLogin = async () => {
    // Open Google Sign-In in a popup window forcing the Account Chooser
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=407408718192.apps.googleusercontent.com&redirect_uri=https://developers.google.com/oauthplayground&response_type=code&scope=email%20profile&prompt=select_account',
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleFacebookLogin = async () => {
    // Open Facebook Login in a popup window
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      'https://www.facebook.com/login',
      'Facebook Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="pt-[116px] pb-14 bg-brand-light min-h-[85vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 md:p-14 w-full max-w-md shadow-sm border border-brand-border"
      >
        <h1 className="text-4xl font-heading text-center mb-4 text-brand-dark uppercase tracking-wide">Sign In</h1>
        <p className="text-center text-xs font-body text-brand-muted mb-10 tracking-widest uppercase">Welcome back to The Woman Company</p>

        <div className="flex justify-center space-x-6 mb-8 border-b border-gray-100 pb-2">
          <button 
            onClick={() => setLoginMethod('email')}
            className={`text-[10px] uppercase tracking-widest font-medium pb-2 ${loginMethod === 'email' ? 'border-b border-brand-dark text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Email Login
          </button>
          <button 
            onClick={() => setLoginMethod('phone')}
            className={`text-[10px] uppercase tracking-widest font-medium pb-2 ${loginMethod === 'phone' ? 'border-b border-brand-dark text-brand-dark' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Phone Login
          </button>
        </div>

        {loginMethod === 'email' ? (
          <form onSubmit={submitHandler} className="space-y-6 font-body">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Email Address</label>
              <input 
                type="email" 
                className="input-luxury"
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
                className="input-luxury"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full mt-8 py-4"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className="font-body space-y-6">
            <div id="recaptcha-container"></div>
            {!confirmationResult ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Phone Number (with country code)</label>
                  <input 
                    type="tel" 
                    className="input-luxury"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+919876543210"
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full mt-8 py-4"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Enter OTP</label>
                  <input 
                    type="text" 
                    className="input-luxury text-center tracking-[1em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full mt-8 py-4"
                  disabled={firebaseAuthMutation.isPending}
                >
                  {firebaseAuthMutation.isPending ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setConfirmationResult(null)}
                  className="w-full text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-dark transition-colors mt-4 block text-center"
                >
                  Back to Phone Input
                </button>
              </form>
            )}
          </div>
        )}

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-brand-border"></div>
            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-body">Or continue with</span>
            <div className="flex-1 h-px bg-brand-border"></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={firebaseAuthMutation.isPending}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-brand-border hover:border-brand-dark transition-colors font-body text-[13px] text-brand-dark hover:bg-gray-50 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={firebaseAuthMutation.isPending}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-brand-border hover:border-brand-dark transition-colors font-body text-[13px] text-brand-dark hover:bg-gray-50 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Continue with Facebook
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border text-center">
          <p className="text-xs font-body text-brand-muted mb-4 uppercase tracking-widest">
            New to The Woman Company?
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
