import React, { useState, useEffect } from 'react';
import {
  Bot, Volume2, VolumeX, Play, Pause, RotateCcw, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, MapPin, Users, IndianRupee, Home, Shield,
  Printer, X, Plus, Trash2, Award, ExternalLink
} from 'lucide-react';
import { evaluate20Schemes, SCHEMES_20 } from '../utils/schemes20Engine';

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad'
];

export default function CivicCopilotModal({ isOpen = true, onClose = () => {} }) {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'gu'
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Intake State
  const [district, setDistrict] = useState('Ahmedabad');
  const [areaType, setAreaType] = useState('Rural'); // 'Rural' | 'Urban'
  const [members, setMembers] = useState([
    { id: 1, name: 'Head of Family', relation: 'Head', gender: 'Male', age: 48, student: false, disability: false, disabilityPct: 0 },
    { id: 2, name: 'Spouse', relation: 'Spouse', gender: 'Female', age: 45, student: false, disability: false, disabilityPct: 0 },
    { id: 3, name: 'Elder Child', relation: 'Daughter', gender: 'Female', age: 19, student: true, disability: false, disabilityPct: 0 },
  ]);
  const [annualIncome, setAnnualIncome] = useState(140000);
  const [socialCategory, setSocialCategory] = useState('SC');
  const [dwellingType, setDwellingType] = useState('Kutcha'); // 'Kutcha' | 'Pucca' | 'Rented'
  const [landAcres, setLandAcres] = useState(0);

  // New member draft for step 3
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState('Son');
  const [newMemberGender, setNewMemberGender] = useState('Male');
  const [newMemberAge, setNewMemberAge] = useState(12);

  // Web Speech API Voice Synthesis (TTS)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'gu') {
      utterance.lang = 'gu-IN';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Trigger TTS voice readout on step change
  useEffect(() => {
    const stepPrompts = {
      1: {
        en: 'Welcome to the Gujarat Family ID Welfare Copilot. Please select your preferred language.',
        hi: 'गुजरात परिवार पहचान कल्याण कोपायलट में आपका स्वागत है। कृपया अपनी पसंदीदा भाषा चुनें।',
        gu: 'ગુજરાત ફેમિલી આઈડી કલ્યાણ સહાયકમાં આપનું સ્વાગત છે. કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો.'
      },
      2: {
        en: 'Step 2: Tell us your district and whether you reside in a Rural Gram Panchayat or Urban area.',
        hi: 'चरण 2: हमें अपना जिला बताएं और क्या आप ग्रामीण पंचायत या शहरी क्षेत्र में रहते हैं।',
        gu: 'પગલું ૨: તમારો જિલ્લો અને ગ્રામ પંચાયત અથવા શહેરી વિસ્તાર પસંદ કરો.'
      },
      3: {
        en: 'Step 3: Add your household members, their ages, genders, and educational status.',
        hi: 'चरण 3: अपने परिवार के सदस्यों, उनकी आयु, लिंग और शिक्षा की जानकारी जोड़ें।',
        gu: 'પગલું ૩: તમારા કુટુંબના સભ્યો, તેમની ઉંમર, જાતિ અને અભ્યાસ વિગતો ઉમેરો.'
      },
      4: {
        en: 'Step 4: Select your approximate annual household income and social category.',
        hi: 'चरण 4: अपनी अनुमानित वार्षिक पारिवारिक आय और सामाजिक श्रेणी चुनें।',
        gu: 'પગલું ૪: તમારી અંદાજિત વાર્ષિક આવક અને સામાજિક કેટેગરી પસંદ કરો.'
      },
      5: {
        en: 'Step 5: Provide details regarding your dwelling structure and landholding.',
        hi: 'चरण 5: अपने घर के प्रकार और भूमि स्वामित्व की जानकारी दें।',
        gu: 'પગલું ૫: તમારા મકાનનો પ્રકાર અને જમીનની વિગત આપો.'
      },
      6: {
        en: 'Analysis complete! Here is your personalized Gujarat Welfare Action Plan with all qualified schemes.',
        hi: 'विश्लेषण पूर्ण हुआ! यहां आपकी सभी पात्र योजनाओं का व्यक्तिगत कल्याण कार्य योजना है।',
        gu: 'વિશ્લેષણ પૂર્ણ થયું! તમારા કુટુંબ માટે મંજૂર થયેલી તમામ સરકારી સહાય યોજનાઓની યાદી તૈયાર છે.'
      }
    };

    const prompt = stepPrompts[step]?.[lang] || stepPrompts[step]?.en;
    if (prompt) {
      speakText(prompt);
    }

    return () => {
      stopSpeaking();
    };
  }, [step, lang]);

  // Construct synthetic family object for evaluation
  const evaluatedResults = React.useMemo(() => {
    const familyPayload = {
      family_id: 'COPILOT-PROSPECT',
      district,
      annual_income: annualIncome,
      social_category: socialCategory,
      housing_status: dwellingType,
      family_size: members.length
    };

    const memberPayloads = members.map((m) => ({
      member_id: `CP-M${m.id}`,
      name: m.name,
      relation_to_head: m.relation,
      gender: m.gender,
      age: m.age,
      dob: `1990-01-01`,
      student_status: m.student,
      education_level: m.age >= 18 ? 'Graduate' : (m.age >= 6 ? 'Primary' : 'None'),
      disability_status: m.disability,
      disability_percentage: m.disabilityPct,
      occupation: m.age >= 18 ? 'Worker' : (m.student ? 'Student' : 'Child')
    }));

    return evaluate20Schemes(familyPayload, memberPayloads);
  }, [district, annualIncome, socialCategory, dwellingType, members]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newMemberName.trim(),
        relation: newMemberRel,
        gender: newMemberGender,
        age: Number(newMemberAge),
        student: Number(newMemberAge) >= 6 && Number(newMemberAge) <= 22,
        disability: false,
        disabilityPct: 0
      }
    ]);
    setNewMemberName('');
    setNewMemberAge(10);
  };

  const handleRemoveMember = (id) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-3xl w-full overflow-hidden my-6 text-slate-800 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-navy via-[#0F3254] to-navy text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center font-bold text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif tracking-tight">
                Gujarat Civic Welfare Copilot & Intake Assistant
              </h3>
              <p className="text-xs text-slate-300">
                Voice-Enabled 5-Step Civic Discovery · એક કુટુંબ, એક ઓળખ, સર્વાંગી કલ્યાણ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Control Button */}
            <button
              onClick={() => (isSpeaking ? stopSpeaking() : speakText('Audio guidance active.'))}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                isSpeaking
                  ? 'bg-amber-400 text-navy border-amber-300 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={isSpeaking ? 'Mute Voice' : 'Listen Guidance'}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 text-navy" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Speaking' : 'TTS Voice'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Stepper Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold shrink-0">
          {[
            { num: 1, label: 'Language' },
            { num: 2, label: 'Geography' },
            { num: 3, label: 'Household Roster' },
            { num: 4, label: 'Socioeconomics' },
            { num: 5, label: 'Dwelling' },
            { num: 6, label: 'Welfare Roadmap' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-navy font-bold'
                  : step > s.num
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                step === s.num
                  ? 'bg-navy text-white'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden md:inline text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable Step Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: LANGUAGE PREFERENCE */}
          {step === 1 && (
            <div className="space-y-4 max-w-lg mx-auto text-center py-4">
              <h4 className="text-lg font-bold font-serif text-navy">
                Select Your Language / ભાષા પસંદ કરો / भाषा चुनें
              </h4>
              <p className="text-xs text-slate-600">
                Choose your preferred language for the conversational intake and voice audio readout.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { code: 'en', label: 'English', sub: 'Default' },
                  { code: 'gu', label: 'ગુજરાતી', sub: 'Gujarati' },
                  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      lang === l.code
                        ? 'border-[#FF671F] bg-amber-50/50 text-navy font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-bold block">{l.label}</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: GEOGRAPHY & JURISDICTION */}
          {step === 2 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <h4 className="text-base font-bold text-navy">
                  Administrative Jurisdiction in Gujarat
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Scheme eligibility rules and local nodal offices depend on your district and rural/urban classification.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Gujarat District (33 Districts):
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  {GUJARAT_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Locality Type:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAreaType('Rural')}
                    className={`p-3 rounded-xl border-2 text-center text-xs transition-all ${
                      areaType === 'Rural'
                        ? 'border-navy bg-navy/5 text-navy font-bold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    🏡 Rural Gram Panchayat
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaType('Urban')}
                    className={`p-3 rounded-xl border-2 text-center text-xs transition-all ${
                      areaType === 'Urban'
                        ? 'border-navy bg-navy/5 text-navy font-bold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    🏢 Urban Municipality / Nagarpalika
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HOUSEHOLD ROSTER BUILDER */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-navy">
                  Household Roster Builder ({members.length} Members)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Add all living household members. Age, student status, and gender determine targeted pensions and scholarships.
                </p>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {m.relation} · {m.gender} · Age {m.age} {m.student && '· Student'} {m.disability && `· Divyang (${m.disabilityPct}%)`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMembers((prev) =>
                            prev.map((item) =>
                              item.id === m.id ? { ...item, disability: !item.disability, disabilityPct: !item.disability ? 70 : 0 } : item
                            )
                          );
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          m.disability ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-white text-slate-600'
                        }`}
                      >
                        {m.disability ? 'Divyang (60%+)' : '+ Disability'}
                      </button>

                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Member Mini-Form */}
              <form onSubmit={handleAddMember} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-navy block">+ Add Another Family Member:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg sm:col-span-2"
                  />
                  <select
                    value={newMemberRel}
                    onChange={(e) => setNewMemberRel(e.target.value)}
                    className="px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Son">Son (પુત્ર)</option>
                    <option value="Daughter">Daughter (પુત્રી)</option>
                    <option value="Father">Father (પિતા)</option>
                    <option value="Mother">Mother (માતા)</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Age"
                    value={newMemberAge}
                    onChange={(e) => setNewMemberAge(e.target.value)}
                    className="px-2 py-2 border border-slate-300 rounded-lg text-center"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-navy hover:bg-navy-dark text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Family Roster</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: SOCIOECONOMIC CLASSIFICATION */}
          {step === 4 && (
            <div className="space-y-5 max-w-lg mx-auto">
              <div>
                <h4 className="text-base font-bold text-navy">
                  Socioeconomic Classification & Income Band
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Welfare ceilings in Gujarat are indexed by annual household income and social reservation categories.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>Annual Household Income:</span>
                  <span className="font-mono text-base font-extrabold text-navy">
                    ₹{annualIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="600000"
                  step="5000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full accent-navy"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹15,000 (AAY Ultra-Poor)</span>
                  <span>₹1,50,000 (BPL Ceiling)</span>
                  <span>₹6,00,000 (LIG)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Social Category:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['General', 'OBC', 'SC', 'ST'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSocialCategory(cat)}
                      className={`p-2.5 rounded-xl border-2 text-center text-xs transition-all ${
                        socialCategory === cat
                          ? 'border-navy bg-navy/5 text-navy font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DWELLING & LANDHOLDING */}
          {step === 5 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <h4 className="text-base font-bold text-navy">
                  Dwelling Type & Landholding Assessment
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  PMAY housing subsidies and agricultural subsidies evaluate shelter condition and land acreage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Shelter / House Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Kutcha', label: 'Kutcha (કાચું મકાન)' },
                    { id: 'Pucca', label: 'Pucca (પાકું મકાન)' },
                    { id: 'Rented', label: 'Rented / None (ભાડે)' },
                  ].map((dw) => (
                    <button
                      key={dw.id}
                      type="button"
                      onClick={() => setDwellingType(dw.id)}
                      className={`p-3 rounded-xl border-2 text-center text-xs transition-all ${
                        dwellingType === dw.id
                          ? 'border-navy bg-navy/5 text-navy font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {dw.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PERSONALIZED WELFARE ACTION PLAN */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-lg font-bold font-serif text-navy flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Personalized Gujarat Welfare Action Plan</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Based on your verified household roster and income profile, you qualify for <strong>{evaluatedResults.count} state welfare programs</strong>.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                    Total Estimated Annual Support
                  </span>
                  <span className="text-xl font-extrabold text-emerald-800 font-mono">
                    ₹{evaluatedResults.totalAnnualValue.toLocaleString('en-IN')} / yr
                  </span>
                </div>
              </div>

              {/* Schemes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {evaluatedResults.qualified.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-950">
                          {q.scheme.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-mono font-bold">
                          {q.scheme.domain}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-1">
                        {q.scheme.benefit}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-600 space-y-0.5">
                        <div>Beneficiary: <strong>{q.beneficiaryName}</strong></div>
                        <div>Nodal Office: {q.scheme.nodalCenter}</div>
                        <div>Portal: {q.scheme.digitalPortal}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                      <span className="font-mono font-extrabold text-emerald-900">
                        ₹{q.monthlyValue.toLocaleString('en-IN')} / mo
                      </span>
                      <a
                        href="https://digitalgujarat.gov.in"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-navy hover:underline flex items-center gap-1"
                      >
                        <span>Apply Online</span>
                        <ExternalLink className="w-3 h-3 text-[#FF671F]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-200" />
                <span>Print Roadmap Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
