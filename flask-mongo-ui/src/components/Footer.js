import React from 'react';
import { Link } from 'react-router-dom';
import { FaFeather, FaBlog, FaUsers, FaEnvelope } from 'react-icons/fa';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <FaFeather className="footer-icon" />
                    <h3>T Logs</h3>
                    <p>Your go-to platform for exploring the latest in tech. Stay updated, stay curious.</p>
                </div>

                <div className="footer-section">
                    <FaBlog className="footer-icon" />
                    <h3>My Blogs</h3>
                    <p>Create, edit, and manage your tech stories, experiments, and learning journeys.</p>
                </div>

                <div className="footer-section">
                    <FaUsers className="footer-icon" />
                    <h3>About Us</h3>
                    <p>Built by tech enthusiasts for tech enthusiasts. Powered by Flask and MongoDB, driven by passion.</p>
                </div>

                <div className="footer-section">
                    <FaEnvelope className="footer-icon" />
                    <h3>Contact Us</h3>
                    <p>Have questions or suggestions? We'd love to hear from you. Let's connect and grow together.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} T Logs. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;