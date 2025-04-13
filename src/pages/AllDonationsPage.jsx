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
    <h2 className="mb-3">Donations</h2>
    {donations.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.user}</td>
                <td>{donation.project}</td>
                <td>${donation.amount}</td>
                <td>{new Date(donation.date_donated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No donations available.</p>
    )}
  </div>
</div>

  );
};

export default AllDonationsPage;