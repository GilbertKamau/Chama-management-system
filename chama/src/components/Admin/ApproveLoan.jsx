import React, { useEffect, useState } from 'react';
import { getLoanRequests, approveLoan, rejectLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ApproveLoan = () => {
  const { t, lang } = useTranslation();
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchLoans = async () => {
    try {
      const res = await getLoanRequests();
      setLoans(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(lang === 'sw' ? 'Imeshindwa kupata maombi ya mkopo.' : 'Failed to fetch loan requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const updateStatus = async (id, action) => {
    try {
      if (action === 'approve') await approveLoan(id);
      else                      await rejectLoan(id);
      setLoans(prev =>
        prev.map(l => l.id === id ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected' } : l)
      );
    } catch {
      setError(lang === 'sw' ? 'Imeshindwa kusasisha hali ya mkopo.' : 'Failed to update loan status.');
    }
  };

  if (loading) return <div className="loading"><span className="spinner"></span></div>;

  return (
    <div className="approve-loan-page fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="animate-up">📋 {t('loan_approval')}</h1>
        <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
          {lang === 'sw' ? 'Hakiki na uidhinishe maombi ya mikopo yaliyoletwa na wanachama.' : 'Review and approve loan requests submitted by members.'}
        </p>
      </div>

      {error && (
        <div className="auth-error animate-up" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="card animate-up" style={{ padding: '0', animationDelay: '0.2s' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: 0 }}>{lang === 'sw' ? 'Maombi Yanayongoja' : 'Pending Requests'}</h3>
          <span className="badge approved">{loans.filter(l => l.status === 'Pending').length} {lang === 'sw' ? 'Yanayongoja' : 'Pending'}</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('applicant')}</th>
                <th>{t('amount')} (KES)</th>
                <th>{t('duration')}</th>
                <th>{t('date')}</th>
                <th>{t('status')}</th>
                <th>{t('ai_flag')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📂</div>
                    {lang === 'sw' ? 'Hakuna maombi ya mkopo yaliyopatikana.' : 'No loan requests found.'}
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{loan.user?.email ?? `User #${loan.user_id}`}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      {Number(loan.amount).toLocaleString()}
                    </td>
                    <td>{loan.payment_duration} {lang === 'sw' ? 'miezi' : 'mo.'}</td>
                    <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {new Date(loan.loan_date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${loan.status.toLowerCase()}`}>
                        {t(loan.status.toLowerCase())}
                      </span>
                    </td>
                    <td>
                      {loan.flag_reason ? (
                        <div className="badge flagged" title={loan.flag_reason}>
                          🚩 {t('flagged')}
                          <div className="flag-tooltip">{loan.flag_reason}</div>
                        </div>
                      ) : (
                        <div className="badge approved">
                          ✅ {t('ok')}
                        </div>
                      )}
                    </td>
                    <td>
                      {loan.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-small btn-primary"
                            onClick={() => updateStatus(loan.id, 'approve')}
                          >
                            {t('approve')}
                          </button>
                          <button
                            className="btn-small btn-danger"
                            onClick={() => updateStatus(loan.id, 'reject')}
                          >
                            {t('reject')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApproveLoan;
