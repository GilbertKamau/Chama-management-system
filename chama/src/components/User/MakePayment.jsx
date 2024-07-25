import React, { useState } from 'react';
import axios from 'axios';

const MakePayment = () => {
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

    if (!user || !user.id) {
      setMessage('User not authenticated');
      return;
    }

    try {
      const response = await axios.post('http://localhost/chama-backend/api/payments.php', {
        user_id: user.id,
        amount,
        reference_number: referenceNumber,
        mobile_number: mobileNumber
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error making payment:', error);
      setMessage('Payment failed');
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Reference Number"
          required
        />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number"
          required
        />
        <button type="submit">Submit Payment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MakePayment;





