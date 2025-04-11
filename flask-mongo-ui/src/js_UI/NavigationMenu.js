import React from 'react';
import { Link } from 'react-router-dom';
import '.././css/NavigationMenu.css';
import logoimg from '.././img/tlogs_logo.png'; 


const NavigationMenu = () => {
  return (
    <nav className="nav-container dark">
      <div className="nav-brand">
        <img src={logoimg} alt="Logo" className="nav-logo" />
        <span className="brand-name">Tech Logs</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/items" className="nav-link">My Blogs</Link>
        </li>
        <li>
          <Link to="/aboutus" className="nav-link">About Us</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </li>
      </ul>
      <div className="nav-btns">
        
        <button className="btn new-btn">          
          <Link to="/create-blog" className="btn">New Blog</Link>
        </button>
        <button className="btn login1-btn">
          <Link to="/login" className="btn">Login</Link>
        </button>
        {/* <button className="btn getstart-btn">Get Started</button> */}
      </div>
    </nav>
  );
};

export default NavigationMenu;