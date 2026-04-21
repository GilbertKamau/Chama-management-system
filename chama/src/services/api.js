import axios from 'axios';

// Docker-compose exposes Laravel on port 8000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────
export const login   = (credentials) => api.post('/login', credentials);
export const signUp  = (userData)    => api.post('/signup', userData);
export const logout  = ()            => api.post('/logout');

// ─── Contributions ─────────────────────────────────────────────────────────
export const getContributions  = ()              => api.get('/contributions');
export const addContribution   = (data)          => api.post('/contributions', data);

// ─── Loans ─────────────────────────────────────────────────────────────────
export const getLoanRequests   = ()              => api.get('/loans');
export const requestLoan       = (data)          => api.post('/loans', data);
export const approveLoan       = (id)            => api.put(`/loans/${id}/status`, { status: 'Approved' });
export const rejectLoan        = (id)            => api.put(`/loans/${id}/status`, { status: 'Rejected' });
export const disburseLoan      = (id)            => api.put(`/loans/${id}/status`, { status: 'Disbursed' });

// ─── Payments ──────────────────────────────────────────────────────────────
export const getPayments  = ()    => api.get('/payments');
export const makePayment  = (data) => api.post('/payments', data);

// ─── Chama ─────────────────────────────────────────────────────────────────
export const getMyChama             = ()    => api.get('/chama');
export const getChamaSummary        = ()    => api.get('/chama/summary');
export const uploadConstitution     = (formData) =>
  api.post('/chama/constitution', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Super Admin ───────────────────────────────────────────────────────────
export const getAllChamas = () => api.get('/admin/chamas');
export const getAllUsers  = () => api.get('/admin/users');
export const getReports   = () => api.get('/admin/reports');

// ─── User management (admin) ───────────────────────────────────────────────
export const addUser    = (data)   => api.post('/admin/users', data);
export const removeUser = (userId) => api.delete(`/admin/users/${userId}`);

export default api;
