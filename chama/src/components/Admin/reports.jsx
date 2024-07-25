import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch the report data
  const fetchReport = async (type) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost/chama-backend/api/report.php?type=${type}`);
      if (type === 'loans') {
        setLoans(Array.isArray(response.data) ? response.data : []);
      } else if (type === 'payments') {
        setPayments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      setError('Error fetching report');
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Reports</h2>
      <button 
        onClick={() => fetchReport('loans')} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Loan Report'}
      </button>
      <button 
        onClick={() => fetchReport('payments')} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Payment Report'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Loan Report</h3>
      {Array.isArray(loans) && loans.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Amount</th>
              <th>Payment Duration</th>
              <th>Mobile Number</th>
              <th>Status</th>
              <th>Loan Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.user_id}</td>
                <td>{loan.amount}</td>
                <td>{loan.payment_duration}</td>
                <td>{loan.mobile_number}</td>
                <td>{loan.status}</td>
                <td>{loan.loan_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans to display</p>
      )}

      <h3>Payment Report</h3>
      {Array.isArray(payments) && payments.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Amount</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.user_id}</td>
                <td>{payment.amount}</td>
                <td>{payment.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments to display</p>
      )}
    </div>
  );
};

export default Reports;





