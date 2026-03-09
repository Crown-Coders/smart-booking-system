import axios from "axios";

// Replace with your PC IP, not localhost
const api = axios.create({
  baseURL: "http://172.20.6.37:5000", 
});

export default api;