import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/RegisterPage.css';
import registerImage from '.././img/6620122.jpg';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', { username, email, password });
      console.log('Registration successful:', response.data);
      // Redirect to login page upon successful registration
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-left">
          <div className="register-card">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn register-btn">Register</button>
            </form>
            <div className="extra-links">
              <span>Already have an account? </span>
              <Link to="/login" className="login-link">Login here</Link>
            </div>
          </div>
        </div>
        <div className="register-right">
          <img src={registerImage} alt="Register Visual" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;