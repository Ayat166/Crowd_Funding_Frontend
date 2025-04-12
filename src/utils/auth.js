import axios from 'axios';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed", error);
    return null;
  }
};
