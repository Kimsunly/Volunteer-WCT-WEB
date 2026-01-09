"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { storage } from "@/app/admin/components";

export default function OrganizerCommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    title: "",
    titleKh: "",
    content: "",
    contentKh: "",
    category: "update",
    visibility: "public",
    tags: "",
  });

  useEffect(() => {
    setMounted(true);
    const data = storage.read("communityPosts", []);
    // Filter to show only current organizer's posts (mock: organizerId 2)
    const orgId = 2; // TODO: Get from auth context
    queueMicrotask(() => setPosts(data.filter((p) => p.organizerId === orgId)));
  }, []);

  const save = (next) => {
    const allPosts = storage.read("communityPosts", []);
    const otherPosts = allPosts.filter((p) => p.organizerId !== 2);
    const updated = [...otherPosts, ...next];
    storage.write("communityPosts", updated);
    setPosts(next);
  };

  const openCreate = () => {
    setEditIdx(null);
    setForm({
      title: "",
      titleKh: "",
      content: "",
      contentKh: "",
      category: "update",
      visibility: "public",
      tags: "",
    });
    setModalOpen(true);
  };

  const openEdit = (idx) => {
    const p = posts[idx];
    setEditIdx(idx);
    setForm({
      title: p.title,
      titleKh: p.titleKh,
      content: p.content,
      contentKh: p.contentKh,
      category: p.category,
      visibility: p.visibility,
      tags: p.tags.join(", "),
    });
    setModalOpen(true);
  };

  const deletePost = (idx) => {
    if (!confirm("លុបប្រកាសនេះ?")) return;
    const next = posts.filter((_, i) => i !== idx);
    save(next);
  };

  const commit = () => {
    if (!form.title || !form.content) {
      alert("សូមបំពេញចំណងជើង និងមាតិកា");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editIdx !== null) {
      const next = posts.map((p, i) =>
        i === editIdx
          ? {
              ...p,
              ...form,
              tags,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : p
      );
      save(next);
    } else {
      const newPost = {
        id: Date.now(),
        organizerId: 2,
        organizerName: "Green Cambodia",
        title: form.title,
        titleKh: form.titleKh,
        content: form.content,
        contentKh: form.contentKh,
        category: form.category,
        visibility: form.visibility,
        images: [],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "pending",
        tags,
      };
      save([...posts, newPost]);
    }

    setModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <main className="flex-grow-1" style={{ marginTop: 130 }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">គ្រប់គ្រងសហគមន៍</h2>
            <p className="text-muted mb-0">
              បង្កើត និងគ្រប់គ្រងប្រកាសសហគមន៍របស់អង្គការ
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <i className="bi bi-plus-circle me-2"></i>
            បង្កើតប្រកាសថ្មី
          </button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">ប្រកាសទាំងអស់</h6>
                    <h3 className="mb-0">{posts.length}</h3>
                  </div>
                  <i className="bi bi-chat-square-text fs-1 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">រង់ចាំអនុម័ត</h6>
                    <h3 className="mb-0">
                      {posts.filter((p) => p.status === "pending").length}
                    </h3>
                  </div>
                  <i className="bi bi-clock-history fs-1 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">ប្រកាសសកម្ម</h6>
                    <h3 className="mb-0">
                      {posts.filter((p) => p.status === "approved").length}
                    </h3>
                  </div>
                  <i className="bi bi-check-circle fs-1 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">ប្រកាសសហគមន៍របស់ខ្ញុំ</h5>
          </div>
          <div className="card-body">
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted"></i>
                <p className="text-muted mt-3">មិនទាន់មានប្រកាស</p>
                <button className="btn btn-primary" onClick={openCreate}>
                  បង្កើតប្រកាសដំបូង
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {posts.map((p, i) => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span
                            className={`badge ${
                              p.category === "update"
                                ? "bg-info"
                                : p.category === "event"
                                  ? "bg-success"
                                  : "bg-secondary"
                            }`}
                          >
                            {p.category}
                          </span>
                          <span
                            className={`badge ${
                              p.status === "approved"
                                ? "bg-success"
                                : p.status === "pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <h6 className="card-title">{p.title}</h6>
                        <p className="card-text small text-muted">
                          {p.titleKh}
                        </p>
                        <p className="card-text small">
                          {p.content.substring(0, 100)}
                          {p.content.length > 100 && "..."}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <small className="text-muted">{p.createdAt}</small>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => openEdit(i)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deletePost(i)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            <i className="bi bi-heart me-1"></i>
                            {p.likes}
                            <i className="bi bi-chat ms-3 me-1"></i>
                            {p.comments}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editIdx !== null ? "កែប្រែប្រកាសសហគមន៍" : "បង្កើតប្រកាសថ្មី"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">ចំណងជើង (English)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Title"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ចំណងជើង (ខ្មែរ)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.titleKh}
                      onChange={(e) =>
                        setForm({ ...form, titleKh: e.target.value })
                      }
                      placeholder="ចំណងជើង"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">មាតិកា (English)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      placeholder="Content"
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">មាតិកា (ខ្មែរ)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={form.contentKh}
                      onChange={(e) =>
                        setForm({ ...form, contentKh: e.target.value })
                      }
                      placeholder="មាតិកា"
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ប្រភេទ</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option value="update">Update</option>
                      <option value="event">Event</option>
                      <option value="discussion">Discussion</option>
                      <option value="story">Story</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ភាពមើលឃើញ</label>
                    <select
                      className="form-select"
                      value={form.visibility}
                      onChange={(e) =>
                        setForm({ ...form, visibility: e.target.value })
                      }
                    >
                      <option value="public">Public</option>
                      <option value="members">Members Only</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.tags}
                      onChange={(e) =>
                        setForm({ ...form, tags: e.target.value })
                      }
                      placeholder="tag1, tag2"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  បោះបង់
                </button>
                <button className="btn btn-primary" onClick={commit}>
                  រក្សាទុក
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
