import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/api';
import { useTranslation } from '../contexts/LanguageContext';

const SignUp = () => {
  const { t, lang, setLang, isSimpleMode, setIsSimpleMode } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chamaName, setChamaName] = useState('');
  const [isCreatingChama, setIsCreatingChama] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({ 
        email, 
        password, 
        chama_name: isCreatingChama ? chamaName : null 
      });
      navigate('/user');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container card animate-up">
        <div className="accessibility-controls">
          <button className="btn-secondary" onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}>
            {lang === 'en' ? 'Swahili' : 'English'}
          </button>
          <button className="btn-secondary" onClick={() => setIsSimpleMode(!isSimpleMode)}>
            {isSimpleMode ? 'Modern Mode' : t('simple_mode')}
          </button>
        </div>

        <h2>{t('signup')}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password')}
            required
          />
          
          <div className="chama-option">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={isCreatingChama} 
                onChange={(e) => setIsCreatingChama(e.target.checked)} 
              />
              <span className="checkmark"></span>
              {t('create_new')}
            </label>
          </div>

          {isCreatingChama && (
            <input
              type="text"
              value={chamaName}
              onChange={(e) => setChamaName(e.target.value)}
              placeholder={t('chama_name')}
              className="fade-in"
              required
            />
          )}

          <button className="btn-primary" type="submit">{t('submit')}</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
