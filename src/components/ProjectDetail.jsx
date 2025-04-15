import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import DonationComponent from "./DonationComponent";
import CommentSection from "./CommentSection";
import RatingComponent from "./RatingComponent";
import ImagesSlider from "./ImagesSlider";

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

  if (!project) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div
      className="project-detail-wrapper"
      style={{
        paddingLeft: "150px",
        paddingRight: "150px",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div
        className="project-detail-container"
        style={{ display: "flex", gap: "20px" }}
      >
        {/* Main Content */}
        <div
          style={{
            flex: "3",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>{project.title}</h1>

          <ImagesSlider images={project.uploaded_images} carouselId={`carousel-${project.id}`} />

          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "20px" }}>
            {project.details}
          </p>

          <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
            <strong>Target:</strong> ${project.total_target}
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
            <strong>Current Donations:</strong> ${project.total_donations}
          </p>

          {loggedIn && (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setReportingProjectId(project.id);
                setReportType("project");
              }}
            >
              Report Project
            </button>
          )}

          <br />
          <br />
          {project.is_active && userId == project.creator.id && (
            <button
              onClick={handleCancelProject}
              className="btn btn-danger"
              style={{ marginBottom: "20px" }}
            >
              Cancel Project
            </button>
          )}

          <div style={{ marginTop: "20px" }}>
            <DonationComponent projectId={id} />
          </div>

          <div style={{ marginTop: "40px" }}>
            <CommentSection projectId={id} />
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            flex: "1",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <RatingComponent projectId={id} />
        </div>
      </div>

      {/* Report Modal */}
      {reportingProjectId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontSize: "1rem" }}>
                  Report Project
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
                  placeholder="Enter the reason for reporting this project..."
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
