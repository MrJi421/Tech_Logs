import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../css/Dashboard.css';

const Dashboard = () => {
    const { user, handleLogout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    if (!user) return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="user-profile">
                    <div className="profile-image">
                        {user.profile.profile_pic_url ? (
                            <img 
                                src={user.profile.profile_pic_url} 
                                alt={user.profile.full_name || user.username}
                            />
                        ) : (
                            <div className="profile-placeholder">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h2>{user.profile.full_name || user.username}</h2>
                        <p className="user-email">{user.email}</p>
                        {user.profile.location && (
                            <p className="user-location">
                                <i className="fas fa-map-marker-alt"></i> 
                                {user.profile.location}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;