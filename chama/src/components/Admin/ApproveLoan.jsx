import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveLoan = () => {
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/loans.php');
        if (Array.isArray(response.data)) {
          setLoanRequests(response.data);
        } else {
          console.error('Invalid data format:', response.data);
          setLoanRequests([]);
        }
      } catch (error) {
        console.error('Error fetching loan requests:', error);
        setLoanRequests([]);
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
        setLoanRequests((prevRequests) =>
          prevRequests.map((request) =>
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
      {loanRequests.length > 0 ? (
        <ul>
          {loanRequests.map((request) => (
            <li key={request.id}>
              {`User: ${request.user_id}, Amount: ${request.amount}, Status: ${request.status}`}
              <button onClick={() => handleApprove(request.id)}>Approve</button>
              <button onClick={() => handleDeny(request.id)}>Deny</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No loan requests available.</p>
      )}
    </div>
  );
};

export default ApproveLoan;

