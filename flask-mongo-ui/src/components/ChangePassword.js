import React, { useState } from 'react';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage({ text: 'Please login first', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId // Make sure userId is valid
                },
                body: JSON.stringify({
                    current_password: passwords.currentPassword,
                    new_password: passwords.newPassword
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage({ text: 'Password updated successfully', type: 'success' });
                setPasswords({ currentPassword: '', newPassword: '' });
            } else {
                setMessage({ text: data.error || 'Failed to update password', type: 'error' });
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage({ text: 'Network error occurred', type: 'error' });
        }
    };

    return (
        <div className="change-password">
            <h2>Change Password</h2>
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    required
                />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;