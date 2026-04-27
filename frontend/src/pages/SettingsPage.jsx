// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { MessageCircle, Smartphone, ShieldCheck, Save } from 'lucide-react';
import Button from '../components/Button';

// Inline SVG brand icons (removed from lucide-react v1+)
const TwitterIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const InstagramIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4.5"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill={color}/>
    </svg>
);

const FacebookIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const SettingsPage = () => {
    const [sources, setSources] = useState({
        twitter: true, instagram: true, facebook: true,
        whatsapp: true, sms: true, app: true
    });

    const toggleSource = (key) => setSources(prev => ({ ...prev, [key]: !prev[key] }));
    const handleSave = () => window.alert("Alert Source Configuration Saved!");

    const configItems = [
        { id: 'twitter',   name: 'Twitter / X',            desc: 'Monitor hashtags: #SOS, #Help, #Emergency', icon: TwitterIcon,   color: '#0f172a', bg: '#f1f5f9' },
        { id: 'instagram', name: 'Instagram',               desc: 'Monitor public posts and stories',          icon: InstagramIcon, color: '#E4405F', bg: '#fff1f2' },
        { id: 'facebook',  name: 'Facebook',                desc: 'Monitor public posts',                      icon: FacebookIcon,  color: '#1877F2', bg: '#f0f7ff' },
        { id: 'whatsapp',  name: 'WhatsApp Tip Line',       desc: 'Dedicated emergency reporting number',      icon: MessageCircle, color: '#25D366', bg: '#f0fff4' },
        { id: 'sms',       name: 'SMS Gateway',             desc: 'Emergency text message hotline',            icon: Smartphone,    color: '#6366f1', bg: '#f5f3ff' },
        { id: 'app',       name: 'SocialSafety Mobile App', desc: 'Dedicated emergency reporting app',         icon: ShieldCheck,   color: '#ef4444', bg: '#fff1f1' },
    ];

    return (
        <div style={{ padding: '48px 32px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
                Alert Source Configuration
            </h1>
            <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '1rem' }}>
                Configure which platforms to monitor for distress signals
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {configItems.map((item) => (
                    <div key={item.id} style={{
                        padding: '16px 24px', background: '#ffffff',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: '16px', border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                width: '56px', height: '56px', background: item.bg,
                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <item.icon size={24} color={item.color} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>{item.name}</div>
                                <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                            </div>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={sources[item.id]} onChange={() => toggleSource(item.id)} />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} style={{ padding: '12px 32px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={18} />
                        <span>Save Configuration</span>
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;
