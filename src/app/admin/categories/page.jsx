"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PageHeader, RoleGuard } from "../components";
import {
  createCategory,
  deleteCategory as apiDeleteCategory,
  listCategories,
  updateCategory,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "bi bi-tag",
    color: "#5BC0DE",
    active: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCategories(false); // listCategories(activeOnly=false for admin)
      setCategories(res || []);
      setTotal(res?.length || 0);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("បរាជ័យក្នុងការទាញយកប្រភេទ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchCategories();
    }
  }, [authLoading, user, fetchCategories]);

  const openCreate = () => {
    setEditIdx(null);
    setForm({
      name: "",
      description: "",
      icon: "bi bi-tag",
      color: "#5BC0DE",
      active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditIdx(cat.id);
    setForm({ ...cat });
    setModalOpen(true);
  };

  const handleDelete = async (catId) => {
    if (!confirm("លុបប្រភេទនេះ?")) return;
    setActionLoading(catId);
    try {
      await apiDeleteCategory(catId);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    } finally {
      setActionLoading(null);
    }
  };

  const commit = async () => {
    if (!form.name.trim()) return alert("សូមបំពេញឈ្មោះប្រភេទ");
    setActionLoading("commit");
    try {
      if (editIdx) {
        await updateCategory(editIdx, form);
      } else {
        await createCategory(form);
      }
      await fetchCategories();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save category");
    } finally {
      setActionLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <>      <RoleGuard />

      <PageHeader
        title="ប្រភេទការងារ"
        subtitle="Organize volunteer opportunities by category"
        actions={
          <button className="btn btn-primary pill" onClick={openCreate}>
            <i className="bi bi-plus-circle me-1"></i> បង្កើតប្រភេទថ្មី
          </button>
        }
      />

      <div className={user?.role !== "admin" ? "opacity-50 pe-none" : ""}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="row g-3" id="categoriesGrid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="category-item">
                  <div className="placeholder-glow">
                    <span
                      className="placeholder col-12"
                      style={{ height: 120 }}
                    ></span>
                  </div>
                </div>
              </div>
            ))
          ) : !categories.length ? (
            <div className="col-12 text-center text-muted py-5">
              មិនទាន់មានប្រភេទ។ សូមបង្កើតប្រភេទថ្មី។
            </div>
          ) : (
            categories.map((c) => (
              <div className="col-md-6 col-lg-4" key={c.id || c.name}>
                <div className="category-item">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div
                      className="category-icon"
                      style={{
                        background: `${c.color}20`,
                        color: c.color,
                      }}
                    >
                      <i className={c.icon || "bi bi-tag"}></i>
                    </div>
                    <div className="flex-fill">
                      <h6 className="mb-1">{c.name}</h6>
                      <p className="text-muted small mb-0">
                        {c.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span
                      className={`badge ${c.active ? "bg-success" : "bg-secondary"}`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-muted small">
                      0 opportunities
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary pill flex-fill"
                      onClick={() => openEdit(c)}
                      disabled={actionLoading === c.id}
                    >
                      <i className="bi bi-pencil"></i> កែសម្រួល
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger pill"
                      onClick={() => handleDelete(c.id)}
                      disabled={actionLoading === c.id}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <small className="text-muted d-flex align-items-center gap-2">
            <span>
              ទិន្នន័យសរុប: <strong>{total}</strong>
            </span>
            {loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            )}
          </small>
        </div>

        {/* Modal */}
        {modalOpen && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1040 }}
              onClick={() => setModalOpen(false)}
            ></div>
            <div
              className="modal fade show"
              style={{ display: "block", zIndex: 1050 }}
              aria-modal="true"
              role="dialog"
            >
              <div className="modal-dialog">
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
                    <h5 className="modal-title">
                      {editIdx !== null
                        ? "កែសម្រួលប្រភេទ"
                        : "បង្កើតប្រភេទថ្មី"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={(e) => { e.preventDefault(); commit(); }}>
                      <div className="mb-3">
                        <label className="form-label">ឈ្មោះប្រភេទ *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ពណ៌នា</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">រូបតំណាង (Icon)</label>
                        <div className="input-group mb-2">
                          <span className="input-group-text">
                            <i className={form.icon}></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={form.icon}
                            onChange={(e) =>
                              setForm({ ...form, icon: e.target.value })
                            }
                            placeholder="bi bi-tag"
                          />
                        </div>
                        <div className="d-flex flex-wrap gap-2 p-2 border rounded bg-light">
                          {[
                            "bi bi-tag",
                            "bi bi-heart",
                            "bi bi-star",
                            "bi bi-people",
                            "bi bi-globe",
                            "bi bi-briefcase",
                            "bi bi-book",
                            "bi bi-laptop",
                            "bi bi-tree",
                            "bi bi-music-note",
                            "bi bi-shop",
                            "bi bi-bicycle"
                          ].map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              className={`btn btn-sm ${form.icon === icon ? "btn-primary" : "btn-outline-secondary"}`}
                              onClick={() => setForm({ ...form, icon })}
                              title={icon}
                            >
                              <i className={icon}></i>
                            </button>
                          ))}
                        </div>
                        <small className="text-muted">
                          ជ្រើសរើសរូបតំណាងពីបញ្ជី ឬវាយបញ្ចូលកូដ (Bootstrap Icons)
                        </small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ពណ៌សម្គាល់</label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="color"
                            className="form-control form-control-color"
                            value={form.color}
                            onChange={(e) =>
                              setForm({ ...form, color: e.target.value })
                            }
                            title="Choose your color"
                          />
                          <input
                            type="text"
                            className="form-control"
                            value={form.color}
                            onChange={(e) => setForm({ ...form, color: e.target.value })}
                            style={{ maxWidth: 100 }}
                          />
                        </div>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="categoryActive"
                          checked={form.active}
                          onChange={(e) =>
                            setForm({ ...form, active: e.target.checked })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="categoryActive"
                        >
                          សកម្ម
                        </label>
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
                      onClick={() => setModalOpen(false)}
                    >
                      បោះបង់
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary pill"
                      onClick={commit}
                      disabled={actionLoading === "commit"}
                    >
                      {actionLoading === "commit" ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          កំពុងរក្សាទុក...
                        </>
                      ) : "រក្សាទុក"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
