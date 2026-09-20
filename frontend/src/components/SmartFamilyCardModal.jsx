import React, { useRef } from 'react';
import {
  Shield, QrCode, Printer, Download, CheckCircle2,
  Wheat, IndianRupee, Users, MapPin, X, Building2, Award
} from 'lucide-react';
import { calculateNFSAQuota } from '../utils/schemes20Engine';

export default function SmartFamilyCardModal({
  family = {},
  members = [],
  onClose = () => {},
  lang = 'en'
}) {
  const printRef = useRef(null);
  const nfsa = calculateNFSAQuota(family, members);
  const headMember = members.find((m) => (m.relation_to_head || '').toLowerCase() === 'head') || members[0] || {};
  const formatted12DigitId = family.family_id ? `GJ-${family.family_id.replace(/[^0-9]/g, '').padStart(10, '0')}` : 'GJ-0000000000';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden my-8">
        {/* Modal Top Ribbon */}
        <div className="bg-gradient-to-r from-navy via-[#0F3254] to-navy text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base font-serif tracking-tight">
              Gujarat Digital Smart Family Card & NFSA Quota Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6" ref={printRef}>
          {/* =============================================================== */}
          {/* DIGITAL SMART FAMILY CARD (Authentic Government Document) */}
          {/* =============================================================== */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EFE0] border-2 border-[#C8A051] p-5 shadow-lg overflow-hidden">
            {/* Hologram Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF671F] via-white to-[#138808]"></div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#C8A051]/10 rounded-full pointer-events-none"></div>

            {/* Card Masthead */}
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A051]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#8C6014] text-amber-200 flex items-center justify-center font-bold text-xs shadow-xs">
                  GJ
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#65440A] tracking-wider uppercase">
                    Government of Gujarat · Digital Public Infrastructure
                  </h4>
                  <p className="text-[11px] font-bold text-navy font-serif">
                    ગુજરાત પરિવાર સ્માર્ટ કાર્ડ · Gujarat Family ID
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                  ✓ Aadhaar e-KYC 100%
                </span>
              </div>
            </div>

            {/* Main Body */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4">
              {/* QR Code & ID */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#C8A051]/40 shadow-inner text-center">
                <div className="w-24 h-24 bg-slate-900 p-2 rounded-lg flex items-center justify-center shadow-md">
                  {/* High contrast QR representation */}
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-white rounded">
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-xs"></div>
                  </div>
                </div>
                <span className="font-mono text-xs font-extrabold text-navy mt-2 tracking-wider">
                  {family.family_id}
                </span>
                <span className="text-[9px] text-slate-500">Scan at Gram Panchayat</span>
              </div>

              {/* Household Attributes */}
              <div className="sm:col-span-8 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Head of Household
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {headMember.name || family.head_name || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Social Category
                    </span>
                    <span className="font-bold text-navy">
                      {family.social_category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      District Jurisdiction
                    </span>
                    <span className="font-semibold text-slate-800">
                      {family.district || 'Ahmedabad'}, Gujarat
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Ration Card Link
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {family.ration_card || 'RC-GJ-VALID'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#C8A051]/20">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Registered Family Members
                    </span>
                    <span className="font-bold text-emerald-800">
                      {members.length || family.family_size} Members Verified
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      NFSA Band
                    </span>
                    <span className="font-bold text-amber-900">
                      {nfsa.category.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-[#C8A051]/30 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>NIC Gujarat State Data Center · Verified Record</span>
              <span>Doc Ref: DPI-GJ-2026-F360</span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* NFSA FOODGRAIN QUOTA CALCULATOR */}
          {/* =============================================================== */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-navy">
                  Monthly NFSA Foodgrain Allocation (PDS Grain Basket)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {nfsa.badge}
              </span>
            </div>

            {/* Grain Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Subsidized Wheat (ઘઉં)
                </span>
                <span className="text-xl font-extrabold text-amber-900 mt-0.5 block font-mono">
                  {nfsa.wheatKg} kg
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  @ {nfsa.rateWheat}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Subsidized Rice (ચોખા)
                </span>
                <span className="text-xl font-extrabold text-blue-900 mt-0.5 block font-mono">
                  {nfsa.riceKg} kg
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  @ {nfsa.rateRice}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                  Coarse Grains (બાજરી/જુવાર)
                </span>
                <span className="text-xl font-extrabold text-emerald-900 mt-0.5 block font-mono">
                  {nfsa.coarseKg} kg
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  @ {nfsa.rateCoarse}
                </span>
              </div>
            </div>

            {/* Total Value & Monthly Savings */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-900">
              <div>
                <span className="font-bold">Fair Price Shop Cost: ₹{nfsa.totalMonthlyCost} / month</span>
                <span className="text-emerald-700 block text-[11px]">
                  Open market value: ₹{nfsa.openMarketValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold font-mono text-emerald-800">
                  Direct Household Savings: ₹{nfsa.monthlySavings.toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
