// src/services/apiService.js
import axios from "axios";

// Production base via env; fallback to local for dev
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiService = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token from sessionStorage if present
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Optional: handle 401 globally
apiService.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err?.response?.status === 401) {
      sessionStorage.removeItem("token");
      // optionally: window.location.assign("/");
    }
    return Promise.reject(err);
  }
);

export default apiService;
