import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Award, FileCheck, BookOpen, Bot,
  LogOut, Shield, Globe, Bell, ChevronRight, Menu, X, ExternalLink, MapPin, RefreshCw, Lock
} from 'lucide-react';
import NationalGovHeader from './NationalGovHeader';
import NationalGovFooter from './NationalGovFooter';
import AssistantDrawer from './AssistantDrawer';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';

export default function OfficerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allNavItems = [
    { label: 'Overview', path: '/officer/dashboard', icon: LayoutDashboard, roles: ['taluka_officer', 'district_officer', 'state_admin'] },
    { label: 'Family Registry', path: '/officer/families', icon: Users, roles: ['taluka_officer', 'district_officer', 'state_admin'] },
    { label: 'Saturation Camps', path: '/officer/camps', icon: MapPin, badge: 'Hotspots', roles: ['taluka_officer', 'district_officer', 'state_admin'] },
    { label: 'Review Queue', path: '/officer/duplicates', icon: FileCheck, badge: '3,356', roles: ['district_officer', 'state_admin'], requiredRoleLabel: 'District+' },
    { label: 'Scheme Directory', path: '/officer/schemes', icon: BookOpen, roles: ['taluka_officer', 'district_officer', 'state_admin'] },
  ];

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'));
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col text-slate-text">
      {/* 1. Official National & State Header Bar (India.gov.in / UX4G standard) */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={toggleLanguage}
        onSelectLang={(code) => setLang(code)}
        currentRole="officer"
      />

      {/* 2. Operational Sub-Header (Deep Navy) */}
      <div className="bg-navy-dark text-white px-4 sm:px-6 py-2 border-b border-navy-deep flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-xs tracking-tight">
              {user?.roleLabel || 'Government Administrative Console'}
            </span>
            <span className="text-slate-400 text-xs hidden md:inline">
              · {user?.jurisdiction || 'Gujarat Jurisdiction'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Assistant Trigger */}
          <button
            onClick={() => setAssistantOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange hover:bg-orange-hover text-white font-semibold transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Explainer</span>
          </button>

          {/* Officer Identity & RBAC Actions */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/20">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-[10px] text-white">
              {user?.avatar || 'OFF'}
            </div>
            <span className="hidden sm:inline font-medium text-slate-200">
              {user?.name || 'Officer'}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout from Administrative Console"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex" id="main-content">
        {/* Navy Sidebar Navigation */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } sm:block w-56 bg-navy text-slate-200 border-r border-navy-light/30 shrink-0 flex flex-col justify-between`}
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Administrative Views
            </div>

            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === '/officer/families' && location.pathname.startsWith('/officer/families'));
              const isLocked = item.roles && !item.roles.includes(user?.role);

              if (isLocked) {
                return (
                  <div
                    key={item.path}
                    className="flex items-center justify-between px-3 py-2 rounded text-xs font-medium text-slate-400/80 bg-navy-dark/40 border border-white/5 cursor-not-allowed select-none opacity-65"
                    title={`Restricted to ${item.requiredRoleLabel || 'Higher Authority'} by State RBAC`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{item.label}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-mono flex items-center gap-1 border border-amber-500/20">
                      <Lock className="w-2.5 h-2.5 text-[#FF671F]" />
                      <span>{item.requiredRoleLabel || 'Locked'}</span>
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-orange text-white font-semibold shadow-sm'
                      : 'hover:bg-navy-light text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isActive ? 'bg-white text-orange' : 'bg-navy-dark text-orange-light'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Compliance & Integrity
            </div>

            <button
              onClick={() => setAssistantOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium hover:bg-navy-light text-slate-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-orange" />
                <span>Statutory Assistant</span>
              </div>
              <span className="text-[10px] text-orange bg-navy-dark px-1.5 py-0.5 rounded font-mono">
                Ask
              </span>
            </button>
          </div>

          {/* Sidebar Institutional Footer */}
          <div className="p-3 border-t border-navy-light/40 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gujarat State Data Center</span>
            </div>
            <p className="text-[10px] text-slate-400">
              All officer determinations are logged for audit compliance
            </p>
          </div>
        </aside>

        {/* Dynamic Page Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 4. Official National & State Government Footer */}
      <NationalGovFooter />

      {/* Slide-over Assistant Drawer */}
      <AssistantDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
