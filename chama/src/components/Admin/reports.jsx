import React, { useEffect, useState } from 'react';
import { getReports } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const Reports = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        setPayments(response.data.payments);
        setLoans(response.data.loans);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card">
      <h2>📈 {t('generate_reports')}</h2>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h3>💰 {t('contributions')}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
                <th style={th}>{t('user')}</th>
                <th style={th}>{t('amount')} (KES)</th>
                <th style={th}>{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{payment.user?.email || `User #${payment.user_id}`}</td>
                  <td style={td}>{Number(payment.amount).toLocaleString()}</td>
                  <td style={td}>{new Date(payment.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3>💸 {t('loans')}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
                <th style={th}>{t('user')}</th>
                <th style={th}>{t('amount')} (KES)</th>
                <th style={th}>{t('status')}</th>
                <th style={th}>{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{loan.user?.email || `User #${loan.user_id}`}</td>
                  <td style={td}>{Number(loan.amount).toLocaleString()}</td>
                  <td style={td}>{t(loan.status.toLowerCase())}</td>
                  <td style={td}>{new Date(loan.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '12px 16px' };

export default Reports;





