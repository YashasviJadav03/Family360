import React from 'react';

export default function NationalGovFooter() {
  return (
    <footer className="bg-[#111625] text-slate-300 text-xs border-t-2 border-navy-dark mt-12">
      {/* Policy Links Row */}
      <div className="border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            <a href="#policies" className="hover:text-white transition-colors">Website Policies</a>
            <span className="text-white/20">|</span>
            <a href="#help" className="hover:text-white transition-colors">Help & FAQ</a>
            <span className="text-white/20">|</span>
            <a href="#feedback" className="hover:text-white transition-colors">Feedback</a>
            <span className="text-white/20">|</span>
            <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
            <span className="text-white/20">|</span>
            <a href="#disclaimer" className="hover:text-white transition-colors">Statutory Rule Disclaimer</a>
            <span className="text-white/20">|</span>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility Statement</a>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            State Data Center Version: <span className="text-slate-200">v2.4-DPI</span>
          </div>
        </div>
      </div>

      {/* Official Attribution & Disclaimers */}
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-2xl leading-relaxed">
            Content on this portal is owned and managed by the <strong>Department of Social Justice & Empowerment, Government of Gujarat</strong>. 
            All entitlement algorithms and rule sets are deterministically derived from officially gazetted state social protection schemes.
          </p>
          <div className="text-right">
            <span className="block font-mono text-[10px] text-slate-400">LAST UPDATED</span>
            <span className="font-semibold text-slate-200 text-xs">20 September 2026</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center font-serif text-[10px] font-bold text-orange">
              NIC
            </div>
            <span>Designed for Gujarat Digital Public Infrastructure & Beneficiary Integrity</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Compliant with Guidelines for Indian Government Websites (GIGW 3.0) & UX4G Design System
          </p>
        </div>
      </div>
    </footer>
  );
}
