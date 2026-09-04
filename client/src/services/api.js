// Client API service with token handling
const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('portfolio_auth_token');
export const setAuthToken = (token) => localStorage.setItem('portfolio_auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('portfolio_auth_token');

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiRequest('/auth/me'),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (payload) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  changePassword: (payload) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(payload) }),
};

// Portfolio Management API
export const portfolioApi = {
  getMyPortfolio: () => apiRequest('/portfolio/me'),
  updateProfile: (data) => apiRequest('/portfolio/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateCustomization: (data) => apiRequest('/portfolio/customization', { method: 'PUT', body: JSON.stringify(data) }),
  updateSettings: (data) => apiRequest('/portfolio/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateSlug: (slug) => apiRequest('/portfolio/slug', { method: 'PUT', body: JSON.stringify({ slug }) }),

  // Status transitions
  publish: (slug) => apiRequest('/portfolio/publish', { method: 'POST', body: JSON.stringify({ slug }) }),
  unpublish: () => apiRequest('/portfolio/unpublish', { method: 'POST' }),
  saveDraft: () => apiRequest('/portfolio/draft', { method: 'POST' }),

  // Education
  addEducation: (item) => apiRequest('/portfolio/education', { method: 'POST', body: JSON.stringify(item) }),
  updateEducation: (id, item) => apiRequest(`/portfolio/education/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteEducation: (id) => apiRequest(`/portfolio/education/${id}`, { method: 'DELETE' }),

  // Skills
  addSkill: (item) => apiRequest('/portfolio/skills', { method: 'POST', body: JSON.stringify(item) }),
  updateSkill: (id, item) => apiRequest(`/portfolio/skills/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteSkill: (id) => apiRequest(`/portfolio/skills/${id}`, { method: 'DELETE' }),

  // Projects
  addProject: (item) => apiRequest('/portfolio/projects', { method: 'POST', body: JSON.stringify(item) }),
  updateProject: (id, item) => apiRequest(`/portfolio/projects/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteProject: (id) => apiRequest(`/portfolio/projects/${id}`, { method: 'DELETE' }),

  // Experience
  addExperience: (item) => apiRequest('/portfolio/experience', { method: 'POST', body: JSON.stringify(item) }),
  updateExperience: (id, item) => apiRequest(`/portfolio/experience/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteExperience: (id) => apiRequest(`/portfolio/experience/${id}`, { method: 'DELETE' }),

  // Certifications
  addCertification: (item) => apiRequest('/portfolio/certifications', { method: 'POST', body: JSON.stringify(item) }),
  updateCertification: (id, item) => apiRequest(`/portfolio/certifications/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteCertification: (id) => apiRequest(`/portfolio/certifications/${id}`, { method: 'DELETE' }),

  // Achievements
  addAchievement: (item) => apiRequest('/portfolio/achievements', { method: 'POST', body: JSON.stringify(item) }),
  updateAchievement: (id, item) => apiRequest(`/portfolio/achievements/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteAchievement: (id) => apiRequest(`/portfolio/achievements/${id}`, { method: 'DELETE' }),
};

// Public Access API
export const publicApi = {
  getPortfolio: (slug) => apiRequest(`/public/portfolio/${slug}`),
};

// File Uploads API
export const uploadApi = {
  uploadAvatar: (formData) => apiRequest('/upload/avatar', { method: 'POST', body: formData }),
  uploadResume: (formData) => apiRequest('/upload/resume', { method: 'POST', body: formData }),
  deleteResume: () => apiRequest('/upload/resume', { method: 'DELETE' }),
};

// Admin API
export const adminApi = {
  getStats: () => apiRequest('/admin/stats'),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },
  getUserDetails: (id) => apiRequest(`/admin/users/${id}`),
  toggleStatus: (id, status) => apiRequest(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  resetPassword: (id, newPassword) => apiRequest(`/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ newPassword }) }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
};
