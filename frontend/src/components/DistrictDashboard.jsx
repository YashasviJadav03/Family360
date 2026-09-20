import React from 'react';
import {
  Users, AlertCircle, FileCheck, CheckCircle2, TrendingUp,
  Download, ArrowUpRight, ShieldAlert
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

  const CATEGORY_COLORS = ['#172B63', '#F58220', '#16805C', '#175CD3', '#8E24AA', '#546E7A'];

  const categoryData = [
    { name: 'Education', value: 3 },
    { name: 'Social Security', value: 2 },
    { name: 'Housing', value: 2 },
    { name: 'Women & Child', value: 2 },
    { name: 'Disability', value: 1 },
    { name: 'Economic', value: 1 },
  ];

  const coverageMetrics = [
    { category: 'Education Scholarships', rate: 78, beneficiaries: '2,340', target: '3,000' },
    { category: 'Women & Child', rate: 71, beneficiaries: '1,420', target: '2,000' },
    { category: 'Housing Assistance', rate: 64, beneficiaries: '1,280', target: '2,000' },
    { category: 'Social Security / Pensions', rate: 58, beneficiaries: '980', target: '1,690' },
    { category: 'Disability Support', rate: 49, beneficiaries: '420', target: '850' },
    { category: 'Economic / Self-Employment', rate: 42, beneficiaries: '380', target: '900' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-navy tracking-tight">
              District Welfare Command Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proactive entitlement reconciliation across 10 administrative zones
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-navy"
            >
              <option value="All">All Districts (10)</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.total_families} families)
                </option>
              ))}
            </select>

            <button
              onClick={() => alert('Generating MIS Audit Slip...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export MIS</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-dpi p-4 bg-white border border-slate-200 shadow-sm" style={{ borderTop: '3px solid #172B63' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Families Registered</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-navy">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-navy">{totalFamilies.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-emerald-700 font-bold">↑ 100% Verified</span> · State coverage
          </p>
        </div>

        <div
          className="card-dpi p-4 bg-white border-2 border-orange-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          style={{ borderTop: '3px solid #F58220' }}
          onClick={() => onNavigateTo('families')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-900">Benefit Gaps</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-800">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-orange-950">{totalGaps.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-orange-900 mt-1 flex items-center gap-1 font-medium">
            <span>Eligible unserved households</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-orange-700" />
          </p>
        </div>

        <div
          className="card-dpi p-4 bg-white border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          style={{ borderTop: '3px solid #1D4ED8' }}
          onClick={() => onNavigateTo('duplicates')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Review Queue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-950">3,356</p>
          <p className="text-[11px] text-blue-900 mt-1 flex items-center gap-1 font-medium">
            <span>Identity & address clashes</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-blue-700" />
          </p>
        </div>

        <div className="card-dpi p-4 bg-white border border-slate-200 shadow-sm" style={{ borderTop: '3px solid #16805C' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Active Entitlements</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-950">₹4.82 Cr</p>
          <p className="text-[11px] text-emerald-900 mt-1 font-medium">
            <span className="text-emerald-700 font-bold">✓ DBT Active</span> · Annual disbursements
          </p>
        </div>
      </div>

      {/* Data Quality */}
      <DataQualityPanel />

      {/* Benefit Coverage & Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Benefit Coverage Overview</h3>
              <p className="text-xs text-slate-secondary">
                Eligible households currently receiving scheme benefits
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">11 Schemes</span>
          </div>

          <div className="space-y-3.5">
            {coverageMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-text">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-secondary text-[11px]">
                      {item.beneficiaries} / {item.target}
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

        {/* Action Required */}
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
                  <span>Incomplete Profiles</span>
                  <span className="font-mono text-sm">361</span>
                </div>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Missing ration or occupation data
                </p>
              </div>

              <div className="p-3 rounded border border-slate-border bg-slate-50/70">
                <div className="flex items-center justify-between font-semibold text-slate-text">
                  <span>Applications Beyond SLA</span>
                  <span className="font-mono text-sm">184</span>
                </div>
                <p className="text-[11px] text-slate-secondary mt-0.5">
                  Pending verification &gt; 7 days
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-border text-center">
            <span className="text-[11px] text-slate-400">
              Assigned to Taluka Welfare Officers for verification
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Benefit Gaps by District</h3>
              <p className="text-xs text-slate-secondary">Across 10 administrative zones</p>
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

        <div className="card-dpi p-5 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-text">Schemes by Category</h3>
              <p className="text-xs text-slate-secondary">11 welfare initiatives</p>
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

      {/* Assistant Panel */}
      <AssistantPanel />
    </div>
  );
}
