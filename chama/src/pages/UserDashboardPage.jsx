import React from 'react';
import UserDashboard from '../components/User/UserDashboard';
import Logout from '../components/Auth/Logout';

const UserDashboardPage = () => {
  return (
    <div>
      <UserDashboard />
      <Logout />
    </div>
  );
};

export default UserDashboardPage;