import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  google: (payload) => api.post('/auth/google', payload),
  completeProfile: (payload) => api.post('/auth/complete-profile', payload),
  sendPhoneOtp: (payload) => api.post('/auth/phone/send-otp', payload),
  verifyPhoneOtp: (payload) => api.post('/auth/phone/verify-otp', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  verifyResetOtp: (payload) => api.post('/auth/verify-reset-otp', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  deleteAccount: () => api.delete('/auth/delete-account'),
  adminUsers: (search = '') => api.get(`/auth/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  blockUser: (userId) => api.post(`/auth/admin/users/${userId}/block`),
  deleteUser: (userId) => api.delete(`/auth/admin/users/${userId}`),
  adminResetPassword: (userId, payload) => api.post(`/auth/admin/users/${userId}/reset-password`, payload),
};
