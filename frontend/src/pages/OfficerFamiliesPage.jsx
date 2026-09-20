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
        if (socialCategory) params.social_category = socialCategory;
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
        {/* Header & Filter Bar */}
        <div className="bg-white p-5 rounded-lg border border-slate-border space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-navy" />
                Gujarat Family ID Master Registry
              </h2>
              <p className="text-xs text-slate-secondary mt-0.5">
                {total.toLocaleString('en-IN')} families registered · Civil Supplies & Social Justice integrated
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
                  placeholder="Direct Family ID (e.g. GJ-F000001)..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 border border-slate-border rounded bg-slate-50 text-slate-text w-64 focus:outline-none focus:border-navy uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold text-white bg-navy hover:bg-navy-dark rounded transition-colors"
              >
                Go
              </button>
            </form>
          </div>

          {/* Granular Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-border text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">Filters:</span>
            </div>

            {/* District Filter */}
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-border rounded bg-slate-50 text-slate-text focus:outline-none focus:border-navy"
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
              className="px-2.5 py-1.5 border border-slate-border rounded bg-slate-50 text-slate-text focus:outline-none focus:border-navy"
            >
              <option value="">All Categories</option>
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
              className={`px-3 py-1.5 rounded font-semibold border transition-colors flex items-center gap-1.5 ${
                hasGapOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-border hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Potential Benefit Gaps Only</span>
            </button>

            {/* View Mode Toggle */}
            <div className="ml-auto flex items-center border border-slate-border rounded overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-medium ${
                  viewMode === 'table' ? 'bg-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-medium ${
                  viewMode === 'cards' ? 'bg-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Cards
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
          <div className="card-dpi bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-border text-slate-secondary font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Family ID</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Members</th>
                    <th className="py-3 px-4">Annual Income</th>
                    <th className="py-3 px-4">Welfare Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border">
                  {families.map((fam) => {
                    const hasGap = fam.gap_count > 0;
                    return (
                      <tr key={fam.family_id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-navy">
                          <Link to={`/officer/families/${fam.family_id}`} className="hover:underline">
                            {fam.family_id}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div>{fam.village}</div>
                          <div className="text-[11px] text-slate-400">{fam.taluka}, {fam.district}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
                            {fam.social_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-700">
                          {fam.family_size}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          ₹{(fam.annual_income || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          {hasGap ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              {fam.gap_count} {fam.gap_count === 1 ? 'Potential Gap' : 'Potential Gaps'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Full Coverage
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/officer/families/${fam.family_id}`}
                            className="inline-flex items-center gap-1 text-navy hover:text-orange font-semibold transition-colors"
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
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-border text-xs">
          <span className="text-slate-secondary">
            Showing Page <strong className="font-semibold text-slate-text">{page}</strong> of{' '}
            <strong className="font-semibold text-slate-text">{totalPages}</strong> ({total.toLocaleString('en-IN')} families)
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
