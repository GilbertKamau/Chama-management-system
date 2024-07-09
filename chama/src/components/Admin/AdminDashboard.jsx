import React from 'react';
import ApproveLoan from './ApproveLoan';
import ManageUsers from './ManageUsers';
import ViewContributions from './ViewContributions';
import DisburseLoans from './DisburseLoans';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ApproveLoan />
      <ManageUsers />
      <ViewContributions />
      <DisburseLoans />
    </div>
  );
};

export default AdminDashboard;