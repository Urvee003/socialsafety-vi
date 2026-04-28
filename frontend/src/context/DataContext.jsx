import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateAlertStatus = async (alertId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/alerts/${alertId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state immediately for instant UI feedback
                setAlerts(prev => prev.map(alert => 
                    alert.id === alertId ? { ...alert, status: newStatus } : alert
                ));
            }
        } catch (error) {
            console.error("Failed to update alert status:", error);
        }
    };

    useEffect(() => {
        // 1. Fetch Initial Data
        const fetchData = async () => {
            try {
                const alertsRes = await fetch(`${API_URL}/api/alerts`);
                const alertsData = await alertsRes.json();
                
                const teamsRes = await fetch(`${API_URL}/api/teams`);
                const teamsData = await teamsRes.json();

                setAlerts(Array.isArray(alertsData) ? alertsData : []);
                setTeams(Array.isArray(teamsData) ? teamsData : []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setLoading(false);
            }
        };

        fetchData();

        // 2. Setup Socket.io connection (resilient - won't crash if backend is offline)
        let socket;
        try {
            socket = io(API_URL, { reconnectionAttempts: 3, timeout: 5000 });
            socket.on('connect_error', (err) => console.warn('Socket connect error:', err.message));
            socket.on('newAlert', (newAlert) => {
    setAlerts(prevAlerts => {
        const updatedList = [newAlert, ...prevAlerts];
        return updatedList.slice(0, 30); // Always keep only the 30 most recent
    });
});
        } catch (err) {
            console.warn('Socket.io failed to initialize:', err);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return (
        <DataContext.Provider value={{ alerts, teams, loading, updateAlertStatus }}>
            {children}
        </DataContext.Provider>
    );
};
