import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFeather, FaBlog, FaUsers, FaEnvelope } from 'react-icons/fa';
import '../css/HomePage.css';
import homeImage from '.././img/homepage-1.png'; 
import logoimg from '.././img/tlogs_logo.png'; 

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/public-blogs');
                if (!response.ok) throw new Error('Failed to fetch blogs');
                
                const data = await response.json();
                setBlogs(data.blogs);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="home-container">
            {/* Landing Section */}
            <section className="landing-section">
                <div className="landing-content">
                    <h1>Welcome to Tech Logs</h1>
                    <p>Your one-stop destination for insightful blogs and creative ideas.</p>
                    <Link to="/items">
                        <button className="btn primary-btn">Explore Blogs</button>
                    </Link>
                </div>
                <div className="landing-image">
                    <img src={homeImage} alt="Hero" />
                </div>
            </section>

            {/* Latest Blogs Section */}
            <section className="latest-blogs">
                <h2>Latest Blog Posts</h2>
                {loading && <div className="loading">Loading blogs...</div>}
                {error && <div className="error">{error}</div>}
                <div className="blogs-grid">
                    {blogs.map(blog => (
                        <article key={blog._id} className="blog-card">
                            {blog.image_url && (
                                <img src={blog.image_url} alt={blog.title} className="blog-image" />
                            )}
                            <div className="blog-content">
                                <h3>{blog.title}</h3>
                                <p>{blog.content.substring(0, 150)}...</p>
                                <Link to={`/view-blog/${blog._id}`} className="read-more">
                                    Read More
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* What We Post Section */}
            <section className="what-we-post">
                <h2>What We Post & Why</h2>
                <p>
                    We share insightful, creative, and engaging content on a variety of topics. Our mission is to inform, inspire, and spark discussions on trending subjects.
                </p>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>Testimonials</h2>
                <div className="testimonials-container">
                    <div className="testimonial-card">
                        <p>"Blogify has transformed the way I consume content. The articles are insightful and engaging!"</p>
                        <span>- User One</span>
                    </div>
                    <div className="testimonial-card">
                        <p>"A must-read platform for anyone who loves staying updated with creative ideas."</p>
                        <span>- User Two</span>
                    </div>
                    <div className="testimonial-card">
                        <p>"I love the diversity of topics and the passion behind every post. Truly inspiring!"</p>
                        <span>- User Three</span>
                    </div>
                </div>
            </section>

            {/* Footer Section
            <footer className="footer">
                <div className="footer-logo">
                    <img src={logoimg} alt="Logo" />
                    <span>Tech Logs</span>
                </div>
                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/items">Blogs</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                </div>
                <div className="footer-social">
                    <a href="#!">FB</a>
                    <a href="#!">TW</a>
                    <a href="#!">IG</a>
                    <a href="#!">LN</a>
                </div>
                <div className="footer-newsletter">
                    <input type="email" placeholder="Subscribe to our newsletter" />
                    <button className="btn subscribe-btn">Subscribe</button>
                </div>
            </footer> */}
        </div>
    );
};

export default HomePage;