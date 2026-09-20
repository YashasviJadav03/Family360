import React, { useState } from 'react';
import { Bot, Send, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assistantApi } from '../api/client';

export default function AssistantPanel() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Good day, Officer. I can help evaluate benefit gaps, explain entitlement decisions, and look up registry records.',
      time: '10:45 AM',
      intent: 'GREETING',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'Which families in Ahmedabad have the most benefit gaps?',
    'Why is GJ-F000012 eligible for housing assistance?',
    'How many duplicate records are unresolved?',
    'Eligibility criteria for Dr. Ambedkar Awas Yojana?',
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
        text: 'Query could not be completed. Please ensure backend services are active.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-dpi bg-white border border-slate-200 flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-navy p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Welfare Assistant</h3>
            <p className="text-[11px] text-slate-300">AI-powered query assistant</p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3 text-orange-600" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Quick Queries
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200 bg-white text-slate-700 hover:border-navy hover:text-navy transition-all disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 overflow-y-auto space-y-3 max-h-72 min-h-[140px] bg-white">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-navy text-white'
                  : 'bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.links && m.links.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {m.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.url}
                      className="inline-flex items-center gap-1 font-medium text-navy hover:text-orange text-xs bg-white px-2 py-0.5 rounded border border-slate-200"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2 bg-slate-50 rounded border border-slate-200 w-fit">
            <div className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            <span>Processing query...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about benefit gaps, eligibility, or duplicates..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded bg-slate-50 focus:outline-none focus:border-navy text-slate-800"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-navy text-white hover:bg-navy-dark transition-colors disabled:opacity-50 text-xs font-semibold"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
