import axios from 'axios';

const API_URL = 'http://localhost/chama-backend/api';

export const login = (credentials) => axios.post(`${API_URL}/auth.php`, { action: 'login', ...credentials });
export const signUp = (userData) => axios.post(`${API_URL}/auth.php`, { action: 'signup', ...userData });
export const makePayment = (paymentData) => axios.post(`${API_URL}/payments.php`, paymentData);
export const requestLoan = (loanData) => axios.post(`${API_URL}/loans.php`, loanData);
export const getPayments = (userId) => axios.get(`${API_URL}/payments.php?userId=${userId}`);
export const getLoanRequests = () => axios.get(`${API_URL}/loans.php`);
export const approveLoan = (loanId) => axios.post(`${API_URL}/loans.php/${loanId}/approve`);
export const addUser = (userData) => axios.post(`${API_URL}/users.php`, userData);
export const removeUser = (userId) => axios.delete(`${API_URL}/users.php`, { data: { userId } });
export const getContributions = () => axios.get(`${API_URL}/contributions.php`);

export default {
  login,
  signUp,
  makePayment,
  requestLoan,
  getPayments,
  getLoanRequests,
  approveLoan,
  addUser,
  removeUser,
  getContributions
};

