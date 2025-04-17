import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance
{
  /* <h3>Comments</h3>
      <CommentSection projectId={1} />
      <Link to="/signup" className="btn btn-primary mt-3">
        Get Started
      </Link> */
}
const CommentSection = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [reportReason, setReportReason] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false); // State to toggle comments display
  const [expandedReplies, setExpandedReplies] = useState({}); // State to toggle replies for each comment
  const [loggedIn, setLoggedIn] = useState(false);

  const [reportType, setReportType] = useState("comment");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(
          `/comments/projects/${projectId}/comments/`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    const token = localStorage.getItem("accessToken"); // or whatever token name you're using
    setLoggedIn(!!token); // sets true if token exists
    fetchComments();
  }, [projectId]);

  const handleAddComment = async () => {
    try {
      const response = await api.post(
        `/comments/projects/${projectId}/comments/`,
        {
          text: newComment,
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    try {
      const response = await api.post(
        `/comments/comments/${commentId}/replies/`,
        {
          text: replyText[commentId],
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, response.data] }
            : comment
        )
      );
      setReplyText({ ...replyText, [commentId]: "" });
    } catch (error) {
      console.error("Error adding reply:", error);
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

    if (reportType === "project") payload.project = reportingCommentId;
    else if (reportType === "comment") payload.comment = reportingCommentId;
    else if (reportType === "comment_reply")
      payload.comment_reply = reportingCommentId;

    try {
      await api.post(`/comments/reports/`, payload);
      alert(`${reportType.replace("_", " ")} reported successfully.`);
      setReportReason("");
      setReportingCommentId(null);
    } catch (error) {
      console.error("Error reporting:", error.response?.data || error.message);
    }
  };

  // const handleReportComment = async () => {
  //   if (!reportReason.trim()) {
  //     alert("Please provide a reason for reporting the comment.");
  //     return;
  //   }
  //   try {
  //     await api.post(`/comments/reports/`, {
  //       report_type: "comment",
  //       comment: reportingCommentId,
  //       reason: reportReason,
  //     });
  //     alert("Comment reported successfully.");
  //     setReportReason("");
  //     setReportingCommentId(null);
  //   } catch (error) {
  //     console.error("Error reporting comment:", error.response?.data || error.message);
  //   }
  // };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2); // Show all or first 2 comments

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Comments</h3>

      {loggedIn && (
        <div className="card mb-4">
          <div className="card-body">
            <textarea
              className="form-control mb-2"
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="text-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddComment}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {displayedComments.map((comment) => (
        <div key={comment.id} className="border-bottom pb-3 mb-3">
          <div className="d-flex align-items-start">
            <img
              src={`https://ui-avatars.com/api/?name=${comment.user}`}
              className="rounded-circle me-3"
              alt={comment.user}
              width="35"
              height="35"
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">{comment.user}</small>
                {loggedIn && (
                  <button
                    className="btn btn-link btn-sm text-muted"
                    title="Report Comment"
                    onClick={() => {
                      setReportingCommentId(comment.id);
                      setReportType("comment");
                    }}
                  >
                    <i className="bi bi-flag-fill text-danger"></i>
                  </button>
                )}
              </div>
              <p className="mb-2 fs-6">{comment.text}</p>

              {/* Replies */}
              <div className="mt-3 ps-3 border-start">
                {(expandedReplies[comment.id]
                  ? comment.replies
                  : comment.replies.slice(0, 2)
                ).map((reply) => (
                  <div key={reply.id} className="d-flex mb-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${reply.user}`}
                      className="rounded-circle me-2"
                      alt={reply.user}
                      width="28"
                      height="28"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{reply.user}</small>
                        {loggedIn && (
                          <button
                            className="btn btn-link btn-sm text-muted text-danger"
                            title="Report Reply"
                            onClick={() => {
                              setReportingCommentId(reply.id);
                              setReportType("comment_reply");
                            }}
                          >
                            <i className="bi bi-flag-fill text-danger"></i>
                          </button>
                        )}
                      </div>
                      <div className="fs-7">{reply.text}</div>
                    </div>
                  </div>
                ))}

                {comment.replies.length > 2 && (
                  <div className="text-center mt-2">
                    <button
                      className="btn btn-link btn-sm"
                      onClick={() => toggleReplies(comment.id)}
                    >
                      {expandedReplies[comment.id]
                        ? "Show Less Replies"
                        : "Show All Replies"}
                    </button>
                  </div>
                )}

                {/* Reply Input (after all replies) */}
                {loggedIn && (
                  <div className="mt-3">
                    <textarea
                      className="form-control form-control-sm mb-2"
                      placeholder="Write a reply..."
                      rows={2}
                      value={replyText[comment.id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [comment.id]: e.target.value,
                        })
                      }
                    />
                    <div className="text-end">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {comments.length > 2 && (
        <div className="text-center mt-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? "Show Less Comments" : "Show All Comments"}
          </button>
        </div>
      )}

      {/* Report Modal */}
      {reportingCommentId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  Report {reportType.replace("_", " ")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReportingCommentId(null)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Enter reason for reporting..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReportingCommentId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleReport}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
