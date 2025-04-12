import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResetPasswordConfirm() {
  const { uidb64, token } = useParams(); // Get UID and token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/reset-password-confirm/${uidb64}/${token}/`,
        { password }
      );
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
      <h2>Set Your New Password</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default ResetPasswordConfirm;
