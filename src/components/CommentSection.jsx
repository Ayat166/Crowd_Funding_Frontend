import React, { useState, useEffect } from "react";
import api from "../utils/axios"; // Axios instance
{/* <h3>Comments</h3>
      <CommentSection projectId={1} />
      <Link to="/signup" className="btn btn-primary mt-3">
        Get Started
      </Link> */}
const CommentSection = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [reportReason, setReportReason] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false); // State to toggle comments display
  const [expandedReplies, setExpandedReplies] = useState({}); // State to toggle replies for each comment

  const [reportType, setReportType] = useState("comment");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/projects/${projectId}/comments/`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [projectId]);

  const handleAddComment = async () => {
    try {
      const response = await api.post(`/comments/projects/${projectId}/comments/`, {
        text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    try {
      const response = await api.post(`/comments/comments/${commentId}/replies/`, {
        text: replyText[commentId],
      });
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
    else if (reportType === "comment_reply") payload.comment_reply = reportingCommentId;
  
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
    <div className="comment-section container mt-3">
      <div className="add-comment mb-3">
        <textarea
          className="form-control form-control-sm mb-2"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ fontSize: "0.9rem" }}
        />
        <button className="btn btn-primary btn-sm" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
      <div className="comments-list">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="comment card mb-2 p-2">
            <div className="card-body p-2">
              <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
                <strong>{comment.user}</strong>: {comment.text}
              </p>
              <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  setReportingCommentId(comment.id);
                  setReportType("comment");
                }}
              >
                Report Comment
              </button>

                <textarea
                  className="form-control form-control-sm my-1"
                  placeholder="Reply..."
                  value={replyText[comment.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [comment.id]: e.target.value })
                  }
                  style={{ fontSize: "0.8rem" }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddReply(comment.id)}
                >
                  Reply
                </button>
              </div>
              <div className="replies mt-2 ps-2 border-start">
              {(expandedReplies[comment.id]
                ? comment.replies
                : comment.replies.slice(0, 2)
                ).map((reply) => (
                <div key={reply.id} className="reply card bg-light mb-1 p-1">
                  <div className="card-body p-1">
                    <p className="card-text mb-0" style={{ fontSize: "0.8rem" }}>
                      <strong>{reply.user}</strong>: {reply.text}
                    </p>
                    <div className="text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setReportingCommentId(reply.id);
                        setReportType("comment_reply");
                      }}
                    >
                      Report Reply
                    </button>

                    </div>
                  </div>
                </div>
              ))}
                {/* {(expandedReplies[comment.id]
                    ? comment.replies
                    : comment.replies.slice(0, 2)
                ).map((reply) => (
                    <div key={reply.id} className="reply card bg-light mb-1 p-1">
                    <div className="card-body p-1">
                        <p className="card-text mb-0" style={{ fontSize: "0.8rem" }}>
                        <strong>{reply.user}</strong>: {reply.text}
                        </p>
                    </div>
                    </div>
                ))} */}
                {comment.replies.length > 2 && (
                    <div className="text-center mt-1">
                    <button
                        className="btn btn-link btn-sm"
                        onClick={() => toggleReplies(comment.id)}
                        style={{ fontSize: "0.8rem" }}
                    >
                        {expandedReplies[comment.id] ? "Show Less" : "Show All Replies"}
                    </button>
                    </div>
                )}
                </div>
            </div>
          </div>
        ))}
      </div>
      {comments.length > 2 && (
        <div className="text-center mt-2">
          <button
            className="btn btn-link btn-sm"
            onClick={() => setShowAllComments(!showAllComments)}
            style={{ fontSize: "0.9rem" }}
          >
            {showAllComments ? "Show Less" : "Show All Comments"}
          </button>
        </div>
      )}

      {reportingCommentId && (
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
                  onClick={() => setReportingCommentId(null)}
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
                  onClick={() => setReportingCommentId(null)}
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

export default CommentSection;