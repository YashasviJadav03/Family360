import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Search, Filter, AlertCircle, CheckCircle2, ChevronLeft,
  ChevronRight, MapPin, IndianRupee, ArrowRight
} from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';
import FamilyCard from '../components/FamilyCard';
import { familyApi } from '../api/client';

export default function OfficerFamiliesPage() {
  const [families, setFamilies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchId, setSearchId] = useState('');
  const [district, setDistrict] = useState('');
  const [socialCategory, setSocialCategory] = useState('');
  const [hasGapOnly, setHasGapOnly] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const districts = [
    'Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana'
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'SEBC'];

  useEffect(() => {
    let mounted = true;
    async function loadFamilies() {
      try {
        setLoading(true);
        const params = {
          page,
          page_size: pageSize,
        };
        if (district) params.district = district;
        if (socialCategory) {
          params.category = socialCategory;
          params.social_category = socialCategory;
        }
        if (hasGapOnly) params.has_gap = true;

        const data = await familyApi.getFamilies(params);
        if (mounted) {
          setFamilies(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error('Failed to load families:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFamilies();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, district, socialCategory, hasGapOnly]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Official Header & Filter Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm gov-card-saffron">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="gov-stamp">CIVIL REGISTRY</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Gujarat Family ID · Master Population Database
                </span>
              </div>
              <h2 className="text-lg font-black text-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-orange" />
                Gujarat Family ID Master Registry (કુટુંબ રજીસ્ટ્રી)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {total.toLocaleString('en-IN')} households indexed · Direct Benefit Transfer & Social Justice synchronized
              </p>
            </div>

            {/* Quick ID Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchId.trim()) {
                  window.location.href = `/officer/families/${searchId.trim().toUpperCase()}`;
                }
              }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Direct Family ID (e.g. GJ-F000525)..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-800 w-64 focus:outline-none focus:border-navy uppercase font-mono shadow-inner font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy rounded-lg transition-all shadow-sm"
              >
                Go
              </button>
            </form>
          </div>

          {/* Curated Demo Shortcuts Bar */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-blue-50 p-2.5 rounded-lg border border-orange-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-orange-950 flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              ⚡ Curated Hero Audit Cases:
            </span>
            <Link
              to="/officer/families/GJ-F000525"
              className="px-2.5 py-1 rounded bg-white text-orange-900 border border-orange-300 font-bold hover:bg-orange-100 transition-colors shadow-xs"
            >
              GJ-F000525 (Housing Gap)
            </Link>
            <Link
              to="/officer/families/GJ-F001954"
              className="px-2.5 py-1 rounded bg-white text-blue-900 border border-blue-300 font-bold hover:bg-blue-100 transition-colors shadow-xs"
            >
              GJ-F001954 (Senior Pension)
            </Link>
            <Link
              to="/officer/families/GJ-F000049"
              className="px-2.5 py-1 rounded bg-white text-emerald-900 border border-emerald-300 font-bold hover:bg-emerald-100 transition-colors shadow-xs"
            >
              GJ-F000049 (Full Entitlement)
            </Link>
            <Link
              to="/officer/families/GJ-F000012"
              className="px-2.5 py-1 rounded bg-white text-purple-900 border border-purple-300 font-bold hover:bg-purple-100 transition-colors shadow-xs"
            >
              GJ-F000012 (Education)
            </Link>
          </div>

          {/* Granular Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-700">Filters:</span>
            </div>

            {/* District Filter */}
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-navy"
            >
              <option value="">All Districts (10)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Social Category Filter */}
            <select
              value={socialCategory}
              onChange={(e) => {
                setSocialCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-navy"
            >
              <option value="">All Social Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Has Gap Toggle Button */}
            <button
              onClick={() => {
                setHasGapOnly(!hasGapOnly);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
                hasGapOnly
                  ? 'bg-orange-100 text-orange-900 border-orange-400 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>Unclaimed Benefit Gaps Only</span>
            </button>

            {/* View Mode Toggle */}
            <div className="ml-auto flex items-center border border-slate-300 rounded-lg overflow-hidden shadow-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-bold ${
                  viewMode === 'table' ? 'bg-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-bold ${
                  viewMode === 'cards' ? 'bg-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Card Grid
              </button>
            </div>
          </div>
        </div>

        {/* Content Area: Table or Cards */}
        {loading ? (
          <div className="card-dpi p-16 text-center">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-secondary">Loading family registry records...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="card-dpi p-12 text-center text-slate-secondary">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-text">No Families Found</p>
            <p className="text-xs mt-1">Adjust filters or search criteria to expand matching records.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="card-dpi bg-white overflow-hidden shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-navy to-navy-dark text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Family ID</th>
                    <th className="py-3 px-4">Administrative Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Members</th>
                    <th className="py-3 px-4">Annual Income</th>
                    <th className="py-3 px-4">Welfare Entitlement Status</th>
                    <th className="py-3 px-4 text-right">Official Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {families.map((fam, idx) => {
                    const hasGap = fam.gap_count > 0;
                    return (
                      <tr key={fam.family_id} className={`hover:bg-amber-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                        <td className="py-3 px-4 font-mono font-bold text-navy">
                          <Link to={`/officer/families/${fam.family_id}`} className="hover:underline hover:text-orange flex items-center gap-1.5">
                            <span>{fam.family_id}</span>
                            {hasGap && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          <div className="font-semibold">{fam.village}</div>
                          <div className="text-[11px] text-slate-500">{fam.taluka}, {fam.district}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            fam.social_category === 'SC' ? 'gov-badge-purple' :
                            fam.social_category === 'ST' ? 'gov-badge-green' :
                            fam.social_category === 'OBC' || fam.social_category === 'SEBC' ? 'gov-badge-saffron' :
                            'gov-badge-navy'
                          }`}>
                            {fam.social_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center justify-center font-mono">
                            {fam.family_size}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          ₹{(fam.annual_income || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          {hasGap ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-900 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-300">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                              {fam.gap_count} {fam.gap_count === 1 ? 'Benefit Gap' : 'Benefit Gaps'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              100% Entitled
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/officer/families/${fam.family_id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-navy hover:bg-orange px-2.5 py-1 rounded transition-colors shadow-xs"
                          >
                            <span>Inspect 360</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {families.map((fam) => (
              <FamilyCard key={fam.family_id} family={fam} viewMode="officer" />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-sm">
          <span className="text-slate-600 font-medium">
            Showing Page <strong className="font-bold text-navy">{page}</strong> of{' '}
            <strong className="font-bold text-navy">{totalPages}</strong> ({total.toLocaleString('en-IN')} verified households)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-border text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-border text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
