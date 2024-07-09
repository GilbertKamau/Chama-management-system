import React from 'react';
import axios from 'axios';

const Reports = () => {
  const generateReport = async (type) => {
    try {
      const response = await axios.get(`http://localhost/chama-backend/api/report.php?type=${type}`, {
        responseType: 'blob', // Important to handle binary data
      });

      // Create a URL for the file and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `loan_report_${new Date().toISOString().split('T')[0]}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <h2>Generate Reports</h2>
      <button onClick={() => generateReport('pdf')}>Generate PDF Report</button>
      <button onClick={() => generateReport('excel')}>Generate Excel Report</button>
    </div>
  );
};

export default Reports;
