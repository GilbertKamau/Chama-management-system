import React, { useEffect, useState } from 'react';
import { getLoanRequests, disburseLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const DisburseLoans = () => {
    const { t, lang } = useTranslation();
    const [loanRequests, setLoanRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [disbursingId, setDisbursingId] = useState(null);

    useEffect(() => {
        const fetchApprovedLoans = async () => {
            try {
                const response = await getLoanRequests();
                const approvedLoans = response.data.filter(loan => loan.status === 'Approved');
                setLoanRequests(approvedLoans);
            } catch (error) {
                console.error('Error fetching loan requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedLoans();
    }, []);

    const handleDisburse = async (loanId) => {
        setDisbursingId(loanId);
        setMessage({ text: '', type: '' });
        try {
            const response = await disburseLoan(loanId);
            if (response.data.message.includes('success')) {
                setLoanRequests(prevRequests =>
                    prevRequests.filter(request => request.id !== loanId)
                );
                setMessage({ text: t('upload_success'), type: 'success' });
            }
        } catch (error) {
            setMessage({ text: t('upload_failed'), type: 'error' });
        } finally {
            setDisbursingId(null);
        }
    };

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="disburse-loans-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="animate-up">💸 {t('disburse_loans')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Tuma pesa kwa wanachama ambao maombi yao ya mkopo yameidhinishwa.' : 'Release funds to members whose loan requests have been officially approved.'}
                </p>
            </div>

            {message.text && (
                <div className={`auth-error scale-in ${message.type === 'success' ? 'text-success' : ''}`} style={{ 
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? '#DCFCE7' : 'var(--error-bg)',
                    borderColor: message.type === 'success' ? '#BBF7D0' : '#FECACA',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--error)'
                }}>
                    <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="card animate-up" style={{ padding: '0', animationDelay: '0.2s' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}>{lang === 'sw' ? 'Mikopo Iliyoidhinishwa' : 'Approved Loans'}</h3>
                    <span className="badge approved">{loanRequests.length} {lang === 'sw' ? 'Tayari' : 'Ready'}</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>{t('applicant')}</th>
                                <th>{t('amount')} (KES)</th>
                                <th>{t('duration')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
                                        {lang === 'sw' ? 'Hakuna mikopo inayohitaji kutolewa kwa sasa.' : 'No loans ready for disbursement at this time.'}
                                    </td>
                                </tr>
                            ) : (
                                loanRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{request.user?.email || `User #${request.user_id}`}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>#{request.id}</div>
                                        </td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                                            {Number(request.amount).toLocaleString()}
                                        </td>
                                        <td>{request.payment_duration} {lang === 'sw' ? 'miezi' : 'mo.'}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDisburse(request.id)}
                                                className="btn-primary"
                                                disabled={disbursingId === request.id}
                                                style={{ minWidth: '120px' }}
                                            >
                                                {disbursingId === request.id ? (
                                                    <span className="btn-loading">
                                                        <span className="spinner"></span>
                                                        {lang === 'sw' ? 'Inatuma...' : 'Sending...'}
                                                    </span>
                                                ) : (
                                                    t('disburse')
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="animate-up" style={{ marginTop: '2rem', background: 'var(--primary-50)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', color: 'var(--primary-800)', display: 'flex', gap: '15px', alignItems: 'center', animationDelay: '0.3s' }}>
                <div style={{ fontSize: '1.5rem' }}>💡</div>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {lang === 'sw' ? 'Kubofya "Toa" kutaanzisha utumaji wa pesa papo hapo kupitia M-Pesa B2C kwa mwanachama.' : 'Clicking "Disburse" will trigger an instant M-Pesa B2C disbursement to the member\'s registered mobile number.'}
                </p>
            </div>
        </div>
    );
};

export default DisburseLoans;
