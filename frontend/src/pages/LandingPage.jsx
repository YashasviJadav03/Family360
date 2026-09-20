import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Building2, ArrowRight, CheckCircle2, ChevronRight,
  Database, FileCheck, Award, BookOpen, ExternalLink, Sparkles
} from 'lucide-react';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';

export default function LandingPage() {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-text">
      {/* Official Government Top Bar & Header */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'gu' : 'en'))}
        currentRole="public"
      />

      {/* Hero Masthead (Broadsheet + National Portal) */}
      <div className="bg-white border-b border-slate-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-subtle text-navy text-xs font-semibold border border-navy/20">
            <span className="w-2 h-2 rounded-full bg-orange"></span>
            <span>Digital Public Infrastructure for Social Welfare · Government of Gujarat</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-navy tracking-tight leading-tight">
            Family360
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-text max-w-2xl mx-auto">
            {lang === 'en'
              ? 'A unified family view for proactive, accountable welfare delivery.'
              : 'સક્રિય અને પારદર્શક સરકારી સહાય વિતરણ માટે એકીકૃત પારિવારિક પ્રોફાઇલ.'}
          </p>
          <p className="text-xs sm:text-sm text-slate-secondary max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Transforming Gujarat Family ID from a static civil identifier into an intelligent delivery layer. Deterministic rule evaluation, explainable entity resolution, and automated benefit gap reconciliation.'
              : 'ગુજરાત ફેમિલી આઈડી દ્વારા સરકારી યોજનાઓનું સ્વચાલિત મૂલ્યાંકન, ડુપ્લિકેટ રેકોર્ડ ચકાસણી અને લાભ ન મળેલા પરિવારોની સીધી ઓળખ.'}
          </p>

          {/* Statistical Metrics Strip */}
          <div className="pt-6 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded border border-slate-border bg-slate-bg">
              <span className="text-[11px] text-slate-secondary block font-mono">PILOT HOUSEHOLDS</span>
              <span className="text-xl font-bold font-mono text-navy">3,000</span>
              <span className="text-[10px] text-emerald-700 font-medium block">100% Registry Coverage</span>
            </div>
            <div className="p-3 rounded border border-slate-border bg-slate-bg">
              <span className="text-[11px] text-slate-secondary block font-mono">POTENTIAL BENEFIT GAPS</span>
              <span className="text-xl font-bold font-mono text-amber-900">2,639</span>
              <span className="text-[10px] text-amber-800 font-medium block">Qualified & Unserved</span>
            </div>
            <div className="p-3 rounded border border-slate-border bg-slate-bg">
              <span className="text-[11px] text-slate-secondary block font-mono">DUPLICATE CLUSTERS</span>
              <span className="text-xl font-bold font-mono text-slate-text">3,356</span>
              <span className="text-[10px] text-navy font-medium block">99.31% Search Pruning</span>
            </div>
            <div className="p-3 rounded border border-slate-border bg-slate-bg">
              <span className="text-[11px] text-slate-secondary block font-mono">STATUTORY SCHEMES</span>
              <span className="text-xl font-bold font-mono text-navy">11</span>
              <span className="text-[10px] text-slate-600 font-medium block">Across 6 Sectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Portal Selection Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Officer Console (Hero Technical View) */}
          <div className="card-dpi p-6 sm:p-8 bg-white border-2 border-navy hover:shadow-modal transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-border mb-4">
                <span className="text-[11px] font-mono uppercase font-bold text-navy bg-navy-subtle px-2 py-0.5 rounded">
                  Internal Governance Console
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Official Access
                </span>
              </div>

              <h2 className="text-xl font-bold font-serif text-navy">
                District Officer Welfare Console
              </h2>
              <p className="text-xs text-slate-secondary mt-1 leading-relaxed">
                Dedicated operational command system for District Social Welfare Officers, Taluka Development Officers, and State Planners.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-text">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Family 360 Profiles:</strong> Deep family socio-economic views with interactive kinship tree graphs.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Benefit Gap Identification:</strong> Deterministic eligibility engine highlighting unclaimed entitlements.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Entity Resolution Queue:</strong> Explainable record reconciliation with side-by-side audit confirmation.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-border">
              <Link
                to="/officer/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark transition-colors shadow-sm"
              >
                <span>Enter District Officer Console</span>
                <ArrowRight className="w-4 h-4 text-orange" />
              </Link>
            </div>
          </div>

          {/* Card 2: Citizen Self-Service Portal */}
          <div className="card-dpi p-6 sm:p-8 bg-white border border-slate-border hover:border-slate-400 hover:shadow-card transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-border mb-4">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Public Citizen Access
                </span>
                <span className="text-xs text-slate-500 font-medium">Bilingual Portal</span>
              </div>

              <h2 className="text-xl font-bold font-serif text-slate-text">
                Citizen Self-Service & Benefit Check
              </h2>
              <p className="text-xs text-slate-secondary mt-1 leading-relaxed">
                Simple, transparent interface designed for citizens and household heads to verify current entitlements and discover eligible programs.
              </p>

              <div className="mt-5 space-y-2 text-xs text-slate-text">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Family Benefit Verification:</strong> Check all active direct assistance disbursed to your family.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Proactive Discovery:</strong> See which Gujarat state schemes your household is eligible for.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Single-Click Application:</strong> Initiate statutory assistance applications directly with your Family ID.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-border">
              <Link
                to="/citizen/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                <span>Access Citizen Portal (નાગરિક પોર્ટલ)</span>
                <ChevronRight className="w-4 h-4 text-navy" />
              </Link>
            </div>
          </div>
        </div>

        {/* Official Sectoral Coverage Section (India.gov.in style) */}
        <div className="card-dpi p-6 bg-white border border-slate-border space-y-4">
          <div className="border-b border-slate-border pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-navy">Monitored Welfare Categories</h3>
              <p className="text-xs text-slate-secondary">Statutory scheme rules implemented across 6 government domains</p>
            </div>
            <Link to="/officer/schemes" className="text-xs font-semibold text-navy hover:text-orange flex items-center gap-1">
              <span>View All 11 Schemes</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Education</span>
              <span className="text-[11px] text-slate-secondary">Pre & Post Matric</span>
            </div>
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Social Security</span>
              <span className="text-[11px] text-slate-secondary">Old Age Pensions</span>
            </div>
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Housing</span>
              <span className="text-[11px] text-slate-secondary">Ambedkar Awas</span>
            </div>
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Women & Child</span>
              <span className="text-[11px] text-slate-secondary">Ganga Swarupa</span>
            </div>
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Disability</span>
              <span className="text-[11px] text-slate-secondary">Divyang Pension</span>
            </div>
            <div className="p-3 rounded bg-slate-bg border border-slate-border text-center">
              <span className="font-semibold text-slate-text block">Economic</span>
              <span className="text-[11px] text-slate-secondary">Self-Employment</span>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <NationalGovFooter />
    </div>
  );
}
