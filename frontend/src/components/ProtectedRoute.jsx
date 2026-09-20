import React from 'react';
import { Navigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, Lock, UserCheck, Shield, Building2, Users } from 'lucide-react';
import NationalGovHeader from './NationalGovHeader';
import NationalGovFooter from './NationalGovFooter';

/**
 * Route guard enforcing authentication, Role-Based Access Control (RBAC),
 * and Citizen Household Data Privacy.
 * 
 * @param {Array} allowedRoles - e.g. ['citizen'], ['officer'], ['district_officer', 'state_admin']
 * @param {boolean} requireOwnFamily - If true, restricts citizen to only their own registered familyId
 */
export default function ProtectedRoute({ children, allowedRoles = [], requireOwnFamily = false }) {
  const { user, isAuthenticated, role } = useAuth();
  const location = useLocation();
  const params = useParams();

  // 1. Unauthenticated users are redirected to login with return destination
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Check Allowed Roles
  if (allowedRoles.length > 0) {
    const isOfficerRole = ['taluka_officer', 'district_officer', 'state_admin'].includes(role);
    const isAllowed =
      allowedRoles.includes(role) ||
      (allowedRoles.includes('officer') && isOfficerRole);

    if (!isAllowed) {
      // Specialized error screens based on the specific violation

      // Case A: Citizen trying to enter Officer Administration
      if (role === 'citizen') {
        return (
          <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-800 antialiased">
            <NationalGovHeader currentRole="citizen" />

            <main className="max-w-md mx-auto my-auto p-6 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Lock className="w-3 h-3" />
                  <span>Government Officer Console Only</span>
                </div>

                <h2 className="text-lg font-bold font-serif text-slate-900">
                  Access Restricted · Official Personnel Only
                </h2>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  You are currently authenticated as <strong className="text-slate-900">{user.name}</strong> with role{' '}
                  <span className="font-bold text-navy uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    Citizen
                  </span>.
                  Citizens are not permitted to access official administrative consoles or statewide registry databases.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link
                    to={`/citizen/family/${user.id || 'GJ-F000525'}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Users className="w-4 h-4 text-[#FF671F]" />
                    <span>Go to My Family Profile ({user.id})</span>
                  </Link>

                  <Link
                    to={`/login?role=district&redirect=${encodeURIComponent(location.pathname)}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Authenticate as Government Officer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </main>

            <NationalGovFooter />
          </div>
        );
      }

      // Case B: Taluka Officer trying to access District/State-only modules (e.g. Duplicate Queue)
      if (role === 'taluka_officer' && (allowedRoles.includes('district_officer') || allowedRoles.includes('state_admin'))) {
        return (
          <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-800 antialiased">
            <NationalGovHeader currentRole="officer" />

            <main className="max-w-md mx-auto my-auto p-6 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
                  <Building2 className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Shield className="w-3 h-3" />
                  <span>District / State Tier Privilege Required</span>
                </div>

                <h2 className="text-lg font-bold font-serif text-slate-900">
                  Higher Administrative Privilege Required
                </h2>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  You are currently logged in as <strong className="text-slate-900">{user.name}</strong> ({user.roleLabel}).
                  Taluka field officers are restricted from resolving statewide identity duplicates and policy rules.
                  This module requires <strong>District Collector</strong> or <strong>State Administrator</strong> authorization.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link
                    to="/officer/camps"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Return to Taluka Saturation Camps</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </Link>

                  <Link
                    to={`/login?role=district&redirect=${encodeURIComponent(location.pathname)}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Switch to District Officer Session</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </main>

            <NationalGovFooter />
          </div>
        );
      }

      // Generic Role Restriction
      return (
        <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-800 antialiased">
          <NationalGovHeader currentRole={role === 'citizen' ? 'citizen' : 'officer'} />

          <main className="max-w-md mx-auto my-auto p-6 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <h2 className="text-lg font-bold font-serif text-slate-900">
                Access Restricted · Role Authorization Required
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your currently active session has role{' '}
                <span className="font-bold text-navy uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100">
                  {role?.replace('_', ' ')}
                </span>, which is not permitted to access this module.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
                <Link
                  to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Switch Role / Re-Authenticate</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </Link>

                {user?.defaultRedirect && (
                  <Link
                    to={user.defaultRedirect}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Return to Authorized Dashboard
                  </Link>
                )}
              </div>
            </div>
          </main>

          <NationalGovFooter />
        </div>
      );
    }
  }

  // 3. Citizen Household Data Privacy Enforcement:
  // If user is a citizen, they can ONLY access their own registered family ID.
  if (role === 'citizen') {
    const requestedFamilyId = params.familyId;
    if (requestedFamilyId && user.id && requestedFamilyId.toUpperCase() !== user.id.toUpperCase()) {
      return (
        <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-800 antialiased">
          <NationalGovHeader currentRole="citizen" />

          <main className="max-w-md mx-auto my-auto p-6 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-300 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
                <UserCheck className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3 text-[#FF671F]" />
                <span>Citizen Data Privacy Protection</span>
              </div>

              <h2 className="text-lg font-bold font-serif text-slate-900">
                Unauthorized Household Access
              </h2>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                You are currently signed in as <strong className="text-slate-900">{user.name}</strong>, authorized exclusively to access your registered Family ID:{' '}
                <span className="font-mono font-bold text-navy px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {user.id}
                </span>.
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Under the Gujarat Digital Welfare & Privacy Framework, citizen accounts cannot view or inspect other households' welfare profiles (<span className="font-mono font-semibold text-rose-600">{requestedFamilyId}</span>).
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
                <Link
                  to={`/citizen/family/${user.id}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Users className="w-4 h-4 text-[#FF671F]" />
                  <span>Go to My Registered Family ({user.id})</span>
                </Link>

                <Link
                  to="/login?role=citizen"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Switch Citizen Household / Login</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </main>

          <NationalGovFooter />
        </div>
      );
    }
  }

  // All security, role, and privacy checks passed
  return children;
}
