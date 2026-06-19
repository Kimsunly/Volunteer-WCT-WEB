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
        <div className="spinner-border text-accent-theme" role="status"></div>
        <p className="mt-3 text-muted-theme">កំពុងទាញយកព័ត៌មាន...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger-custom" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="reported-comments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold title-theme mb-0">មតិយោបល់ដែលបានរាយការណ៍</h4>
        <button
          className="btn btn-sm btn-reload-custom"
          onClick={fetchReportedComments}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> ផ្ទុកឡើងវិញ
        </button>
      </div>

      {!comments.length ? (
        <div className="text-center py-5 no-comments-card rounded-4">
          <i
            className="bi bi-chat-left-check text-muted-theme"
            style={{ fontSize: "3rem" }}
          ></i>
          <p className="mt-3 text-muted-theme mb-0">
            គ្មានមតិយោបល់ដែលបានរាយការណ៍នៅលើឱកាសរបស់អ្នកឡើយ។
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {comments.map((c, idx) => {
            const initial = c.userName?.charAt(0)?.toUpperCase() || "?";

            return (
              <div
                key={c.id}
                className="col-12"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="vh-card p-4 rounded-4 position-relative">
                  <div className="d-flex gap-3 flex-column flex-sm-row">
                    <div
                      className="avatar bg-danger text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mx-auto mx-sm-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        boxShadow: "0 4px 8px rgba(220, 38, 38, 0.2)"
                      }}
                    >
                      {initial}
                    </div>
                    <div className="flex-fill min-w-0">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <div>
                          <div className="fw-bold title-theme">
                            {c.userName || "Anonymous"}
                          </div>
                          <small className="text-secondary-theme">
                            {c.userEmail} • {c.createdAt}
                          </small>
                        </div>
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 small rounded-pill">
                          {c.flagReason || "រាយការណ៍"}
                        </span>
                      </div>

                      <div className="mb-3 p-3 comment-quote-box rounded-3">
                        <small className="text-secondary-theme d-block mb-1">
                          នៅលើឱកាស៖{" "}
                          <strong className="title-theme">
                            {c.opportunityTitle || "N/A"}
                          </strong>
                        </small>
                        <p
                          className="mb-0 comment-quote-text"
                        >
                          &ldquo;{c.comment}&rdquo;
                        </p>
                      </div>

                      {/* Display reports list/details */}
                      <div className="alert alert-danger-custom py-2 px-3 rounded-3 mb-3 small">
                        <div className="fw-bold mb-1 text-danger">
                          <i className="bi bi-flag-fill me-1"></i>{" "}
                          ព័ត៌មានរាយការណ៍៖
                        </div>
                        <ul className="mb-0 ps-3 text-danger-subtle">
                          <li>មូលហេតុ៖ {c.flagReason}</li>
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

                      <div className="d-flex gap-2 justify-content-end justify-content-sm-start mt-3">
                        <button
                          className="btn btn-sm btn-approve-custom"
                          onClick={() => handleApprove(c.id)}
                        >
                          <i className="bi bi-check-circle me-1"></i> អនុម័ត (Approve)
                        </button>
                        <button
                          className="btn btn-sm btn-hide-custom"
                          onClick={() => handleHide(c.id)}
                        >
                          <i className="bi bi-eye-slash me-1"></i> លាក់/លុប (Hide)
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

      <style jsx>{`
        .title-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }
        .text-muted-theme {
          color: var(--color-text-muted) !important;
        }
        .text-accent-theme {
          color: var(--color-accent) !important;
        }

        .btn-reload-custom {
          background: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 100px !important;
          padding: 6px 16px !important;
          font-weight: 600 !important;
          transition: all 0.2s;
        }
        .btn-reload-custom:hover {
          background: var(--color-bg-card-hover) !important;
          border-color: var(--color-border-hover) !important;
        }

        .no-comments-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
        }

        .vh-card {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          box-shadow: var(--shadow-card) !important;
        }
        .vh-card:hover {
          border-color: var(--color-border-hover) !important;
        }

        .comment-quote-box {
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
        }
        .comment-quote-text {
          color: var(--color-text-primary);
          font-style: italic;
        }

        .alert-danger-custom {
          background-color: rgba(220, 38, 38, 0.08) !important;
          border: 1px solid rgba(220, 38, 38, 0.15) !important;
          color: #dc2626 !important;
        }
        .text-danger-subtle {
          color: rgba(220, 38, 38, 0.85) !important;
        }

        .btn-approve-custom {
          border: 1.5px solid var(--color-accent) !important;
          color: var(--color-accent) !important;
          background: transparent !important;
          font-weight: 600;
          border-radius: 100px !important;
          padding: 6px 18px !important;
          transition: all 0.2s;
        }
        .btn-approve-custom:hover {
          background: var(--color-accent) !important;
          color: #000000 !important;
          box-shadow: 0 0 10px var(--color-accent-glow);
          transform: translateY(-1px);
        }

        .btn-hide-custom {
          border: 1.5px solid #dc3545 !important;
          color: #dc3545 !important;
          background: transparent !important;
          font-weight: 600;
          border-radius: 100px !important;
          padding: 6px 18px !important;
          transition: all 0.2s;
        }
        .btn-hide-custom:hover {
          background: rgba(220, 53, 69, 0.1) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
