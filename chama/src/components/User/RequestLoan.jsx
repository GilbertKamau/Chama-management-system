import React, { useState } from 'react';
import { requestLoan } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const RequestLoan = () => {
  const { t } = useTranslation();
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
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>💰 {t('request_loan')}</h2>
      
      {message.text && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '1rem', 
          fontWeight: 600,
          background: message.type === 'success' ? '#e8f5e9' : message.type === 'warning' ? '#fff3e0' : '#ffebee',
          color: message.type === 'success' ? 'var(--success)' : message.type === 'warning' ? '#e65100' : 'var(--error)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : message.type === 'warning' ? '#ffb74d' : 'var(--error)'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('amount')} (KES)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('duration')} (Months)</label>
          <input
            type="number"
            value={paymentDuration}
            onChange={(e) => setPaymentDuration(e.target.value)}
            placeholder="e.g. 3"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Disbursement Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="2547XXXXXXXX"
            required
            style={{ width: '100%' }}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: '100%', padding: '12px' }}
        >
          {loading ? t('loading') + '...' : t('submit')}
        </button>
      </form>
    </div>
  );
};

export default RequestLoan;

export default RequestLoan;

