import React, { useState, useEffect } from 'react';
import { getMyChama, updateChamaSettings } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const PaymentSettings = () => {
    const { t, lang } = useTranslation();
    const [settings, setSettings] = useState({
        bank_name: '',
        bank_account: '',
        mpesa_shortcode: '',
        mpesa_passkey: '',
        mpesa_consumer_key: '',
        mpesa_consumer_secret: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getMyChama();
                const data = response.data;
                setSettings({
                    bank_name: data.bank_name || '',
                    bank_account: data.bank_account || '',
                    mpesa_shortcode: data.mpesa_shortcode || '',
                    mpesa_passkey: '',
                    mpesa_consumer_key: data.mpesa_consumer_key || '',
                    mpesa_consumer_secret: '',
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            await updateChamaSettings(settings);
            setMessage({ 
                text: lang === 'sw' ? 'Mipangilio imesasishwa kikamilifu!' : 'Settings updated successfully!', 
                type: 'success' 
            });
        } catch (error) {
            setMessage({ 
                text: lang === 'sw' ? 'Imeshindwa kusasisha. Angalia taarifa zako.' : 'Failed to update settings. Please check your inputs.', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="payment-settings-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="animate-up">⚙️ {lang === 'sw' ? 'Mipangilio ya Malipo' : 'Payment Settings'}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' 
                        ? 'Sanidi akaunti za benki na M-Pesa ambapo michango ya wanachama itatumwa.' 
                        : 'Configure the bank and M-Pesa accounts where member contributions will be settled.'}
                </p>
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.2s', maxWidth: '800px' }}>
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

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="settings-section" style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ background: 'var(--primary-50)', padding: '8px', borderRadius: '10px', fontSize: '1.2rem' }}>🏦</span>
                            {lang === 'sw' ? 'Taarifa za Benki' : 'Bank Details'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>{lang === 'sw' ? 'Jina la Benki' : 'Bank Name'}</label>
                                <input 
                                    type="text" 
                                    value={settings.bank_name}
                                    onChange={(e) => setSettings({...settings, bank_name: e.target.value})}
                                    placeholder="e.g. Equity Bank"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>{lang === 'sw' ? 'Namba ya Akaunti' : 'Account Number'}</label>
                                <input 
                                    type="text" 
                                    value={settings.bank_account}
                                    onChange={(e) => setSettings({...settings, bank_account: e.target.value})}
                                    placeholder="e.g. 1234567890"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="settings-section" style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ background: 'var(--primary-50)', padding: '8px', borderRadius: '10px', fontSize: '1.2rem' }}>📱</span>
                            {lang === 'sw' ? 'Taarifa za M-Pesa' : 'M-Pesa Credentials'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div className="form-group">
                                <label>{lang === 'sw' ? 'Namba ya Kupitishia' : 'Shortcode (Paybill/Till)'}</label>
                                <input 
                                    type="text" 
                                    value={settings.mpesa_shortcode}
                                    onChange={(e) => setSettings({...settings, mpesa_shortcode: e.target.value})}
                                    placeholder="e.g. 174379"
                                />
                            </div>
                            <div className="form-group">
                                <label>Consumer Key</label>
                                <input 
                                    type="text" 
                                    value={settings.mpesa_consumer_key}
                                    onChange={(e) => setSettings({...settings, mpesa_consumer_key: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Consumer Secret</label>
                                <input 
                                    type="password" 
                                    value={settings.mpesa_consumer_secret}
                                    onChange={(e) => setSettings({...settings, mpesa_consumer_secret: e.target.value})}
                                    placeholder={lang === 'sw' ? 'Wacha tupu kama huna mabadiliko' : 'Leave blank to keep current'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Lipa Na M-Pesa Passkey</label>
                                <input 
                                    type="password" 
                                    value={settings.mpesa_passkey}
                                    onChange={(e) => setSettings({...settings, mpesa_passkey: e.target.value})}
                                    placeholder={lang === 'sw' ? 'Wacha tupu kama huna mabadiliko' : 'Leave blank to keep current'}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--gray-200)', paddingTop: '2rem' }}>
                        <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '12px 48px' }}>
                            {saving ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    {lang === 'sw' ? 'Inahifadhi...' : 'Saving...'}
                                </span>
                            ) : (
                                lang === 'sw' ? 'Hifadhi Mipangilio' : 'Save Settings'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentSettings;
