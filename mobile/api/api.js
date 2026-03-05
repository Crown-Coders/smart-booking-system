import axios from "axios";

const API = axios.create({
  baseURL: "http://172.26.80.1:5000/api",
});

export default API;