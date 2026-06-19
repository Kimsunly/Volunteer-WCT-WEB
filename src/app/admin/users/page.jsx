"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RoleGuard } from "../components";
import { deactivateUser, listUsers, changeUserRole } from "@/services/admin";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editing, setEditing] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [deactivatingUser, setDeactivatingUser] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString();
  };

  const roleClass = (r) => {
    switch (r) {
      case "admin":
        return "rejected";
      case "organizer":
        return "pending";
      default:
        return "active";
    }
  };

  const statusClass = (s) => {
    switch (s) {
      case "active":
        return "active";
      case "inactive":
        return "rejected";
      case "suspended":
        return "rejected";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listUsers({
        search,
        status: statusFilter === "all" ? null : statusFilter,
        role: roleFilter === "all" ? null : roleFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit,
        offset,
      });
      const items = Array.isArray(res) ? res : res?.data || [];
      setUsers(items);
      setTotal(res?.total ?? items.length ?? 0);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, roleFilter, sortBy, sortOrder, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchUsers();
    }
  }, [fetchUsers, authLoading, user]);

  const viewUser = (user) => setEditing(user);

  const handleDeactivate = (u) => {
    if (!u) return;
    setDeactivatingUser(u);
    setDeactivateReason("");
  };

  const commitDeactivate = async () => {
    if (!deactivatingUser || deactivateReason.length < 10) return;
    setActionLoading(deactivatingUser.id);
    try {
      await deactivateUser(deactivatingUser.id, deactivateReason);
      setDeactivatingUser(null);
      setDeactivateReason("");
      await fetchUsers();
    } catch (err) {
      console.error("Deactivate error:", err);
      setError("Failed to deactivate user");
    } finally {
      setActionLoading(null);
    }
  };

  const commitEdit = async () => {
    if (!editing) return;
    setActionLoading(editing.id);
    try {
      await changeUserRole(editing.id, editing.role);
      await fetchUsers();
      setEditing(null);
    } catch (err) {
      console.error("Change role error:", err);
      setError("Failed to change user role");
    } finally {
      setActionLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              marginTop: "4px",
            }}
          >
            View, edit and manage all users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setOffset(0);
                setSearch(e.target.value);
              }}
            />
          </div>
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => {
              setOffset(0);
              setRoleFilter(e.target.value);
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setOffset(0);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className="filter-select"
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("_");
              setOffset(0);
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <option value="created_at_desc">Newest Joined</option>
            <option value="created_at_asc">Oldest Joined</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="email_asc">Email (A-Z)</option>
            <option value="email_desc">Email (Z-A)</option>
          </select>
        </div>
      </div>

      <div
        className={
          user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""
        }
      >
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="card" style={{ padding: "0" }}>
          <div className="table-wrapper">
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="text-center py-4">
                        <div
                          className="flex items-center justify-center gap-2"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <i
                            className="bi bi-arrow-repeat"
                            style={{ animation: "spin 1s linear infinite" }}
                          ></i>
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !users.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const initial = u.name?.charAt(0)?.toUpperCase() || "?";
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">{initial}</div>
                            <div>
                              <div
                                style={{
                                  color: "var(--color-text-primary)",
                                  fontWeight: "500",
                                }}
                              >
                                {u.name}
                              </div>
                              {u.verified && (
                                <div
                                  style={{
                                    color: "var(--color-positive)",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  <i className="bi bi-patch-check-fill"></i>{" "}
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>—</td>
                        <td>
                          <span className={`status-badge-custom ${u.status}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              className="btn-action"
                              onClick={() => viewUser(u)}
                              title="View / change role"
                              disabled={loading || actionLoading === u.id}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {u.status !== "inactive" && (
                              <button
                                className="btn-action-reject"
                                onClick={() => handleDeactivate(u)}
                                title="Deactivate"
                                disabled={loading || actionLoading === u.id}
                              >
                                <i className="bi bi-pause-circle"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
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
              onClick={() => setEditing(null)}
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
                  <h3 className="card-title" style={{ margin: 0, fontSize: "1.125rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    <i className="bi bi-person-fill me-2" style={{ color: "var(--color-accent)" }}></i>
                    User Details
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setEditing(null)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="space-y-4" style={{ padding: "1.5rem" }}>
                  {/* User Profile Summary Header */}
                  <div className="user-profile-header text-center pb-4 mb-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <div className="d-flex justify-content-center mb-3">
                      <div className="avatar-large">
                        {editing.name?.charAt(0)?.toUpperCase() || "?"}
                        {editing.verified && (
                          <div className="verified-badge-overlay">
                            <i className="bi bi-patch-check-fill"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 style={{ margin: "0 0 4px 0", fontWeight: "700", color: "var(--color-text-primary)", fontSize: "1.25rem" }}>
                      {editing.name}
                    </h4>
                    <p style={{ margin: "0 0 12px 0", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                      {editing.email}
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <span className={`role-badge ${editing.role}`}>{editing.role}</span>
                      <span className={`status-badge-custom ${editing.status}`}>{editing.status}</span>
                    </div>
                  </div>

                  {/* Profile Metadata */}
                  <div className="metadata-section d-flex flex-column gap-3 mb-4">
                    <div className="metadata-item d-flex align-items-center gap-3">
                      <div className="meta-icon"><i className="bi bi-envelope"></i></div>
                      <div className="flex-grow-1">
                        <div className="meta-label">Email Address</div>
                        <div className="meta-value">{editing.email || "—"}</div>
                      </div>
                    </div>

                    <div className="metadata-item d-flex align-items-center gap-3">
                      <div className="meta-icon"><i className="bi bi-telephone"></i></div>
                      <div className="flex-grow-1">
                        <div className="meta-label">Phone Number</div>
                        <div className="meta-value">{editing.phone || "—"}</div>
                      </div>
                    </div>

                    <div className="metadata-item d-flex align-items-center gap-3">
                      <div className="meta-icon"><i className="bi bi-calendar3"></i></div>
                      <div className="flex-grow-1">
                        <div className="meta-label">Joined Date</div>
                        <div className="meta-value">{formatDate(editing.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Role Change Editor Section */}
                  <div className="role-editor-section p-3 rounded-3" style={{ backgroundColor: "var(--color-bg-input)", border: "1px solid var(--color-border)" }}>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Modify Role Access
                    </label>
                    <select
                      className="form-select"
                      value={editing.role}
                      onChange={(e) =>
                        setEditing({ ...editing, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <small style={{ color: "var(--color-text-muted)", display: "block", marginTop: "8px", fontSize: "11px" }}>
                      <i className="bi bi-info-circle me-1"></i> Saving updates the database role permissions instantly.
                    </small>
                  </div>
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
                    onClick={() => setEditing(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn-primary"
                    onClick={commitEdit}
                    disabled={actionLoading === editing.id}
                  >
                    <i className="bi bi-check-lg me-2"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Deactivate Modal */}
        {deactivatingUser && (
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
              onClick={() => setDeactivatingUser(null)}
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
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Deactivate Account
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setDeactivatingUser(null)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                
                <div className="space-y-4" style={{ padding: "1.5rem" }}>
                  <p style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>
                    Are you sure you want to deactivate <strong>{deactivatingUser.name}</strong>&rsquo;s account?
                  </p>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                    Deactivating this account will prevent them from logging in, accessing their profile, or performing any actions on the platform.
                  </p>
                  
                  <div className="space-y-2">
                    <label
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Reason for deactivating
                    </label>
                    <textarea
                      className="form-input"
                      style={{ 
                        minHeight: "100px", 
                        resize: "vertical", 
                        backgroundColor: "var(--color-bg-input)",
                        borderRadius: "10px",
                        border: "1.5px solid var(--color-border)"
                      }}
                      placeholder="Please provide a detailed reason for deactivating this account (minimum 10 characters)..."
                      value={deactivateReason}
                      onChange={(e) => setDeactivateReason(e.target.value)}
                    />
                    <small style={{ color: deactivateReason.length >= 10 ? "var(--color-text-muted)" : "var(--color-negative)", fontSize: "11px", display: "block" }}>
                      {deactivateReason.length < 10 
                        ? `Minimum 10 characters required (${deactivateReason.length}/10)`
                        : "Ready to deactivate account"
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
                    onClick={() => setDeactivatingUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-danger"
                    onClick={commitDeactivate}
                    disabled={deactivateReason.length < 10 || actionLoading === deactivatingUser.id}
                  >
                    {actionLoading === deactivatingUser.id ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin me-2"></i>
                        Deactivating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pause-circle me-2"></i>
                        Deactivate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}


        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {total}
            </strong>
            {loading && (
              <span className="ms-2">
                <i
                  className="bi bi-arrow-repeat"
                  style={{ animation: "spin 1s linear infinite" }}
                ></i>
              </span>
            )}
            {error && <span className="text-red-500">{error}</span>}
          </small>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setOffset(Math.max(0, offset - limit))}
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
              {Math.floor(offset / limit) + 1}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>

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
        
        .form-input {
          width: 100%;
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 0.875rem;
          color: var(--color-text-primary) !important;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: var(--color-accent) !important;
          outline: none;
          box-shadow: 0 0 0 3px var(--color-accent-dim) !important;
        }
        .form-input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          background-color: rgba(0, 0, 0, 0.1) !important;
        }
        
        .role-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .role-badge.admin {
          background-color: rgba(155, 93, 229, 0.12) !important;
          color: #9b5de5 !important;
          border: 1px solid rgba(155, 93, 229, 0.2) !important;
        }
        .role-badge.organizer {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
        .role-badge.user {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.2) !important;
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
        
        /* Profile Details styling */
        .avatar-large {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.75rem;
          background: linear-gradient(135deg, var(--color-accent) 0%, rgba(122, 204, 0, 0.6) 100%);
          color: #000000;
          border: 3px solid var(--color-border);
          position: relative;
        }
        .verified-badge-overlay {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background-color: var(--color-bg-surface);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-positive);
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .metadata-item {
          padding: 6px 0;
        }
        .meta-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .meta-label {
          font-size: 11px;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .meta-value {
          font-size: 14px;
          color: var(--color-text-primary);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
