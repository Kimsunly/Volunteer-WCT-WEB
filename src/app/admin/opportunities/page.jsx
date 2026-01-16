"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { PageHeader, RoleGuard } from "../components";
import {
  listAllOpportunities as listOpportunities,
  updateOpportunity,
  deleteOpportunity as apiDeleteOpportunity,
  createOpportunityAsAdmin,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";

export default function AdminOpportunitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const [opps, setOpps] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOpps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listOpportunities({
        search,
        status: status === "all" ? null : status,
        category: category === "all" ? null : category,
        limit,
        offset,
      });
      const items = res?.data || res || [];
      setOpps(items);
      setTotal(res?.total ?? items.length ?? 0);
    } catch (e) {
      console.error("Fetch opportunities error:", e);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  }, [search, status, category, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchOpps();
    }
  }, [authLoading, user, fetchOpps]);

  const viewRegistrations = (item) => {
    alert(
      `${item.applicants_count ?? 0} អ្នកបានចុះឈ្មោះសម្រាប់ "${item.title}"\n\nRegistrations view coming soon!`
    );
  };

  const handleDeleteOpp = async (id) => {
    if (!confirm("លុបការងារនេះជាអចិន្ត្រៃយ៍?")) return;
    console.log("Deleting opportunity:", id);
    try {
      const response = await apiDeleteOpportunity(id);
      console.log("Delete response:", response);
      alert("ការលុបបានជោគជ័យ!");
      await fetchOpps();
    } catch (e) {
      console.error("Delete error:", e);
      console.error("Error response:", e.response);
      setError("បរាជ័យក្នុងការលុប");
      alert(`បរាជ័យក្នុងការលុប: ${e.response?.data?.detail || e.message}`);
    }
  };

  const openCreateOpp = () => {
    setEditIdx(null);
    setEditData({
      title: "",
      category: "education",
      description: "",
      organizer: "Admin",
      location: "",
      startDate: "",
      endDate: "",
      registered: 0,
      visibility: "public",
      status: "active",
    });
  };

  const openEditOpp = (item) => {
    setEditIdx(item.id);
    setEditData({ ...item });
  };

  const commitEditOpp = async (e) => {
    e.preventDefault(); // Prevent duplicate submissions if form triggers it
    if (!editData) return;
    try {
      if (editIdx) {
        await updateOpportunity(editData.id, editData);
      } else {
        await createOpportunityAsAdmin(editData);
      }
      await fetchOpps();
      setEditIdx(null);
      setEditData(null);
      alert(editIdx ? "បានកែសម្រួលដោយជោគជ័យ" : "បានបង្កើតដោយជោគជ័យ");
    } catch (err) {
      console.error("Save error:", err);
      setError("បរាជ័យក្នុងការរក្សាទុក");
    }
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
      <RoleGuard />

      <PageHeader
        title="គ្រប់គ្រងការងារស្ម័គ្រចិត្ត"
        subtitle="Admin has override power to CRUD all opportunities"
        actions={
          <div className="d-flex gap-2">
            <button className="btn btn-primary pill" onClick={openCreateOpp}>
              <i className="bi bi-plus-circle me-1"></i> បង្កើតថ្មី
            </button>
            <input
              type="search"
              className="form-control pill"
              placeholder="ស្វែងរក..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <select
              className="form-select pill"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 140 }}
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
              style={{ width: 140 }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        }
      />

      <div className={user?.role?.toLowerCase() !== "admin" ? "opacity-50 pe-none" : ""}>
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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7}>
                        <div className="placeholder-glow">
                          <span
                            className="placeholder col-12"
                            style={{ height: 20 }}
                          ></span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !opps.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-muted py-4"
                    >
                      គ្មានទិន្នន័យ
                    </td>
                  </tr>
                ) : (
                  opps.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.title}</strong>
                      </td>
                      <td>{o.organizer_name}</td>
                      <td>
                        <span className="badge bg-primary">
                          {o.category}
                        </span>
                      </td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
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
                            onClick={() => openEditOpp(o)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info pill"
                            onClick={() => viewRegistrations(o)}
                            title="Registrations"
                          >
                            <i className="bi bi-people"></i>{" "}
                            {o.applicants_count || 0}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger pill"
                            onClick={() => handleDeleteOpp(o.id)}
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
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1040 }}
              onClick={() => {
                setEditIdx(null);
                setEditData(null);
              }}
            ></div>
            <div
              className="modal fade show"
              style={{ display: "block", zIndex: 1050 }}
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
                    <h5 className="modal-title">{editIdx ? "កែសម្រួលការងារ" : "បង្កើតការងារថ្មី"}</h5>
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
                    <form className="needs-validation" onSubmit={(e) => e.preventDefault()}>
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
                      onClick={commitEditOpp}
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
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{page}</span>
              </li>
              <li
                className={`page-item ${page * limit >= total ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
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
