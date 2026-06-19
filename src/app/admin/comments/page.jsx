"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RoleGuard } from "../components";
import { listComments, approveComment, hideComment, listAllOpportunities } from "@/services/admin";
import { deleteComment } from "@/services/comments";
import { showToast } from "@/components/common/CustomToaster";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";

export default function AdminCommentsPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({ total: 0, flagged: 0, approved: 0, hidden: 0, pending: 0 });

  // Filters & Search states
  const [search, setSearch] = useState("");
  const [oppFilter, setOppFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Master Opportunities list for filter dropdown
  const [opportunities, setOpportunities] = useState([]);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listComments({
        search: search || null,
        status: statusFilter === "all" ? null : statusFilter,
        opportunity_id: oppFilter === "all" ? null : oppFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit,
        offset,
      });
      setComments(res.data || []);
      setTotal(res.total || 0);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [search, oppFilter, statusFilter, sortBy, sortOrder, limit, offset]);

  // Load opportunities list for filter dropdown
  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await listAllOpportunities({ limit: 100 });
      const items = Array.isArray(res) ? res : res?.data || [];
      setOpportunities(items);
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    const isAllowed = role === "admin";
    setRoleAllowed(isAllowed);
    
    if (isAllowed) {
      fetchOpportunities();
    }
  }, [fetchOpportunities]);

  useEffect(() => {
    if (roleAllowed) {
      fetchComments();
    }
  }, [fetchComments, roleAllowed]);

  const segments = useMemo(() => {
    const total = stats.total;
    const pending = stats.pending;
    const { approved, flagged, hidden } = stats;

    if (total === 0) {
      return [
        { label: "Empty", value: 1, percentage: 100, strokeDasharray: "314.16 0", strokeDashoffset: "0", color: "var(--color-border)" }
      ];
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius; // ~314.16
    let currentOffset = 0;

    const rawData = [
      { label: "Approved", value: approved, color: "#10b981" },
      { label: "Pending", value: pending, color: "#f59e0b" },
      { label: "Flagged", value: flagged, color: "#ef4444" },
      { label: "Hidden", value: hidden, color: "#6b7280" },
    ];

    return rawData.map(d => {
      const percentage = (d.value / total) * 100;
      const strokeLength = (d.value / total) * circumference;
      const strokeDasharray = `${strokeLength.toFixed(2)} ${(circumference - strokeLength).toFixed(2)}`;
      const strokeDashoffset = (-currentOffset).toFixed(2);
      currentOffset += strokeLength;

      return {
        ...d,
        percentage,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [stats]);

  const handleApproveInline = async (item) => {
    try {
      await approveComment(item.id);
      showToast.success("Comment approved successfully", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "approved", flagged: false } : c,
        ),
      );
      setStats((prev) => {
        const wasFlagged = item.flagged;
        const wasHidden = item.status === "hidden";
        const wasPending = item.status === "pending";

        return {
          ...prev,
          approved: prev.approved + 1,
          flagged: wasFlagged ? prev.flagged - 1 : prev.flagged,
          hidden: wasHidden ? prev.hidden - 1 : prev.hidden,
          pending: wasPending ? prev.pending - 1 : prev.pending,
        };
      });
    } catch (err) {
      console.error("Error approving comment:", err);
      showToast.error("Failed to approve comment", "Error");
    }
  };

  const handleHideInline = async (item) => {
    try {
      await hideComment(item.id);
      showToast.success("Comment hidden successfully", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "hidden" } : c,
        ),
      );
      setStats((prev) => {
        const wasFlagged = item.flagged;
        const wasApproved = item.status === "approved";
        const wasPending = item.status === "pending";

        return {
          ...prev,
          hidden: prev.hidden + 1,
          flagged: wasFlagged ? prev.flagged - 1 : prev.flagged,
          approved: wasApproved ? prev.approved - 1 : prev.approved,
          pending: wasPending ? prev.pending - 1 : prev.pending,
        };
      });
    } catch (err) {
      console.error("Error hiding comment:", err);
      showToast.error("Failed to hide comment", "Error");
    }
  };

  const handleUnhideInline = async (item) => {
    try {
      await approveComment(item.id);
      showToast.success("Comment shown again", "Success");
      setComments(
        comments.map((c) =>
          c.id === item.id ? { ...c, status: "approved" } : c,
        ),
      );
      setStats((prev) => ({
        ...prev,
        hidden: prev.hidden - 1,
        approved: prev.approved + 1,
      }));
    } catch (err) {
      console.error("Error unhiding comment:", err);
      showToast.error("Failed to show comment", "Error");
    }
  };

  const handleRemoveInline = (item) => {
    setDeletingCommentId(item.id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!deletingCommentId) return;
    try {
      await deleteComment(deletingCommentId);
      showToast.success("Comment deleted permanently", "Success");
      
      const item = comments.find(c => c.id === deletingCommentId);
      
      setComments(comments.filter((c) => c.id !== deletingCommentId));
      setDeleteModalOpen(false);
      setDeletingCommentId(null);
      
      if (item) {
        setStats((prev) => {
          const wasFlagged = item.flagged;
          const wasApproved = item.status === "approved";
          const wasHidden = item.status === "hidden";
          const wasPending = item.status === "pending";
          
          return {
            ...prev,
            total: prev.total - 1,
            flagged: wasFlagged ? prev.flagged - 1 : prev.flagged,
            approved: wasApproved ? prev.approved - 1 : prev.approved,
            hidden: wasHidden ? prev.hidden - 1 : prev.hidden,
            pending: wasPending ? prev.pending - 1 : prev.pending,
          };
        });
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      showToast.error("Failed to delete comment", "Error");
    }
  };

  if (!mounted) return null;

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
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={{
                paddingLeft: "36px",
              }}
            />
          </div>

          <select
            className="filter-select"
            value={oppFilter}
            onChange={(e) => {
              setPage(1);
              setOppFilter(e.target.value);
            }}
          >
            <option value="all">All Opportunities</option>
            {opportunities.map((op) => (
              <option key={op.id} value={op.id}>
                {op.title}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="hidden">Hidden</option>
          </select>

          <select
            className="filter-select"
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("_");
              setPage(1);
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <option value="created_at_desc">Newest Comments</option>
            <option value="created_at_asc">Oldest Comments</option>
            <option value="userName_asc">User Name (A-Z)</option>
            <option value="userName_desc">User Name (Z-A)</option>
            <option value="opportunityTitle_asc">Opportunity (A-Z)</option>
            <option value="opportunityTitle_desc">Opportunity (Z-A)</option>
          </select>
        </div>
      </div>

      <div className={`space-y-6 ${!roleAllowed ? "opacity-50 pointer-events-none" : ""}`}>
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

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
          {/* Comments List Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card" style={{ padding: "0" }}>
              <div className="table-wrapper">
                <table className="data-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "22%" }}>User</th>
                      <th style={{ width: "38%" }}>Comment</th>
                      <th style={{ width: "20%" }}>Opportunity</th>
                      <th style={{ width: "10%" }}>Status</th>
                      <th style={{ width: "10%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="text-center py-4">
                            <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                              <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
                              Loading comments...
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : !comments.length ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8" style={{ color: "var(--color-text-secondary)" }}>
                          No comments found
                        </td>
                      </tr>
                    ) : (
                      comments.map((c) => {
                        const initial = c.userName?.charAt(0)?.toUpperCase() || "?";
                        const statusClass =
                          c.status === "approved"
                            ? "active"
                            : c.status === "flagged"
                              ? "suspended"
                              : c.status === "hidden"
                                ? "inactive"
                                : "pending";

                        return (
                          <tr key={c.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar">{initial}</div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ color: "var(--color-text-primary)", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {c.userName}
                                  </div>
                                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {c.userEmail}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ wordBreak: "break-word" }}>
                                <p style={{ color: "var(--color-text-primary)", margin: 0 }}>{c.comment}</p>
                                {c.flagged && (
                                  <div
                                    style={{
                                      background: "rgba(239,68,68,0.06)",
                                      borderLeft: "3px solid #ef4444",
                                      borderRadius: "4px",
                                      padding: "6px 10px",
                                      marginTop: "8px",
                                      fontSize: "0.8rem",
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    <i className="bi bi-flag-fill text-red-500 me-2" style={{ color: "#ef4444" }}></i>
                                    <strong>Flagged:</strong> {c.flagReason}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                                {c.opportunityTitle ? (
                                  <span style={{ color: "var(--color-accent)" }}>{c.opportunityTitle}</span>
                                ) : (
                                  <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>No opportunity</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge-custom ${statusClass}`}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                {c.status !== "approved" && (
                                  <button
                                    className="btn-action"
                                    onClick={() => handleApproveInline(c)}
                                    title="Approve"
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </button>
                                )}
                                {c.status !== "hidden" ? (
                                  <button
                                    className="btn-action"
                                    onClick={() => handleHideInline(c)}
                                    title="Hide"
                                  >
                                    <i className="bi bi-eye-slash"></i>
                                  </button>
                                ) : (
                                  <button
                                    className="btn-action"
                                    onClick={() => handleUnhideInline(c)}
                                    title="Unhide"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </button>
                                )}
                                <button
                                  className="btn-action-reject"
                                  onClick={() => handleRemoveInline(c)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > 0 && (
                <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)", padding: "16px 20px" }}>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                    Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} comments
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 16px" }}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                    >
                      Previous
                    </button>
                    <span
                      className="status-badge active"
                      style={{
                        background: "var(--color-bg-input)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {page}
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 16px" }}
                      onClick={() => setPage((p) => p + 1)}
                      disabled={offset + limit >= total || loading}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card" style={{ borderRadius: "16px", padding: "24px", border: "1px solid var(--color-border)" }}>
              <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                <i
                  className="bi bi-pie-chart-fill"
                  style={{
                    color: "var(--color-accent)",
                    fontSize: "1.2rem",
                  }}
                ></i>
                Statistics
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", marginTop: "1.5rem" }}>
                {/* SVG Graph Container */}
                <div style={{ position: "relative", width: "160px", height: "160px" }}>
                  <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                    {stats.total === 0 ? (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="var(--color-border)"
                        strokeWidth="10"
                        strokeDasharray="6 4"
                      />
                    ) : (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="10"
                      />
                    )}

                    {stats.total > 0 && segments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="10"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                        strokeLinecap={seg.value > 0 ? "round" : "butt"}
                        style={{
                          transition: "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease",
                        }}
                      />
                    ))}
                  </svg>
                  
                  {/* Central Text/Metric */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none"
                  }}>
                    {stats.total === 0 ? (
                      <>
                        <i className="bi bi-chat-left-text" style={{ fontSize: "1.5rem", color: "var(--color-text-secondary)" }}></i>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>Empty</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-text-primary)" }}>{stats.total}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Legend & Details Block */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {stats.total === 0 ? (
                    <div style={{ textAlign: "center", padding: "10px 0", color: "var(--color-text-secondary)", fontSize: "0.825rem", borderTop: "1px solid var(--color-border)", paddingTop: "16px" }}>
                      <i className="bi bi-info-circle me-1"></i> No comments recorded to show distribution data.
                    </div>
                  ) : (
                    segments.map((seg, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: seg.color }}></span>
                          <span style={{ color: "var(--color-text-primary)", fontWeight: "500" }}>{seg.label}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <strong style={{ color: "var(--color-text-primary)" }}>{seg.value}</strong>
                          <span style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}>({seg.percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
          }}
          commentId={deletingCommentId}
          onDeleteSuccess={confirmDeleteComment}
          message="Delete this comment permanently?"
        />
      </div>

      <style jsx>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 240px;
        }
        .search-container i {
          position: absolute;
          left: 12px;
          color: var(--color-text-secondary);
          pointer-events: none;
          font-size: 14px;
        }
        .search-container input {
          width: 100%;
          padding: 8px 12px 8px 36px !important;
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-btn) !important;
          color: var(--color-text-primary) !important;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .search-container input:focus {
          border-color: var(--color-accent) !important;
          outline: none;
          box-shadow: 0 0 0 3px var(--color-accent-dim) !important;
        }
        
        .filter-select {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-btn) !important;
          color: var(--color-text-primary) !important;
          padding: 8px 32px 8px 16px !important;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") !important;
          background-position: right 10px center !important;
          background-repeat: no-repeat !important;
        }
        .filter-select:focus {
          border-color: var(--color-accent) !important;
          outline: none;
        }

        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          color: var(--color-text-primary);
        }
        .data-table th {
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-secondary);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .data-table td {
          padding: 16px 20px;
          vertical-align: middle;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.875rem;
        }
        .data-table tr {
          transition: background-color 0.2s ease;
        }
        .data-table tr:hover {
          background-color: var(--color-bg-card-hover);
        }
        
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          background: linear-gradient(135deg, var(--color-accent) 0%, rgba(122, 204, 0, 0.6) 100%);
          color: #000000;
          border: 1.5px solid var(--color-border);
          flex-shrink: 0;
        }
        
        .btn-action {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          background-color: var(--color-bg-input);
          color: var(--color-text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-action:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background-color: var(--color-accent-dim);
        }
        .btn-action-reject {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          background-color: var(--color-bg-input);
          color: var(--color-negative);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-action-reject:hover {
          border-color: var(--color-negative);
          color: white;
          background-color: var(--color-negative);
        }

        .status-badge-custom {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .status-badge-custom.active {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .status-badge-custom.inactive {
          background-color: rgba(108, 117, 125, 0.12) !important;
          color: #6c757d !important;
          border: 1px solid rgba(108, 117, 125, 0.2) !important;
        }
        .status-badge-custom.suspended {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.2) !important;
        }
        .status-badge-custom.pending {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
