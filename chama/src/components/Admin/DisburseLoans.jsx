import React, { useState } from 'react';

const DisburseLoans = () => {
  const [mpesaNumber, setMpesaNumber] = useState('');

  const handleDisburse = (e) => {
    e.preventDefault();
    // Handle loan disbursement logic
  };

  return (
    <div>
      <h2>Disburse Loans</h2>
      <form onSubmit={handleDisburse}>
        <input type="text" value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} placeholder="Mpesa Number" />
        <button type="submit">Disburse Loan</button>
      </form>
    </div>
  );
};

export default DisburseLoans;