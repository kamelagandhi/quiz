import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import CreateTest from "./pages/CreateTest";
import AddQuestion from "./pages/AddQuestion";
import ViewQuestions from "./pages/ViewQuestions";
import EditQuestion from "./pages/EditQuestion";
import ViewResults from "./pages/ViewResults";
import EditTest from "./pages/EditTest";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/add-question/:testId" element={<AddQuestion />} />
          <Route path="/view-questions/:testId" element={<ViewQuestions />} />
          <Route path="/edit-question/:questionId" element={<EditQuestion />} />
          <Route path="/view-results" element={<ViewResults />} />
          <Route path="/edit-test/:testId" element={<EditTest />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
