import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { getChamaSummary, parseVoiceIntent, initiateStkPush } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './UserLayout.css';

const UserDashboard = () => {
    const { t, lang } = useTranslation();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getChamaSummary();
                const data = response.data;
                
                if (data.personal.role === 'admin' && !data.group.has_onboarded) {
                    navigate('/admin/onboarding');
                    return;
                }
                
                setSummary(data);
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];
                    setVoiceStatus(lang === 'sw' ? 'Inatafsiri sauti...' : 'Analyzing voice...');
                    try {
                        const res = await parseVoiceIntent(base64Audio);
                        handleVoiceAction(res.data);
                    } catch (err) {
                        setVoiceStatus(lang === 'sw' ? 'Hitilafu ya sauti.' : 'Voice error.');
                    }
                };
            };

            recorder.start();
            setIsRecording(true);
            setVoiceStatus(lang === 'sw' ? 'Inasikiliza... Achia ili kutuma.' : 'Listening... Release to send.');
        } catch (err) {
            alert("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleVoiceAction = (intent) => {
        if (intent.action === 'pay' && intent.amount) {
            const confirmed = window.confirm(lang === 'sw' ? `Unataka kulipa KES ${intent.amount}?` : `Do you want to pay KES ${intent.amount}?`);
            if (confirmed) initiateStkPush({ amount: intent.amount, phone: summary.personal.phone });
        } else {
            setVoiceStatus(intent.message || 'Intent unknown');
            setTimeout(() => setVoiceStatus(''), 5000);
        }
    };

    if (loading) return <div className="loading"><span className="spinner"></span></div>;

    const group = summary?.group;
    const personal = summary?.personal;

    return (
        <div className="user-dashboard-wrapper fade-in">
            {/* HERO - THREE NUMBERS */}
            <div className="hero-metrics-container animate-up">
                <div className="metric-item">
                    <label>{lang === 'sw' ? 'Salio Langu' : 'My Balance'}</label>
                    <span className="value">KES {Number(personal?.balance || 0).toLocaleString()}</span>
                </div>
                <div className="metric-item highlight">
                    <label>{lang === 'sw' ? 'Tarehe ya Malipo' : 'Next Due Date'}</label>
                    <span className="value">{group?.contribution_day || '-'}</span>
                    <small className="target-info">{lang === 'sw' ? 'Kiasi' : 'Target'}: KES {group?.contribution_amount}</small>
                </div>
                <div className="metric-item">
                    <label>{lang === 'sw' ? 'Jumla ya Kikundi' : 'Group Pool'}</label>
                    <span className="value">KES {Number(group?.total_pool || 0).toLocaleString()}</span>
                </div>
            </div>

            {/* ACTION - ONE BUTTON */}
            <div className="primary-action-section animate-up" style={{ animationDelay: '0.2s' }}>
                <button 
                    className="premium-pay-button" 
                    onClick={() => navigate('/user/make-payment')}
                >
                    <div className="btn-inner">
                        <span className="btn-text">{lang === 'sw' ? 'LIPA SASA' : 'PAY NOW'}</span>
                        <span className="btn-icon">💳</span>
                    </div>
                    <div className="btn-shimmer"></div>
                </button>
            </div>

            {/* VOICE INTERFACE */}
            <div className={`voice-interface-glass ${isRecording ? 'active' : ''} animate-up`} style={{ animationDelay: '0.4s' }}>
                {voiceStatus && <div className="voice-bubble fade-in">{voiceStatus}</div>}
                <button 
                    className="premium-mic-btn"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    title={lang === 'sw' ? 'Bonyeza kusema' : 'Push to speak'}
                >
                    <span className="mic-icon">🎤</span>
                </button>
                <p className="voice-hint">{lang === 'sw' ? 'Bonyeza na ushikilie' : 'Push and hold to speak'}</p>
            </div>

            <style>{`
                .user-dashboard-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3rem;
                    padding-bottom: 5rem;
                }
                .hero-metrics-container {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%);
                    color: white;
                    padding: 2.5rem 1.5rem;
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                }
                .metric-item { text-align: center; }
                .metric-item label { display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; margin-bottom: 0.5rem; }
                .metric-item .value { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; display: block; }
                .metric-item.highlight { background: rgba(255,255,255,0.1); padding: 1rem 1.5rem; border-radius: var(--radius-lg); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); }
                .target-info { font-size: 0.75rem; font-weight: 600; color: var(--accent-gold); display: block; margin-top: 0.25rem; }

                .premium-pay-button {
                    position: relative;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    border: none;
                    background: var(--primary-700);
                    color: white;
                    cursor: pointer;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(34, 139, 34, 0.3);
                    transition: all var(--transition-base);
                }
                .premium-pay-button:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 30px 60px rgba(34, 139, 34, 0.4); }
                .premium-pay-button:active { transform: scale(0.95); }
                .btn-inner { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 2; position: relative; }
                .btn-text { font-size: 1.5rem; font-weight: 900; letter-spacing: 0.05em; }
                .btn-icon { font-size: 2rem; }
                .btn-shimmer { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: rotate(45deg); animation: shimmer 3s infinite; }

                .voice-interface-glass { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
                .premium-mic-btn {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: var(--white);
                    border: 2px solid var(--primary-100);
                    color: var(--primary-700);
                    font-size: 1.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-lg);
                    transition: all var(--transition-base);
                }
                .voice-interface-glass.active .premium-mic-btn { background: var(--error); color: white; border-color: var(--error); transform: scale(1.2); box-shadow: 0 0 20px rgba(220, 38, 38, 0.5); animation: pulse 1.5s infinite; }
                .voice-bubble { background: var(--white); padding: 12px 24px; border-radius: var(--radius-full); box-shadow: var(--shadow-xl); border: 1px solid var(--gray-100); font-weight: 600; color: var(--primary-800); font-size: 0.9rem; }
                .voice-hint { font-size: 0.8rem; font-weight: 600; color: var(--gray-500); }
            `}</style>
        </div>
    );
};

export default UserDashboard;
