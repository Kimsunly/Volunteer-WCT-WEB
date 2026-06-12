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
  const [detail, setDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await listOrganizers({
        status: filter === "all" ? null : filter,
        limit: 20,
        offset,
      });
      setOrganizers(res?.data || []);
      setTotal(res?.total ?? res?.data?.length ?? 0);
      setError(null);
    } catch (err) {
      console.error("Fetch organizers error:", err);
      setError("Failed to fetch organizers");
    } finally {
      setLoading(false);
    }
  }, [filter, offset]);

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
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve organizer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (org) => {
    if (!org) return;
    const reason = prompt("Reason for rejection (minimum 10 characters):");
    if (!reason || reason.length < 10) return;
    setActionLoading(org.id);
    try {
      await rejectOrganizer(org.id, reason);
      toast.success("Organizer rejected successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject organizer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (org) => {
    if (!org) return;
    const reason = prompt("Reason for suspension (minimum 10 characters):");
    if (!reason || reason.length < 10) return;
    setActionLoading(org.id);
    try {
      await suspendOrganizer(org.id, reason);
      toast.success("Organizer suspended successfully!");
      await fetchData();
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
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setDetail(null)}
          ></div>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            {" "}
            <div
              className="card"
              style={{
                width: "100%",
                maxWidth: "550px",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                animation: "modalIn 0.3s ease-out",
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
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px 12px 0 0",
                  padding: "1.25rem 1.5rem",
                  margin: "-1px",
                }}
              >
                <div className="card-title" style={{ color: "white" }}>
                  <i className="bi bi-buildings-fill me-2"></i>
                  Organizer Details
                </div>
                <button
                  className="card-menu-btn"
                  onClick={() => setDetail(null)}
                  style={{ color: "white" }}
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
                      color: "var(--color-text-muted)",
                      fontWeight: "500",
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
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
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
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
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
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
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
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
                      }}
                    >
                      Submitted
                    </label>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      {formatDate(detail.submitted_at)}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className="block mb-1"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      fontWeight: "500",
                    }}
                  >
                    Status
                  </label>
                  <div>{statusBadge(detail.status)}</div>
                </div>

                {detail.document_url && (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
                      }}
                    >
                      Verification Document (ឯកសារបញ្ជាក់)
                    </label>
                    <div>
                      <a
                        href={detail.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm rounded-3 d-inline-flex align-items-center gap-2"
                        style={{
                          fontSize: "0.85rem",
                          padding: "8px 16px",
                          textDecoration: "none",
                          borderRadius: "8px",
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                        មើលឯកសារ / View Document
                      </a>
                    </div>
                  </div>
                )}

                {detail.rejection_reason && (
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        fontWeight: "500",
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
                className="flex items-center justify-end gap-3 mt-4 pt-4"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  padding: "0 1.5rem 1.5rem",
                }}
              >
                <button
                  className="btn-secondary"
                  onClick={() => setDetail(null)}
                  style={{ borderRadius: "8px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
