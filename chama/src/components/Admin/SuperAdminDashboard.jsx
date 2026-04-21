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

    if (loading) return <div className="loading">Loading System Stats...</div>;

    return (
        <div className="admin-dashboard-wrapper">
            <h1 className="fade-in">🌍 System-wide Overview</h1>
            {error && <p className="status-message error">{error}</p>}

            <div className="stats-grid">
                <div className="stats-card card animate-up">
                    <h3>Total Groups</h3>
                    <p className="amount">
                        {stats.total_chamas ?? chamas.length}
                    </p>
                </div>
                <div className="stats-card card animate-up" style={{ animationDelay: '0.1s' }}>
                    <h3>Global Users</h3>
                    <p className="amount">
                        {stats.total_users ?? '—'}
                    </p>
                </div>
                <div className="stats-card card animate-up" style={{ animationDelay: '0.2s' }}>
                    <h3>Total Loans</h3>
                    <p className="amount">
                        {stats.total_loans ?? '—'}
                    </p>
                </div>
            </div>

            <div className="recent-activity card animate-up" style={{ animationDelay: '0.3s' }}>
                <h2>Managed Chamas</h2>
                {chamas.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No Chama groups found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Chama Name</th>
                                    <th>Members</th>
                                    <th>Constitution Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamas.map((chama, i) => (
                                    <tr key={chama.id}>
                                        <td>{i + 1}</td>
                                        <td><strong>{chama.name}</strong></td>
                                        <td>{chama.member_count ?? '—'}</td>
                                        <td>
                                            <span className={`badge ${chama.ai_analysis_status === 'uploaded' ? 'approved' : 'flagged'}`}>
                                                {chama.ai_analysis_status}
                                            </span>
                                        </td>
                                        <td>{new Date(chama.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
