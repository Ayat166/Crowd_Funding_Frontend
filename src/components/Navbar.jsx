import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios"; // Axios instance
import CategoryDropdown from "./CategoryDropdown";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("firstName")); // Initialize with the first name from localStorage
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("accessToken")); // Track login state
  const navigate = useNavigate();

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
            <Link to="/profile" className="btn btn-secondary me-3">
              <p className="mb-0 me-3">Welcome, {userName}!</p>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;