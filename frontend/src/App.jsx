import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

          {/* Citizen Self-Service Routes */}
          <Route path="/citizen/family/:familyId" element={<CitizenDashboard />} />

          {/* Officer Console Routes */}
          <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
          <Route path="/officer/families" element={<OfficerFamiliesPage />} />
          <Route path="/officer/families/:familyId" element={<OfficerFamilyDetailPage />} />
          <Route path="/officer/duplicates" element={<OfficerDuplicatesPage />} />
          <Route path="/officer/schemes" element={<OfficerSchemesPage />} />
          <Route path="/officer/camps" element={<OfficerCampsPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
