import React, { createContext, useContext, useState, useEffect } from 'react';            //createContext() → creates global data storage
                                                                                            //useContext() → reads that global data
                                                                                            //useState() → stores data (alerts, teams, etc.)
                                                                                            //useEffect() → runs code when component loads
import { io } from 'socket.io-client';                                                 //io() → connects to backend in real-time (WebSockets)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';                //Gets backend URL from environment, If not found → uses localhost

const DataContext = createContext();                                                    //Creates a global data container

export const useData = () => useContext(DataContext);                                   //Shortcut to access context

export const DataProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateAlertStatus = async (alertId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/alerts/${alertId}`, {            //Sends request to backend
                method: 'PATCH',                                                          //update only some data
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })                                //Sends new status
            });

            if (response.ok) {
                // Update local state immediately for instant UI feedback
                setAlerts(prev => prev.map(alert => 
                    alert.id === alertId ? { ...alert, status: newStatus } : alert            //Find the alert with the given ID and update its status without touching the rest.
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
            socket = io(API_URL, { reconnectionAttempts: 3, timeout: 5000 });                   //Connects to backend live
            socket.on('connect_error', (err) => console.warn('Socket connect error:', err.message));
            socket.on('newAlert', (newAlert) => {
    setAlerts(prevAlerts => {
        const updatedList = [newAlert, ...prevAlerts];                                    //When backend sends new alert, Add it to top of list
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
