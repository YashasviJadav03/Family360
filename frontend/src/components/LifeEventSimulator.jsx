import React, { useState, useMemo } from 'react';
import {
  Sparkles, Baby, UserCheck, HeartHandshake, Skull, HeartPulse,
  TrendingDown, TrendingUp, GraduationCap, School, Undo2, ArrowRight,
  CheckCircle2, AlertTriangle, AlertCircle, IndianRupee, Shield, Clock,
  ChevronRight, Calendar, User, Info, RefreshCw, X, Play
} from 'lucide-react';
import { evaluate20Schemes, calculateMemberAge, SCHEMES_20 } from '../utils/schemes20Engine';

// The 11 canonical Life Event Transitions
export const LIFE_EVENTS = [
  {
    id: 'new_child_born',
    icon: Baby,
    title: 'New Child Born',
    titleGu: 'બાળકનો જન્મ (કન્યા/પુત્ર)',
    titleHi: 'नवजात शिशु का जन्म',
    badge: 'Maternity & Child Grants',
    color: 'pink',
    desc: 'Welcomes a newborn into the household roster, immediately evaluating Vahli Dikri girl-child bonds, maternity grants, and nutritional subsidies.',
    requiresMember: false,
    fields: ['child_name', 'child_gender']
  },
  {
    id: 'member_turns_18',
    icon: UserCheck,
    title: 'Member Turns 18 (Adult)',
    titleGu: 'સભ્ય ૧૮ વર્ષ પુખ્ત વય',
    titleHi: 'सदस्य 18 वर्ष (वयस्क)',
    badge: 'Higher Edu & Skills',
    color: 'blue',
    desc: 'Transitions minors into legal adulthood, unlocking adult vocational training (PMKVY), higher education scholarships, and civic entitlements.',
    requiresMember: true,
    memberFilter: (m) => (m.age ?? calculateMemberAge(m.dob)) >= 15 && (m.age ?? calculateMemberAge(m.dob)) < 18
  },
  {
    id: 'member_turns_60',
    icon: HeartHandshake,
    title: 'Member Turns 60 (Senior Citizen)',
    titleGu: 'વરિષ્ઠ નાગરિક (૬૦+ વર્ષ)',
    titleHi: 'सदस्य 60 वर्ष (वरिष्ठ नागरिक)',
    badge: 'Old-Age Pensions',
    color: 'amber',
    desc: 'Flags senior citizenship entry, automatically qualifying elders for Vridh Sahay state old-age pension without visiting government offices.',
    requiresMember: true,
    memberFilter: (m) => (m.age ?? calculateMemberAge(m.dob)) >= 50 && (m.age ?? calculateMemberAge(m.dob)) < 60
  },
  {
    id: 'marital_status_widowed',
    icon: HeartPulse,
    title: 'Marital Status → Widowed',
    titleGu: 'વૈવાહિક સ્થિતિ: ગંગા સ્વરૂપા (વિધવા)',
    titleHi: 'वैवाहिक स्थिति: विधवा (गंगा स्वरूपा)',
    badge: 'Widow Social Security',
    color: 'purple',
    desc: 'Records spousal bereavement for a married woman to activate Ganga Swaroopa monthly widow pension and single-mother aids.',
    requiresMember: true,
    memberFilter: (m) => (m.gender || '').toLowerCase() === 'female' && (m.age ?? calculateMemberAge(m.dob)) >= 18 && !m.is_widowed
  },
  {
    id: 'breadwinner_death',
    icon: Skull,
    title: 'Death of Primary Breadwinner',
    titleGu: 'કુટુંબના મુખ્ય કમાનારનું અવસાન',
    titleHi: 'मुख्य कमाने वाले का निधन',
    badge: 'NFBS Bereavement Grant',
    color: 'rose',
    desc: 'Flags death of household head, triggering immediate one-time ₹20,000 NFBS bereavement grant and updating surviving spouse status.',
    requiresMember: true,
    memberFilter: (m) => (m.relation_to_head || '').toLowerCase() === 'head' && !m.is_deceased
  },
  {
    id: 'disability_recorded',
    icon: AlertTriangle,
    title: 'Disability Certification (60%+)',
    titleGu: 'દિવ્યાંગતા પ્રમાણપત્ર (૬૦%+ સાધન સહાય)',
    titleHi: 'दिव्यांगता प्रमाणीकरण (60%+)',
    badge: 'Sant Surdas Pension',
    color: 'orange',
    desc: 'Records medical disability certification and percentage, unlocking Sant Surdas monthly disability pension and specialized aids.',
    requiresMember: true,
    memberFilter: (m) => !m.disability_status
  },
  {
    id: 'income_decreased',
    icon: TrendingDown,
    title: 'Income Shock / Crop Loss (-40%)',
    titleGu: 'આવકમાં ઘટાડો / કુદરતી નુકસાન',
    titleHi: 'आय में गिरावट / सूखा / नुकसान',
    badge: 'Poverty Band Drop & AAY Rations',
    color: 'red',
    desc: 'Models sudden economic hardship, recalculating household poverty band (AAY / PHH) and unlocking emergency subsidized rations.',
    requiresMember: false
  },
  {
    id: 'income_increased',
    icon: TrendingUp,
    title: 'Upward Income Mobility (+50%)',
    titleGu: 'આર્થિક સમૃદ્ધિ / આવકમાં વૃદ્ધિ',
    titleHi: 'आय में वृद्धि (+50%)',
    badge: 'Scheme Graduation Check',
    color: 'emerald',
    desc: 'Simulates household income increases to test scheme graduation thresholds and ensure transparent compliance.',
    requiresMember: false
  },
  {
    id: 'child_starts_school',
    icon: School,
    title: 'Child Starts School (Class 1)',
    titleGu: 'બાળક શાળા પ્રવેશ (ધોરણ ૧)',
    titleHi: 'बच्चे का स्कूल में प्रवेश',
    badge: 'Pre-Matric & Retention Grants',
    color: 'teal',
    desc: 'Enrolls school-age children (age 6+) into primary education, unlocking Pre-Matric SC/ST scholarships and Kanya Kelavni grants.',
    requiresMember: true,
    memberFilter: (m) => (m.age ?? calculateMemberAge(m.dob)) >= 5 && (m.age ?? calculateMemberAge(m.dob)) <= 14 && !m.student_status
  },
  {
    id: 'child_starts_college',
    icon: GraduationCap,
    title: 'Youth Enrolls in College / Degree',
    titleGu: 'કોલેજ / ડિપ્લોમા અભ્યાસ પ્રવેશ',
    titleHi: 'कॉलेज / डिग्री में प्रवेश',
    badge: 'Post-Matric & Fee Waivers',
    color: 'indigo',
    desc: 'Marks higher secondary completion, unlocking full tuition fee waivers, technical stipends, and Post-Matric scholarships.',
    requiresMember: true,
    memberFilter: (m) => (m.age ?? calculateMemberAge(m.dob)) >= 17 && (m.age ?? calculateMemberAge(m.dob)) <= 25 && m.education_level !== 'Graduate'
  },
  {
    id: 'pregnancy_recorded',
    icon: HeartPulse,
    title: 'Maternal Pregnancy Recorded',
    titleGu: 'સગર્ભાવસ્થા નોંધણી (માતૃત્વ પોષણ)',
    titleHi: 'गर्भावस्था पंजीकरण (मातृत्व सुरक्षा)',
    badge: 'Janani Suraksha Cash Aid',
    color: 'cyan',
    desc: 'Enrolls expectant mothers into institutional delivery financial support under Janani Suraksha Yojana with ASHA assistance.',
    requiresMember: true,
    memberFilter: (m) => (m.gender || '').toLowerCase() === 'female' && (m.age ?? calculateMemberAge(m.dob)) >= 18 && (m.age ?? calculateMemberAge(m.dob)) <= 45 && !m.is_pregnant
  }
];

export default function LifeEventSimulator({
  family = {},
  members = [],
  preselectedMemberId = null,
  onClose = null,
  lang = 'en'
}) {
  // Baseline state (immutable copy)
  const initialFamily = useMemo(() => JSON.parse(JSON.stringify(family)), [family]);
  const initialMembers = useMemo(() => JSON.parse(JSON.stringify(members)), [members]);

  // Current simulated state
  const [simFamily, setSimFamily] = useState(initialFamily);
  const [simMembers, setSimMembers] = useState(initialMembers);

  // Active selected life event for configuration
  const [selectedEventId, setSelectedEventId] = useState(LIFE_EVENTS[0].id);
  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [customChildName, setCustomChildName] = useState('Pooja');
  const [customChildGender, setCustomChildGender] = useState('Female');
  const [customDisabilityPct, setCustomDisabilityPct] = useState(70);

  // Audit history trail
  const [auditLog, setAuditLog] = useState([]);
  const [validationError, setValidationError] = useState('');

  // Active event object
  const activeEvent = LIFE_EVENTS.find((e) => e.id === selectedEventId) || LIFE_EVENTS[0];

  // Eligible members for active event
  const eligibleMembers = useMemo(() => {
    if (!activeEvent.requiresMember) return [];
    if (!activeEvent.memberFilter) return simMembers.filter((m) => !m.is_deceased);
    return simMembers.filter(activeEvent.memberFilter);
  }, [activeEvent, simMembers]);

  // Auto-select first eligible member when event changes
  useMemo(() => {
    if (activeEvent.requiresMember) {
      if (preselectedMemberId && eligibleMembers.some((m) => m.member_id === preselectedMemberId)) {
        setSelectedMemberId(preselectedMemberId);
      } else if (eligibleMembers.length > 0) {
        setSelectedMemberId(eligibleMembers[0].member_id);
      } else {
        setSelectedMemberId('');
      }
    }
  }, [selectedEventId, eligibleMembers, preselectedMemberId]);

  // Evaluate baseline vs simulated states using the 20 declarative welfare schemes engine
  const baselineEval = useMemo(() => evaluate20Schemes(initialFamily, initialMembers), [initialFamily, initialMembers]);
  const simulatedEval = useMemo(() => evaluate20Schemes(simFamily, simMembers), [simFamily, simMembers]);

  // Compute Granular Eligibility Diff
  const eligibilityDiff = useMemo(() => {
    const baselineIds = new Set(baselineEval.qualified.map((q) => `${q.scheme.id}_${q.beneficiaryMemberId || 'FAM'}`));
    const simulatedIds = new Set(simulatedEval.qualified.map((q) => `${q.scheme.id}_${q.beneficiaryMemberId || 'FAM'}`));

    const gained = simulatedEval.qualified.filter((q) => !baselineIds.has(`${q.scheme.id}_${q.beneficiaryMemberId || 'FAM'}`));
    const lost = baselineEval.qualified.filter((q) => !simulatedIds.has(`${q.scheme.id}_${q.beneficiaryMemberId || 'FAM'}`));
    const unchanged = simulatedEval.qualified.filter((q) => baselineIds.has(`${q.scheme.id}_${q.beneficiaryMemberId || 'FAM'}`));

    const netMonthlyDelta = simulatedEval.monthlyFinancialSupport - baselineEval.monthlyFinancialSupport;
    const netAnnualDelta = simulatedEval.totalAnnualValue - baselineEval.totalAnnualValue;

    return { gained, lost, unchanged, netMonthlyDelta, netAnnualDelta };
  }, [baselineEval, simulatedEval]);

  // Apply Life Event Transition
  const applyEvent = () => {
    setValidationError('');
    const targetMember = simMembers.find((m) => m.member_id === selectedMemberId);

    let updatedFamily = { ...simFamily };
    let updatedMembers = [...simMembers];
    let eventDescription = '';

    switch (selectedEventId) {
      case 'new_child_born': {
        const newMemberId = `GJ-M${String(updatedMembers.length + 5000).padStart(6, '0')}`;
        const newChild = {
          member_id: newMemberId,
          family_id: updatedFamily.family_id,
          name: `${customChildName} ${updatedFamily.head_name?.split(' ')[1] || 'Patel'}`,
          dob: new Date().toISOString().split('T')[0],
          age: 0,
          gender: customChildGender,
          relation_to_head: 'Daughter',
          education_level: 'None',
          student_status: false,
          occupation: 'Infant',
          disability_status: false
        };
        updatedMembers.push(newChild);
        updatedFamily.family_size = (updatedFamily.family_size || updatedMembers.length - 1) + 1;
        eventDescription = `Welcomed newborn child ${newChild.name} (${customChildGender}). Family size now ${updatedFamily.family_size}.`;
        break;
      }

      case 'member_turns_18': {
        if (!targetMember) {
          setValidationError('Please select an adolescent family member to turn 18.');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return {
              ...m,
              age: 18,
              dob: '2008-01-15',
              education_level: m.education_level === 'None' ? 'HigherSecondary' : m.education_level,
              student_status: true
            };
          }
          return m;
        });
        eventDescription = `${targetMember.name} celebrated 18th birthday. Adult educational rights unlocked.`;
        break;
      }

      case 'member_turns_60': {
        if (!targetMember) {
          setValidationError('Please select an adult family member approaching age 60.');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return {
              ...m,
              age: 60,
              dob: '1966-02-10',
              occupation: 'Senior Citizen'
            };
          }
          return m;
        });
        eventDescription = `${targetMember.name} turned 60 years old. Eligible for Old-Age Senior Citizen Welfare.`;
        break;
      }

      case 'marital_status_widowed': {
        if (!targetMember) {
          setValidationError('Please select a married female member.');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return { ...m, marital_status: 'Widowed', is_widowed: true };
          }
          return m;
        });
        eventDescription = `Marital status update: ${targetMember.name} recorded as Widowed. Social protection active.`;
        break;
      }

      case 'breadwinner_death': {
        if (!targetMember) {
          setValidationError('Please select head of household.');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return { ...m, is_deceased: true, occupation: 'Deceased' };
          }
          if ((m.relation_to_head || '').toLowerCase() === 'spouse') {
            return { ...m, relation_to_head: 'Head', marital_status: 'Widowed', is_widowed: true };
          }
          return m;
        });
        eventDescription = `Primary breadwinner death recorded for ${targetMember.name}. NFBS bereavement benefit activated.`;
        break;
      }

      case 'disability_recorded': {
        if (!targetMember) {
          setValidationError('Please select a member for disability certification.');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return {
              ...m,
              disability_status: true,
              disability_percentage: Number(customDisabilityPct)
            };
          }
          return m;
        });
        eventDescription = `Certified ${customDisabilityPct}% disability recorded for ${targetMember.name}. Sant Surdas assistance unlocked.`;
        break;
      }

      case 'income_decreased': {
        const oldIncome = updatedFamily.annual_income || 120000;
        const newIncome = Math.max(12000, Math.round(oldIncome * 0.55));
        updatedFamily.annual_income = newIncome;
        eventDescription = `Annual income adjusted from ₹${oldIncome.toLocaleString('en-IN')} to ₹${newIncome.toLocaleString('en-IN')} (Economic Shock).`;
        break;
      }

      case 'income_increased': {
        const oldIncome = updatedFamily.annual_income || 120000;
        const newIncome = Math.round(oldIncome * 1.5);
        updatedFamily.annual_income = newIncome;
        eventDescription = `Annual income increased to ₹${newIncome.toLocaleString('en-IN')} (+50% mobility).`;
        break;
      }

      case 'child_starts_school': {
        if (!targetMember) {
          setValidationError('Please select an eligible child (age 5-14).');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return { ...m, student_status: true, education_level: 'Primary', age: Math.max(6, m.age || 6) };
          }
          return m;
        });
        eventDescription = `${targetMember.name} enrolled in Primary School. Pre-matric scholarship criteria active.`;
        break;
      }

      case 'child_starts_college': {
        if (!targetMember) {
          setValidationError('Please select an adolescent member (age 17+).');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return { ...m, student_status: true, education_level: 'Graduate', age: Math.max(18, m.age || 18) };
          }
          return m;
        });
        eventDescription = `${targetMember.name} enrolled in Higher Secondary / College. Post-matric benefits ready.`;
        break;
      }

      case 'pregnancy_recorded': {
        if (!targetMember) {
          setValidationError('Please select an eligible female member (age 18-45).');
          return;
        }
        updatedMembers = updatedMembers.map((m) => {
          if (m.member_id === targetMember.member_id) {
            return { ...m, is_pregnant: true, maternal_status: 'Pregnant' };
          }
          return m;
        });
        eventDescription = `Maternal pregnancy registered for ${targetMember.name}. Janani Suraksha cash aid unlocked.`;
        break;
      }

      default:
        break;
    }

    // Update state
    setSimFamily(updatedFamily);
    setSimMembers(updatedMembers);

    // Record audit log
    const logItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventId: selectedEventId,
      eventTitle: activeEvent.title,
      description: eventDescription,
    };
    setAuditLog((prev) => [logItem, ...prev]);
  };

  // Rollback to original baseline
  const resetToBaseline = () => {
    setSimFamily(initialFamily);
    setSimMembers(initialMembers);
    setAuditLog([]);
    setValidationError('');
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-navy shadow-xl overflow-hidden text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy via-[#0F3254] to-navy text-white px-5 py-4 border-b-2 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold font-serif tracking-tight text-white">
              Proactive Life Event Simulator & Entitlement Diffing Engine
            </h2>
          </div>
          <p className="text-xs text-slate-200 mt-0.5">
            Test real-world milestones (birth, senior citizenship, bereavement, schooling) and compute instant before-and-after welfare deltas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {auditLog.length > 0 && (
            <button
              onClick={resetToBaseline}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
              title="Revert all simulated life events back to true baseline"
            >
              <Undo2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Reset Baseline</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Controls vs Live Diff Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* ================================================================= */}
        {/* LEFT PANEL: 11 LIFE TRANSITION SELECTOR & CONFIGURATION (5 Cols) */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 p-5 space-y-5 bg-slate-50/70">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              1. Select Real-World Milestone ({LIFE_EVENTS.length} Transitions):
            </label>
            <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto pr-1 border border-slate-200 rounded-xl bg-white p-1.5 shadow-inner">
              {LIFE_EVENTS.map((event) => {
                const IconComponent = event.icon;
                const isSelected = selectedEventId === event.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setValidationError('');
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-navy text-white font-bold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md shrink-0 ${
                      isSelected ? 'bg-white/20 text-amber-300' : 'bg-slate-100 text-navy'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{event.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-amber-400 text-navy font-bold' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {event.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 font-normal ${
                        isSelected ? 'text-slate-200' : 'text-slate-500'
                      }`}>
                        {event.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Parameters for Selected Event */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Info className="w-4 h-4 text-navy shrink-0" />
              <span className="text-xs font-bold text-navy">
                Configure: {activeEvent.title}
              </span>
            </div>

            {/* Member picker if event requires targeted individual */}
            {activeEvent.requiresMember && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Family Member:
                </label>
                {eligibleMembers.length > 0 ? (
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-navy"
                  >
                    {eligibleMembers.map((m) => (
                      <option key={m.member_id} value={m.member_id}>
                        {m.name} ({m.relation_to_head || 'Member'}, Age {m.age ?? calculateMemberAge(m.dob)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      No members in this family currently match strict eligibility filters for this transition (e.g. biological age or gender).
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Custom newborn child fields */}
            {selectedEventId === 'new_child_born' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Child Name:
                  </label>
                  <input
                    type="text"
                    value={customChildName}
                    onChange={(e) => setCustomChildName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
                    placeholder="e.g. Pooja"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Gender:
                  </label>
                  <select
                    value={customChildGender}
                    onChange={(e) => setCustomChildGender(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Female">Female (Daughter)</option>
                    <option value="Male">Male (Son)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Custom disability percentage slider */}
            {selectedEventId === 'disability_recorded' && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Certified Disability Degree:</span>
                  <span className="font-mono font-bold text-navy">{customDisabilityPct}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={customDisabilityPct}
                  onChange={(e) => setCustomDisabilityPct(e.target.value)}
                  className="w-full accent-navy"
                />
              </div>
            )}

            {validationError && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </p>
            )}

            <button
              type="button"
              onClick={applyEvent}
              disabled={activeEvent.requiresMember && eligibleMembers.length === 0}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Simulate Transition & Re-Evaluate</span>
            </button>
          </div>

          {/* Audit History Timeline */}
          {auditLog.length > 0 && (
            <div className="border border-slate-200 rounded-xl bg-white p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Simulation Audit Trail ({auditLog.length} steps applied):
              </span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {auditLog.map((log) => (
                  <div key={log.id} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{log.timestamp}</span>
                      <span className="font-bold text-navy">{log.eventTitle}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">{log.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT PANEL: LIVE COMPARATIVE ELIGIBILITY DIFFING (7 Cols) */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 p-5 space-y-5 bg-white">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                Baseline Entitlements
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">
                {baselineEval.count} Schemes
              </span>
              <span className="text-[10px] text-slate-500">
                ₹{baselineEval.monthlyFinancialSupport.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                Simulated Entitlements
              </span>
              <span className="text-xl font-bold font-mono text-navy mt-0.5 block">
                {simulatedEval.count} Schemes
              </span>
              <span className="text-[10px] text-slate-500">
                ₹{simulatedEval.monthlyFinancialSupport.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${
              eligibilityDiff.netMonthlyDelta >= 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-[10px] uppercase font-bold block font-mono">
                Net Welfare Delta
              </span>
              <span className="text-xl font-bold font-mono mt-0.5 block">
                {eligibilityDiff.netMonthlyDelta >= 0 ? '+' : ''}₹{eligibilityDiff.netMonthlyDelta.toLocaleString('en-IN')}/mo
              </span>
              <span className="text-[10px] font-semibold">
                {eligibilityDiff.netAnnualDelta >= 0 ? '+' : ''}₹{eligibilityDiff.netAnnualDelta.toLocaleString('en-IN')} / year
              </span>
            </div>
          </div>

          {/* GAINED SCHEMES (New Opportunities) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>GAINED SCHEMES (Newly Qualified):</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +{eligibilityDiff.gained.length} New
              </span>
            </div>

            {eligibilityDiff.gained.length > 0 ? (
              <div className="space-y-2">
                {eligibilityDiff.gained.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-950">
                          {item.scheme.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-900">
                          {item.scheme.domain}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        {item.scheme.benefit}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-emerald-700 mt-1">
                        <span>Beneficiary: <strong>{item.beneficiaryName}</strong></span>
                        <span>·</span>
                        <span>Office: {item.scheme.nodalCenter}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-800 font-mono block">
                        +₹{item.monthlyValue.toLocaleString('en-IN')}/mo
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        +₹{item.annualValue.toLocaleString('en-IN')}/yr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No new schemes gained in current configuration. Apply a life event on the left.
              </div>
            )}
          </div>

          {/* LOST SCHEMES (Disqualified or Graduated) */}
          {eligibilityDiff.lost.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>LOST SCHEMES (Graduated / Disqualified):</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  -{eligibilityDiff.lost.length} Graduated
                </span>
              </div>

              <div className="space-y-2">
                {eligibilityDiff.lost.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-50/70 border border-rose-300 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-rose-950 block">
                        {item.scheme.name}
                      </span>
                      <p className="text-[11px] text-rose-800 mt-0.5">
                        Reason: Demographic transition (e.g. minor reached age limit or income surpassed ceiling).
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-rose-800 font-mono">
                        -₹{item.monthlyValue.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNCHANGED BASELINE ENTITLEMENTS */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block">
              Retained Baseline Entitlements ({eligibilityDiff.unchanged.length} Active):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {eligibilityDiff.unchanged.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  ✓ {item.scheme.name.split('(')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
