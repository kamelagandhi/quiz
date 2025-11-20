import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const CreateTest = () => {
  const { token } = useContext(AuthContext); // Access the authentication token
  const [formData, setFormData] = useState({
    subject: "",
    timePerQuestion: "",
    markPerQuestion: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tests/create-test",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token for authentication
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data);
      setFormData({
        subject: "",
        timePerQuestion: "",
        markPerQuestion: "",
        description: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred while creating the test."
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
      <h2 className="text-center">Create Test</h2>
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
          Create Test
        </button>
      </form>
    </div>
  );
};

export default CreateTest;
