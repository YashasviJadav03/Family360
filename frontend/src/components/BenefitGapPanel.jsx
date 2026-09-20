import React, { useState, useMemo } from 'react';
import {
  AlertCircle, CheckCircle2, HelpCircle, ChevronRight, IndianRupee,
  Sparkles, Building2, Tag, ShieldCheck, Filter, ArrowUpRight,
  GraduationCap, Home, Users, HeartHandshake, FileText
} from 'lucide-react';
import EligibilityExplainer from './EligibilityExplainer';

export default function BenefitGapPanel({
  gapReport = null,
  family = null,
  onApplicationCreated = () => {}
}) {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  if (!gapReport) {
    return (
      <div className="card-dpi p-8 text-center text-slate-secondary">
        <p className="text-sm">No eligibility data loaded for this family.</p>
      </div>
    );
  }

  const gapSchemes = gapReport.gap_schemes || [];
  const receivingSchemes = gapReport.receiving_schemes || [];
  const notEligibleSchemes = gapReport.not_eligible_schemes || [];

  // Filter schemes by category if a filter is active
  const filteredGapSchemes = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return gapSchemes;
    return gapSchemes.filter(s => (s.category || '').toUpperCase().includes(activeCategoryFilter));
  }, [gapSchemes, activeCategoryFilter]);

  const filteredReceivingSchemes = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return receivingSchemes;
    return receivingSchemes.filter(s => (s.category || '').toUpperCase().includes(activeCategoryFilter));
  }, [receivingSchemes, activeCategoryFilter]);

  const handleOpenScheme = (scheme) => {
    setSelectedScheme(scheme);
    setExplainerOpen(true);
  };

  const getCategoryIcon = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('housing')) return <Home className="w-3.5 h-3.5" />;
    if (c.includes('education') || c.includes('scholarship')) return <GraduationCap className="w-3.5 h-3.5" />;
    if (c.includes('disability') || c.includes('divyang')) return <HeartHandshake className="w-3.5 h-3.5" />;
    return <Users className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Welfare Reconciliation Status Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-white to-emerald-500/10 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Statutory Welfare Entitlement Engine (Phase 3 Rules)
              </h3>
              <span className="gov-stamp">100% Deterministic</span>
            </div>
            <p className="text-xs text-slate-500">
              Cross-evaluates 11 Gujarat social protection schemes against verified civil profile
            </p>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Schemes' },
            { id: 'HOUSING', label: '🏠 Housing' },
            { id: 'EDUCATION', label: '🎓 Education' },
            { id: 'SOCIAL', label: '👵 Pensions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-2.5 py-1 rounded-full font-semibold text-xs transition-all ${
                activeCategoryFilter === tab.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Header KPI Cards with Authentic Gov Tricolor Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Gaps (Saffron / Amber) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/60 border-2 border-orange-300 relative overflow-hidden gov-card-interactive shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
              Unclaimed Welfare Gaps
            </span>
            <span className="text-2xl font-black text-orange-950 bg-white px-2.5 py-0.5 rounded-lg border-2 border-orange-300 shadow-sm font-mono">
              {gapReport.gap_count}
            </span>
          </div>
          <p className="text-xs text-orange-900 font-medium">
            Family meets all statutory criteria — zero active benefit records registered.
          </p>
          <div className="mt-3 pt-2 border-t border-orange-200/70 flex items-center justify-between text-[11px] text-orange-800 font-semibold">
            <span>Priority: Immediate Review</span>
            <span className="underline">One-Click Draft Available</span>
          </div>
        </div>

        {/* Column 2: Currently Receiving (Emerald Green) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border-2 border-emerald-300 relative overflow-hidden gov-card-interactive shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Verified Benefits
            </span>
            <span className="text-2xl font-black text-emerald-950 bg-white px-2.5 py-0.5 rounded-lg border-2 border-emerald-300 shadow-sm font-mono">
              {gapReport.receiving_count}
            </span>
          </div>
          <p className="text-xs text-emerald-900 font-medium">
            Verified state disbursements actively flowing to this household bank account.
          </p>
          <div className="mt-3 pt-2 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
            <span>PFMS / DBT Linked</span>
            <span className="text-emerald-700">Audit Status: Compliant</span>
          </div>
        </div>

        {/* Column 3: Evaluated Total (Royal Blue) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-200 relative overflow-hidden gov-card-interactive shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              State Schemes Evaluated
            </span>
            <span className="text-2xl font-black text-blue-950 bg-white px-2.5 py-0.5 rounded-lg border-2 border-blue-200 shadow-sm font-mono">
              {gapReport.eligible_count + (notEligibleSchemes.length || 0)}
            </span>
          </div>
          <p className="text-xs text-blue-900 font-medium">
            Standard 11-scheme welfare matrix scanned against verified family metrics.
          </p>
          <div className="mt-3 pt-2 border-t border-blue-200/70 flex items-center justify-between text-[11px] text-blue-800 font-semibold">
            <span>Rule Engine v2.4</span>
            <span>Sub-second match</span>
          </div>
        </div>
      </div>

      {/* 3. Three-Column Detailed Welfare Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Potential Benefit Gaps (Vibrant Saffron/Orange Focus) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-orange-500">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></span>
              Eligible — Unclaimed ({filteredGapSchemes.length})
            </h4>
            <span className="text-[11px] font-bold text-orange-800 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Urgent Gap
            </span>
          </div>

          {filteredGapSchemes.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No Unclaimed Benefits in Filter</p>
              <p className="mt-1">This household has accessed all eligible entitlements under this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGapSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-4 border-l-4 border-l-orange-500 border-orange-200 bg-white hover:border-orange-400 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                      {scheme.scheme_id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      {getCategoryIcon(scheme.category)}
                      {scheme.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-orange transition-colors">
                    {scheme.scheme_name}
                  </h5>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {scheme.benefit}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="gov-stamp text-[10px]">
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      Deterministic Match
                    </span>
                    <span className="inline-flex items-center gap-1 text-orange-700 font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>Review Criteria</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Currently Receiving (India Emerald Green) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
              Active Benefits ({filteredReceivingSchemes.length})
            </h4>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Disbursing
            </span>
          </div>

          {filteredReceivingSchemes.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
              <p className="font-bold text-slate-700">No Active Benefits in Filter</p>
              <p className="mt-1">No active disbursement records registered under this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReceivingSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-4 border-l-4 border-l-emerald-500 border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {scheme.scheme_id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      {getCategoryIcon(scheme.category)}
                      {scheme.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {scheme.scheme_name}
                  </h5>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {scheme.benefit}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="gov-stamp-green text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active Disbursement
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-bold group-hover:text-emerald-700">
                      <span>View History</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Not Eligible (Royal Blue & Slate Disqualifications) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400"></span>
              Not Eligible ({notEligibleSchemes.length})
            </h4>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
              Disqualified
            </span>
          </div>

          <div className="space-y-3">
            {notEligibleSchemes.slice(0, 5).map((scheme) => (
              <div
                key={scheme.scheme_id}
                onClick={() => handleOpenScheme(scheme)}
                className="card-dpi p-3.5 bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                    {scheme.scheme_id}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {scheme.category}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-700 group-hover:text-navy truncate">
                  {scheme.scheme_name}
                </h5>
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Unmet: {scheme.failed_rules?.[0]?.attribute?.replace(/_/g, ' ') || 'Specific eligibility criteria'}
                </p>
              </div>
            ))}
            {notEligibleSchemes.length > 5 && (
              <p className="text-[11px] text-slate-500 font-medium text-center pt-1">
                + {notEligibleSchemes.length - 5} additional schemes evaluated and disqualified
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Explainer Modal */}
      <EligibilityExplainer
        scheme={selectedScheme}
        family={family}
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        onApplicationCreated={onApplicationCreated}
      />
    </div>
  );
}
