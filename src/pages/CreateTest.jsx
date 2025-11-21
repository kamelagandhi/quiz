// src/pages/CreateTest.jsx
import React, { useState } from "react";
import api from "../services/apiService";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title");

    const payload = {
      subject: title,
      description,
      markPerQuestion: 1,
      timePerQuestion: 30,
    };

    setIsCreating(true);
    try {
      // try preferred path, fallback to /tests if needed
      let res;
      try {
        res = await api.post("tests/create-test", payload);
      } catch (err) {
        console.warn("tests/create-test failed, trying /tests:", err?.response?.data || err.message);
        res = await api.post("/tests", payload);
      }
      console.log("Create test success:", res.data);
      alert("Test created successfully");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Create test error:", err?.response?.data || err);
      alert("An error occurred while creating test: " + (err?.response?.data?.message || err?.message || "Check console"));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <div className="card p-4">
        <h3>Create Test</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button className="btn btn-success" type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
