// viewPayments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPayments = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        
        const response = await axios.get(`http://localhost/chama-backend/api/payments.php?user_id=${userId}`);
        console.log(response.data); // Log the response for debugging

        if (Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          setError(`Unexpected response format: ${JSON.stringify(response.data)}`);
        }
      } catch (err) {
        setError(`Error fetching payments: ${err.message}`);
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Payments</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>{`Amount: ${payment.amount}, Date: ${payment.date}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPayments;
