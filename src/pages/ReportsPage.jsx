import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all reports
    const fetchReports = async () => {
      try {
        const response = await api.get("/comments/reports/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
          },
        });
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Not allowed");
        } else {
          setError(err.response?.data || "Error fetching reports");
        }
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  // Separate reports into project reports and comment reports
  const projectReports = reports.filter((report) => report.report_type === "project");
  const commentReports = reports.filter((report) => report.report_type === "comment");
  const commentReplyReports = reports.filter((report) => report.report_type === "comment_reply");

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">All Reports</h1>

      {/* Project Reports */}
      <h2 className="mt-5">Reports of Projects</h2>
      {projectReports.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Reason</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {projectReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.user}</td>
                  <td>{report.project || "N/A"}</td>
                  <td>{report.project_name || "N/A"}</td>
                  <td>{report.reason}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No project reports available.</p>
      )}

      {/* Comment Reports */}
      <h2 className="mt-5">Reports of Comments</h2>
      {commentReports.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Comment ID</th>
                <th>Comment Text</th>
                <th>Reason</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {commentReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.user}</td>
                  <td>{report.comment || "N/A"}</td>
                  <td>{report.comment_text || "N/A"}</td>
                  <td>{report.reason}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No comment reports available.</p>
      )}

      {/* Comment Reply Reports */}
      <h2 className="mt-5">Reports of Comment Replies</h2>
      {commentReplyReports.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Comment Reply ID</th>
                <th>Comment Reply Text</th>
                <th>Reason</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {commentReplyReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.user}</td>
                  <td>{report.comment_reply || "N/A"}</td>
                  <td>{report.comment_reply_text || "N/A"}</td>
                  <td>{report.reason}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No comment reply reports available.</p>
      )}
    </div>
  );
};

export default ReportsPage;