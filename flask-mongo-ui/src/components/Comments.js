import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import '../css/Comments.css';

const Comments = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = () => {
        if (!blogId) return;

        fetch(`http://localhost:5000/blog/${blogId}/comments`)
            .then(res => res.json())
            .then(data => {
                if (data.comments) {
                    setComments(data.comments);
                }
            })
            .catch(err => console.error('Error:', err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const userId = localStorage.getItem('userId'); // Get logged in user ID

        fetch(`http://localhost:5000/blog/${blogId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userId
            },
            body: JSON.stringify({ content: newComment })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setMessage({ text: data.error, type: 'error' });
            } else {
                setMessage({ text: 'Comment added successfully!', type: 'success' });
                setNewComment('');
                fetchComments(); // Refresh comments
            }
            // Clear message after 3 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        })
        .catch(err => {
            setMessage({ text: 'Failed to add comment', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        });
    };

    return (
        <div className="comments-section">
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="comment1-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="1"
                />
                
                <button type="submit">Post</button>
            </form>

            {/* Message Display */}
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment._id} className="comment">
                        
                        <div className="comment-meta">
                            <span className="comment-user">
                                <FaUser className="user1-icon" />
                                {comment.username || 'Anonymous'}
                            </span>
                            <span className="comment1-date">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="comment-content">
                            {comment.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;