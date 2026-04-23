import React, { useState } from 'react';
import { updateChamaSettings, addUser } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const OnboardingWizard = () => {
    const { t, lang } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        contribution_amount: 500,
        contribution_frequency: 'monthly',
        contribution_day: '30',
        members: ''
    });
    const [loading, setLoading] = useState(false);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinish = async () => {
        setLoading(true);
        try {
            await updateChamaSettings({
                ...formData,
                has_onboarded: true
            });

            if (formData.members) {
                const phoneList = formData.members.split(',').map(p => p.trim());
                for (const phone of phoneList) {
                    if (phone) {
                        await addUser({ 
                            email: `${phone}@chama.com`, 
                            password: 'password123', 
                            phone_number: phone, 
                            role: 'user' 
                        });
                    }
                }
            }

            navigate('/admin');
        } catch (error) {
            console.error("Onboarding failed", error);
            alert(lang === 'sw' ? "Kuna tatizo limejitokeza. Tafadhali angalia mtandao wako." : "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-wizard-page fade-in">
            <div className="wizard-card card animate-up" style={{ maxWidth: '700px', margin: '3rem auto', overflow: 'hidden', padding: '0' }}>
                {/* Progress Header */}
                <div style={{ background: 'var(--primary-dark)', padding: '2.5rem 3rem', color: 'white', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontWeight: 700, opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            {t('step')} {step} {t('of')} 3
                        </p>
                        <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>
                            {step === 1 && t('group_identity')}
                            {step === 2 && t('money_rules')}
                            {step === 3 && t('invite_members')}
                        </h2>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${(step / 3) * 100}%`, transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)' }} />
                    </div>
                </div>

                <div style={{ padding: '3rem' }}>
                    {step === 1 && (
                        <div className="fade-in">
                            <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                {lang === 'sw' ? 'Jina hili litatumiwa kuitambulisha Chama yako kwa wanachama.' : 'Choose a name that reflects your group\'s spirit and purpose.'}
                            </p>
                            <div className="form-group">
                                <label htmlFor="chama-name">{t('chama_name')}</label>
                                <input 
                                    id="chama-name"
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Unity Women Group"
                                    style={{ fontSize: '1.25rem', height: '60px' }}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in">
                            <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                {lang === 'sw' ? 'Weka kanuni za msingi za michango kwa wanachama wako.' : 'Establish the baseline rules for member contributions and timelines.'}
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="form-group">
                                    <label>{lang === 'sw' ? 'Kiasi (KES)' : 'Contribution Amount (KES)'}</label>
                                    <input 
                                        type="number" 
                                        value={formData.contribution_amount}
                                        onChange={(e) => setFormData({...formData, contribution_amount: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{lang === 'sw' ? 'Mzunguko' : 'Frequency'}</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['weekly', 'monthly'].map(f => (
                                            <button 
                                                key={f}
                                                onClick={() => setFormData({...formData, contribution_frequency: f})}
                                                className={`btn-small ${formData.contribution_frequency === f ? 'btn-primary' : 'btn-outline'}`}
                                                style={{ flex: 1, padding: '10px' }}
                                            >
                                                {f === 'weekly' ? (lang === 'sw' ? 'Kila Wiki' : 'Weekly') : (lang === 'sw' ? 'Kila Mwezi' : 'Monthly')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>{formData.contribution_frequency === 'weekly' ? (lang === 'sw' ? 'Siku ya Mkutano' : 'Meeting Day') : (lang === 'sw' ? 'Siku ya Mwezi (1-31)' : 'Day of Month (1-31)')}</label>
                                <input 
                                    type="text" 
                                    value={formData.contribution_day}
                                    onChange={(e) => setFormData({...formData, contribution_day: e.target.value})}
                                    placeholder={formData.contribution_frequency === 'weekly' ? 'e.g. Monday' : 'e.g. 30'}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="fade-in">
                            <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                {lang === 'sw' ? 'Waingize wanachama wako wa kwanza. Wataongezwa moja kwa moja.' : 'Add your founding members. They will be registered and notified via SMS/WhatsApp.'}
                            </p>
                            <div className="form-group">
                                <label>{lang === 'sw' ? 'Namba za Simu (Zitenganishe kwa koma)' : 'Phone Numbers (Comma separated)'}</label>
                                <textarea 
                                    value={formData.members}
                                    onChange={(e) => setFormData({...formData, members: e.target.value})}
                                    placeholder="254712345678, 254787654321, 07XXXXXXXX"
                                    style={{ minHeight: '150px', lineHeight: '1.6' }}
                                />
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--primary-800)', fontSize: '0.9rem' }}>
                                    <span>💡</span>
                                    <span>{lang === 'sw' ? 'Wanachama wataweza kuingia kwa kutumia namba zao za simu na nenosiri: password123' : 'Members can log in using their phone numbers and default password: "password123"'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--gray-200)', paddingTop: '2.5rem' }}>
                        {step > 1 ? (
                            <button onClick={prevStep} className="btn-outline" style={{ padding: '12px 32px' }}>
                                ← {t('back')}
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button 
                                onClick={nextStep} 
                                className="btn-primary" 
                                disabled={step === 1 && !formData.name}
                                style={{ padding: '12px 48px' }}
                            >
                                {t('next')} →
                            </button>
                        ) : (
                            <button onClick={handleFinish} className="btn-primary" disabled={loading} style={{ padding: '12px 48px' }}>
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner"></span>
                                        {lang === 'sw' ? 'Inatayarisha...' : 'Setting up...'}
                                    </span>
                                ) : (
                                    t('finish_setup')
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                    {lang === 'sw' ? 'Pia unaweza kubadilisha kanuni hizi baadaye kwenye mipangilio.' : 'You can adjust these rules at any time in the group settings.'}
                </p>
            </div>
        </div>
    );
};

export default OnboardingWizard;
