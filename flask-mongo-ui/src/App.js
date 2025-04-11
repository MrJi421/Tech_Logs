import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './js_UI/HomePage';
import ItemManager from './js_UI/ItemManager';
import NavigationMenu from './js_UI/NavigationMenu';
import LoginPage from './js_UI/LoginPage';
import RegisterPage from './js_UI/RegisterPage';
import CompleteProfile from './js_UI/CompleteProfile';
import ProfileUpdate from './js_UI/ProfileUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './js_UI/Profile';
import { AuthProvider } from './context/AuthContext';

const CreateItem = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create New Item</h2>
            <p>Here you can add a new blog item.</p>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <p>Welcome to the dashboard!</p>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <NavigationMenu />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/items" element={<ItemManager />} />
                        <Route path="/create" element={<CreateItem />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/complete-profile" element={<CompleteProfile />} />
                        <Route path="/update-profile" element={<ProfileUpdate />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;