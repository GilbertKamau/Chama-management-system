import React, { useState } from 'react';
import { initiateStkPush } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const MakePayment = () => {
    const { t, lang } = useTranslation();
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: lang === 'sw' ? 'Tafadhali angalia simu yako kwa ombi la PIN...' : 'Please check your phone for the M-Pesa PIN prompt...' });

        try {
            const response = await initiateStkPush({ amount, phone });
            
            if (response.data.ResponseCode === "0") {
                setStatus({ 
                    type: 'success', 
                    message: lang === 'sw' ? 'Ombi limetumwa! Ingiza PIN yako kwenye simu.' : 'Request sent! Complete the payment by entering your PIN on your phone.' 
                });
                setAmount('');
                setPhone('');
            } else {
                setStatus({ 
                    type: 'error', 
                    message: response.data.message || (lang === 'sw' ? 'Imefeli kuanzisha malipo.' : 'Failed to initiate payment.') 
                });
            }
        } catch (error) {
            console.error('STK Push Error:', error);
            setStatus({ 
                type: 'error', 
                message: lang === 'sw' ? 'Hitilafu ya mtandao. Jaribu tena.' : 'Network error. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="make-payment-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="animate-up">💳 {t('make_payment')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Tuma michango yako moja kwa moja kupitia M-Pesa.' : 'Send your contributions directly via M-Pesa STK Push.'}
                </p>
            </div>

            <div className="card animate-up" style={{ maxWidth: '500px', margin: '0 auto', animationDelay: '0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        background: 'var(--primary-50)', 
                        padding: '1.5rem', 
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px'
                    }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" style={{ width: '50px' }} />
                    </div>
                </div>

                {status.message && (
                    <div className={`auth-error scale-in ${status.type === 'success' ? 'text-success' : status.type === 'info' ? 'text-info' : ''}`} style={{ 
                        marginBottom: '1.5rem',
                        background: status.type === 'success' ? '#DCFCE7' : status.type === 'info' ? '#E0F2FE' : 'var(--error-bg)',
                        borderColor: status.type === 'success' ? '#BBF7D0' : status.type === 'info' ? '#BAE6FD' : '#FECACA',
                        color: status.type === 'success' ? 'var(--success)' : status.type === 'info' ? '#0369A1' : 'var(--error)'
                    }}>
                        <span>{status.type === 'success' ? '✅' : status.type === 'info' ? 'ℹ️' : '⚠️'}</span>
                        <span style={{ fontSize: '0.9rem' }}>{status.message}</span>
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
                                placeholder="500"
                                required
                                min="1"
                                style={{ paddingLeft: '55px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label>{lang === 'sw' ? 'Namba ya Simu ya M-Pesa' : 'M-Pesa Phone Number'}</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="07XXXXXXXX or 2547XXXXXXXX"
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
                                {lang === 'sw' ? 'Inatuma Ombi...' : 'Requesting PIN...'}
                            </span>
                        ) : (
                            lang === 'sw' ? 'Lipa Sasa' : 'Pay via M-Pesa'
                        )}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: '1.4' }}>
                        {lang === 'sw' 
                            ? 'Utapokea ilani ya papo hapo kwenye simu yako kuingiza PIN yako ya siri.' 
                            : 'Secure payment. You will receive an instant push notification on your phone to authorize with your PIN.'}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default MakePayment;
