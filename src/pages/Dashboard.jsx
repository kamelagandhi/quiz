import React, { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { userDetails, token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modalData, setModalData] = useState(null); // Modal data state
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleAddQuestion = (testId) => {
    navigate(`/add-question/${testId}`, { state: { testDetails } }); // Navigate to Add Question page
  };

  const handleViewQuestions = (testId) => {
    navigate(`/view-questions/${testId}`, { state: { testDetails } });
  };

  const handleTakeTest = () => {
    setShowConfirmModal(true); // Show confirmation modal
  };

  const confirmTakeTest = () => {
    setShowConfirmModal(false); // Hide modal
    navigate(`/test/${testDetails.id}`, { state: { testDetails } });
  };

  useEffect(() => {
    if (!userDetails) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  const axiosInstance = useMemo(() => {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return;
      try {
        const response = await axiosInstance.get(
          "http://localhost:8080/api/tests"
        );
        const responseData = response.data;

        // Check if the response data is an array or not
        if (Array.isArray(responseData)) {
          setSubjects(responseData);
        } else {
          console.warn("Unexpected response format:", responseData);
          setSubjects([]); // Set empty array when no tests are available
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]); // Handle error by setting an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [axiosInstance, token]);

  const fetchTestDetails = async (testId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8080/api/tests/${testId}`
      );
      setTestDetails(response.data);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const fetchUserResult = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8080/api/results/view-results/${userDetails.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user results:", error);
      return [];
    }
  };

  const handleChangeSubject = async (e) => {
    const selectedSubjectId = e.target.value;
    setSubject(selectedSubjectId);

    if (selectedSubjectId) {
      fetchTestDetails(selectedSubjectId);

      const results = await fetchUserResult();
      const matchingResult = results.find(
        (res) =>
          res.subject ===
          subjects.find((sub) => sub.id === +selectedSubjectId)?.subject
      );

      setResult(matchingResult || null);
    } else {
      setTestDetails(null);
      setResult(null);
    }
  };

  const handleViewResult = () => {
    setModalData(result); // Populate modal with the result
    setShowModal(true); // Open the modal
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await axiosInstance.delete(
          `http://localhost:8080/api/tests/${testId}/delete-test`
        );

        // Optionally update the subjects state (though the reload will refresh the data).
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subj) => subj.id !== testId)
        );

        // Reload the window to fetch the latest data.
        window.location.reload();
      } catch (error) {
        console.error("Error deleting test:", error);
      }
    }
  };

  const handleEditTest = (testId) => {
    navigate(`/edit-test/${testId}`, { state: { testDetails } });
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setModalData(null); // Clear modal data
  };

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container">
        <h1>Welcome, {userDetails?.fullName}</h1>
        <div>
          {subjects.length > 0 ? (
            <select
              className="form-control"
              value={subject}
              onChange={handleChangeSubject}
            >
              <option value="">Select a subject</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.subject}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-3">No available tests at the moment.</p>
          )}
        </div>

        {testDetails && (
          <div
            style={{ marginTop: "20px", marginBottom: "100px" }}
            className="card p-4"
          >
            <h3>Test Details</h3>
            <hr />
            <p>
              <strong>Subject:</strong> {testDetails.subject}
            </p>
            <p>
              <strong>Description:</strong> {testDetails.description}
            </p>
            <p>
              <strong>Mark per Question:</strong> {testDetails.markPerQuestion}
            </p>
            <p>
              <strong>Time per Question:</strong> {testDetails.timePerQuestion}{" "}
              seconds
            </p>
            <p>
              <strong>Total Time:</strong> {testDetails.formattedTotalTime}
            </p>
            <div>
              {userDetails?.admin ? (
                <>
                  <button
                    className="btn btn-outline-success me-3 my-2"
                    onClick={() => handleAddQuestion(testDetails.id)}
                  >
                    Add Question
                  </button>
                  <button
                    className="btn btn-outline-secondary me-3 my-2"
                    onClick={() => handleViewQuestions(testDetails.id)}
                  >
                    View Questions
                  </button>
                  <button
                    className="btn btn-outline-warning me-3 my-2"
                    onClick={() => handleEditTest(testDetails.id)}
                  >
                    Edit Test
                  </button>
                  <button
                    className="btn btn-outline-danger my-2"
                    onClick={() => handleDeleteTest(testDetails.id)}
                  >
                    Delete Test
                  </button>
                </>
              ) : result ? (
                <button
                  className="btn btn-outline-success"
                  onClick={handleViewResult}
                >
                  View Result
                </button>
              ) : (
                <button
                  className="btn btn-outline-success"
                  onClick={handleTakeTest}
                >
                  Take Test
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Test</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to take this test? Once started, the timer
                will begin, and you cannot navigate away.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmTakeTest}>
                  Yes, Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Modal */}
      {showModal && modalData && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Test Result for {userDetails?.fullName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Subject:</strong> {modalData.subject}
                </p>
                <p>
                  <strong>Total Questions:</strong> {modalData.totalQuestions}
                </p>
                <p>
                  <strong>Correct Answers:</strong> {modalData.correctAnswers}
                </p>
                <p>
                  <strong>Percentage:</strong>{" "}
                  {modalData.percentage
                    ? modalData.percentage.toFixed(2)
                    : "N/A"}
                  %
                </p>
                <p>
                  <strong>Test Taken At:</strong>{" "}
                  {new Date(modalData.testTakenAt).toLocaleString()}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
