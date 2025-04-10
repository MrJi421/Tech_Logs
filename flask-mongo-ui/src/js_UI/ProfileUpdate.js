import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/ProfileUpdate.css';

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromRegistration = location.state?.fromRegistration;
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        location: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const updateProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found. Please login again.');
            }

            console.log('Sending update request for user:', userId); // Debug log

            const profileResponse = await fetch('http://localhost:5000/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify(formData)
            });

            const data = await profileResponse.json();
            
            if (!profileResponse.ok) {
                console.error('Profile update failed:', data); // Debug log
                throw new Error(data.error || 'Failed to update profile');
            }

            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };

    const uploadProfilePic = async () => {
        const imageData = new FormData();
        imageData.append('file', profilePic);

        const picResponse = await fetch('http://localhost:5000/upload-profile-pic', {
            method: 'POST',
            headers: {
                'user-id': localStorage.getItem('userId')
            },
            body: imageData
        });

        if (!picResponse.ok) {
            throw new Error('Failed to upload profile picture');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Update profile info
            await updateProfile();
            
            // Handle profile picture if selected
            if (profilePic) {
                await uploadProfilePic();
            }

            // Redirect to dashboard
            navigate('/dashboard');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-update-container">
            <h2>
                {fromRegistration 
                    ? 'Complete Your Profile' 
                    : 'Update Your Profile'}
            </h2>
            {fromRegistration && (
                <p className="welcome-message">
                    Welcome! Please complete your profile to continue.
                </p>
            )}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="profile-pic-section">
                    <div className="profile-pic-preview">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile preview" />
                        ) : (
                            <div className="placeholder">Upload Photo</div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="profile-pic-input"
                    />
                    <label htmlFor="profile-pic-input" className="upload-btn">
                        Choose Photo
                    </label>
                </div>

                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Your location"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdate;