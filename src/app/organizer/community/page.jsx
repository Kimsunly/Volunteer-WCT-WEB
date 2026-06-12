"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { storage } from "@/app/admin/components";
import DeleteCommunityPostModal from "@/components/modals/DeleteCommunityPostModal";
import OrganizerCommunityPostDetailModal from "@/components/modals/OrganizerCommunityPostDetailModal";
import OrganizerCommunityPostFormModal from "@/components/modals/OrganizerCommunityPostFormModal";

export default function OrganizerCommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    title: "",
    titleKh: "",
    content: "",
    contentKh: "",
    category: "discussion",
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
    setSelectedPost(null);
    setEditIdx(null);
    setForm({
      title: "",
      titleKh: "",
      content: "",
      contentKh: "",
      category: "discussion",
      visibility: "public",
      tags: "",
    });
    setModalOpen(true);
  };

  const openDetail = (post) => {
    setSelectedPost(post);
  };

  const openEdit = (idx) => {
    setSelectedPost(null);
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

  const openDelete = (post) => {
    setSelectedPost(null);
    setDeleteTarget(post);
    setDeleteModalOpen(true);
  };

  const deletePost = () => {
    if (!deleteTarget) return;
    const next = posts.filter((p) => p.id !== deleteTarget.id);
    save(next);
    if (selectedPost?.id === deleteTarget.id) {
      setSelectedPost(null);
    }
    setDeleteModalOpen(false);
    setDeleteTarget(null);
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
          : p,
      );
      save(next);
      const updated = next[editIdx];
      if (selectedPost?.id === updated.id) {
        setSelectedPost(updated);
      }
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
      setSelectedPost(newPost);
    }

    setModalOpen(false);
    setEditIdx(null);
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
                    <div
                      className="card h-100 shadow-sm border-0"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetail(p)}
                    >
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
                          <div
                            className="btn-group btn-group-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="btn btn-outline-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(p);
                              }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(i);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDelete(p);
                              }}
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

      <OrganizerCommunityPostDetailModal
        open={Boolean(selectedPost)}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onEdit={() => {
          if (!selectedPost) return;
          const idx = posts.findIndex((p) => p.id === selectedPost.id);
          if (idx >= 0) {
            openEdit(idx);
          }
        }}
        onDelete={() => {
          if (!selectedPost) return;
          openDelete(selectedPost);
        }}
      />

      <OrganizerCommunityPostFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIdx(null);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          commit();
        }}
        editMode={editIdx !== null}
        form={form}
        setForm={setForm}
      />

      <DeleteCommunityPostModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={deletePost}
        postTitle={deleteTarget?.title}
        postAuthor={deleteTarget?.organizerName}
        commentCount={deleteTarget?.comments || 0}
      />
    </main>
  );
}
