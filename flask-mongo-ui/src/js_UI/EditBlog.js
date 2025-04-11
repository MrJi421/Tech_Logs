import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import '../css/EditBlog.css';

const EditBlog = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        currentImageUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPreview, setIsPreview] = useState(false);

    const markdownGuide = `
# Markdown Guide
- # H1 Header
- ## H2 Header
- ### H3 Header
- **Bold Text**
- *Italic Text*
- ~~Strikethrough~~
- > Blockquote
- * List item
- 1. Numbered list
- [Link](url)
- ![Image](url)
- \`inline code\`
- \`\`\`
  code block
  \`\`\`
- --- (horizontal rule)
    `;

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

            setFormData({
                title: data.blog.title,
                content: data.blog.content,
                currentImageUrl: data.blog.image_url || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch(`http://localhost:5000/update-blog/${id}`, {
                method: 'PUT',
                headers: {
                    'user-id': user._id
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update blog');
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading blog...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="edit-blog-container">
            <div className="edit-blog-header">
                <h2>Edit Blog</h2>
                <div className="header-actions">
                    <button 
                        type="button"
                        className="preview-btn"
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button 
                        type="button"
                        className="back-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {isPreview ? (
                <div className="preview-container">
                    <h1>{formData.title}</h1>
                    {formData.currentImageUrl && (
                        <div className="blog-image">
                            <img src={formData.currentImageUrl} alt={formData.title} />
                        </div>
                    )}
                    <div className="markdown-content">
                        <ReactMarkdown>{formData.content}</ReactMarkdown>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="edit-blog-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                title: e.target.value 
                            }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Cover Image</label>
                        {formData.currentImageUrl && (
                            <div className="current-image">
                                <img 
                                    src={formData.currentImageUrl} 
                                    alt="Current cover" 
                                />
                                <p>Current image</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">
                            Content (Markdown supported)
                            <button
                                type="button"
                                className="help-btn"
                                onClick={() => alert(markdownGuide)}
                            >
                                Markdown Help
                            </button>
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                content: e.target.value
                            }))}
                            rows={15}
                            required
                            placeholder="Write your content using Markdown..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Blog'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditBlog;