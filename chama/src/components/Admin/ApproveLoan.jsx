import React from 'react';

const ApproveLoan = () => {
  // Mock loan requests
  const loanRequests = [
    { id: 1, user: 'User1', amount: 1000 },
    { id: 2, user: 'User2', amount: 2000 },
  ];

  const handleApprove = (id) => {
    // Handle loan approval logic
  };

  return (
    <div>
      <h2>Approve Loan</h2>
      <ul>
        {loanRequests.map((request) => (
          <li key={request.id}>
            {`User: ${request.user}, Amount: ${request.amount}`}
            <button onClick={() => handleApprove(request.id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApproveLoan;