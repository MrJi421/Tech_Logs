import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaUser, FaLock, FaBlog, FaPlus } from 'react-icons/fa';
import '../css/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userImage, setUserImage] = useState(user?.profile_image || null);

    useEffect(() => {
        if (!user) return;
        
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-user-blogs', {
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': user._id
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch blogs');
                
                const data = await response.json();
                setBlogs(data.blogs);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        setUserImage(user.profile?.profile_pic_url || null);
    }, [user]);

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`http://localhost:5000/delete-blog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });

            if (!response.ok) throw new Error('Failed to delete blog');
            setBlogs(blogs.filter(blog => blog._id !== blogId));
        } catch (err) {
            console.error('Error deleting blog:', err);
            setError(err.message);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const filteredBlogs = blogs.filter(blog => {
        if (activeTab === 'all') return true;
        return activeTab === 'my' && String(blog.user_id) === String(user._id);
    });

    if (!user) {
        return <div>Please log in to view the dashboard</div>;
    }

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                
                <div className="sidebar-content">
                    <div className="user-profile-section">
                        <div className="profile-image">
                            {userImage ? (
                                <img src={userImage} alt="Profile" />
                            ) : (
                                <div className="profile-placeholder">
                                    <FaUser />
                                </div>
                            )}
                        </div>
                        <div className="user-info">
                            <h3>{user.profile?.full_name || user.username}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <div className="sidebar-menu">
                        <button 
                            className={`sidebar-btn ${activeTab === 'my' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my')}
                        >
                            <FaBlog /> <span>My Blogs</span>
                        </button>
                        <Link to="/create-blog" className="sidebar-btn">
                            <FaPlus /> <span>Create New Blog</span>
                        </Link>
                        <Link to="/change-password" className="sidebar-btn">
                            <FaLock /> <span>Change Password</span>
                        </Link>
                        <Link to="/profile" className="sidebar-btn">
                            <FaUser /> <span>View Profile</span>
                        </Link>
                        <Link to="/update-profile" className="sidebar-btn">
                            <FaUser /> <span>Update Profile</span>
                        </Link>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {loading && <div className="loading">Loading blogs...</div>}
                {error && <div className="error">{error}</div>}

                <div className="blogs-container">
                    {blogs.length === 0 ? (
                        <div className="no-blogs">
                            <p>No blogs found.</p>
                            <Link to="/create-blog" className="btn">Create Your First Blog</Link>
                        </div>
                    ) : (
                        <table className="blogs-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Created Date</th>
                                    <th>Preview</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.map(blog => (
                                    <tr key={blog._id}>
                                        <td className="blog-title">
                                            <div className="title-cell">
                                                {blog.image_url && (
                                                    <img src={blog.image_url} alt="" className="thumbnail" />
                                                )}
                                                <span>{blog.title}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="content-preview">
                                                {blog.content.substring(0, 100)}...
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/view-blog/${blog._id}`} className="btn">
                                                    View
                                                </Link>
                                                {String(blog.user_id) === String(user._id) && (
                                                    <>
                                                        <Link to={`/edit-blog/${blog._id}`} className="btn">
                                                            Edit
                                                        </Link>
                                                        <button onClick={() => handleDeleteBlog(blog._id)} className="btn delete-btn">
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;