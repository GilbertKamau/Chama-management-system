import React, { useState } from 'react';
import axios from 'axios';

const MakePayment = () => {
  const [paymentReference, setPaymentReference] = useState('');
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/chama-backend/api/payments.php', {
        payment_reference: paymentReference,
        amount,
        mobile_number: mobileNumber
      });

      // Assuming your API returns a success message
      console.log(response.data.message); // Log the response message from the API

      // Show an alert indicating payment was successful
      alert('Payment successful!');

      // Clear input fields after successful payment
      setPaymentReference('');
      setAmount('');
      setMobileNumber('');

      // You can add additional logic here to record the payment details if needed

    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed. Please try again.'); // Alert if there's an error
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
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

