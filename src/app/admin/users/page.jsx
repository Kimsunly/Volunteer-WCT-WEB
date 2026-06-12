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
  const [editing, setEditing] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

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
  }, [search, statusFilter, roleFilter, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchUsers();
    }
  }, [fetchUsers, authLoading, user]);

  const viewUser = (user) => setEditing(user);

  const handleDeactivate = async (u) => {
    if (!u) return;
    const reason = prompt("Reason for deactivating (at least 10 characters):");
    if (!reason || reason.length < 10) return;
    setActionLoading(u.id);
    try {
      await deactivateUser(u.id, reason);
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
          <input
            type="search"
            className="search-bar"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.target.value);
            }}
            style={{ maxWidth: "250px" }}
          />
          <select
            className="btn-secondary"
            value={roleFilter}
            onChange={(e) => {
              setOffset(0);
              setRoleFilter(e.target.value);
            }}
            style={{ padding: "8px 16px" }}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="btn-secondary"
            value={statusFilter}
            onChange={(e) => {
              setOffset(0);
              setStatusFilter(e.target.value);
            }}
            style={{ padding: "8px 16px" }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
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
                          <span className={`status-badge ${roleClass(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>—</td>
                        <td>
                          <span
                            className={`status-badge ${statusClass(u.status)}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              className="btn-secondary"
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.8125rem",
                              }}
                              onClick={() => viewUser(u)}
                              title="View / change role"
                              disabled={loading || actionLoading === u.id}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {u.status !== "inactive" && (
                              <button
                                className="btn-reject"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "0.8125rem",
                                }}
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
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setEditing(null)}
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
                  <h3 className="card-title" style={{ color: "white" }}>
                    <i className="bi bi-person-fill me-2"></i>
                    User Details
                  </h3>
                  <button
                    className="card-menu-btn"
                    onClick={() => setEditing(null)}
                    style={{ color: "white" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="space-y-4" style={{ padding: "1.5rem" }}>
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
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={editing.name || ""}
                        disabled
                        style={{ borderRadius: "8px" }}
                      />
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
                      <input
                        type="email"
                        className="input"
                        value={editing.email || ""}
                        disabled
                        style={{ borderRadius: "8px" }}
                      />
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
                      <input
                        type="text"
                        className="input"
                        value={editing.phone || ""}
                        disabled
                        style={{ borderRadius: "8px" }}
                      />
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
                        Role (can change)
                      </label>
                      <select
                        className="input"
                        value={editing.role}
                        onChange={(e) =>
                          setEditing({ ...editing, role: e.target.value })
                        }
                        style={{ borderRadius: "8px" }}
                      >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
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
                        Status
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={editing.status}
                        disabled
                        style={{ borderRadius: "8px" }}
                      />
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
                        Joined Date
                      </label>
                      <p className="form-control-plaintext">
                        {formatDate(editing.created_at)}
                      </p>
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
                        Last Login
                      </label>
                      <p className="form-control-plaintext">—</p>
                    </div>
                    <div>
                      <small style={{ color: "var(--color-text-muted)" }}>
                        Only role changes are saved.
                      </small>
                    </div>
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
                    style={{ borderRadius: "8px" }}
                  >
                    Close
                  </button>
                  <button
                    className="btn-primary"
                    onClick={commitEdit}
                    disabled={actionLoading === editing.id}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="bi bi-check-lg me-2"></i> Save
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
    </div>
  );
}
