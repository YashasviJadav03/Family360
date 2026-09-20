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
    <div className="card-dpi bg-white border border-slate-border flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-navy p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-navy-light flex items-center justify-center text-orange">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold">Natural-Language Officer Query Assistant</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded font-semibold">
                AI Phrasing Layer
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Deterministic rule engine decides · LLM synthesizes administrative explanations
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Intent-Matched & Safe</span>
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary">
            Suggested Administrative Queries (Live Demo Chips)
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left text-xs px-2.5 py-1.5 rounded-full bg-white hover:bg-orange/10 hover:border-orange hover:text-navy border border-slate-border text-slate-700 transition-colors disabled:opacity-50"
            >
              • {q}
            </button>
          ))}
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
