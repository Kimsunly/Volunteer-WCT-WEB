"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminCategoriesPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "bi bi-tag",
    color: "#5BC0DE",
    active: true,
  });

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    let data = storage.read("categories", []);
    if (!data.length) {
      data = [
        {
          name: "Education",
          description: "Teaching and learning opportunities",
          icon: "bi bi-book",
          color: "#5BC0DE",
          active: true,
        },
        {
          name: "Health",
          description: "Healthcare and medical support",
          icon: "bi bi-heart-pulse",
          color: "#E74C3C",
          active: true,
        },
        {
          name: "Environment",
          description: "Conservation and sustainability",
          icon: "bi bi-tree",
          color: "#2ECC71",
          active: true,
        },
        {
          name: "Community",
          description: "Community building and social work",
          icon: "bi bi-people",
          color: "#F39C12",
          active: true,
        },
        {
          name: "Animal Welfare",
          description: "Caring for animals and wildlife",
          icon: "bi bi-heart",
          color: "#9B59B6",
          active: true,
        },
      ];
      storage.write("categories", data);
    }
    queueMicrotask(() => setCategories(data));
  }, []);

  const save = (next) => {
    setCategories(next);
    storage.write("categories", next);
  };

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

  const openEdit = (idx) => {
    const c = categories[idx];
    setEditIdx(idx);
    setForm({ ...c });
    setModalOpen(true);
  };

  const deleteCategory = (idx) => {
    if (!confirm("លុបប្រភេទនេះ? ប្រភេទនេះអាចកំពុងត្រូវប្រើដោយការងារមួយចំនួន។"))
      return;
    const next = categories.filter((_, i) => i !== idx);
    save(next);
  };

  const commit = () => {
    if (!form.name.trim()) return alert("សូមបំពេញឈ្មោះប្រភេទ");
    const next = [...categories];
    if (editIdx !== null && editIdx !== undefined) next[editIdx] = { ...form };
    else next.push({ ...form });
    save(next);
    setModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="ប្រភេទការងារ"
        subtitle="Organize volunteer opportunities by category"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="categories" />

          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="ប្រភេទការងារ"
              subtitle="Organize volunteer opportunities by category"
              actions={
                <button className="btn btn-primary pill" onClick={openCreate}>
                  <i className="bi bi-plus-circle me-1"></i> បង្កើតប្រភេទថ្មី
                </button>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              <div className="row g-3" id="categoriesGrid">
                {!categories.length ? (
                  <div className="col-12 text-center text-muted py-5">
                    មិនទាន់មានប្រភេទ។ សូមបង្កើតប្រភេទថ្មី។
                  </div>
                ) : (
                  categories.map((c, idx) => (
                    <div className="col-md-6 col-lg-4" key={`${c.name}-${idx}`}>
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
                            onClick={() => openEdit(idx)}
                          >
                            <i className="bi bi-pencil"></i> កែសម្រួល
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger pill"
                            onClick={() => deleteCategory(idx)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal */}
              {modalOpen && (
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="modal-backdrop fade show"
                    onClick={() => setModalOpen(false)}
                  ></div>
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
                        <form>
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
                            <label className="form-label">រូបតំណាង Icon</label>
                            <input
                              type="text"
                              className="form-control"
                              value={form.icon}
                              onChange={(e) =>
                                setForm({ ...form, icon: e.target.value })
                              }
                              placeholder="bi bi-heart"
                            />
                            <small className="text-muted">
                              Use Bootstrap Icons class (e.g., bi bi-heart, bi
                              bi-tree, bi bi-people)
                            </small>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">ពណ៌</label>
                            <input
                              type="color"
                              className="form-control form-control-color"
                              value={form.color}
                              onChange={(e) =>
                                setForm({ ...form, color: e.target.value })
                              }
                            />
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
                        >
                          រក្សាទុក
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
