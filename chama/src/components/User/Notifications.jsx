import React, { useEffect, useState } from 'react';
import { getLoanRequests } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const Notifications = () => {
    const { t, lang } = useTranslation();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getLoanRequests();
                setLoans(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="notifications-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="animate-up">🔔 {t('notifications')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Endelea kupata habari kuhusu hali ya mkopo wako na shughuli za kikundi.' : 'Stay updated on your loan status and group activities.'}
                </p>
            </div>

            <div className="animate-up" style={{ maxWidth: '700px', animationDelay: '0.2s' }}>
                {loans.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {lang === 'sw' ? 'Hakuna taarifa mpya kwa sasa.' : 'No active notifications at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loans.map((loan) => (
                            <div key={loan.id} className="card notification-card" style={{ 
                                padding: '1.25rem',
                                borderLeft: `6px solid ${
                                    loan.status === 'Approved' ? 'var(--success)' : 
                                    (loan.status === 'flagged' || loan.status === 'Rejected') ? 'var(--error)' : 
                                    'var(--primary-color)'
                                }`,
                                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-800)' }}>
                                                {lang === 'sw' ? 'Ombi la Mkopo' : 'Loan Application'}
                                            </span>
                                            <span className={`badge ${loan.status.toLowerCase()}`}>
                                                {t(loan.status.toLowerCase())}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-900)' }}>
                                            KES {Number(loan.amount).toLocaleString()}
                                        </p>
                                        <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                                            {t('date')}: {new Date(loan.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', opacity: 0.3 }}>💰</div>
                                </div>

                                {loan.flag_reason && (
                                    <div style={{ 
                                        marginTop: '1rem', 
                                        padding: '0.75rem', 
                                        background: 'var(--error-bg)', 
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #FECACA',
                                        fontSize: '0.85rem',
                                        color: 'var(--error)',
                                        fontWeight: 600,
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center'
                                    }}>
                                        <span>⚠️</span>
                                        <span>{loan.flag_reason}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .notification-card:hover {
                    transform: translateX(8px);
                    box-shadow: var(--shadow-xl);
                }
            `}</style>
        </div>
    );
};

export default Notifications;
