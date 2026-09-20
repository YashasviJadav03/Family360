import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowRight, ShieldCheck, Search, AlertCircle } from 'lucide-react';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';

import { useAuth } from '../context/AuthContext';

export default function CitizenLogin() {
  const [familyId, setFamilyId] = useState('GJ-F000012');
  const [lang, setLang] = useState('en');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanId = familyId.trim().toUpperCase();
    if (!cleanId) {
      setError(
        lang === 'en'
          ? 'Please enter a valid Family ID.'
          : lang === 'hi'
          ? 'कृपया एक मान्य परिवार आईडी दर्ज करें।'
          : 'કૃપા કરીને માન્ય ફેમિલી આઈડી દાખલ કરો.'
      );
      return;
    }
    // Update Citizen session to this specific family ID
    login('citizen', { id: cleanId });
    navigate(`/citizen/family/${cleanId}`);
  };

  const sampleIds = ['GJ-F000012', 'GJ-F000001', 'GJ-F000024', 'GJ-F000002', 'GJ-F000525'];

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-text">
      {/* Official Government Top Bar & Header */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'))}
        onSelectLang={(code) => setLang(code)}
        currentRole="citizen"
      />

      {/* Main Login Form */}
      <div className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="card-dpi p-6 sm:p-8 bg-white shadow-card border border-slate-border">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded bg-navy-subtle text-navy flex items-center justify-center mx-auto mb-3 border border-navy/20">
              <Users className="w-6 h-6 text-navy" />
            </div>
            <h2 className="text-xl font-bold font-serif text-navy">
              {lang === 'en'
                ? 'Check Your Family Benefits'
                : lang === 'hi'
                ? 'अपने परिवार के लाभ एवं योजनाएं देखें'
                : 'તમારા પરિવાર માટે ઉપલબ્ધ સહાય'}
            </h2>
            <p className="text-xs text-slate-secondary mt-1">
              {lang === 'en'
                ? 'Enter your Gujarat Family ID to verify active entitlements and discover eligible statutory programs.'
                : lang === 'hi'
                ? 'सक्रिय लाभों की जांच करने एवं पात्र योजनाओं की जानकारी पाने के लिए अपना गुजरात परिवार पहचान दर्ज करें।'
                : 'સક્રિય અને સંભવિત કલ્યાણકારી યોજનાઓ ચકાસવા માટે તમારો ફેમિલી આઈડી દાખલ કરો.'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1.5">
                {lang === 'en'
                  ? 'Gujarat Family ID (પરિવાર ઓળખ ક્રમાંક / परिवार पहचान)'
                  : lang === 'hi'
                  ? 'गुजरात परिवार पहचान संख्या (Family ID)'
                  : 'ગુજરાત ફેમિલી આઈડી (પરિવાર ઓળખ ક્રમાંક)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={familyId}
                  onChange={(e) => {
                    setFamilyId(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., GJ-F000525"
                  className="w-full text-sm font-mono uppercase px-3 py-2.5 border border-slate-border rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-navy text-slate-text"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {error && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>
                {lang === 'en'
                  ? 'View Family Benefits'
                  : lang === 'hi'
                  ? 'परिवार के लाभ देखें'
                  : 'પરિવારના લાભો જુઓ'}
              </span>
              <ArrowRight className="w-4 h-4 text-orange" />
            </button>
          </form>

          {/* Demo Quick Select IDs */}
          <div className="mt-6 pt-4 border-t border-slate-border">
            <span className="text-[11px] font-medium text-slate-secondary block mb-2 text-center font-mono uppercase tracking-wider">
              {lang === 'en'
                ? 'Quick Pilot Demonstration IDs'
                : lang === 'hi'
                ? 'नमूना परिवार आईडी चुनें'
                : 'નમૂના આઈડી અજમાવો'}
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {sampleIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFamilyId(id)}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 hover:bg-navy-subtle hover:text-navy text-slate-700 border border-slate-border transition-colors font-semibold"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {lang === 'en'
              ? 'Secured via Gujarat State Data Center & Civil Supplies Registry'
              : lang === 'hi'
              ? 'गुजरात राज्य डेटा सेंटर एवं नागरिक आपूर्ति रजिस्ट्री द्वारा सुरक्षित'
              : 'ગુજરાત સ્ટેટ ડેટા સેન્ટર અને નાગરિક પુરવઠા રજિસ્ટ્રી દ્વારા સુરક્ષિત'}
          </span>
        </div>
      </div>

      {/* Official Government Footer */}
      <NationalGovFooter lang={lang} />
    </div>
  );
}
