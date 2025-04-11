import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../css/CompleteProfile.css';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        full_name: '',
        bio: '',
        location: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Update profile info
            await authService.updateProfile(profile);

            // Handle image upload if selected
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                await authService.uploadProfilePic(formData);
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="complete-profile-container">
            <h2>Complete Your Profile</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        placeholder="Tell us about yourself"
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="Your location"
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Complete Profile'}
                </button>
            </form>
        </div>
    );
};

export default CompleteProfile;