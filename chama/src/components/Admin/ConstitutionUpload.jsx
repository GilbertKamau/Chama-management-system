import React, { useState } from 'react';
import { uploadConstitution } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ConstitutionUpload = () => {
    const { t } = useTranslation();
    const [file, setFile]       = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type !== 'application/pdf') {
            setMessage('Please select a valid PDF file.');
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
            setMessage('Please select a PDF file first.');
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('constitution', file);

        setLoading(true);
        setMessage('');

        try {
            const response = await uploadConstitution(formData);
            setMessage(t('upload_success'));
            setIsError(false);
            setFile(null);
            // Reset the file input
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
        <div className="card constitution-upload">
            <h2>📄 {t('constitution_upload')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Upload your group's constitution as a PDF. Gemini AI will analyse it and
                automatically validate all future contributions and loan requests against the rules.
            </p>

            <div style={{
                background: 'rgba(34,139,34,0.06)',
                border: '1px dashed var(--primary-color)',
                borderRadius: 'var(--border-radius)',
                padding: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
            }}>
                ✅ Supported format: <strong>PDF only</strong> &nbsp;|&nbsp; Max size: <strong>10 MB</strong>
            </div>

            <form onSubmit={handleUpload}>
                <input
                    id="constitution-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ marginBottom: '1rem' }}
                />
                {file && (
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        📎 Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                    </p>
                )}
                <button
                    id="upload-constitution-btn"
                    className="btn-primary"
                    type="submit"
                    disabled={loading || !file}
                    style={{ width: '100%' }}
                >
                    {loading ? 'Uploading…' : `⬆ ${t('constitution_upload')}`}
                </button>
            </form>

            {message && (
                <p
                    className="status-message"
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--border-radius)',
                        background: isError ? '#fdecea' : '#e8f5e9',
                        color: isError ? 'var(--error)' : 'var(--success)',
                        fontWeight: 600,
                    }}
                >
                    {isError ? '❌ ' : '✅ '}{message}
                </p>
            )}
        </div>
    );
};

export default ConstitutionUpload;
