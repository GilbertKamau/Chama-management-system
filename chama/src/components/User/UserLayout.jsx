import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import Footer from '../Footer.jsx';
import './UserLayout.css';

const UserLayout = () => {
    const { logout, user } = useAuth();
    const { t, lang, setLang } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="user-layout">
            <header className="user-header">
                <div className="header-left">
                    <div className="user-avatar-mini">👤</div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>{t('dashboard')}</h2>
                        <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>{user?.email || 'Member'}</p>
                    </div>
                </div>

                <div className="header-right">
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="glass-selector"
                    >
                        <option value="en">English</option>
                        <option value="sw">Kiswahili</option>
                    </select>
                    <button onClick={handleLogout} className="logout-btn-minimal" title={t('logout')}>
                        <span className="icon">🚪</span>
                        <span className="text">{t('logout')}</span>
                    </button>
                </div>
            </header>

            <div className="user-body">
                <nav className="user-sidebar">
                    <div className="sidebar-brand">
                        <span className="brand-dot"></span>
                        <span>{lang === 'sw' ? 'Kikundi Chako' : 'Your Chama'}</span>
                    </div>

                    <ul>
                        <li>
                            <Link to="/user" className={location.pathname === '/user' ? 'active' : ''}>
                                <span className="icon">🏡</span> {t('home')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/make-payment" className={location.pathname === '/user/make-payment' ? 'active' : ''}>
                                <span className="icon">💳</span> {t('make_payment')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/request-loan" className={location.pathname === '/user/request-loan' ? 'active' : ''}>
                                <span className="icon">🏦</span> {t('request_loan')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/notifications" className={location.pathname === '/user/notifications' ? 'active' : ''}>
                                <span className="icon">🔔</span> {t('notifications')}
                            </Link>
                        </li>
                    </ul>
                    
                    <div className="sidebar-footer-info">
                        <div className="secure-badge">
                            🛡️ AI SECURE
                        </div>
                    </div>
                </nav>

                <main className="user-content">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default UserLayout;
