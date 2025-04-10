import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import '../css/LoginPage.css';
import loginImage from '.././img/6620122.jpg'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { username, password });

      // Store user data
      localStorage.setItem('userId', response.data.user_id);
      localStorage.setItem('username', response.data.username);

      // Show success modal
      setModalMessage('Login successful!');
      setModalType('success');
      setShowModal(true);

      // Redirect after a short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setModalMessage(error.response ? error.response.data : error.message);
      setModalType('error');
      setShowModal(true);
    }
  };

  return (
    <div className="login-wrapper">
      <Modal 
        show={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
      />
      <div className="login-container">
        <div className="login-left">
          <img src={loginImage} alt="Login Visual" />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="assist-links">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" className="btn login-btn">
                Login
              </button>
            </form>
            <div className="extra-links">
              <span>Don't have an account? </span>
              <Link to="/register" className="register-link">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;