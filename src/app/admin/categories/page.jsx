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
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(6px)",
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
                pointerEvents: "none",
              }}
            >
              <div
                className="card shadow-lg"
                style={{
                  width: "100%",
                  maxWidth: "750px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border)",
                  padding: "28px",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  pointerEvents: "auto",
                }}
              >
                <style>{`
                  @media (max-width: 768px) {
                    .modal-columns {
                      grid-template-columns: 1fr !important;
                    }
                    .preview-column {
                      border-left: none !important;
                      padding-left: 0 !important;
                      margin-top: 16px !important;
                      border-top: 1px solid var(--color-border) !important;
                      padding-top: 20px !important;
                    }
                  }
                `}</style>

                {/* Header */}
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--color-border)"
                  }}
                >
                  <h3 className="card-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    {editIdx !== null ? "Edit Category" : "Create New Category"}
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close"
                    style={{ background: "none", border: "none", fontSize: "1.1rem", padding: "4px" }}
                  >
                    <i className="bi bi-x-lg" style={{ color: "var(--color-text-muted)" }}></i>
                  </button>
                </div>

                {/* Split Content */}
                <div 
                  className="modal-columns"
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1.2fr 1fr", 
                    gap: "24px" 
                  }}
                >
                  {/* Left Column: Form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "0.85rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                        }}
                      >
                        Name <span style={{ color: "var(--color-negative)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Category name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "0.85rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        className="form-input"
                        rows={2}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Describe what this category is about"
                        style={{
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
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                        }}
                      >
                        Select Icon
                      </label>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(6, 1fr)",
                          gap: "8px",
                          padding: "12px",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          background: "var(--color-bg-input)",
                        }}
                      >
                        {[
                          "bi bi-tag-fill",
                          "bi bi-heart-fill",
                          "bi bi-people-fill",
                          "bi bi-tree-fill",
                          "bi bi-mortarboard-fill",
                          "bi bi-briefcase-fill",
                          "bi bi-laptop",
                          "bi bi-music-note-beamed",
                          "bi bi-bicycle",
                          "bi bi-gift-fill",
                          "bi bi-globe2",
                          "bi bi-shield-shaded",
                        ].map((icon) => {
                          const isSelected = form.icon === icon;
                          return (
                            <button
                              key={icon}
                              type="button"
                              style={{
                                height: "38px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                                border: isSelected ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                                background: isSelected ? "var(--color-accent-dim)" : "var(--color-bg-surface)",
                                color: isSelected ? "var(--color-accent)" : "var(--color-text-secondary)",
                                transition: "all 0.15s ease",
                                cursor: "pointer",
                                fontSize: "1.1rem"
                              }}
                              onClick={() => setForm({ ...form, icon })}
                              title={icon.replace("bi bi-", "").replace("-fill", "")}
                            >
                              <i className={icon}></i>
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        value={form.icon}
                        onChange={(e) =>
                          setForm({ ...form, icon: e.target.value })
                        }
                        placeholder="bi bi-tag-fill"
                        style={{
                          marginTop: "8px",
                          fontSize: "0.85rem",
                          padding: "6px 10px"
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "0.85rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                        }}
                      >
                        Theme Color
                      </label>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(8, 1fr)",
                          gap: "8px",
                          padding: "10px",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          background: "var(--color-bg-input)",
                          marginBottom: "8px",
                        }}
                      >
                        {[
                          "#AAFF00", // Lime Green
                          "#10B981", // Emerald
                          "#3B82F6", // Sky Blue
                          "#8B5CF6", // Purple
                          "#EC4899", // Pink
                          "#F59E0B", // Amber
                          "#EF4444", // Cherry Red
                          "#9CA3AF", // Slate Grey
                        ].map((c) => {
                          const isSelected = form.color?.toUpperCase() === c.toUpperCase();
                          return (
                            <button
                              key={c}
                              type="button"
                              style={{
                                height: "24px",
                                borderRadius: "50%",
                                background: c,
                                border: isSelected ? "2px solid #FFFFFF" : "none",
                                boxShadow: isSelected ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                                cursor: "pointer",
                                transition: "transform 0.15s ease",
                                transform: isSelected ? "scale(1.1)" : "scale(1)",
                              }}
                              onClick={() => setForm({ ...form, color: c })}
                              title={c}
                            />
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="color"
                          value={form.color || "#5BC0DE"}
                          onChange={(e) =>
                            setForm({ ...form, color: e.target.value })
                          }
                          style={{
                            width: "42px",
                            height: "36px",
                            padding: "4px",
                            borderRadius: "6px",
                            background: "var(--color-bg-input)",
                            border: "1px solid var(--color-border)",
                            cursor: "pointer"
                          }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={form.color}
                          onChange={(e) =>
                            setForm({ ...form, color: e.target.value })
                          }
                          placeholder="#5BC0DE"
                          style={{
                            maxWidth: "120px",
                            fontSize: "0.85rem",
                            padding: "6px 10px"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-text-secondary)" }}>
                        Active (visible to public)
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, active: !form.active })}
                        style={{
                          width: "48px",
                          height: "24px",
                          borderRadius: "12px",
                          background: form.active ? "var(--color-accent)" : "var(--color-bg-input)",
                          border: "1px solid var(--color-border)",
                          position: "relative",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: form.active ? "#000" : "var(--color-text-secondary)",
                            position: "absolute",
                            top: "2px",
                            left: form.active ? "26px" : "2px",
                            transition: "all 0.2s ease",
                          }}
                        ></div>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Live Preview */}
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "16px",
                      borderLeft: "1px solid var(--color-border)",
                      paddingLeft: "24px",
                    }}
                    className="preview-column"
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Live Card Preview
                    </div>
                    <div
                      style={{
                        background: "var(--color-bg-base)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        boxShadow: "var(--shadow-card)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div
                          className="metric-icon"
                          style={{
                            background: `${form.color}15`,
                            color: form.color,
                            border: `1px solid ${form.color}30`,
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                          }}
                        >
                          <i className={form.icon || "bi bi-tag-fill"}></i>
                        </div>
                        <span
                          className={`status-badge ${form.active ? "active" : "rejected"}`}
                        >
                          {form.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <div
                          style={{
                            color: "var(--color-text-primary)",
                            fontWeight: "600",
                            fontSize: "1.1rem",
                            wordBreak: "break-word",
                          }}
                        >
                          {form.name || "Category Name"}
                        </div>
                        <div
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.85rem",
                            marginTop: "6px",
                            lineHeight: "1.4",
                            minHeight: "44px",
                            wordBreak: "break-word",
                          }}
                        >
                          {form.description || "Enter description details on the left to see preview..."}
                        </div>
                      </div>
                    </div>
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
                    borderTop: "1px solid var(--color-border)",
                  }}
                >
                  <button
                    className="btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={commit}
                    disabled={actionLoading === "commit"}
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
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
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
                className="card shadow-lg"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border)",
                  padding: "32px",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "var(--color-negative)", fontSize: "3.5rem", marginBottom: "16px" }}>
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
                    className="btn-secondary"
                    onClick={() => setDeleteConfirmOpen(false)}
                    style={{ minWidth: "110px" }}
                    disabled={actionLoading === categoryToDelete.id}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-danger"
                    onClick={confirmDelete}
                    style={{
                      minWidth: "130px",
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
