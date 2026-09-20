import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import CitizenLogin from './pages/CitizenLogin';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerLogin from './pages/OfficerLogin';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import OfficerFamiliesPage from './pages/OfficerFamiliesPage';
import OfficerFamilyDetailPage from './pages/OfficerFamilyDetailPage';
import OfficerDuplicatesPage from './pages/OfficerDuplicatesPage';
import OfficerSchemesPage from './pages/OfficerSchemesPage';
import OfficerCampsPage from './pages/OfficerCampsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Role Selector */}
        <Route path="/" element={<LandingPage />} />

        {/* Citizen Self-Service Routes */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/family/:familyId" element={<CitizenDashboard />} />

        {/* Officer Console Routes */}
        <Route path="/officer/login" element={<OfficerLogin />} />
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
  );
}
