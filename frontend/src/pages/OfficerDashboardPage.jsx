import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerLayout from '../components/OfficerLayout';
import DistrictDashboard from '../components/DistrictDashboard';
import { dashboardApi } from '../api/client';

export default function OfficerDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const navigate = useNavigate();

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getDistrictSummary();
      setData(res);
    } catch (err) {
      console.error('Failed to load district summary:', err);
      setError('Unable to load district welfare intelligence. Please ensure backend services are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleNavigateTo = (target) => {
    if (target === 'families') {
      navigate('/officer/families');
    } else if (target === 'duplicates') {
      navigate('/officer/duplicates');
    }
  };

  return (
    <OfficerLayout>
      {loading ? (
        <div className="card-dpi p-16 text-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-secondary">Loading state welfare intelligence metrics...</p>
        </div>
      ) : error ? (
        <div className="card-dpi p-8 bg-amber-50/70 border border-amber-200 text-center space-y-3">
          <p className="text-sm text-amber-900 font-semibold">{error}</p>
          <button
            onClick={loadSummary}
            className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded hover:bg-navy-dark transition-colors"
          >
            Retry Loading Metrics
          </button>
        </div>
      ) : (
        <DistrictDashboard
          data={data}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          onNavigateTo={handleNavigateTo}
        />
      )}
    </OfficerLayout>
  );
}
