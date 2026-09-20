import React, { useState } from 'react';
import { Bot, Send, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assistantApi } from '../api/client';

export default function AssistantPanel() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Good day, Officer. I am the Family360 Statutory Intelligence Assistant. I can evaluate benefit gaps, explain pre-computed entitlement decisions, and track duplicate records across Gujarat registries.',
      time: '10:45 AM',
      intent: 'GREETING',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'Which families in Ahmedabad have the most benefit gaps?',
    'Why is family GJ-F000012 potentially eligible for housing assistance?',
    'How many possible duplicate records are unresolved?',
    'What are the eligibility criteria for Dr. Ambedkar Awas Yojana?',
  ];

  const handleSend = async (queryText) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await assistantApi.query(q);
      const assistantMsg = {
        sender: 'assistant',
        text: res.answer,
        intent: res.intent,
        links: res.suggested_links,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant query failed:', err);
      const errorMsg = {
        sender: 'assistant',
        text: 'The statutory assistant could not complete the query. Please ensure backend services are active.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-dpi bg-white border border-slate-200 flex flex-col overflow-hidden shadow-sm gov-card-saffron">
      {/* Tricolor Hairline */}
      <div className="h-[3px] w-full grid grid-cols-3">
        <div className="bg-[#FF671F]"></div>
        <div className="bg-[#FFFFFF]"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-navy via-navy-dark to-navy p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md border border-amber-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-tight">Statutory Welfare Assistant (સહાયક)</h3>
              <span className="gov-stamp text-[9px] text-amber-200 border-amber-300/50 bg-white/10">
                Natural-Language NLP
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Deterministic rule engine evaluates · LLM formats plain-language administrative responses
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict Deterministic Guardrails</span>
        </div>
      </div>

      {/* Suggested Questions Chips with Vibrant Color Accents */}
      <div className="p-3.5 bg-gradient-to-r from-amber-50/60 via-slate-50 to-blue-50/60 border-b border-slate-200">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Suggested Administrative Queries (Click to Query Instantly):
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => {
            const chipStyles = [
              'hover:border-orange-400 hover:bg-orange-50 text-orange-950 border-orange-200 bg-white',
              'hover:border-blue-400 hover:bg-blue-50 text-blue-950 border-blue-200 bg-white',
              'hover:border-emerald-400 hover:bg-emerald-50 text-emerald-950 border-emerald-200 bg-white',
              'hover:border-purple-400 hover:bg-purple-50 text-purple-950 border-purple-200 bg-white',
            ];
            return (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className={`text-left text-xs px-3 py-1.5 rounded-full font-bold border transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 ${chipStyles[idx % chipStyles.length]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                <span>{q}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="p-4 overflow-y-auto space-y-3 max-h-80 min-h-[160px] bg-slate-bg/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white text-slate-text border border-slate-border shadow-card'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.links && m.links.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-border flex flex-wrap gap-2">
                  {m.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.url}
                      className="inline-flex items-center gap-1 font-semibold text-navy hover:text-orange text-xs bg-slate-50 px-2 py-1 rounded border border-slate-border"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-secondary p-2 bg-white rounded border border-slate-border w-fit">
            <div className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            <span>Evaluating deterministic rules and querying registry...</span>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <div className="p-3 bg-white border-t border-slate-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask questions about benefit gaps, family eligibility, or duplicates..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 text-xs px-3 py-2 border border-slate-border rounded bg-slate-50 focus:outline-none focus:border-navy text-slate-text"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-navy text-white hover:bg-navy-dark transition-colors disabled:opacity-50 text-xs font-semibold"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5 text-orange" />
          </button>
        </form>
      </div>
    </div>
  );
}
