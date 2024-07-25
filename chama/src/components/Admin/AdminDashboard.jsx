import React from 'react';
import ApproveLoan from './ApproveLoan';
import ManageUsers from './ManageUsers';
import ViewContributions from './ViewContributions';
import DisburseLoans from './DisburseLoans';
import AdminDashboard from './AdminDashboard.css';
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
    </div>
  );
};

export default AdminDashboard;