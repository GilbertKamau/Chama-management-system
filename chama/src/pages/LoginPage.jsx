import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
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
      localStorage.setItem('token', access_token);
      login(user);

      if (user.role === 'super_admin') navigate('/super-admin');
      else if (user.role === 'admin')  navigate('/admin');
      else                             navigate('/user');
    } catch (err) {
      const msg = err.response?.data?.message || (lang === 'sw' ? 'Ingia imeshindwa. Angalia taarifa zako.' : 'Login failed. Check your credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const heroFeatures = lang === 'sw'
    ? [
        { icon: '🤖', text: 'Uhakiki wa miamala na AI' },
        { icon: '📱', text: 'Malipo ya M-Pesa na USSD' },
        { icon: '🔒', text: 'Usalama wa data kwa kila Chama' },
        { icon: '📊', text: 'Ripoti na uchambuzi wa papo hapo' },
      ]
    : [
        { icon: '🤖', text: 'AI-powered transaction validation' },
        { icon: '📱', text: 'M-Pesa & USSD payments' },
        { icon: '🔒', text: 'Per-Chama data isolation' },
        { icon: '📊', text: 'Real-time reports & analytics' },
      ];

  return (
    <div className="login-page">
      {/* ─── Hero Panel ─── */}
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-logo">🏦</div>
          <h1>Chama Management System</h1>
          <p>
            {lang === 'sw'
              ? 'Jukwaa la kisasa la kusimamia akiba, mikopo na michango ya kikundi chako.'
              : 'A modern platform to manage your group savings, loans, and contributions with AI intelligence.'}
          </p>
          <div className="hero-features">
            {heroFeatures.map((f, i) => (
              <div className="hero-feature" key={i}>
                <div className="hero-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Form Panel ─── */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="auth-lang-toggle">
            <button
              className="lang-switch-btn"
              onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
              type="button"
            >
              {lang === 'en' ? '🇰🇪 Swahili' : '🇬🇧 English'}
            </button>
          </div>

          <div className="form-heading">
            <h1>{lang === 'sw' ? 'Karibu tena' : 'Welcome back'}</h1>
            <p className="form-subtitle">
              {lang === 'sw' ? 'Ingia kwenye akaunti yako ya Chama.' : 'Sign in to your Chama account.'}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">{t('email')}</label>
              <div className="input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'sw' ? 'mfano@barua.com' : 'you@example.com'}
                  required
                  autoComplete="email"
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">{t('password')}</label>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <span className="input-icon">🔑</span>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  tabIndex={-1}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              className="btn-primary auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {lang === 'sw' ? 'Inaingia…' : 'Signing in…'}
                </span>
              ) : (
                t('login')
              )}
            </button>
          </form>

          <p className="auth-footer-link">
            {lang === 'sw' ? 'Huna akaunti?' : "Don't have an account?"}{' '}
            <Link to="/signup">{t('signup')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
