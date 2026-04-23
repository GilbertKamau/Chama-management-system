import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { getLoanRequests } from '../../services/api';
import './AdminLayout.css';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const res = await getLoanRequests();
                // Filter for flagged items specifically for this dashboard
                const flagged = res.data.filter(l => l.status === 'flagged' || l.flag_reason);
                setLoans(flagged);
            } catch (err) {
                console.error('Error fetching flags:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlags();
    }, []);

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="admin-dashboard-wrapper fade-in">
            <header className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 className="animate-up">🤖 {t('ai_flags')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {t('review_needed')}
                </p>
            </header>

            <div className="stats-grid stagger">
                <div className="stats-card card animate-up">
                    <h3>{t('ai_flags')}</h3>
                    <p className="amount" style={{ color: 'var(--error)' }}>{loans.length}</p>
                </div>
                <div className="card animate-up" style={{ animationDelay: '0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p className="text-muted">AI Trust Score</p>
                        <h3 style={{ color: 'var(--success)', margin: 0 }}>94%</h3>
                    </div>
                </div>
            </div>

            <div className="flagged-section card animate-up" style={{ animationDelay: '0.3s', padding: '0' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)' }}>
                    <h2 style={{ color: 'var(--error)', margin: 0, fontSize: '1.2rem' }}>🚩 {t('review_needed')}</h2>
                </div>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{t('user')}</th>
                                <th>{t('type')}</th>
                                <th>{t('amount')}</th>
                                <th>{t('flag_reason')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        ✅ All clear! No transactions flagged by AI.
                                    </td>
                                </tr>
                            ) : (
                                loans.map(item => (
                                    <tr key={item.id}>
                                        <td><strong>{item.user?.email || 'System'}</strong></td>
                                        <td><span className="badge pending">Loan</span></td>
                                        <td>KES {Number(item.amount).toLocaleString()}</td>
                                        <td><span className="text-error">{item.flag_reason || 'Manual Review Required'}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-small btn-primary">{t('review')}</button>
                                                <button className="btn-small btn-outline">{t('dismiss')}</button>
                                            </div>
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

export default AdminDashboard;