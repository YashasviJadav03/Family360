import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function NationalGovFooter({ lang = 'en' }) {
  return (
    <footer className="bg-[#0B132B] text-slate-300 text-xs border-t-2 border-[#FF671F] mt-16 select-none">
      {/* Policy Links Row */}
      <div className="border-b border-white/10 px-4 sm:px-6 py-3.5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
            <a href="#policies" className="hover:text-white transition-colors">Website Policies</a>
            <span className="text-white/20">|</span>
            <a href="#help" className="hover:text-white transition-colors">Help & FAQ</a>
            <span className="text-white/20">|</span>
            <a href="#feedback" className="hover:text-white transition-colors">Citizen Feedback</a>
            <span className="text-white/20">|</span>
            <a href="#contact" className="hover:text-white transition-colors">Contact Directory</a>
            <span className="text-white/20">|</span>
            <a href="#disclaimer" className="hover:text-white transition-colors">Statutory Rule Disclaimer</a>
            <span className="text-white/20">|</span>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility Statement</a>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>State Data Center: <strong className="text-slate-200">v2.4-DPI (Gujarat Node)</strong></span>
          </div>
        </div>
      </div>

      {/* Official Attribution & Disclaimers */}
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-3xl leading-relaxed">
            Content on this portal is owned, published and managed by the{' '}
            <strong className="text-slate-200">Department of Social Justice & Empowerment, Government of Gujarat</strong>.
            All eligibility assessments and benefit gap identifications are deterministically derived from officially gazetted
            state and centrally sponsored welfare schemes.
          </p>
          <div className="text-right sm:border-l sm:border-white/10 sm:pl-4">
            <span className="block font-mono text-[10px] text-slate-400">LAST AUDITED & UPDATED</span>
            <span className="font-semibold text-amber-400 text-xs">20 September 2026</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-white/10 flex items-center gap-1 font-serif text-[10px] font-bold text-amber-300 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>DPI GUJARAT</span>
            </div>
            <span>Designed for Proactive Welfare Delivery & Beneficiary Integrity</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Compliant with Guidelines for Indian Government Websites (GIGW 3.0) & Digital India Standards
          </p>
        </div>
      </div>
    </footer>
  );
}
