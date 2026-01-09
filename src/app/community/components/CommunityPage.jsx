"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { storage } from "@/app/admin/components";

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setMounted(true);
    const data = storage.read("communityPosts", []);
    // Only show approved and public posts
    const publicPosts = data.filter(
      (p) => p.status === "approved" && p.visibility === "public"
    );
    queueMicrotask(() => setPosts(publicPosts));
  }, []);

  const filtered = posts.filter((p) => {
    const matchCategory = filter === "all" || p.category === filter;
    const matchSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleKh.includes(searchTerm) ||
      p.organizerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleLike = (postId) => {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    );
    setPosts(updated);
    // Update in storage
    const allPosts = storage.read("communityPosts", []);
    const updatedAll = allPosts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    );
    storage.write("communityPosts", updatedAll);
  };

  if (!mounted) return null;

  return (
    <main className="flex-grow-1" style={{ marginTop: 130 }}>
      <div className="container py-4">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3">សហគមន៍ស្ម័គ្រចិត្ត</h1>
          <p className="lead text-muted">
            ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍ស្ម័គ្រចិត្ត និងចែករំលែកបទពិសោធន៍
          </p>
        </div>

        {/* Filter & Search */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">ប្រភេទ</label>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">ទាំងអស់</option>
                  <option value="update">Updates</option>
                  <option value="event">Events</option>
                  <option value="discussion">Discussions</option>
                  <option value="story">Stories</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label">ស្វែងរក</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ស្វែងរកប្រកាស..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-3">មិនមានប្រកាស</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((post) => (
              <div key={post.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40 }}
                        >
                          <i className="bi bi-building text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold small">
                            {post.organizerName}
                          </div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            {post.createdAt}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          post.category === "update"
                            ? "bg-info"
                            : post.category === "event"
                              ? "bg-success"
                              : post.category === "discussion"
                                ? "bg-warning"
                                : "bg-primary"
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <h5 className="card-title mb-2">{post.title}</h5>
                    <h6 className="card-subtitle text-muted mb-3">
                      {post.titleKh}
                    </h6>
                    <p className="card-text">
                      {post.content.substring(0, 120)}
                      {post.content.length > 120 && "..."}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-3">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="badge bg-light text-dark me-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="d-flex gap-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleLike(post.id)}
                        >
                          <i className="bi bi-heart me-1"></i>
                          {post.likes}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-chat me-1"></i>
                          {post.comments}
                        </button>
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedPost(post)}
                      >
                        អានបន្ថែម
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title mb-1">{selectedPost.title}</h5>
                  <p className="text-muted mb-0 small">
                    {selectedPost.titleKh}
                  </p>
                </div>
                <button
                  className="btn-close"
                  onClick={() => setSelectedPost(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Author Info */}
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <i className="bi bi-building text-white fs-5"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {selectedPost.organizerName}
                    </div>
                    <div className="text-muted small">
                      {selectedPost.createdAt}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      selectedPost.category === "update"
                        ? "bg-info"
                        : selectedPost.category === "event"
                          ? "bg-success"
                          : selectedPost.category === "discussion"
                            ? "bg-warning"
                            : "bg-primary"
                    }`}
                  >
                    {selectedPost.category}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="mb-3">{selectedPost.content}</p>
                  <p className="text-muted">{selectedPost.contentKh}</p>
                </div>

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mb-4">
                    {selectedPost.tags.map((tag, i) => (
                      <span key={i} className="badge bg-light text-dark me-2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactions */}
                <div className="d-flex gap-2 pt-3 border-top">
                  <button
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleLike(selectedPost.id)}
                  >
                    <i className="bi bi-heart me-2"></i>
                    ចូលចិត្ត ({selectedPost.likes})
                  </button>
                  <button className="btn btn-outline-secondary flex-grow-1">
                    <i className="bi bi-chat me-2"></i>
                    មតិយោបល់ ({selectedPost.comments})
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="bi bi-share"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </main>
  );
}
