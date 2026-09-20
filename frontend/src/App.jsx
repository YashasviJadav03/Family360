import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import OfficerFamiliesPage from './pages/OfficerFamiliesPage';
import OfficerFamilyDetailPage from './pages/OfficerFamilyDetailPage';
import OfficerDuplicatesPage from './pages/OfficerDuplicatesPage';
import OfficerSchemesPage from './pages/OfficerSchemesPage';
import OfficerCampsPage from './pages/OfficerCampsPage';

/**
 * Intelligent redirect to citizen's own registered family dashboard
 */
function CitizenIndexRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login?role=citizen" replace />;
  }
  return <Navigate to={`/citizen/family/${user.id || 'GJ-F000525'}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing & Public Discovery */}
          <Route path="/" element={<LandingPage />} />

          {/* Unified RBAC Single Sign-On (SSO) Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Backward-compatible login redirects */}
          <Route path="/citizen/login" element={<Navigate to="/login?role=citizen" replace />} />
          <Route path="/officer/login" element={<Navigate to="/login?role=district" replace />} />

          {/* Citizen Self-Service Base Redirects */}
          <Route path="/citizen" element={<CitizenIndexRedirect />} />
          <Route path="/citizen/dashboard" element={<CitizenIndexRedirect />} />

          {/* Citizen Self-Service Routes (Protected: Citizen can ONLY access own family; Officers can audit) */}
          <Route
            path="/citizen/family/:familyId"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'officer']} requireOwnFamily={true}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: Executive & Operational Dashboard (All Officers) */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: Statewide Unified Family Registry (All Officers) */}
          <Route
            path="/officer/families"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerFamiliesPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: Family 360° Comprehensive Profile Audit (All Officers) */}
          <Route
            path="/officer/families/:familyId"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerFamilyDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: Identity Deduplication & Aadhaar Ghost Resolution
              Restricted to District Collectors / DDOs and State Directorate */}
          <Route
            path="/officer/duplicates"
            element={
              <ProtectedRoute allowedRoles={['district_officer', 'state_admin']}>
                <OfficerDuplicatesPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: 20 Declarative Welfare Schemes Catalog (All Officers) */}
          <Route
            path="/officer/schemes"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerSchemesPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Console: Field Saturation Camps & Village Gap Hotspots (All Officers) */}
          <Route
            path="/officer/camps"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerCampsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
