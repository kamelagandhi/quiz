import axios from "axios";

const apiService = axios.create({
  baseURL: "http://localhost:8080/api", // Backend base URL
});

// Interceptor to attach token to headers and handle request errors
apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add an interceptor for responses
// apiService.interceptors.response.use(
//   (response) => response, // Pass through valid responses
//   (error) => {
//     console.log("Response Interceptor Triggered:", error.response); // Log error details
//     if (error.response && error.response.status === 401) {
//       alert("Session expired. Please log in again.");
//       sessionStorage.removeItem("token");
//       window.location.assign("/"); // Redirect to login page
//     }
//     return Promise.reject(error); // Forward the error for further handling
//   }
// );

// Auth endpoints
const authService = {
  register: (registerData) => apiService.post("/auth/register", registerData),
  login: (loginData) => apiService.post("/auth/login", loginData),
  logout: (logoutData) => apiService.post("/auth/logout", logoutData),
};

export default authService;
