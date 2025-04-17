import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import DonationComponent from "./DonationComponent";
import CommentSection from "./CommentSection";
import RatingComponent from "./RatingComponent";
import ImagesSlider from "./ImagesSlider";
import "./css/ProjectDetail.css";

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

  if (!project) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left column: Main content */}
        <div className="col-lg-8">
          <h2 className="text-success fw-bold mb-3">{project.title}</h2>

          <ImagesSlider images={project.uploaded_images} carouselId={`carousel-${project.id}`} />

          <p className="mt-3">{project.details}</p>

          <div className="border p-3 rounded bg-light mb-3">
            <h5 className="fw-semibold">Project Financials</h5>
            <p><strong>Target:</strong> ${project.total_target}</p>
            <p><strong>Current Donations:</strong> ${project.total_donations}</p>
          </div>

          {loggedIn && (
            <button
              className="btn btn-outline-danger btn-sm mb-2"
              onClick={() => {
                setReportingProjectId(project.id);
                setReportType("project");
              }}
            >
              🚩 Report Project
            </button>
          )}

{project.is_active && userId == project.creator.id && (
  <div className="d-flex justify-content-start mt-3">
    <button
      className="btn btn-outline-danger px-4 py-2 fw-semibold shadow-sm"
      onClick={handleCancelProject}
    >
      ❌ Cancel Project
    </button>
  </div>
)}

          <div className="mb-4">
            <DonationComponent projectId={id} />
          </div>

          <div className="mb-4">
            <CommentSection projectId={id} />
          </div>
        </div>

        {/* Right column: Rating or other sidebar info */}
        <div className="col-lg-4">
          <RatingComponent projectId={id} />
        </div>
      </div>

      {/* Report Modal */}
      {reportingProjectId && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Report Project</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setReportingProjectId(null)}
                />
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Enter the reason for reporting..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReportingProjectId(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleReport}>
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
