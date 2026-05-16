import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, Shield, AlertCircle, TrendingUp, History, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-center gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
  >
    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-slate-100 mt-0.5">{value}</p>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-slate-400 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Welcome, <span className="bg-gradient-to-r from-primary-light to-purple-400 bg-clip-text text-transparent">{user.username}</span>
        </h1>
        <p className="text-slate-400 mt-1.5">Everything looks good today.</p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Shield size={20} className="text-success" />} label="Status" value="Active" delay={0} />
        <StatCard icon={<TrendingUp size={20} className="text-primary-light" />} label="Total Items" value="0" delay={0.05} />
        <StatCard icon={<AlertCircle size={20} className="text-accent" />} label="Notifications" value="0" delay={0.1} />
        <StatCard icon={<History size={20} className="text-slate-400" />} label="History" value="View All" delay={0.15} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] min-h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5 mb-6">
            <LayoutDashboard size={20} className="text-primary-light" />
            Recent Activity
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <LayoutDashboard size={28} className="text-slate-600" />
            </div>
            <p className="text-slate-500 mb-1">No activity yet</p>
            <p className="text-xs text-slate-600 mb-5">Your recent actions will appear here</p>
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark shadow-[0_2px_12px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer">
              Create New Item
            </button>
          </div>
        </motion.section>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          >
            <h4 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-wider">Profile</h4>
            <div className="space-y-3">
              {[
                { label: 'Email', value: user.email },
                { label: 'Provider', value: user.provider?.toUpperCase() || 'LOCAL' },
                { label: 'Joined', value: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-200 font-medium truncate ml-4 max-w-[180px]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-primary/20 bg-primary/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-primary-light" />
              <h4 className="text-sm font-bold text-slate-100">Resources</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Need help? Check the docs and source code to get started quickly.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-primary-light border border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <ExternalLink size={13} />
              View Documentation
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
