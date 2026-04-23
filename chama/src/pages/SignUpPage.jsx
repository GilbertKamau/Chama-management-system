import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/api';
import { useTranslation } from '../contexts/LanguageContext';
import './SignUpPage.css';

const SignUpPage = () => {
  const { t, lang, setLang } = useTranslation();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPwd, setShowPwd]           = useState(false);
  const [chamaName, setChamaName]       = useState('');
  const [isCreatingChama, setIsCreatingChama] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp({
        email,
        password,
        chama_name: isCreatingChama ? chamaName : null,
      });
      navigate('/user');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (lang === 'sw' ? 'Usajili umeshindwa. Jaribu tena.' : 'Sign-up failed. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps = lang === 'sw'
    ? [
        { num: '1', text: 'Unda akaunti yako' },
        { num: '2', text: 'Jiunge na Chama au unda kipya' },
        { num: '3', text: 'Anza kusimamia michango yako' },
      ]
    : [
        { num: '1', text: 'Create your account' },
        { num: '2', text: 'Join or start a new Chama' },
        { num: '3', text: 'Start managing your contributions' },
      ];

  return (
    <div className="signup-page">
      {/* ─── Hero Panel ─── */}
      <div className="signup-hero">
        <div className="signup-hero-content">
          <div className="signup-hero-icon">🚀</div>
          <h1>{lang === 'sw' ? 'Jiunge Nasi Leo' : 'Get Started Today'}</h1>
          <p>
            {lang === 'sw'
              ? 'Jisajili ndani ya dakika moja na uanze kusimamia Chama yako kwa urahisi.'
              : 'Sign up in under a minute and start managing your Chama with ease.'}
          </p>
          <div className="signup-steps">
            {steps.map((s, i) => (
              <div className="signup-step" key={i}>
                <div className="step-number">{s.num}</div>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Form Panel ─── */}
      <div className="signup-form-panel">
        <div className="signup-form-wrapper">
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
            <h1>{lang === 'sw' ? 'Fungua Akaunti' : 'Create Account'}</h1>
            <p className="form-subtitle">
              {lang === 'sw' ? 'Jaza taarifa zako hapa chini.' : 'Fill in your details to get started.'}
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
              <label htmlFor="signup-email">{t('email')}</label>
              <div className="input-wrapper">
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password">{t('password')}</label>
              <div className="input-wrapper">
                <input
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
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

            <div className="chama-toggle-section">
              <label className="chama-toggle-label">
                <input
                  type="checkbox"
                  checked={isCreatingChama}
                  onChange={(e) => setIsCreatingChama(e.target.checked)}
                />
                <span>{t('create_new')}</span>
              </label>

              {isCreatingChama && (
                <div className="chama-name-input">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div className="input-wrapper">
                      <input
                        id="signup-chama-name"
                        type="text"
                        value={chamaName}
                        onChange={(e) => setChamaName(e.target.value)}
                        placeholder={t('chama_name')}
                        required
                      />
                      <span className="input-icon">🏛️</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="signup-submit-btn"
              className="btn-primary auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {lang === 'sw' ? 'Inasajili…' : 'Creating account…'}
                </span>
              ) : (
                t('signup')
              )}
            </button>
          </form>

          <p className="auth-footer-link">
            {lang === 'sw' ? 'Tayari una akaunti?' : 'Already have an account?'}{' '}
            <Link to="/">{t('login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
