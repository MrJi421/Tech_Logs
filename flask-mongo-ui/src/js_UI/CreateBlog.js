import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/CreateBlog.css';

const CreateBlog = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        isPreview: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            const response = await fetch('http://localhost:5000/create-blog', {
                method: 'POST',
                headers: {
                    'user-id': user._id
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create blog');
            }

            // Show success message or redirect
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderPreview = () => {
        return (
            <div className="preview-content">
                <h1>{formData.title}</h1>
                {formData.image && (
                    <img 
                        src={URL.createObjectURL(formData.image)} 
                        alt="Blog cover" 
                        className="preview-image"
                    />
                )}
                <div 
                    className="preview-text"
                    dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br/>') }}
                />
            </div>
        );
    };

    return (
        <div className="create-blog-container">
            <div className="blog-header">
                <h2>Create New Blog</h2>
                <div className="header-actions">
                    <button 
                        type="button"
                        className="preview-btn"
                        onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            isPreview: !prev.isPreview 
                        }))}
                    >
                        {formData.isPreview ? 'Edit' : 'Preview'}
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

            {error && <div className="error-message">{error}</div>}

            <div className="blog-content">
                {formData.isPreview ? (
                    renderPreview()
                ) : (
                    <form onSubmit={handleSubmit} className="blog-form">
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
                                placeholder="Enter blog title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Cover Image</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {formData.image && (
                                <img 
                                    src={URL.createObjectURL(formData.image)} 
                                    alt="Preview" 
                                    className="image-preview"
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    content: e.target.value
                                }))}
                                rows={15}
                                placeholder="Write your blog content..."
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Blog'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateBlog;