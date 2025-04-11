import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBlogs();
    }, [user, navigate]);

    const fetchBlogs = async () => {
        try {
            console.log('Fetching blogs for user:', user._id); // Debug log
            const response = await fetch('http://localhost:5000/get-user-blogs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });

            const data = await response.json();
            console.log('Fetched blogs:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch blogs');
            }

            setBlogs(data.blogs);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/delete-blog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }

            // Remove the deleted blog from state
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
        } catch (err) {
            console.error('Error deleting blog:', err);
            setError(err.message);
        }
    };

    if (!user) {
        return <div>Please log in to view the dashboard</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>My Blog Posts</h2>
                <Link to="/create-blog" className="btn new-btn">
                    Create New Blog
                </Link>
            </div>

            {loading && <div className="loading">Loading blogs...</div>}
            {error && <div className="error">Error: {error}</div>}

            <div className="blogs-list">
                {blogs.length === 0 ? (
                    <div className="no-blogs">
                        <p>You haven't created any blogs yet.</p>
                        <Link to="/create-blog" className="create-btn">
                            Create Your First Blog
                        </Link>
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
                            {blogs.map(blog => (
                                <tr key={blog._id}>
                                    <td className="blog-title">
                                        <div className="title-cell">
                                            {blog.image_url && (
                                                <img 
                                                    src={blog.image_url} 
                                                    alt="" 
                                                    className="thumbnail"
                                                />
                                            )}
                                            <span>{blog.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="content-preview">
                                            {blog.content.substring(0, 100)}...
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link 
                                                to={`/view-blog/${blog._id}`}
                                                className="view-btn"
                                            >
                                                View
                                            </Link>
                                            {blog.isOwner && (
                                                <>
                                                    <Link 
                                                        to={`/edit-blog/${blog._id}`}
                                                        className="edit-btn"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        className="delete-btn"
                                                    >
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
        </div>
    );
};

export default Dashboard;