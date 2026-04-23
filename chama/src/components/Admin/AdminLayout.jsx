import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import './AdminLayout.css';
import Footer from '../Footer.jsx';

const AdminLayout = () => {
    const { logout } = useAuth();
    const { t, lang, setLang, isSimpleMode, setIsSimpleMode } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-left">
                    <div className="logo-section">
                        <span className="logo-icon">🛡️</span>
                    </div>
                    <div>
                        <h1>{t('admin_dashboard')}</h1>
                        <p className="welcome-text">{t('welcome_admin')}</p>
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="status-badge live">
                        <span className="dot"></span> System Live
                    </div>

                    <div className="control-group">
                        <div className="toggle-container" title={t('simple_mode')}>
                            <span className="toggle-label">{t('simple_mode')}</span>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={isSimpleMode} 
                                    onChange={(e) => setIsSimpleMode(e.target.checked)} 
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

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
                </div>
            </header>

            <div className="admin-body">
                <nav className="admin-sidebar">
                    <div className="sidebar-brand">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="Auth" style={{ height: '18px', opacity: 0.8, filter: 'brightness(0) invert(1)' }} />
                        <span>Chama Intelligence</span>
                    </div>
                    
                    <div className="sidebar-title">Management</div>
                    <ul>
                        <li>
                            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                                <span className="icon">📊</span> {t('dashboard')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/approve-loan" className={location.pathname === '/admin/approve-loan' ? 'active' : ''}>
                                <span className="icon">✅</span> {t('loan_approval')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/disburse-loans" className={location.pathname === '/admin/disburse-loans' ? 'active' : ''}>
                                <span className="icon">💸</span> {t('disburse_loans')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/manage-users" className={location.pathname === '/admin/manage-users' ? 'active' : ''}>
                                <span className="icon">👥</span> {t('manage_users')}
                            </Link>
                        </li>
                    </ul>

                    <div className="sidebar-title">Foundation</div>
                    <ul>
                        <li>
                            <Link to="/admin/constitution" className={location.pathname === '/admin/constitution' ? 'active' : ''}>
                                <span className="icon">📜</span> {t('constitution_upload')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/view-contributions" className={location.pathname === '/admin/view-contributions' ? 'active' : ''}>
                                <span className="icon">💰</span> {t('view_contributions')}
                            </Link>
                        </li>
                    </ul>

                    <div className="sidebar-title">Reporting & Config</div>
                    <ul>
                        <li>
                            <Link to="/admin/reports" className={location.pathname === '/admin/reports' ? 'active' : ''}>
                                <span className="icon">📈</span> {t('generate_reports')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>
                                <span className="icon">⚙️</span> {t('payments')}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
            <Footer /> 
        </div>
    );
};

export default AdminLayout;
