import React from 'react';
import ApproveLoan from './ApproveLoan';
import ManageUsers from './ManageUsers';
import ViewContributions from './ViewContributions';
import DisburseLoans from './DisburseLoans';
import AdminDashboard from './AdminDashboard.css';
import Reports from './Reports'


const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ApproveLoan />
      <hr />
      <ManageUsers />
      <hr />
      <ViewContributions />
      <hr />
      <DisburseLoans />
      <hr />
      <Reports />
    </div>
  );
};

export default AdminDashboard;