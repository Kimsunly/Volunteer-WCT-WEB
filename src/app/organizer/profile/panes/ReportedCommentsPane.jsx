"use client";

import React, { useState, useEffect } from "react";
import {
  getOrganizerReportedComments,
  approveComment,
  hideComment,
} from "@/services/comments";
import { showToast } from "@/components/common/CustomToaster";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";

export default function ReportedCommentsPane() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Hide modal state
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [hidingCommentId, setHidingCommentId] = useState(null);

  const fetchReportedComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrganizerReportedComments();
      setComments(res.data || []);
    } catch (err) {
      console.error("Error loading reported comments:", err);
      setError("មិនអាចទាញយកទិន្នន័យមតិយោបល់ដែលបានរាយការណ៍បានឡើយ។");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveComment(id);
      showToast.success(
        "បានអនុម័តមតិយោបល់ (រក្សាទុកមតិយោបល់) ដោយជោគជ័យ",
        "ជោគជ័យ",
      );
      // Remove from list or refresh
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error approving comment:", err);
      showToast.error("បរាជ័យក្នុងការអនុម័តមតិយោបល់", "កំហុស");
    }
  };

  const handleHide = (id) => {
    setHidingCommentId(id);
    setHideModalOpen(true);
  };

  const confirmHideComment = async () => {
    try {
      await hideComment(hidingCommentId);
      showToast.success("បានលាក់/លុបមតិយោបល់ដោយជោគជ័យ", "ជោគជ័យ");
      setComments(comments.filter((c) => c.id !== hidingCommentId));
    } catch (err) {
      console.error("Error hiding comment:", err);
      showToast.error("បរាជ័យក្នុងការលាក់មតិយោបល់", "កំហុស");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">កំពុងទាញយកព័ត៌មាន...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="reported-comments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">មតិយោបល់ដែលបានរាយការណ៍</h4>
        <button
          className="btn btn-sm btn-outline-secondary rounded-pill"
          onClick={fetchReportedComments}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> ផ្ទុកឡើងវិញ
        </button>
      </div>

      {!comments.length ? (
        <div className="text-center py-5 bg-white border rounded shadow-sm">
          <i
            className="bi bi-chat-left-check text-muted"
            style={{ fontSize: "3rem" }}
          ></i>
          <p className="mt-3 text-muted mb-0">
            គ្មានមតិយោបល់ដែលបានរាយការណ៍នៅលើឱកាសរបស់អ្នកឡើយ។
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {comments.map((c, idx) => {
            const initial = c.userName?.charAt(0)?.toUpperCase() || "?";
            const reports = c.reports || [];

            return (
              <div
                key={c.id}
                className="col-12"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="card shadow-sm border-0 rounded-3 p-3 bg-white">
                  <div className="d-flex gap-3">
                    <div
                      className="avatar bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "45px",
                        height: "45px",
                        minWidth: "45px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {initial}
                    </div>
                    <div className="flex-fill">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <div>
                          <div className="fw-bold text-dark">
                            {c.userName || "Anonymous"}
                          </div>
                          <small className="text-muted">
                            {c.userEmail} • {c.createdAt}
                          </small>
                        </div>
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 small rounded-pill">
                          {c.flagReason || "រាយការណ៍"}
                        </span>
                      </div>

                      <div className="mb-2 p-2 bg-light rounded-3">
                        <small className="text-muted d-block mb-1">
                          នៅលើឱកាស៖{" "}
                          <strong className="text-dark">
                            {c.opportunityTitle || "N/A"}
                          </strong>
                        </small>
                        <p
                          className="mb-0 text-secondary"
                          style={{ fontStyle: "italic" }}
                        >
                          &ldquo;{c.comment}&rdquo;
                        </p>
                      </div>

                      {/* Display reports list/details */}
                      <div className="alert alert-danger-subtle bg-danger-subtle border-0 py-2 px-3 rounded-3 mb-3 small">
                        <div className="fw-bold mb-1 text-danger">
                          <i className="bi bi-flag-fill me-1"></i>{" "}
                          ព័ត៌មានរាយការណ៍៖
                        </div>
                        <ul className="mb-0 ps-3 text-secondary">
                          <li>មូលហេតុ៖ {c.flagReason}</li>
                          {/* If reports list can be pulled or details exist, we show it */}
                          {c.reports &&
                            c.reports.map(
                              (rep, rIdx) =>
                                rep.details && (
                                  <li key={rep.id || rIdx}>
                                    លម្អិត ({rep.reason})៖ &ldquo;{rep.details}
                                    &rdquo; (ដោយ៖{" "}
                                    {rep.user?.name || "អ្នកប្រើប្រាស់"})
                                  </li>
                                ),
                            )}
                        </ul>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success px-3 rounded-pill"
                          onClick={() => handleApprove(c.id)}
                        >
                          <i className="bi bi-check-circle me-1"></i> អនុម័ត
                          (Approve)
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-3 rounded-pill"
                          onClick={() => handleHide(c.id)}
                        >
                          <i className="bi bi-eye-slash me-1"></i> លាក់/លុប
                          (Hide)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteCommentModal
        open={hideModalOpen}
        onClose={() => {
          setHideModalOpen(false);
          setHidingCommentId(null);
        }}
        commentId={hidingCommentId}
        onDeleteSuccess={confirmHideComment}
        message="តើអ្នកពិតជាចង់លាក់/លុបមតិយោបល់នេះមែនទេ? វានឹងលែងបង្ហាញនៅលើទំព័រឱកាស។"
      />
    </div>
  );
}
