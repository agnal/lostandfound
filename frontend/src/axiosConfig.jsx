import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: '3.107.69.235:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
