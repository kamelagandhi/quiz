import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const EditQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  // Extract question data from location state
  const questionData = location.state?.questionData || {};
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [options, setOptions] = useState(
    questionData.options || ["", "", "", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    questionData.correctAnswer || ""
  );
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionRequestDTO = {
      questionText,
      options,
      correctAnswer,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/questions/${questionData.id}/update`,
        questionRequestDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Question updated successfully.");
      navigate(-1); // Navigate back to the questions list
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred while updating the question."
      );
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <h2 className="text-center">Edit Question</h2>
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
            </div>
          ))}
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
          Update Question
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
