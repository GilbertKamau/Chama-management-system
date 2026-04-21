import React, { useState } from 'react';
import { makePayment } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const MakePayment = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await makePayment({
        amount,
        payment_reference: paymentReference,
        mobile_number: mobileNumber,
      });

      if (response.data.message.includes('success')) {
        setSuccess(t('upload_success'));
        setAmount('');
        setPaymentReference('');
        setMobileNumber('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error making payment:', err);
      setError(t('upload_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>💸 {t('make_payment')}</h2>
      
      {error && <p className="error-text" style={{ background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '1rem', color: 'var(--error)' }}>{error}</p>}
      {success && <p className="success-text" style={{ background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '1rem', color: 'var(--success)' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('amount')} (KES)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1000"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('description')} / Ref</label>
          <input
            type="text"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="M-Pesa Reference"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Phone Number</label>
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

export default MakePayment;

export default MakePayment;







