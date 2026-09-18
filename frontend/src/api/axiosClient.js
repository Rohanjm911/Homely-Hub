import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial: Sends and receives HTTP-only JWT cookies across ports
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
