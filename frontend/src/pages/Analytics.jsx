// src/pages/Analytics.jsx
import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';
import { useData } from '../context/DataContext';

const AnalyticsPage = () => {
    const { alerts, loading } = useData();

    if (loading) return <div style={{ padding: '32px', color: 'white' }}>Loading analytics...</div>;

    // 1. Severity Distribution
    const severityData = [
        { name: 'Critical', value: alerts.filter(a => a.severity === 'Critical').length, color: '#ef4444' },
        { name: 'High', value: alerts.filter(a => a.severity === 'High').length, color: '#f97316' },
        { name: 'Medium', value: alerts.filter(a => a.severity === 'Medium').length, color: '#f59e0b' },
        { name: 'Low', value: alerts.filter(a => a.severity === 'Low').length, color: '#3b82f6' },
    ].filter(d => d.value > 0);

    // 2. Source Distribution (Updated with Instagram & Facebook)
    const sources = [...new Set(alerts.map(a => a.source))];
    const sourceColors = {
        'Twitter': '#1DA1F2',
        'Instagram': '#E4405F',
        'Facebook': '#1877F2',
        'WhatsApp': '#25D366',
        'SMS Gateway': '#6366f1',
        'Mobile App': '#ef4444'
    };

    const sourceData = sources.map(source => ({
        name: source,
        value: alerts.filter(a => a.source === source).length,
        color: sourceColors[source] || '#94a3b8'
    }));

    const historyData = [
        { day: 'Mon', alerts: 12, resolved: 10 },
        { day: 'Tue', alerts: 19, resolved: 15 },
        { day: 'Wed', alerts: 15, resolved: 14 },
        { day: 'Thu', alerts: 22, resolved: 18 },
        { day: 'Fri', alerts: 30, resolved: 25 },
        { day: 'Sat', alerts: 25, resolved: 20 },
        { day: 'Sun', alerts: alerts.length, resolved: Math.floor(alerts.length * 0.8) },
    ];

    return (
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '8px' }}>Safety Analytics</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Incident breakdown by platform source and severity levels.
            </p>

            <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                
                {/* 1. Source Distribution (Pie Chart) */}
                <div className="glass-panel chart-container" style={{ height: '400px' }}>
                    <h3 className="chart-title">Source Platform Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. Severity Breakdown (Smaller as requested) */}
                <div className="glass-panel chart-container" style={{ height: '400px' }}>
                    <h3 className="chart-title">Severity Breakdown</h3>
                    <div style={{ height: '300px', width: '100%' }}> {/* Constraining chart size */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={severityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Performance Trend */}
            <div className="glass-panel chart-container" style={{ marginTop: '24px', height: '380px' }}>
                <h3 className="chart-title">Incident Velocity (7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData}>
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <Tooltip />
                        <Area type="monotone" dataKey="alerts" stroke="#4f46e5" strokeWidth={3} fill="#4f46e520" />
                        <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fill="none" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsPage;
