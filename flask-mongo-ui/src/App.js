import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './js_UI/HomePage';
import ItemManager from './js_UI/ItemManager';
import NavigationMenu from './js_UI/NavigationMenu';

const CreateItem = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create New Item</h2>
            <p>Here you can add a new blog item.</p>
        </div>
    );
};

function App() {
    return (
        <Router>
            <div className="App">
                <NavigationMenu />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/items" element={<ItemManager />} />
                    <Route path="/create" element={<CreateItem />} />
                    {}
                </Routes>
            </div>
        </Router>
    );
}

export default App;