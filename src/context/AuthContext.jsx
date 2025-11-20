import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [userDetails, setUserDetails] = useState(
    JSON.parse(sessionStorage.getItem("userDetails")) || null
  );
  const navigate = useNavigate();

  // Save token to state and sessionStorage
  const saveToken = (token) => {
    setToken(token);
    sessionStorage.setItem("token", token);
    navigate("/dashboard");
  };

  // Save userDetails to state and sessionStorage
  const saveUserDetails = (details) => {
    setUserDetails(details);
    sessionStorage.setItem("userDetails", JSON.stringify(details));
  };

  const logout = () => {
    setToken("");
    setUserDetails(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userDetails");
    navigate("/");
  };

  // Automatically log the user out if the token is removed
  useEffect(() => {
    if (!token) {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: saveToken,
        userDetails,
        setUserDetails: saveUserDetails,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
