import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, ArrowRight, ExternalLink } from 'lucide-react';

export default function NationalGovHeader({
  lang = 'en',
  onToggleLang = () => {},
  currentRole = 'officer',
}) {
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* National Tricolor Top Ribbon */}
      <div className="h-[3px] w-full grid grid-cols-3">
        <div className="bg-[#FF671F]"></div>
        <div className="bg-[#FFFFFF] border-y border-slate-100"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* Top Utility Bar */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 py-1 text-[11px] text-[#475569] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-[#0F172A]">
            {lang === 'en' ? 'GOVERNMENT OF GUJARAT' : 'ગુજરાત સરકાર'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">
            {lang === 'en'
              ? 'Department of Social Justice & Empowerment'
              : 'સામાજિક ન્યાય અને અધિકારીતા વિભાગ'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#main-content"
            className="hover:underline text-navy font-semibold hidden md:inline"
          >
            {lang === 'en' ? 'Skip to content' : 'મુખ્ય સામગ્રી'}
          </a>
          <span className="text-slate-300 hidden md:inline">|</span>
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 font-bold text-navy hover:text-[#FF671F] px-1.5 py-0.5 rounded transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Emblem & Title */}
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 100 112"
            className="w-10 h-12 text-[#8C6014] drop-shadow-xs shrink-0"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M50 7 C46.5 7, 43.5 10, 43.5 14 C43.5 16, 44.5 18, 45.5 19.5 C42.5 20.5, 40.5 22.5, 40.5 26.5 C40.5 28.5, 41.5 31.5, 43.5 33.5 C42.5 35.5, 42.5 38.5, 44.5 41.5 L46.5 44.5 C46.5 47.5, 47.5 50.5, 50 50.5 C52.5 50.5, 53.5 47.5, 53.5 44.5 L55.5 41.5 C57.5 38.5, 57.5 35.5, 56.5 33.5 C58.5 31.5, 59.5 28.5, 59.5 26.5 C59.5 22.5, 57.5 20.5, 54.5 19.5 C55.5 18, 56.5 16, 56.5 14 C56.5 10, 53.5 7, 50 7 Z" />
            <path d="M35 17 C32 17, 29 19, 28 22 C27 24, 28 27, 29 29 C26 31, 25 34, 26 38 C27 41, 29 43, 31 45 C31 48, 33 51, 36 53 L41 54 L41 46 C39 44, 37 41, 37 38 C37 35, 39 32, 41 30 L41 23 C39 22, 37 20, 35 17 Z" />
            <path d="M65 17 C68 17, 71 19, 72 22 C73 24, 72 27, 71 29 C74 31, 75 34, 74 38 C73 41, 71 43, 69 45 C69 48, 67 51, 64 53 L59 54 L59 46 C61 44, 63 41, 63 38 C63 35, 61 32, 59 30 L59 23 C61 22, 63 20, 65 17 Z" />
            <path d="M46 31 C48 29.5, 52 29.5, 54 31 C54 34.5, 46 34.5, 46 31 Z" fill="#65440A" />
            <path d="M44 41 C47 39.5, 53 39.5, 56 41 C55 44.5, 45 44.5, 44 41 Z" fill="#65440A" />
            <rect x="18" y="55" width="64" height="3.5" rx="1.5" fill="#A8771C" />
            <rect x="16" y="58.5" width="68" height="15" rx="1" fill="#8C6014" />
            <circle cx="50" cy="66" r="6" fill="#0A2540" />
            <circle cx="50" cy="66" r="5" fill="#FFFBF2" />
            <circle cx="50" cy="66" r="1.5" fill="#0A2540" />
            <line x1="50" y1="61" x2="50" y2="71" stroke="#0A2540" strokeWidth="0.6" />
            <line x1="45" y1="66" x2="55" y2="66" stroke="#0A2540" strokeWidth="0.6" />
            <line x1="46.5" y1="62.5" x2="53.5" y2="69.5" stroke="#0A2540" strokeWidth="0.6" />
            <line x1="46.5" y1="69.5" x2="53.5" y2="62.5" stroke="#0A2540" strokeWidth="0.6" />
            <path d="M26 64 C24.5 63, 23.5 65, 25.5 67 C27.5 68, 30.5 67, 31.5 65 C30.5 63, 28.5 63, 26 64 Z" fill="#FFFBF2" />
            <path d="M70 64 C68 64, 69 67, 71 67 C73.5 67, 75.5 65, 73.5 64 C72 63, 71 63, 70 64 Z" fill="#FFFBF2" />
            <path d="M20 73.5 L80 73.5 C77 81.5, 66 85.5, 50 85.5 C34 85.5, 23 81.5, 20 73.5 Z" fill="#A8771C" />
            <path d="M24 75.5 C31 81.5, 40 83.5, 50 83.5 C60 83.5, 69 81.5, 76 75.5" stroke="#65440A" strokeWidth="1" fill="none" />
            <rect x="22" y="85.5" width="56" height="3" rx="1" fill="#65440A" />
            <text x="50" y="100" textAnchor="middle" fontSize="8.5" fontWeight="800" fontFamily="'Noto Sans Devanagari', 'Segoe UI', sans-serif" fill="#65440A" letterSpacing="0.4">
              सत्यमेव जयते
            </text>
          </svg>

          <div className="h-10 w-[1.5px] bg-slate-200 hidden sm:block"></div>

          <div>
            <Link to="/" className="text-xl font-black text-navy tracking-tight hover:opacity-95">
              Family360
            </Link>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'en'
                ? 'Unified Family ID & Welfare Portal'
                : 'ગુજરાત સરકાર · સમાજ કલ્યાણ પોર્ટલ'}
            </p>
          </div>
        </div>

        {/* Global Search */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-sm hidden lg:flex items-center">
          <div className="relative flex-1 flex items-center border border-slate-200 rounded-l-lg bg-slate-50 focus-within:bg-white focus-within:border-navy transition-all">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search Family ID, Scheme, or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-r-lg transition-all flex items-center gap-1 border border-navy"
          >
            <span>Search</span>
            <ArrowRight className="w-3 h-3 text-amber-300" />
          </button>
        </form>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          {currentRole === 'officer' ? (
            <Link
              to="/citizen/family/GJ-F000525"
              className="text-xs font-bold text-slate-700 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>Citizen View</span>
              <ExternalLink className="w-3 h-3 text-[#FF671F]" />
            </Link>
          ) : (
            <Link
              to="/officer/dashboard"
              className="text-xs font-bold text-white bg-[#FF671F] hover:opacity-90 px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
            >
              <span>Officer Console</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
