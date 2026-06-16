"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RoleGuard } from "../components";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog as apiDeleteBlog,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminTipsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tips, setTips] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 9;
  const offset = (page - 1) * limit;
  const [form, setForm] = useState({
    title: "",
    category: "general",
    image: "",
    content: "",
    author: "Admin",
    published: true,
  });
  const [mounted, setMounted] = useState(false);
  const [detailBlog, setDetailBlog] = useState(null);
  const viewDetail = (blog) => setDetailBlog(blog);
  const [imageMode, setImageMode] = useState("url"); // "url" or "upload"
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("blob:")) {
      return img;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const cleanBaseUrl = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    const cleanImgPath = img.startsWith("/") ? img : "/" + img;
    return `${cleanBaseUrl}${cleanImgPath}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBlogs(false);
      const items = Array.isArray(res) ? res : res?.data || [];
      setTips(items);
      setTotal(items.length);
    } catch (e) {
      console.error("Fetch blogs error:", e);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchBlogs();
    }
  }, [authLoading, user, fetchBlogs]);

  const openCreate = () => {
    setEditIdx(null);
    setForm({
      title: "",
      category: "general",
      image: "",
      content: "",
      author: "Admin",
      published: true,
    });
    setImageMode("url");
    setSelectedFile(null);
    setFilePreview("");
    setOpen(true);
  };

  const openEditBlog = (t) => {
    setEditIdx(t.id);
    setForm({
      title: t.title,
      category: t.category || "general",
      image: t.image || "",
      content: t.content,
      author: t.author || "Admin",
      published: t.is_published !== false,
    });
    setImageMode(t.image && !t.image.startsWith("http") ? "upload" : "url");
    setSelectedFile(null);
    setFilePreview(t.image || "");
    setOpen(true);
  };

  const commit = async () => {
    if (!form.title.trim() || !form.content.trim())
      return toast.error("Please enter title and content");
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("category", form.category);
      payload.append("content", form.content);
      payload.append("author", form.author);
      payload.append("is_published", form.published ? "1" : "0");

      if (imageMode === "upload") {
        if (selectedFile) {
          payload.append("image", selectedFile);
        } else {
          payload.append("image", form.image || "");
        }
      } else {
        payload.append("image", form.image || "");
      }

      if (editIdx) {
        payload.append("_method", "PUT");
        await updateBlog(editIdx, payload);
        toast.success("Updated successfully");
      } else {
        await createBlog(payload);
        toast.success("Created successfully");
      }
      await fetchBlogs();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const deleteTip = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await apiDeleteBlog(deleteTarget.id);
      toast.success("Deleted successfully");
      await fetchBlogs();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Blogs & Tips</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px", marginBottom: 0 }}>
            Only admins can post tips
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i> Create Tip
        </button>
      </div>

      <div className={user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""}>
        {error && (
          <div className="card" style={{ color: "var(--color-negative)", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div className="card-header" style={{ marginBottom: "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="card-title" style={{ margin: 0 }}>Blogs & Tips list</div>
              <button className="card-menu-btn" style={{ background: "none", border: "none" }}>
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
          </div>

          {loading && (
            <div style={{ padding: "30px 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite", fontSize: "1.25rem" }}></i>
                Loading blogs...
              </div>
            </div>
          )}

          {!loading && !tips.length ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              No blogs found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table" style={{ width: "100%", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "30%", minWidth: "250px" }}>Title</th>
                    <th style={{ width: "12%", minWidth: "110px" }}>Category</th>
                    <th style={{ width: "12%", minWidth: "120px" }}>Status</th>
                    <th style={{ width: "16%", minWidth: "140px" }}>Author</th>
                    <th style={{ width: "15%", minWidth: "120px" }}>Created At</th>
                    <th style={{ width: "15%", minWidth: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tips.slice(offset, offset + limit).map((t, idx) => (
                    <tr key={`${t.title}-${idx}`}>
                      <td style={{ verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          {t.image ? (
                            <img
                              src={resolveImageUrl(t.image)}
                              alt=""
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div
                              className="avatar"
                              style={{
                                width: "48px",
                                height: "48px",
                                fontSize: "1rem",
                                borderRadius: "8px",
                                background: "var(--color-bg-input)",
                                border: "1px solid var(--color-border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                              }}
                            >
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0, flexGrow: 1 }}>
                            <div
                              style={{
                                color: "var(--color-text-primary)",
                                fontWeight: "600",
                                fontSize: "0.9375rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                              title={t.title}
                            >
                              {t.title}
                            </div>
                            <div
                              style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "0.8125rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                              title={t.content}
                            >
                              {t.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className={`category-badge ${t.category || "general"}`}>
                          {t.category || "General"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span className={`status-badge-custom ${t.is_published ? "active" : "pending"}`}>
                          {t.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                        {t.author || "Admin"}
                      </td>
                      <td style={{ verticalAlign: "middle", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                        {t.created_at ? new Date(t.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            className="btn-secondary"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => viewDetail(t)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn-secondary"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => openEditBlog(t)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-danger"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "var(--radius-sm)",
                            }}
                            onClick={() => setDeleteTarget(t)}
                            title="Delete"
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px" }}>
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total: <strong style={{ color: "var(--color-text-primary)" }}>{total}</strong>
            {loading && (
              <span className="ms-2">
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
              </span>
            )}
          </small>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span className="status-badge active" style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
              {page}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total || loading}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {open && (
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
              onClick={() => setOpen(false)}
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
                className="card border-0 shadow-lg overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "620px",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border)",
                  borderRadius: "16px",
                  color: "var(--color-text-primary)",
                  pointerEvents: "auto",
                }}
              >
                <div
                  className="card-header p-4 text-white d-flex align-items-center justify-content-between"
                  style={{
                    background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
                    borderBottom: "none",
                    flexShrink: 0,
                  }}
                >
                  <h3 className="card-title mb-0 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem", fontWeight: "600", color: "#FFFFFF" }}>
                    <i className="bi bi-pencil-square fs-5"></i>
                    {editIdx !== null ? "Edit Tip & Blog" : "Create New Tip & Blog"}
                  </h3>
                  <button
                    className="btn-close-custom"
                    onClick={() => setOpen(false)}
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div 
                  className="modal-body p-4" 
                  style={{ 
                    overflowY: "auto", 
                    flexGrow: 1, 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "16px" 
                  }}
                >
                  {/* Title */}
                  <div>
                    <label className="form-label fw-bold">Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="e.g. How to Start Your Volunteering Journey"
                    />
                  </div>

                  <div className="row g-3">
                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Category</label>
                      <select
                        className="filter-select w-100"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="general">General</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="safety">Safety</option>
                        <option value="community">Community</option>
                      </select>
                    </div>

                    {/* Author */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Author</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Image Input Selection */}
                  <div>
                    <label className="form-label fw-bold">Featured Image</label>
                    <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: "12px", gap: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        style={{
                          background: "none",
                          border: "none",
                          borderBottom: imageMode === "url" ? "2px solid var(--color-accent)" : "2px solid transparent",
                          color: imageMode === "url" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          padding: "8px 4px",
                          fontSize: "0.8125rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        style={{
                          background: "none",
                          border: "none",
                          borderBottom: imageMode === "upload" ? "2px solid var(--color-accent)" : "2px solid transparent",
                          color: imageMode === "upload" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          padding: "8px 4px",
                          fontSize: "0.8125rem",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Upload Image File
                      </button>
                    </div>

                    {imageMode === "url" ? (
                      <input
                        type="url"
                        className="form-input"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <input
                          type="file"
                          accept="image/*"
                          id="blogImageFile"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedFile(file);
                              setFilePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <label
                          htmlFor="blogImageFile"
                          className="dropzone-label"
                        >
                          <i className="bi bi-cloud-arrow-up fs-2 mb-2" style={{ color: "var(--color-accent)" }}></i>
                          <span style={{ fontSize: "0.8125rem", fontWeight: "600", textAlign: "center" }}>
                            {selectedFile ? selectedFile.name : "Click to select or drag image file here"}
                          </span>
                          <span style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                            PNG, JPG, GIF up to 4MB
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Image Preview Block */}
                    {((imageMode === "url" && form.image) || (imageMode === "upload" && (filePreview || selectedFile))) && (
                      <div className="img-preview-container">
                        <img
                          src={imageMode === "url" ? resolveImageUrl(form.image) : (selectedFile ? filePreview : resolveImageUrl(filePreview))}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          className="remove-preview-btn"
                          onClick={() => {
                            if (imageMode === "url") {
                              setForm({ ...form, image: "" });
                            } else {
                              setSelectedFile(null);
                              setFilePreview("");
                            }
                          }}
                          title="Remove image"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="form-label fw-bold">Content *</label>
                    <textarea
                      className="form-input text-area-modern"
                      rows={6}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      required
                      placeholder="Write your blog content here..."
                      style={{ resize: "vertical", minHeight: "120px" }}
                    ></textarea>
                  </div>

                  {/* Publish immediately */}
                  <div style={{ marginTop: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        id="tipPublished"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "var(--color-accent)",
                          cursor: "pointer",
                        }}
                      />
                      <label
                        htmlFor="tipPublished"
                        style={{
                          color: "var(--color-text-primary)",
                          fontSize: "0.875rem",
                          userSelect: "none",
                          cursor: "pointer",
                          margin: 0
                        }}
                      >
                        Publish immediately
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className="modal-footer p-4 border-0 d-flex justify-content-end gap-2"
                  style={{
                    flexShrink: 0,
                    borderTop: "1px solid var(--color-border) !important",
                    backgroundColor: "var(--color-bg-surface)",
                  }}
                >
                  <button
                    className="btn-secondary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={commit}
                    disabled={loading}
                  >
                    <i className="bi bi-check-lg me-2"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {detailBlog && (
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
            onClick={() => setDetailBlog(null)}
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
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                background: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                pointerEvents: "auto",
              }}
            >
              <div
                className="card-header p-4 text-white d-flex align-items-center justify-content-between"
                style={{
                  background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
                  borderBottom: "none",
                  flexShrink: 0,
                }}
              >
                <div className="card-title fw-bold fs-5 mb-0" style={{ color: "#FFFFFF" }}>
                  Blog Details
                </div>
                <button
                  className="btn-close-custom"
                  onClick={() => setDetailBlog(null)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div 
                className="modal-body p-4" 
                style={{ 
                  overflowY: "auto", 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "16px" 
                }}
              >
                {detailBlog.image && (
                  <div style={{ width: "100%", height: "240px", position: "relative", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={resolveImageUrl(detailBlog.image)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div className="d-flex gap-2">
                  <span className={`category-badge ${detailBlog.category || "general"}`}>
                    {detailBlog.category || "General"}
                  </span>
                  <span className={`status-badge-custom ${detailBlog.is_published ? "active" : "pending"}`}>
                    {detailBlog.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div>
                  <h3 className="fw-bold" style={{ fontSize: "1.35rem", lineHeight: "1.4", margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>
                    {detailBlog.title}
                  </h3>
                  <div className="d-flex align-items-center gap-3" style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    <span><i className="bi bi-person me-1"></i> {detailBlog.author || "Admin"}</span>
                    <span>•</span>
                    <span><i className="bi bi-calendar3 me-1"></i> {detailBlog.created_at ? new Date(detailBlog.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "14.5px",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "16px",
                  }}
                >
                  {detailBlog.content}
                </div>
              </div>

              <div
                className="modal-footer p-4 border-0 d-flex justify-content-end gap-2"
                style={{
                  flexShrink: 0,
                  borderTop: "1px solid var(--color-border) !important",
                  backgroundColor: "var(--color-bg-surface)",
                }}
              >
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDetailBlog(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setDetailBlog(null);
                    openEditBlog(detailBlog);
                  }}
                >
                  <i className="bi bi-pencil-fill me-1"></i> Edit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
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
              zIndex: 1060,
            }}
            onClick={() => setDeleteTarget(null)}
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
              pointerEvents: "none",
            }}
          >
            <div
              className="card shadow-lg animate-in fade-in zoom-in-95 duration-200"
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                padding: "28px 24px 24px 24px",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 77, 77, 0.12)",
                  border: "1px solid rgba(255, 77, 77, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-negative)",
                  fontSize: "1.5rem",
                  marginBottom: "16px",
                }}
              >
                <i className="bi bi-exclamation-triangle"></i>
              </div>

              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "var(--color-text-primary)",
                }}
              >
                Delete Blog & Tip
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.5",
                  margin: "0 0 24px 0",
                }}
              >
                Are you sure you want to delete <strong style={{ color: "var(--color-text-primary)" }}>{deleteTarget.title}</strong>? This action cannot be undone.
              </p>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "12px",
                }}
              >
                <button
                  className="btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius-btn)",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTip}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius-btn)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "var(--color-negative)",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {loading ? (
                    <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
                  ) : (
                    <i className="bi bi-trash"></i>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .btn-close-custom {
          background: transparent;
          border: none;
          color: white;
          opacity: 0.8;
          font-size: 1.15rem;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .btn-close-custom:hover {
          opacity: 1;
          transform: rotate(90deg);
        }
        
        .form-label {
          color: var(--color-text-secondary);
          font-size: 12.5px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          width: 100%;
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 0.875rem;
          color: var(--color-text-primary) !important;
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: var(--color-accent) !important;
          outline: none;
          box-shadow: 0 0 0 3px var(--color-accent-dim) !important;
        }
        
        .filter-select {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-btn) !important;
          color: var(--color-text-primary) !important;
          padding: 8px 32px 8px 16px !important;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>") !important;
          background-position: right 10px center !important;
          background-repeat: no-repeat !important;
        }
        .filter-select:focus {
          border-color: var(--color-accent) !important;
          outline: none;
        }
        
        .text-area-modern {
          resize: vertical;
          line-height: 1.5;
        }
        
        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          border: 2px dashed var(--color-border);
          border-radius: 10px;
          cursor: pointer;
          background: var(--color-bg-input);
          transition: all 0.2s ease;
          color: var(--color-text-secondary);
        }
        .dropzone-label:hover {
          border-color: var(--color-accent);
          background-color: var(--color-bg-card-hover);
        }
        
        .img-preview-container {
          margin-top: 12px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          height: 140px;
          position: relative;
          background: var(--color-bg-base);
        }
        
        .remove-preview-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.6);
          border: none;
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .remove-preview-btn:hover {
          background: var(--color-negative);
          transform: scale(1.05);
        }
        


        
        /* Badges */
        .category-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          white-space: nowrap;
          display: inline-block;
        }
        .category-badge.volunteer {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
        .category-badge.safety {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.2) !important;
        }
        .category-badge.community {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.2) !important;
        }
        
        .status-badge-custom {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
        }
        .status-badge-custom.active {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .status-badge-custom.pending {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
        }
        
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }
        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: var(--color-border-hover);
        }
      `}</style>
    </div>
  );
}
