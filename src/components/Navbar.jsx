import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios"; // Axios instance
import CategoryDropdown from "./CategoryDropdown";
import { refreshAccessToken } from '../utils/auth';
import axios from 'axios'

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("firstName")); // Initialize with the first name from localStorage
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("accessToken")); // Track login state
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [is_superuser, set_superuser] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
  
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage
      if (token && userId) {
        try {
          // Fetch user profile from the API
          const response = await api.get(`/users/profile/${userId}`);
          const user = response.data.user;
          setUserName(user.first_name); // Use the first name from the response
          localStorage.setItem("firstName", user.first_name); // Store the first name in localStorage
          set_superuser(user.is_superuser===true); // Check if the user is a superuser
       
          
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserName(null); // Clear the username if no token or user ID exists
      }
    };


    fetchUserProfile();
  }, [loggedIn]); // Re-run the effect when `loggedIn` changes

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`); // Navigate to the search results page with the query
    }
  };

  const handleLogout = async () => {
    let token = localStorage.getItem('accessToken');

    // Try refreshing token if it’s expired
    if (!token || isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (!token) {
      alert("You have been logged out due to session expiration.");
      localStorage.clear();
      setUserName(null);     // Reset the state
      setLoggedIn(false);
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/users/logout/',
        { refresh_token: localStorage.getItem('refreshToken') },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.clear();
      setUserName(null);     // Reset the state
      setLoggedIn(false);
      navigate('/');
      console.log("You Have succesfully loged out")
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      alert("Logout failed, please try again.");
    }
  };

  // Helper to check if token is expired
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      style={{ backgroundColor: "#e3f2fd" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Crowd Funding
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul
            className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style={{ height: "var(--bs-scroll-height)" }}
          >
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                About
              </Link>
            </li>
            <CategoryDropdown />
            {loggedIn && is_superuser &&  (
                  <>
                    <li className="nav-item">
                      <Link to="/all-donations" className="nav-link">
                        All Donations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/all-reports" className="nav-link">
                        All Reports
                      </Link>
                    </li>
                  </>
                )}

          </ul>
          {/* Search form */}
          <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          {/* User Info or Login Button */}
          {userName ? (
            <>
              <Link to="/profile" className="btn btn-secondary me-3">
                <p className="mb-0 me-3">Welcome, {userName}!</p>
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowConfirm(true)}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
      {showConfirm && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => {
                  setShowConfirm(false); // hide modal
                  handleLogout(); // call actual logout function
                }}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </nav >
  );
}

export default Navbar;