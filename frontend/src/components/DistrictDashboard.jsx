import React from 'react';
import {
  Users, AlertCircle, FileCheck, ClipboardList, TrendingUp,
  Download, ArrowUpRight, CheckCircle2, ShieldAlert, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import DataQualityPanel from './DataQualityPanel';
import AssistantPanel from './AssistantPanel';

export default function DistrictDashboard({
  data = null,
  selectedDistrict = 'All',
  onSelectDistrict = () => {},
  onNavigateTo = () => {}
}) {
  if (!data) {
    return (
      <div className="card-dpi p-12 text-center text-slate-secondary">
        <p className="text-sm">Loading district welfare intelligence...</p>
      </div>
    );
  }

  const districts = data.districts || [];
  const totalFamilies = data.total_families || 3000;
  const totalGaps = data.total_eligible_unserved || 2639;

  // Custom colors matching DPI palette
  const CATEGORY_COLORS = ['#172B63', '#F58220', '#16805C', '#175CD3', '#8E24AA', '#546E7A'];

  // Static scheme category breakdown for the pie chart
  const categoryData = [
    { name: 'Education', value: 3 },
    { name: 'Social Security', value: 2 },
    { name: 'Housing', value: 2 },
    { name: 'Women & Child', value: 2 },
    { name: 'Disability', value: 1 },
    { name: 'Economic', value: 1 },
  ];

  // Benefit coverage rates for the signature horizontal bars
  const coverageMetrics = [
    { category: 'Education Scholarships', rate: 78, beneficiaries: '2,340', target: '3,000' },
    { category: 'Women & Child (Ganga Swarupa)', rate: 71, beneficiaries: '1,420', target: '2,000' },
    { category: 'Housing Assistance', rate: 64, beneficiaries: '1,280', target: '2,000' },
    { category: 'Social Security / Pensions', rate: 58, beneficiaries: '980', target: '1,690' },
    { category: 'Divyang / Disability Support', rate: 49, beneficiaries: '420', target: '850' },
    { category: 'Economic / Self-Employment', rate: 42, beneficiaries: '380', target: '900' },
  ];

  return (
    <div className="space-y-6">
      {/* Officer Hero Banner with Official Gujarat State Identity */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm gov-card-saffron relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-navy-dark text-white flex flex-col items-center justify-center shadow-md border-2 border-amber-400 shrink-0">
              <div className="flex items-center gap-0.5 mb-0.5">
                <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                <span className="w-1 h-1 rounded-full bg-white"></span>
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[9px] font-black text-amber-300 font-mono">DPI</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="gov-stamp">DIRECTORATE OF SOCIAL JUSTICE</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Government of Gujarat · Digital Public Infrastructure
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-navy tracking-tight">
                District Social Welfare Command Center (જિલ્લા સમાજ કલ્યાણ કન્સોલ)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Proactive Entitlement Reconciliation & Civil Registry Quality · Real-time State MIS Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="text-xs px-3 py-2 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-navy shadow-inner"
            >
              <option value="All">All Gujarat Districts (10)</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.total_families} families)
                </option>
              ))}
            </select>

            <button
              onClick={() => alert('Generating Official Gujarat District Social Welfare MIS Audit Slip...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy hover:bg-orange rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export MIS Slip</span>
            </button>
          </div>
        </div>

        {/* Curated Hero Demonstrations Ribbon */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>⚡ Audit Showcase (1-Click Inspection):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => (window.location.href = '/officer/families/GJ-F000525')}
              className="px-2.5 py-1 rounded bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-300 font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>GJ-F000525 (Housing Gap · ₹1.2L)</span>
              <ArrowUpRight className="w-3 h-3 text-orange-600" />
            </button>

            <button
              onClick={() => (window.location.href = '/officer/families/GJ-F001954')}
              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>GJ-F001954 (Senior Pension)</span>
              <ArrowUpRight className="w-3 h-3 text-blue-600" />
            </button>

            <button
              onClick={() => (window.location.href = '/officer/families/GJ-F000049')}
              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>GJ-F000049 (Full Entitlements)</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            </button>

            <button
              onClick={() => (window.location.href = '/officer/families/GJ-F000012')}
              className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>GJ-F000012 (Education Stipend)</span>
              <ArrowUpRight className="w-3 h-3 text-purple-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Crisp KPI Cards with Authentic Gov Color Top Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Families (Navy & Gold) */}
        <div className="card-dpi p-4.5 bg-white border border-slate-200 gov-card-navy gov-card-interactive shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Families Registered</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-navy shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-navy">{totalFamilies.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
            <span className="text-emerald-700 font-bold">↑ 100% Verified</span>
            <span>State population coverage</span>
          </p>
        </div>

        {/* KPI 2: Benefit Gaps (Saffron & Amber) */}
        <div
          className="card-dpi p-4.5 bg-gradient-to-br from-white to-orange-50/40 border-2 border-orange-300 gov-card-saffron gov-card-interactive shadow-sm cursor-pointer"
          onClick={() => onNavigateTo('families')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              Benefit Gaps
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-800 shadow-xs">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-orange-950">{totalGaps.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-orange-900 mt-1 flex items-center gap-1 font-bold">
            <span>Eligible unserved households</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-orange-700" />
          </p>
        </div>

        {/* KPI 3: Records to Review (Royal Blue) */}
        <div
          className="card-dpi p-4.5 bg-gradient-to-br from-white to-blue-50/30 border border-slate-200 gov-card-interactive shadow-sm cursor-pointer hover:border-blue-400"
          style={{ borderTop: '4px solid #1D4ED8' }}
          onClick={() => onNavigateTo('duplicates')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Review Queue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 shadow-xs">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-950">3,356</p>
          <p className="text-[11px] text-blue-900 mt-1 flex items-center gap-1 font-bold">
            <span>Identity & address clashes</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-blue-700" />
          </p>
        </div>

        {/* KPI 4: Pending Applications (Emerald Green) */}
        <div
          className="card-dpi p-4.5 bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200 gov-card-green gov-card-interactive shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Active Entitlements</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-950">₹4.82 Cr</p>
          <p className="text-[11px] text-emerald-900 mt-1 flex items-center gap-1 font-semibold">
            <span className="text-emerald-700 font-bold">✓ PFMS / DBT Active</span>
            <span>Annual disbursements</span>
          </p>
        </div>
      </div>

      {/* Cross-Registry Data Quality & Profile Completeness Telemetry */}
      <DataQualityPanel />

      {/* Signature Section: Benefit Coverage Overview & Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Horizontal Bars: Benefit Coverage */}
        <div className="lg:col-span-2 card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Benefit Coverage Overview</h3>
              <p className="text-xs text-slate-secondary">
                Ratio of eligible households currently receiving designated scheme benefits
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">11 Schemes Tracked</span>
          </div>

          <div className="space-y-4">
            {coverageMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-text">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-secondary text-[11px]">
                      {item.beneficiaries} / {item.target} households
                    </span>
                    <span className="font-mono font-bold text-navy w-8 text-right">
                      {item.rate}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded transition-all duration-500 ${
                      item.rate >= 70
                        ? 'bg-emerald-600'
                        : item.rate >= 50
                        ? 'bg-navy'
                        : 'bg-orange'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Required Panel */}
        <div className="card-dpi p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-border pb-2.5">
              <h3 className="text-sm font-bold text-slate-text flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-orange" />
                Action Required
              </h3>
              <span className="text-xs font-bold text-orange bg-orange-light px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div
                onClick={() => onNavigateTo('families')}
                className="p-3 rounded border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>Potential Benefit Gaps</span>
                  <span className="font-mono text-sm">{totalGaps}</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Households qualified for unapplied welfare programs
                </p>
              </div>

              <div
                onClick={() => onNavigateTo('duplicates')}
                className="p-3 rounded border border-slate-border bg-slate-50/70 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between font-semibold text-slate-text">
                  <span>Record Reconciliation</span>
                  <span className="font-mono text-sm">3,356</span>
                </div>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Cross-departmental duplicate identity clusters
                </p>
              </div>

              <div className="p-3 rounded border border-slate-border bg-slate-50/70">
                <div className="flex items-center justify-between font-semibold text-slate-text">
                  <span>Incomplete Civil Profiles</span>
                  <span className="font-mono text-sm">361</span>
                </div>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Missing ration or occupation markers for full evaluation
                </p>
              </div>

              <div className="p-3 rounded border border-slate-border bg-slate-50/70">
                <div className="flex items-center justify-between font-semibold text-slate-text">
                  <span>Applications Beyond SLA</span>
                  <span className="font-mono text-sm">184</span>
                </div>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Pending district officer verification &gt; 7 days
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-border text-center">
            <span className="text-[11px] text-slate-400">
              Assigned to Taluka Welfare Officers for physical verification
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Row: District Distribution & Scheme Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Chart */}
        <div className="lg:col-span-2 card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Families with Potential Benefit Gaps by District</h3>
              <p className="text-xs text-slate-secondary">Aggregated across all 10 monitored administrative zones</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
                <XAxis
                  dataKey="district"
                  tick={{ fontSize: 11, fill: '#667085' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#667085' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172B63',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(value) => [`${value} families`, 'Eligible Unserved']}
                />
                <Bar dataKey="eligible_unserved_count" fill="#172B63" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scheme Categories Pie Chart */}
        <div className="card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Schemes by Category</h3>
              <p className="text-xs text-slate-secondary">Distribution of 11 welfare initiatives</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  outerRadius={75}
                  innerRadius={42}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172033',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Natural-Language Officer Query Assistant Panel */}
      <AssistantPanel />
    </div>
  );
}
