import axios from 'axios';

const api = axios.create({
  baseURL: 'http://YOUR-IP:5000', // your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;