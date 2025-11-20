import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ViewQuestions = () => {
  const { token } = useContext(AuthContext);
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const testDetails = location.state?.testDetails;
  console.log(testDetails);

  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchQuestions = async (page = 0, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `http://localhost:8080/api/questions/${testId}/questions`,
        { params: { page, size: 10, search: searchTerm } }
      );
      setQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setMessage("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessage("");
    fetchQuestions(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust the debounce time as needed (e.g., 500ms)

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleDelete = async (questionId) => {
    try {
      await axiosInstance.delete(
        `http://localhost:8080/api/questions/${questionId}/delete`
      );
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setMessage("Question deleted successfully.");
    } catch (error) {
      const errorMsg = error.response?.data || "Failed to delete the question.";
      setMessage(errorMsg);
    }
  };

  if (loading) {
    return <div className="text-center">Loading questions...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Questions for {testDetails?.subject}</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {questions.length === 0 ? (
        <div className="text-center mt-4">
          <p>No questions found.</p>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Question Text</th>
              <th>Options</th>
              <th>Correct Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.id}>
                <td>{index + 1}</td>
                <td>{question.questionText}</td>
                <td>
                  <ul>
                    {question.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </td>
                <td>{question.correctAnswer}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() =>
                      navigate(`/edit-question/${question.id}`, {
                        state: { questionData: question },
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this question?"
                        )
                      ) {
                        handleDelete(question.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage + 1 === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewQuestions;
