import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, ShieldCheck, MapPin, IndianRupee, Home,
  AlertCircle, CheckCircle2, Clock, FileText, Database, Send,
  ChevronRight, Sparkles, Building2, Tag, Check, Award, Copy,
  Printer, Bot, ExternalLink, RefreshCw, AlertTriangle
} from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';
import FamilyGraph from '../components/FamilyGraph';
import BenefitGapPanel from '../components/BenefitGapPanel';
import AssistantDrawer from '../components/AssistantDrawer';
import WelfareDossierModal from '../components/WelfareDossierModal';
import { familyApi, applicationApi } from '../api/client';

export default function OfficerFamilyDetailPage() {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [gapReport, setGapReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, benefits, members, applications, identity
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [famData, gapData] = await Promise.all([
        familyApi.getFamilyById(familyId),
        familyApi.getBenefitGap(familyId),
      ]);
      setFamily(famData);
      setGapReport(gapData);
      if (famData?.members?.length > 0) {
        setSelectedMember(famData.members[0]);
      }
    } catch (err) {
      console.error('Failed to load family detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [familyId]);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(familyId);
    setCopied(true);
    showToast(`Family ID ${familyId} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateApplication = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      await applicationApi.updateApplicationStatus(appId, {
        status: newStatus,
        assigned_officer: 'District Welfare Officer · Gujarat State Administration',
      });
      showToast(`Application ${appId} marked as ${newStatus} successfully.`);
      await loadData();
    } catch (err) {
      console.error('Failed to update application status:', err);
      alert('Could not update application status. Please check backend connection.');
    } finally {
      setUpdatingAppId(null);
    }
  };

  if (loading) {
    return (
      <OfficerLayout>
        <div className="card-dpi p-16 text-center bg-white border border-slate-border">
          <div className="w-10 h-10 border-3 border-navy border-t-[#FF671F] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-navy">Loading family record...</p>
          <p className="text-xs text-slate-secondary mt-1">Evaluating welfare eligibility rules</p>
        </div>
      </OfficerLayout>
    );
  }

  if (!family) {
    return (
      <OfficerLayout>
        <div className="card-dpi p-12 text-center text-slate-secondary bg-white border-t-4 border-amber-500">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-text">Family Record Not Found</h3>
          <p className="text-xs mt-1 mb-5">No civil registration data found for ID "{familyId}".</p>
          <Link
            to="/officer/families"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-navy hover:bg-navy-dark shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Family Registry</span>
          </Link>
        </div>
      </OfficerLayout>
    );
  }

  const gapCount = gapReport?.gap_count ?? 0;
  const receivingCount = gapReport?.receiving_count ?? 0;
  const applications = family.applications || [];
  const benefits = family.benefits || [];
  const identityRecords = family.identity_records || [];
  const headMember = family.members?.find((m) => m.relation_to_head === 'Head') || family.members?.[0];

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#FFB81C] flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Breadcrumb & Live Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-lg border border-slate-border shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/officer/families"
              className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-navy transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Families Registry</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 bg-blue-50/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
              <span className="font-mono text-xs font-black text-navy">{family.family_id}</span>
              <button
                onClick={handleCopyId}
                title="Copy Family ID"
                className="text-slate-400 hover:text-navy transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">
              {family.village} · {family.taluka} · {family.district}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Civil Identity Verified</span>
            </span>

            <button
              onClick={() => setDossierOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Dossier</span>
            </button>

            <Link
              to={`/citizen/family/${family.family_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 transition-colors shadow-xs"
              title="Open citizen-facing self-service view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Citizen View</span>
            </Link>

            <button
              onClick={() => setAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white hover:opacity-95 shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Welfare Audit</span>
            </button>
          </div>
        </div>

        {/* Hero Family 360 Card with Official Government Accent */}
        <div className="card-dpi p-5 bg-white border border-slate-200 shadow-sm" style={{ borderTop: '3px solid #FF671F' }}>

          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-[#FF671F] text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  Gujarat Family ID
                </span>
                <span className="bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {family.social_category} Category
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Ration Card: <strong className="text-slate-800">{family.ration_card_id || 'Nil (Unlinked)'}</strong>
                </span>
              </div>

              <h1 className="text-2xl font-black text-navy flex items-center gap-2">
                <span>{headMember ? `${headMember.name}'s Family` : 'Gujarat Household Profile'}</span>
                <span className="text-sm font-normal text-slate-500 font-mono">({family.family_id})</span>
              </h1>

              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                Village {family.village}, Taluka {family.taluka}, District {family.district}, Gujarat State
              </p>
            </div>

            {/* 4 Crisp, Vibrant Government KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
              {/* Card 1: Members (Saffron Accent) */}
              <div className="p-3 rounded-lg bg-orange-50/70 border border-orange-200 text-center min-w-[105px]">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">
                  Household
                </span>
                <span className="text-lg font-black font-mono text-orange-950">
                  {family.family_size} Members
                </span>

              </div>

              {/* Card 2: Annual Income (Navy Accent) */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-center min-w-[120px]">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  Annual Income
                </span>
                <span className="text-lg font-black font-mono text-blue-950">
                  ₹{(family.annual_income || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-blue-700 block mt-0.5">
                  {family.annual_income <= 150000 ? 'BPL / Low Income' : 'Moderate'}
                </span>
              </div>

              {/* Card 3: Active Benefits (Emerald Green) */}
              <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-300 text-center min-w-[110px]">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Receiving
                </span>
                <span className="text-lg font-black font-mono text-emerald-950">
                  {receivingCount} Schemes
                </span>

              </div>

              {/* Card 4: Actionable Gaps (Vibrant Amber / Crimson Glow) */}
              <div className={`p-3 rounded-lg border-2 text-center min-w-[115px] relative overflow-hidden ${
                gapCount > 0
                  ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>

                <span className="text-[10px] font-extrabold uppercase tracking-wider block flex items-center justify-center gap-1 text-amber-900">
                  <AlertCircle className="w-3 h-3 text-amber-700" />
                  Benefit Gaps
                </span>
                <span className="text-lg font-black font-mono text-amber-950">
                  {gapCount} Unserved
                </span>
                <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                  Action Required
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Government Navigation Tabs */}
        <div className="bg-white p-1 rounded-xl border border-slate-border shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', count: null, color: 'bg-navy' },
            { id: 'benefits', label: 'Benefits & Gaps', count: gapCount > 0 ? `${gapCount} Gaps` : null, color: gapCount > 0 ? 'bg-[#FF671F]' : 'bg-emerald-600' },
            { id: 'members', label: 'Members', count: family.members?.length || 0, color: 'bg-blue-600' },
            { id: 'applications', label: 'Applications', count: applications.length, color: 'bg-purple-600' },
            { id: 'identity', label: 'Data Sources', count: identityRecords.length, color: 'bg-slate-600' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-navy to-[#0A2540] text-white shadow-sm border border-navy'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-100/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white/20 text-[#FFB81C]' : `${tab.color} text-white`
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Overview & Kinship */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Family Profile Details */}
            <div className="card-dpi p-5 bg-white space-y-4" style={{ borderTop: '3px solid #172B63' }}>
              <div className="border-b border-slate-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy">Family Attributes</h3>
                  <p className="text-[11px] text-slate-500">Economic & demographic parameters</p>
                </div>
                <span className="text-[10px] font-bold font-mono bg-blue-50 text-navy px-2 py-0.5 rounded border border-blue-200">
                  DPI Verified
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Social Classification</span>
                  <span className="font-bold text-navy bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {family.social_category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Housing Infrastructure</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    family.housing_status === 'None' || family.housing_status === 'Rented'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {family.housing_status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Agricultural Land</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {family.land_holding_acres != null ? `${family.land_holding_acres} Acres` : 'Nil / Landless Rural Labor'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Taluka / Jurisdiction</span>
                  <span className="font-semibold text-slate-700">{family.taluka} Taluka, {family.district}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">PDS Ration Tier</span>
                  <span className="font-mono text-xs font-bold text-navy">
                    {family.ration_card_id || 'Not Registered'}
                  </span>
                </div>
              </div>


            </div>

            {/* Right: Interactive Family Kinship Graph */}
            <div className="lg:col-span-2">
              <FamilyGraph
                members={family.members || []}
                selectedMemberId={selectedMember?.member_id}
                onSelectMember={(m) => setSelectedMember(m)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Benefits & Gaps Matrix */}
        {activeTab === 'benefits' && (
          <BenefitGapPanel
            gapReport={gapReport}
            family={family}
            onApplicationCreated={() => {
              showToast('New welfare application created successfully!');
              loadData();
            }}
          />
        )}

        {/* TAB 3: Members List & Dynamic Member Inspector */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card-dpi p-5 bg-white border border-slate-border space-y-4">
              <div className="border-b border-slate-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy">Household Members</h3>
                  <p className="text-xs text-slate-500">Click any member to view details</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {family.members?.length} Registered
                </span>
              </div>

              <div className="space-y-2.5">
                {family.members?.map((m) => {
                  const isSelected = selectedMember?.member_id === m.member_id;
                  const isHead = m.relation_to_head === 'Head';
                  return (
                    <div
                      key={m.member_id}
                      onClick={() => setSelectedMember(m)}
                      className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex flex-wrap items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#FF671F] bg-orange-50/40 shadow-sm'
                          : 'border-slate-border hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isHead ? 'bg-navy text-white' : 'bg-blue-100 text-navy'
                        }`}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              isHead ? 'bg-navy text-white' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {m.relation_to_head}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            DOB: {m.dob} · Gender: {m.gender} · {m.education_level || 'No formal schooling'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {m.student_status && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            Student (Scholarship Eligible)
                          </span>
                        )}
                        {m.disability_status && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            Divyang / Disability
                          </span>
                        )}
                        {m.occupation && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {m.occupation}
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-navy pl-2">{m.member_id}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Member Inspector Card */}
            {selectedMember && (
              <div className="card-dpi p-5 bg-white border border-slate-200 space-y-4" style={{ borderTop: '3px solid #FF671F' }}>
                <div className="border-b border-slate-border pb-3">
                  <span className="text-[10px] font-mono font-bold text-[#FF671F] uppercase tracking-wider block">
                    Member Details
                  </span>
                  <h3 className="text-base font-bold text-navy">{selectedMember.name}</h3>
                  <p className="text-xs text-slate-500">ID: {selectedMember.member_id}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Relationship to Head</span>
                    <span className="font-bold text-slate-800">{selectedMember.relation_to_head}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Date of Birth</span>
                    <span className="font-mono font-medium text-slate-800">{selectedMember.dob}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Education Level</span>
                    <span className="font-bold text-navy">{selectedMember.education_level || 'None'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Occupation</span>
                    <span className="font-medium text-slate-800">{selectedMember.occupation || 'Dependent'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Student Status</span>
                    <span className="font-bold text-emerald-700">{selectedMember.student_status ? 'Active Student' : 'No'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('benefits');
                      showToast(`Evaluating targeted schemes for ${selectedMember.name}`);
                    }}
                    className="w-full py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Check Individual Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFB81C]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: In-Flight Scheme Applications */}
        {activeTab === 'applications' && (
          <div className="card-dpi p-5 bg-white border border-slate-200 space-y-4" style={{ borderTop: '3px solid #172B63' }}>
            <div className="border-b border-slate-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy">Applications</h3>
                <p className="text-xs text-slate-500">Scheme applications & verification workflow</p>
              </div>
              <button
                onClick={() => setActiveTab('benefits')}
                className="text-xs font-bold text-[#FF671F] hover:underline"
              >
                + Apply for New Scheme
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No Applications Active for This Family</p>
                <p className="mt-1">
                  You can submit an assisted application from the <strong>"Benefits & Gaps Matrix"</strong> tab.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Scheme Code</th>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Submitted Date</th>
                      <th className="py-3 px-4">Workflow Status</th>
                      <th className="py-3 px-4 text-right">Officer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {applications.map((app) => (
                      <tr key={app.application_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-navy">{app.application_id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{app.scheme_id}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{app.member_id}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {app.status !== 'APPROVED' && app.status !== 'REJECTED' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateApplication(app.application_id, 'APPROVED')}
                                disabled={updatingAppId === app.application_id}
                                className="px-3 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateApplication(app.application_id, 'REJECTED')}
                                disabled={updatingAppId === app.application_id}
                                className="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400">Decision Logged</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Data Sources & Departmental Footprints */}
        {activeTab === 'identity' && (
          <div className="card-dpi p-5 bg-white border border-slate-200 space-y-4" style={{ borderTop: '3px solid #FF671F' }}>
            <div className="border-b border-slate-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#FF671F]" />
                  <span>Departmental Data Sources</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Identity records from Ration, Scholarship, Housing, and Health registries
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-navy px-2.5 py-1 rounded border border-blue-200">
                {identityRecords.length} Records
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {identityRecords.map((rec) => {
                const sysColors = {
                  ration: 'border-blue-400 bg-blue-50/50 text-blue-900',
                  scholarship: 'border-purple-400 bg-purple-50/50 text-purple-900',
                  housing: 'border-amber-400 bg-amber-50/50 text-amber-900',
                  health: 'border-emerald-400 bg-emerald-50/50 text-emerald-900',
                };
                const colorCls = sysColors[rec.source_system?.toLowerCase()] || 'border-slate-300 bg-slate-50 text-slate-800';

                return (
                  <div key={rec.record_id} className={`p-4 rounded-lg border-2 bg-white shadow-xs space-y-2`}>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${colorCls}`}>
                        {rec.source_system} MIS
                      </span>
                      <span className="font-mono text-slate-400 text-xs font-bold">{rec.record_id}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Recorded Civil Name</span>
                      <span className="text-sm font-bold text-navy">{rec.name_as_recorded}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100 text-slate-600 font-medium">
                      <div>
                        <span className="text-[10px] text-slate-400 block">DOB</span>
                        <span>{rec.dob}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Gender</span>
                        <span>{rec.gender}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Village</span>
                        <span className="truncate">{rec.village}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Slide-over Assistant Drawer */}
        <AssistantDrawer isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />

        {/* Official Welfare Dossier Printable Modal */}
        <WelfareDossierModal
          isOpen={dossierOpen}
          onClose={() => setDossierOpen(false)}
          family={family}
          gapReport={gapReport}
          mode="officer"
        />
      </div>
    </OfficerLayout>
  );
}
