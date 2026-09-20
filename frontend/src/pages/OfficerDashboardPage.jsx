import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerLayout from '../components/OfficerLayout';
import DistrictDashboard from '../components/DistrictDashboard';
import { dashboardApi } from '../api/client';

export default function OfficerDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const res = await dashboardApi.getDistrictSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load district summary:', err);
      } finally {
        setLoading(false);
      }
    }
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
