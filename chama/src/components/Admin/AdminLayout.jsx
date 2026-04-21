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
          <h1>{t('admin_dashboard')}</h1>
          <p>{t('welcome_admin')}</p>
        </div>
        
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="toggle-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('simple_mode')}</label>
             <input 
               type="checkbox" 
               checked={isSimpleMode} 
               onChange={(e) => setIsSimpleMode(e.target.checked)} 
               style={{ width: 'auto', marginBottom: 0 }}
             />
          </div>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ width: 'auto', padding: '5px 10px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', marginBottom: 0 }}
          >
            <option value="en" style={{ color: '#000' }}>English</option>
            <option value="sw" style={{ color: '#000' }}>Kiswahili</option>
          </select>

          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', minHeight: 'auto' }}>
            {t('logout')}
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-sidebar">
          <ul>
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                📊 {t('dashboard')}
              </Link>
            </li>
            <li>
              <Link to="/admin/approve-loan" className={location.pathname === '/admin/approve-loan' ? 'active' : ''}>
                ✅ {t('loan_approval')}
              </Link>
            </li>
            <li>
              <Link to="/admin/constitution" className={location.pathname === '/admin/constitution' ? 'active' : ''}>
                📜 {t('constitution_upload')}
              </Link>
            </li>
            <li>
              <Link to="/admin/manage-users" className={location.pathname === '/admin/manage-users' ? 'active' : ''}>
                👥 {t('manage_users')}
              </Link>
            </li>
            <li>
              <Link to="/admin/view-contributions" className={location.pathname === '/admin/view-contributions' ? 'active' : ''}>
                💰 {t('view_contributions')}
              </Link>
            </li>
            <li>
              <Link to="/admin/disburse-loans" className={location.pathname === '/admin/disburse-loans' ? 'active' : ''}>
                💸 {t('disburse_loans')}
              </Link>
            </li>
            <li>
              <Link to="/admin/reports" className={location.pathname === '/admin/reports' ? 'active' : ''}>
                📈 {t('generate_reports')}
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

