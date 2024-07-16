import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
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

