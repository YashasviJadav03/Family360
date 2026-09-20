import React, { useState, useMemo } from 'react';
import {
  AlertCircle, CheckCircle2, ChevronRight,
  Building2, Tag, ShieldCheck, Filter,
  GraduationCap, Home, Users, HeartHandshake, Sparkles
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
    <div className="space-y-5">
      {/* Header with Filter Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Welfare Entitlement Analysis
          </h3>
          <p className="text-xs text-slate-500">
            11 Gujarat social protection schemes evaluated
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Filter className="w-3 h-3 text-slate-400 mr-1" />
          {[
            { id: 'ALL', label: 'All' },
            { id: 'HOUSING', label: 'Housing' },
            { id: 'EDUCATION', label: 'Education' },
            { id: 'SOCIAL', label: 'Pensions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                activeCategoryFilter === tab.id
                  ? 'bg-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border-2 border-orange-200 shadow-sm" style={{ borderTop: '3px solid #F58220' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-900">
              Unclaimed Gaps
            </span>
            <span className="text-2xl font-black text-orange-950 font-mono">
              {gapReport.gap_count}
            </span>
          </div>
          <p className="text-xs text-orange-800">
            Eligible but no active benefit records
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 shadow-sm" style={{ borderTop: '3px solid #16805C' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Active Benefits
            </span>
            <span className="text-2xl font-black text-emerald-950 font-mono">
              {gapReport.receiving_count}
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            Verified disbursements flowing to household
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm" style={{ borderTop: '3px solid #1D4ED8' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              Total Evaluated
            </span>
            <span className="text-2xl font-black text-blue-950 font-mono">
              {gapReport.eligible_count + (notEligibleSchemes.length || 0)}
            </span>
          </div>
          <p className="text-xs text-blue-800">
            Full scheme matrix scanned
          </p>
        </div>
      </div>

      {/* Three-Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gaps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-orange-400">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              Eligible — Unclaimed ({filteredGapSchemes.length})
            </h4>
          </div>

          {filteredGapSchemes.length === 0 ? (
            <div className="p-5 text-center rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No Unclaimed Benefits</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredGapSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-3.5 border-l-4 border-l-orange-500 border-orange-200 bg-white hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-orange-900 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      {scheme.scheme_id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      {getCategoryIcon(scheme.category)}
                      {scheme.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-orange transition-colors">
                    {scheme.scheme_name}
                  </h5>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {scheme.benefit}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end text-xs">
                    <span className="inline-flex items-center gap-1 text-orange-700 font-bold group-hover:translate-x-0.5 transition-transform">
                      Review <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Receiving */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-400">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Active Benefits ({filteredReceivingSchemes.length})
            </h4>
          </div>

          {filteredReceivingSchemes.length === 0 ? (
            <div className="p-5 text-center rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
              <p className="font-bold text-slate-700">No Active Benefits</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredReceivingSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-3.5 border-l-4 border-l-emerald-500 border-emerald-200 bg-white hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {scheme.scheme_id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      {getCategoryIcon(scheme.category)}
                      {scheme.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {scheme.scheme_name}
                  </h5>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {scheme.benefit}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-bold group-hover:text-emerald-700">
                      Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not Eligible */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              Not Eligible ({notEligibleSchemes.length})
            </h4>
          </div>

          <div className="space-y-2.5">
            {notEligibleSchemes.slice(0, 5).map((scheme) => (
              <div
                key={scheme.scheme_id}
                onClick={() => handleOpenScheme(scheme)}
                className="card-dpi p-3 bg-slate-50/80 border-slate-200 hover:bg-white cursor-pointer transition-all group"
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
                  Unmet: {scheme.failed_rules?.[0]?.attribute?.replace(/_/g, ' ') || 'Eligibility criteria'}
                </p>
              </div>
            ))}
            {notEligibleSchemes.length > 5 && (
              <p className="text-[11px] text-slate-500 font-medium text-center pt-1">
                + {notEligibleSchemes.length - 5} more evaluated
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Explainer Modal */}
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
