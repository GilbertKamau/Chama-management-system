import React, { useEffect, useState } from 'react';
import { getReports } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const Reports = () => {
    const { t, lang } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReports();
                setPayments(response.data.payments || []);
                setLoans(response.data.loans || []);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError(lang === 'sw' ? 'Imeshindwa kupata ripoti.' : 'Failed to fetch reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [lang]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    const totalContributions = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalLoans = loans.reduce((sum, l) => sum + (l.status === 'Disbursed' ? Number(l.amount) : 0), 0);

    return (
        <div className="reports-page fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="animate-up">📊 {t('generate_reports')}</h1>
                    <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                        {lang === 'sw' ? 'Muhtasari wa kifedha wa kikundi chako.' : 'Financial health summary and transaction history for your group.'}
                    </p>
                </div>
                <button onClick={handlePrint} className="btn-outline animate-up" style={{ animationDelay: '0.2s', padding: '10px 24px' }}>
                    🖨️ {lang === 'sw' ? 'Chapisha' : 'Print Report'}
                </button>
            </div>

            {error && (
                <div className="auth-error animate-up" style={{ marginBottom: '2rem' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="stats-grid stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card animate-up" style={{ borderLeft: '5px solid var(--primary-color)' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{lang === 'sw' ? 'Jumla ya Michango' : 'Total Contributions'}</p>
                    <h2 style={{ color: 'var(--primary-700)', margin: '0.5rem 0' }}>KES {totalContributions.toLocaleString()}</h2>
                    <span className="badge approved">{payments.length} {lang === 'sw' ? 'Miamala' : 'Entries'}</span>
                </div>
                <div className="card animate-up" style={{ borderLeft: '5px solid var(--accent-gold)', animationDelay: '0.1s' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{lang === 'sw' ? 'Mikopo Iliyotolewa' : 'Disbursed Loans'}</p>
                    <h2 style={{ color: 'var(--accent-gold)', margin: '0.5rem 0' }}>KES {totalLoans.toLocaleString()}</h2>
                    <span className="badge approved">{loans.filter(l => l.status === 'Disbursed').length} {lang === 'sw' ? 'Mikopo' : 'Loans'}</span>
                </div>
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.3s', padding: '0', marginBottom: '3rem' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)' }}>
                    <h3 style={{ marginBottom: 0 }}>💰 {t('contributions')}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{t('user')}</th>
                                <th>{t('amount')} (KES)</th>
                                <th>{t('date')}</th>
                                <th>{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{t('no_data')}</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td style={{ fontWeight: 600 }}>{payment.user?.email || `User #${payment.user_id}`}</td>
                                        <td style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{Number(payment.amount).toLocaleString()}</td>
                                        <td className="text-muted">{new Date(payment.created_at).toLocaleDateString()}</td>
                                        <td><span className="badge approved">Completed</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.4s', padding: '0' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)' }}>
                    <h3 style={{ marginBottom: 0 }}>💸 {t('loans')}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{t('user')}</th>
                                <th>{t('amount')} (KES)</th>
                                <th>{t('status')}</th>
                                <th>{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{t('no_data')}</td>
                                </tr>
                            ) : (
                                loans.map((loan) => (
                                    <tr key={loan.id}>
                                        <td style={{ fontWeight: 600 }}>{loan.user?.email || `User #${loan.user_id}`}</td>
                                        <td style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{Number(loan.amount).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${loan.status.toLowerCase()}`}>
                                                {t(loan.status.toLowerCase())}
                                            </span>
                                        </td>
                                        <td className="text-muted">{new Date(loan.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media print {
                    .sidebar, .header, .btn-outline { display: none !important; }
                    .main-content { margin: 0 !important; width: 100% !important; padding: 0 !important; }
                    .card { box-shadow: none !important; border: 1px solid #eee !important; }
                    .page-header { margin-bottom: 2rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Reports;
