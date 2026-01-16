"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PageHeader, RoleGuard } from "../components";
import {
  deactivateUser,
  listUsers,
  changeUserRole,
} from "@/services/admin";
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

  // Add missing mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper functions
  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString();
  };

  const roleClass = (r) => {
    switch (r) {
      case "admin": return "danger";
      case "organizer": return "primary";
      default: return "secondary";
    }
  };

  const statusClass = (s) => {
    switch (s) {
      case "active": return "success";
      case "inactive": return "secondary";
      case "suspended": return "danger";
      case "pending": return "warning";
      default: return "light";
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
      setError("បរាជ័យក្នុងការទាញយកអ្នកប្រើប្រាស់");
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
    const reason = prompt("មូលហេតុនៃការបិទគណនី (យ៉ាងហោច ១០ តួអក្សរ):");
    if (!reason || reason.length < 10) return;
    setActionLoading(u.id);
    try {
      await deactivateUser(u.id, reason);
      await fetchUsers();
    } catch (err) {
      console.error("Deactivate error:", err);
      setError("បរាជ័យក្នុងការបិទគណនី");
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
      setError("បរាជ័យក្នុងការផ្លាស់ប្តូរតួនាទី");
    } finally {
      setActionLoading(null);
    }
  };

  const SkeletonRow = ({ cols = 7 }) => (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className="placeholder-glow">
            <span
              className="placeholder col-12"
              style={{ minHeight: 12 }}
            ></span>
          </div>
        </td>
      ))}
    </tr>
  );

  if (!mounted) return null;

  return (
    <>
      <RoleGuard />

      <PageHeader
        title="ការគ្រប់គ្រងអ្នកប្រើប្រាស់"
        subtitle="View, edit and manage all users"
        actions={
          <div className="d-flex gap-2">
            <input
              type="search"
              className="form-control pill"
              placeholder="ស្វែងរក..."
              value={search}
              onChange={(e) => {
                setOffset(0);
                setSearch(e.target.value);
              }}
              style={{ width: 250 }}
            />
            <select
              className="form-select pill"
              value={roleFilter}
              onChange={(e) => {
                setOffset(0);
                setRoleFilter(e.target.value);
              }}
              style={{ width: 150 }}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
            <select
              className="form-select pill"
              value={statusFilter}
              onChange={(e) => {
                setOffset(0);
                setStatusFilter(e.target.value);
              }}
              style={{ width: 150 }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        }
      />

      <div className={user?.role !== "admin" ? "opacity-50 pe-none" : ""}>
        <div className="admin-card p-3">
          {loading && (
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <div
                className="spinner-border spinner-border-sm"
                role="status"
                aria-label="Loading users"
              ></div>
              កំពុងផ្ទុកទិន្នន័យអ្នកប្រើប្រាស់...
            </div>
          )}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>អ្នកប្រើប្រាស់</th>
                  <th>អ៊ីមែល</th>
                  <th>តួនាទី</th>
                  <th>ថ្ងៃចុះឈ្មោះ</th>
                  <th>ចុងក្រោយចូល</th>
                  <th>ស្ថានភាព</th>
                  <th>សកម្មភាព</th>
                </tr>
              </thead>
              <tbody id="usersTable">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : !users.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-muted py-4"
                    >
                      គ្មានទិន្នន័យ
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const initial =
                      u.name?.charAt(0)?.toUpperCase() || "?";
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar">{initial}</div>
                            <div>
                              <div className="fw-bold">{u.name}</div>
                              {u.verified && (
                                <small className="text-success">
                                  <i className="bi bi-patch-check-fill"></i>{" "}
                                  Verified
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`status-badge bg-${roleClass(u.role)} text-white`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>{formatDate(u.created_at)}</td>
                        <td>—</td>
                        <td>
                          <span
                            className={`status-badge bg-${statusClass(u.status)} text-white`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary pill"
                              onClick={() => viewUser(u)}
                              title="View / change role"
                              disabled={loading || actionLoading === u.id}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {u.status !== "inactive" && (
                              <button
                                className="btn btn-sm btn-warning pill"
                                onClick={() => handleDeactivate(u)}
                                title="Deactivate"
                                disabled={
                                  loading || actionLoading === u.id
                                }
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

        {/* Edit modal */}
        {editing && (
          <>
            <div
              className="modal-backdrop fade show"
              onClick={() => setEditing(null)}
            ></div>
            <div
              className="modal fade show"
              style={{ display: "block" }}
              aria-modal="true"
              role="dialog"
            >
              <div className="modal-dialog modal-lg">
                <div
                  className="modal-content"
                  style={{
                    background: "var(--bg-card)",
                    color: "var(--text-main)",
                  }}
                >
                  <div
                    className="modal-header border-bottom"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h5 className="modal-title">ព័ត៌មានអ្នកប្រើប្រាស់</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditing(null)}
                    ></button>
                  </div>
                  <div className="modal-body" id="userDetail">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editing.name || ""}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={editing.email || ""}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Phone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editing.phone || ""}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Role (can change)
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
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Status
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editing.status}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Joined Date
                        </label>
                        <p className="mb-0 form-control-plaintext">
                          {formatDate(editing.created_at)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Last Login
                        </label>
                        <p className="mb-0 form-control-plaintext">—</p>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted">
                          Only role changes are saved.
                        </small>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal-footer border-top"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary pill"
                      onClick={() => setEditing(null)}
                    >
                      បិត
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary pill"
                      onClick={commitEdit}
                    >
                      រក្សាទុក
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="d-flex align-items-center justify-content-between mt-3">
          <small className="text-muted d-flex align-items-center gap-2">
            <span>
              ទិន្នន័យសរុប: <strong>{total}</strong>
            </span>
            {loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-label="Loading"
              ></span>
            )}
            {error && <span className="text-danger">{error}</span>}
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${offset === 0 || loading ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0 || loading}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {Math.floor(offset / limit) + 1}
                </span>
              </li>
              <li
                className={`page-item ${offset + limit >= total || loading ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total || loading}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
