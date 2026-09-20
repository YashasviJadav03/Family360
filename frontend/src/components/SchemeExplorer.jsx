import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2, Search, Filter, Users, ArrowRight } from 'lucide-react';

export default function SchemeExplorer({ schemes = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(schemes.map((s) => s.category).filter(Boolean))];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scheme_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-border">
        <div>
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-navy" />
            Gujarat Social Welfare Scheme Knowledge Base
          </h2>
          <p className="text-xs text-slate-secondary mt-0.5">
            11 active schemes with deterministic statutory eligibility rule sets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search scheme name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border border-slate-border rounded bg-slate-50 text-slate-text w-56 focus:outline-none focus:border-navy"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-border rounded bg-slate-50 text-slate-text font-medium focus:outline-none focus:border-navy"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.scheme_id} className="card-dpi p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-border pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-navy-subtle text-navy rounded border border-navy/20">
                      {scheme.scheme_id}
                    </span>
                    <span className="text-xs text-slate-secondary font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-border">
                      {scheme.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-text mt-1">{scheme.scheme_name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{scheme.department}</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-4 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-secondary block mb-0.5">
                    Entitlement Benefit
                  </span>
                  <p className="font-medium text-navy">{scheme.benefit}</p>
                </div>

                {scheme.description && (
                  <p className="text-slate-secondary text-xs leading-relaxed">
                    {scheme.description}
                  </p>
                )}

                {/* Eligibility Rules */}
                {scheme.rules && scheme.rules.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-text block mb-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-navy" />
                      Statutory Rule Criteria ({scheme.rules.length})
                    </span>
                    <div className="space-y-1">
                      {scheme.rules.map((rule) => (
                        <div
                          key={rule.rule_id}
                          className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="capitalize font-medium">{rule.attribute.replace('_', ' ')}</span>
                          <code className="font-mono text-[11px] bg-white px-1 rounded border border-slate-200">
                            {rule.operator} {rule.value}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <Link
                to={`/officer/families?scheme_id=${scheme.scheme_id}&has_gap=true`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-lg transition-colors shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Target Eligible Households →</span>
              </Link>

              {scheme.source_url && (
                <a
                  href={scheme.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-navy font-semibold text-xs transition-colors"
                >
                  <span>Official Rules</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
