import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './UserLayout.css';

const UserLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-layout">
      <header className="user-header">
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <nav className="user-sidebar">
        <ul>
          <li><Link to="/user/make-payment">Make Payment</Link></li>
          <li><Link to="/user/request-loan">Request Loan</Link></li>
          <li><Link to="/user/view-payments">View Payments</Link></li>
        </ul>
      </nav>
      <main className="user-content">
        <Outlet /> {/* Render the selected component here */}
      </main>
    </div>
  );
};

export default UserLayout;

