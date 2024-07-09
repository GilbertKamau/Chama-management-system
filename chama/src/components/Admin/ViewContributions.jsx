import React from 'react';

const ViewContributions = () => {
  // Mock contribution data
  const contributions = [
    { id: 1, user: 'User1', amount: 1000 },
    { id: 2, user: 'User2', amount: 2000 },
  ];

  return (
    <div>
      <h2>View Contributions</h2>
      <ul>
        {contributions.map((contribution) => (
          <li key={contribution.id}>{`User: ${contribution.user}, Amount: ${contribution.amount}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewContributions;