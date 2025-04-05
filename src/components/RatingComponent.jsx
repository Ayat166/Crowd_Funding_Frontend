import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance


// <div className="project-page">
//       <h1>Project Details</h1>
//       {/* Other project details */}
//       <RatingComponent projectId={1} />
//     </div>

const RatingComponent = ({ projectId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch ratings for the project
    const fetchRatings = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/ratings/`);
        setRatings(response.data.ratings); // Set the ratings list
        setAverageRating(response.data.avg_rating); // Set the average rating
      } catch (err) {
        setError(err.response?.data || "Error fetching ratings");
      }
    };

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
      setRatings([...ratings, response.data]); // Add the new rating to the list
      setAverageRating(response.data.project_avg_rating); // Update the average rating
      setNewRating(0);
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]); // Display specific error message
      } else {
        setError(err.response?.data || "Error submitting rating");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-secondary"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mt-4">
      <h2>Ratings</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Average Rating */}
      <div className="mb-4">
        <h4>Average Rating: {averageRating.toFixed(1)} / 5</h4>
        <div style={{ fontSize: "1.5rem" }}>{renderStars(Math.round(averageRating))}</div>
      </div>

      {/* Ratings List */}
      <div className="mb-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="card mb-2">
            <div className="card-body">
              <div style={{ fontSize: "1.2rem" }}>{renderStars(rating.score)}</div>
              <p className="mb-1">
                <strong>{rating.user}</strong>: {rating.comment || "No comment"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Submit New Rating */}
      <div className="card p-3">
        <h4>Submit Your Rating</h4>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating (1-5 Stars):
          </label>
          <select
            id="rating"
            className="form-select"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSubmitRating}>
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingComponent;