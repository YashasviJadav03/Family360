import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import NationalGovHeader from './NationalGovHeader';
import NationalGovFooter from './NationalGovFooter';

/**
 * Route guard enforcing authentication and Role-Based Access Control (RBAC).
 * allowedRoles: ['citizen'] or ['officer', 'taluka_officer', 'district_officer', 'state_admin']
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to unified login page with return destination
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role requirement is specified, check against current role
  if (allowedRoles.length > 0) {
    const isAllowed =
      allowedRoles.includes(role) ||
      (allowedRoles.includes('officer') && ['taluka_officer', 'district_officer', 'state_admin'].includes(role));

    if (!isAllowed) {
      return (
        <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between text-slate-800">
          <NationalGovHeader currentRole={role === 'citizen' ? 'citizen' : 'officer'} />
          
          <main className="max-w-lg mx-auto my-auto p-6 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Access Restricted · Role Authorization Required
              </h2>
              
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your currently active session has role <span className="font-bold text-navy uppercase">{role?.replace('_', ' ')}</span>, 
                which is not permitted to access this module.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-2.5">
                <a
                  href={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy-dark transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Switch Role / Re-Authenticate</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </a>

                {user?.defaultRedirect && (
                  <a
                    href={user.defaultRedirect}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Return to Authorized Dashboard
                  </a>
                )}
              </div>
            </div>
          </main>

          <NationalGovFooter />
        </div>
      );
    }
  }

  return children;
}
