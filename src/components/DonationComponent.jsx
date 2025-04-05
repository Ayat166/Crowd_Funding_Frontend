import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance

const DonationComponent = ({ projectId }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        console.log("Token used:", token); // Debugging line

        const response = await api.get(`/donations/projects/${projectId}/`);
        console.log("Fetched donations:", response.data); // Debugging line
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [token, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/donations/",
        { project: projectId, amount }, // Include the project ID and amount
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token for authentication
          },
        }
      );
      setMessage("Donation successful!");
      setAmount(""); // Reset the amount field
      setDonations((prevDonations) => [...prevDonations, response.data]); // Update donations list
    } catch (error) {
      console.error("Error making donation:", error.response?.data || error.message);
      setMessage("Failed to make a donation. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Make a Donation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="donationAmount" className="form-label">
            Donation Amount ($)
          </label>
          <input
            type="number"
            className="form-control"
            id="donationAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Donate
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="mt-5">
        <h2>Donations</h2>
        {donations.length > 0 ? (
          <ul className="list-group">
            {donations.map((donation) => (
              <li key={donation.id} className="list-group-item">
                <strong>User:</strong> {donation.user_name} -{" "}
                <strong>Amount:</strong> ${donation.amount} -{" "}
                <strong>Date:</strong>{" "}
                {new Date(donation.date_donated).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations yet. Be the first to donate!</p>
        )}
      </div>
    </div>
  );
};

export default DonationComponent;