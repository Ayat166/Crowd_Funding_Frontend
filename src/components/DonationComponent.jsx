import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const DonationComponent = ({ projectId }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get(`/donations/projects/${projectId}/`);
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
      setMessage("🎉 Donation successful!");
      setAmount("");
      setDonations((prevDonations) => [...prevDonations, response.data]);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login first to make a donation.");
        navigate("/login");
      } else {
        console.error("Error making donation:", error.response?.data || error.message);
        setMessage("❌ Failed to make a donation. Please try again.");
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">💰 Support this Project</h4>
              <form onSubmit={handleSubmit} className="row g-3 align-items-center">
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount in USD"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="col-sm-3 d-grid">
                  <button type="submit" className="btn btn-success">
                    Donate
                  </button>
                </div>
              </form>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">🙏 Recent Donations</h4>
              {donations.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {donations.map((donation) => (
                    <li key={donation.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{donation.user}</div>
                        <small className="text-muted">
                          {new Date(donation.date_donated).toLocaleString()}
                        </small>
                      </div>
                      <span className="badge bg-success rounded-pill">
                        ${donation.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No donations yet. Be the first to donate!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationComponent;
