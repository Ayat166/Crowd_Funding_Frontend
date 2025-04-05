import React ,{useEffect, useState}  from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";
import { searchProjects } from "../api"; // Assuming you have a function to search projects

function Navbar() {

  const [searchTerm, setSearchTerm] = useState("");  
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // Hook to programmatically navigate

  //function to handle search input change
  const handleSearch = async (e) => {
    e.preventDefault();  // to prevent the default form submission behavior
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);  // Navigate to the search results page with the query
    }
  };
  
  return (

    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ backgroundColor: "#e3f2fd" }}>
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Crowd Funding</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarScroll">
      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ height: "var(--bs-scroll-height)" }}>
        <li className="nav-item">
        <Link to="/" className="nav-link active" aria-current="page">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">About</Link>
        </li>
            <CategoryDropdown />
      </ul>
      {/*  Search form  */}
      <form className="d-flex" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on input change
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
