import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ViewResults = () => {
  const { token, userDetails } = useContext(AuthContext);

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  useEffect(() => {
    fetchResults();
  }, []); // Empty dependency array to only run on mount

  const fetchResults = async () => {
    const isAdmin = userDetails?.admin
      ? "http://localhost:8080/api/results/view-results"
      : `http://localhost:8080/api/results/view-results/${userDetails.id}`;
    try {
      const response = await axios.get(isAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(response.data);
      setFilteredResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const deleteResult = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/results/${resultId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(results.filter((result) => result.resultId !== resultId));
      setFilteredResults(
        filteredResults.filter((result) => result.resultId !== resultId)
      );
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = results.filter(
      (result) =>
        result.fullName.toLowerCase().includes(term) ||
        result.email.toLowerCase().includes(term) ||
        result.subject.toLowerCase().includes(term)
    );
    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <h2 className="text-center">View Results</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Email, or Subject"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {results.length === 0 ? (
        <div>No available results</div>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Total Questions</th>
                <th>Correct Answers</th>
                <th>Percentage</th>
                <th>Test Taken At</th>
                {userDetails?.admin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => (
                <tr key={result.resultId}>
                  <td>{index + 1 + indexOfFirstResult}</td>
                  <td>{result.fullName}</td>
                  <td>{result.email}</td>
                  <td>{result.subject}</td>
                  <td>{result.totalQuestions}</td>
                  <td>{result.correctAnswers}</td>
                  <td>{result.percentage.toFixed(2)}%</td>
                  <td>{new Date(result.testTakenAt).toLocaleString()}</td>
                  {userDetails?.admin && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteResult(result.resultId)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from(
                { length: Math.ceil(filteredResults.length / resultsPerPage) },
                (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default ViewResults;
