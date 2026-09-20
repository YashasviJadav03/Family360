import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, CheckCircle2, AlertCircle, ArrowLeft, Globe, Send,
  FileCheck, IndianRupee, MapPin, ChevronRight, ShieldCheck
} from 'lucide-react';
import { familyApi, applicationApi } from '../api/client';

export default function CitizenDashboard() {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [gapReport, setGapReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [appliedSchemes, setAppliedSchemes] = useState({});

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [famData, gapData] = await Promise.all([
          familyApi.getFamilyById(familyId),
          familyApi.getBenefitGap(familyId),
        ]);
        if (mounted) {
          setFamily(famData);
          setGapReport(gapData);
        }
      } catch (err) {
        if (mounted) {
          setError(
            lang === 'en'
              ? `We couldn't find Family ID "${familyId}". Please check the number or contact your local Taluka Gram Panchayat.`
              : `અમને ફેમિલી આઈડી "${familyId}" મળ્યો નથી. કૃપા કરીને આઈડી ચકાસો અથવા તમારા તાલુકા પંચાયતનો સંપર્ક કરો.`
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [familyId, lang]);

  const handleApply = async (scheme) => {
    try {
      await applicationApi.createApplication({
        family_id: family.family_id,
        member_id: family.members?.[0]?.member_id,
        scheme_id: scheme.scheme_id,
      });
      setAppliedSchemes((prev) => ({ ...prev, [scheme.scheme_id]: true }));
    } catch (err) {
      console.error(err);
      alert('Could not submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-bg flex items-center justify-center p-4 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-secondary">
            {lang === 'en' ? 'Fetching official family welfare records...' : 'પરિવારની કલ્યાણકારી વિગતો લોડ થઈ રહી છે...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !family) {
    return (
      <div className="min-h-screen bg-slate-bg flex items-center justify-center p-4">
        <div className="card-dpi p-6 max-w-md w-full bg-white text-center">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-text mb-2">
            {lang === 'en' ? 'Family Record Not Found' : 'પરિવારનો રેકોર્ડ મળ્યો નથી'}
          </h3>
          <p className="text-xs text-slate-secondary mb-4 leading-relaxed">{error}</p>
          <Link
            to="/citizen/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Try Another Family ID' : 'બીજો આઈડી દાખલ કરો'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const receiving = gapReport?.receiving_schemes || [];
  const gaps = gapReport?.gap_schemes || [];

  return (
    <div className="min-h-screen bg-slate-bg flex flex-col justify-between">
      {/* Reassuring Top Navigation */}
      <header className="bg-navy text-white px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between border-b border-navy-dark">
        <Link to="/citizen/login" className="flex items-center gap-2 text-xs font-medium text-slate-200 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'પાછા'}</span>
        </Link>

        <div className="text-center">
          <span className="text-xs font-mono font-semibold bg-white/10 px-2 py-0.5 rounded text-orange-light">
            {family.family_id}
          </span>
          <span className="text-[11px] text-slate-300 ml-2 hidden sm:inline">
            {family.village}, {family.district}
          </span>
        </div>

        <button
          onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}
          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-orange" />
          <span>{lang === 'en' ? 'ગુજરાતી' : 'English'}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-6 w-full flex-1 space-y-5">
        {/* Reassuring Welcome Summary */}
        <div className="card-dpi p-5 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-navy mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{lang === 'en' ? 'Verified Gujarat Family Record' : 'ચકાસાયેલ ગુજરાત ફેમિલી રેકોર્ડ'}</span>
          </div>

          <h2 className="text-lg font-bold text-slate-text">
            {lang === 'en'
              ? `Welfare Entitlements for ${family.head_name || 'Your Household'}`
              : `${family.head_name || 'તમારા પરિવાર'} માટે સરકારી કલ્યાણ સહાય`}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-border text-xs text-slate-secondary">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Users className="w-3.5 h-3.5 text-navy" />
              {family.family_size} {lang === 'en' ? 'Members' : 'સભ્યો'}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-navy" />
              {family.village}, {family.district}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <IndianRupee className="w-3.5 h-3.5 text-navy" />
              ₹{(family.annual_income || 0).toLocaleString('en-IN')}/yr
            </span>
          </div>
        </div>

        {/* 2 Key Action Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-dpi p-4 bg-emerald-50/50 border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-900 block uppercase tracking-wider">
              {lang === 'en' ? 'Active Benefits' : 'મળતા લાભો'}
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">
              {receiving.length}
            </span>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">
              {lang === 'en' ? 'Currently receiving' : 'હાલમાં ચાલુ યોજનાઓ'}
            </span>
          </div>

          <div className="card-dpi p-4 bg-amber-50/70 border-2 border-amber-300">
            <span className="text-[11px] font-bold text-amber-900 block uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              {lang === 'en' ? 'May Be Available' : 'મળી શકે તેવા લાભો'}
            </span>
            <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">
              {gaps.length}
            </span>
            <span className="text-[11px] text-amber-800 mt-0.5 block font-medium">
              {lang === 'en' ? 'Eligible to apply' : 'તમે પાત્ર છો'}
            </span>
          </div>
        </div>

        {/* SECTION 1: Potential Benefits You May Be Eligible For (Prominent) */}
        {gaps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-amber-300">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {lang === 'en' ? 'Recommended Schemes for Your Family' : 'તમારા પરિવાર માટે ભલામણ કરેલ યોજનાઓ'}
              </h3>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {lang === 'en' ? 'Apply Now' : 'અરજી કરો'}
              </span>
            </div>

            <div className="space-y-3">
              {gaps.map((scheme) => {
                const isApplied = appliedSchemes[scheme.scheme_id];
                return (
                  <div
                    key={scheme.scheme_id}
                    className="card-dpi p-4 bg-white border-2 border-amber-200 hover:border-amber-400 transition-all space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {scheme.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-text mt-1">{scheme.scheme_name}</h4>
                        <p className="text-xs text-slate-secondary mt-0.5">{scheme.benefit}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {lang === 'en' ? 'Eligibility criteria satisfied' : 'તમે માપદંડ પૂર્ણ કરો છો'}
                      </span>

                      {isApplied ? (
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {lang === 'en' ? 'Applied' : 'અરજી સબમિટ થઈ'}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(scheme)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white bg-orange hover:bg-orange-hover transition-colors shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Submit Application' : 'અરજી કરો'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Active Schemes Currently Disbursed */}
        {receiving.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-emerald-300">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {lang === 'en' ? 'Currently Received Benefits' : 'હાલમાં મળતા લાભો'}
              </h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {lang === 'en' ? 'Active' : 'સક્રિય'}
              </span>
            </div>

            <div className="space-y-2">
              {receiving.map((scheme) => (
                <div key={scheme.scheme_id} className="card-dpi p-3.5 bg-white border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">{scheme.category}</span>
                    <h4 className="text-xs font-bold text-slate-text">{scheme.scheme_name}</h4>
                    <p className="text-[11px] text-slate-secondary">{scheme.benefit}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    ✓ {lang === 'en' ? 'Disbursing' : 'ચાલુ છે'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reassuring Help & Contact Footer */}
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-secondary space-y-1">
          <p className="font-semibold text-slate-text">
            {lang === 'en' ? 'Need Help or Verification?' : 'સહાય કે ચકાસણી માટે માર્ગદર્શન જોઈએ છે?'}
          </p>
          <p>
            {lang === 'en'
              ? 'Visit your local Taluka e-Samaj Kalyan office or call the Gujarat Citizen Welfare Helpline at 1800-233-5500.'
              : 'તમારા નજીકના તાલુકા ઈ-સમાજ કલ્યાણ કચેરીની મુલાકાત લો અથવા હેલ્પલાઇન 1800-233-5500 પર સંપર્ક કરો.'}
          </p>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-border">
        Government of Gujarat · Digital Public Infrastructure
      </footer>
    </div>
  );
}
