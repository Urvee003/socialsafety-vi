// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    AlertTriangle,
    Map as MapIcon,
    Users,
    BarChart3,
    Settings,
    Shield
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },            //This makes sidebar dynamic, links the pages
        { path: '/alerts', icon: AlertTriangle, label: 'Alert Stream' },
        { path: '/map', icon: MapIcon, label: 'Map View' }, 
        { path: '/teams', icon: Users, label: 'Response Teams' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (                                     //displays app name
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Shield size={32} color="var(--accent-primary)" />  
                <span>SocialSafety</span>                               
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">UK</div>
                    <div className="user-info">
                        <div className="user-name">Urvi Kanade</div>
                        <div className="user-role">System Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;        //Makes this component usable in other files
