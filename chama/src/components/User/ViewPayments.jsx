import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ViewPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User ID is required');
        }

        const response = await axios.get(`http://localhost/chama-backend/api/payments.php?user_id=${user.id}`);
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

    if (user && user.id) {
      fetchPayments();
    }
  }, [user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Payments</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>{`Amount: ${payment.amount}, Date: ${payment.payment_date}, Reference: ${payment.reference_number}, Mobile: ${payment.mobile_number}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPayments;




