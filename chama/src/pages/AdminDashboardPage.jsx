import React from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import Logout from '../components/Auth/Logout';

const AdminDashboardPage = () => {
  return (
    <div>
      <AdminDashboard />
      <Logout />
    </div>
  );
};

export default AdminDashboardPage;