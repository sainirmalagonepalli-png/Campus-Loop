// Central API client wrapper for CampusLoop
const API_BASE = '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('campusloop_token');

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMsg = data?.message;
    if (!errorMsg) {
      if (response.status === 500) {
        errorMsg = 'Cannot reach backend server. Please verify the backend is running on port 5000 (run "cd server; npm run dev").';
      } else {
        errorMsg = `Request failed with status ${response.status}`;
      }
    }
    // If 401 Unauthorized and not on login/register page, clear token
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('campusloop_token');
      localStorage.removeItem('campusloop_user');
    }
    throw new Error(errorMsg);
  }

  return data;
};

// API Methods
export const api = {
  // Auth
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (data) => apiRequest('/auth/profile', { method: 'PUT', body: data }),
  getCollegeConfig: () => apiRequest('/auth/college-config'),

  // Resources
  getResources: (params = '') => apiRequest(`/resources${params}`),
  getResourceById: (id) => apiRequest(`/resources/${id}`),
  createResource: (formData) => apiRequest('/resources', { method: 'POST', body: formData }),
  updateResource: (id, formData) => apiRequest(`/resources/${id}`, { method: 'PUT', body: formData }),
  deleteResource: (id) => apiRequest(`/resources/${id}`, { method: 'DELETE' }),
  getMyListings: () => apiRequest('/resources/user/my-listings'),

  // Borrow Requests & Returns
  createRequest: (requestData) => apiRequest('/requests', { method: 'POST', body: requestData }),
  getIncomingRequests: () => apiRequest('/requests/incoming'),
  getOutgoingRequests: () => apiRequest('/requests/outgoing'),
  respondToRequest: (id, data) => apiRequest(`/requests/${id}/respond`, { method: 'PUT', body: data }),
  confirmReturn: (id) => apiRequest(`/requests/${id}/confirm-return`, { method: 'PUT' }),
  getTracking: () => apiRequest('/requests/tracking'),
  getHistory: (params = '') => apiRequest(`/requests/history${params}`),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),

  // Reports
  createReport: (reportData) => apiRequest('/reports', { method: 'POST', body: reportData }),
  getAllReports: () => apiRequest('/reports'),
  manageReport: (id, data) => apiRequest(`/reports/${id}/manage`, { method: 'PUT', body: data }),

  // Dashboard & Admin
  getDashboardStats: () => apiRequest('/users/dashboard-stats'),
  getPublicProfile: (id) => apiRequest(`/users/${id}/public-profile`),
  getAdminStats: () => apiRequest('/admin/stats'),
  getAllStudents: () => apiRequest('/admin/students'),
  toggleSuspendStudent: (id, data) => apiRequest(`/admin/students/${id}/toggle-suspend`, { method: 'PUT', body: data }),
};
