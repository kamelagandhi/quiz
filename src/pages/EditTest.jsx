import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTest = () => {
  const { token } = useContext(AuthContext); // Access the authentication token
  const location = useLocation();
  const navigate = useNavigate();
  const { testDetails } = location.state || {}; // Get test details from the state

  const [formData, setFormData] = useState({
    subject: "",
    timePerQuestion: "",
    markPerQuestion: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (testDetails) {
      setFormData({
        subject: testDetails.subject || "",
        timePerQuestion: testDetails.timePerQuestion || "",
        markPerQuestion: testDetails.markPerQuestion || "",
        description: testDetails.description || "",
      });
    }
  }, [testDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8080/api/tests/${testDetails.id}/update-test`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Test updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred while updating the test."
      );
    }
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "100px",
      }}
    >
      <h2 className="text-center">Edit Test</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timePerQuestion" className="form-label">
            Time Per Question (seconds)
          </label>
          <input
            type="number"
            className="form-control"
            id="timePerQuestion"
            name="timePerQuestion"
            value={formData.timePerQuestion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="markPerQuestion" className="form-label">
            Marks Per Question
          </label>
          <input
            type="number"
            className="form-control"
            id="markPerQuestion"
            name="markPerQuestion"
            value={formData.markPerQuestion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Update Test
        </button>
      </form>
    </div>
  );
};

export default EditTest;
