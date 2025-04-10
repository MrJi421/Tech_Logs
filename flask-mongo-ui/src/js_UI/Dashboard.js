import React, { useState, useEffect } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found');

            const response = await fetch('http://localhost:5000/get-profile', {
                headers: { 'user-id': userId }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setUserData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dashboard-loading">Loading...</div>;
    if (error) return <div className="dashboard-error">{error}</div>;
    if (!userData) return <div className="dashboard-empty">No data found</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="user-profile">
                    <div className="profile-image">
                        {userData.profile.profile_pic_url ? (
                            <img 
                                src={userData.profile.profile_pic_url} 
                                alt={userData.profile.full_name || userData.username}
                            />
                        ) : (
                            <div className="profile-placeholder">
                                {userData.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h2>{userData.profile.full_name || userData.username}</h2>
                        <p className="user-email">{userData.email}</p>
                        {userData.profile.location && (
                            <p className="user-location">
                                <i className="fas fa-map-marker-alt"></i> 
                                {userData.profile.location}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;