// src/pages/Dashboard.jsx
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';
import { useData } from '../context/DataContext';

const Dashboard = () => {
    const { alerts, loading } = useData();

    if (loading) {
        return <div style={{ padding: '24px', color: 'white' }}>Loading live data...</div>;
    }

    // 1. Calculate KPIs dynamically
    const totalAlerts = alerts.length;
    const unassigned = alerts.filter(a => a.status === 'Unassigned').length;
    const inProgress = alerts.filter(a => a.status === 'In Progress').length;
    const resolved = alerts.filter(a => a.status === 'Resolved').length;

    // 2. Calculate Severity Distribution
    const severityCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    alerts.forEach(a => {
        if (severityCounts[a.severity] !== undefined) {
            severityCounts[a.severity]++;
        }
    });

    const severityData = [
        { name: 'Low', count: severityCounts.Low, fill: '#3b82f6' },
        { name: 'Medium', count: severityCounts.Medium, fill: '#f59e0b' },
        { name: 'High', count: severityCounts.High, fill: '#f97316' },
        { name: 'Critical', count: severityCounts.Critical, fill: '#ef4444' },
    ];

    // 3. Keep a simple dummy volume data for now, or calculate if timestamps are available
    const volumeData = [
        { time: '00:00', alerts: 10 },
        { time: '04:00', alerts: 15 },
        { time: '08:00', alerts: 45 },
        { time: '12:00', alerts: 80 },
        { time: '16:00', alerts: Math.floor(totalAlerts / 2) },
        { time: 'Now', alerts: totalAlerts },
    ];

    // Grab the latest 50 alerts for the stream
    const recentAlerts = alerts.slice(0, 50);

    return (
        <div className="dashboard-container">

            {/* LEFT SIDE: MAIN CONTENT */}
            <div className="main-panel">
                <h1 style={{ marginBottom: '32px' }}>Overview</h1>

                {/* 1. Top Level Metric Cards */}
                <div className="metrics-grid">
                    <div className="glass-panel metric-card">
                        <span className="metric-label">Total Alerts</span>
                        <span className="metric-value">{totalAlerts}</span>
                    </div>
                    <div className="glass-panel metric-card">
                        <span className="metric-label">Unassigned</span>
                        <span className="metric-value" style={{ color: '#f59e0b' }}>{unassigned}</span>
                    </div>
                    <div className="glass-panel metric-card">
                        <span className="metric-label">In Progress</span>
                        <span className="metric-value" style={{ color: '#3b82f6' }}>{inProgress}</span>
                    </div>
                    <div className="glass-panel metric-card">
                        <span className="metric-label">Resolved (24h)</span>
                        <span className="metric-value" style={{ color: '#10b981' }}>{resolved}</span>
                    </div>
                </div>

                {/* 2. Charts */}
                <div className="charts-grid">
                    {/* Bar Chart: Severity Distribution */}
                    <div className="glass-panel chart-container">
                        <h3 className="chart-title">Severity Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={severityData}>
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line Chart: 24h Volume */}
                    <div className="glass-panel chart-container">
                        <h3 className="chart-title">Alert Volume (24h)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="alerts"
                                    stroke="var(--accent-primary)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: LIVE ALERT STREAM */}
            <aside className="glass-panel alert-stream" style={{ padding: '24px' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                    Live Alert Stream
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentAlerts.map((alert, index) => (
                        <div key={alert.id || index} className="alert-item">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{alert.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(alert.created_at || Date.now()).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '-16px 0 8px 0' }}>
                                    {alert.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={`badge badge-${(alert.severity || '').toLowerCase()}`}>
                                    {alert.severity}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{alert.source}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

        </div>
    );
};

export default Dashboard;
