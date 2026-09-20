import React from 'react';
import {
  Users, AlertCircle, FileCheck, ClipboardList, TrendingUp,
  Download, ArrowUpRight, CheckCircle2, ShieldAlert, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

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
      {/* Officer Hero Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-secondary">
              State Social Justice & Welfare Administration
            </span>
          </div>
          <h2 className="text-lg font-bold text-navy">
            Good morning, District Welfare Officer · Gujarat State Administration
          </h2>
          <p className="text-xs text-slate-secondary mt-0.5">
            Command Center: Proactive benefit reconciliation & family vulnerability tracking · Last synchronized: 20 Sep 2026, 10:42 AM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-border rounded bg-slate-50 text-slate-text font-medium focus:outline-none focus:border-navy"
          >
            <option value="All">All Gujarat Districts (10)</option>
            {districts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district} ({d.total_families} families)
              </option>
            ))}
          </select>

          <button
            onClick={() => alert('Exporting Official District Welfare MIS CSV Report...')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-border transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Crisp KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Families */}
        <div className="card-dpi p-4 bg-white border border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-secondary">Families Registered</span>
            <div className="w-7 h-7 rounded bg-navy-subtle flex items-center justify-center text-navy">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-navy">{totalFamilies.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-secondary mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold flex items-center">↑ 100%</span>
            <span>state registry coverage</span>
          </p>
        </div>

        {/* KPI 2: Benefit Gaps */}
        <div className="card-dpi p-4 bg-white border-2 border-amber-200 hover:border-amber-300 transition-colors cursor-pointer"
             onClick={() => onNavigateTo('families')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900">Potential Benefit Gaps</span>
            <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-900">{totalGaps.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1 font-medium">
            <span>Eligible unserved households</span>
            <ArrowUpRight className="w-3 h-3 ml-auto" />
          </p>
        </div>

        {/* KPI 3: Records to Review */}
        <div className="card-dpi p-4 bg-white border border-slate-border hover:border-navy transition-colors cursor-pointer"
             onClick={() => onNavigateTo('duplicates')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-secondary">Records to Review</span>
            <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-navy">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-text">3,356</p>
          <p className="text-[11px] text-slate-secondary mt-1 flex items-center gap-1">
            <span className="text-navy font-semibold">99.3%</span>
            <span>blocked search reduction</span>
          </p>
        </div>

        {/* KPI 4: Pending Applications */}
        <div className="card-dpi p-4 bg-white border border-slate-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-secondary">Pending Verification</span>
            <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center text-purple-700">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-text">648</p>
          <p className="text-[11px] text-slate-secondary mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Average turnaround: 4.2 days</span>
          </p>
        </div>
      </div>

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
    </div>
  );
}
