import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Building2, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-bg flex flex-col justify-between">
      {/* Institutional Top Bar */}
      <div className="bg-navy-dark text-white px-6 py-3 border-b border-navy">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-navy flex items-center justify-center border border-white/20">
              <span className="font-bold text-base text-orange">360</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">Family360</span>
              <span className="text-[10px] text-slate-300 block">
                Government of Gujarat · Digital Public Infrastructure
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-300 hidden sm:inline">State Welfare Intelligence Layer</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] text-slate-200">
              English | ગુજરાતી
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Hero */}
      <div className="max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-subtle text-navy text-xs font-semibold mb-4 border border-navy/20">
            <Shield className="w-3.5 h-3.5 text-navy" />
            <span>Problem Statement 1: Family-Centric Welfare Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight leading-tight">
            Family360
          </h1>
          <p className="text-lg font-medium text-slate-text mt-2">
            A unified family view for proactive, accountable welfare delivery.
          </p>
          <p className="text-xs text-slate-secondary mt-2 max-w-xl mx-auto leading-relaxed">
            Transforming Gujarat Family ID from a static identifier into an intelligent operational layer. 
            Automated eligibility determination, explainable duplicate reconciliation, and proactive benefit gap elimination.
          </p>
        </div>

        {/* Two Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          {/* Officer Card (Hero Experience) */}
          <div className="card-dpi p-6 bg-white border-2 border-navy hover:shadow-card transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange" />
                </div>
                <span className="text-[11px] font-bold text-navy bg-navy-subtle px-2 py-0.5 rounded uppercase tracking-wider">
                  Administrative
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy group-hover:text-navy-light transition-colors">
                District Officer Console
              </h3>
              <p className="text-xs text-slate-secondary mt-1.5 leading-relaxed">
                For District Welfare Officers and Taluka Administrators. Review 3,000 households, eliminate benefit gaps, audit candidate duplicates, and monitor statutory coverage metrics.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-text">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3,000 Family 360 unified profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3,356 candidate duplicate review queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Explainable statutory eligibility engine</span>
                </li>
              </ul>
            </div>
            <Link
              to="/officer/dashboard"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark transition-colors"
            >
              <span>Launch Officer Console</span>
              <ArrowRight className="w-4 h-4 text-orange" />
            </Link>
          </div>

          {/* Citizen Card */}
          <div className="card-dpi p-6 bg-white border border-slate-border hover:border-slate-400 hover:shadow-card transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-navy flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Public Portal
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-text group-hover:text-navy transition-colors">
                Citizen Self-Service Portal
              </h3>
              <p className="text-xs text-slate-secondary mt-1.5 leading-relaxed">
                Simple, reassuring, bilingual interface for citizens. Enter Family ID to view active entitlements, discover unapplied eligible programs, and track document status.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-text">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Personalized family welfare summary</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Full English / ગુજરાતી support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>One-click statutory scheme application</span>
                </li>
              </ul>
            </div>
            <Link
              to="/citizen/login"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <span>Access Citizen Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-border px-6 py-4 text-center text-xs text-slate-secondary">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Gujarat Social Welfare Department · Digital Public Infrastructure Architecture</span>
          <span className="font-mono text-[11px] text-slate-400">
            PostgreSQL 15 · FastAPI · React 18 · RapidFuzz
          </span>
        </div>
      </footer>
    </div>
  );
}
