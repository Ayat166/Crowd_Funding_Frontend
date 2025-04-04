import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api/',
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (token) {
        config.headers.Authorization = `Token ${token}`;
        console.log("Token included in request:", token); // Debugging token
    } else {
        console.warn("No token found in localStorage");
    }
    return config;
});

export default api;
