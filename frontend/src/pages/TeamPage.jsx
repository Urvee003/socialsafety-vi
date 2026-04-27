// src/pages/TeamPage.jsx
import React from 'react';
import Button from '../components/Button';
import { useData } from '../context/DataContext';

const TeamPage = () => {
    const { teams, loading } = useData();

    if (loading) {
        return <div style={{ padding: '24px', color: 'white' }}>Loading response teams...</div>;
    }

    const toggleStatus = async (teamId, currentStatus) => {
        // In a complete app, you would make a PUT/PATCH request to Flask here
        // to update the status in Supabase, and then the context would update.
        alert(`This would update team ${teamId} status in the backend to ${currentStatus === 'Available' ? 'Dispatched' : 'Available'}`);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Response Teams</h1>
                <Button variant="primary" onClick={() => alert('Add new team dialog would open here')}>
                    Add New Team
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {teams.length === 0 && (
                    <div style={{ color: 'var(--text-secondary)' }}>No response teams found in the database.</div>
                )}
                {teams.map(team => (
                    <div key={team.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{team.name}</h3>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{team.type} Unit</span>
                            </div>
                            <span className={`badge badge-${team.status === 'Available' ? 'low' : 'high'}`}>
                                {team.status}
                            </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Currently Assigned Alerts</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>{team.assigned_alerts || 0}</div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                            <Button 
                                variant={team.status === 'Available' ? 'primary' : 'secondary'} 
                                style={{ flex: 1 }}
                                onClick={() => toggleStatus(team.id, team.status)}
                            >
                                {team.status === 'Available' ? 'Dispatch Team' : 'Recall Team'}
                            </Button>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
