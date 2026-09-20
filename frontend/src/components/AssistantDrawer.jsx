import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, ArrowRight, Database, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assistantApi } from '../api/client';

export default function AssistantDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Good day, Officer. I am the Family360 Welfare Intelligence Assistant. You can query scheme rules, identify gap concentrations, or explore specific family entitlements.',
      time: '10:42 AM',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sampleQueries = [
    'Which families in Ahmedabad have the most benefit gaps?',
    'Why is family GJ-F000012 potentially eligible for housing assistance?',
    'How many possible duplicate records are unresolved?',
    'What are the eligibility criteria for Ambedkar Awas Yojana?',
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
        links: res.suggested_links,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Drawer query error:', err);
      const errorMsg = {
        sender: 'assistant',
        text: 'Error contacting the assistant service. Please verify backend connectivity.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-dark/40 backdrop-blur-[1px]">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-border flex flex-col">
          {/* Drawer Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-navy-light flex items-center justify-center text-orange">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Family360 Welfare Intelligence</h3>
                <p className="text-[11px] text-slate-300">Statutory Assistant for District Officers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-slate-50 border-b border-slate-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-secondary block mb-1.5">
              Suggested Administrative Inquiries
            </span>
            <div className="flex flex-col gap-1.5">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs p-1.5 rounded bg-white hover:bg-blue-50/50 hover:text-navy border border-slate-border text-slate-700 truncate transition-colors"
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-bg/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-navy text-white'
                      : 'bg-white text-slate-text border border-slate-border shadow-card'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.links && (
                    <div className="mt-2 pt-2 border-t border-slate-border space-y-1">
                      {m.links.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          to={link.url}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 font-semibold text-navy hover:text-orange text-xs"
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
          </div>

          {/* Drawer Footer Input */}
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
                placeholder="Ask about families, schemes, or data..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-border rounded bg-slate-50 focus:outline-none focus:border-navy text-slate-text"
              />
              <button
                type="submit"
                className="p-2 rounded bg-navy text-white hover:bg-navy-dark transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-orange" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Auditable DPI tool · Responses strictly bounded by database and statutory rules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
