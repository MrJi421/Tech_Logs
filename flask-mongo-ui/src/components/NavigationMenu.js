import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch } from 'react-icons/fa';
import '.././css/NavigationMenu.css';
import logoimg from '.././img/tlogs_logo.png'; 

const NavigationMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="nav-container dark">
      <div className="nav-brand">
        <Link to="/">
          <img src={logoimg} alt="Logo" className="nav-logo" />
          {/* <span className="brand-name">Tech Logs</span> */}
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <FaSearch />
          </button>
        </div>
      </form>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/dashboard" className="nav-link">My Blogs</Link>
        </li>
        <li>
          <Link to="/aboutus" className="nav-link">About Us</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </li>
      </ul>
      <div className="nav-btns">
        <button className="new-btns">          
          <Link to="/create-blog" className="new-btn">New Blog</Link>
        </button>
        {user ? (
          <button className="login1-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login1-btns">
            <Link to="/login" className="login1-btn">Login</Link>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavigationMenu;