import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import '../css/Comments.css';

const Comments = ({ blogId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/comments/${blogId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            
            const data = await response.json();
            setComments(data.comments);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                },
                body: JSON.stringify({
                    blog_id: blogId,
                    content: newComment
                })
            });

            if (!response.ok) throw new Error('Failed to add comment');
            
            setNewComment('');
            fetchComments();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading comments...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            
            {user && (
                <form onSubmit={handleSubmitComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows="3"
                    />
                    <button type="submit" className="btn">Post Comment</button>
                </form>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                {comment.user_image ? (
                                    <img 
                                        src={comment.user_image} 
                                        alt={comment.user_name} 
                                        className="comment-user-image"
                                    />
                                ) : (
                                    <div className="comment-user-placeholder">
                                        <FaUser />
                                    </div>
                                )}
                                <span className="comment-user-name">{comment.user_name}</span>
                                <span className="comment-date">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;