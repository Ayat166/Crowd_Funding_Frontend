import React, { useState, useEffect } from "react";
import api from "../utils/axios";

const RatingComponent = ({ projectId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/ratings/`);
        setRatings(response.data.ratings);
        setAverageRating(response.data.avg_rating || 0);
      } catch (err) {
        setError(err.response?.data || "Error fetching ratings");
      }
    };

    const token = localStorage.getItem("accessToken");
    setLoggedIn(!!token);
    fetchRatings();
  }, [projectId]);

  const handleSubmitRating = async () => {
    if (newRating < 1 || newRating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      const response = await api.post(`/projects/${projectId}/ratings/`, {
        score: newRating,
      });

      const updatedRatings = [...ratings, response.data];
      setRatings(updatedRatings);

      if (response.data.project_avg_rating !== undefined) {
        setAverageRating(response.data.project_avg_rating);
      } else {
        const totalScore = updatedRatings.reduce((sum, r) => sum + r.score, 0);
        setAverageRating(totalScore / updatedRatings.length);
      }

      setNewRating(0);
      setError(null);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError(err.response?.data || "Error submitting rating");
      }
    }
  };

  const renderStars = (rating, size = "1.5rem") => {
    return (
      <div style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= rating ? "text-warning" : "text-secondary"}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-3 border rounded shadow-sm bg-white">
      <h4 className="text-dark mb-3">Ratings</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Average Rating */}
      <div className="mb-4 text-center">
        <h1 className="display-6 mb-1">{averageRating.toFixed(1)} / 5</h1>
        {renderStars(Math.round(averageRating), "2rem")}
        <p className="text-muted mt-2">{ratings.length} rating{ratings.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Ratings List */}
      {ratings.length > 0 ? (
        <div className="mb-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="card mb-2 shadow-sm">
              <div className="card-body p-3">
                {renderStars(rating.score)}
                <p className="mt-2 mb-0"><strong>{rating.user}</strong></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-4">No ratings submitted yet.</p>
      )}

      {/* Submit New Rating */}
      {loggedIn && (
        <div className="card bg-light p-3">
          <h5 className="mb-3">Submit Your Rating</h5>

          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Select Rating:</label>
            <select
              id="rating"
              className="form-select"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            >
              <option value="0">Choose...</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary w-100" onClick={handleSubmitRating}>
            Submit Rating
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
