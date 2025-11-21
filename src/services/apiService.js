// src/services/apiService.js
import axios from "axios";

// Use VITE_API_URL in production; fall back to localhost for dev
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const apiService = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to headers if present
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Optional) Response interceptor to handle auth errors globally
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: if 401, clear session and redirect to login
    if (error?.response?.status === 401) {
      // Remove token and optionally redirect
      sessionStorage.removeItem("token");
      // window.location.assign("/"); // uncomment if you want auto-redirect
    }
    return Promise.reject(error);
  }
);

// Auth endpoints (use apiService for all network calls)
const authService = {
  register: (data) => apiService.post("/auth/register", data),
  login: (data) => apiService.post("/auth/login", data),
  logout: () => apiService.post("/auth/logout"),
};

export default authService;
export { apiService };
