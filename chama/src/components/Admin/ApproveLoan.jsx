import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveLoan = () => {
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    // Fetch loan requests from the backend
    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/loans.php');
        setLoanRequests(response.data);
      } catch (error) {
        console.error('Error fetching loan requests:', error);
      }
    };

    fetchLoanRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put('http://localhost/chama-backend/api/loans.php', {
        id,
        status,
      });
      if (response.data.message === 'Loan status updated successfully') {
        // Update the state to reflect the new status
        setLoanRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === id ? { ...request, status } : request
          )
        );
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  const handleApprove = (id) => {
    handleUpdateStatus(id, 'Approved');
  };

  const handleDeny = (id) => {
    handleUpdateStatus(id, 'Denied');
  };

  return (
    <div>
      <h2>Approve Loan</h2>
      <ul>
        {loanRequests.map((request) => (
          <li key={request.id}>
            {`User: ${request.user_id}, Amount: ${request.amount}, Status: ${request.status}`}
            <button onClick={() => handleApprove(request.id)}>Approve</button>
            <button onClick={() => handleDeny(request.id)}>Deny</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApproveLoan;
