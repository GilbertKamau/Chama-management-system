import React, { useEffect, useState } from 'react';
import { getLoanRequests, disburseLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const DisburseLoans = () => {
  const { t } = useTranslation();
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchApprovedLoans = async () => {
      try {
        const response = await getLoanRequests();
        const approvedLoans = response.data.filter(loan => loan.status === 'Approved');
        setLoanRequests(approvedLoans);
      } catch (error) {
        console.error('Error fetching loan requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedLoans();
  }, []);

  const handleDisburse = async (loanId) => {
    try {
      const response = await disburseLoan(loanId);
      if (response.data.message.includes('success')) {
        setLoanRequests(prevRequests =>
          prevRequests.filter(request => request.id !== loanId)
        );
        setMessage(t('upload_success'));
      }
    } catch (error) {
      setMessage(t('upload_failed'));
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card">
      <h2>💸 {t('disburse_loans')}</h2>
      {message && <p style={{ color: message.includes('success') ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{message}</p>}

      {loanRequests.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No loans ready for disbursement.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
                <th style={th}>{t('applicant')}</th>
                <th style={th}>{t('amount')} (KES)</th>
                <th style={th}>{t('duration')}</th>
                <th style={th}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loanRequests.map((request) => (
                <tr key={request.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{request.user?.email || `User #${request.user_id}`}</td>
                  <td style={td}>{Number(request.amount).toLocaleString()}</td>
                  <td style={td}>{request.payment_duration} mo.</td>
                  <td style={td}>
                    <button 
                      onClick={() => handleDisburse(request.id)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', minHeight: 'auto' }}
                    >
                      {t('disburse')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '12px 16px' };

export default DisburseLoans;
