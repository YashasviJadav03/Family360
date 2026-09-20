import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, ExternalLink, Send, FileText, Building2, Tag, Bot } from 'lucide-react';
import { applicationApi, familyApi } from '../api/client';

export default function EligibilityExplainer({
  scheme,
  family,
  isOpen,
  onClose,
  onApplicationCreated = () => {}
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [assignedMemberId, setAssignedMemberId] = useState(family?.members?.[0]?.member_id || null);
  const [explanation, setExplanation] = useState(null);
  const [explLoading, setExplLoading] = useState(false);

  useEffect(() => {
    if (isOpen && family?.family_id && scheme?.scheme_id) {
      setExplLoading(true);
      familyApi.getExplanation(family.family_id, scheme.scheme_id)
        .then((res) => setExplanation(res.explanation))
        .catch((err) => {
          console.error("Failed to load explanation:", err);
          setExplanation(null);
        })
        .finally(() => setExplLoading(false));
    }
  }, [isOpen, family?.family_id, scheme?.scheme_id]);

  if (!isOpen || !scheme) return null;

  const matchedRules = scheme.matched_rules || [];
  const failedRules = scheme.failed_rules || [];
  const isEligible = scheme.is_eligible !== false;

  const handleApply = async () => {
    try {
      setSubmitting(true);
      const res = await applicationApi.createApplication({
        family_id: family.family_id,
        member_id: assignedMemberId || family?.members?.[0]?.member_id,
        scheme_id: scheme.scheme_id,
      });
      setSubmitSuccess(true);
      onApplicationCreated(res);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Could not submit application. Please verify officer permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/70 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in duration-200">
        {/* Tricolor Ribbon */}
        <div className="h-[3px] w-full grid grid-cols-3">
          <div className="bg-[#FF671F]"></div>
          <div className="bg-[#FFFFFF]"></div>
          <div className="bg-[#138808]"></div>
        </div>

        {/* Header */}
        <div className="bg-navy px-5 py-3.5 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded font-bold text-amber-300">
                {scheme.scheme_id}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Tag className="w-3 h-3 text-orange" /> {scheme.category}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{scheme.scheme_name}</h3>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" /> {scheme.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Benefit summary */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-0.5">Benefit</p>
            <p className="text-sm font-medium text-navy">{scheme.benefit}</p>
          </div>

          {/* AI Explanation */}
          <div className="rounded-lg bg-blue-50/60 border border-blue-200 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-orange" />
                AI Explanation
              </span>
              <span className="text-[10px] font-medium text-slate-500 font-mono">
                Rule Engine + LLM
              </span>
            </div>
            {explLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                <div className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                <span>Generating explanation...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed">
                {explanation || "Evaluated deterministically by the rule engine against current family attributes."}
              </p>
            )}
          </div>

          {/* Matched Rules */}
          {matchedRules.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Satisfied ({matchedRules.length})
              </h5>
              <div className="space-y-1.5">
                {matchedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs p-2 rounded bg-emerald-50/70 border border-emerald-100 text-emerald-900"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-medium capitalize">{rule.attribute.replace('_', ' ')}</strong>{' '}
                      <code className="font-mono text-[11px] bg-white px-1 rounded border border-emerald-200">
                        {rule.operator} {rule.value}
                      </code>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Rules */}
          {failedRules.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Unmet ({failedRules.length})
              </h5>
              <div className="space-y-1.5">
                {failedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs p-2 rounded bg-amber-50/70 border border-amber-100 text-amber-900"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-medium capitalize">{rule.attribute.replace('_', ' ')}</strong>{' '}
                      <code className="font-mono text-[11px] bg-white px-1 rounded border border-amber-200">
                        {rule.operator} {rule.value}
                      </code>{' '}
                      — not met
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member assignment */}
          {family?.members && family.members.length > 1 && isEligible && (
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Beneficiary
              </label>
              <select
                value={assignedMemberId || ''}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-navy"
              >
                {family.members.map((m) => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.name} ({m.relation_to_head} · {m.gender})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Source URL */}
          {scheme.source_url && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Official Rules
              </span>
              <a
                href={scheme.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-navy hover:text-orange font-medium"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded border border-slate-200 bg-white hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {isEligible && (
            <button
              onClick={handleApply}
              disabled={submitting || submitSuccess}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white transition-all ${
                submitSuccess
                  ? 'bg-emerald-600'
                  : 'bg-orange hover:bg-orange-hover disabled:opacity-50'
              }`}
            >
              {submitSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Created!
                </>
              ) : submitting ? (
                'Processing...'
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
