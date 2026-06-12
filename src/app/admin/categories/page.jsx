"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RoleGuard } from "../components";
import {
  createCategory,
  deleteCategory as apiDeleteCategory,
  listCategories,
  updateCategory,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { parseApiError } from "@/lib/utils/apiError";

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCategories(false);
      setCategories(res || []);
      setTotal(res?.length || 0);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Failed to load categories");
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

  const triggerDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setActionLoading(categoryToDelete.id);
    setError(null);
    try {
      await apiDeleteCategory(categoryToDelete.id);
      toast.success("លុបប្រភេទឱកាសដោយជោគជ័យ / Category deleted successfully");
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      const msg = parseApiError(err) || "Failed to delete category";
      toast.error(msg);
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const commit = async () => {
    if (!form.name.trim()) return alert("Please enter category name");
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
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories Management</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              marginTop: "4px",
            }}
          >
            Organize volunteer opportunities by category
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i> Create Category
        </button>
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
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div className="card-header" style={{ marginBottom: "0" }}>
              <div className="card-title">Categories</div>
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
                Loading categories...
              </div>
            </div>
          )}

          {!loading && !categories.length ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <i className="bi bi-tags" style={{ fontSize: "3rem" }}></i>
              <p className="mt-4">No categories yet. Create one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Opportunities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id || c.name}>
                      <td>
                        <div
                          className="metric-icon"
                          style={{
                            background: `${c.color}20`,
                            color: c.color,
                            width: "40px",
                            height: "40px",
                            fontSize: "1rem",
                          }}
                        >
                          <i className={c.icon || "bi bi-tag"}></i>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            color: "var(--color-text-primary)",
                            fontWeight: "500",
                          }}
                        >
                          {c.name}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {c.description || "No description"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${c.active ? "active" : "rejected"}`}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          0
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => openEdit(c)}
                            disabled={actionLoading === c.id}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => triggerDelete(c)}
                            disabled={actionLoading === c.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
          </small>
        </div>

        {/* Modal */}
        {modalOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1040,
              }}
              onClick={() => setModalOpen(false)}
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
              }}
            >
              <div
                className="card shadow-lg border-0"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg-card, #ffffff)",
                  padding: "28px",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                }}
              >
                {/* Header */}
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--color-border, #e9ecef)"
                  }}
                >
                  <h3 className="card-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    {editIdx !== null ? "Edit Category" : "Create New Category"}
                  </h3>
                  <button
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close"
                    style={{ background: "none", border: "none", fontSize: "1.1rem", padding: "4px" }}
                  >
                    <i className="bi bi-x-lg" style={{ color: "var(--color-text-muted, #888)" }}></i>
                  </button>
                </div>

                {/* Form fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #555)",
                        fontWeight: "600",
                      }}
                    >
                      Name <span style={{ color: "var(--color-negative, #dc3545)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Category name"
                      style={{
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "0.95rem"
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #555)",
                        fontWeight: "600",
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe what this category is about"
                      style={{
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "0.95rem",
                        resize: "none"
                      }}
                    ></textarea>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #555)",
                        fontWeight: "600",
                      }}
                    >
                      Icon
                    </label>
                    
                    <div className="input-group mb-3" style={{ borderRadius: "8px", overflow: "hidden" }}>
                      <span className="input-group-text" style={{ background: "var(--color-bg-input, #f8f9fa)", borderRight: "none" }}>
                        <i className={form.icon} style={{ color: form.color || "var(--primary-color)" }}></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={form.icon}
                        onChange={(e) =>
                          setForm({ ...form, icon: e.target.value })
                        }
                        placeholder="bi bi-tag"
                        style={{
                          borderLeft: "none",
                          fontSize: "0.95rem",
                          padding: "10px"
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        padding: "16px",
                        border: "1px solid var(--color-border, #e9ecef)",
                        borderRadius: "10px",
                        background: "var(--color-bg-input, #f8f9fa)",
                      }}
                    >
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
                        "bi bi-bicycle",
                      ].map((icon) => {
                        const isSelected = form.icon === icon;
                        return (
                          <button
                            key={icon}
                            type="button"
                            style={{
                              width: "42px",
                              height: "42px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              border: isSelected ? "2px solid var(--primary-color, #4DB8FF)" : "1px solid var(--color-border, #e9ecef)",
                              background: isSelected ? "rgba(77, 184, 255, 0.1)" : "#ffffff",
                              color: isSelected ? "var(--primary-color, #4DB8FF)" : "var(--color-text-secondary, #555)",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              fontSize: "1.1rem"
                            }}
                            onClick={() => setForm({ ...form, icon })}
                          >
                            <i className={icon}></i>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #555)",
                        fontWeight: "600",
                      }}
                    >
                      Color
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={form.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                        style={{
                          width: "54px",
                          height: "42px",
                          padding: "6px",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={form.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                        placeholder="#5BC0DE"
                        style={{
                          maxWidth: "150px",
                          borderRadius: "8px",
                          fontSize: "0.95rem",
                          padding: "10px"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="categoryActive"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      style={{ width: "20px", height: "20px", cursor: "pointer", borderRadius: "4px" }}
                    />
                    <label
                      htmlFor="categoryActive"
                      style={{
                        color: "var(--color-text-primary)",
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      Active (visible to public)
                    </label>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "28px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--color-border, #e9ecef)",
                  }}
                >
                  <button
                    className="btn btn-light"
                    onClick={() => setModalOpen(false)}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontWeight: "500",
                      fontSize: "0.95rem"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={commit}
                    disabled={actionLoading === "commit"}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      background: "var(--primary-color, #4DB8FF)",
                      border: "none"
                    }}
                  >
                    <i className="bi bi-check-lg me-2"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && categoryToDelete && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1060,
              }}
              onClick={() => setDeleteConfirmOpen(false)}
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
                zIndex: 1070,
                padding: "1rem",
              }}
            >
              <div
                className="card shadow-lg border-0"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  background: "var(--bg-card, #ffffff)",
                  padding: "32px",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "var(--color-negative, #FF4D4D)", fontSize: "3.5rem", marginBottom: "16px" }}>
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "12px", color: "var(--color-text-primary)" }}>
                  Confirm Deletion
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", marginBottom: "28px", lineHeight: "1.6" }}>
                  Are you sure you want to delete the category <strong style={{ color: "var(--color-text-primary)" }}>{categoryToDelete.name}</strong>? This action cannot be undone and will permanently remove this category.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    className="btn btn-light"
                    onClick={() => setDeleteConfirmOpen(false)}
                    style={{ minWidth: "110px", padding: "10px 20px", borderRadius: "8px", fontWeight: "500", fontSize: "0.95rem" }}
                    disabled={actionLoading === categoryToDelete.id}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmDelete}
                    style={{
                      minWidth: "130px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      background: "var(--color-negative, #FF4D4D)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    disabled={actionLoading === categoryToDelete.id}
                  >
                    {actionLoading === categoryToDelete.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "1rem", height: "1rem" }}></span>
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
