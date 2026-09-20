import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Award, FileCheck, BookOpen, Bot,
  LogOut, Shield, Globe, Bell, ChevronRight, Menu, X
} from 'lucide-react';
import AssistantDrawer from './AssistantDrawer';

export default function OfficerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Family Registry', path: '/officer/families', icon: Users },
    { label: 'Review Queue', path: '/officer/duplicates', icon: FileCheck, badge: '3,356' },
    { label: 'Schemes', path: '/officer/schemes', icon: BookOpen },
  ];

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'gu' : 'en'));
  };

  return (
    <div className="min-h-screen bg-slate-bg flex flex-col text-slate-text">
      {/* Top Deep Navy Header */}
      <header className="bg-navy-dark text-white border-b border-navy-dark px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/officer/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-navy flex items-center justify-center border border-white/20">
              <span className="font-bold text-base text-orange">360</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">Family360</span>
                <span className="text-[10px] bg-orange/20 text-orange border border-orange/30 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                  Gujarat DPI
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden sm:block">
                Welfare Intelligence & Beneficiary Management Platform
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          {/* Last sync badge */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[11px] bg-white/10 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Last synced: 20 Sep 2026, 10:42 AM
          </span>

          {/* Gujarati / English Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded transition-colors font-medium"
          >
            <Globe className="w-3.5 h-3.5 text-orange" />
            <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </button>

          {/* Assistant Trigger Button */}
          <button
            onClick={() => setAssistantOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange hover:bg-orange-hover text-white font-semibold transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Assistant</span>
          </button>

          {/* Officer Info & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="w-7 h-7 rounded-full bg-navy border border-white/20 flex items-center justify-center text-xs font-semibold text-white">
              DWO
            </div>
            <div className="hidden lg:block text-left">
              <span className="font-semibold block leading-tight text-white">DWO Ahmedabad</span>
              <span className="text-[10px] text-slate-300 block">Social Justice Dept</span>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Switch Portal"
              className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex">
        {/* Navy Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } sm:block w-56 bg-navy text-slate-200 border-r border-navy-light/40 shrink-0 flex flex-col justify-between`}
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path === '/officer/families' && location.pathname.startsWith('/officer/families'));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-orange text-white font-semibold'
                      : 'hover:bg-navy-light text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-white text-orange' : 'bg-navy-dark text-orange-light'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Institutional Tools
            </div>

            <button
              onClick={() => setAssistantOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium hover:bg-navy-light text-slate-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-orange" />
                <span>AI Explainer</span>
              </div>
              <span className="text-[10px] text-orange bg-navy-dark px-1.5 py-0.5 rounded font-mono">
                Ask
              </span>
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-navy-light/40 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>State Data Center Secure</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Audit logging active on all record verifications
            </p>
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Slide-over Assistant Drawer */}
      <AssistantDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
