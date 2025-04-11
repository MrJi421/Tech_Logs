import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marked } from 'marked';
import '../css/ViewBlog.css';

const ViewBlog = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`http://localhost:5000/get-blog/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch blog');
            }

            setBlog(data.blog);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderMarkdown = (content) => {
        return { __html: marked(content) };
    };

    if (loading) return <div className="loading">Loading blog...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!blog) return <div className="error">Blog not found</div>;

    return (
        <div className="view-blog-container">
            <div className="view-blog-header">
                <button 
                    type="button"
                    className="back-btn"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
                {blog.isOwner && (
                    <button
                        type="button"
                        className="edit-btn"
                        onClick={() => navigate(`/edit-blog/${id}`)}
                    >
                        Edit Blog
                    </button>
                )}
            </div>

            <article className="blog-content">
                <h1>{blog.title}</h1>
                
                {blog.image_url && (
                    <div className="blog-image">
                        <img src={blog.image_url} alt={blog.title} />
                    </div>
                )}

                <div className="blog-meta">
                    <span className="date">
                        Published on {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    {blog.updated_at !== blog.created_at && (
                        <span className="updated">
                            Last updated on {new Date(blog.updated_at).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <div 
                    className="blog-text markdown-content"
                    dangerouslySetInnerHTML={renderMarkdown(blog.content)}
                />
            </article>
        </div>
    );
};

export default ViewBlog;