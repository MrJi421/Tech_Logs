import React, { useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import '../css/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: 'Sending...', type: 'info' });

        try {
            const response = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus({ message: 'Thank you for reaching out! We\'ll get back to you soon.', type: 'success' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            setStatus({ message: 'Failed to send message. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="contact-container">
            <h1>Get in Touch</h1>

            {status.message && (
                <div className={`alert ${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="contact-content">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Send Message</button>
                </form>

                <div className="alternative-contact">
                    <h3>Alternative Contact</h3>
                    <div className="contact-links">
                        <a href="mailto:support@tlogs.com">
                            <FaEnvelope /> support@tlogs.com
                        </a>
                        <a href="https://github.com/hemantcodes" target="_blank" rel="noopener noreferrer">
                            <FaGithub /> github.com/hemantcodes
                        </a>
                        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin /> linkedin.com/in/yourprofile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;