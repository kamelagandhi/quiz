import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/apiService";
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
  console.log("handleLogin called with:", loginData);

  try {
    const response = await authService.login(loginData);
    console.log("authService.login response:", response);

    const token = response?.data?.token;
    const userDetails = response?.data?.userDetails;
    const messageFromServer = response?.data?.message;

    console.log({ token, userDetails, messageFromServer });

    if (!token) {
      // Helpful message for debugging
      setMessage("Login failed: no token returned from server.");
      setAlertType("danger");
      console.warn("No token in login response:", response);
      return;
    }

    // Persist token so interceptors / route guards can read it
    sessionStorage.setItem("token", token);

    // Update context (if your context persists to storage separately that's fine)
    setToken(token);
    setUserDetails(userDetails);

    setMessage(messageFromServer || "Login successful!");
    setAlertType("success");

    // Small delay to allow state to update (optional)
    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    // show more detailed message if available
    const serverMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";
    setMessage(serverMessage);
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
