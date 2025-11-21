// src/components/LoginForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiService"; // kept for future use

const LoginForm = () => {
  const { setToken, setUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  // DEV BYPASS: skip actual backend auth and go inside immediately
  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      // fake successful response (admin set true for demo)
      const fake = {
        data: {
          message: "Login successful (dev bypass)",
          token: "dev-token-123",
          userDetails: {
            email: loginData.email || "dev@example.com",
            fullName: "Dev User",
            admin: true
          }
        }
      };

      // Persist token (for api interceptors) and set context
      sessionStorage.setItem("token", fake.data.token);
      setToken(fake.data.token);
      setUserDetails(fake.data.userDetails);

      setMessage(fake.data.message);
      setAlertType("success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Dev bypass login error:", err);
      setMessage("An unexpected error occurred");
      setAlertType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <div className="container mt-5 Login">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Login</h2>
          {message && (
            <div className={`alert alert-${alertType}`} role="alert">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-success w-100"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
