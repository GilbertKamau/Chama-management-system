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
import Notifications from './components/User/Notifications';
import RequestLoan from './components/User/RequestLoan';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Reports from './components/Admin/Reports';
import ConstitutionUpload from './components/Admin/ConstitutionUpload';
import PaymentSettings from './components/Admin/PaymentSettings';
import OnboardingWizard from './components/Admin/OnboardingWizard';
import AdminHome from './components/Admin/AdminHome';
import UserDashboard from './components/User/UserDashboard';
import SuperAdminDashboard from './components/Admin/SuperAdminDashboard';

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/user" element={<UserLayout />}>
            <Route index                 element={<UserDashboard />} />
            <Route path="make-payment"  element={<MakePayment />} />
            <Route path="request-loan"  element={<RequestLoan />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index                      element={<AdminHome />} />
            <Route path="approve-loan"        element={<ApproveLoan />} />
            <Route path="manage-users"        element={<ManageUsers />} />
            <Route path="view-contributions"  element={<ViewContributions />} />
            <Route path="disburse-loans"      element={<DisburseLoans />} />
            <Route path="reports"             element={<Reports />} />
            <Route path="constitution"        element={<ConstitutionUpload />} />
            <Route path="settings"            element={<PaymentSettings />} />
            <Route path="onboarding"          element={<OnboardingWizard />} />
          </Route>

          <Route path="/super-admin" element={<SuperAdminDashboard />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
