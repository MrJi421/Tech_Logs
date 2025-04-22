import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import showdown from 'showdown';
import '../css/ViewBlog.css';
import PostInteractions from '../components/PostInteractions';
import Comments from '../components/Comments';

// Initialize showdown converter
const converter = new showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    smartIndentationFix: true
});

const ViewBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                };
                // Add user-id to headers only if user is logged in
                if (user) {
                    headers['user-id'] = user._id;
                }

                const response = await fetch(`http://localhost:5000/get-blog/${id}`, {
                    headers
                });

                if (!response.ok) throw new Error('Failed to fetch blog');
                
                const data = await response.json();
                setBlog(data.blog);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, user]);

    const renderMarkdown = (content) => {
        return { __html: converter.makeHtml(content) };
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

                <PostInteractions blog={blog} />
                <Comments blogId={blog._id} />
            </article>
        </div>
    );
};

export default ViewBlog;