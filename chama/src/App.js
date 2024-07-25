import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminLayout from './components/Admin/AdminLayout';
import UserLayout from './components/User/UserLayout';
import ApproveLoan from './components/Admin/ApproveLoan';
import ManageUsers from './components/Admin/ManageUsers';
import ViewContributions from './components/Admin/ViewContributions';
import DisburseLoans from './components/Admin/DisburseLoans';
import MakePayment from './components/User/MakePayment';
import RequestLoan from './components/User/RequestLoan';
import { AuthProvider } from  './contexts/AuthContext';
import Reports from './components/Admin/Reports';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="make-payment" element={<MakePayment />} />
          <Route path="request-loan" element={<RequestLoan />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
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




