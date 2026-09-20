import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, ShieldCheck, MapPin, IndianRupee, Home,
  AlertCircle, CheckCircle2, Clock, FileText, Database, Send,
  ChevronRight, Sparkles, Building2, Tag, Check, Award
} from 'lucide-react';
import OfficerLayout from '../components/OfficerLayout';
import FamilyGraph from '../components/FamilyGraph';
import BenefitGapPanel from '../components/BenefitGapPanel';
import { familyApi, applicationApi } from '../api/client';

export default function OfficerFamilyDetailPage() {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [gapReport, setGapReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, members, benefits, applications, identity
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);

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

  const handleUpdateApplication = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      await applicationApi.updateApplicationStatus(appId, {
        status: newStatus,
        assigned_officer: 'DWO Ahmedabad',
      });
      await loadData();
    } catch (err) {
      console.error('Failed to update application status:', err);
      alert('Could not update application status.');
    } finally {
      setUpdatingAppId(null);
    }
  };

  if (loading) {
    return (
      <OfficerLayout>
        <div className="card-dpi p-16 text-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-secondary">Loading unified Family 360 profile...</p>
        </div>
      </OfficerLayout>
    );
  }

  if (!family) {
    return (
      <OfficerLayout>
        <div className="card-dpi p-12 text-center text-slate-secondary">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-text">Family Record Not Found</h3>
          <p className="text-xs mt-1 mb-4">No civil registration data found for ID "{familyId}".</p>
          <Link
            to="/officer/families"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-navy"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Family Registry</span>
          </Link>
        </div>
      </OfficerLayout>
    );
  }

  const gapCount = gapReport?.gap_count ?? 0;
  const applications = family.applications || [];
  const benefits = family.benefits || [];
  const identityRecords = family.identity_records || [];

  return (
    <OfficerLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <Link
              to="/officer/families"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-secondary hover:text-navy"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Families</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-navy bg-navy-subtle px-2 py-0.5 rounded">
              {family.family_id}
            </span>
            <span className="text-xs text-slate-secondary">
              {family.village} · {family.taluka} · {family.district}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Civil Registry Verified
            </span>
          </div>
        </div>

        {/* Hero Family 360 Header Card */}
        <div className="card-dpi p-5 bg-white border border-slate-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary block mb-0.5">
                Unified Family Profile
              </span>
              <h1 className="text-xl font-bold text-navy">
                {family.head_name ? `${family.head_name}'s Household` : 'Gujarat Registered Household'}
              </h1>
              <p className="text-xs text-slate-secondary mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {family.village}, Taluka {family.taluka}, {family.district} District · Ration Card: {family.ration_card_id || 'Not linked'}
              </p>
            </div>

            {/* Quick Metrics Badge Row */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-border text-center min-w-[90px]">
                <span className="text-[10px] text-slate-secondary block">Household</span>
                <span className="text-sm font-bold font-mono text-slate-text">{family.family_size} Members</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-border text-center min-w-[100px]">
                <span className="text-[10px] text-slate-secondary block">Annual Income</span>
                <span className="text-sm font-bold font-mono text-slate-text">
                  ₹{(family.annual_income || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-border text-center min-w-[90px]">
                <span className="text-[10px] text-slate-secondary block">Active Benefits</span>
                <span className="text-sm font-bold font-mono text-emerald-700">{benefits.length} Schemes</span>
              </div>
              <div className={`p-2.5 rounded border text-center min-w-[100px] ${
                gapCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-border'
              }`}>
                <span className="text-[10px] font-semibold block">Potential Gaps</span>
                <span className="text-sm font-bold font-mono text-amber-900">{gapCount} Unserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Tabs Bar */}
        <div className="border-b border-slate-border flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview & Kinship' },
            { id: 'benefits', label: `Benefits & Gaps (${gapCount > 0 ? `${gapCount} Actionable` : 'All Set'})` },
            { id: 'members', label: `Members (${family.members?.length || 0})` },
            { id: 'applications', label: `Applications (${applications.length})` },
            { id: 'identity', label: `Civil Data Sources (${identityRecords.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-navy text-navy bg-white'
                  : 'border-transparent text-slate-secondary hover:text-slate-text hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Overview & Kinship */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Family Profile Details */}
            <div className="card-dpi p-5 bg-white space-y-4">
              <div className="border-b border-slate-border pb-3">
                <h3 className="text-sm font-bold text-slate-text">Family Socio-Economic Attributes</h3>
                <p className="text-xs text-slate-secondary">Statutory variables used for eligibility determination</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Social Category</span>
                  <span className="font-semibold text-slate-text bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {family.social_category}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Housing Status</span>
                  <span className="font-semibold text-slate-text">{family.housing_status}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Land Holding</span>
                  <span className="font-mono text-slate-text">
                    {family.land_holding_acres != null ? `${family.land_holding_acres} Acres` : 'Nil / Landless'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-secondary">Civil Registry Creation</span>
                  <span className="font-mono text-slate-secondary text-[11px]">
                    {family.created_at ? new Date(family.created_at).toLocaleDateString() : '2026-09-01'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-blue-50/50 border border-blue-100 text-[11px] text-slate-secondary space-y-1">
                <span className="font-bold text-navy block">Administrative Note:</span>
                <p>
                  Eligibility determinations are computed deterministically per statute. Household economic status is verified against Civil Supplies ration tier records.
                </p>
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

        {/* TAB 2: Benefits & Gaps */}
        {activeTab === 'benefits' && (
          <BenefitGapPanel
            gapReport={gapReport}
            family={family}
            onApplicationCreated={() => loadData()}
          />
        )}

        {/* TAB 3: Members List */}
        {activeTab === 'members' && (
          <div className="card-dpi bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-border">
              <h3 className="text-sm font-bold text-slate-text">Individual Family Members</h3>
              <p className="text-xs text-slate-secondary">Demographic and occupational data per individual</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-border text-slate-secondary font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Relation</th>
                    <th className="py-3 px-4">DOB / Gender</th>
                    <th className="py-3 px-4">Education</th>
                    <th className="py-3 px-4">Occupation</th>
                    <th className="py-3 px-4">Markers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border">
                  {family.members?.map((m) => (
                    <tr key={m.member_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-navy">{m.member_id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-text">{m.name}</td>
                      <td className="py-3 px-4 text-slate-600">{m.relation_to_head}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.dob} ({m.gender})
                      </td>
                      <td className="py-3 px-4 text-slate-600">{m.education_level || 'None'}</td>
                      <td className="py-3 px-4 text-slate-600">{m.occupation || 'Dependent'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {m.student_status && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                              Student
                            </span>
                          )}
                          {m.disability_status && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                              Disability
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Applications Workflow */}
        {activeTab === 'applications' && (
          <div className="card-dpi bg-white overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-text">In-Flight Scheme Applications</h3>
                <p className="text-xs text-slate-secondary">Administrative workflow and SLA verification stage</p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-secondary">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-text">No Applications Currently Active</p>
                <p className="mt-1">
                  Citizen or field officer can initiate an application from the "Benefits & Gaps" tab.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-border text-slate-secondary font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Scheme</th>
                      <th className="py-3 px-4">Applicant Member</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Officer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-border">
                    {applications.map((app) => (
                      <tr key={app.application_id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-navy">{app.application_id}</td>
                        <td className="py-3 px-4 font-medium text-slate-text">{app.scheme_id}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{app.member_id}</td>
                        <td className="py-3 px-4 text-slate-secondary">
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {app.status !== 'APPROVED' && app.status !== 'REJECTED' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateApplication(app.application_id, 'APPROVED')}
                                disabled={updatingAppId === app.application_id}
                                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateApplication(app.application_id, 'REJECTED')}
                                disabled={updatingAppId === app.application_id}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Processed</span>
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

        {/* TAB 5: Data Sources & Identity Reconciliation */}
        {activeTab === 'identity' && (
          <div className="card-dpi bg-white p-5 space-y-4">
            <div className="border-b border-slate-border pb-3">
              <h3 className="text-sm font-bold text-slate-text flex items-center gap-2">
                <Database className="w-4 h-4 text-navy" />
                Line-Department Identity Feeds
              </h3>
              <p className="text-xs text-slate-secondary">
                Records ingested from Ration, Scholarship, Housing, and Health databases feeding entity resolution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {identityRecords.map((rec) => (
                <div key={rec.record_id} className="p-3 rounded border border-slate-border bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="font-bold text-navy uppercase text-[10px]">
                      Source: {rec.source_system}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">{rec.record_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Recorded Name</span>
                    <span className="font-semibold text-slate-text">{rec.name_as_recorded}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>DOB: {rec.dob}</span>
                    <span>Gender: {rec.gender}</span>
                    <span>Village: {rec.village}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OfficerLayout>
  );
}
