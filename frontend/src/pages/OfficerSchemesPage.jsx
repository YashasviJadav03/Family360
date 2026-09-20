import React, { useState, useEffect } from 'react';
import OfficerLayout from '../components/OfficerLayout';
import SchemeExplorer from '../components/SchemeExplorer';
import { schemeApi } from '../api/client';

export default function OfficerSchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        setLoading(true);
        const data = await schemeApi.getSchemes();
        setSchemes(data || []);
      } catch (err) {
        console.error('Failed to load schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  return (
    <OfficerLayout>
      {loading ? (
        <div className="card-dpi p-16 text-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-secondary">Loading statutory scheme knowledge base...</p>
        </div>
      ) : (
        <SchemeExplorer schemes={schemes} />
      )}
    </OfficerLayout>
  );
}
