import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { getChamaSummary, getContributions } from '../../services/api';
import './UserLayout.css';

const UserDashboard = () => {
    const { t, lang } = useTranslation();
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, transactionsRes] = await Promise.all([
                    getChamaSummary(),
                    getContributions()
                ]);
                setSummary(summaryRes.data);
                setTransactions(transactionsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">{lang === 'sw' ? 'Inapakia...' : 'Loading...'}</div>;

    return (
        <div className="dashboard-wrapper">
            <h1 className="fade-in">{t('dashboard')} - {summary?.group?.name}</h1>

            <div className="stats-grid">
                {/* Personal Balance */}
                <div className="stats-card card animate-up">
                    <h3 style={{ color: 'var(--primary-color)' }}>👤 {lang === 'sw' ? 'Salio Langu' : 'My Personal Balance'}</h3>
                    <p className="amount" style={{ fontSize: '1.8rem' }}>KES {Number(summary?.personal?.balance || 0).toLocaleString()}</p>
                </div>

                {/* Group Total - THE TRANSPARENCY CARD */}
                <div className="stats-card card animate-up" style={{ animationDelay: '0.1s', borderTop: '4px solid var(--primary-color)' }}>
                    <h3 style={{ color: 'var(--primary-dark)' }}>🌍 {lang === 'sw' ? 'Jumla ya Chama' : 'Group Total Pool'}</h3>
                    <p className="amount" style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>KES {Number(summary?.group?.total_pool || 0).toLocaleString()}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('members')}: {summary?.group?.member_count}</p>
                </div>

                {/* Group Available */}
                <div className="stats-card card animate-up" style={{ animationDelay: '0.2s' }}>
                    <h3>💰 {lang === 'sw' ? 'Fedha Zilizopo' : 'Available for Loans'}</h3>
                    <p className="amount" style={{ color: 'var(--success)' }}>KES {Number(summary?.group?.available_pool || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="recent-activity card animate-up" style={{ animationDelay: '0.3s' }}>
                <h2>{lang === 'sw' ? 'Mchango ya Hivi Karibuni' : 'Your Recent Contributions'}</h2>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{lang === 'sw' ? 'Tarehe' : 'Date'}</th>
                                <th>{lang === 'sw' ? 'Kiasi' : 'Amount'}</th>
                                <th>{lang === 'sw' ? 'Hali' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td>KES {Number(tx.amount).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${tx.status}`}>
                                                {tx.status === 'flagged' ? '🚩 ' : ''}
                                                {tx.status}
                                            </span>
                                            {tx.status === 'flagged' && tx.flag_reason && (
                                                <div className="flag-tooltip">{tx.flag_reason}</div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="quick-actions">
                <button className="btn-primary" onClick={() => window.location.href = '/user/payment'}>{t('make_payment')}</button>
                <button className="btn-secondary" onClick={() => window.location.href = '/user/request-loan'}>{t('request_loan')}</button>
            </div>
        </div>
    );
};

export default UserDashboard;
