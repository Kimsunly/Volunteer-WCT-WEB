"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RoleGuard } from "../components";
import {
  listModerationPosts,
  approveCommunityPost,
  rejectCommunityPost,
  deleteCommunityPost as apiDeleteCommunityPost,
  createAdminCommunityPost,
  updatePost,
} from "@/services/community";
import { getComments } from "@/services/comments";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import DeleteCommunityPostModal from "@/components/modals/DeleteCommunityPostModal";

export default function AdminCommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected
  const [detail, setDetail] = useState(null);
  const [showLikesList, setShowLikesList] = useState(false);
  const [showCommentsList, setShowCommentsList] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const commentsCount = commentsList.length;

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    content: "",
    category: "discussion",
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit Modal State
  const [editPost, setEditPost] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    category: "discussion",
  });
  const [editLoading, setEditLoading] = useState(false);

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const cleanBaseUrl = apiBaseUrl.endsWith("/")
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;
    const cleanImgPath = img.startsWith("/") ? img : "/" + img;
    return `${cleanBaseUrl}${cleanImgPath}`;
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listModerationPosts({
        status: filter === "all" ? null : filter,
        limit,
        offset,
      });
      setPosts(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [filter, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchPosts();
    }
  }, [authLoading, user, fetchPosts]);

  const fetchComments = async (postId) => {
    setCommentsLoading(true);
    try {
      const res = await getComments("post", postId);
      if (res && res.success) {
        setCommentsList(res.data || []);
      } else {
        setCommentsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setCommentsList([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const viewDetail = (p) => {
    setDetail(p);
    setShowLikesList(false);
    setShowCommentsList(false);
    setCommentsList([]);
    if (p) {
      fetchComments(p.id);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Approve this post?")) return;
    try {
      await approveCommunityPost(id);
      toast.success("Post approved successfully");
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve post");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejecting this post:");
    if (!reason) return;
    try {
      await rejectCommunityPost(id, reason);
      toast.success("Post rejected successfully");
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject post");
    }
  };

  const openDeleteModal = (post) => {
    setDeleteTarget(post);
    setDeletePostModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDeleteCommunityPost(deleteTarget.id);
      toast.success("Post deleted successfully");
      setDeletePostModalOpen(false);
      setDeleteTarget(null);
      fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete post");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await createAdminCommunityPost(createData);
      toast.success("Post created successfully");
      setShowCreateModal(false);
      setCreateData({ title: "", content: "", category: "discussion" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (p) => {
    setEditPost(p);
    setEditData({
      title: p.title,
      category: p.category || "discussion",
      content: p.content || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editPost) return;
    setEditLoading(true);
    try {
      await updatePost(editPost.id, editData);
      toast.success("Post updated successfully");
      setEditPost(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Management</h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              marginTop: "4px",
            }}
          >
            Approve, reject, and manage community posts
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i> Create Post
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          background: "var(--color-bg-input)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          width: "max-content",
          gap: "4px",
          marginBottom: "24px",
        }}
      >
        {[
          { key: "all", label: "All Posts", icon: "bi-grid-fill" },
          { key: "pending", label: "Pending", icon: "bi-clock-fill" },
          { key: "approved", label: "Approved", icon: "bi-check-circle-fill" },
          { key: "rejected", label: "Rejected", icon: "bi-x-circle-fill" },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setPage(1);
                setFilter(tab.key);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                background: isActive ? "var(--color-accent)" : "transparent",
                color: isActive ? "#000000" : "var(--color-text-secondary)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-text-primary)";
                  e.currentTarget.style.background =
                    "var(--color-bg-card-hover)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <i className={`bi ${tab.icon}`} style={{ fontSize: "1rem" }}></i>
              {tab.label}
            </button>
          );
        })}
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
          <div className="table-wrapper">
            <table
              className="data-table"
              style={{ width: "100%", tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "42%", minWidth: "300px" }}>Title</th>
                  <th style={{ width: "20%", minWidth: "160px" }}>Author</th>
                  <th style={{ width: "12%", minWidth: "110px" }}>Category</th>
                  <th style={{ width: "12%", minWidth: "100px" }}>Date</th>
                  <th style={{ width: "10%", minWidth: "90px" }}>Status</th>
                  <th style={{ width: "14%", minWidth: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "40px 20px" }}
                    >
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
                        <i
                          className="bi bi-arrow-repeat"
                          style={{
                            animation: "spin 1s linear infinite",
                            fontSize: "1.25rem",
                          }}
                        ></i>
                        Loading posts...
                      </div>
                    </td>
                  </tr>
                ) : !posts.length ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8"
                      style={{
                        color: "var(--color-text-muted)",
                        padding: "40px 20px",
                      }}
                    >
                      No posts found
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id}>
                      <td style={{ verticalAlign: "middle" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          {p.image_url ? (
                            <img
                              src={resolveImageUrl(p.image_url)}
                              alt=""
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                flexShrink: 0,
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
                                flexShrink: 0,
                              }}
                            >
                              <i className="bi bi-chat-left-text text-muted"></i>
                            </div>
                          )}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              minWidth: 0,
                              flexGrow: 1,
                            }}
                          >
                            <div
                              style={{
                                color: "var(--color-text-primary)",
                                fontWeight: "600",
                                fontSize: "0.9375rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={p.title}
                            >
                              {p.title}
                            </div>
                            <div
                              style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "0.8125rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={p.content}
                            >
                              {p.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            className="avatar avatar-purple"
                            style={{
                              width: "32px",
                              height: "32px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              flexShrink: 0,
                            }}
                          >
                            {(p.author?.name || p.user?.name || "U")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: 0,
                              flexGrow: 1,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                fontSize: "0.875rem",
                                color: "var(--color-text-primary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={
                                p.author?.name || p.user?.name || "Unknown"
                              }
                            >
                              {p.author?.name || p.user?.name || "Unknown"}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--color-text-muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={p.author?.role || p.user?.role || "User"}
                            >
                              {p.author?.role || p.user?.role || "User"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span
                          className="status-badge"
                          style={{
                            background: "var(--color-bg-input)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-primary)",
                            fontSize: "0.75rem",
                            textTransform: "capitalize",
                            padding: "4px 10px",
                          }}
                        >
                          {p.category || "Discussion"}
                        </span>
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                          color: "var(--color-text-secondary)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {new Date(p.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span
                          className={`status-badge ${p.status === "approved" || p.status === "published" || p.is_published ? "active" : p.status === "pending" ? "pending" : "rejected"}`}
                          style={{ padding: "4px 10px" }}
                        >
                          {p.status === "approved" ||
                          p.status === "published" ||
                          p.is_published
                            ? "Approved"
                            : p.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
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
                            onClick={() => viewDetail(p)}
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
                            onClick={() => openEdit(p)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {p.status === "pending" && (
                            <>
                              <button
                                className="btn-primary"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  padding: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "var(--radius-sm)",
                                }}
                                onClick={() => handleApprove(p.id)}
                                title="Approve"
                              >
                                <i className="bi bi-check-lg"></i>
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
                                onClick={() => handleReject(p.id)}
                                title="Reject"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </>
                          )}
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
                              backgroundColor: "rgba(255, 77, 77, 0.08)",
                              borderColor: "rgba(255, 77, 77, 0.2)",
                              color: "var(--color-negative)",
                            }}
                            onClick={() => openDeleteModal(p)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span
              className="status-badge active"
              style={{
                background: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
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

        {/* Detail Modal */}
        {detail && (
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
              onClick={() => setDetail(null)}
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
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--color-bg-surface)",
                  color: "var(--color-text-primary)",
                  padding: "24px",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                  pointerEvents: "auto",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <h3
                    className="card-title"
                    style={{
                      margin: 0,
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                  >
                    Post Details
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setDetail(null)}
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {detail.image_url && (
                    <div
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        overflow: "hidden",
                        maxHeight: "250px",
                      }}
                    >
                      <img
                        src={resolveImageUrl(detail.image_url)}
                        alt={detail.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h2
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        marginBottom: "8px",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {detail.title}
                    </h2>
                    {detail.title_kh && (
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "12px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {detail.title_kh}
                      </h4>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      background: "var(--color-bg-input)",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        Author
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {detail.author?.name || detail.user?.name || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        Category
                      </span>
                      <span
                        className="status-badge"
                        style={{
                          background: "var(--color-bg-surface)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                          fontSize: "0.75rem",
                          textTransform: "capitalize",
                          padding: "4px 10px",
                        }}
                      >
                        {detail.category || "Discussion"}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        Status
                      </span>
                      <span
                        className={`status-badge ${detail.status === "approved" || detail.status === "published" || detail.is_published ? "active" : detail.status === "pending" ? "pending" : "rejected"}`}
                      >
                        {detail.status === "approved" ||
                        detail.status === "published" ||
                        detail.is_published
                          ? "Approved"
                          : detail.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        Date
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {new Date(detail.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "6px",
                      }}
                    >
                      Content
                    </span>
                    <div
                      style={{
                        background: "var(--color-bg-input)",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        minHeight: "100px",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--color-text-primary)",
                          whiteSpace: "pre-wrap",
                          margin: 0,
                          fontSize: "0.9375rem",
                          lineHeight: "1.6",
                        }}
                      >
                        {detail.content}
                      </p>
                      {(detail.content_kh || detail.contentKh) && (
                        <p
                          style={{
                            color: "var(--color-text-secondary)",
                            whiteSpace: "pre-wrap",
                            marginTop: "12px",
                            borderTop: "1px solid var(--color-border)",
                            paddingTop: "12px",
                            fontSize: "0.9375rem",
                            lineHeight: "1.6",
                          }}
                        >
                          {detail.content_kh || detail.contentKh}
                        </p>
                      )}
                    </div>
                  </div>

                  {detail.rejection_reason && (
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-negative)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "6px",
                        }}
                      >
                        Rejection Reason
                      </span>
                      <div
                        style={{
                          background: "rgba(255, 77, 77, 0.08)",
                          border: "1px solid rgba(255, 77, 77, 0.2)",
                          padding: "16px",
                          borderRadius: "12px",
                          color: "var(--color-negative)",
                          fontSize: "0.9375rem",
                          lineHeight: "1.6",
                        }}
                      >
                        {detail.rejection_reason}
                      </div>
                    </div>
                  )}

                  {/* Likes and Comments Counters (Clickable for Dynamic Expansion) */}
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      borderTop: "1px solid var(--color-border)",
                      paddingTop: "16px",
                      paddingBottom: "8px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowLikesList(!showLikesList);
                        setShowCommentsList(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--color-text-secondary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: showLikesList
                          ? "rgba(255, 77, 77, 0.08)"
                          : "transparent",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        if (!showLikesList)
                          e.currentTarget.style.backgroundColor =
                            "var(--color-bg-input)";
                      }}
                      onMouseOut={(e) => {
                        if (!showLikesList)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <i
                        className="bi bi-heart-fill"
                        style={{ color: "var(--color-negative)" }}
                      ></i>
                      <span
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: "600",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {detail.likes_count ?? 0}
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>Likes</span>
                      <i
                        className={`bi ${showLikesList ? "bi-chevron-up" : "bi-chevron-down"}`}
                        style={{ fontSize: "0.75rem", marginLeft: "4px" }}
                      ></i>
                    </button>

                    <button
                      onClick={() => {
                        setShowCommentsList(!showCommentsList);
                        setShowLikesList(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--color-text-secondary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: showCommentsList
                          ? "var(--color-accent-dim)"
                          : "transparent",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        if (!showCommentsList)
                          e.currentTarget.style.backgroundColor =
                            "var(--color-bg-input)";
                      }}
                      onMouseOut={(e) => {
                        if (!showCommentsList)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <i
                        className="bi bi-chat-fill"
                        style={{ color: "var(--color-accent)" }}
                      ></i>
                      <span
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: "600",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {commentsCount}
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>Comments</span>
                      <i
                        className={`bi ${showCommentsList ? "bi-chevron-up" : "bi-chevron-down"}`}
                        style={{ fontSize: "0.75rem", marginLeft: "4px" }}
                      ></i>
                    </button>
                  </div>

                  {/* Likes Expandable Panel */}
                  {showLikesList && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        borderTop: "1px solid var(--color-border)",
                        paddingTop: "16px",
                        marginTop: "8px",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        People Who Reacted ({detail.likes_count ?? 0})
                      </span>
                      {!detail.liked_by || detail.liked_by.length === 0 ? (
                        <div
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: "0.875rem",
                            padding: "8px 0",
                          }}
                        >
                          No likes yet
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            maxHeight: "200px",
                            overflowY: "auto",
                            paddingRight: "4px",
                          }}
                        >
                          {detail.liked_by.map((u) => (
                            <div
                              key={u.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "8px 12px",
                                background: "var(--color-bg-input)",
                                borderRadius: "8px",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              <div
                                className="avatar avatar-purple"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                }}
                              >
                                {u.avatar_url || u.avatar ? (
                                  <img
                                    src={u.avatar_url || u.avatar}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  (u.name || "U").substring(0, 1).toUpperCase()
                                )}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  minWidth: 0,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.8125rem",
                                    fontWeight: "600",
                                    color: "var(--color-text-primary)",
                                  }}
                                >
                                  {u.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    color: "var(--color-text-muted)",
                                  }}
                                >
                                  {u.email}
                                </span>
                              </div>
                              <span
                                className="status-badge"
                                style={{
                                  fontSize: "0.625rem",
                                  textTransform: "capitalize",
                                  background:
                                    u.role === "admin"
                                      ? "rgba(170, 255, 0, 0.15)"
                                      : "var(--color-bg-surface)",
                                  color:
                                    u.role === "admin"
                                      ? "var(--color-accent)"
                                      : "var(--color-text-secondary)",
                                  border: "1px solid var(--color-border)",
                                  padding: "2px 8px",
                                }}
                              >
                                {u.role || "User"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments Expandable Panel */}
                  {showCommentsList && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        borderTop: "1px solid var(--color-border)",
                        paddingTop: "16px",
                        marginTop: "8px",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        Comments list ({commentsCount})
                      </span>
                      {commentsLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--color-text-secondary)",
                            padding: "8px 0",
                          }}
                        >
                          <i
                            className="bi bi-arrow-repeat"
                            style={{
                              animation: "spin 1s linear infinite",
                              fontSize: "1rem",
                            }}
                          ></i>
                          Loading comments...
                        </div>
                      ) : !commentsList || commentsList.length === 0 ? (
                        <div
                          style={{
                            color: "var(--color-text-muted)",
                            fontSize: "0.875rem",
                            padding: "8px 0",
                          }}
                        >
                          No comments yet
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            maxHeight: "250px",
                            overflowY: "auto",
                            paddingRight: "4px",
                          }}
                        >
                          {commentsList.map((c) => (
                            <div
                              key={c.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                padding: "10px",
                                background: "var(--color-bg-input)",
                                borderRadius: "10px",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <div
                                  className="avatar avatar-blue"
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                  }}
                                >
                                  {c.user?.avatar_url || c.user?.avatar ? (
                                    <img
                                      src={c.user?.avatar_url || c.user?.avatar}
                                      alt=""
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    (c.userName || "U")
                                      .substring(0, 1)
                                      .toUpperCase()
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: 0,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      fontWeight: "600",
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    {c.userName || c.user?.name || "Unknown"}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.625rem",
                                      color: "var(--color-text-muted)",
                                    }}
                                  >
                                    {c.createdAt ||
                                      (c.created_at &&
                                        new Date(
                                          c.created_at,
                                        ).toLocaleString())}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "0.8125rem",
                                  color: "var(--color-text-primary)",
                                  paddingLeft: "32px",
                                  whiteSpace: "pre-wrap",
                                  lineHeight: "1.4",
                                }}
                              >
                                {c.comment || c.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--color-border)",
                  }}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setDetail(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <DeleteCommunityPostModal
          open={deletePostModalOpen}
          onClose={() => {
            setDeletePostModalOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDelete}
          postTitle={deleteTarget?.title}
          postAuthor={deleteTarget?.author?.name || deleteTarget?.user?.name}
          commentCount={deleteTarget?.comments_count || 0}
        />

        {/* Create Modal */}
        {showCreateModal && (
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
              onClick={() => setShowCreateModal(false)}
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
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--color-bg-surface)",
                  color: "var(--color-text-primary)",
                  padding: "24px",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                  pointerEvents: "auto",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <h3
                    className="card-title"
                    style={{
                      margin: 0,
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                  >
                    Create New Post
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setShowCreateModal(false)}
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <form
                  onSubmit={handleCreate}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={createData.title}
                      onChange={(e) =>
                        setCreateData({ ...createData, title: e.target.value })
                      }
                      placeholder="e.g. SMAKJIT Community Discussion"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Category
                    </label>
                    <select
                      className="form-input"
                      value={createData.category}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          category: e.target.value,
                        })
                      }
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: "right 10px center",
                        backgroundRepeat: "no-repeat",
                        paddingRight: "30px",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="discussion">Discussion</option>
                      <option value="event">Event</option>
                      <option value="story">Story</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Content *
                    </label>
                    <textarea
                      className="form-input"
                      rows="6"
                      required
                      value={createData.content}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write your post content here..."
                      style={{ resize: "vertical", minHeight: "120px" }}
                    ></textarea>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "12px",
                      marginTop: "12px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={createLoading}
                    >
                      {createLoading ? (
                        <>
                          <i
                            className="bi bi-arrow-repeat"
                            style={{
                              animation: "spin 1s linear infinite",
                              marginRight: "0.5rem",
                            }}
                          ></i>{" "}
                          Creating...
                        </>
                      ) : (
                        "Create Post"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editPost && (
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
              onClick={() => setEditPost(null)}
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
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--color-bg-surface)",
                  color: "var(--color-text-primary)",
                  padding: "24px",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                  pointerEvents: "auto",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <h3
                    className="card-title"
                    style={{
                      margin: 0,
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                  >
                    Edit Community Post
                  </h3>
                  <button
                    className="icon-btn"
                    onClick={() => setEditPost(null)}
                    style={{ background: "none", border: "none" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <form
                  onSubmit={handleUpdate}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      placeholder="e.g. SMAKJIT Community Discussion"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Category
                    </label>
                    <select
                      className="form-input"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%239a9a9a' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: "right 10px center",
                        backgroundRepeat: "no-repeat",
                        paddingRight: "30px",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="discussion">Discussion</option>
                      <option value="event">Event</option>
                      <option value="story">Story</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Content *
                    </label>
                    <textarea
                      className="form-input"
                      rows="6"
                      required
                      value={editData.content}
                      onChange={(e) =>
                        setEditData({ ...editData, content: e.target.value })
                      }
                      placeholder="Write your post content here..."
                      style={{ resize: "vertical", minHeight: "120px" }}
                    ></textarea>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "12px",
                      marginTop: "12px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditPost(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <>
                          <i
                            className="bi bi-arrow-repeat"
                            style={{
                              animation: "spin 1s linear infinite",
                              marginRight: "0.5rem",
                            }}
                          ></i>{" "}
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
