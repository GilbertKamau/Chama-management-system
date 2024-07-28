import React from 'react';
import UserDashboard from '../components/User/UserDashboard';
import Logout from '../components/Auth/Logout';
import Greeting from '../components/User/Greeting';
import { useAuth } from '../contexts/AuthContext';

const UserDashboardPage = () => {
  const { user } = useAuth(); // Get the user data from the AuthContext

  return (
    <div>
      {user && <Greeting email={user.email} />} {/* Display Greeting component if user is authenticated */}
      <UserDashboard />
      <Logout />
    </div>
  );
};

export default UserDashboardPage;
