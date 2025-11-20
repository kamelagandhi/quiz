import React, { useState, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AddQuestion = () => {
  const { testId } = useParams(); // Retrieve testId from the URL
  const { token } = useContext(AuthContext);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([""]); // Start with a single option
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const testDetails = location.state?.testDetails;

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);

    // If the correct answer is being removed, reset it
    if (correctAnswer === options[index]) {
      setCorrectAnswer("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionRequestDTO = {
      questionText,
      options,
      correctAnswer,
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/api/questions/${testId}/add-question`,
        questionRequestDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data); // Show success message
      setQuestionText("");
      setOptions([""]); // Reset to a single option
      setCorrectAnswer("");
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred while adding the question."
      );
    }
  };

  return (
    <div
      className="container"
      style={{ marginTop: "130px", marginBottom: "130px" }}
    >
      <h2 className="text-center">Add Question for {testDetails?.subject}</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="questionText" className="form-label">
            Question Text
          </label>
          <textarea
            className="form-control"
            id="questionText"
            placeholder="Enter your question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Options</label>
          {options.map((option, index) => (
            <div key={index} className="input-group mb-2">
              <span className="input-group-text">Option {index + 1}</span>
              <input
                type="text"
                className="form-control"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeOption(index)}
                disabled={options.length === 1} // Prevent removing the last option
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addOption}>
            Add Option
          </button>
        </div>
        <div className="mb-3">
          <label htmlFor="correctAnswer" className="form-label">
            Correct Answer
          </label>
          <select
            id="correctAnswer"
            className="form-control"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select Correct Answer</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                Option {index + 1}: {option}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
