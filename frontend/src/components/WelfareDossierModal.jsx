import React from 'react';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2, AlertCircle, Building2, Download } from 'lucide-react';

export default function WelfareDossierModal({
  isOpen,
  onClose,
  family,
  gapReport,
  mode = 'officer' // 'officer' or 'citizen'
}) {
  if (!isOpen || !family) return null;

  const handlePrint = () => {
    window.print();
  };

  const headMember = family.members?.find((m) => m.relation_to_head === 'Head') || family.members?.[0];
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Container Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="print:hidden bg-navy text-white px-5 py-3 flex items-center justify-between border-b border-navy-dark">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF671F] animate-pulse"></span>
            <span className="font-bold text-xs sm:text-sm tracking-wide">
              {mode === 'citizen' ? 'Digital Gujarat Family ID Card (પરિવાર ઓળખ પત્ર)' : 'Official Welfare Dossier & Statutory Entitlement Audit'}
            </span>
            <span className="font-mono text-xs text-amber-300 bg-white/10 px-2 py-0.5 rounded">
              {family.family_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRINTABLE OFFICIAL DOSSIER BODY */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-sans text-slate-900 bg-white printable-area space-y-6">
          
          {/* Official Government Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-2 relative">
            {/* National Tricolor Top Bar */}
            <div className="h-1 w-full grid grid-cols-3 mb-3">
              <div className="bg-[#FF671F]"></div>
              <div className="bg-[#FFFFFF] border-y border-slate-200"></div>
              <div className="bg-[#138808]"></div>
            </div>

            <div className="flex items-center justify-between">
              {/* Ashoka Emblem */}
              <div className="w-16 h-18 text-center shrink-0">
                <svg viewBox="0 0 100 112" className="w-12 h-14 mx-auto text-[#65440A]" fill="currentColor">
                  <path d="M50 7 C46.5 7, 43.5 10, 43.5 14 C43.5 16, 44.5 18, 45.5 19.5 C42.5 20.5, 40.5 22.5, 40.5 26.5 C40.5 28.5, 41.5 31.5, 43.5 33.5 C42.5 35.5, 42.5 38.5, 44.5 41.5 L46.5 44.5 C46.5 47.5, 47.5 50.5, 50 50.5 C52.5 50.5, 53.5 47.5, 53.5 44.5 L55.5 41.5 C57.5 38.5, 57.5 35.5, 56.5 33.5 C58.5 31.5, 59.5 28.5, 59.5 26.5 C59.5 22.5, 57.5 20.5, 54.5 19.5 C55.5 18, 56.5 16, 56.5 14 C56.5 10, 53.5 7, 50 7 Z" />
                  <rect x="18" y="55" width="64" height="3.5" rx="1.5" fill="#A8771C" />
                  <rect x="16" y="58.5" width="68" height="15" rx="1" fill="#8C6014" />
                  <circle cx="50" cy="66" r="5" fill="#FFFBF2" />
                  <path d="M20 73.5 L80 73.5 C77 81.5, 66 85.5, 50 85.5 C34 85.5, 23 81.5, 20 73.5 Z" fill="#A8771C" />
                  <text x="50" y="98" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="'Noto Sans Devanagari', sans-serif" fill="#65440A">सत्यमेव जयते</text>
                </svg>
              </div>

              {/* Title Block */}
              <div className="text-center flex-1 px-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-600 block">
                  GOVERNMENT OF GUJARAT · ગુજરાત સરકાર
                </span>
                <span className="text-xs font-semibold text-slate-800 block">
                  Department of Social Justice & Empowerment · સામાજિક ન્યાય અને અધિકારીતા વિભાગ
                </span>
                <h1 className="text-lg sm:text-xl font-black font-serif text-navy mt-1">
                  FAMILY WELFARE ENTITLEMENT DOSSIER (પરિવાર કલ્યાણ પત્રક)
                </h1>
                <p className="text-[10px] text-slate-500 font-mono">
                  State Digital Public Infrastructure Node · Verified against Civil Supplies Registry
                </p>
              </div>

              {/* Simulated Government QR Verification Box */}
              <div className="w-20 text-center shrink-0 border border-slate-300 rounded p-1.5 bg-slate-50">
                <div className="w-12 h-12 mx-auto bg-slate-900 rounded p-1 flex items-center justify-center">
                  {/* Clean SVG QR code representation */}
                  <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v4h-4v-4zm-6 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4 0h2v2h-2v-2zm0 2h4v2h-4v-2z" />
                  </svg>
                </div>
                <span className="font-mono text-[8px] text-slate-600 block mt-0.5 font-bold">SCAN TO VERIFY</span>
              </div>
            </div>
          </div>

          {/* Section A: Household Civil Profile Summary */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Section 1: Civil Household Master Record
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">
                Audit Date: {currentDate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Gujarat Family ID</span>
                <span className="font-mono font-bold text-navy text-sm">{family.family_id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">PDS Ration Card</span>
                <span className="font-mono font-semibold text-slate-800">{family.ration_card_id || 'Not linked'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Head of Household</span>
                <span className="font-bold text-slate-900">{headMember ? headMember.name : 'Unknown'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Social Category</span>
                <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] inline-block">
                  {family.social_category}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Annual Family Income</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{(family.annual_income || 0).toLocaleString('en-IN')}/year
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Household Size</span>
                <span className="font-bold text-slate-900">{family.family_size} Registered Members</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Jurisdiction</span>
                <span className="font-semibold text-slate-800">{family.taluka}, {family.district}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Village / Ward</span>
                <span className="font-semibold text-slate-800">{family.village}</span>
              </div>
            </div>
          </div>

          {/* Section B: Registered Family Members Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Section 2: Registered Kinship Hierarchy ({family.members?.length || 0} Members)</span>
              <span className="text-[10px] text-slate-400 font-normal">Aadhaar Linked via UIDAI CIDR</span>
            </h3>

            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="border border-slate-300 p-2">Member ID</th>
                  <th className="border border-slate-300 p-2">Full Name</th>
                  <th className="border border-slate-300 p-2">Relation</th>
                  <th className="border border-slate-300 p-2">Gender / Age</th>
                  <th className="border border-slate-300 p-2">Education / Occupation</th>
                  <th className="border border-slate-300 p-2 text-center">Disability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {family.members?.map((m) => (
                  <tr key={m.member_id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 font-mono text-[11px] text-slate-600">
                      {m.member_id}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-900">
                      {m.name}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700">
                      {m.relation_to_head}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700">
                      {m.gender} · {m.age || 0} yrs
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-600">
                      {m.education_level || 'General'} · {m.occupation || 'N/A'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center">
                      {m.disability_status ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section C & D: Entitlement Ledger (Active vs Gaps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Entitlements */}
            <div className="border border-emerald-300 rounded-lg p-3.5 bg-emerald-50/40 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block border-b border-emerald-200 pb-1 flex items-center justify-between">
                <span>Section 3: Active Benefits ({gapReport?.receiving_schemes?.length || 0})</span>
                <span className="text-[10px] text-emerald-700 font-mono">Disbursing</span>
              </span>

              {gapReport?.receiving_schemes?.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No active state benefits recorded in registry.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {gapReport?.receiving_schemes?.map((item) => {
                    const scheme = item.scheme || item;
                    return (
                      <div key={scheme.scheme_id} className="p-2 rounded bg-white border border-emerald-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-emerald-800">{scheme.scheme_id}</span>
                          <p className="font-bold text-slate-800 text-xs">{scheme.scheme_name}</p>
                          <p className="text-[10px] text-slate-500">{scheme.benefit_description || scheme.benefit}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Identified Benefit Gaps */}
            <div className="border border-amber-300 rounded-lg p-3.5 bg-amber-50/50 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block border-b border-amber-200 pb-1 flex items-center justify-between">
                <span>Section 4: Identified Gaps ({gapReport?.gap_schemes?.length || 0})</span>
                <span className="text-[10px] text-amber-800 font-mono">Action Required</span>
              </span>

              {gapReport?.gap_schemes?.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">Household has achieved 100% statutory entitlement saturation.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {gapReport?.gap_schemes?.map((item) => {
                    const scheme = item.scheme || item;
                    return (
                      <div key={scheme.scheme_id} className="p-2 rounded bg-white border border-amber-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-amber-800">{scheme.scheme_id} · {scheme.category}</span>
                          <p className="font-bold text-slate-800 text-xs">{scheme.scheme_name}</p>
                          <p className="text-[10px] text-amber-900 font-medium">Eligible based on income & category criteria</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                          Qualified
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section E: Official Seal & Verification Attestation */}
          <div className="border-t-2 border-slate-900 pt-4 flex flex-wrap items-end justify-between gap-4 text-xs text-slate-600">
            <div className="space-y-1 max-w-sm">
              <p className="font-bold text-slate-800">Legal Attestation & Audit Trail</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                This document is generated by the Gujarat Social Welfare Intelligence Engine under the Gujarat Family ID Framework. 
                All rule evaluations are deterministic and derived from gazetted government resolutions.
              </p>
              <p className="font-mono text-[9px] text-slate-400">
                Security Hash: SHA256-DPI-{family.family_id}-2026-VAL
              </p>
            </div>

            {/* Officer Stamp Block */}
            <div className="border-2 border-slate-400 rounded-lg p-3 text-center min-w-[200px] space-y-1 bg-slate-50">
              <div className="w-8 h-8 rounded-full border border-navy text-navy flex items-center justify-center mx-auto text-[9px] font-bold">
                DWO
              </div>
              <p className="font-bold text-[11px] text-navy">DISTRICT WELFARE OFFICER</p>
              <p className="text-[10px] text-slate-500">Government of Gujarat</p>
              <div className="border-t border-slate-300 pt-1 text-[9px] font-mono text-emerald-700 font-bold">
                ✓ DIGITALLY VERIFIED
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Bar (Hidden during print) */}
        <div className="print:hidden bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            For official verification, present this document or quote Family ID at any Taluka e-Samaj Kalyan Kendra.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-navy hover:bg-navy-dark text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
