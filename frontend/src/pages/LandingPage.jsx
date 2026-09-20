import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Users, Building2, ArrowRight, CheckCircle2, ChevronRight,
  Database, FileCheck, Award, BookOpen, ExternalLink, Sparkles,
  Search, AlertCircle, IndianRupee, MapPin, Check, HelpCircle, PhoneCall
} from 'lucide-react';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';
import { t } from '../i18n';

// Sample families curated directly from the active 3,000 database
const FEATURED_FAMILIES = [
  {
    family_id: 'GJ-F000525',
    head_name: 'Vijay Dipak Thakor',
    district: 'Anand',
    taluka: 'Anand',
    social_category: 'SC',
    annual_income: 124173,
    family_size: 5,
    gaps_count: 5,
    active_count: 2,
    highlight_gap: 'Dr. Ambedkar Awas Yojana & Sant Surdas Pension',
    ration_card: 'RC-GJ-0525',
  },
  {
    family_id: 'GJ-F000001',
    head_name: 'Dipak Dipak Mehta',
    district: 'Junagadh',
    taluka: 'Junagadh Rural',
    social_category: 'OBC',
    annual_income: 210790,
    family_size: 5,
    gaps_count: 1,
    active_count: 1,
    highlight_gap: 'Post-Matric Scholarship for Higher Education',
    ration_card: 'RC-GJ-0001',
  },
  {
    family_id: 'GJ-F000024',
    head_name: 'Suman Vijay Thakor',
    district: 'Vadodara',
    taluka: 'Dabhoi',
    social_category: 'SC',
    annual_income: 94052,
    family_size: 3,
    gaps_count: 2,
    active_count: 2,
    highlight_gap: 'Manav Garima Self-Employment Toolkit',
    ration_card: 'RC-GJ-0024',
  },
  {
    family_id: 'GJ-F000002',
    head_name: 'Vipul Kishore Chavda',
    district: 'Surat',
    taluka: 'Chorasi',
    social_category: 'General',
    annual_income: 161446,
    family_size: 4,
    gaps_count: 1,
    active_count: 1,
    highlight_gap: 'Indira Gandhi National Old Age Pension',
    ration_card: 'RC-GJ-0002',
  },
];

export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const [quickId, setQuickId] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const query = quickId.trim().toUpperCase();
    if (!query) return;
    if (query.startsWith('GJ-F') || query.startsWith('GJ-')) {
      navigate(`/officer/families/${query}`);
    } else {
      navigate(`/officer/families?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col justify-between text-slate-800 antialiased selection:bg-navy/10 selection:text-navy">
      {/* Official Government Top Bar & Header */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'))}
        onSelectLang={(code) => setLang(code)}
        currentRole="public"
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {/* ================================================================ */}
        {/* HERO SECTION: High-Impact Official Government Portal Banner */}
        {/* ================================================================ */}
        <section className="relative bg-gradient-to-b from-[#0A2540] via-[#0F3254] to-[#0A2540] text-white py-12 md:py-16 px-4 sm:px-6 overflow-hidden border-b-4 border-[#FF671F]">
          {/* Subtle Geometric Emblem Backdrop */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 112" className="w-[800px] h-[800px]" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center">
            {/* National DPI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-amber-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse"></span>
              <span className="font-semibold tracking-wide">
                {t('hero_badge', lang)}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white drop-shadow-sm">
                Family360
              </h1>
              <p className="text-lg sm:text-2xl font-semibold text-amber-300 font-serif max-w-3xl mx-auto leading-snug">
                {t('hero_title', lang)}
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
              {t('hero_subtitle', lang)}
            </p>

            {/* Interactive Hero Search / Lookup Bar */}
            <div className="max-w-2xl mx-auto pt-2">
              <form
                onSubmit={handleQuickSearch}
                className="flex flex-col sm:flex-row items-stretch bg-white p-1.5 rounded-xl shadow-2xl border-2 border-white/20"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t('search_placeholder', lang)}
                    value={quickId}
                    onChange={(e) => setQuickId(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-11 pr-3 py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 sm:mt-0">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>{t('search_btn', lang)}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </form>

              {/* Sample Quick Demo Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-300">
                <span className="text-[11px] font-medium text-slate-300">
                  {t('quick_demo_ids', lang)}
                </span>
                {['GJ-F000525', 'GJ-F000001', 'GJ-F000024', 'GJ-F000002'].map((demoId) => (
                  <button
                    key={demoId}
                    type="button"
                    onClick={() => {
                      setQuickId(demoId);
                      navigate(`/officer/families/${demoId}`);
                    }}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105"
                  >
                    {demoId}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Key Metrics Strip */}
            <div className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase block font-semibold">
                  {t('stat_households', lang)}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1 block">
                  3,000
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-300 font-medium block mt-0.5">
                  ✓ {t('stat_households_sub', lang)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase block font-semibold">
                  {t('stat_gaps', lang)}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-200 mt-1 block">
                  2,639
                </span>
                <span className="text-[10px] sm:text-[11px] text-amber-300 font-medium block mt-0.5">
                  ⚡ {t('stat_gaps_sub', lang)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase block font-semibold">
                  {t('stat_schemes', lang)}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1 block">
                  11
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium block mt-0.5">
                  📋 {t('stat_schemes_sub', lang)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-amber-300 uppercase block font-semibold">
                  {t('stat_districts', lang)}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1 block">
                  33
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium block mt-0.5">
                  🏛️ {t('stat_districts_sub', lang)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TWO PRIMARY PORTAL GATEWAYS (Officer vs Citizen) */}
        {/* ================================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Gateway 1: Officer Console */}
            <div className="bg-white rounded-2xl border-2 border-navy p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <span className="text-[11px] font-mono uppercase font-bold text-navy bg-navy/10 px-2.5 py-1 rounded">
                    {t('officer_portal_badge', lang)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Official Personnel
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-serif text-navy group-hover:text-navy-dark transition-colors">
                  {t('officer_portal_title', lang)}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {t('officer_portal_desc', lang)}
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('officer_f1', lang)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('officer_f2', lang)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('officer_f3', lang)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200">
                <Link
                  to="/officer/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-navy hover:bg-navy-dark transition-all shadow-md group-hover:bg-[#071D33]"
                >
                  <span>{t('officer_btn', lang)}</span>
                  <ArrowRight className="w-4 h-4 text-[#FF671F]" />
                </Link>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1">
                  <Link to="/officer/families" className="hover:text-navy underline">
                    Family Registry (3,000)
                  </Link>
                  <span>·</span>
                  <Link to="/officer/duplicates" className="hover:text-navy underline">
                    Review Queue (3,356)
                  </Link>
                  <span>·</span>
                  <Link to="/officer/schemes" className="hover:text-navy underline">
                    11 Schemes
                  </Link>
                </div>
              </div>
            </div>

            {/* Gateway 2: Citizen Self-Service Portal */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded">
                    {t('citizen_portal_badge', lang)}
                  </span>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>
                    Public Access
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 group-hover:text-navy transition-colors">
                  {t('citizen_portal_title', lang)}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {t('citizen_portal_desc', lang)}
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('citizen_f1', lang)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('citizen_f2', lang)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('citizen_f3', lang)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200">
                <Link
                  to="/citizen/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all shadow-sm"
                >
                  <span>{t('citizen_btn', lang)}</span>
                  <ChevronRight className="w-4 h-4 text-navy" />
                </Link>

                <div className="flex items-center justify-center text-[11px] text-slate-500 mt-2.5">
                  <span>Direct Demo:</span>
                  <Link
                    to="/citizen/family/GJ-F000525"
                    className="ml-1 text-navy font-bold hover:underline"
                  >
                    Open Household GJ-F000525 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* LIVE DATASET SHOWCASE: Featured Verified Households */}
        {/* ================================================================ */}
        <section className="bg-white border-y border-slate-200 py-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-navy/10 text-navy font-mono text-[11px] font-bold uppercase mb-2">
                  <Database className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>3,000 Live Records</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-navy">
                  {t('dataset_title', lang)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  {t('dataset_subtitle', lang)}
                </p>
              </div>

              <Link
                to="/officer/families"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-[#FF671F] transition-colors self-start md:self-auto"
              >
                <span>View All 3,000 Families in Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURED_FAMILIES.map((fam) => (
                <div
                  key={fam.family_id}
                  className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-navy/40 p-4 transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy text-white">
                        {fam.family_id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {fam.social_category}
                      </span>
                    </div>

                    {/* Head Name */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-navy transition-colors">
                        {fam.head_name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{fam.taluka}, {fam.district}</span>
                      </p>
                    </div>

                    {/* Demographic Stats */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('annual_income', lang)}</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          ₹{fam.annual_income.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('members_count', lang)}</span>
                        <span className="font-semibold text-slate-800">
                          {fam.family_size} Members
                        </span>
                      </div>
                    </div>

                    {/* Benefit Gaps Alert */}
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                        <span>{t('benefit_gap_detected', lang)}</span>
                        <span className="font-mono bg-amber-200 px-1.5 py-0.2 rounded text-[10px]">
                          {fam.gaps_count} Gaps
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-1 line-clamp-1 font-medium">
                        {fam.highlight_gap}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                    <Link
                      to={`/officer/families/${fam.family_id}`}
                      className="flex-1 py-1.5 text-center text-[11px] font-bold text-white bg-navy hover:bg-navy-dark rounded-md transition-colors"
                    >
                      {t('view_family_detail', lang)}
                    </Link>
                    <Link
                      to={`/citizen/family/${fam.family_id}`}
                      className="px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-navy hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
                      title={t('view_as_citizen', lang)}
                    >
                      <Users className="w-3.5 h-3.5 text-[#FF671F]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* STATUTORY WELFARE SECTORS (6 Pillars) */}
        {/* ================================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-navy">
              {t('sectors_title', lang)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('sectors_subtitle', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sector 1: Education */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base">
                🎓
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_education', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_education_sub', lang)}</p>
            </div>

            {/* Sector 2: Social Security */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base">
                👴
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_security', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_security_sub', lang)}</p>
            </div>

            {/* Sector 3: Housing */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
                🏠
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_housing', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_housing_sub', lang)}</p>
            </div>

            {/* Sector 4: Women & Child */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-base">
                👩
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_women', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_women_sub', lang)}</p>
            </div>

            {/* Sector 5: Divyangjan */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-base">
                ♿
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_disability', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_disability_sub', lang)}</p>
            </div>

            {/* Sector 6: Economic */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-navy/30 transition-all shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
                💼
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t('sector_economic', lang)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('sector_economic_sub', lang)}</p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ARCHITECTURAL PILLARS (DPI Foundation) */}
        {/* ================================================================ */}
        <section className="bg-slate-100 border-t border-slate-200 py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-navy">
                {t('pillars_title', lang)}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded bg-navy-subtle text-navy flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t('pillar_1_title', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t('pillar_1_desc', lang)}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded bg-navy-subtle text-navy flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t('pillar_2_title', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t('pillar_2_desc', lang)}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded bg-navy-subtle text-navy flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t('pillar_3_title', lang)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t('pillar_3_desc', lang)}</p>
              </div>
            </div>

            {/* Helpline strip */}
            <div className="p-4 rounded-xl bg-navy text-white flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#FF671F]" />
                <span className="font-bold">{t('helpline_title', lang)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-amber-200 font-mono text-[11px]">
                <span>{t('helpline_cm', lang)}</span>
                <span className="text-white/20">|</span>
                <span>{t('helpline_tollfree', lang)}</span>
                <span className="text-white/20">|</span>
                <span>NIC Gujarat State Center</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Official Government Footer */}
      <NationalGovFooter lang={lang} />
    </div>
  );
}
