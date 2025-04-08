import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To read the ID from the URL
import api from "../utils/axios"; // Axios instance
import DonationComponent from "./DonationComponent"; // Import the DonationComponent
import CommentSection from "./CommentSection"; // Import the CommentSection component
import RatingComponent from "./RatingComponent"; // Import the RatingComponent

const ProjectDetail = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State to hold the project data

  useEffect(() => {
    // Fetch the single project details when the component mounts
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}/`); // API request to get the single project
        setProject(response.data); // Set the project data into the state
      } catch (error) {
        console.error("Error fetching project details:", error); // Handle any errors
      }
    };

    fetchProject(); // Call the function to fetch data
  }, [id]); // Dependency array with the ID to re-fetch when the project ID changes

  const handleCancelProject = async () => {
    try {
      const response = await api.patch(`/projects/${id}/cancel/`);
      alert(response.data.message);
      setProject({ ...project, is_active: false });
    } catch (error) {
      console.error("Error canceling project:", error);
      alert("Unable to cancel the project.");
    }
  };

  if (!project) {
    return <div className="loading">Loading...</div>; // Show a loading state if the project is not yet fetched
  }

  return (
    <div className="project-detail-container" style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Main Content (3/4 of the page) */}
      <div style={{ flex: "3", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>{project.title}</h1>
        <img
          src={`http://127.0.0.1:8000${project.image}`}
          alt={project.title}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
        />
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "20px" }}>{project.details}</p>
        <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
          <strong>Target:</strong> ${project.total_target}
        </p>
        <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
          <strong>Current Donations:</strong> ${project.total_donations}
        </p>
        {project.is_active && (
          <button
            onClick={handleCancelProject}
            className="btn btn-danger"
            style={{ marginBottom: "20px" }}
          >
            Cancel Project
          </button>
        )}

        {/* Add the DonationComponent */}
        <div style={{ marginTop: "20px" }}>
          <DonationComponent projectId={id} />
        </div>

        {/* Add the CommentSection */}
        <div style={{ marginTop: "40px" }}>
          <CommentSection projectId={id} />
        </div>
      </div>

      {/* Sidebar (1/4 of the page) */}
      <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Rate this Project</h3>
        {/* Add the RatingComponent */}
        <RatingComponent projectId={id} />
      </div>
    </div>
  );
};

export default ProjectDetail;
