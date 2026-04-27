// src/pages/MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '../context/DataContext';

// Helper to get color based on severity
const getSeverityColor = (severity) => {
    switch (severity) {
        case 'Critical': return '#ef4444'; // Red
        case 'High': return '#f97316';     // Orange
        case 'Medium': return '#f59e0b';   // Amber
        case 'Low': return '#3b82f6';      // Blue
        default: return '#9ca3af';         // Gray
    }
};

const MapView = () => {
    const { alerts, loading } = useData();

    if (loading) {
        return <div style={{ padding: '24px', color: 'white' }}>Loading map data...</div>;
    }

    // Filter out alerts that don't have valid coordinates
    const mapData = alerts.filter(alert => alert.lat && alert.lng);

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 48px)' }}>
            <h1 style={{ marginBottom: '24px' }}>Geographic Alert Map</h1>

            <div className="glass-panel" style={{ height: '80%', width: '100%', padding: '8px' }}>
                <MapContainer
                    center={[19.7515, 75.7139]} // Maharashtra, India
                    zoom={7}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                >
                    {/* Dark themed map tiles (CartoDB Dark Matter) */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {mapData.map(alert => (
                        <CircleMarker 
                            key={alert.id} 
                            center={[alert.lat, alert.lng]} 
                            radius={8}
                            pathOptions={{
                                fillColor: getSeverityColor(alert.severity),
                                color: 'white',
                                weight: 2,
                                fillOpacity: 0.8
                            }}
                        >
                            <Popup>
                                <div style={{ padding: '8px', minWidth: '150px' }}>
                                    <h3 style={{ margin: 0, color: '#0f1115' }}>{alert.title}</h3>
                                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#475569' }}>
                                        {alert.description}
                                    </p>
                                    <p style={{ margin: '8px 0 0 0', color: getSeverityColor(alert.severity), fontWeight: 'bold' }}>
                                        Severity: {alert.severity}
                                    </p>
                                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>
                                        Source: {alert.source}
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapView;
