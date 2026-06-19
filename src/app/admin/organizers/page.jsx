"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RoleGuard } from "../components";
import {
  approveOrganizer,
  listOrganizers,
  rejectOrganizer,
  suspendOrganizer,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminOrganizersPage() {
  const { user, loading: authLoading } = useAuth();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [detail, setDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [suspendingOrg, setSuspendingOrg] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [rejectingOrg, setRejectingOrg] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      let sortBy = "created_at";
      let sortOrder = "desc";
      if (sortOption === "oldest") {
        sortBy = "created_at";
        sortOrder = "asc";
      } else if (sortOption === "name_asc") {
        sortBy = "organization_name";
        sortOrder = "asc";
      } else if (sortOption === "name_desc") {
        sortBy = "organization_name";
        sortOrder = "desc";
      }

      const res = await listOrganizers({
        status: filter === "all" ? null : filter,
        search: search || null,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit: 20,
        offset,
      });
      setOrganizers(res?.data || []);
      setTotal(res?.total ?? 0);
      setError(null);
    } catch (err) {
      console.error("Fetch organizers error:", err);
      setError("Failed to fetch organizers");
    } finally {
      setLoading(false);
    }
  }, [filter, search, sortOption, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchData();

      // Set up polling for real-time updates every 10 seconds
      const interval = setInterval(() => {
        fetchData();
      }, 10000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [fetchData, authLoading, user]);

  const viewDetail = (org) => setDetail(org);

  const handleApprove = async (org) => {
    if (!org || !confirm("Approve this organizer?")) return;
    setActionLoading(org.id);
    try {
      await approveOrganizer(org.id);
      toast.success("Organizer approved successfully!");
      await fetchData();
      if (detail && detail.id === org.id) {
        setDetail(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve organizer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (org) => {
    if (!org) return;
    setRejectingOrg(org);
    setRejectReason("");
  };

  const commitReject = async () => {
    if (!rejectingOrg || rejectReason.length < 10) return;
    setActionLoading(rejectingOrg.id);
    try {
      await rejectOrganizer(rejectingOrg.id, rejectReason);
      toast.success("Organizer rejected successfully!");
      setRejectingOrg(null);
      setRejectReason("");
      await fetchData();
      if (detail && detail.id === rejectingOrg.id) {
        setDetail(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject organizer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = (org) => {
    if (!org) return;
    setSuspendingOrg(org);
    setSuspendReason("");
  };

  const commitSuspend = async () => {
    if (!suspendingOrg || suspendReason.length < 10) return;
    setActionLoading(suspendingOrg.id);
    try {
      await suspendOrganizer(suspendingOrg.id, suspendReason);
      toast.success("Organizer suspended successfully!");
      setSuspendingOrg(null);
      setSuspendReason("");
      await fetchData();
      if (detail && detail.id === suspendingOrg.id) {
        setDetail(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to suspend organizer");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
  };

  const statusBadge = (status) => {
    let label = status;
    if (status === "verified") label = "Active";
    return (
      <span
        className={`status-badge ${status === "pending" ? "pending" : status === "verified" ? "active" : "rejected"}`}
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </span>
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizer Applications</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              marginTop: "4px",
            }}
          >
            Approve or reject organizer verification requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search organizers..."
              value={search}
              onChange={(e) => {
                setOffset(0);
                setSearch(e.target.value);
              }}
              style={{
                paddingLeft: "36px",
              }}
            />
          </div>
          
          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => {
              setOffset(0);
              setSortOption(e.target.value);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>

          <button
            className="btn-secondary"
            onClick={fetchData}
            disabled={loading}
          >
            <i
              className={`bi bi-arrow-clockwise me-2 ${loading ? "animate-spin" : ""}`}
            ></i>
            Refresh
          </button>
          <button className="btn-primary">
            <i className="bi bi-download me-2"></i>Export CSV
          </button>
        </div>
      </div>

      <div
        className={
          user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""
        }
      >
        {error && (
          <div
            className="card"
            style={{
              marginBottom: "24px",
              background: "rgba(255,77,77,0.1)",
              border: "1px solid rgba(255,77,77,0.3)",
            }}
          >
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {["all", "pending", "verified", "rejected"].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? "active" : ""}`}
              onClick={() => {
                setOffset(0);
                setFilter(status);
              }}
              disabled={loading}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div className="card-header" style={{ marginBottom: "0" }}>
              <div className="card-title">Applications</div>
              <button className="card-menu-btn">
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: "20px" }}>
              <div
                className="flex items-center gap-2"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading organizers...
              </div>
            </div>
          )}

          {!loading && !organizers.length ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              No organizers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Submission Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map((org) => (
                    <tr key={org.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="avatar"
                            style={{
                              width: "36px",
                              height: "36px",
                              fontSize: "0.875rem",
                            }}
                          >
                            {(
                              org.contact_person ||
                              org.organization_name ||
                              "O"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div
                              style={{
                                color: "var(--color-text-primary)",
                                fontWeight: "500",
                              }}
                            >
                              {org.organization_name}
                            </div>
                            {org.contact_person && (
                              <div
                                style={{
                                  color: "var(--color-text-muted)",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {org.contact_person}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {org.organizer_type || "—"}
                        </span>
                      </td>
                      <td>{statusBadge(org.status)}</td>
                      <td
                        style={{
                          color: "var(--color-text-secondary)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {formatDate(org.submitted_at)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => viewDetail(org)}
                            disabled={actionLoading === org.id}
                          >
                            View Details
                          </button>
                          {org.status === "pending" && (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() => handleApprove(org)}
                                disabled={actionLoading === org.id}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => handleReject(org)}
                                disabled={actionLoading === org.id}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {org.status === "verified" && (
                            <button
                              className="btn-reject"
                              style={{
                                borderColor: "var(--color-warning)",
                                color: "var(--color-warning)",
                              }}
                              onClick={() => handleSuspend(org)}
                              disabled={actionLoading === org.id}
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: "16px" }}
        >
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {total}
            </strong>
            {loading && (
              <span className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block animate-spin"></span>
            )}
          </small>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.8125rem" }}
              onClick={() => setOffset(Math.max(0, offset - 20))}
              disabled={offset === 0 || loading}
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
              {Math.floor(offset / 20) + 1}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.8125rem" }}
              onClick={() => setOffset(offset + 20)}
              disabled={offset + 20 >= total || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={() => setDetail(null)}
          ></div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
              padding: "1rem",
              pointerEvents: "none",
            }}
          >
            {" "}
            <div
              className="card shadow-lg"
              style={{
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-card)",
                animation: "modalIn 0.3s ease-out",
                pointerEvents: "auto",
              }}
            >
              <style>{`
                @keyframes modalIn {
                  from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }
              `}</style>
              <div
                className="card-header"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="card-title" style={{ margin: 0, fontSize: "1.125rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                  <i className="bi bi-buildings-fill me-2" style={{ color: "var(--color-accent)" }}></i>
                  Organizer Details
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setDetail(null)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="space-y-4" style={{ padding: "1.5rem" }}>
                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Organization Name
                  </label>
                  <div
                    style={{
                      color: "var(--color-text-primary)",
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                  >
                    {detail.organization_name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Contact Person
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {detail.contact_person || "—"}
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Email
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {detail.email}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Phone
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {detail.phone || "—"}
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Submitted
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {formatDate(detail.submitted_at)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Organizer Type
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {detail.organizer_type || "—"}
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Status
                    </label>
                    <div>{statusBadge(detail.status)}</div>
                  </div>
                </div>

                {detail.description && (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Mission / Description (បេសកកម្ម)
                    </label>
                    <div
                      style={{
                        background: "var(--color-bg-input)",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {detail.description}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Verification Document (ឯកសារបញ្ជាក់)
                  </label>
                  {detail.document_url ? (
                    <div style={{ marginTop: "6px" }}>
                      {/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(detail.document_url) ? (
                        <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)", marginTop: "8px", background: "var(--color-bg-input)", textAlign: "center" }}>
                          <img 
                            src={detail.document_url} 
                            alt="Verification Document" 
                            style={{ maxWidth: "100%", maxHeight: "240px", height: "auto", display: "block", margin: "0 auto", cursor: "zoom-in" }} 
                            onClick={() => window.open(detail.document_url, '_blank')}
                          />
                          <div style={{ padding: "8px", fontSize: "0.75rem", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border)" }}>
                            <a href={detail.document_url} target="_blank" rel="noreferrer" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                              <i className="bi bi-box-arrow-up-right me-1"></i> Open in new tab
                            </a>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={detail.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{
                            fontSize: "0.85rem",
                            padding: "8px 16px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px"
                          }}
                        >
                          <i className="bi bi-file-earmark-pdf-fill" style={{ color: "var(--color-negative)", fontSize: "1.2rem" }}></i>
                          <span>មើលឯកសារ / View Document</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div 
                      style={{
                        marginTop: "6px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        color: "#f59e0b",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <span>គ្មានឯកសារបញ្ជាក់ / No verification document uploaded</span>
                    </div>
                  )}
                </div>

                {detail.rejection_reason && (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Rejection Reason
                    </label>
                    <div
                      style={{
                        color: "var(--color-negative)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {detail.rejection_reason}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-between gap-3 mt-4 pt-4"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  padding: "0 1.5rem 1.5rem",
                }}
              >
                <div>
                  {user?.role?.toLowerCase() === "admin" && (
                    <div className="flex items-center gap-2">
                      {detail.status === "pending" && (
                        <>
                          <button
                            className="btn-approve"
                            style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
                            onClick={() => handleApprove(detail)}
                            disabled={actionLoading === detail.id}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
                            onClick={() => handleReject(detail)}
                            disabled={actionLoading === detail.id}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {detail.status === "verified" && (
                        <button
                          className="btn-reject"
                          style={{
                            borderColor: "var(--color-warning)",
                            color: "var(--color-warning)",
                            padding: "6px 12px",
                            fontSize: "0.8125rem",
                          }}
                          onClick={() => handleSuspend(detail)}
                          disabled={actionLoading === detail.id}
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "0.8125rem" }}
                  onClick={() => setDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Suspend Organizer Modal */}
      {suspendingOrg && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={() => setSuspendingOrg(null)}
          ></div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
              padding: "1rem",
              pointerEvents: "none",
            }}
          >
            <div
              className="card shadow-lg"
              style={{
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-card)",
                animation: "modalIn 0.3s ease-out",
                pointerEvents: "auto",
              }}
            >
              <div
                className="card-header"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 className="card-title" style={{ margin: 0, fontSize: "1.125rem", fontWeight: "600", color: "var(--color-warning)" }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Suspend Organizer
                </h3>
                <button
                  className="icon-btn"
                  onClick={() => setSuspendingOrg(null)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              
              <div className="space-y-4" style={{ padding: "1.5rem" }}>
                <p style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>
                  Are you sure you want to suspend organizer <strong>{suspendingOrg.organization_name || suspendingOrg.user?.name}</strong>?
                </p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  Suspending this organizer will hide their profile and restrict their ability to create or edit volunteer opportunities.
                </p>
                
                <div className="space-y-2">
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "6px"
                    }}
                  >
                    Reason for suspension
                  </label>
                  <textarea
                    className="form-input"
                    style={{ 
                      minHeight: "100px", 
                      width: "100%",
                      resize: "vertical", 
                      backgroundColor: "var(--color-bg-input)",
                      borderRadius: "10px",
                      border: "1.5px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      padding: "10px",
                      outline: "none"
                    }}
                    placeholder="Please provide a detailed reason for suspending this organizer (minimum 10 characters)..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                  <small style={{ color: suspendReason.length >= 10 ? "var(--color-text-muted)" : "var(--color-negative)", fontSize: "11px", display: "block" }}>
                    {suspendReason.length < 10 
                      ? `Minimum 10 characters required (${suspendReason.length}/10)`
                      : "Ready to suspend organizer"
                    }
                  </small>
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-3"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  padding: "0 1.5rem 1.5rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem"
                }}
              >
                <button
                  className="btn-secondary"
                  style={{ padding: "8px 16px" }}
                  onClick={() => setSuspendingOrg(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "var(--color-warning)",
                    borderColor: "var(--color-warning)",
                    color: "#000"
                  }}
                  onClick={commitSuspend}
                  disabled={suspendReason.length < 10 || actionLoading === suspendingOrg.id}
                >
                  {actionLoading === suspendingOrg.id ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin me-2"></i>
                      Suspending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-pause-circle me-2"></i>
                      Suspend
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Organizer Modal */}
      {rejectingOrg && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
              zIndex: 1040,
            }}
            onClick={() => setRejectingOrg(null)}
          ></div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
              padding: "1rem",
              pointerEvents: "none",
            }}
          >
            <div
              className="card shadow-lg"
              style={{
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-card)",
                animation: "modalIn 0.3s ease-out",
                pointerEvents: "auto",
              }}
            >
              <div
                className="card-header"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 className="card-title" style={{ margin: 0, fontSize: "1.125rem", fontWeight: "600", color: "var(--color-negative)" }}>
                  <i className="bi bi-x-circle-fill me-2"></i>
                  Reject Organizer Application
                </h3>
                <button
                  className="icon-btn"
                  onClick={() => setRejectingOrg(null)}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              
              <div className="space-y-4" style={{ padding: "1.5rem" }}>
                <p style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>
                  Are you sure you want to reject organizer application from <strong>{rejectingOrg.organization_name || rejectingOrg.user?.name}</strong>?
                </p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  Rejecting this organizer application will notify them and keep their status as rejected. They will not be verified.
                </p>
                
                <div className="space-y-2">
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "6px"
                    }}
                  >
                    Reason for rejection
                  </label>
                  <textarea
                    className="form-input"
                    style={{ 
                      minHeight: "100px", 
                      width: "100%",
                      resize: "vertical", 
                      backgroundColor: "var(--color-bg-input)",
                      borderRadius: "10px",
                      border: "1.5px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      padding: "10px",
                      outline: "none"
                    }}
                    placeholder="Please provide a detailed reason for rejecting this organizer application (minimum 10 characters)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <small style={{ color: rejectReason.length >= 10 ? "var(--color-text-muted)" : "var(--color-negative)", fontSize: "11px", display: "block" }}>
                    {rejectReason.length < 10 
                      ? `Minimum 10 characters required (${rejectReason.length}/10)`
                      : "Ready to reject application"
                    }
                  </small>
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-3"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  padding: "0 1.5rem 1.5rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem"
                }}
              >
                <button
                  className="btn-secondary"
                  style={{ padding: "8px 16px" }}
                  onClick={() => setRejectingOrg(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  style={{
                    padding: "8px 16px",
                  }}
                  onClick={commitReject}
                  disabled={rejectReason.length < 10 || actionLoading === rejectingOrg.id}
                >
                  {actionLoading === rejectingOrg.id ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin me-2"></i>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>
                      Reject Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 250px;
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
      `}</style>
    </div>
  );
}
