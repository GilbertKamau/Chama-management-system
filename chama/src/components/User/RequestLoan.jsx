import React, { useState } from 'react';
import { requestLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const RequestLoan = () => {
    const { t, lang } = useTranslation();
    const [amount, setAmount] = useState('');
    const [paymentDuration, setPaymentDuration] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await requestLoan({
                amount,
                payment_duration: paymentDuration,
                mobile_number: mobileNumber
            });

            if (response.data.message.includes('success')) {
                setMessage({ 
                    text: response.data.ai_flagged ? t('flagged') : t('upload_success'), 
                    type: response.data.ai_flagged ? 'warning' : 'success' 
                });
                setAmount('');
                setPaymentDuration('');
                setMobileNumber('');
            } else {
                setMessage({ text: response.data.message, type: 'error' });
            }

        } catch (error) {
            console.error('Error requesting loan:', error);
            setMessage({ text: t('upload_failed'), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-loan-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="animate-up">💰 {t('request_loan')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Omba mkopo kutoka kwa akiba ya kikundi chako.' : 'Request a loan from your group savings pool.'}
                </p>
            </div>

            <div className="card animate-up" style={{ maxWidth: '600px', margin: '0 auto', animationDelay: '0.2s' }}>
                <div style={{ 
                    background: 'var(--primary-dark)', 
                    padding: '2rem', 
                    borderRadius: 'var(--radius-lg)', 
                    color: 'white',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{lang === 'sw' ? 'Njia salama ya mkopo' : 'Secure Loan Access'}</h3>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {lang === 'sw' 
                                ? 'Mikopo yote inahakikiwa na Gemini AI na kuidhinishwa na viongozi wa kikundi.' 
                                : 'All loans are verified by Gemini AI and approved by group administrators for your security.'}
                        </p>
                    </div>
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '6rem', opacity: 0.1, transform: 'rotate(-15deg)' }}>⚖️</div>
                </div>

                {message.text && (
                    <div className={`auth-error scale-in ${message.type === 'success' ? 'text-success' : message.type === 'warning' ? 'text-warning' : ''}`} style={{ 
                        marginBottom: '1.5rem',
                        background: message.type === 'success' ? '#DCFCE7' : message.type === 'warning' ? '#FEF3C7' : 'var(--error-bg)',
                        borderColor: message.type === 'success' ? '#BBF7D0' : message.type === 'warning' ? '#FDE68A' : '#FECACA',
                        color: message.type === 'success' ? 'var(--success)' : message.type === 'warning' ? '#92400E' : 'var(--error)'
                    }}>
                        <span>{message.type === 'success' ? '✅' : message.type === 'warning' ? '⚠️' : '⚠️'}</span>
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>{t('amount')} (KES)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--gray-400)' }}>KES</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="5000"
                                required
                                style={{ paddingLeft: '55px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{lang === 'sw' ? 'Muda wa kulipa (Miezi)' : 'Payment Duration (Months)'}</label>
                        <input
                            type="number"
                            value={paymentDuration}
                            onChange={(e) => setPaymentDuration(e.target.value)}
                            placeholder="e.g. 3"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>{lang === 'sw' ? 'Nambari ya Simu ya Kupokelea (M-Pesa)' : 'Disbursement Mobile Number (M-Pesa)'}</label>
                        <input
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="2547XXXXXXXX"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner"></span>
                                {lang === 'sw' ? 'Inatuma...' : 'Submitting Request...'}
                            </span>
                        ) : (
                            lang === 'sw' ? 'Tuma Ombi la Mkopo' : 'Submit Loan Request'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestLoan;
