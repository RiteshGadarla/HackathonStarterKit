import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, ArrowRight, Sparkles, Database, Code2, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const LandingPage = () => {
  const [apiStatus, setApiStatus] = useState(null);

  // Test backend connection on load
  useEffect(() => {
    api.get('/health')
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'));
  }, []);

  const features = [
    { icon: <ShieldCheck size={24} />, title: 'Auth Ready', desc: 'JWT + Google OAuth baked in. Login, signup, and protected routes — all wired up.' },
    { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Vite + FastAPI dev server with HMR and hot reload. Sub-second feedback loops.' },
    { icon: <Database size={24} />, title: 'MongoDB Ready', desc: 'Motor async driver pre-configured. Models, connection pooling, and env-based config.' },
    { icon: <Globe size={24} />, title: 'API Proxy', desc: 'Vite dev proxy + Docker/Nginx production config. No CORS headaches, ever.' },
    { icon: <Code2 size={24} />, title: 'Clean Architecture', desc: 'Modular folder structure with separated concerns. Routes, models, context — all organized.' },
    { icon: <Layers size={24} />, title: 'Docker Ready', desc: 'Production Dockerfile with Nginx reverse proxy. One command to containerize.' },
  ];

  const techStack = [
    { name: 'React 18', color: 'from-cyan-500 to-blue-500' },
    { name: 'FastAPI', color: 'from-emerald-500 to-teal-500' },
    { name: 'MongoDB', color: 'from-green-500 to-lime-500' },
    { name: 'Tailwind v4', color: 'from-sky-500 to-indigo-500' },
    { name: 'Vite', color: 'from-purple-500 to-violet-500' },
    { name: 'Docker', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 text-center overflow-hidden">
        {/* API Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm"
        >
          <span className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : apiStatus === 'disconnected' ? 'bg-danger' : 'bg-slate-500 animate-pulse'}`} />
          <span className="text-slate-400">
            Backend: {apiStatus === 'connected' ? <span className="text-success font-medium">Connected</span> : apiStatus === 'disconnected' ? <span className="text-danger font-medium">Offline</span> : 'Checking...'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-slate-100">Ship Your Next</span>
          <br />
          <span className="bg-gradient-to-r from-primary-light via-purple-400 to-accent-light bg-clip-text text-transparent">
            Big Idea, Fast
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A production-ready full-stack starter with React, FastAPI & MongoDB.
          Authentication, database, and deployment — all pre-configured for hackathons and MVPs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-dark shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.45)] transition-all"
          >
            Get Started Free
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
          >
            View Demo
          </Link>
        </motion.div>

        {/* Tech Stack Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs text-slate-500 font-medium uppercase tracking-widest mr-2">Built with</span>
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white/80 bg-gradient-to-r ${tech.color} opacity-70`}
            >
              {tech.name}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-primary-light font-semibold uppercase tracking-widest">
            <Sparkles size={14} />
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Win
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            Stop wasting hours on boilerplate. Start building what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-4 tracking-tight">
            Ready to Build?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Clone the repo, set your env vars, and start hacking. It really is that simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-dark shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 transition-all"
            >
              Create Account
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-300 border border-white/10 hover:border-white/20 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-white/[0.06]">
        <p className="text-center text-sm text-slate-500 font-medium">
          © 2026 Hackathon Starter. Built for builders.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
