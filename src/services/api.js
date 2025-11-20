// src/services/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
  // You can add common headers here
  // headers: { 'Content-Type': 'application/json' },
});

export default api;
