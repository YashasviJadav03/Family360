import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, ChevronDown, Shield, Bell, HelpCircle, ArrowRight } from 'lucide-react';

export default function NationalGovHeader({
  lang = 'en',
  onToggleLang = () => {},
  currentRole = 'officer',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const navigate = useNavigate();

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    if (query.startsWith('GJ-F') || query.startsWith('GJ-')) {
      navigate(`/officer/families/${query}`);
    } else {
      navigate(`/officer/families?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-border text-slate-text select-none">
      {/* 1. Official National Tricolor Hairline (UX4G Standard) */}
      <div className="h-[3px] w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-[#FFFFFF]"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* 2. Top Administrative Utility Strip (India.gov.in / UX4G standard) */}
      <div className="bg-[#F8F9FA] border-b border-[#E9ECEF] px-4 sm:px-6 py-1 text-[11px] text-[#495057] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-medium tracking-tight">
            {lang === 'en' ? 'GOVERNMENT OF GUJARAT' : 'ગુજરાત સરકાર'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-500">
            {lang === 'en' ? 'Department of Social Justice & Empowerment' : 'સામાજિક ન્યાય અને અધિકારીતા વિભાગ'}
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-3">
          <a
            href="#main-content"
            className="hover:underline text-navy font-medium hidden md:inline"
          >
            {lang === 'en' ? 'Skip to main content' : 'મુખ્ય સામગ્રી પર જાઓ'}
          </a>

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Text Resizer */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-border rounded px-1.5 py-0.5 bg-white font-mono text-[10px]">
            <button title="Decrease font" className="hover:text-navy font-bold px-0.5">A-</button>
            <span className="text-slate-300">|</span>
            <button title="Normal font" className="hover:text-navy font-bold px-0.5">A</button>
            <span className="text-slate-300">|</span>
            <button title="Increase font" className="hover:text-navy font-bold px-0.5">A+</button>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Bilingual Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 font-semibold text-navy hover:text-orange px-1.5 py-0.5 rounded transition-colors"
          >
            <Globe className="w-3 h-3 text-orange" />
            <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* 3. Official Department Masthead (Pravi Editorial + India.gov.in Authority) */}
      <div className="px-4 sm:px-6 py-3.5 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* State Seal & Project Emblem */}
        <div className="flex items-center gap-3">
          {/* Emblem of Gujarat / India representation */}
          <div className="w-10 h-10 rounded border border-navy/20 bg-navy-subtle flex flex-col items-center justify-center text-navy font-bold shadow-sm">
            <span className="text-[10px] uppercase font-mono tracking-tighter leading-none text-orange">GUJ</span>
            <span className="text-xs tracking-tighter leading-none font-serif text-navy">360</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-lg sm:text-xl font-bold font-serif text-navy tracking-tight hover:opacity-90">
                Family360
              </Link>
              <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider bg-navy text-white px-2 py-0.5 rounded font-semibold">
                DPI Gujarat
              </span>
            </div>
            <p className="text-[11px] text-slate-secondary">
              {lang === 'en'
                ? 'State Beneficiary Identification & Welfare Intelligence Layer'
                : 'ગુજરાત પરિવાર ઓળખ અને કલ્યાણકારી યોજના ઇન્ટેલિજન્સ પ્લેટફોર્મ'}
            </p>
          </div>
        </div>

        {/* Global Search Bar (India.gov.in pattern) */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-lg hidden lg:flex items-center">
          <div className="relative flex-1 flex items-center border border-slate-border rounded-l bg-slate-50 focus-within:bg-white focus-within:border-navy transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search Family ID (e.g. GJ-F000001), Scheme, or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-transparent text-slate-text placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="text-xs border-y border-r border-slate-border bg-slate-100 text-slate-700 px-2 py-2 focus:outline-none focus:border-navy font-medium"
          >
            <option value="all">All Records</option>
            <option value="families">Family ID</option>
            <option value="schemes">Schemes</option>
            <option value="duplicates">Duplicates</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-navy hover:bg-navy-dark rounded-r transition-colors"
          >
            Search
          </button>
        </form>

        {/* Portal Switching Link */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-mono">PORTAL STATUS</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync (20 Sep 2026)
            </span>
          </div>

          {currentRole === 'officer' ? (
            <Link
              to="/citizen/login"
              className="text-xs font-semibold text-slate-700 hover:text-navy px-3 py-1.5 rounded border border-slate-border hover:bg-slate-50 transition-colors"
            >
              Citizen Portal →
            </Link>
          ) : (
            <Link
              to="/officer/dashboard"
              className="text-xs font-semibold text-white bg-navy hover:bg-navy-dark px-3 py-1.5 rounded transition-colors"
            >
              Officer Console →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
