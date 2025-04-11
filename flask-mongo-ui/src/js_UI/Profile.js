import React, { useState, useEffect } from 'react';
import '../css/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found');

            const response = await fetch('http://localhost:5000/get-profile', {
                headers: { 'user-id': userId }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');

            setProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!profile) return <div className="profile-not-found">Profile not found</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile.profile.profile_pic_url ? (
                            <img 
                                src={profile.profile.profile_pic_url} 
                                alt={profile.profile.full_name || profile.username} 
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {(profile.profile.full_name || profile.username)[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h1 className="profile-name">{profile.profile.full_name || profile.username}</h1>
                    <div className="profile-username">@{profile.username}</div>
                </div>

                <div className="profile-info">
                    {profile.profile.bio && (
                        <div className="info-section">
                            <h3>About</h3>
                            <p>{profile.profile.bio}</p>
                        </div>
                    )}

                    <div className="info-grid">
                        {profile.profile.location && (
                            <div className="info-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{profile.profile.location}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <span>{profile.email}</span>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-calendar"></i>
                            <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;