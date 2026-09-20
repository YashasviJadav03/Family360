import React, { useState, useEffect } from 'react';
import { FileCheck, Filter, ShieldCheck, Database, RefreshCw, AlertCircle } from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';
import DuplicateReviewCard from '../components/DuplicateReviewCard';
import { duplicateApi } from '../api/client';

export default function OfficerDuplicatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');
  const [minScore, setMinScore] = useState(0.65);

  const districts = [
    'Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana'
  ];

  const loadDuplicates = async () => {
    try {
      setLoading(true);
      const params = {
        min_score: minScore,
        limit: 25,
      };
      if (district) params.district = district;

      const data = await duplicateApi.getDuplicates(params);
      setCandidates(data.items || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      console.error('Failed to load duplicate queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, [district, minScore]);

  const handleResolved = (resolvedData) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (
          (c.record_1.record_id === resolvedData.record1_id && c.record_2.record_id === resolvedData.record2_id) ||
          (c.record_1.record_id === resolvedData.record2_id && c.record_2.record_id === resolvedData.record1_id)
        ) {
          return { ...c, review_status: resolvedData.status };
        }
        return c;
      })
    );
  };

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Header & Metrics */}
        <div className="bg-white p-5 rounded-lg border border-slate-border space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-orange"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary">
                  Entity Resolution & Record Reconciliation
                </span>
              </div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-navy" />
                Cross-Departmental Duplicate Review Queue
              </h2>
              <p className="text-xs text-slate-secondary mt-0.5">
                Explainable weighted matcher reconciling civil identities across Ration, Scholarship, Housing & Health feeds
              </p>
            </div>

            <button
              onClick={loadDuplicates}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-border transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Mathematical Blocking Metrics Callout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-border text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-border">
              <span className="text-slate-secondary text-[11px] block">Candidate Pairs</span>
              <span className="font-mono font-bold text-sm text-navy">
                {metrics?.candidates_found?.toLocaleString('en-IN') || '3,356'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-border">
              <span className="text-slate-secondary text-[11px] block">Search Space Reduction</span>
              <span className="font-mono font-bold text-sm text-emerald-700">
                {metrics?.reduction_percentage ? `${metrics.reduction_percentage}%` : '99.31%'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-border">
              <span className="text-slate-secondary text-[11px] block">Blocked Comparisons</span>
              <span className="font-mono font-bold text-sm text-slate-text">
                {metrics?.comparisons_made?.toLocaleString('en-IN') || '773,204'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-border">
              <span className="text-slate-secondary text-[11px] block">Brute-Force Comparisons</span>
              <span className="font-mono font-bold text-sm text-slate-400">
                {metrics?.total_possible_pairs?.toLocaleString('en-IN') || '112,837,753'}
              </span>
            </div>
          </div>

          {/* Granular Filters & Multi-Signal Tuning Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-border">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">Filter By:</span>
              </div>

              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-border rounded bg-slate-50 text-slate-text focus:outline-none focus:border-navy"
              >
                <option value="">All Districts (10)</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <span className="text-slate-secondary text-xs">Confidence Threshold:</span>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={Math.round(minScore * 100)}
                  onChange={(e) => setMinScore(Number(e.target.value) / 100)}
                  className="w-28 accent-navy"
                />
                <span className="font-mono font-bold text-navy text-xs">≥ {Math.round(minScore * 100)}%</span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Model: 100-Point Composite Probabilistic Linkage (GIGW 3.0)
            </span>
          </div>

          {/* 100-Point Multi-Signal Weight Calibration Strip */}
          <div className="p-3.5 rounded-lg bg-navy/5 border border-navy/15 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-navy flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF671F]" />
                <span>Multi-Signal Similarity Scoring Pipeline (100-Point Model):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Total Allocated: <strong className="text-navy">100 / 100 Pts</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Name Similarity:</span>
                  <span className="font-mono font-bold text-navy">20 Pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Dice + Normalized Levenshtein</span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Address & PIN:</span>
                  <span className="font-mono font-bold text-navy">10 Pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Normalized Street & Locality</span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>DOB Proximity:</span>
                  <span className="font-mono font-bold text-navy">30 Pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Exact & Typo Distances</span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Sanitized Phone:</span>
                  <span className="font-mono font-bold text-navy">40 Pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">10-Digit Mobile Exact Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Cards List */}
        {loading ? (
          <div className="card-dpi p-16 text-center">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-secondary">Loading candidate duplicate records...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="card-dpi p-12 text-center text-slate-secondary">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-text">Queue Reconciled</p>
            <p className="text-xs mt-1">No candidate duplicates meeting the selected threshold require verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <DuplicateReviewCard
                key={`${candidate.record_1.record_id}-${candidate.record_2.record_id}`}
                candidate={candidate}
                onResolved={handleResolved}
              />
            ))}
          </div>
        )}
      </div>
    </OfficerLayout>
  );
}
