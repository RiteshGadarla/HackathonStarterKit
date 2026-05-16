import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Zap, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-base/75 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-100 tracking-tight">
            Starter<span className="text-primary-light">Kit</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-5 border-l border-white/[0.06]">
                {user.picture ? (
                  <img src={user.picture} alt={user.username} className="w-8 h-8 rounded-full border-2 border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User size={16} className="text-slate-500" />
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-200">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/[0.06] hover:border-danger hover:text-danger transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark shadow-[0_2px_12px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 pt-3 border-t border-white/[0.06] bg-base/95 flex flex-col gap-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-slate-400 font-medium py-1.5">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-danger font-medium py-1.5 text-left cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-slate-400 font-medium py-1.5">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="mt-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
