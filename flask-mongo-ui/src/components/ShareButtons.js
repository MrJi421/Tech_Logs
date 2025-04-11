import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from 'react-icons/fa';
import '../css/ShareButtons.css';

const ShareButtons = ({ url, title, onClose }) => {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="share-buttons">
            <div className="share-header">
                <h4>Share this blog</h4>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>&times;</button>
                )}
            </div>
            <div className="share-icons">
                <a 
                    href={shareUrls.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="share-icon twitter"
                    title="Share on Twitter"
                >
                    <FaTwitter />
                </a>
                <a 
                    href={shareUrls.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="share-icon facebook"
                    title="Share on Facebook"
                >
                    <FaFacebook />
                </a>
                <a 
                    href={shareUrls.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="share-icon linkedin"
                    title="Share on LinkedIn"
                >
                    <FaLinkedin />
                </a>
                <button 
                    onClick={copyToClipboard} 
                    className="share-icon copy"
                    title="Copy link"
                >
                    <FaLink />
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;