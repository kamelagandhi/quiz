import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, userDetails, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.ok) {
        logout();
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
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
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : userDetails?.admin ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/create-test"
                  >
                    Create Test
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/view-results"
                  >
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
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/view-results"
                  >
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
