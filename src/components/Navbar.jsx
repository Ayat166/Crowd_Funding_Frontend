import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios";
import CategoryDropdown from "./CategoryDropdown";
import { refreshAccessToken } from "../utils/auth";
import axios from "axios";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("firstName"));
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [showConfirm, setShowConfirm] = useState(false);
  const [is_superuser, set_superuser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        try {
          const response = await api.get(`/users/profile/${userId}`);
          const user = response.data.user;
          setUserName(user.first_name);
          localStorage.setItem("firstName", user.first_name);
          set_superuser(user.is_superuser === true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserName(null);
      }
    };

    fetchUserProfile();
  }, [loggedIn]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token || isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (!token) {
      alert("You have been logged out due to session expiration.");
      localStorage.clear();
      setUserName(null);
      setLoggedIn(false);
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/users/logout/",
        { refresh_token: localStorage.getItem("refreshToken") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.clear();
      setUserName(null);
      setLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      alert("Logout failed, please try again.");
    }
  };

  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  const isActive = (path) =>
    location.pathname === path ? "nav-link active text-warning" : "nav-link text-light";

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#2c3e50" }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center text-warning">
          <img
            src="src/assets/pngwing.com.png"
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          Crowd Funding
        </Link>
        <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={isActive("/")}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={isActive("/about")}>About</Link>
            </li>
            <CategoryDropdown />
            {loggedIn && is_superuser && (
              <>
                <li className="nav-item">
                  <Link to="/admin/feature-projects" className={isActive("/admin/feature-projects")}>Featured Projects</Link>
                </li>
                <li className="nav-item">
                  <Link to="/all-donations" className={isActive("/all-donations")}>All Donations</Link>
                </li>
                <li className="nav-item">
                  <Link to="/all-reports" className={isActive("/all-reports")}>All Reports</Link>
                </li>
              </>
            )}
          </ul>

          <form className="d-flex me-3" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2 bg-light border-0"
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-warning text-dark" type="submit">Search</button>
          </form>

          {userName ? (
            <>
              <Link to="/profile" className="btn btn-outline-success text-light me-3">
                Welcome, {userName}
              </Link>
              <button className="btn btn-outline-danger" onClick={() => setShowConfirm(true)}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-light me-3">Login</Link>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
