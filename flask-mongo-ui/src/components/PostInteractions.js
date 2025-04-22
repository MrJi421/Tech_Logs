import React, { useState, useEffect, useCallback } from 'react';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Comments from './Comments';
import '../css/PostInteractions.css';

const PostInteractions = ({ blog }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(blog.likes_count || 0);
    const [showComments, setShowComments] = useState(false);

    const checkLikeStatus = useCallback(async () => {
        if (!user) return;
        
        try {
            const response = await fetch(`http://localhost:5000/blog/${blog._id}/like`, {
                headers: { 'user-id': user._id }
            });
            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.is_liked);
            }
        } catch (err) {
            console.error('Error checking like status:', err);
        }
    }, [blog._id, user]);

    useEffect(() => {
        checkLikeStatus();
    }, [checkLikeStatus]);

    const handleLike = async () => {
        if (!user) return;

        try {
            const response = await fetch(`http://localhost:5000/blog/${blog._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.is_liked);
                setLikesCount(prev => data.is_liked ? prev + 1 : prev - 1);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return (
        <div className="post-interactions">
            <div className="interaction-buttons">
                <button 
                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={!user}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likesCount}</span>
                </button>
                
                <button 
                    className="comment-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    <FaComment />
                    <span>Comments</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-wrapper">
                    <Comments blogId={blog._id} />
                </div>
            )}
        </div>
    );
};

export default PostInteractions;