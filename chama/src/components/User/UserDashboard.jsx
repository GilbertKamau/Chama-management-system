import React from 'react';
import MakePayment from './MakePayment';
import RequestLoan from './RequestLoan';
import ViewPayments from './ViewPayments';

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <MakePayment />
      <RequestLoan />
      <ViewPayments />
    </div>
  );
};

export default UserDashboard;