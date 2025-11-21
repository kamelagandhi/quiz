// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/apiService";

const Navbar = () => {
  const { token, userDetails, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const tokenStored = sessionStorage.getItem("token");
      if (authService && typeof authService.logout === "function") {
        await authService.logout();
      } else if (tokenStored) {
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await fetch(`${base}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenStored}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // clear local session and redirect
      logout();
      sessionStorage.removeItem("token");
      navigate("/");
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
          <span className="navbar-toggler-icon" />
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
              // For demo show Create Test to everyone; change to userDetails?.admin when enabling real auth
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
