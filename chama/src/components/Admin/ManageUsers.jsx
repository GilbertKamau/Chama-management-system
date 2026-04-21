import React, { useEffect, useState } from 'react';
import { getAllUsers, addUser, removeUser } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';

const ManageUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    try {
      const response = await addUser({ email, password });
      setMessage(t('upload_success'));
      setEmail('');
      setPassword('');
      fetchUsers(); // Refresh list
    } catch (error) {
      setMessage(error.response?.data?.message || t('upload_failed'));
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await removeUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}...</p>;

  return (
    <div className="card">
      <h2>👥 {t('manage_users')}</h2>
      
      <form onSubmit={handleAddUser} style={{ marginBottom: '2rem', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 25px' }}>
            {t('submit')}
          </button>
        </div>
        {message && <p style={{ marginTop: '10px', color: message.includes('success') ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{message}</p>}
      </form>

      <h3>📋 {t('existing_users')}</h3>
      <div style={{ marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--primary-color)' }}>
              <th style={th}>{t('user')}</th>
              <th style={th}>{t('role')}</th>
              <th style={th}>{t('date')}</th>
              <th style={th}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{user.email}</td>
                <td style={td}>
                   <span style={{ 
                     padding: '4px 10px', 
                     borderRadius: '20px', 
                     fontSize: '0.8rem', 
                     fontWeight: 600,
                     background: user.role === 'admin' ? '#e3f2fd' : '#f5f5f5',
                     color: user.role === 'admin' ? '#1565c0' : '#444'
                   }}>
                     {user.role}
                   </span>
                </td>
                <td style={td}>{new Date(user.created_at).toLocaleDateString()}</td>
                <td style={td}>
                  <button 
                    onClick={() => handleRemoveUser(user.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--error)', 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      textDecoration: 'underline'
                    }}
                  >
                    {t('reject')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const th = { padding: '12px 16px', textAlign: 'left', fontWeight: 600 };
const td = { padding: '12px 16px' };

export default ManageUsers;


