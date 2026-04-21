import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import './AdminLayout.css';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ members: 0, totalLoans: 0, flaggedCount: 0 });
    const [flaggedItems, setFlaggedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching
        setTimeout(() => {
            setStats({ members: 42, totalLoans: 12, flaggedCount: 3 });
            setFlaggedItems([
                { id: 101, type: 'Loan', user: 'John Doe', amount: 50000, reason: 'Exceeds max loan limit' },
                { id: 102, type: 'Contribution', user: 'Jane Smith', amount: 50, reason: 'Below minimum contribution' },
            ], 800);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="loading">{t('loading_admin')}</div>;

    return (
        <div className="admin-dashboard-wrapper">
            <h1 className="fade-in">{t('admin_overview')}</h1>

            <div className="stats-grid">
                <div className="stats-card card animate-up">
                    <h3>{t('total_members')}</h3>
                    <p className="amount">{stats.members}</p>
                </div>
                <div className="stats-card card animate-up" style={{ animationDelay: '0.1s' }}>
                    <h3>{t('active_loans')}</h3>
                    <p className="amount">{stats.totalLoans}</p>
                </div>
                <div className="stats-card card animate-up" style={{ animationDelay: '0.2s' }}>
                    <h3>{t('ai_flags')} 🚩</h3>
                    <p className="amount" style={{ color: 'var(--error)' }}>{stats.flaggedCount}</p>
                </div>
            </div>

            <div className="flagged-section card animate-up" style={{ animationDelay: '0.3s' }}>
                <h2 style={{ color: 'var(--error)' }}>{t('review_needed')}</h2>
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
                            {flaggedItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.user}</td>
                                    <td>{t(item.type.toLowerCase())}</td>
                                    <td>KES {item.amount.toLocaleString()}</td>
                                    <td><span className="text-error">{item.reason}</span></td>
                                    <td>
                                        <button className="btn-small btn-primary">{t('review')}</button>
                                        <button className="btn-small btn-secondary" style={{ marginLeft: '5px' }}>{t('dismiss')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;