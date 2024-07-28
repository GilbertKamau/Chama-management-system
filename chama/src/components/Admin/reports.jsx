import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/report.php');
        setPayments(response.data.payments);
        setLoans(response.data.loans);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      <h3>Payments</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.user_id}</td>
              <td>{payment.amount}</td>
              <td>{payment.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Loans</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.user_id}</td>
              <td>{loan.amount}</td>
              <td>{loan.status}</td>
              <td>{loan.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;





