import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminLayout from './components/Admin/AdminLayout';
import UserLayout from './components/User/UserLayout';
import ApproveLoan from './components/Admin/ApproveLoan';
import ManageUsers from './components/Admin/ManageUsers';
import ViewContributions from './components/Admin/ViewContributions';
import DisburseLoans from './components/Admin/DisburseLoans';
import Reports from './components/Admin/reports';
import MakePayment from './components/User/MakePayment';
import RequestLoan from './components/User/RequestLoan';
import ViewPayments from './components/User/ViewPayments';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="make-payment" element={<MakePayment />} />
          <Route path="request-loan" element={<RequestLoan />} />
          <Route path="view-payments" element={<ViewPayments />} />
        </Route>
        <Route path="/" element={<AdminLayout />}>
          <Route path="approve-loan" element={<ApproveLoan />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="view-contributions" element={<ViewContributions />} />
          <Route path="disburse-loans" element={<DisburseLoans />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;



