import React from 'react';
import { Link } from 'react-router-dom';
import '.././css/NavigationMenu.css';

const NavigationMenu = () => {
  return (
    <nav className="nav-container dark">
      <div className="nav-brand">
        <img src="/logo192.png" alt="Logo" className="nav-logo" />
        <span className="brand-name">Blogify</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/items" className="nav-link">My Blogs</Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">About Us</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </li>
      </ul>
      <div className="nav-btns">
        <button className="btn new-btn">New Blog</button>
        <button className="btn login-btn">Login</button>
        {/* <button className="btn getstart-btn">Get Started</button> */}
      </div>
    </nav>
  );
};

export default NavigationMenu;