// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import MapView from './pages/MapView';
import TeamPage from './pages/TeamPage';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/SettingsPage';
import { DataProvider } from './context/DataContext';

const App = () => {
    return (
        <DataProvider>
            <Router>
                <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/alerts" element={<AlertsPage />} />
                            <Route path="/map" element={<MapView />} />
                            <Route path="/teams" element={<TeamPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </DataProvider>
    );
};

export default App;

