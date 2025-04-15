import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For navigation
import api from "../utils/axios"; // Axios instance
import ImagesSlider from "./ImagesSlider";

import "./css/ProjectsList.css"; // You can create a custom CSS file for the list styles

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/");
        console.log(response.data); // Check the structure of the response
        setProjects(response.data.projects || response.data); // Adjust based on the response structure
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Error fetching projects, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-list-container">
      <h2>Projects</h2>
      <div className="button-container">
        <Link to="/projects/create" className="create-project-btn">
          Add Your Project
        </Link>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul className="projects-list">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id} className="project-item">
                <Link to={`/projects/${project.id}`} style={{ textDecoration: "none",color: "black"  }}>
                
                <h3>{project.title}</h3>

                {/* Wrap the slider with a div to target the images */}
                <div className="custom-slider-wrapper">
                  <ImagesSlider
                    images={project.uploaded_images}
                    carouselId={`carousel-${project.id}`}
                  />
                </div>

                <p>{project.details}</p>
                {/* Add custom styles directly */}
                <style>
                  {`
                    .custom-slider-wrapper img {
                      width: 200px !important;
                      height: 100px !important;
                      object-fit: cover;
                    }
                  `}
                </style>
                </Link>
              </li>
            ))
          ) : (
            <p>No projects available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;
