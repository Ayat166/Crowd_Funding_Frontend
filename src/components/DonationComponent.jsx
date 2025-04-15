import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance
import { useNavigate } from "react-router-dom"; 
const DonationComponent = ({ projectId }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate(); // Inside your component

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
        { project: projectId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Donation successful!");
      setAmount("");
      setDonations((prevDonations) => [...prevDonations, response.data]);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login first to make a donation.");
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Error making donation:", error.response?.data || error.message);
        setMessage("Failed to make a donation. Please try again.");
      }
    }
  };
  
  return (
    <div className="container my-5">
      <h3 className="text-2xl font-bold mt-3">Add your Donation</h3>
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
      <h3 className="text-2xl font-bold mt-3">Donations</h3>
        {donations.length > 0 ? (
          <ul className="list-group">
            {donations.map((donation) => (
              <li key={donation.id} className="list-group-item">
                <strong>User:</strong> {donation.user} -{" "}
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