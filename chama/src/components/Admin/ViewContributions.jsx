import React, { useEffect, useState } from 'react';
import { getContributions } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ViewContributions = () => {
  const { t } = useTranslation();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getContributions();
        setContributions(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError('Failed to load contributions.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card">
      <h2>💰 {t('view_contributions')}</h2>
      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

      {contributions.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No contributions recorded yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
                <th style={th}>{t('member')}</th>
                <th style={th}>{t('amount')} (KES)</th>
                <th style={th}>{t('date')}</th>
                <th style={th}>{t('description')}</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{c.user?.email ?? `User #${c.user_id}`}</td>
                  <td style={td}>{Number(c.amount).toLocaleString()}</td>
                  <td style={td}>{new Date(c.contribution_date ?? c.created_at).toLocaleDateString()}</td>
                  <td style={td}>{c.description || '—'}</td>
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
const badge = { padding: '4px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '0.8rem' };

export default ViewContributions;
