import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, IndianRupee, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function FamilyCard({ family, viewMode = 'officer' }) {
  const targetUrl = viewMode === 'citizen'
    ? `/citizen/family/${family.family_id}`
    : `/officer/families/${family.family_id}`;

  const gapCount = family.gap_count ?? 0;
  const isAllCovered = gapCount === 0;

  return (
    <div className="card-dpi p-4 hover:border-slate-divider hover:shadow-card transition-all bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-navy bg-navy-subtle px-2 py-0.5 rounded">
              {family.family_id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-text border border-slate-border">
              {family.social_category || 'General'}
            </span>
          </div>

          {gapCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              {gapCount} {gapCount === 1 ? 'Potential Gap' : 'Potential Gaps'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Full Coverage
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-xs text-slate-secondary mb-4">
          <div className="flex items-center gap-1.5 text-slate-text font-medium text-sm">
            <span>Head: {family.head_name || 'Registered Head'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{family.village}, {family.taluka}, {family.district}</span>
          </div>

          <div className="flex items-center gap-4 pt-1 text-xs">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {family.family_size} Members
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              ₹{(family.annual_income || 0).toLocaleString('en-IN')}/yr
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-border flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Ration: {family.ration_card_id || 'Not linked'}
        </span>
        <Link
          to={targetUrl}
          className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-orange transition-colors"
        >
          <span>View Family 360</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
