import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowRight, ShieldCheck, Globe, Search, AlertCircle } from 'lucide-react';

export default function CitizenLogin() {
  const [familyId, setFamilyId] = useState('GJ-F000001');
  const [lang, setLang] = useState('en');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanId = familyId.trim().toUpperCase();
    if (!cleanId) {
      setError(lang === 'en' ? 'Please enter a valid Family ID.' : 'કૃપા કરીને માન્ય ફેમિલી આઈડી દાખલ કરો.');
      return;
    }
    navigate(`/citizen/family/${cleanId}`);
  };

  const sampleIds = ['GJ-F000001', 'GJ-F000002', 'GJ-F000004', 'GJ-F000005'];

  return (
    <div className="min-h-screen bg-slate-bg flex flex-col justify-between">
      {/* Top Bar */}
      <header className="bg-navy-dark text-white px-6 py-3 border-b border-navy flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-navy flex items-center justify-center border border-white/20">
            <span className="font-bold text-sm text-orange">360</span>
          </div>
          <span className="font-bold text-sm">Family360 · {lang === 'en' ? 'Citizen Portal' : 'નાગરિક પોર્ટલ'}</span>
        </Link>

        <button
          onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}
          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-orange" />
          <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
        </button>
      </header>

      {/* Main Login Form */}
      <div className="max-w-md mx-auto px-4 py-8 w-full">
        <div className="card-dpi p-6 sm:p-8 bg-white shadow-card border border-slate-border">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-navy-subtle text-navy flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-navy">
              {lang === 'en' ? 'Check Your Family Benefits' : 'તમારા પરિવાર માટે ઉપલબ્ધ સહાય'}
            </h2>
            <p className="text-xs text-slate-secondary mt-1">
              {lang === 'en'
                ? 'Enter your Gujarat Family ID or Ration Card to check active and eligible benefits.'
                : 'સક્રિય અને સંભવિત કલ્યાણકારી યોજનાઓ ચકાસવા માટે તમારો ફેમિલી આઈડી દાખલ કરો.'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1.5">
                {lang === 'en' ? 'Gujarat Family ID' : 'ગુજરાત ફેમિલી આઈડી'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={familyId}
                  onChange={(e) => {
                    setFamilyId(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., GJ-F000001"
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
              className="w-full py-2.5 px-4 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark transition-colors flex items-center justify-center gap-2"
            >
              <span>{lang === 'en' ? 'View Family Benefits' : 'પરિવારના લાભો જુઓ'}</span>
              <ArrowRight className="w-4 h-4 text-orange" />
            </button>
          </form>

          {/* Demo Quick Select IDs */}
          <div className="mt-6 pt-4 border-t border-slate-border">
            <span className="text-[11px] font-medium text-slate-secondary block mb-2 text-center">
              {lang === 'en' ? 'Try sample demo Family IDs:' : 'નમૂના આઈડી અજમાવો:'}
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {sampleIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFamilyId(id)}
                  className="text-xs font-mono px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-navy border border-slate-200 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured via Gujarat State Data Center & Civil Supplies Registry</span>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-border">
        Government of Gujarat · Digital Public Infrastructure
      </footer>
    </div>
  );
}
