import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MakePayment = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/chama-backend/api/payments.php', {
        user_id: user.id, // Send user ID
        amount,
        payment_reference: paymentReference,
        mobile_number: mobileNumber,
      });

      if (response.data.message === 'Payment recorded successfully') {
        setSuccess('Payment recorded successfully');
        setAmount('');
        setPaymentReference('');
        setMobileNumber('');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error making payment:', error);
      setError('An error occurred while making the payment');
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          placeholder="Payment Reference"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number"
          required
        />
        <button type="submit">Make Payment</button>
      </form>
    </div>
  );
};

export default MakePayment;







