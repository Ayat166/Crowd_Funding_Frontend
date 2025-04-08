import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance

const AllDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch all donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get("/donations/");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error.message);
        setError("Failed to fetch donations. Please try again.");
      }
    };

    fetchDonations();
  }, [token]);

  return (
    <div className="container my-5">
      <h1 className="mb-4">All Donations</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mt-5">
        <h2>Donations</h2>
        {donations.length > 0 ? (
          <ul className="list-group">
            {donations.map((donation) => (
              <li key={donation.id} className="list-group-item">
                <strong>User:</strong> {donation.user_name} -{" "}
                <strong>Project:</strong> {donation.project} -{" "}
                <strong>Amount:</strong> ${donation.amount} -{" "}
                <strong>Date:</strong>{" "}
                {new Date(donation.date_donated).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations available.</p>
        )}
      </div>
    </div>
  );
};

export default AllDonationsPage;