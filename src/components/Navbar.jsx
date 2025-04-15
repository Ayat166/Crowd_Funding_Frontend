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
  const location = useLocation(); // ✅ to get the current path

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
      console.log("You have successfully logged out");
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

  // ✅ Helper function for active class
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Crowd Funding</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ height: "var(--bs-scroll-height)" }}>
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
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          {userName ? (
            <>
              <Link to="/profile" className={isActive("/profile") + " btn btn-secondary me-3"}>
                <p className="m-2">Welcome, {userName}!</p>
              </Link>
              <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>Logout</button>
            </>
          ) : (
            <Link to="/login" className={isActive("/login") + " btn btn-outline-primary me-3 "}><p className="m-2">Login</p></Link>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
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
