import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Curated demo personas representing each tier of the Gujarat Welfare RBAC architecture
export const DEMO_PERSONAS = {
  citizen: {
    role: 'citizen',
    roleLabel: 'Citizen / Head of Household',
    roleLabelGu: 'નાગરિક / કુટુંબના વડા',
    roleLabelHi: 'नागरिक / परिवार का मुखिया',
    id: 'GJ-F000012',
    name: 'Dinesh Haresh Shah',
    jurisdiction: 'Daskroi Taluka, Ahmedabad District',
    rationCard: 'RC-GJ-0012',
    avatar: 'DS',
    badgeColor: 'amber',
    permissions: ['view_family_benefits', 'apply_schemes', 'download_dossier', 'file_grievance', 'query_ai'],
    defaultRedirect: '/citizen/family/GJ-F000012',
    description: 'Access individual household welfare profile, unclaimed entitlement gap detection, and AI assistant.'
  },
  taluka_officer: {
    role: 'taluka_officer',
    roleLabel: 'Taluka Welfare Officer',
    roleLabelGu: 'તાલુકા સમાજ કલ્યાણ અધિકારી',
    roleLabelHi: 'तालुका समाज कल्याण अधिकारी',
    id: 'OFF-TAL-004',
    name: 'Shri Bharat Patel',
    jurisdiction: 'Anand Taluka (38 Gram Panchayats)',
    district: 'Anand',
    avatar: 'BP',
    badgeColor: 'blue',
    permissions: ['view_families', 'camp_saturation', 'verify_documents', 'field_outreach', 'query_ai'],
    defaultRedirect: '/officer/camps',
    description: 'Field operational console for organizing saturation camps, document verification, and village-level outreach.'
  },
  district_officer: {
    role: 'district_officer',
    roleLabel: 'District Welfare Officer',
    roleLabelGu: 'જિલ્લા સમાજ કલ્યાણ અધિકારી',
    roleLabelHi: 'जिला समाज कल्याण अधिकारी',
    id: 'OFF-DST-001',
    name: 'Shri Rajesh Mehta',
    jurisdiction: 'Ahmedabad District (10 Talukas)',
    district: 'Ahmedabad',
    avatar: 'RM',
    badgeColor: 'emerald',
    permissions: ['view_families', 'resolve_duplicates', 'sanction_applications', 'district_analytics', 'manage_schemes', 'query_ai'],
    defaultRedirect: '/officer/duplicates',
    description: 'District administration console for resolving identity duplicates, reviewing welfare applications, and coverage monitoring.'
  },
  state_admin: {
    role: 'state_admin',
    roleLabel: 'State Administrator / Policy Director',
    roleLabelGu: 'રાજ્ય નીતિ નિર્દેશક / વહીવટકર્તા',
    roleLabelHi: 'राज्य नीति निदेशक / व्यवस्थापक',
    id: 'OFF-STE-000',
    name: 'Dr. Sharda Solanki',
    jurisdiction: 'State of Gujarat (All 33 Districts)',
    district: 'All Districts',
    avatar: 'SS',
    badgeColor: 'purple',
    permissions: ['*'],
    defaultRedirect: '/officer/dashboard',
    description: 'Executive command center with statewide cross-district intelligence, scheme rules governance, and macro saturation metrics.'
  }
};

const STORAGE_KEY = 'family360_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error syncing auth session:', e);
    }
  }, [user]);

  /**
   * Authenticate as a specific role or custom credentials
   */
  const login = (roleKey, customData = {}) => {
    let basePersona = DEMO_PERSONAS[roleKey] || DEMO_PERSONAS.citizen;
    
    // If citizen provided a specific Family ID
    if (roleKey === 'citizen' && customData.id) {
      basePersona = {
        ...basePersona,
        id: customData.id,
        defaultRedirect: `/citizen/family/${customData.id}`,
        name: customData.name || basePersona.name,
      };
    }

    const sessionUser = {
      ...basePersona,
      ...customData,
      loggedInAt: new Date().toISOString()
    };

    setUser(sessionUser);
    return sessionUser.defaultRedirect;
  };

  /**
   * Log out active session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Switch persona instantly
   */
  const switchRole = (roleKey, customId = null) => {
    return login(roleKey, customId ? { id: customId } : {});
  };

  /**
   * Check if current user has permission
   */
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(permission) || false;
  };

  const isCitizen = user?.role === 'citizen';
  const isOfficer = ['taluka_officer', 'district_officer', 'state_admin'].includes(user?.role);
  const isStateAdmin = user?.role === 'state_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isCitizen,
        isOfficer,
        isStateAdmin,
        login,
        logout,
        switchRole,
        hasPermission,
        demoPersonas: DEMO_PERSONAS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
