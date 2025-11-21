// src/services/apiService.js
import axios from "axios";

// Use VITE_API_URL in production; fallback to localhost in dev
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const apiService = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to headers if present in sessionStorage
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global response handling
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // if unauthorized, clear token (optional)
    if (error?.response?.status === 401) {
      sessionStorage.removeItem("token");
      // don't auto-redirect here — let app handle it
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const authService = {
  login: (data) => apiService.post("/auth/login", data),
  register: (data) => apiService.post("/auth/register", data),
  logout: () => apiService.post("/auth/logout"),
};

export default authService;
export { apiService };
