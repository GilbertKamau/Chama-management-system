import React, { useState } from 'react';
import axios from 'axios';

const RequestLoan = () => {
  const [amount, setAmount] = useState('');
  const [paymentDuration, setPaymentDuration] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = 1; // Replace with actual user ID from context or state

    try {
      const response = await axios.post('http://localhost/chama-backend/api/loans.php', {
        user_id: userId,
        amount,
        payment_duration: paymentDuration,
        mobile_number: mobileNumber
      });

      // Log the response from PHP backend
      console.log(response.data.message);

      // Show an alert indicating loan request was successful
      alert('Loan request successful!');

      // Clear input fields after successful loan request
      setAmount('');
      setPaymentDuration('');
      setMobileNumber('');

    } catch (error) {
      console.error('Error:', error);
      alert('Loan request failed. Please try again.'); // Alert if there's an error
    }
  };

  return (
    <div>
      <h2>Request Loan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="number"
          value={paymentDuration}
          onChange={(e) => setPaymentDuration(e.target.value)}
          placeholder="Payment Duration (months)"
          required
        />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number"
          required
        />
        <button type="submit">Request Loan</button>
      </form>
    </div>
  );
};

export default RequestLoan;

