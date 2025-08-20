import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: '54.253.49.58:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
