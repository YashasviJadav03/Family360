import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    console.error(`[API Error] ${error.config?.url}:`, errorMsg);
    return Promise.reject(error);
  }
);

export const familyApi = {
  getFamilies: (params) => api.get('/families', { params }).then((r) => r.data),
  getFamilyById: (familyId) => api.get(`/families/${familyId}`).then((r) => r.data),
  getEligibility: (familyId) => api.get(`/families/${familyId}/eligibility`).then((r) => r.data),
  getBenefitGap: (familyId) => api.get(`/families/${familyId}/benefit-gap`).then((r) => r.data),
  getExplanation: (familyId, schemeId) => api.get(`/families/${familyId}/schemes/${schemeId}/explain`).then((r) => r.data),
};

export const schemeApi = {
  getSchemes: () => api.get('/schemes').then((r) => r.data),
  getSchemeById: (schemeId) => api.get(`/schemes/${schemeId}`).then((r) => r.data),
};

export const dashboardApi = {
  getDistrictSummary: () => api.get('/dashboard/district-summary').then((r) => r.data),
  getDataQuality: () => api.get('/dashboard/data-quality').then((r) => r.data),
};

export const officerApi = {
  getOfficers: () => api.get('/officers').then((r) => r.data),
};

export const applicationApi = {
  createApplication: (payload) => api.post('/applications', payload).then((r) => r.data),
  updateApplicationStatus: (appId, payload) => api.patch(`/applications/${appId}`, payload).then((r) => r.data),
};

export const duplicateApi = {
  getDuplicates: (params) => api.get('/duplicates', { params }).then((r) => r.data),
  getDuplicateDetail: (r1, r2) => api.get(`/duplicates/${r1}/${r2}`).then((r) => r.data),
  resolveDuplicate: (r1, r2, payload) => api.patch(`/duplicates/${r1}/${r2}/resolve`, payload).then((r) => r.data),
};

export const assistantApi = {
  query: (question) => api.post('/assistant/query', { question }).then((r) => r.data),
};

export default api;
