import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, CheckCircle2, AlertCircle, ArrowLeft, Send,
  IndianRupee, MapPin, Building2
} from 'lucide-react';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';
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
              ? `We couldn't find Family ID "${familyId}". Please check the identifier or contact your local Taluka Gram Panchayat.`
              : lang === 'hi'
              ? `हमें परिवार आईडी "${familyId}" नहीं मिला। कृपया पहचान संख्या की जांच करें या अपनी स्थानीय तालुका पंचायत से संपर्क करें।`
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

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-text">
      {/* Official Government Top Bar & Header */}
      <NationalGovHeader
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'))}
        onSelectLang={(code) => setLang(code)}
        currentRole="citizen"
      />

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 space-y-6" id="main-content">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-border text-xs">
          <Link
            to="/citizen/login"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-secondary hover:text-navy"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Back to Family Search'
                : lang === 'hi'
                ? 'परिवार खोज पर वापस जाएं'
                : 'પરિવાર શોધ પર પાછા જાઓ'}
            </span>
          </Link>
          <span className="font-mono text-xs font-bold text-navy bg-navy-subtle px-2 py-0.5 rounded">
            {familyId}
          </span>
        </div>

        {loading ? (
          <div className="card-dpi p-16 text-center">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-secondary">
              {lang === 'en'
                ? 'Fetching verified civil registry records...'
                : lang === 'hi'
                ? 'नागरिक रिकॉर्ड प्राप्त किए जा रहे हैं...'
                : 'પરિવારની કલ્યાણકારી વિગતો લોડ થઈ રહી છે...'}
            </p>
          </div>
        ) : error || !family ? (
          <div className="card-dpi p-8 bg-white text-center">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-text mb-2">
              {lang === 'en'
                ? 'Family Record Not Found'
                : lang === 'hi'
                ? 'परिवार रिकॉर्ड नहीं मिला'
                : 'પરિવારનો રેકોર્ડ મળ્યો નથી'}
            </h3>
            <p className="text-xs text-slate-secondary mb-4 leading-relaxed max-w-md mx-auto">{error}</p>
            <Link
              to="/citizen/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-navy hover:bg-navy-dark"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? 'Try Another Family ID'
                  : lang === 'hi'
                  ? 'अन्य परिवार आईडी दर्ज करें'
                  : 'બીજો આઈડી દાખલ કરો'}
              </span>
            </Link>
          </div>
        ) : (
          <>
            {/* Reassuring Welcome Summary */}
            <div className="card-dpi p-6 bg-white border border-slate-border">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-navy mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {lang === 'en'
                    ? 'Civil Supplies Registry Verified'
                    : lang === 'hi'
                    ? 'नागरिक आपूर्ति रजिस्ट्री द्वारा सत्यापित'
                    : 'અન્ન અને નાગરિક પુરવઠા વિભાગ ચકાસાયેલ'}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  Ration: {family.ration_card_id || 'Not linked'}
                </span>
              </div>

              <h1 className="text-xl font-bold font-serif text-navy">
                {lang === 'en'
                  ? `Welfare Entitlements for ${family.head_name || 'Your Household'}`
                  : lang === 'hi'
                  ? `${family.head_name || 'आपके परिवार'} हेतु सरकारी कल्याणकारी योजनाएं`
                  : `${family.head_name || 'તમારા પરિવાર'} માટે સરકારી કલ્યાણ સહાય`}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-border text-xs text-slate-secondary">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-navy" />
                  {family.family_size}{' '}
                  {lang === 'en' ? 'Members' : lang === 'hi' ? 'सदस्य' : 'સભ્યો'}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-navy" />
                  {family.village}, {family.taluka}, {family.district}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <IndianRupee className="w-3.5 h-3.5 text-navy" />
                  ₹{(family.annual_income || 0).toLocaleString('en-IN')}/
                  {lang === 'en' ? 'yr' : lang === 'hi' ? 'वर्ष' : 'વર્ષ'}
                </span>
                <span className="font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                  {family.social_category}
                </span>
              </div>
            </div>

            {/* 2 Key Status Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-dpi p-4 bg-emerald-50/60 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 block uppercase tracking-wider">
                  {lang === 'en' ? 'Active Entitlements' : lang === 'hi' ? 'सक्रिय योजना लाभ' : 'ચાલુ સહાય'}
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">
                  {gapReport?.receiving_schemes?.length || 0}
                </span>
                <span className="text-[11px] text-emerald-700 mt-0.5 block">
                  {lang === 'en'
                    ? 'Currently receiving benefits'
                    : lang === 'hi'
                    ? 'वर्तमान में प्राप्त हो रहे लाभ'
                    : 'હાલમાં મળતા સરકારી લાભો'}
                </span>
              </div>

              <div className="card-dpi p-4 bg-amber-50/70 border-2 border-amber-300">
                <span className="text-[11px] font-bold text-amber-900 block uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'en' ? 'Eligible to Apply' : lang === 'hi' ? 'पात्र एवं आवेदन योग्य' : 'મળી શકે તેવા લાભો'}
                </span>
                <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">
                  {gapReport?.gap_schemes?.length || 0}
                </span>
                <span className="text-[11px] text-amber-800 mt-0.5 block font-medium">
                  {lang === 'en'
                    ? 'Potential benefit gaps'
                    : lang === 'hi'
                    ? 'पात्र हैं किंतु आवेदन लंबित'
                    : 'તમે પાત્ર છો પરંતુ અરજી બાકી'}
                </span>
              </div>
            </div>

            {/* SECTION 1: Potential Benefits You May Be Eligible For */}
            {gapReport?.gap_schemes && gapReport.gap_schemes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b-2 border-amber-300">
                  <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    {lang === 'en'
                      ? 'Recommended Schemes for Your Household'
                      : lang === 'hi'
                      ? 'आपके परिवार के लिए अनुशंसित योजनाएं'
                      : 'તમારા પરિવાર માટે ભલામણ કરેલ યોજનાઓ'}
                  </h2>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {lang === 'en'
                      ? 'Statutory Rule Match'
                      : lang === 'hi'
                      ? 'नियम पात्रता पूर्ण'
                      : 'પાત્રતા પૂર્ણ'}
                  </span>
                </div>

                <div className="space-y-3">
                  {gapReport.gap_schemes.map((schemeItem) => {
                    const scheme = schemeItem.scheme || schemeItem;
                    const isApplied = appliedSchemes[scheme.scheme_id];
                    return (
                      <div
                        key={scheme.scheme_id}
                        className="card-dpi p-4 bg-white border-2 border-amber-200 hover:border-amber-400 transition-all space-y-2 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {scheme.scheme_id} · {scheme.category}
                            </span>
                            <h3 className="text-sm font-bold text-slate-text mt-1">{scheme.scheme_name}</h3>
                            <p className="text-xs text-slate-secondary mt-0.5">{scheme.benefit_description || scheme.benefit}</p>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {lang === 'en'
                              ? 'Verified against income and category criteria'
                              : lang === 'hi'
                              ? 'आय और श्रेणी मानदंडों के अनुसार सत्यापित'
                              : 'આવક અને જાતિ માપદંડ પૂર્ણ થયેલ છે'}
                          </span>

                          {isApplied ? (
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {lang === 'en'
                                ? 'Application Submitted'
                                : lang === 'hi'
                                ? 'आवेदन सफलतापूर्वक जमा'
                                : 'અરજી સફળતાપૂર્વક સબમિટ થઈ'}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(scheme)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-orange hover:bg-orange-hover transition-colors shadow-sm"
                            >
                              <Send className="w-3 h-3" />
                              <span>
                                {lang === 'en'
                                  ? 'Submit Application'
                                  : lang === 'hi'
                                  ? 'आवेदन करें'
                                  : 'અરજી કરો'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: Currently Received Benefits */}
            {gapReport?.receiving_schemes && gapReport.receiving_schemes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1.5 border-b-2 border-emerald-400">
                  <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {lang === 'en'
                      ? 'Currently Received Benefits'
                      : lang === 'hi'
                      ? 'वर्तमान में प्राप्त हो रहे लाभ'
                      : 'હાલમાં મળતા લાભો'}
                  </h2>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {lang === 'en' ? 'Active Disbursal' : lang === 'hi' ? 'सक्रिय संवितरण' : 'ચાલુ સહાય'}
                  </span>
                </div>

                <div className="space-y-2">
                  {gapReport.receiving_schemes.map((schemeItem) => {
                    const scheme = schemeItem.scheme || schemeItem;
                    return (
                      <div
                        key={scheme.scheme_id}
                        className="card-dpi p-4 bg-white border border-emerald-200 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {scheme.scheme_id} · {scheme.category}
                          </span>
                          <h3 className="text-xs font-bold text-slate-text">{scheme.scheme_name}</h3>
                          <p className="text-[11px] text-slate-secondary mt-0.5">
                            {scheme.benefit_description || scheme.benefit}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
                          ✓ {lang === 'en' ? 'Active' : lang === 'hi' ? 'सक्रिय' : 'ચાલુ છે'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Institutional Helpdesk Card */}
            <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-secondary space-y-1.5">
              <p className="font-bold text-slate-text flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-navy" />
                {lang === 'en'
                  ? 'Official Grievance & Verification Contact'
                  : lang === 'hi'
                  ? 'आधिकारिक सहायता एवं संपर्क केंद्र'
                  : 'સહાય અને ચકાસણી માટે સંપર્ક'}
              </p>
              <p>
                {lang === 'en'
                  ? 'If any demographic detail is mismatched, visit your local Taluka e-Samaj Kalyan office with original documents or call the toll-free citizen helpline at 1800-233-5500.'
                  : lang === 'hi'
                  ? 'यदि कोई जनसांख्यिकीय विवरण मेल नहीं खाता है, तो मूल दस्तावेजों के साथ अपने स्थानीय तालुका ई-समाज कल्याण कार्यालय जाएं अथवा टोल-फ्री हेल्पलाइन 1800-233-5500 पर संपर्क करें।'
                  : 'જો કોઈ વિગતમાં ભૂલ હોય તો મૂળ આધાર/રેશન કાર્ડ સાથે તમારા તાલુકા ઈ-સમાજ કલ્યાણ કેન્દ્રનો સંપર્ક કરો અથવા ટોલ-ફ્રી હેલ્પલાઇન 1800-233-5500 પર કૉલ કરો.'}
              </p>
            </div>
          </>
        )}
      </main>

      {/* Official Government Footer */}
      <NationalGovFooter lang={lang} />
    </div>
  );
}
