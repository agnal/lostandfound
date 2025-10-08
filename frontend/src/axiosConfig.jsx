import axios from 'axios';
const apiBaseUrl =
  process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5001';
const axiosInstance = axios.create({
   baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
