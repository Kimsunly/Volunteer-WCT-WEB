"use client";

import React, { useEffect, useState, useMemo } from "react";
import { RoleGuard } from "../components";
import { listComments, approveComment, hideComment } from "@/services/admin";
import { deleteComment } from "@/services/comments";
import { showToast } from "@/components/common/CustomToaster";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function AdminCommentsPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [oppFilter, setOppFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deletingCommentIndex, setDeletingCommentIndex] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listComments();
      setComments(res.data || []);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    if (role === "admin") {
      fetchComments();
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: comments.length,
      flagged: comments.filter((c) => c.flagged).length,
      approved: comments.filter((c) => c.status === "approved").length,
      hidden: comments.filter((c) => c.status === "hidden").length,
    }),
    [comments],
  );

  const filtered = useMemo(() => {
    let list = showFlaggedOnly ? comments.filter((c) => c.flagged) : comments;

    if (oppFilter !== "all") {
      list = list.filter((c) => String(c.opportunityId) === oppFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    return list;
  }, [comments, showFlaggedOnly, oppFilter, statusFilter]);

  const uniqueOpportunities = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => {
      if (c.opportunityId && c.opportunityTitle) {
        map.set(String(c.opportunityId), c.opportunityTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [comments]);

  const handleApprove = async (idx) => {
    const item = filtered[idx];
    try {
      await approveComment(item.id);
      showToast.success("Comment approved successfully", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "approved", flagged: false } : c,
        ),
      );
    } catch (err) {
      console.error("Error approving comment:", err);
      showToast.error("Failed to approve comment", "Error");
    }
  };

  const handleHide = async (idx) => {
    const item = filtered[idx];
    try {
      await hideComment(item.id);
      showToast.success("Comment hidden successfully", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "hidden" } : c,
        ),
      );
    } catch (err) {
      console.error("Error hiding comment:", err);
      showToast.error("Failed to hide comment", "Error");
    }
  };

  const handleUnhide = async (idx) => {
    const item = filtered[idx];
    try {
      await approveComment(item.id);
      showToast.success("Comment shown again", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "approved" } : c,
        ),
      );
    } catch (err) {
      console.error("Error unhiding comment:", err);
      showToast.error("Failed to show comment", "Error");
    }
  };

  const handleRemove = (idx) => {
    const item = filtered[idx];
    setDeletingCommentId(item.id);
    setDeletingCommentIndex(idx);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    const item = filtered[deletingCommentIndex];
    try {
      await deleteComment(item.id);
      showToast.success("Comment deleted permanently", "Success");
      setComments(comments.filter((c) => c.id !== item.id));
      setDeleteModalOpen(false);
      setDeletingCommentId(null);
      setDeletingCommentIndex(null);
    } catch (err) {
      console.error("Error deleting comment:", err);
      showToast.error("Failed to delete comment", "Error");
    }
  };

  if (!mounted) return null;

  const statusChartData = {
    labels: ["Approved", "Pending", "Flagged", "Hidden"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.approved,
          comments.filter((c) => c.status === "pending").length,
          stats.flagged,
          stats.hidden,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#6b7280"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <RoleGuard enabled={roleAllowed} />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Comments Moderation</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Review and moderate user comments on opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={showFlaggedOnly ? "btn-primary" : "btn-secondary"}
            onClick={() => setShowFlaggedOnly(true)}
            style={{ padding: "8px 16px" }}
          >
            <i className="bi bi-flag-fill me-2"></i> Flagged ({stats.flagged})
          </button>
          <button
            className={showFlaggedOnly ? "btn-secondary" : "btn-primary"}
            onClick={() => setShowFlaggedOnly(false)}
            style={{ padding: "8px 16px" }}
          >
            <i className="bi bi-list me-2"></i> All Comments
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${!roleAllowed ? "opacity-50 pointer-events-none" : ""}`}>
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="form-input"
            value={oppFilter}
            onChange={(e) => setOppFilter(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "8px", width: "auto", maxWidth: "280px" }}
          >
            <option value="all">All Opportunities</option>
            {uniqueOpportunities.map((op) => (
              <option key={op.id} value={op.id}>
                {op.title}
              </option>
            ))}
          </select>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "8px", width: "auto", maxWidth: "280px" }}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Comments</div>
            <div className="kpi-value">{stats.total}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Flagged</div>
            <div className="kpi-value" style={{ color: "var(--color-negative)" }}>{stats.flagged}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Approved</div>
            <div className="kpi-value" style={{ color: "var(--color-positive)" }}>{stats.approved}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Hidden</div>
            <div className="kpi-value" style={{ color: "var(--color-text-secondary)" }}>{stats.hidden}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="three-col-grid">
          {/* Comments List */}
          <div className="lg:col-span-2 space-y-4">
            {!filtered.length ? (
              <div
                className="card"
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  borderRadius: "12px",
                }}
              >
                <i
                  className="bi bi-chat-dots"
                  style={{
                    fontSize: "4rem",
                    color: "var(--color-text-muted)",
                    opacity: 0.5,
                  }}
                ></i>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    marginTop: "1rem",
                    fontSize: "1.125rem",
                  }}
                >
                  No comments found
                </p>
              </div>
            ) : (
              filtered.map((c, idx) => {
                const initial = c.userName?.charAt(0)?.toUpperCase() || "?";
                const statusClass =
                  c.status === "approved"
                    ? "active"
                    : c.status === "flagged"
                      ? "rejected"
                      : c.status === "hidden"
                        ? "pending"
                        : "pending";

                return (
                  <div
                    key={c.id}
                    className="card"
                    style={{
                      borderRadius: "12px",
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="avatar"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "var(--color-bg-input)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div
                              style={{
                                color: "var(--color-text-primary)",
                                fontWeight: "600",
                              }}
                            >
                              {c.userName}
                            </div>
                            <small style={{ color: "var(--color-text-muted)" }}>
                              {c.userEmail}
                            </small>
                          </div>
                          <span
                            className={`status-badge ${statusClass}`}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                            }}
                          >
                            {c.status}
                          </span>
                        </div>

                        <div className="mb-3">
                          <small style={{ color: "var(--color-text-muted)" }}>
                            On:{" "}
                            <a
                              href="#"
                              style={{ color: "var(--color-accent)" }}
                            >
                              {c.opportunityTitle}
                            </a>
                          </small>
                        </div>

                        <p
                          style={{
                            color: "var(--color-text-primary)",
                            marginBottom: "1.25rem",
                            lineHeight: "1.6",
                          }}
                        >
                          {c.comment}
                        </p>

                        {c.flagged && (
                          <div
                            className="card"
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              borderColor: "#ef4444",
                              borderRadius: "8px",
                              padding: "0.75rem 1rem",
                            }}
                          >
                            <i
                              className="bi bi-flag-fill"
                              style={{
                                color: "#ef4444",
                                marginRight: "0.5rem",
                              }}
                            ></i>
                            Flagged: {c.flagReason}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4">
                          {c.status !== "approved" && (
                            <button
                              className="btn-primary"
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleApprove(idx)}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Approve
                            </button>
                          )}
                          {c.status !== "hidden" ? (
                            <button
                              className="btn-secondary"
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleHide(idx)}
                            >
                              <i className="bi bi-eye-slash me-1"></i> Hide
                            </button>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                              }}
                              onClick={() => handleUnhide(idx)}
                            >
                              <i className="bi bi-eye me-1"></i> Unhide
                            </button>
                          )}
                          <button
                            className="btn-reject"
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                            }}
                            onClick={() => handleRemove(idx)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card" style={{ borderRadius: "12px" }}>
              <h3 className="card-title">
                <i
                  className="bi bi-pie-chart-fill me-2"
                  style={{
                    color: "var(--color-accent)",
                  }}
                ></i>
                Statistics
              </h3>
              <div style={{ height: "240px", marginTop: "1rem" }}>
                <Doughnut
                  data={statusChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteCommentModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingCommentId(null);
            setDeletingCommentIndex(null);
          }}
          commentId={deletingCommentId}
          onDeleteSuccess={confirmDeleteComment}
          message="Delete this comment permanently?"
        />
      </div>
    </div>
  );
}
