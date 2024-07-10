import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisburseLoans = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [mpesaNumber, setMpesaNumber] = useState('');

  useEffect(() => {
    // Fetch loans that are approved and ready for disbursement
    const fetchApprovedLoans = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/loans.php');
        const approvedLoans = response.data.filter(loan => loan.status === 'Approved');
        setLoanRequests(approvedLoans);
      } catch (error) {
        console.error('Error fetching loan requests:', error);
      }
    };

    fetchApprovedLoans();
  }, []);

  const handleDisburse = async (loanId) => {
    try {
      const response = await axios.patch('http://localhost/chama-backend/api/loans.php', {
        id: loanId,
        mpesa_number: mpesaNumber,
      });
      if (response.data.message === 'Loan disbursed successfully') {
        // Update the state to reflect the disbursement
        setLoanRequests(prevRequests =>
          prevRequests.filter(request => request.id !== loanId)
        );
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error disbursing loan:', error);
    }
  };

  return (
    <div>
      <h2>Disburse Loans</h2>
      <ul>
        {loanRequests.map((request) => (
          <li key={request.id}>
            {`User: ${request.user_id}, Amount: ${request.amount}, Status: ${request.status}`}
            <input
              type="text"
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value)}
              placeholder="Mpesa Number"
            />
            <button onClick={() => handleDisburse(request.id)}>Disburse Loan</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisburseLoans;
