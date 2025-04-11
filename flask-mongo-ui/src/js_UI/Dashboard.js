import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchBlogs = async () => {
            if (!user || !user._id) {
                console.log('No user found, redirecting to login');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/get-user-blogs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'user-id': user._id
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }

                const data = await response.json();
                console.log('Fetched blogs:', data);
                setBlogs(data.blogs || []);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchBlogs();
    }, [user, navigate]);

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const response = await fetch(`http://localhost:5000/delete-blog/${blogId}`, {
                    method: 'DELETE',
                    headers: { 'user-id': user._id }
                });
                if (response.ok) {
                    setBlogs(blogs.filter(blog => blog._id !== blogId));
                }
            } catch (err) {
                setError('Failed to delete blog');
            }
        }
    };

    // Debug logs
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('Blogs:', blogs);
    console.log('Active Tab:', activeTab);

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="auth-error">Please log in to view dashboard</div>;
    }

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="user-info">
                    <div className="avatar">
                        {user?.profile?.profile_pic_url ? (
                            <img src={user.profile.profile_pic_url} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h3>{user?.username}</h3>
                </div>
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <i className="fas fa-th-large"></i>
                        Dashboard
                    </button>
                    <Link to="/create-blog" className="nav-item">
                        <i className="fas fa-plus"></i>
                        New Blog
                    </Link>
                    <button 
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fas fa-user"></i>
                        Profile
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                {error ? (
                    <div className="error">{error}</div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <div className="blogs-grid">
                                {blogs.length === 0 ? (
                                    <div className="no-blogs">
                                        <p>You haven't created any blogs yet.</p>
                                        <Link to="/create-blog" className="create-blog-btn">
                                            Create Your First Blog
                                        </Link>
                                    </div>
                                ) : (
                                    blogs.map(blog => (
                                        <div key={blog._id} className="blog-card">
                                            {blog.image_url && (
                                                <img src={blog.image_url} alt={blog.title} />
                                            )}
                                            <div className="blog-content">
                                                <h3>{blog.title}</h3>
                                                <p>{blog.content.substring(0, 100)}...</p>
                                                <div className="blog-actions">
                                                    <Link to={`/edit-blog/${blog._id}`} className="edit-btn">
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        className="delete-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'profile' && (
                            <div className="profile-section">
                                <h2>Profile Settings</h2>
                                <Link to="/update-profile" className="update-profile-btn">
                                    Update Profile
                                </Link>
                                {/* Profile information */}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;