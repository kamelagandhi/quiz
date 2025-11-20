import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { setToken, setUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(loginData);
      setToken(response.data.token);
      setUserDetails(response.data.userDetails);
      setMessage(response.data.message || "Login successful!");
      setAlertType("success");
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An unexpected error occurred"
      );
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
