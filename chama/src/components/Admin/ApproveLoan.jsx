import React, { useEffect, useState } from 'react';
import { getLoanRequests, approveLoan, rejectLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const statusColor = {
  Pending:  { bg: '#fff8e1', color: '#f57f17' },
  Approved: { bg: '#e8f5e9', color: '#2e7d32' },
  Rejected: { bg: '#fdecea', color: '#c62828' },
  Disbursed:{ bg: '#e3f2fd', color: '#1565c0' },
  flagged:  { bg: '#fce4ec', color: '#880e4f' },
};

const ApproveLoan = () => {
  const { t } = useTranslation();
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchLoans = async () => {
    try {
      const res = await getLoanRequests();
      setLoans(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch loan requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const updateStatus = async (id, action) => {
    try {
      if (action === 'approve') await approveLoan(id);
      else                      await rejectLoan(id);
      // optimistic update
      setLoans(prev =>
        prev.map(l => l.id === id ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected' } : l)
      );
    } catch {
      setError('Failed to update loan status.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card">
      <h2>📋 {t('loan_approval')}</h2>
      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

      {loans.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No loan requests found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
                <th style={th}>{t('applicant')}</th>
                <th style={th}>{t('amount')} (KES)</th>
                <th style={th}>{t('duration')}</th>
                <th style={th}>{t('date')}</th>
                <th style={th}>{t('status')}</th>
                <th style={th}>{t('ai_flag')}</th>
                <th style={th}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const s = statusColor[loan.status] || statusColor.Pending;
                return (
                  <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={td}>{loan.user?.email ?? `User #${loan.user_id}`}</td>
                    <td style={td}>{Number(loan.amount).toLocaleString()}</td>
                    <td style={td}>{loan.payment_duration} mo.</td>
                    <td style={td}>{new Date(loan.loan_date).toLocaleDateString()}</td>
                    <td style={td}>
                      <span style={{ ...badge, background: s.bg, color: s.color }}>
                        {t(loan.status.toLowerCase())}
                      </span>
                    </td>
                    <td style={td}>
                      {loan.flag_reason
                        ? <span title={loan.flag_reason} style={{ color: 'var(--error)', cursor: 'help', fontWeight: 600 }}>🚩 {t('flagged')}</span>
                        : <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ {t('ok')}</span>}
                    </td>
                    <td style={td}>
                      {loan.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-primary"
                            style={{ padding: '8px 16px', minHeight: 'auto', fontSize: '0.85rem' }}
                            onClick={() => updateStatus(loan.id, 'approve')}
                          >
                            {t('approve')}
                          </button>
                          <button
                            style={{ 
                              padding: '8px 16px', 
                              minHeight: 'auto', 
                              fontSize: '0.85rem',
                              background: 'var(--error)', 
                              color: '#fff', 
                              borderRadius: 'var(--border-radius)', 
                              border: 'none', 
                              cursor: 'pointer' 
                            }}
                            onClick={() => updateStatus(loan.id, 'reject')}
                          >
                            {t('reject')}
                          </button>
                        </div>
                      )}
                      {loan.status !== 'Pending' && (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '12px 16px' };
const badge = { padding: '4px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '0.8rem' };

export default ApproveLoan;
