"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageHeader, RoleGuard, storage } from "../components";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog as apiDeleteBlog,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Skeleton from "@/components/common/Skeleton";
import LoadingButton from "@/components/common/LoadingButton";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBlogs(false); // publishedOnly = false for admin
      // The backend returns a list directly or a paginated object. 
      // Based on my service: export async function listBlogs(publishedOnly = false) { return data; }
      const items = Array.isArray(res) ? res : res?.data || [];
      setTips(items);
      setTotal(items.length);
    } catch (e) {
      console.error("Fetch blogs error:", e);
      setError("បរាជ័យក្នុងការទាញយកប្លុក");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchBlogs();
    }
  }, [authLoading, user, fetchBlogs]);

  const save = (next) => {
    setTips(next);
  };

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
      published: t.published !== false,
    });
    setOpen(true);
  };

  const commit = async () => {
    if (!form.title.trim() || !form.content.trim())
      return toast.error("សូមបំពេញចំណងជើង និង ខ្លឹមសារ");
    setLoading(true);
    try {
      if (editIdx) {
        await updateBlog(editIdx, form);
        toast.success("បានកែសម្រួលដោយជោគជ័យ");
      } else {
        await createBlog(form);
        toast.success("បានបង្កើតដោយជោគជ័យ");
      }
      await fetchBlogs();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("បរាជ័យក្នុងការរក្សាទុក");
    } finally {
      setLoading(false);
    }
  };

  const deleteTip = async (id) => {
    if (!confirm("លុបគន្លឹះនេះ?")) return;
    setLoading(true);
    try {
      await apiDeleteBlog(id);
      toast.success("បានលុបដោយជោគជ័យ");
      await fetchBlogs();
    } catch (e) {
      console.error(e);
      toast.error("បរាជ័យក្នុងការលុប");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>`n      <RoleGuard />

      <PageHeader
        title="គន្លឹះ & ប្លុក"
        subtitle="Only admins can post tips"
        actions={
          <button className="btn btn-primary pill" onClick={openCreate}>
            <i className="bi bi-plus-circle me-1"></i> បង្កើតគន្លឹះថ្មី
          </button>
        }
      />

      <div className={user?.role !== "admin" ? "opacity-50 pe-none" : ""}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="row g-3" id="tipsGrid">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <Skeleton variant="card" />
              </div>
            ))
          ) : !tips.length ? (
            <div className="col-12 text-center text-muted py-5">
              មិនទាន់មានគន្លឹះ។ សូមបង្កើតគន្លឹះថ្មី។
            </div>
          ) : (
            tips.map((t, idx) => (
              <div
                className="col-md-6 col-lg-4"
                key={`${t.title}-${idx}`}
              >
                <div className="tip-card">
                  {t.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image}
                      alt=""
                      className="img-fluid rounded mb-2"
                      style={{
                        height: 150,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <span className="badge bg-secondary">
                      {t.category || "General"}
                    </span>
                    <span
                      className={`badge ${t.published ? "bg-success" : "bg-warning"}`}
                    >
                      {t.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h6 className="mb-1">{t.title}</h6>
                  <p className="text-muted small mb-2">
                    {t.content.substring(0, 100)}
                    {t.content.length > 100 ? "..." : ""}
                  </p>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                    <i className="bi bi-person"></i> {t.author || "Admin"}
                    <span>•</span>
                    <i className="bi bi-clock"></i>{" "}
                    {t.createdAt || new Date().toLocaleDateString()}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary pill flex-fill"
                      onClick={() => openEditBlog(t)}
                    >
                      <i className="bi bi-pencil"></i> កែសម្រួល
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger pill"
                      onClick={() => deleteTip(t.id)}
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

        {/* Modal */}
        {open && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1040 }}
              onClick={() => setOpen(false)}
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
                    <h5 className="modal-title">
                      {editIdx !== null
                        ? "កែសម្រួលគន្លឹះ"
                        : "បង្កើតគន្លឹះថ្មី"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">ចំណងជើង *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ប្រភេទ</label>
                        <select
                          className="form-select"
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                        >
                          <option value="general">General</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="safety">Safety</option>
                          <option value="community">Community</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">រូបភាព URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={form.image}
                          onChange={(e) =>
                            setForm({ ...form, image: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ខ្លឹមសារ *</label>
                        <textarea
                          className="form-control"
                          rows={8}
                          value={form.content}
                          onChange={(e) =>
                            setForm({ ...form, content: e.target.value })
                          }
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">អ្នកនិពន្ធ</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.author}
                          onChange={(e) =>
                            setForm({ ...form, author: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="tipPublished"
                          checked={form.published}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              published: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="tipPublished"
                        >
                          បោះពុម្ពផ្សាយភ្លាម
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
                      onClick={() => setOpen(false)}
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
          </>
        )}
      </div>
    </>
  );
}
