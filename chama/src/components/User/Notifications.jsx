import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const Notifications = () => {
  const { t } = useTranslation();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getLoanRequests();
        // Since getLoanRequests in the backend uses BelongsToChama, it will only return the user's loans
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>🔔 {t('notifications')}</h2>
      
      {loans.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          No active notifications.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
          {loans.map((loan) => (
            <div key={loan.id} style={{ 
              padding: '15px', 
              borderRadius: '8px', 
              background: 'var(--bg-color)',
              borderLeft: `5px solid ${loan.status === 'Approved' ? 'var(--success)' : loan.status === 'flagged' ? 'var(--error)' : 'var(--primary-color)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{t('loans')}</span>
                <span style={{ 
                   padding: '4px 12px', 
                   borderRadius: '20px', 
                   fontSize: '0.75rem', 
                   fontWeight: 700,
                   background: loan.status === 'Approved' ? '#e8f5e9' : loan.status === 'flagged' ? '#ffebee' : '#e3f2fd',
                   color: loan.status === 'Approved' ? 'var(--success)' : loan.status === 'flagged' ? 'var(--error)' : '#1565c0'
                }}>
                  {loan.status}
                </span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#666' }}>
                {t('amount')}: KES {Number(loan.amount).toLocaleString()} | {t('date')}: {new Date(loan.created_at).toLocaleDateString()}
              </p>
              {loan.flag_reason && (
                <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--error)', fontWeight: 600 }}>
                  ⚠️ {loan.flag_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
