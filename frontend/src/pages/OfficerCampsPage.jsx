import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, MapPin, AlertCircle, CheckCircle2, Calendar,
  Printer, Send, FileText, ArrowRight, ShieldCheck, Sparkles, Filter,
  Clock, Download
} from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';

// Mocked realistic village gap clusters derived from the 3,000 family dataset distribution
const VILLAGE_HOTSPOTS = {
  Anand: [
    { village: 'Anand Rural', taluka: 'Anand', gaps_count: 84, households: 120, top_scheme: 'Dr. Ambedkar Awas Yojana (32 households)', saturation_rate: 64 },
    { village: 'Vasad', taluka: 'Anand', gaps_count: 68, households: 95, top_scheme: 'Vrudh Pension Yojana (26 seniors)', saturation_rate: 71 },
    { village: 'Petlad', taluka: 'Petlad', gaps_count: 52, households: 88, top_scheme: 'Manav Garima Self-Employment (19 artisans)', saturation_rate: 78 },
    { village: 'Khambhat', taluka: 'Khambhat', gaps_count: 47, households: 80, top_scheme: 'Post-Matric Scholarships (21 students)', saturation_rate: 82 },
  ],
  Ahmedabad: [
    { village: 'Dholka Rural', taluka: 'Dholka', gaps_count: 96, households: 140, top_scheme: 'Dr. Ambedkar Awas Yojana (41 households)', saturation_rate: 59 },
    { village: 'Daskroi', taluka: 'Daskroi', gaps_count: 74, households: 110, top_scheme: 'Indira Gandhi National Old Age Pension (29 seniors)', saturation_rate: 68 },
    { village: 'Sanand', taluka: 'Sanand', gaps_count: 55, households: 85, top_scheme: 'Ganga Swarupa Sahay (22 widows)', saturation_rate: 74 },
    { village: 'Bavla', taluka: 'Bavla', gaps_count: 42, households: 70, top_scheme: 'Sant Surdas Divyang Pension (14 divyangjan)', saturation_rate: 80 },
  ],
  Surat: [
    { village: 'Chorasi Rural', taluka: 'Chorasi', gaps_count: 89, households: 130, top_scheme: 'Pre & Post-Matric Scholarships (35 students)', saturation_rate: 63 },
    { village: 'Bardoli', taluka: 'Bardoli', gaps_count: 65, households: 100, top_scheme: 'Manav Garima Toolkits (24 artisans)', saturation_rate: 72 },
    { village: 'Olpad', taluka: 'Olpad', gaps_count: 50, households: 85, top_scheme: 'Rural Sanitation & Pucca Housing (18 households)', saturation_rate: 79 },
  ],
  Junagadh: [
    { village: 'Junagadh Rural', taluka: 'Junagadh Rural', gaps_count: 78, households: 115, top_scheme: 'Post-Matric Scholarships (28 students)', saturation_rate: 66 },
    { village: 'Keshod', taluka: 'Keshod', gaps_count: 60, households: 90, top_scheme: 'Vrudh Pension Yojana (22 seniors)', saturation_rate: 73 },
    { village: 'Mangrol', taluka: 'Mangrol', gaps_count: 45, households: 75, top_scheme: 'Ganga Swarupa Sahay (16 widows)', saturation_rate: 81 },
  ],
};

const SAMPLE_CAMP_BENEFICIARIES = [
  { family_id: 'GJ-F000525', head_name: 'Vijay Dipak Thakor', category: 'SC', income: '₹1,24,173', gap: 'Dr. Ambedkar Awas & Sant Surdas Pension', status: 'Pre-Qualified' },
  { family_id: 'GJ-F000104', head_name: 'Hareshbhai V. Parmar', category: 'SC', income: '₹98,500', gap: 'Manav Garima Toolkit', status: 'Pre-Qualified' },
  { family_id: 'GJ-F000219', head_name: 'Kailashben R. Solanki', category: 'OBC', income: '₹1,12,000', gap: 'Ganga Swarupa Sahay (Widow Assistance)', status: 'Pre-Qualified' },
  { family_id: 'GJ-F000344', head_name: 'Govindbhai N. Patel', category: 'General', income: '₹1,45,000', gap: 'Indira Gandhi National Old Age Pension', status: 'Pre-Qualified' },
  { family_id: 'GJ-F000418', head_name: 'Arvindbhai D. Vankar', category: 'SC', income: '₹84,000', gap: 'Post-Matric Scholarship for Higher Education', status: 'Pre-Qualified' },
];

export default function OfficerCampsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Anand');
  const [selectedVillage, setSelectedVillage] = useState(VILLAGE_HOTSPOTS['Anand'][0]);
  const [campDate, setCampDate] = useState('2026-09-28');
  const [campVenue, setCampVenue] = useState('Gram Panchayat Seva Sadan');
  const [batchDispatched, setBatchDispatched] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDistrictChange = (dist) => {
    setSelectedDistrict(dist);
    const list = VILLAGE_HOTSPOTS[dist] || [];
    setSelectedVillage(list[0] || null);
  };

  const handleBatchDispatch = () => {
    setBatchDispatched(true);
    showToast(`Proactively dispatched ${selectedVillage?.gaps_count || 5} claims for ${selectedVillage?.village}!`);
  };

  const hotspots = VILLAGE_HOTSPOTS[selectedDistrict] || [];

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#FFB81C] flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300">
                Seva Setu Outreach
              </span>
              <span className="text-xs font-bold text-slate-500">
                Proactive Saturation Engine
              </span>
            </div>
            <h1 className="text-xl font-black font-serif text-navy">
              Welfare Saturation & Camp Dispatch Command (કલ્યાણ શિબિર આયોજન)
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Identify village-level benefit gap clusters, schedule on-ground delivery camps, and dispatch batch applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Select District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-navy"
              >
                {Object.keys(VILLAGE_HOTSPOTS).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <Link
              to={`/officer/families?district=${selectedDistrict}&has_gap=true`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy bg-navy/10 hover:bg-navy/20 rounded-lg transition-colors border border-navy/20"
            >
              <span>View District Gaps ({hotspots.reduce((a, b) => a + b.gaps_count, 0)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Command Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Village Gap Density Leaderboard (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF671F]" />
                    <span>Village Gap Density Hotspots — {selectedDistrict} District</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Ranked by concentration of unserved eligible citizens
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {hotspots.length} Priority Villages
                </span>
              </div>

              <div className="space-y-3">
                {hotspots.map((v) => {
                  const isSelected = selectedVillage?.village === v.village;
                  return (
                    <div
                      key={v.village}
                      onClick={() => setSelectedVillage(v)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-navy bg-navy-subtle/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900">{v.village}</h3>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Taluka: {v.taluka}
                            </span>
                          </div>
                          <p className="text-xs text-amber-900 font-medium mt-1">
                            Primary Gap: {v.top_scheme}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-base font-black text-amber-700 block">
                            {v.gaps_count} Gaps
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {v.households} Total Families
                          </span>
                        </div>
                      </div>

                      {/* Saturation Progress Bar */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-3 text-xs">
                        <span className="text-[10px] text-slate-500 font-medium shrink-0">
                          Saturation Rate:
                        </span>
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${v.saturation_rate}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700 shrink-0">
                          {v.saturation_rate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Saturation Camp Action & Dispatch Planner (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Camp Roster Plan
                </span>
                <h2 className="text-base font-bold text-navy mt-1">
                  Outreach Camp for {selectedVillage?.village || 'Selected Village'}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedVillage?.gaps_count} households ready for proactive on-site enrolment
                </p>
              </div>

              {/* Camp Configuration Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Camp Date</label>
                  <input
                    type="date"
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue / Assembly Point</label>
                  <input
                    type="text"
                    value={campVenue}
                    onChange={(e) => setCampVenue(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-navy"
                  />
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold block text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
                    <span>Automated Target Priority</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Families in this cluster have already been deterministically verified against Civil Supplies and meet all statutory criteria.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Camp Beneficiary Call Sheet</span>
                </button>

                {batchDispatched ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-xs font-bold text-emerald-900 block">
                      Batch Enrolment Dispatched!
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      Applications queued for Taluka Welfare Officer approval.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleBatchDispatch}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#FF671F] hover:bg-[#E65100] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-200" />
                    <span>1-Click Batch Saturation Dispatch</span>
                  </button>
                )}
              </div>
            </div>

            {/* Candidate Beneficiaries Roster Snippet */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center justify-between">
                <span>Camp Candidate Roster ({SAMPLE_CAMP_BENEFICIARIES.length})</span>
                <span className="text-[10px] text-emerald-700 font-bold">100% Rules Passed</span>
              </h3>

              <div className="space-y-2">
                {SAMPLE_CAMP_BENEFICIARIES.map((ben) => (
                  <div key={ben.family_id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/officer/families/${ben.family_id}`}
                          className="font-mono font-bold text-navy hover:underline"
                        >
                          {ben.family_id}
                        </Link>
                        <span className="text-[10px] text-slate-500">· {ben.head_name}</span>
                      </div>
                      <p className="text-[10px] text-amber-800 truncate max-w-[200px] mt-0.5">
                        {ben.gap}
                      </p>
                    </div>
                    <Link
                      to={`/officer/families/${ben.family_id}`}
                      className="px-2 py-0.5 text-[10px] font-bold text-navy bg-white border border-slate-300 rounded hover:bg-slate-100 shrink-0"
                    >
                      Audit →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}
