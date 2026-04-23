import React, { useState } from 'react';
import { uploadConstitution } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ConstitutionUpload = () => {
    const { t, lang } = useTranslation();
    const [file, setFile]       = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type !== 'application/pdf') {
            setMessage(lang === 'sw' ? 'Tafadhali chagua faili ya PDF inayofaa.' : 'Please select a valid PDF file.');
            setIsError(true);
            setFile(null);
            return;
        }
        setFile(selected);
        setMessage('');
        setIsError(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage(lang === 'sw' ? 'Tafadhali chagua faili kwanza.' : 'Please select a PDF file first.');
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('constitution', file);

        setLoading(true);
        setMessage('');

        try {
            await uploadConstitution(formData);
            setMessage(t('upload_success'));
            setIsError(false);
            setFile(null);
            e.target.reset();
        } catch (error) {
            const errMsg = error.response?.data?.message || t('upload_failed');
            setMessage(errMsg);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="constitution-upload-page fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="animate-up">📜 {t('constitution_upload')}</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' 
                        ? 'Pakia katiba ya kikundi chako ili Gemini AI iweze kuhakiki miamala yote.' 
                        : 'Upload your group constitution so Gemini AI can automatically validate all transactions against the rules.'}
                </p>
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.2s', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    background: 'var(--primary-50)',
                    border: '1px dashed var(--primary-300)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    transition: 'all var(--transition-base)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <p style={{ fontWeight: 600, color: 'var(--primary-800)', marginBottom: '0.5rem' }}>
                        {lang === 'sw' ? 'Bofya ili kuchagua PDF' : 'Click to select PDF'}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {lang === 'sw' ? 'Saizi ya juu: 10 MB' : 'Max file size: 10 MB'}
                    </p>
                    
                    <form onSubmit={handleUpload} id="upload-form" style={{ marginTop: '1.5rem' }}>
                        <input
                            id="constitution-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            style={{ 
                                opacity: 0, 
                                position: 'absolute', 
                                inset: 0, 
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                        <div style={{ pointerEvents: 'none' }}>
                            {file ? (
                                <div className="badge approved scale-in" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                    📎 {file.name}
                                </div>
                            ) : (
                                <button type="button" className="btn-secondary btn-small">
                                    {lang === 'sw' ? 'Chagua Faili' : 'Browse Files'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <button
                    form="upload-form"
                    className="btn-primary"
                    type="submit"
                    disabled={loading || !file}
                    style={{ width: '100%', height: '54px' }}
                >
                    {loading ? (
                        <span className="btn-loading">
                            <span className="spinner"></span>
                            {lang === 'sw' ? 'Inapakia...' : 'Uploading...'}
                        </span>
                    ) : (
                        lang === 'sw' ? 'Anza Kupakia' : 'Start Upload'
                    )}
                </button>

                {message && (
                    <div className={`auth-error scale-in ${!isError ? 'text-success' : ''}`} style={{ 
                        marginTop: '1.5rem', 
                        background: isError ? 'var(--error-bg)' : '#DCFCE7',
                        borderColor: isError ? '#FECACA' : '#BBF7D0',
                        color: isError ? 'var(--error)' : 'var(--success)'
                    }}>
                        <span>{isError ? '⚠️' : '✅'}</span>
                        <span>{message}</span>
                    </div>
                )}
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.3s', marginTop: '3rem', background: 'var(--primary-dark)', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>🤖</div>
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
                            {lang === 'sw' ? 'Hii inafanyaje kazi?' : 'How does this work?'}
                        </h4>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {lang === 'sw' 
                                ? 'Gemini AI inasoma katiba yako na kuelewa sheria za kikundi chako. Kila wakati mwanachama anapoomba mkopo au kulipa, AI itafananisha na sheria zako na kuweka alama ikiwa kuna kitu kisicho sawa.'
                                : 'Gemini AI reads your constitution and learns your group rules. Every time a member requests a loan or makes a payment, the AI verifies it against your rules and flags discrepancies automatically.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConstitutionUpload;
