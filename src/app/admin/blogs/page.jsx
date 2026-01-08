"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminTipsPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [tips, setTips] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "general",
    image: "",
    content: "",
    author: "Admin",
    published: true,
  });

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    const data = storage.read("tips", []);
    queueMicrotask(() => setTips(data));
  }, []);

  const save = (next) => {
    setTips(next);
    storage.write("tips", next);
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

  const openEdit = (idx) => {
    const t = tips[idx];
    setEditIdx(idx);
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

  const commit = () => {
    if (!form.title.trim() || !form.content.trim())
      return alert("សូមបំពេញចំណងជើង និង ខ្លឹមសារ");
    const next = [...tips];
    const payload = { ...form, createdAt: new Date().toLocaleDateString() };
    if (editIdx !== null) next[editIdx] = { ...next[editIdx], ...payload };
    else next.push(payload);
    save(next);
    setOpen(false);
  };

  const deleteTip = (idx) => {
    if (!confirm("លុបគន្លឹះនេះ?")) return;
    const next = tips.filter((_, i) => i !== idx);
    save(next);
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="គន្លឹះ & ប្លុក"
        subtitle="Only admins can post tips"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="tips" />

          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="គន្លឹះ & ប្លុក"
              subtitle="Only admins can post tips"
              actions={
                <button className="btn btn-primary pill" onClick={openCreate}>
                  <i className="bi bi-plus-circle me-1"></i> បង្កើតគន្លឹះថ្មី
                </button>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              <div className="row g-3" id="tipsGrid">
                {!tips.length ? (
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
                            onClick={() => openEdit(idx)}
                          >
                            <i className="bi bi-pencil"></i> កែសម្រួល
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger pill"
                            onClick={() => deleteTip(idx)}
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
              {open && (
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="modal-backdrop fade show"
                    onClick={() => setOpen(false)}
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
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
