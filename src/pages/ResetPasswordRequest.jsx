import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/reset-password/", {
        email,
      });
      setMessage(response.data.message); // Success message from the API
      setTimeout(() => {
        navigate("/login"); // Redirect to login after a delay
      }, 2000);
    } catch (err) {
      setError("There was an error, please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default ResetPasswordRequest;
