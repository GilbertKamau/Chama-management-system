import React, { useEffect, useState } from 'react';
import { getAllUsers, addUser, removeUser } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ManageUsers = () => {
  const { t, lang } = useTranslation();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    try {
      await addUser({ email, password });
      setMessage(t('upload_success'));
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || t('upload_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm(lang === 'sw' ? 'Una uhakika unataka kuondoa mtumiaji huyu?' : 'Are you sure you want to remove this user?')) return;
    try {
      await removeUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  if (loading) return <div className="loading"><span className="spinner"></span></div>;

  return (
    <div className="manage-users-page fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="animate-up">👥 {t('manage_users')}</h1>
        <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
          {lang === 'sw' ? 'Ongeza na dhibiti wanachama wa kikundi chako.' : 'Add and manage your group members.'}
        </p>
      </div>

      <div className="card animate-up" style={{ animationDelay: '0.2s', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{lang === 'sw' ? 'Sajili Mtumiaji Mpya' : 'Register New User'}</h3>
        <form onSubmit={handleAddUser} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="user-email">{t('email')}</label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                style={{ marginBottom: 0 }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="user-password">{t('password')}</label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ marginBottom: 0 }}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ minHeight: '52px' }}>
              {isSubmitting ? <span className="spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff' }}></span> : t('submit')}
            </button>
          </div>
          {message && (
            <p className={`fade-in ${message.includes('success') || message.includes('kikamilifu') ? 'text-success' : 'text-error'}`} style={{ marginTop: '1rem' }}>
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="card animate-up" style={{ animationDelay: '0.3s', padding: '0' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: 0 }}>📋 {t('existing_users')}</h3>
          <span className="badge approved">{users.length} {t('total_members')}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('user')}</th>
                <th>{t('role')}</th>
                <th>{t('date')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    {t('no_data')}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{user.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'approved' : ''}`} style={{ background: user.role === 'admin' ? 'var(--primary-100)' : 'var(--gray-100)', color: user.role === 'admin' ? 'var(--primary-800)' : 'var(--gray-700)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveUser(user.id)}
                        className="btn-small btn-danger"
                        style={{ padding: '6px 12px', minHeight: 'auto' }}
                      >
                        {t('remove')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
