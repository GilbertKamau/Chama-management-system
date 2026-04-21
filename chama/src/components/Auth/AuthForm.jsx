import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, setLang } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiLogin({ email, password });
      const { access_token, user } = response.data;

      // Save the Sanctum token for the axios interceptor
      localStorage.setItem('token', access_token);

      // Update AuthContext (triggers role-based redirect)
      login(user);

      // Redirect based on role
      if (user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-lang-toggle">
          <button
            className="btn-secondary"
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            type="button"
          >
            {lang === 'en' ? '🇰🇪 Swahili' : '🇬🇧 English'}
          </button>
        </div>

        <h1>{t('login')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {t('welcome')}
        </p>

        {error && (
          <p style={{
            color: 'var(--error)',
            background: '#fdecea',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '1rem',
            fontWeight: 600
          }}>
            ❌ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            required
            autoComplete="email"
          />
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            required
            autoComplete="current-password"
          />
          <button
            id="login-submit-btn"
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in…' : t('login')}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          {lang === 'en' ? "Don't have an account?" : 'Huna akaunti?'}{' '}
          <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
