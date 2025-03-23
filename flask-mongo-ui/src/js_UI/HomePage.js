import React from 'react';
import { Link } from 'react-router-dom';
import '.././css/HomePage.css';
import homeImage from '.././img/homepage-1.png'; 


const HomePage = () => {
  return (
    <div className="homepage">
      {/* Landing Section */}
      <section className="landing-section">
        <div className="landing-content">
          <h1>Welcome to Blogify</h1>
          <p>Your one-stop destination for insightful blogs and creative ideas.</p>
          <Link to="/items">
            <button className="btn primary-btn">Explore Blogs</button>
          </Link>
        </div>
        <div className="landing-image">
          <img src={homeImage} alt="Hero" />
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="featured-blogs">
        <h2>Featured Blogs</h2>
        <div className="blogs-container">
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x200" alt="Blog 1" />
            <h3>Blog Title 1</h3>
            <p>Short description of blog 1.</p>
          </div>
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x200" alt="Blog 2" />
            <h3>Blog Title 2</h3>
            <p>Short description of blog 2.</p>
          </div>
          <div className="blog-card">
            <img src="https://via.placeholder.com/300x200" alt="Blog 3" />
            <h3>Blog Title 3</h3>
            <p>Short description of blog 3.</p>
          </div>
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

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-logo">
          <img src="https://via.placeholder.com/50" alt="Logo" />
          <span>Blogify</span>
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
      </footer>
    </div>
  );
};

export default HomePage;