// src/pages/AlertsPage.jsx
import React, { useState } from 'react';
import Button from '../components/Button';
import { useData } from '../context/DataContext';

const AlertsPage = () => {
    const { alerts, loading, updateAlertStatus } = useData();
    const [filterSev, setFilterSev] = useState('All');
    const [assigningId, setAssigningId] = useState(null);

    if (loading) {
        return <div style={{ padding: '24px', color: 'white' }}>Loading alert data...</div>;
    }

    // Filter Logic
    const filteredAlerts = alerts.filter(alert =>
        filterSev === 'All' ? true : alert.severity === filterSev
    );

    const handleAssignTeam = async (alertId, teamType) => {
        // 1. Call context to update status in Backend + Local State
        await updateAlertStatus(alertId, 'In Progress');
        
        console.log(`Assigning ${teamType} to Alert ${alertId}`);
        window.alert(`Dispatching ${teamType} Unit to incident #${alertId}. Status updated to 'In Progress'.`);
        setAssigningId(null);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '24px' }}>Alert Management</h1>

            {/* Filters */}
            <div className="filter-bar glass-panel" style={{ padding: '16px' }}>
                <select className="filter-select" onChange={(e) => setFilterSev(e.target.value)}>
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Location (Lat, Lng)</th>
                            <th>Source</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>No alerts found.</td>
                            </tr>
                        )}
                        {filteredAlerts.map(alert => (
                            <tr key={alert.id}>
                                <td>#{alert.id}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{alert.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {alert.description}
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {alert.lat?.toFixed(4)}, {alert.lng?.toFixed(4)}
                                </td>
                                <td>{alert.source}</td>
                                <td>
                                    <span className={`badge badge-${(alert.severity || '').toLowerCase()}`}>
                                        {alert.severity}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ 
                                        color: alert.status === 'In Progress' ? '#3b82f6' : 'var(--text-secondary)',
                                        fontWeight: alert.status === 'In Progress' ? '600' : '400'
                                    }}>
                                        {alert.status || 'Unassigned'}
                                    </span>
                                </td>
                                <td>{new Date(alert.created_at || Date.now()).toLocaleTimeString()}</td>
                                <td>
                                    {assigningId === alert.id ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <select 
                                                className="filter-select" 
                                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                onChange={(e) => handleAssignTeam(alert.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select Team...</option>
                                                <option value="Police">Police</option>
                                                <option value="Fire">Fire</option>
                                                <option value="Medical">Medical</option>
                                                <option value="Special Ops">Special Ops</option>
                                            </select>
                                            <Button variant="secondary" onClick={() => setAssigningId(null)}>×</Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant={alert.status === 'In Progress' ? 'secondary' : 'primary'}
                                            onClick={() => setAssigningId(alert.id)}
                                            disabled={alert.status === 'In Progress'}
                                        >
                                            {alert.status === 'In Progress' ? 'Assigned' : 'Assign Team'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlertsPage;
