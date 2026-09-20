import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, AlertCircle, CheckCircle2, ChevronLeft,
  ChevronRight, X, ArrowRight, ShieldCheck, Tag, ExternalLink
} from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';
import FamilyCard from '../components/FamilyCard';
import { familyApi, schemeApi } from '../api/client';

export default function OfficerFamiliesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get('search') || '';
  const urlDistrict = searchParams.get('district') || '';
  const urlCategory = searchParams.get('category') || searchParams.get('social_category') || '';
  const urlSchemeId = searchParams.get('scheme_id') || '';
  const urlHasGap = searchParams.get('has_gap') === 'true';

  const [families, setFamilies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(true);

  // Filter states initialized from URL params
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [activeSearch, setActiveSearch] = useState(urlSearch);
  const [district, setDistrict] = useState(urlDistrict);
  const [socialCategory, setSocialCategory] = useState(urlCategory);
  const [schemeId, setSchemeId] = useState(urlSchemeId);
  const [hasGapOnly, setHasGapOnly] = useState(urlHasGap);
  const [viewMode, setViewMode] = useState('table'); // table or cards
  const [schemes, setSchemes] = useState([]);

  const districts = [
    'Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana'
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'SEBC'];

  // Load scheme list for filter dropdown
  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await schemeApi.getSchemes();
        setSchemes(data || []);
      } catch (err) {
        console.error('Failed to load schemes list:', err);
      }
    }
    loadSchemes();
  }, []);

  // Sync state with URL search params if URL changes externally
  useEffect(() => {
    setActiveSearch(searchParams.get('search') || '');
    setSearchInput(searchParams.get('search') || '');
    setDistrict(searchParams.get('district') || '');
    setSocialCategory(searchParams.get('category') || searchParams.get('social_category') || '');
    setSchemeId(searchParams.get('scheme_id') || '');
    setHasGapOnly(searchParams.get('has_gap') === 'true');
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    async function loadFamilies() {
      try {
        setLoading(true);
        const params = {
          page,
          page_size: pageSize,
        };
        if (activeSearch.trim()) params.search = activeSearch.trim();
        if (district) params.district = district;
        if (socialCategory) {
          params.category = socialCategory;
          params.social_category = socialCategory;
        }
        if (schemeId) params.scheme_id = schemeId;
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
  }, [page, pageSize, activeSearch, district, socialCategory, schemeId, hasGapOnly]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === false) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) {
      setActiveSearch('');
      updateFilters({ search: '' });
      return;
    }

    // If exact family ID format, navigate directly
    if (query.startsWith('GJ-F') && query.length >= 8) {
      navigate(`/officer/families/${query}`);
      return;
    }

    setActiveSearch(query);
    updateFilters({ search: query });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setDistrict('');
    setSocialCategory('');
    setSchemeId('');
    setHasGapOnly(false);
    setSearchParams(new URLSearchParams());
  };

  const totalPages = Math.ceil(total / pageSize) || 1;
  const activeSchemeObj = schemes.find((s) => s.scheme_id === schemeId);

  return (
    <OfficerLayout>
      <div className="space-y-5">
        {/* Header & Filters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-navy flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF671F]" />
                  Gujarat Family Registry
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy-subtle text-navy border border-navy/20">
                  DPI Node
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {total.toLocaleString('en-IN')} households matching current criteria
              </p>
            </div>

            {/* Quick ID Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID, Village, Taluka..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 w-56 focus:outline-none focus:border-navy uppercase font-mono font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-lg transition-all shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Active Filter Badges */}
          {(activeSearch || district || socialCategory || schemeId || hasGapOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                Active Filters:
              </span>

              {activeSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-navy border border-blue-200 font-medium">
                  <span>Query: "{activeSearch}"</span>
                  <button onClick={() => { setSearchInput(''); setActiveSearch(''); updateFilters({ search: '' }); }}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}

              {district && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  <span>District: {district}</span>
                  <button onClick={() => { setDistrict(''); updateFilters({ district: '' }); }}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}

              {socialCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                  <span>Category: {socialCategory}</span>
                  <button onClick={() => { setSocialCategory(''); updateFilters({ category: '' }); }}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}

              {schemeId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-medium">
                  <span>Scheme: {activeSchemeObj ? activeSchemeObj.scheme_name : schemeId}</span>
                  <button onClick={() => { setSchemeId(''); updateFilters({ scheme_id: '' }); }}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}

              {hasGapOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-300 font-medium">
                  <span>Unclaimed Gaps Only</span>
                  <button onClick={() => { setHasGapOnly(false); updateFilters({ has_gap: false }); }}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filter Dropdowns Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-700">Filter By:</span>
            </div>

            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
                updateFilters({ district: e.target.value });
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-navy"
            >
              <option value="">All Districts (10)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={socialCategory}
              onChange={(e) => {
                setSocialCategory(e.target.value);
                setPage(1);
                updateFilters({ category: e.target.value });
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-navy"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={schemeId}
              onChange={(e) => {
                setSchemeId(e.target.value);
                setPage(1);
                updateFilters({ scheme_id: e.target.value });
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-navy max-w-xs truncate"
            >
              <option value="">All Statutory Schemes (11)</option>
              {schemes.map((s) => (
                <option key={s.scheme_id} value={s.scheme_id}>
                  {s.scheme_id} · {s.scheme_name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const nextVal = !hasGapOnly;
                setHasGapOnly(nextVal);
                setPage(1);
                updateFilters({ has_gap: nextVal });
              }}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
                hasGapOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Gaps Only</span>
            </button>

            {/* View Mode Toggle */}
            <div className="ml-auto flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  viewMode === 'table' ? 'bg-white text-navy shadow-xs' : 'text-slate-500'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  viewMode === 'cards' ? 'bg-white text-navy shadow-xs' : 'text-slate-500'
                }`}
              >
                Card View
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="card-dpi p-16 text-center bg-white border border-slate-200">
            <div className="w-8 h-8 border-2 border-navy border-t-[#FF671F] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Querying Gujarat Family Registry...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="card-dpi p-12 text-center bg-white border border-slate-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No matching family records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria, category filters, or scheme parameters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-dark transition-colors inline-block"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Family ID</th>
                    <th className="py-3 px-4">District / Taluka</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Annual Income</th>
                    <th className="py-3 px-4 text-center">Active Benefits</th>
                    <th className="py-3 px-4 text-center">Benefit Gaps</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {families.map((f) => (
                    <tr key={f.family_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          to={`/officer/families/${f.family_id}`}
                          className="font-mono font-bold text-navy hover:text-[#FF671F] flex items-center gap-1.5"
                        >
                          <span>{f.family_id}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Ration: {f.ration_card_id || 'Nil'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{f.district}</span>
                        <span className="text-[11px] text-slate-400">{f.taluka}, {f.village}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                          {f.social_category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                        ₹{(f.annual_income || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                          {f.receiving_count || 0} Schemes
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {(f.gap_count || 0) > 0 ? (
                          <span className="font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs">
                            {f.gap_count} Gaps
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Saturated</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/officer/families/${f.family_id}`}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-md transition-colors"
                          >
                            360° Audit
                          </Link>
                          <Link
                            to={`/citizen/family/${f.family_id}`}
                            className="p-1 text-slate-500 hover:text-navy hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                            title="Open Citizen View"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#FF671F]" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {families.map((f) => (
              <FamilyCard key={f.family_id} family={f} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs shadow-sm">
            <span className="text-slate-500">
              Showing Page <strong className="text-slate-800">{page}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </OfficerLayout>
  );
}
