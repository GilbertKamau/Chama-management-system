import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <ul>
          <li><Link to="/admin/approve-loan">Approve Loan</Link></li>
          <li><Link to="/admin/manage-users">Manage Users</Link></li>
          <li><Link to="/admin/view-contributions">View Contributions</Link></li>
          <li><Link to="/admin/disburse-loans">Disburse Loans</Link></li>
          <li><Link to="/admin/reports">Generate Reports</Link></li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet /> {/* Render the selected component here */}
      </main>
    </div>
  );
};

export default AdminLayout;
