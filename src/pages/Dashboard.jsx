// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService"; // <- central axios instance (default export)

const Dashboard = () => {
  const { userDetails, token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create Test UI state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      navigate("/");
      return;
    }
  }, [userDetails, navigate]);

  // Load list of tests (subjects)
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // call backend via central api; adjust path if your backend uses different route
        const res = await api.get("/tests");
        const data = res.data;
        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (data && Array.isArray(data.tests)) {
          setSubjects(data.tests);
        } else {
          setSubjects([]);
          console.warn("Unexpected tests response:", data);
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [token]);

  // fetch details for a specific test
  const fetchTestDetails = async (testId) => {
    if (!testId) return setTestDetails(null);
    try {
      const res = await api.get(`/tests/${testId}`);
      setTestDetails(res.data);
    } catch (err) {
      console.error("Error fetching test details:", err);
      setTestDetails(null);
    }
  };

  // fetch results for current user
  const fetchUserResult = async () => {
    if (!userDetails?.id) return [];
    try {
      // adjust endpoint path if backend differs
      const res = await api.get(`/results/view-results/${userDetails.id}`);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching user results:", err);
      return [];
    }
  };

  const handleChangeSubject = async (e) => {
    const selectedSubjectId = e.target.value;
    setSubject(selectedSubjectId);

    if (!selectedSubjectId) {
      setTestDetails(null);
      setResult(null);
      return;
    }

    await fetchTestDetails(selectedSubjectId);
    const results = await fetchUserResult();

    // Map subject id format to whatever backend returns (_id or id)
    const foundSub = subjects.find(
      (s) => String(s._id || s.id) === String(selectedSubjectId)
    );

    const matchingResult = results.find(
      (r) => r.subject === (foundSub?.subject || foundSub?.name)
    );

    setResult(matchingResult || null);
  };

  const handleViewResult = () => {
    // open modal or show result - reuse existing modal logic
    // For simplicity we'll use an alert here; your modal code can be reused
    if (result) {
      // show modal (existing modal code below uses modalData state)
      // setModalData(result); setShowModal(true);
      alert(`Result: ${JSON.stringify(result)}`);
    } else {
      alert("No results found");
    }
  };

  const handleTakeTest = () => {
    setShowConfirmModal(true);
  };

  const confirmTakeTest = () => {
    setShowConfirmModal(false);
    if (!testDetails?.id && !testDetails?._id) {
      return alert("No test selected");
    }
    const id = testDetails._id || testDetails.id;
    navigate(`/test/${id}`, { state: { testDetails } });
  };

  const handleAddQuestion = (testId) => {
    const id = testId || testDetails?._id || testDetails?.id;
    if (!id) return alert("No test selected");
    navigate(`/add-question/${id}`, { state: { testDetails } });
  };

  const handleViewQuestions = (testId) => {
    const id = testId || testDetails?._id || testDetails?.id;
    if (!id) return alert("No test selected");
    navigate(`/view-questions/${id}`, { state: { testDetails } });
  };

  const handleEditTest = (testId) => {
    const id = testId || testDetails?._id || testDetails?.id;
    if (!id) return alert("No test selected");
    navigate(`/edit-test/${id}`, { state: { testDetails } });
  };

  const handleDeleteTest = async (testId) => {
    const id = testId || testDetails?._id || testDetails?.id;
    if (!id) return alert("No test selected");
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      // adjust endpoint path if backend expects different route
      await api.delete(`/tests/${id}/delete-test`);
      // refresh list locally
      setSubjects((prev) => prev.filter((s) => String(s._id || s.id) !== String(id)));
      setTestDetails(null);
      setSubject("");
      alert("Test deleted");
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("Delete failed — check console");
    }
  };

  // CREATE TEST handler (inline simple form)
  const handleCreateTest = async () => {
    if (!newTitle.trim()) return alert("Please enter title");
    setIsCreating(true);
    try {
      const payload = {
        subject: newTitle,
        description: newDescription || "",
        // add other required fields here (markPerQuestion, timePerQuestion, etc.) if backend needs them
      };
      const res = await api.post("/tests/create", payload); // adjust path if needed
      console.log("Create test res:", res);
      // refresh list
      const list = await api.get("/tests");
      setSubjects(Array.isArray(list.data) ? list.data : list.data.tests || []);
      setNewTitle("");
      setNewDescription("");
      setShowCreate(false);
      alert("Test created");
    } catch (err) {
      console.error("Create test error:", err);
      alert("Create failed — check console for details");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <div>Loading subjects...</div>;

  return (
    <div style={{ marginTop: "100px" }}>
      <div className="container">
        <h1>Welcome, {userDetails?.fullName || userDetails?.name || "User"}</h1>

        {/* Create Test button (visible for demo) */}
        <div className="mb-3 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? "Cancel Create" : "Create Test"}
          </button>
        </div>

        {/* Inline Create Form */}
        {showCreate && (
          <div className="card p-3 mb-3">
            <h5>Create Test</h5>
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Test title"
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>
            <div>
              <button
                className="btn btn-success"
                onClick={handleCreateTest}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        <div>
          {subjects.length > 0 ? (
            <select
              className="form-control"
              value={subject}
              onChange={handleChangeSubject}
            >
              <option value="">Select a subject</option>
              {subjects.map((subj) => (
                <option key={subj._id || subj.id} value={subj._id || subj.id}>
                  {subj.subject || subj.title || subj.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-3">No available tests at the moment.</p>
          )}
        </div>

        {testDetails && (
          <div style={{ marginTop: "20px", marginBottom: "100px" }} className="card p-4">
            <h3>Test Details</h3>
            <hr />
            <p><strong>Subject:</strong> {testDetails.subject || testDetails.title}</p>
            <p><strong>Description:</strong> {testDetails.description}</p>
            <p><strong>Mark per Question:</strong> {testDetails.markPerQuestion}</p>
            <p><strong>Time per Question:</strong> {testDetails.timePerQuestion} seconds</p>
            <p><strong>Total Time:</strong> {testDetails.formattedTotalTime || testDetails.totalTime}</p>

            <div>
              {userDetails?.admin ? (
                <>
                  <button className="btn btn-outline-success me-3 my-2" onClick={() => handleAddQuestion(testDetails._id || testDetails.id)}>Add Question</button>
                  <button className="btn btn-outline-secondary me-3 my-2" onClick={() => handleViewQuestions(testDetails._id || testDetails.id)}>View Questions</button>
                  <button className="btn btn-outline-warning me-3 my-2" onClick={() => handleEditTest(testDetails._id || testDetails.id)}>Edit Test</button>
                  <button className="btn btn-outline-danger my-2" onClick={() => handleDeleteTest(testDetails._id || testDetails.id)}>Delete Test</button>
                </>
              ) : result ? (
                <button className="btn btn-outline-success" onClick={handleViewResult}>View Result</button>
              ) : (
                <button className="btn btn-outline-success" onClick={handleTakeTest}>Take Test</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Confirm Test</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to take this test? Once started, the timer will begin, and you cannot navigate away.
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={confirmTakeTest}>Yes, Start Test</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
