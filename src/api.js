import axios from 'axios';

// Create an instance of axios with the backend API URL
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api/', 
  });  

export default api;
