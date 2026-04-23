import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { getChamaSummary } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
    const { t, lang } = useTranslation();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getChamaSummary();
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching admin summary:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    const group = summary?.group;

    return (
        <div className="admin-home-container fade-in">
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <h1 className="animate-up">
                    {lang === 'sw' ? 'Muhtasari wa Admin' : 'Admin Overview'}
                </h1>
                <p className="text-secondary animate-up" style={{ animationDelay: '0.1s' }}>
                    {lang === 'sw' ? 'Karibu tena, hapa kuna muhtasari wa' : 'Welcome back, here is an overview for'} <strong>{group?.name}</strong>
                </p>
            </div>

            <div className="stats-grid stagger">
                {/* 1. Pending Loans */}
                <div className="card animate-up" style={{ borderTop: '4px solid var(--warning)' }}>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {lang === 'sw' ? 'Maombi ya Mikopo Yanayongoja' : 'Pending Loan Requests'}
                        </p>
                        <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'var(--gray-900)' }}>
                            {summary?.group?.pending_loan_count || 0}
                        </h2>
                        <button 
                            className="btn-secondary" 
                            onClick={() => navigate('/admin/approve-loan')}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {lang === 'sw' ? 'Hakiki Sasa' : 'Review Now'}
                        </button>
                    </div>
                </div>

                {/* 2. Overdue Members */}
                <div className="card animate-up" style={{ borderTop: '4px solid var(--error)' }}>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {lang === 'sw' ? 'Wanachama Waliochelewa' : 'Overdue Members'}
                        </p>
                        <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'var(--error)' }}>
                            {summary?.group?.overdue_count || 0}
                        </h2>
                        <button 
                            className="btn-secondary" 
                            onClick={() => navigate('/admin/manage-users')}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {lang === 'sw' ? 'Tazama Orodha' : 'View List'}
                        </button>
                    </div>
                </div>

                {/* 3. Group Pool */}
                <div className="card animate-up" style={{ borderTop: '4px solid var(--primary-color)' }}>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {lang === 'sw' ? 'Jumla ya Kikundi' : 'Group Pool'}
                        </p>
                        <h2 style={{ fontSize: '2.5rem', margin: '1rem 0', color: 'var(--primary-700)', fontWeight: 800 }}>
                            <small style={{ fontSize: '1rem', fontWeight: 600 }}>KES</small> {Number(group?.total_pool || 0).toLocaleString()}
                        </h2>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/admin/view-contributions')}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            {lang === 'sw' ? 'Ripoti ya Michango' : 'Contribution Reports'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="animate-up" style={{ marginTop: '3rem', textAlign: 'center', animationDelay: '0.4s' }}>
                <button 
                    className="btn-outline" 
                    onClick={() => navigate('/admin/settings')}
                    style={{ padding: '12px 48px' }}
                >
                    ⚙️ {lang === 'sw' ? 'Mipangilio ya Kikundi' : 'Group Settings'}
                </button>
            </div>
        </div>
    );
};

export default AdminHome;

