import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const TestPage = () => {
  const { userDetails, token } = useContext(AuthContext);

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabCount, setTabCount] = useState(0);
  const [tabSwitchAlert, setTabSwitchAlert] = useState(false);
  const [windowRefresh, setWindowRefress] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const location = useLocation();
  const testDetails = location.state?.testDetails;

  const parseFormattedTime = (formattedTime) => {
    const [hours, minutes, seconds] = formattedTime.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const [timeLeft, setTimeLeft] = useState(
    parseFormattedTime(testDetails?.formattedTotalTime || "00:30:00")
  );
  const testId = testDetails?.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/questions/${testId}/shuffled-questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Assuming the backend returns a list of questions directly
        setQuestions(response.data);
        setUserAnswers(Array(response.data.length).fill(""));
      } catch (error) {
        alert("Error fetching questions. Redirecting to dashboard.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, token, navigate]);

  // Handle window/tab switching
  const windowTabSwitch = (e) => {
    e.preventDefault();

    if (tabCount === 0) {
      // Show an alert on the first tab switch
      alert("If you switch tabs again, your test will be submitted!");
      setTabSwitchAlert(true);
    }

    if (tabCount >= 1) {
      // Submit the test on the second tab switch
      alert("Tab switching is not allowed! Your test will be submitted now.");
      handleSubmit();
    }

    // Increment the tab switch count
    setTabCount((prevCount) => prevCount + 1);
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Handle tab switch by calling windowTabSwitch
        windowTabSwitch({ preventDefault: () => {} });
      }
    };

    const handleWindowRefresh = (e) => {
      e.preventDefault();
      if (!windowRefresh) {
        alert("This action is not allowed! Test will be submited");
        handleSubmit();
      }
      setWindowRefress(false);
    };

    // Disable all keyboard shortcuts
    const disableKeyboardShortcuts = (e) => {
      e.preventDefault();
      alert("Keyboard usage is disabled during the test!");
    };

    // Disable right-click
    const disableRightClick = (e) => {
      e.preventDefault();
      alert("Right-click is disabled during the test!");
    };

    // Disable forward/backward navigation
    const disableNavigation = (e) => {
      e.preventDefault();
      alert("This action is not allowed! Your test will be submitted.");
      handleSubmit();
    };

    // Disable text selection
    const disableTextSelection = (e) => {
      e.preventDefault();
    };

    window.addEventListener("", windowTabSwitch);

    // Add event listeners
    window.addEventListener("keydown", disableKeyboardShortcuts);
    window.addEventListener("keypress", disableKeyboardShortcuts);
    window.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("selectstart", disableTextSelection);
    // window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", disableNavigation);

    // Add event listeners for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("load", handleWindowRefresh);

    return () => {
      // Clean up event listeners
      window.removeEventListener("keydown", disableKeyboardShortcuts);
      window.removeEventListener("keypress", disableKeyboardShortcuts);
      window.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("selectstart", disableTextSelection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("load", handleWindowRefresh);
      window.removeEventListener("popstate", disableNavigation);
    };
  }, [tabCount]);

  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1); // Move to next page
      setCurrentQuestionIndex(0); // Reset question index to 0
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Move to previous page
      setCurrentQuestionIndex(questions.length - 1); // Set index to last question on the previous page
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/results/submit-test",
        {
          userId: userDetails?.id,
          testId: testDetails?.id,
          userAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(
        "Test submitted successfully. You will now return to the dashboard."
      );
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to submit test. Try again.");
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <h2>Test for {userDetails?.fullName}</h2>
      <div className="card p-4">
        <h4 className="text-danger">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </h4>
        <div>
          <h5>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h5>
          <p className="text-bold">{currentQuestion.questionText}</p>
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={userAnswers[currentQuestionIndex] === option}
                onChange={() => handleAnswerChange(option)}
              />{" "}
              {option}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex !== questions.length - 1 ? (
            <button
              className="btn btn-outline-success me-2"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to submit the test? Once submitted, you cannot change your answers."
                );
                if (confirmed) {
                  handleSubmit();
                }
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
