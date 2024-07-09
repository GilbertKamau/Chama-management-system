import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPayments = ({ isAdmin, userId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const url = isAdmin ? 'http://localhost/chama-backend/api/payments.php' : `http://localhost/chama-backend/api/payments.php?user_id=${userId}`;
        const response = await axios.get(url);

        if (Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Error fetching payments');
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, [isAdmin, userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{isAdmin ? 'All Payments' : 'Your Payments'}</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>{`Amount: ${payment.amount}, Date: ${payment.date}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPayments;

