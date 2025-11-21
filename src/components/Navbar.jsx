// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/apiService"; // named export from apiService

const Navbar = () => {
  const { token, userDetails, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const tokenStored = sessionStorage.getItem("token");

      // Prefer calling the central authService if available
      if (authService && typeof authService.logout === "function") {
        // authService.logout uses apiService which reads VITE_API_URL
        const res = await authService.logout();
        // if backend returns success, res.status should be 200-like; axios returns res.status
        if (res?.status >= 200 && res?.status < 300) {
          // success
          logout();
          sessionStorage.removeItem("token");
          navigate("/");
          return;
        } else {
          // fallback: handle non-2xx
          const errMsg = res?.data?.message || "Failed to log out";
          alert(errMsg);
        }
      } else if (tokenStored) {
        // Fallback: call logout endpoint directly using VITE_API_URL
        const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await fetch(`${base}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenStored}`,
          },
        });

        if (response.ok) {
          logout();
          sessionStorage.removeItem("token");
          navigate("/");
          return;
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.message || "Failed to log out");
        }
      } else {
        // no token stored — just logout locally
        logout();
        sessionStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Always clear local state and redirect even on error
      logout();
      sessionStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Quiz App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              // show Create Test to everyone for demo — change back to userDetails?.admin when ready
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/create-test">
                    Create Test
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/view-results">
                    View Results
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        handleLogout();
                      }
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
