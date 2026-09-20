import React, { useState } from 'react';
import { ShieldCheck, Check, X, Database, Calendar, MapPin, CreditCard, User, AlertCircle, ArrowRight } from 'lucide-react';
import { duplicateApi } from '../api/client';

export default function DuplicateReviewCard({ candidate, onResolved = () => {} }) {
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(candidate.review_status || 'PENDING');
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const r1 = candidate.record_1;
  const r2 = candidate.record_2;
  const matchResult = candidate.match_result;
  const scorePercent = Math.round(matchResult.match_score * 100);

  const handleOpenAction = (status) => {
    setActionType(status);
    setShowNotesModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      setSubmitting(true);
      await duplicateApi.resolveDuplicate(r1.record_id, r2.record_id, {
        status: actionType,
        reviewed_by: 'District Welfare Officer',
        notes: notes.trim() || (actionType === 'CONFIRMED_DUPLICATE' ? 'Reconciled civil identity records' : 'Separated as distinct beneficiaries'),
      });
      setCurrentStatus(actionType);
      setShowNotesModal(false);
      onResolved({
        record1_id: r1.record_id,
        record2_id: r2.record_id,
        status: actionType,
      });
    } catch (err) {
      console.error('Failed to resolve duplicate:', err);
      alert('Error updating duplicate review status.');
    } finally {
      setSubmitting(false);
    }
  };

  const isResolved = currentStatus !== 'PENDING';

  return (
    <div className={`card-dpi p-5 bg-white border transition-all ${
      isResolved ? 'opacity-80 bg-slate-50/50' : 'hover:border-navy hover:shadow-card'
    }`}>
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-navy-subtle text-navy border border-navy/20 font-mono">
            Pair #{r1.record_id.slice(-5)}-{r2.record_id.slice(-5)}
          </span>
          <span className="text-xs text-slate-secondary">
            Detected via Blocking Key: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">{r1.district} · {r1.name_as_recorded?.[0]}*</code>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-medium text-slate-secondary block">Match confidence</span>
            <span className="text-base font-bold font-mono text-navy">{scorePercent}%</span>
          </div>
          {isResolved ? (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${
              currentStatus === 'CONFIRMED_DUPLICATE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              {currentStatus === 'CONFIRMED_DUPLICATE' ? '✓ Reconciled' : '✗ Kept Separate'}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Needs Review
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Records Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Record 1 */}
        <div className="p-3.5 rounded-lg border border-slate-border bg-slate-50/50">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1">
              <Database className="w-3 h-3 text-navy" />
              Source: {r1.source_system?.toUpperCase() || 'CIVIL REGISTRY'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{r1.record_id}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Name as Recorded</span>
              <span className="font-semibold text-slate-text">{r1.name_as_recorded}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {r1.dob}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Gender</span>
                <span className="font-medium text-slate-700">{r1.gender}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Location</span>
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {r1.village}, {r1.district}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Ration Identifier</span>
              <span className="font-mono text-slate-700 text-[11px]">
                {r1.ration_card_id || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Record 2 */}
        <div className="p-3.5 rounded-lg border border-slate-border bg-slate-50/50">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1">
              <Database className="w-3 h-3 text-navy" />
              Source: {r2.source_system?.toUpperCase() || 'SCHOLARSHIP / DBT'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{r2.record_id}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Name as Recorded</span>
              <span className="font-semibold text-slate-text">{r2.name_as_recorded}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {r2.dob}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Gender</span>
                <span className="font-medium text-slate-700">{r2.gender}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Location</span>
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {r2.village}, {r2.district}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Ration Identifier</span>
              <span className="font-mono text-slate-700 text-[11px]">
                {r2.ration_card_id || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Match Signals */}
      <div className="mt-4 pt-3 border-t border-slate-border">
        <p className="text-[11px] font-semibold text-slate-secondary mb-1.5 uppercase tracking-wider">
          Explainable Match Signals
        </p>
        <div className="flex flex-wrap gap-1.5">
          {matchResult.reasons && matchResult.reasons.map((reason, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      {!isResolved && (
        <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-end gap-2.5">
          <button
            onClick={() => handleOpenAction('NOT_DUPLICATE')}
            disabled={submitting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded border border-slate-border transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            Keep Separate
          </button>

          <button
            onClick={() => handleOpenAction('CONFIRMED_DUPLICATE')}
            disabled={submitting}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-navy hover:bg-navy-dark rounded transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 text-orange" />
            Confirm Match
          </button>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-navy-dark/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full border border-slate-border shadow-modal">
            <h4 className="text-sm font-bold text-slate-text mb-1">
              {actionType === 'CONFIRMED_DUPLICATE' ? 'Confirm Record Reconciliation' : 'Confirm Separation'}
            </h4>
            <p className="text-xs text-slate-secondary mb-3">
              This action logs an audit trail event for Gujarat State Data Authority records.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter optional officer justification..."
              rows={3}
              className="w-full text-xs p-2 border border-slate-border rounded focus:outline-none focus:border-navy mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-3 py-1.5 text-xs rounded border border-slate-border text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={submitting}
                className="px-3.5 py-1.5 text-xs rounded font-semibold text-white bg-navy hover:bg-navy-dark disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Submit Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
