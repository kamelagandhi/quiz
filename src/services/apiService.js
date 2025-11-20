// src/services/apiService.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const apiService = axios.create({
  baseURL: BASE, 
});

// Interceptors left as-is if you want (optional)
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// FAKE authService for dev — always returns success
const authService = {
  register: (data) =>
    Promise.resolve({
      data: { message: "Registered (dev)", userDetails: { email: data.email }, token: "dev-token" },
    }),

  // Bypass network call and resolve immediately
  login: (data) =>
    Promise.resolve({
      data: {
        message: "Login successful (dev bypass)",
        token: "dev-token-123",
        userDetails: { email: data.email || "dev@example.com", name: "Dev User" },
      },
    }),

  logout: () => Promise.resolve({ data: { message: "Logged out (dev)" } }),
};

export default authService;
