import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, LogIn, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-100 mb-1.5">Welcome Back</h2>
          <p className="text-sm text-slate-400">Login to access your dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium mb-6">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider ml-0.5">
              <Mail size={13} className="mr-1.5" /> Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-slate-100 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-0.5">
              <label className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Lock size={13} className="mr-1.5" /> Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary-light hover:text-primary transition-colors">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-slate-100 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-dark shadow-[0_2px_12px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <><LogIn size={18} /> Login</>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-7 gap-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            useOneTap
            width="100%"
            theme="filled_black"
            shape="pill"
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary-light font-semibold hover:underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
