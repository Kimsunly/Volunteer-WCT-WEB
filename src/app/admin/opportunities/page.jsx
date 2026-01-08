"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminOpportunitiesPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [opps, setOpps] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editIdx, setEditIdx] = useState(null); // index in filtered list
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    let data = storage.read("opportunities", []);
    if (!data.length) {
      data = [
        {
          id: 1,
          title: "Teach English to Rural Students",
          organizer: "Khmer Youth Foundation",
          category: "education",
          location: "Siem Reap",
          startDate: "2025-02-01",
          endDate: "2025-03-01",
          description: "Help teach English to students in rural areas",
          visibility: "public",
          status: "active",
          registered: 12,
          postedAt: "2025-01-02",
        },
        {
          id: 2,
          title: "Community Clean-up Drive",
          organizer: "Green Cambodia",
          category: "environment",
          location: "Phnom Penh",
          startDate: "2025-01-15",
          endDate: "2025-01-15",
          description: "Join us for a community clean-up event",
          visibility: "public",
          status: "active",
          registered: 45,
          postedAt: "2024-12-28",
        },
        {
          id: 3,
          title: "Medical Camp Support",
          organizer: "Health for All",
          category: "health",
          location: "Battambang",
          startDate: "2025-02-10",
          endDate: "2025-02-12",
          description: "Assist in medical camp operations",
          visibility: "private",
          status: "draft",
          registered: 3,
          postedAt: "2025-01-03",
        },
      ];
      storage.write("opportunities", data);
    }
    queueMicrotask(() => setOpps(data));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return opps.filter((o) => {
      const matchSearch =
        o.title.toLowerCase().includes(term) ||
        o.organizer.toLowerCase().includes(term);
      const matchCategory = category === "all" || o.category === category;
      const matchStatus = status === "all" || o.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [opps, search, category, status]);

  const save = (next) => {
    setOpps(next);
    storage.write("opportunities", next);
  };

  const viewRegistrations = (idx) => {
    const o = filtered[idx];
    alert(
      `${o.registered} អ្នកបានចុះឈ្មោះសម្រាប់ "${o.title}"\n\nRegistrations view coming soon!`
    );
  };

  const deleteOpp = (idx) => {
    if (!confirm("លុបការងារនេះជាអចិន្ត្រៃយ៍?")) return;
    const item = filtered[idx];
    const next = opps.filter((o) => o.id !== item.id);
    save(next);
  };

  const openEdit = (idx) => {
    const item = filtered[idx];
    setEditIdx(idx);
    setEditData({ ...item });
  };

  const commitEdit = () => {
    if (!editData) return;
    const realId = editData.id;
    const next = opps.map((o) => (o.id === realId ? { ...o, ...editData } : o));
    save(next);
    setEditIdx(null);
    setEditData(null);
  };

  const statusBadge = (s) => {
    const map = { active: "success", draft: "warning", closed: "secondary" };
    return (
      <span className={`status-badge bg-${map[s] || "secondary"} text-white`}>
        {s}
      </span>
    );
  };

  const visibilityIcon = (v) => (v === "public" ? "globe" : "lock");

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="គ្រប់គ្រងការងារស្ម័គ្រចិត្ត"
        subtitle="View and manage all opportunities"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="opportunities" />
          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="គ្រប់គ្រងការងារស្ម័គ្រចិត្ត"
              subtitle="Admin has override power to CRUD all opportunities"
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: 150 }}
                  >
                    <option value="all">All Categories</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                    <option value="community">Community</option>
                  </select>
                  <select
                    className="form-select pill"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: 150 }}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
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
                        <th>ចំណងជើង</th>
                        <th>អង្គការ</th>
                        <th>ប្រភេទ</th>
                        <th>ដាក់ថ្ងៃ</th>
                        <th>មើលភាព</th>
                        <th>ស្ថានភាព</th>
                        <th>សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody id="opportunitiesTable">
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
                        filtered.map((o, idx) => (
                          <tr key={o.id}>
                            <td>
                              <strong>{o.title}</strong>
                            </td>
                            <td>{o.organizer}</td>
                            <td>
                              <span className="badge bg-primary">
                                {o.category}
                              </span>
                            </td>
                            <td>{o.postedAt}</td>
                            <td>
                              <i
                                className={`bi bi-${visibilityIcon(o.visibility)}`}
                              ></i>{" "}
                              {o.visibility}
                            </td>
                            <td>{statusBadge(o.status)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm btn-outline-primary pill"
                                  onClick={() => openEdit(idx)}
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-info pill"
                                  onClick={() => viewRegistrations(idx)}
                                  title="Registrations"
                                >
                                  <i className="bi bi-people"></i>{" "}
                                  {o.registered}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger pill"
                                  onClick={() => deleteOpp(idx)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Modal */}
              {editData && (
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="modal-backdrop fade show"
                    onClick={() => {
                      setEditIdx(null);
                      setEditData(null);
                    }}
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
                        <h5 className="modal-title">កែសម្រួលការងារ</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => {
                            setEditIdx(null);
                            setEditData(null);
                          }}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form className="needs-validation">
                          <div className="row g-3">
                            <div className="col-md-8">
                              <label className="form-label">ចំណងជើង *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editData.title}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    title: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">ប្រភេទ *</label>
                              <select
                                className="form-select"
                                value={editData.category}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    category: e.target.value,
                                  })
                                }
                                required
                              >
                                <option value="education">Education</option>
                                <option value="health">Health</option>
                                <option value="environment">Environment</option>
                                <option value="community">Community</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label">ពណ៌នា</label>
                              <textarea
                                className="form-control"
                                rows={4}
                                value={editData.description || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    description: e.target.value,
                                  })
                                }
                              ></textarea>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">អង្គការ</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editData.organizer}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    organizer: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">ទីកន្លែង</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editData.location || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    location: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                ថ្ងៃចាប់ផ្តើម
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={editData.startDate || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    startDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">ថ្ងៃបញ្ចប់</label>
                              <input
                                type="date"
                                className="form-control"
                                value={editData.endDate || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    endDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                ចំនួនអ្នកចុះឈ្មោះ
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={editData.registered || 0}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    registered: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">មើលភាព</label>
                              <select
                                className="form-select"
                                value={editData.visibility}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    visibility: e.target.value,
                                  })
                                }
                              >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">ស្ថានភាព</label>
                              <select
                                className="form-select"
                                value={editData.status}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        className="modal-footer border-top"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary pill"
                          onClick={() => {
                            setEditIdx(null);
                            setEditData(null);
                          }}
                        >
                          បោះបង់
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
