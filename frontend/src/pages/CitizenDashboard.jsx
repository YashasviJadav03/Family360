import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, CheckCircle2, AlertCircle, ArrowLeft, Send,
  IndianRupee, MapPin, Building2, QrCode, Clock, ShieldCheck,
  FileText, MessageSquare, X, Check
} from 'lucide-react';
import NationalGovHeader from '../components/NationalGovHeader';
import NationalGovFooter from '../components/NationalGovFooter';
import WelfareDossierModal from '../components/WelfareDossierModal';
import { familyApi, applicationApi } from '../api/client';

export default function CitizenDashboard() {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [gapReport, setGapReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [appliedSchemes, setAppliedSchemes] = useState({});
  const [dossierOpen, setDossierOpen] = useState(false);
  const [grievanceOpen, setGrievanceOpen] = useState(false);
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

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
      const res = await applicationApi.createApplication({
        family_id: family.family_id,
        member_id: family.members?.[0]?.member_id,
        scheme_id: scheme.scheme_id,
      });
      setAppliedSchemes((prev) => ({
        ...prev,
        [scheme.scheme_id]: {
          app_id: res.application_id || 'APP-2026-SUBMITTED',
          scheme_name: scheme.scheme_name,
          status: 'SUBMITTED',
          date: new Date().toLocaleDateString('en-IN')
        }
      }));
    } catch (err) {
      console.error(err);
      alert('Could not submit application. Please try again.');
    }
  };

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceSubmitted(false);
      setGrievanceOpen(false);
      setGrievanceText('');
    }, 2500);
  };

  const existingApplications = family?.applications || [];
  const hasAnyApplications = existingApplications.length > 0 || Object.keys(appliedSchemes).length > 0;

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
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6" id="main-content">
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-navy bg-navy-subtle px-2 py-0.5 rounded">
              {familyId}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="card-dpi p-16 text-center bg-white border border-slate-200">
            <div className="w-8 h-8 border-2 border-navy border-t-[#FF671F] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-secondary">
              {lang === 'en'
                ? 'Fetching verified civil registry records...'
                : lang === 'hi'
                ? 'नागरिक रिकॉर्ड प्राप्त किए जा रहे हैं...'
                : 'પરિવારની કલ્યાણકારી વિગતો લોડ થઈ રહી છે...'}
            </p>
          </div>
        ) : error || !family ? (
          <div className="card-dpi p-8 bg-white text-center border border-slate-200">
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
            <div className="card-dpi p-6 bg-white border border-slate-border shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-navy mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {lang === 'en'
                    ? 'Civil Supplies Registry Verified'
                    : lang === 'hi'
                    ? 'नागरिक आपूर्ति रजिस्ट्री द्वारा सत्यापित'
                    : 'અન્ન અને નાગરિક પુરવઠા વિભાગ ચકાસાયેલ'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-[11px]">
                    Ration Card: <strong className="text-slate-800">{family.ration_card_id || 'Not linked'}</strong>
                  </span>
                  <button
                    onClick={() => setDossierOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-navy bg-navy/10 hover:bg-navy/20 border border-navy/20 transition-colors shadow-xs"
                    title="View Digital Family ID Parcha"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#FF671F]" />
                    <span>
                      {lang === 'en' ? 'Digital ID Card' : lang === 'hi' ? 'डिजिटल आईडी कार्ड' : 'ડિજિટલ ઓળખ કાર્ડ'}
                    </span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy">
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
                <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-800">
                  {family.social_category}
                </span>
              </div>
            </div>

            {/* 2 Key Status Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-dpi p-4 bg-emerald-50/70 border border-emerald-300">
                <span className="text-[11px] font-bold text-emerald-900 block uppercase tracking-wider">
                  {lang === 'en' ? 'Active Entitlements' : lang === 'hi' ? 'सक्रिय योजना लाभ' : 'ચાલુ સહાય'}
                </span>
                <span className="text-2xl font-black font-mono text-emerald-900 mt-1 block">
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

              <div className="card-dpi p-4 bg-amber-50/80 border-2 border-amber-300">
                <span className="text-[11px] font-bold text-amber-900 block uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'en' ? 'Eligible to Apply' : lang === 'hi' ? 'पात्र एवं आवेदन योग्य' : 'મળી શકે તેવા લાભો'}
                </span>
                <span className="text-2xl font-black font-mono text-amber-900 mt-1 block">
                  {gapReport?.gap_schemes?.length || 0}
                </span>
                <span className="text-[11px] text-amber-800 mt-0.5 block font-medium">
                  {lang === 'en'
                    ? 'Potential benefit gaps identified'
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

                        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {lang === 'en'
                              ? 'Verified against income and category criteria'
                              : lang === 'hi'
                              ? 'आय और श्रेणी मानदंडों के अनुसार सत्यापित'
                              : 'આવક અને જાતિ માપદંડ પૂર્ણ થયેલ છે'}
                          </span>

                          {isApplied ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isApplied.app_id}</span>
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">Submitted</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApply(scheme)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold text-white bg-[#FF671F] hover:bg-[#E65100] transition-colors shadow-sm"
                            >
                              <Send className="w-3 h-3" />
                              <span>
                                {lang === 'en'
                                  ? '1-Click Direct Apply'
                                  : lang === 'hi'
                                  ? '1-क्लिक त्वरित आवेदन'
                                  : '૧-ક્લિક સીધી અરજી'}
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

            {/* SECTION 2: Application Status & Tracking Timeline */}
            {hasAnyApplications && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1.5 border-b-2 border-blue-400">
                  <h2 className="text-sm font-bold text-navy flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>
                      {lang === 'en'
                        ? 'Application Tracking & Verification Status'
                        : lang === 'hi'
                        ? 'आवेदन स्थिति एवं सत्यापन प्रगति'
                        : 'અરજી ટ્રેકિંગ અને ચકાસણી સ્થિતિ'}
                    </span>
                  </h2>
                  <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Taluka Panchayat Queue
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Newly submitted applications */}
                  {Object.entries(appliedSchemes).map(([schemeId, appInfo]) => (
                    <div key={schemeId} className="card-dpi p-4 bg-white border border-blue-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-navy bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {appInfo.app_id}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                          SUBMITTED · In Queue
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{appInfo.scheme_name || schemeId}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Submitted: {appInfo.date}</span>
                        <span>·</span>
                        <span>Assigned to: Taluka Development Officer</span>
                      </div>
                    </div>
                  ))}

                  {/* Pre-existing applications from database */}
                  {existingApplications.map((app) => (
                    <div key={app.application_id} className="card-dpi p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-navy bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {app.application_id}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900' :
                          app.status === 'REJECTED' ? 'bg-rose-100 text-rose-900' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{app.scheme_id}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Officer: {app.assigned_officer || 'District Social Welfare Office'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: Currently Received Benefits */}
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

            {/* Institutional Helpdesk & Grievance Card */}
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-secondary space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Building2 className="w-4 h-4 text-navy" />
                  {lang === 'en'
                    ? 'Official Grievance & Verification Contact'
                    : lang === 'hi'
                    ? 'आधिकारिक सहायता एवं संपर्क केंद्र'
                    : 'સહાય અને ચકાસણી માટે સંપર્ક'}
                </p>
                <button
                  onClick={() => setGrievanceOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-navy hover:text-[#FF671F] underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'en' ? 'Request Data Correction' : lang === 'hi' ? 'विवरण सुधार अनुरोध' : 'વિગત સુધારણા વિનંતી'}
                  </span>
                </button>
              </div>
              <p className="leading-relaxed">
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

      {/* Official Welfare Dossier Modal for Citizens */}
      <WelfareDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        family={family}
        gapReport={gapReport}
        mode="citizen"
      />

      {/* Citizen Grievance / Correction Modal */}
      {grievanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#FF671F]" />
                <span>
                  {lang === 'en' ? 'Submit Correction / Grievance' : lang === 'hi' ? 'सुधार अथवा शिकायत दर्ज करें' : 'સુધારણા અથવા ફરિયાદ નોંધાવો'}
                </span>
              </h3>
              <button onClick={() => setGrievanceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {grievanceSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold text-emerald-900">Grievance Docket Created: GRV-GJ-2026-0812</p>
                <p className="text-emerald-700">Forwarded to Taluka Development Officer for review.</p>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Specify any incorrect demographic details (e.g. member missing, annual income update, or caste certificate re-verification).
                </p>
                <textarea
                  rows={3}
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  placeholder="Describe the discrepancy..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-navy text-slate-800"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGrievanceOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-navy hover:bg-navy-dark rounded-md transition-colors"
                  >
                    Submit Docket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
