import React, { useState, useEffect , useRef } from "react";
import { useParams } from "react-router-dom"; // To read the ID from the URL
import api from "../utils/axios"; // Axios instance
import DonationComponent from "./DonationComponent"; // Import the DonationComponent
import CommentSection from "./CommentSection"; // Import the CommentSection component
import RatingComponent from "./RatingComponent"; // Import the RatingComponent
import ImagesSlider from "./ImagesSlider";

const ProjectDetail = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State to hold the project data
  const [reportingProjectId, setReportingProjectId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState("project");
  const userId = localStorage.getItem("userId");
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
    const confirmCancel = window.confirm("Are you sure you want to cancel this project? This action cannot be undone.");
  
    if (!confirmCancel) {
      return; // Exit if user cancels
    }
  
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
  const handleReport = async () => {
    if (!reportReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
  
    const payload = {
      report_type: reportType,
      reason: reportReason,
    };
  

    if (reportType === "project") payload.project = reportingProjectId;
 
    try {
      await api.post(`/comments/reports/`, payload);
      alert(`${reportType.replace("_", " ")} reported successfully.`);
      setReportReason("");
      setReportingProjectId(null);
    } catch (error) {
      console.error("Error reporting:", error.response?.data || error.message);
    }
  };

  return (
    <div
      className="project-detail-container"
      style={{ display: "flex", gap: "20px", padding: "20px" }}
    >
      {/* Main Content (3/4 of the page) */}
      <div
        style={{
          flex: "3",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
          {project.title}
        </h1>

        <ImagesSlider images={project.uploaded_images} carouselId={`carousel-${project.id}`} />

        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          {project.details}
        </p>
        <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
          <strong>Target:</strong> ${project.total_target}
        </p>
        <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
          <strong>Current Donations:</strong> ${project.total_donations}
        </p>
        <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  setReportingProjectId(project.id);
                  setReportType("project");
                }}
              >
                Report Project
        </button>
        <br />
        <br />
        {project.is_active && userId == project.creator.id &&  (
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
      <div
        style={{
          flex: "1",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Rate this Project
        </h3>
        {/* Add the RatingComponent */}
        <RatingComponent projectId={id} />
      </div>
      {reportingProjectId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontSize: "1rem" }}>
                  Report Comment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReportingProjectId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Enter the reason for reporting this comment..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReportingProjectId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleReport}
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
