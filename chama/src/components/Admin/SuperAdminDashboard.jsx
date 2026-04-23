import React, { useEffect, useState } from 'react';
import { getAllChamas } from '../../services/api';
import './AdminLayout.css';

const SuperAdminDashboard = () => {
    const [chamas, setChamas]   = useState([]);
    const [stats, setStats]     = useState({ total_chamas: 0, total_users: 0, total_loans: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllChamas();
                setChamas(res.data.chamas || []);
                setStats(res.data.stats  || {});
            } catch (err) {
                setError('Failed to load system data. Ensure you are logged in as Super Admin.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    return (
        <div className="super-admin-wrapper fade-in" style={{ padding: '2rem' }}>
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <h1 className="animate-up">🌍 Global System Intelligence</h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    Monitoring all Chama groups, active members, and AI system health across the platform.
                </p>
            </div>

            {error && (
                <div className="auth-error animate-up" style={{ marginBottom: '2rem' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="stats-grid stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card animate-up" style={{ background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)', color: 'white', border: 'none' }}>
                    <p style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Groups</p>
                    <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'white' }}>{stats.total_chamas ?? chamas.length}</h2>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Active Chamas under management</div>
                </div>
                <div className="card animate-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Users</p>
                    <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'var(--primary-700)' }}>{stats.total_users ?? '—'}</h2>
                    <div className="badge approved" style={{ display: 'inline-flex', gap: '5px' }}>Verified Accounts</div>
                </div>
                <div className="card animate-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan Volume</p>
                    <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'var(--accent-gold)' }}>{stats.total_loans ?? '—'}</h2>
                    <div className="badge" style={{ display: 'inline-flex', gap: '5px' }}>Total Active Requests</div>
                </div>
            </div>

            <div className="card animate-up" style={{ animationDelay: '0.3s', padding: '0' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}>🛡️ Managed Chamas</h3>
                    <input 
                        type="text" 
                        placeholder="Search groups..." 
                        style={{ width: '250px', padding: '8px 16px', fontSize: '0.9rem', marginBottom: 0 }}
                    />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Chama Name</th>
                                <th>Members</th>
                                <th style={{ textAlign: 'center' }}>Constitution Status</th>
                                <th>System Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                        No Chama groups found.
                                    </td>
                                </tr>
                            ) : (
                                chamas.map((chama, i) => (
                                    <tr key={chama.id}>
                                        <td className="text-muted" style={{ fontSize: '0.8rem' }}>{i + 1}</td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: 'var(--primary-800)' }}>{chama.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>ID: {chama.id}</div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{chama.member_count ?? '—'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge ${chama.ai_analysis_status === 'uploaded' ? 'approved' : 'pending'}`}>
                                                {chama.ai_analysis_status === 'uploaded' ? '✅ Parsed' : '⏳ Missing'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge approved" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                                                Active
                                            </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            {new Date(chama.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .super-admin-wrapper {
                    background: #fdfdfd;
                    min-height: 100vh;
                }
            `}</style>
        </div>
    );
};

export default SuperAdminDashboard;
