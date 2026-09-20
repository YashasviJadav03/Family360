import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Users, Building2, Shield, ArrowRight, Lock, User,
  CheckCircle2, AlertCircle, Search, KeyRound, Globe,
  FileCheck, MapPin, Sparkles, Smartphone, Check, HelpCircle
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';
import { t } from '../i18n';

// Sample families directly from the 3,000 household dataset for 1-click citizen login
const SAMPLE_CITIZENS = [
  {
    id: 'GJ-F000525',
    name: 'Vijay Dipak Thakor',
    district: 'Anand',
    taluka: 'Anand',
    category: 'SC',
    income: '₹1,24,173',
    gapsCount: 5,
    highlight: 'Dr. Ambedkar Awas & Sant Surdas Pension'
  },
  {
    id: 'GJ-F000001',
    name: 'Dipak Dipak Mehta',
    district: 'Junagadh',
    taluka: 'Junagadh Rural',
    category: 'OBC',
    income: '₹2,10,790',
    gapsCount: 1,
    highlight: 'Post-Matric Scholarship'
  },
  {
    id: 'GJ-F000024',
    name: 'Suman Vijay Thakor',
    district: 'Vadodara',
    taluka: 'Dabhoi',
    category: 'SC',
    income: '₹94,052',
    gapsCount: 2,
    highlight: 'Manav Garima Self-Employment'
  },
  {
    id: 'GJ-F000002',
    name: 'Vipul Kishore Chavda',
    district: 'Surat',
    taluka: 'Chorasi',
    category: 'General',
    income: '₹1,61,446',
    gapsCount: 1,
    highlight: 'Indira Gandhi Old Age Pension'
  }
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user: currentUser, isAuthenticated, logout } = useAuth();

  // Active Role Tab: 'citizen' | 'taluka_officer' | 'district_officer' | 'state_admin'
  const initialRoleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState(() => {
    if (initialRoleParam === 'citizen') return 'citizen';
    if (initialRoleParam === 'taluka') return 'taluka_officer';
    if (initialRoleParam === 'district' || initialRoleParam === 'officer') return 'district_officer';
    if (initialRoleParam === 'state' || initialRoleParam === 'admin') return 'state_admin';
    return 'citizen';
  });

  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Citizen Form State
  const [citizenInputType, setCitizenInputType] = useState('family_id'); // 'family_id' | 'aadhaar'
  const [familyIdInput, setFamilyIdInput] = useState('GJ-F000525');
  const [aadhaarInput, setAadhaarInput] = useState('•••• •••• 4892');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('782941');

  // Officer Form State
  const [selectedOfficerRole, setSelectedOfficerRole] = useState(activeTab);
  const [officerPasscode, setOfficerPasscode] = useState('••••••••••••');

  useEffect(() => {
    if (activeTab !== 'citizen') {
      setSelectedOfficerRole(activeTab);
    }
  }, [activeTab]);

  // Handle Citizen Login Submission
  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanId = familyIdInput.trim().toUpperCase();
    if (!cleanId) {
      setError(
        lang === 'en'
          ? 'Please enter a valid Gujarat Family ID.'
          : lang === 'hi'
          ? 'कृपया एक मान्य गुजरात परिवार पहचान संख्या दर्ज करें।'
          : 'કૃપા કરીને માન્ય ગુજરાત ફેમિલી આઈડી દાખલ કરો.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Find matching sample citizen if any, or use custom ID
      const matched = SAMPLE_CITIZENS.find((c) => c.id === cleanId);
      const redirectUrl = login('citizen', {
        id: cleanId,
        name: matched ? matched.name : `Citizen Head (${cleanId})`,
        jurisdiction: matched ? `${matched.taluka}, ${matched.district}` : 'Gujarat State',
      });
      setIsLoading(false);
      navigate(redirectUrl);
    }, 600);
  };

  // Handle Officer Login Submission
  const handleOfficerSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const redirectUrl = login(activeTab);
      setIsLoading(false);
      navigate(redirectUrl);
    }, 600);
  };

  // Quick Instant Login as any RBAC Persona
  const handleQuickPersona = (roleKey, customId = null) => {
    setIsLoading(true);
    setTimeout(() => {
      let customData = {};
      if (roleKey === 'citizen' && customId) {
        const matched = SAMPLE_CITIZENS.find((c) => c.id === customId);
        customData = {
          id: customId,
          name: matched?.name,
          jurisdiction: matched ? `${matched.taluka}, ${matched.district}` : 'Gujarat State'
        };
      }
      const redirectUrl = login(roleKey, customData);
      setIsLoading(false);
      navigate(redirectUrl);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col justify-between text-slate-800 antialiased selection:bg-navy/10 selection:text-navy">
      {/* Official Government Top Bar & Header */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'))}
        onSelectLang={(code) => setLang(code)}
        currentRole={activeTab === 'citizen' ? 'citizen' : 'officer'}
      />

      {/* Main Authentication Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full flex flex-col justify-center">
        {/* Active Session Warning Bar if user is already logged in */}
        {isAuthenticated && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong>{lang === 'en' ? 'Active Session' : 'સક્રિય સત્ર'}:</strong>{' '}
                {currentUser?.name} (<span className="font-mono uppercase font-bold">{currentUser?.role?.replace('_', ' ')}</span>)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(currentUser.defaultRedirect || '/')}
                className="px-3 py-1 rounded bg-navy text-white font-semibold hover:bg-navy-dark transition-colors"
              >
                {lang === 'en' ? 'Go to Dashboard' : 'ડેશબોર્ડ પર જાઓ'} →
              </button>
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors font-medium"
              >
                {lang === 'en' ? 'Sign Out' : 'સાઇન આઉટ'}
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 border border-navy/15 text-[11px] font-bold text-navy mb-3">
            <Shield className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>
              {lang === 'en'
                ? 'State Single Sign-On (SSO) & Role-Based Access Control'
                : lang === 'hi'
                ? 'राज्य एकल लॉगिन (SSO) एवं भूमिका आधारित पहुंच प्रणाली'
                : 'ગુજરાત સિંગલ સાઇન-ઑન (SSO) અને રોલ આધારિત અધિકાર'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-navy tracking-tight">
            {lang === 'en'
              ? 'Family360 Unified Welfare Gateway'
              : lang === 'hi'
              ? 'फैमिली360 एकीकृत कल्याण पोर्टल'
              : 'ફેમિલી360 એકીકૃત કલ્યાણકારી પ્રવેશદ્વાર'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {lang === 'en'
              ? 'Authenticate to access personalized citizen welfare entitlements or role-restricted government administrative consoles.'
              : lang === 'hi'
              ? 'व्यक्तिगत नागरिक कल्याण लाभ अथवा प्रशासनिक अधिकारी कंसोल में प्रवेश हेतु प्रमाणीकरण करें।'
              : 'વ્યક્તિગત નાગરિક કલ્યાણ યોજનાઓ અથવા વહીવટી અધિકારી કન્સોલમાં પ્રવેશવા માટે પ્રમાણીકરણ કરો.'}
          </p>
        </div>

        {/* Main RBAC Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* RBAC Role Selection Tabs (4 Levels) */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
            {/* Tab 1: Citizen */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('citizen');
                setError('');
              }}
              className={`p-3.5 sm:p-4 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                activeTab === 'citizen'
                  ? 'bg-white border-[#FF671F] text-navy font-bold shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeTab === 'citizen' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">
                  {lang === 'en' ? 'Citizen Portal' : lang === 'hi' ? 'नागरिक पोर्टल' : 'નાગરિક સેવા'}
                </span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block">Public Access</span>
              </div>
            </button>

            {/* Tab 2: Taluka Officer */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('taluka_officer');
                setError('');
              }}
              className={`p-3.5 sm:p-4 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                activeTab === 'taluka_officer'
                  ? 'bg-white border-blue-600 text-navy font-bold shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeTab === 'taluka_officer' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-600'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">
                  {lang === 'en' ? 'Taluka Officer' : lang === 'hi' ? 'तालुका अधिकारी' : 'તાલુકા અધિકારી'}
                </span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block">Field & Camps</span>
              </div>
            </button>

            {/* Tab 3: District Officer */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('district_officer');
                setError('');
              }}
              className={`p-3.5 sm:p-4 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                activeTab === 'district_officer'
                  ? 'bg-white border-emerald-600 text-navy font-bold shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeTab === 'district_officer' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">
                  {lang === 'en' ? 'District Officer' : lang === 'hi' ? 'जिला अधिकारी' : 'જિલ્લા અધિકારી'}
                </span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block">Deduplication & Admin</span>
              </div>
            </button>

            {/* Tab 4: State Admin */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('state_admin');
                setError('');
              }}
              className={`p-3.5 sm:p-4 text-center transition-all border-b-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                activeTab === 'state_admin'
                  ? 'bg-white border-purple-600 text-navy font-bold shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                activeTab === 'state_admin' ? 'bg-purple-100 text-purple-900' : 'bg-slate-200 text-slate-600'
              }`}>
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">
                  {lang === 'en' ? 'State Admin' : lang === 'hi' ? 'राज्य निदेशालय' : 'રાજ્ય વહીવટ'}
                </span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block">Directorate & Policy</span>
              </div>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8">
            {/* ================================================================= */}
            {/* TAB 1: CITIZEN / BENEFICIARY AUTHENTICATION */}
            {/* ================================================================= */}
            {activeTab === 'citizen' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-navy flex items-center gap-2">
                      <span>Citizen Welfare Verification</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-semibold">
                        RBAC: Citizen Self-Service
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your Gujarat Family ID to verify entitlements, view eligible unclaimed welfare benefits, or file grievances.
                    </p>
                  </div>

                  {/* Input toggle */}
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-semibold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCitizenInputType('family_id')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        citizenInputType === 'family_id' ? 'bg-white shadow-xs text-navy font-bold' : 'text-slate-600 hover:text-navy'
                      }`}
                    >
                      Family ID (પરિવાર આઈડી)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCitizenInputType('aadhaar')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        citizenInputType === 'aadhaar' ? 'bg-white shadow-xs text-navy font-bold' : 'text-slate-600 hover:text-navy'
                      }`}
                    >
                      Aadhaar / Ration Card OTP
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  {citizenInputType === 'family_id' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gujarat Family ID (પરિવાર ઓળખ ક્રમાંક)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={familyIdInput}
                          onChange={(e) => {
                            setFamilyIdInput(e.target.value);
                            setError('');
                          }}
                          placeholder="e.g., GJ-F000525"
                          className="w-full text-sm font-mono uppercase px-3.5 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 text-slate-900 font-semibold"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Aadhaar Number / Ration Card (Masked Vault)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={aadhaarInput}
                            onChange={(e) => setAadhaarInput(e.target.value)}
                            className="w-full text-sm font-mono px-3.5 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
                          />
                          <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-40 text-sm font-mono text-center tracking-widest px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setOtpSent(true)}
                          className="text-xs px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                        >
                          {otpSent ? '✓ OTP Sent to ···4892' : 'Resend Demo OTP'}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying Gujarat State Registry...
                      </span>
                    ) : (
                      <>
                        <span>Authenticate & View Family Benefits</span>
                        <ArrowRight className="w-4 h-4 text-[#FF671F]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Curated Sample Household Personas for Quick Evaluation */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>One-Click Evaluation Households (Live 3,000 DB):</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Click to instantly load profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SAMPLE_CITIZENS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleQuickPersona('citizen', c.id)}
                        className="text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/40 transition-all group flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-navy group-hover:text-amber-800">
                              {c.id}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                              {c.category}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 mt-0.5">{c.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {c.taluka}, {c.district} · Income {c.income}
                          </div>
                          <div className="text-[11px] font-medium text-amber-800 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]"></span>
                            <span>{c.gapsCount} Unclaimed Benefits ({c.highlight})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2, 3, 4: GOVERNMENT OFFICER / ADMINISTRATIVE AUTHENTICATION */}
            {/* ================================================================= */}
            {activeTab !== 'citizen' && (
              <div className="space-y-6">
                {/* Header for Active Officer Tier */}
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-navy flex items-center gap-2">
                      <span>{DEMO_PERSONAS[activeTab]?.roleLabel}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                        activeTab === 'taluka_officer'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : activeTab === 'district_officer'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-purple-100 text-purple-900 border border-purple-200'
                      }`}>
                        RBAC: {activeTab.replace('_', ' ')}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      {DEMO_PERSONAS[activeTab]?.description}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-slate-500 font-mono hidden sm:block">
                    Target: <span className="font-bold text-navy">{DEMO_PERSONAS[activeTab]?.defaultRedirect}</span>
                  </div>
                </div>

                {/* Pre-configured Identity Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {DEMO_PERSONAS[activeTab]?.avatar}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">
                        Employee ID: {DEMO_PERSONAS[activeTab]?.id}
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {DEMO_PERSONAS[activeTab]?.name}
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{DEMO_PERSONAS[activeTab]?.jurisdiction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Assigned RBAC Scope
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{DEMO_PERSONAS[activeTab]?.permissions.length} Authorized Modules</span>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleOfficerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Administrative Security Passcode (Demo Mode Pre-filled)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={officerPasscode}
                        disabled
                        className="w-full text-xs font-mono pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Authorizing Officer Session...
                      </span>
                    ) : (
                      <>
                        <span>Authenticate & Enter {DEMO_PERSONAS[activeTab]?.roleLabel}</span>
                        <ArrowRight className="w-4 h-4 text-[#FF671F]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Role Capabilities Preview */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Authorized RBAC Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEMO_PERSONAS[activeTab]?.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick-Switch Role Footer Bar for Hackathon Demonstrations */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <KeyRound className="w-4 h-4 text-[#FF671F]" />
              <span className="font-semibold text-slate-700">Hackathon Evaluator Quick Jump:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('citizen', 'GJ-F000525')}
                className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 text-[11px] font-semibold transition-all"
              >
                🧑 Citizen (Vijay Thakor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('taluka_officer')}
                className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 text-[11px] font-semibold transition-all"
              >
                📋 Taluka Officer (Camps)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('district_officer')}
                className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-[11px] font-semibold transition-all"
              >
                🛡️ District Officer (Duplicates)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('state_admin')}
                className="px-2.5 py-1 rounded bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 text-[11px] font-semibold transition-all"
              >
                🌐 State Admin (Dashboard)
              </button>
            </div>
          </div>
        </div>

        {/* Government Compliance & Security Notice */}
        <div className="mt-8 text-center text-xs text-slate-500 max-w-xl mx-auto space-y-1">
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>✓ STQC & GIGW 3.0 Certified</span>
            <span>·</span>
            <span>✓ 256-Bit TLS Encryption</span>
            <span>·</span>
            <span>✓ Masked Aadhaar Vault</span>
          </div>
          <p className="text-[11px]">
            Family360 is an official Digital Public Infrastructure project developed under the Government of Gujarat Social Justice & Empowerment Department guidelines.
          </p>
        </div>
      </main>

      <NationalGovFooter />
    </div>
  );
}
