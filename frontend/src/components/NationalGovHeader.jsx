import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Shield, Bell, HelpCircle, ArrowRight, Award, Flame, ExternalLink } from 'lucide-react';

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
    <div className="w-full bg-white border-b border-slate-border text-slate-text select-none shadow-sm">
      {/* 1. Official National Tricolor Top Ribbon (Saffron, White, Green) */}
      <div className="h-[4px] w-full grid grid-cols-3">
        <div className="bg-[#FF671F]"></div>
        <div className="bg-[#FFFFFF] border-y border-slate-100"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* 2. Top Administrative Utility & Accessibility Bar (UX4G Standard) */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 py-1.5 text-[11px] text-[#475569] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>
            <span className="font-bold tracking-tight text-[#0F172A]">
              {lang === 'en' ? 'GOVERNMENT OF GUJARAT' : 'ગુજરાત સરકાર'}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline font-medium text-slate-600">
            {lang === 'en'
              ? 'Department of Social Justice & Empowerment · Digital Gujarat DPI'
              : 'સામાજિક ન્યાય અને અધિકારીતા વિભાગ · ગુજરાત ડીપીઆઈ'}
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-3">
          <a
            href="#main-content"
            className="hover:underline text-navy font-semibold hidden md:inline text-navy"
          >
            {lang === 'en' ? 'Skip to main content' : 'મુખ્ય સામગ્રી પર જાઓ'}
          </a>

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Text Resizer */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-300 rounded px-1.5 py-0.5 bg-white font-mono text-[10px]">
            <button title="Decrease font" className="hover:text-navy font-bold px-0.5 text-slate-600 hover:text-navy">A-</button>
            <span className="text-slate-300">|</span>
            <button title="Normal font" className="hover:text-navy font-bold px-0.5 text-slate-800">A</button>
            <span className="text-slate-300">|</span>
            <button title="Increase font" className="hover:text-navy font-bold px-0.5 text-slate-600 hover:text-navy">A+</button>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Bilingual Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 font-bold text-navy hover:text-[#FF671F] px-2 py-0.5 rounded bg-blue-50/60 border border-blue-100 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* 3. Official Department Masthead with Emblem of India & Gujarat Seal */}
      <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* State Seal & Project Emblem */}
        <div className="flex items-center gap-3.5">
          {/* Authentic Emblem Representation */}
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0A2540] to-[#172B63] p-1.5 flex flex-col items-center justify-center text-white shadow-md border-2 border-[#FFB81C]/40">
              {/* Ashoka Stambh / State Icon Stylization */}
              <div className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
              </div>
              <span className="text-[9px] font-black uppercase font-mono tracking-widest text-[#FFB81C] mt-0.5">GJ-DPI</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Link to="/" className="text-xl sm:text-2xl font-black text-navy tracking-tight hover:opacity-95 flex items-center gap-1.5">
                  <span>Family360</span>
                  <span className="text-sm font-bold text-[#FF671F] font-serif">(કુટુંબ ૩૬૦)</span>
                </Link>
                <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-wider bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                  GOV.IN VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'en'
                  ? 'Government of Gujarat · Unified Family ID & Proactive Welfare Intelligence'
                  : 'ગુજરાત સરકાર · કુટુંબ આધારિત કલ્યાણકારી યોજનાઓ અને ડેટા ઇન્ટેલિજન્સ'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (India.gov.in pattern) */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-md hidden lg:flex items-center">
          <div className="relative flex-1 flex items-center border-2 border-slate-200 rounded-l-lg bg-slate-50 focus-within:bg-white focus-within:border-navy transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search Family ID (e.g. GJ-F000525), Scheme, or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy rounded-r-lg transition-all shadow-sm flex items-center gap-1 border-2 border-navy"
          >
            <span>Search</span>
            <ArrowRight className="w-3 h-3 text-[#FFB81C]" />
          </button>
        </form>

        {/* Portal Switcher & Live Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="text-[9px] text-emerald-800 block font-mono font-bold uppercase tracking-wider">STATE DATA REPOSITORY</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 gov-pulse"></span>
              Live Sync (3,000 Families)
            </span>
          </div>

          {currentRole === 'officer' ? (
            <Link
              to="/citizen/family/GJ-F000525"
              className="text-xs font-bold text-slate-700 hover:text-navy px-3 py-1.5 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>Citizen View</span>
              <ExternalLink className="w-3 h-3 text-[#FF671F]" />
            </Link>
          ) : (
            <Link
              to="/officer/dashboard"
              className="text-xs font-bold text-white bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:opacity-90 px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
            >
              <span>Officer Console</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* 4. Live Official Announcement / News Ticker Bar */}
      <div className="bg-[#0A2540] text-white text-[11px] py-1 px-4 sm:px-6 flex items-center gap-3 overflow-hidden border-t border-[#1E3A5F]">
        <div className="flex items-center gap-1.5 bg-[#FF671F] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 text-white shadow-sm">
          <Flame className="w-3 h-3 text-[#FFB81C]" />
          <span>OFFICIAL ANNOUNCEMENT</span>
        </div>
        <div className="overflow-hidden relative flex-1 whitespace-nowrap">
          <div className="animate-gov-ticker text-slate-200 font-medium">
            🏛️ <strong>Direct Benefit Transfer (DBT) Mission</strong>: Gujarat Family ID (કુટુંબ ૩૬૦) integrates 11 Welfare Schemes across 10 Administrative Districts · Proactive Unclaimed Benefit Gap Surfacing Active · Zero Autonomous Decision Risk (Deterministic Engine + AI Explainer) · Automated Inter-Departmental Deduplication Enabled
          </div>
        </div>
      </div>
    </div>
  );
}
