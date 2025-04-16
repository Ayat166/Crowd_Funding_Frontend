import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import DonationComponent from "./DonationComponent";
import CommentSection from "./CommentSection";
import RatingComponent from "./RatingComponent";
import ImagesSlider from "./ImagesSlider";
import "./css/ProjectDetail.css"; // Add this for styles

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reportingProjectId, setReportingProjectId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState("project");
  const userId = localStorage.getItem("userId");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}/`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    const token = localStorage.getItem("accessToken");
    setLoggedIn(!!token);
    fetchProject();
  }, [id]);

  const handleCancelProject = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this project? This action cannot be undone.");
    if (!confirmCancel) return;
    try {
      const response = await api.patch(`/projects/${id}/cancel/`);
      alert(response.data.message);
      setProject({ ...project, is_active: false });
    } catch (error) {
      console.error("Error canceling project:", error);
      alert("Unable to cancel the project.");
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    const payload = { report_type: reportType, reason: reportReason };
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

  if (!project) return <div className="loading">Loading...</div>;

  return (
    <div className="project-detail-wrapper">
      <div className="project-detail-container">
        {/* Main Content */}
        <div className="project-main">
          <h1 className="fw-bold text-success">{project.title}</h1>

          <ImagesSlider images={project.uploaded_images} carouselId={`carousel-${project.id}`} />

          <p className="project-description">{project.details}</p>

          <div className="project-financials">
            <p><strong>Target:</strong> ${project.total_target}</p>
            <p><strong>Current Donations:</strong> ${project.total_donations}</p>
          </div>

          {loggedIn && (
            <button 
              className="btn btn-warning btn-sm"
              onClick={() => {
                setReportingProjectId(project.id);
                setReportType("project");
              }}
            >
              Report Project
            </button>
          )}

          {project.is_active && userId == project.creator.id && (
            <button onClick={handleCancelProject} className="btn btn-danger cancel-btn">
              Cancel Project
            </button>
          )}

          <div className="donation-section">
            <DonationComponent projectId={id} />
          </div>

          <div className="comment-section">
            <CommentSection projectId={id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="project-sidebar">
          <RatingComponent projectId={id} />
        </div>
      </div>

      {/* Report Modal */}
      {reportingProjectId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Report Project</h5>
                <button type="button" className="btn-close" onClick={() => setReportingProjectId(null)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Enter the reason..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setReportingProjectId(null)}>Cancel</button>
                <button className="btn btn-danger btn-sm" onClick={handleReport}>Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
