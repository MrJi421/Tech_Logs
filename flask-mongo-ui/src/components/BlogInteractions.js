import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Comments from './Comments';
import ShareButtons from './ShareButtons';
import '../css/BlogInteractions.css';

const BlogInteractions = ({ blog }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(blog.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:5000/blog/${blog._id}/like`, {
                    headers: {
                        'user-id': user._id
                    }
                });
                const data = await response.json();
                setIsLiked(data.is_liked);
            } catch (err) {
                console.error('Error checking like status:', err);
            }
        };

        checkLikeStatus();
    }, [blog._id, user]);

    const handleLikeClick = async () => {
        if (!user) return;

        try {
            const response = await fetch(`http://localhost:5000/blog/${blog._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user._id
                }
            });
            const data = await response.json();
            setIsLiked(data.is_liked);
            setLikesCount(prev => data.is_liked ? prev + 1 : prev - 1);
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return (
        <div className="blog-interactions">
            <button 
                className={`interaction-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLikeClick}
                disabled={!user}
            >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{likesCount}</span>
            </button>

            <button 
                className="interaction-btn"
                onClick={() => setShowComments(!showComments)}
            >
                <FaComment />
                <span>Comments</span>
            </button>

            <button 
                className="interaction-btn"
                onClick={() => setShowShare(!showShare)}
            >
                <FaShare />
                <span>Share</span>
            </button>

            {showComments && (
                <div className="comments-container">
                    <Comments blogId={blog._id} />
                </div>
            )}

            {showShare && (
                <div className="share-modal">
                    <ShareButtons 
                        url={window.location.href}
                        title={blog.title}
                        onClose={() => setShowShare(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default BlogInteractions;