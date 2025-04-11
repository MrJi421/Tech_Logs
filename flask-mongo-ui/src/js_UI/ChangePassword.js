import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/ChangePassword.css';

const ChangePassword = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setSuccess('Password changed successfully');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <div className="change-password-card">
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({
                                ...formData,
                                currentPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({
                                ...formData,
                                newPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({
                                ...formData,
                                confirmPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="button-group">
                        <button 
                            type="button" 
                            className="btn cancel-btn"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
