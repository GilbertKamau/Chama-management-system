import React from 'react';
import MakePayment from './MakePayment';
import RequestLoan from './RequestLoan';
import Notifications from './Notifications';
import UserDashboard from './UserDashboard.css';
const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <MakePayment />
      <RequestLoan />
      <Notifications />
    </div>
  );
};

export default UserDashboard;