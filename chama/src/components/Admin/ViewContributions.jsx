import React, { useEffect, useState } from 'react';
import { getContributions } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ViewContributions = () => {
    const { t, lang } = useTranslation();
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getContributions();
                setContributions(Array.isArray(res.data) ? res.data : []);
            } catch {
                setError(lang === 'sw' ? 'Imeshindwa kupakia michango.' : 'Failed to load contributions.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [lang]);

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="view-contributions-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="animate-up">💰 {t('view_contributions')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Orodha ya michango yote iliyofanywa na wanachama.' : 'History of all contributions made by group members.'}
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
                    <h3 style={{ marginBottom: 0 }}>{lang === 'sw' ? 'Miamala ya Hivi Karibuni' : 'Recent Transactions'}</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <span className="badge approved" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '0.6rem' }}>●</span> {contributions.length} {lang === 'sw' ? 'Michango' : 'Total Entries'}
                        </span>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{t('member')}</th>
                                <th>{t('amount')} (KES)</th>
                                <th>{t('date')}</th>
                                <th>{t('description')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contributions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💸</div>
                                        {lang === 'sw' ? 'Hakuna michango iliyorekodiwa bado.' : 'No contributions recorded yet.'}
                                    </td>
                                </tr>
                            ) : (
                                contributions.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{c.user?.email ?? `User #${c.user_id}`}</div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                                            {Number(c.amount).toLocaleString()}
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            {new Date(c.contribution_date ?? c.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span style={{ opacity: c.description ? 1 : 0.4 }}>
                                                {c.description || (lang === 'sw' ? 'Hakuna maelezo' : 'No description')}
                                            </span>
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

export default ViewContributions;
