// src/services/apiService.js
import axios from "axios";

// Production base via env; fallback to local dev server
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiService = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle 401 globally
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem("token");
      // Optional redirect:
      // window.location.assign("/");
    }
    return Promise.reject(error);
  }
);

// -------------------------------
//  AUTH SERVICE (COMBINED HERE)
// -------------------------------
const authService = {
  login: (data) => apiService.post("/auth/login", data),
  register: (data) => apiService.post("/auth/register", data),
  logout: () => apiService.post("/auth/logout"),
};

// -------------------------------
// EXPORTS
// -------------------------------
export default apiService;
export { authService };
