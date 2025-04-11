import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/AccountSettings.css';

const AccountSettings = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setSuccess('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            updateUser(data.user);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Account Settings</h2>
                <button className="nav-link" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            <div className="settings-grid">
                <div className="settings-section">
                    <h3>Profile Information</h3>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    username: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    email: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    bio: e.target.value
                                })}
                                rows={4}
                            />
                        </div>
                        <button type="submit" className="btn">Update Profile</button>
                    </form>
                </div>

                <div className="settings-section">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value
                                })}
                            />
                        </div>
                        <button type="submit" className="btn">Change Password</button>
                    </form>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default AccountSettings;