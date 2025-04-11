import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
    updateProfile: (profileData) => api.put('/update-profile', profileData),
    uploadProfilePic: (formData) => api.post('/upload-profile-pic', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export default api;