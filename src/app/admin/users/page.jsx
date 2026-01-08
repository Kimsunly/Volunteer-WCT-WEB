"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // user | organizer | admin | all
  const [statusFilter, setStatusFilter] = useState("all"); // active | suspended | banned | all
  const [editing, setEditing] = useState(null); // user being edited (full object)

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    const role = localStorage.getItem("role") || "admin";
    queueMicrotask(() => setRoleAllowed(role === "admin"));
    let data = storage.read("users", []);
    if (!data.length) {
      data = [
        {
          id: 1,
          name: "Sok Dara",
          email: "dara@example.com",
          role: "user",
          joinedAt: "2024-12-01",
          lastLogin: "2025-01-04",
          status: "active",
          phone: "012-345-678",
          opportunities: 5,
        },
        {
          id: 2,
          name: "Chan Sophea",
          email: "sophea@greencambodia.org",
          role: "organizer",
          joinedAt: "2024-11-15",
          lastLogin: "2025-01-03",
          status: "active",
          phone: "016-789-012",
          opportunities: 12,
          verified: true,
        },
        {
          id: 3,
          name: "Lim Kosal",
          email: "kosal@example.com",
          role: "user",
          joinedAt: "2024-12-20",
          lastLogin: "2025-01-02",
          status: "active",
          phone: "017-234-567",
          opportunities: 2,
        },
        {
          id: 4,
          name: "Admin User",
          email: "admin@smakjit.org",
          role: "admin",
          joinedAt: "2024-01-01",
          lastLogin: "2025-01-04",
          status: "active",
          phone: "010-111-222",
          opportunities: 0,
        },
      ];
      storage.write("users", data);
    }
    queueMicrotask(() => setUsers(data));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const save = (next) => {
    setUsers(next);
    storage.write("users", next);
  };

  const statusClass = (s) =>
    s === "active" ? "success" : s === "suspended" ? "warning" : "danger";
  const roleClass = (r) =>
    r === "admin" ? "dark" : r === "organizer" ? "primary" : "secondary";

  const viewUser = (idx) => {
    setEditing(filtered[idx]);
  };

  const suspendUser = (idx) => {
    if (!confirm("ផ្អាក់អ្នកប្រើប្រាស់នេះ?")) return;
    const item = filtered[idx];
    const next = users.map((u) =>
      u.id === item.id ? { ...u, status: "suspended" } : u
    );
    save(next);
  };

  const activateUser = (idx) => {
    if (!confirm("ធ្វើឱ្យសកម្មម្តងទៀត?")) return;
    const item = filtered[idx];
    const next = users.map((u) =>
      u.id === item.id ? { ...u, status: "active" } : u
    );
    save(next);
  };

  const banUser = (idx) => {
    if (!confirm("ហាមឃាត់អ្នកប្រើប្រាស់នេះជាអចិន្ត្រៃយ៍?")) return;
    const item = filtered[idx];
    const next = users.map((u) =>
      u.id === item.id ? { ...u, status: "banned" } : u
    );
    save(next);
  };

  const commitEdit = () => {
    if (!editing) return;
    const next = users.map((u) => (u.id === editing.id ? { ...editing } : u));
    save(next);
    setEditing(null);
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="អ្នកប្រើប្រាស់"
        subtitle="View, edit and manage all users"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="users" />
          <main className="col-lg-9 col-xl-10">
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
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 250 }}
                  />
                  <select
                    className="form-select pill"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: 150 }}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              <div className="admin-card p-3">
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
                      {!filtered.length ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-muted py-4"
                          >
                            គ្មានទិន្នន័យ
                          </td>
                        </tr>
                      ) : (
                        filtered.map((u, idx) => {
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
                              <td>{u.joinedAt}</td>
                              <td>{u.lastLogin}</td>
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
                                    onClick={() => viewUser(idx)}
                                    title="View/Edit"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </button>
                                  {u.status === "active" && (
                                    <button
                                      className="btn btn-sm btn-warning pill"
                                      onClick={() => suspendUser(idx)}
                                      title="Suspend"
                                    >
                                      <i className="bi bi-pause-circle"></i>
                                    </button>
                                  )}
                                  {u.status === "suspended" && (
                                    <button
                                      className="btn btn-sm btn-success pill"
                                      onClick={() => activateUser(idx)}
                                      title="Activate"
                                    >
                                      <i className="bi bi-check-circle"></i>
                                    </button>
                                  )}
                                  {u.role !== "admin" && (
                                    <button
                                      className="btn btn-sm btn-danger pill"
                                      onClick={() => banUser(idx)}
                                      title="Ban"
                                    >
                                      <i className="bi bi-x-circle"></i>
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
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="modal-backdrop fade show"
                    onClick={() => setEditing(null)}
                  ></div>
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
                              value={editing.name}
                              onChange={(e) =>
                                setEditing({ ...editing, name: e.target.value })
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              value={editing.email}
                              onChange={(e) =>
                                setEditing({
                                  ...editing,
                                  email: e.target.value,
                                })
                              }
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
                              onChange={(e) =>
                                setEditing({
                                  ...editing,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Role
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
                            <select
                              className="form-select"
                              value={editing.status}
                              onChange={(e) =>
                                setEditing({
                                  ...editing,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="banned">Banned</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Joined Date
                            </label>
                            <p className="mb-0 form-control-plaintext">
                              {editing.joinedAt}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Last Login
                            </label>
                            <p className="mb-0 form-control-plaintext">
                              {editing.lastLogin}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Registered Opportunities
                            </label>
                            <p className="mb-0 form-control-plaintext">
                              {editing.opportunities || 0}
                            </p>
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
              )}

              <div className="d-flex align-items-center justify-content-between mt-3">
                <small className="text-muted">
                  ទិន្នន័យសរុប: <strong>{filtered.length}</strong>
                </small>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                      <a className="page-link">Previous</a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link">1</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link">2</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
