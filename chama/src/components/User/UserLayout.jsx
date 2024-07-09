import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './UserLayout.css'; // Create and import the CSS file

const UserLayout = () => {
  return (
    <div className="user-layout">
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
