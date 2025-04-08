import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the token to the Authorization header dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Ensure the token is stored in localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; 
  }
  return config;
});

export default api;