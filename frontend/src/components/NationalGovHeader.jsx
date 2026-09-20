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
        {/* Formal State Seal & Project Emblem */}
        <div className="flex items-center gap-3.5">
          {/* Authentic State Emblem of India */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center shrink-0">
              <svg
                viewBox="0 0 100 112"
                className="w-10 h-12 text-[#8C6014] drop-shadow-xs"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Center Lion Profile */}
                <path d="M50 7 C46.5 7, 43.5 10, 43.5 14 C43.5 16, 44.5 18, 45.5 19.5 C42.5 20.5, 40.5 22.5, 40.5 26.5 C40.5 28.5, 41.5 31.5, 43.5 33.5 C42.5 35.5, 42.5 38.5, 44.5 41.5 L46.5 44.5 C46.5 47.5, 47.5 50.5, 50 50.5 C52.5 50.5, 53.5 47.5, 53.5 44.5 L55.5 41.5 C57.5 38.5, 57.5 35.5, 56.5 33.5 C58.5 31.5, 59.5 28.5, 59.5 26.5 C59.5 22.5, 57.5 20.5, 54.5 19.5 C55.5 18, 56.5 16, 56.5 14 C56.5 10, 53.5 7, 50 7 Z" />
                {/* Left Lion */}
                <path d="M35 17 C32 17, 29 19, 28 22 C27 24, 28 27, 29 29 C26 31, 25 34, 26 38 C27 41, 29 43, 31 45 C31 48, 33 51, 36 53 L41 54 L41 46 C39 44, 37 41, 37 38 C37 35, 39 32, 41 30 L41 23 C39 22, 37 20, 35 17 Z" />
                {/* Right Lion */}
                <path d="M65 17 C68 17, 71 19, 72 22 C73 24, 72 27, 71 29 C74 31, 75 34, 74 38 C73 41, 71 43, 69 45 C69 48, 67 51, 64 53 L59 54 L59 46 C61 44, 63 41, 63 38 C63 35, 61 32, 59 30 L59 23 C61 22, 63 20, 65 17 Z" />
                {/* Manes Details */}
                <path d="M46 31 C48 29.5, 52 29.5, 54 31 C54 34.5, 46 34.5, 46 31 Z" fill="#65440A" />
                <path d="M44 41 C47 39.5, 53 39.5, 56 41 C55 44.5, 45 44.5, 44 41 Z" fill="#65440A" />

                {/* Abacus Pedestal */}
                <rect x="18" y="55" width="64" height="3.5" rx="1.5" fill="#A8771C" />
                <rect x="16" y="58.5" width="68" height="15" rx="1" fill="#8C6014" />

                {/* Ashoka Chakra in center of Abacus */}
                <circle cx="50" cy="66" r="6" fill="#0A2540" />
                <circle cx="50" cy="66" r="5" fill="#FFFBF2" />
                <circle cx="50" cy="66" r="1.5" fill="#0A2540" />
                <line x1="50" y1="61" x2="50" y2="71" stroke="#0A2540" strokeWidth="0.6" />
                <line x1="45" y1="66" x2="55" y2="66" stroke="#0A2540" strokeWidth="0.6" />
                <line x1="46.5" y1="62.5" x2="53.5" y2="69.5" stroke="#0A2540" strokeWidth="0.6" />
                <line x1="46.5" y1="69.5" x2="53.5" y2="62.5" stroke="#0A2540" strokeWidth="0.6" />

                {/* Left Motif (Horse) */}
                <path d="M26 64 C24.5 63, 23.5 65, 25.5 67 C27.5 68, 30.5 67, 31.5 65 C30.5 63, 28.5 63, 26 64 Z" fill="#FFFBF2" />
                {/* Right Motif (Bull) */}
                <path d="M70 64 C68 64, 69 67, 71 67 C73.5 67, 75.5 65, 73.5 64 C72 63, 71 63, 70 64 Z" fill="#FFFBF2" />

                {/* Inverted Lotus Base */}
                <path d="M20 73.5 L80 73.5 C77 81.5, 66 85.5, 50 85.5 C34 85.5, 23 81.5, 20 73.5 Z" fill="#A8771C" />
                <path d="M24 75.5 C31 81.5, 40 83.5, 50 83.5 C60 83.5, 69 81.5, 76 75.5" stroke="#65440A" strokeWidth="1" fill="none" />
                <rect x="22" y="85.5" width="56" height="3" rx="1" fill="#65440A" />

                {/* Satyameva Jayate Motto */}
                <text
                  x="50"
                  y="100"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="800"
                  fontFamily="'Noto Sans Devanagari', 'Segoe UI', sans-serif"
                  fill="#65440A"
                  letterSpacing="0.4"
                >
                  सत्यमेव जयते
                </text>
              </svg>
            </div>

            {/* Formal Vertical Divider */}
            <div className="h-10 w-[1.5px] bg-slate-200 hidden sm:block"></div>

            {/* Authoritative Title & Department Subtext */}
            <div>
              <div className="flex items-center gap-2">
                <Link to="/" className="text-2xl font-black text-navy tracking-tight hover:opacity-95 flex items-center">
                  <span>Family360</span>
                </Link>
                <span className="font-mono text-[9px] uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-bold">
                  STATE PORTAL
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                  GOV.IN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {lang === 'en'
                  ? 'Government of Gujarat · Unified Family ID & Welfare Portal'
                  : 'ગુજરાત સરકાર · સામાજિક ન્યાય અને અધિકારીતા વિભાગ'}
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
