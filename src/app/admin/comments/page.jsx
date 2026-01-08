"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminCommentsPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [comments, setComments] = useState([]);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [oppFilter, setOppFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    let data = storage.read("comments", []);
    if (!data.length) {
      data = [
        {
          id: 1,
          userName: "Sok Dara",
          userEmail: "dara@example.com",
          opportunityId: 1,
          opportunityTitle: "Teach English to Rural Students",
          comment:
            "This looks like a great opportunity! I would love to participate.",
          createdAt: "2025-01-03 14:30",
          status: "approved",
          flagged: false,
        },
        {
          id: 2,
          userName: "Chan Sophea",
          userEmail: "sophea@example.com",
          opportunityId: 2,
          opportunityTitle: "Community Clean-up Drive",
          comment: "When exactly does this event start? I need more details.",
          createdAt: "2025-01-03 10:15",
          status: "approved",
          flagged: false,
        },
        {
          id: 3,
          userName: "Lim Kosal",
          userEmail: "kosal@example.com",
          opportunityId: 1,
          opportunityTitle: "Teach English to Rural Students",
          comment:
            "This is spam content and not appropriate for this platform!!!",
          createdAt: "2025-01-04 09:00",
          status: "flagged",
          flagged: true,
          flagReason: "Spam/Inappropriate content",
        },
        {
          id: 4,
          userName: "Pov Sreymom",
          userEmail: "sreymom@example.com",
          opportunityId: 3,
          opportunityTitle: "Medical Camp Support",
          comment: "I have medical training and would be happy to help!",
          createdAt: "2025-01-03 16:45",
          status: "approved",
          flagged: false,
        },
        {
          id: 5,
          userName: "Noun Rithy",
          userEmail: "rithy@example.com",
          opportunityId: 2,
          opportunityTitle: "Community Clean-up Drive",
          comment: "Contact me for fake certificates and fraudulent services.",
          createdAt: "2025-01-04 11:20",
          status: "flagged",
          flagged: true,
          flagReason: "Suspicious/Fraudulent",
        },
      ];
      storage.write("comments", data);
    }
    queueMicrotask(() => setComments(data));
  }, []);

  const stats = useMemo(
    () => ({
      total: comments.length,
      flagged: comments.filter((c) => c.flagged).length,
      approved: comments.filter((c) => c.status === "approved").length,
      hidden: comments.filter((c) => c.status === "hidden").length,
    }),
    [comments]
  );

  const filtered = useMemo(() => {
    let list = showFlaggedOnly ? comments.filter((c) => c.flagged) : comments;

    if (oppFilter !== "all") {
      list = list.filter((c) => c.opportunityId === Number(oppFilter));
    }
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }
    return list;
  }, [comments, showFlaggedOnly, oppFilter, statusFilter]);

  const save = (next) => {
    setComments(next);
    storage.write("comments", next);
  };

  const approve = (idx) => {
    const item = filtered[idx];
    const next = comments.map((c) =>
      c.id === item.id ? { ...c, status: "approved", flagged: false } : c
    );
    save(next);
  };

  const hide = (idx) => {
    const item = filtered[idx];
    const next = comments.map((c) =>
      c.id === item.id ? { ...c, status: "hidden" } : c
    );
    save(next);
  };

  const unhide = (idx) => {
    const item = filtered[idx];
    const next = comments.map((c) =>
      c.id === item.id ? { ...c, status: "approved" } : c
    );
    save(next);
  };

  const remove = (idx) => {
    if (!confirm("លុបមតិយោបល់នេះជាអចិន្ត្រៃយ៍?")) return;
    const item = filtered[idx];
    const next = comments.filter((c) => c.id !== item.id);
    save(next);
  };

  const statusChip = (s) => {
    const map = {
      approved: "success",
      flagged: "danger",
      hidden: "warning",
      pending: "secondary",
    };
    return (
      <span className={`status-badge bg-${map[s] || "secondary"} text-white`}>
        {s}
      </span>
    );
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="គ្រប់គ្រងមតិយោបល់"
        subtitle="Review and moderate user comments"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="comments" />
          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="គ្រប់គ្រងមតិយោបល់"
              subtitle="Review and moderate user comments on opportunities"
              actions={
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-danger pill"
                    onClick={() => setShowFlaggedOnly(true)}
                  >
                    <i className="bi bi-flag-fill me-1"></i> Flagged (
                    <span>{stats.flagged}</span>)
                  </button>
                  <button
                    className="btn btn-outline-secondary pill"
                    onClick={() => setShowFlaggedOnly(false)}
                  >
                    <i className="bi bi-list me-1"></i> All Comments
                  </button>
                </div>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              <div className="row g-3">
                {/* Comments list */}
                <div className="col-lg-9">
                  <div id="commentsContainer">
                    {!filtered.length ? (
                      <div className="text-center text-muted py-5">
                        គ្មានមតិយោបល់
                      </div>
                    ) : (
                      filtered.map((c, idx) => {
                        const initial =
                          c.userName?.charAt(0)?.toUpperCase() || "?";
                        const statusClass =
                          c.status === "approved"
                            ? "success"
                            : c.status === "flagged"
                              ? "danger"
                              : c.status === "hidden"
                                ? "warning"
                                : "secondary";

                        return (
                          <div
                            className={`comment-item ${c.flagged ? "flagged" : ""}`}
                            key={c.id}
                          >
                            <div className="d-flex gap-3">
                              <div className="avatar">{initial}</div>
                              <div className="flex-fill">
                                <div className="d-flex align-items-start justify-content-between mb-2">
                                  <div>
                                    <div className="fw-bold">{c.userName}</div>
                                    <small className="text-muted">
                                      {c.userEmail} • {c.createdAt}
                                    </small>
                                  </div>
                                  <span
                                    className={`status-badge bg-${statusClass} text-white`}
                                  >
                                    {c.status}
                                  </span>
                                </div>

                                <div className="mb-2">
                                  <small className="text-muted">
                                    នៅលើ:{" "}
                                    <a
                                      href="#"
                                      className="text-decoration-none"
                                    >
                                      {c.opportunityTitle}
                                    </a>
                                  </small>
                                </div>

                                <p className="mb-2">{c.comment}</p>

                                {c.flagged && (
                                  <div className="alert alert-danger mb-2 py-2">
                                    <i className="bi bi-flag-fill"></i> Flagged:{" "}
                                    {c.flagReason}
                                  </div>
                                )}

                                <div className="d-flex gap-2">
                                  {c.status !== "approved" && (
                                    <button
                                      className="btn btn-sm btn-success pill"
                                      onClick={() => approve(idx)}
                                    >
                                      <i className="bi bi-check-circle"></i>{" "}
                                      Approve
                                    </button>
                                  )}
                                  {c.status !== "hidden" ? (
                                    <button
                                      className="btn btn-sm btn-warning pill"
                                      onClick={() => hide(idx)}
                                    >
                                      <i className="bi bi-eye-slash"></i> Hide
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-info pill"
                                      onClick={() => unhide(idx)}
                                    >
                                      <i className="bi bi-eye"></i> Unhide
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-danger pill"
                                    onClick={() => remove(idx)}
                                  >
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination placeholder */}
                  <nav className="mt-3">
                    <ul className="pagination justify-content-center mb-0">
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

                {/* Sidebar stats & filters */}
                <div className="col-lg-3">
                  <div className="admin-card p-3">
                    <h6 className="mb-3">ស្ថិតិ</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">សរុប:</span>
                      <strong>{stats.total}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Flagged:</span>
                      <strong className="text-danger">{stats.flagged}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Approved:</span>
                      <strong className="text-success">{stats.approved}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Hidden:</span>
                      <strong className="text-warning">{stats.hidden}</strong>
                    </div>
                  </div>

                  <div className="admin-card p-3 mt-3">
                    <h6 className="mb-3">តម្រង</h6>
                    <select
                      className="form-select mb-2"
                      value={oppFilter}
                      onChange={(e) => setOppFilter(e.target.value)}
                    >
                      <option value="all">All Opportunities</option>
                      <option value="1">Teach English to Rural Students</option>
                      <option value="2">Community Clean-up Drive</option>
                      <option value="3">Medical Camp Support</option>
                    </select>
                    <select
                      className="form-select mb-2"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="flagged">Flagged</option>
                      <option value="hidden">Hidden</option>
                    </select>
                    <button
                      className="btn btn-sm btn-outline-secondary w-100 pill"
                      onClick={() => {
                        /* no-op: filters already reactive */
                      }}
                    >
                      អនុវត្តតម្រង
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
