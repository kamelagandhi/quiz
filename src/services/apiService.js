import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiService = axios.create({
  baseURL: BASE, 
});

// Attach token to all requests
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

// Auth endpoints
const authService = {
  register: (data) => apiService.post("/auth/register", data),
  login: (data) => apiService.post("/auth/login", data),
  logout: (data) => apiService.post("/auth/logout", data),
};

export default authService;
