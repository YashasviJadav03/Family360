import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, ChevronRight, IndianRupee, Sparkles, Building2, Tag } from 'lucide-react';
import EligibilityExplainer from './EligibilityExplainer';

export default function BenefitGapPanel({
  gapReport = null,
  family = null,
  onApplicationCreated = () => {}
}) {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [explainerOpen, setExplainerOpen] = useState(false);

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

  const handleOpenScheme = (scheme) => {
    setSelectedScheme(scheme);
    setExplainerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Gaps (Visually Dominant Amber) */}
        <div className="p-4 rounded-lg bg-amber-50/70 border-2 border-amber-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Potential Benefit Gaps
            </span>
            <span className="text-xl font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
              {gapReport.gap_count}
            </span>
          </div>
          <p className="text-xs text-amber-800">
            Household meets deterministic eligibility criteria but has no active benefit record.
          </p>
        </div>

        {/* Column 2: Currently Receiving (Green) */}
        <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Currently Receiving
            </span>
            <span className="text-xl font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
              {gapReport.receiving_count}
            </span>
          </div>
          <p className="text-xs text-emerald-700">
            Active verified welfare schemes currently disbursed to this household.
          </p>
        </div>

        {/* Column 3: Evaluated Total */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-slate-500" />
              Schemes Evaluated
            </span>
            <span className="text-xl font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-border">
              {gapReport.eligible_count + (notEligibleSchemes.length || 0)}
            </span>
          </div>
          <p className="text-xs text-slate-secondary">
            Cross-referenced against all 11 Gujarat social protection schemes.
          </p>
        </div>
      </div>

      {/* 3-Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Potential Benefit Gaps (Prominent Amber Focus) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-400">
            <h4 className="text-sm font-bold text-slate-text flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Eligible — Unclaimed ({gapSchemes.length})
            </h4>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          {gapSchemes.length === 0 ? (
            <div className="p-6 text-center rounded-lg bg-slate-50 border border-slate-border text-xs text-slate-secondary">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-text">Full Entitlement Reached</p>
              <p className="mt-1">This family has claimed all schemes for which it is currently eligible.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gapSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-4 border-amber-200 bg-white hover:border-amber-400 hover:shadow-card cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="pl-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {scheme.scheme_id}
                      </span>
                      <span className="text-[11px] text-slate-secondary font-medium">
                        {scheme.category}
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-text group-hover:text-navy transition-colors">
                      {scheme.scheme_name}
                    </h5>

                    <p className="text-xs text-slate-secondary mt-1 line-clamp-2">
                      {scheme.benefit}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Rule-based match
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-navy font-semibold group-hover:text-orange">
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Currently Receiving (Green) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <h4 className="text-sm font-bold text-slate-text flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Active Benefits ({receivingSchemes.length})
            </h4>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Disbursing
            </span>
          </div>

          {receivingSchemes.length === 0 ? (
            <div className="p-6 text-center rounded-lg bg-slate-50 border border-slate-border text-xs text-slate-secondary">
              <p className="font-semibold text-slate-text">No Active Benefits</p>
              <p className="mt-1">No DBT or assistance records registered under this family identifier.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivingSchemes.map((scheme) => (
                <div
                  key={scheme.scheme_id}
                  onClick={() => handleOpenScheme(scheme)}
                  className="card-dpi p-4 border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-card cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                  <div className="pl-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {scheme.scheme_id}
                      </span>
                      <span className="text-[11px] text-slate-secondary font-medium">
                        {scheme.category}
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-text group-hover:text-navy transition-colors">
                      {scheme.scheme_name}
                    </h5>

                    <p className="text-xs text-slate-secondary mt-1 line-clamp-2">
                      {scheme.benefit}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Status: Active
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-slate-500 group-hover:text-navy">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Not Eligible (Gray) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
            <h4 className="text-sm font-bold text-slate-secondary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              Not Eligible ({notEligibleSchemes.length})
            </h4>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Rule Disqualified
            </span>
          </div>

          <div className="space-y-3">
            {notEligibleSchemes.slice(0, 5).map((scheme) => (
              <div
                key={scheme.scheme_id}
                onClick={() => handleOpenScheme(scheme)}
                className="card-dpi p-3.5 bg-slate-50/70 border-slate-border hover:bg-white hover:border-slate-300 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1 py-0.5 rounded">
                    {scheme.scheme_id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {scheme.category}
                  </span>
                </div>
                <h5 className="text-xs font-medium text-slate-700 truncate">
                  {scheme.scheme_name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  Unmet: {scheme.failed_rules?.[0]?.attribute?.replace('_', ' ') || 'Specific criteria'}
                </p>
              </div>
            ))}
            {notEligibleSchemes.length > 5 && (
              <p className="text-[11px] text-slate-400 text-center pt-1">
                + {notEligibleSchemes.length - 5} additional schemes evaluated
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
