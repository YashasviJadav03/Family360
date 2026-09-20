import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Shield, ArrowRight, Lock, User } from 'lucide-react';
import { officerApi } from '../api/client';

export default function OfficerLogin() {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOfficers() {
      try {
        const data = await officerApi.getOfficers();
        setOfficers(data || []);
        if (data && data.length > 0) {
          setSelectedOfficerId(data[0].officer_id);
        }
      } catch (err) {
        console.error('Failed to load officers:', err);
      }
    }
    loadOfficers();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/officer/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-bg flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-navy-dark text-white px-6 py-3 border-b border-navy flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-navy flex items-center justify-center border border-white/20">
            <span className="font-bold text-sm text-orange">360</span>
          </div>
          <span className="font-bold text-sm">Family360 · Government Officer Console</span>
        </Link>
        <span className="text-xs text-slate-300 font-mono">Gujarat State Data Center</span>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="card-dpi p-8 bg-white border border-slate-border shadow-card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-orange" />
            </div>
            <h2 className="text-lg font-bold text-navy">District Welfare Administration</h2>
            <p className="text-xs text-slate-secondary mt-1">
              Sign in to manage family welfare profiles, resolve duplicate clusters, and process applications.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1.5">
                Designated Administrative Officer
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-border rounded bg-slate-50 text-slate-text focus:outline-none focus:border-navy"
                >
                  {officers.map((off) => (
                    <option key={off.officer_id} value={off.officer_id}>
                      {off.name} ({off.role} · {off.district})
                    </option>
                  ))}
                  {officers.length === 0 && (
                    <option value="OFF001">District Welfare Officer (Ahmedabad)</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1.5">
                Security Passcode (Demo Mode Active)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value="••••••••••••"
                  disabled
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-border rounded bg-slate-100 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter Console</span>
              <ArrowRight className="w-4 h-4 text-orange" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            Mock authentication configured for hackathon demonstration. All activity is audit-logged.
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-border">
        Government of Gujarat · Digital Public Infrastructure
      </footer>
    </div>
  );
}
