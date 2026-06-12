"use client";

import React from "react";

export default function OrganizerCommunityPostDetailModal({
  open,
  onClose,
  post,
  onEdit,
  onDelete,
}) {
  if (!open || !post) return null;

  const tagList = Array.isArray(post.tags) ? post.tags : [];
  const authorName =
    post.organizerName || post.author?.name || post.user?.name || "Unknown";
  const publishedAt = post.createdAt || post.created_at;
  const statusLabel =
    post.status === "approved" ||
    post.status === "published" ||
    post.is_published
      ? "Approved"
      : post.status === "rejected"
        ? "Rejected"
        : "Pending";
  const statusClass =
    statusLabel === "Approved"
      ? "active"
      : statusLabel === "Rejected"
        ? "rejected"
        : "pending";

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            type="button"
            className="icon-btn"
            onClick={onClose}
            style={{ background: "none", border: "none" }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {post.image_url && (
            <div
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                maxHeight: "250px",
              }}
            >
              <img
                src={post.image_url}
                alt={post.title}
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
              {post.title}
            </h2>
            {post.titleKh && (
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginBottom: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {post.titleKh}
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
                {authorName}
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
                {post.category || "Discussion"}
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
              <span className={`status-badge ${statusClass}`}>
                {statusLabel}
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
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
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
                {post.content}
              </p>
              {post.contentKh && (
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
                  {post.contentKh}
                </p>
              )}
            </div>
          </div>

          {tagList.length > 0 && (
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
                Tags
              </span>
              <div className="d-flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="badge rounded-pill text-dark"
                    style={{
                      background: "rgba(37, 99, 235, 0.10)",
                      border: "1px solid rgba(37, 99, 235, 0.15)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "24px",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "16px",
              paddingBottom: "8px",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i
                className="bi bi-heart-fill"
                style={{ color: "var(--color-negative)" }}
              ></i>
              <span style={{ fontWeight: 600 }}>
                {post.likes || post.likes_count || 0}
              </span>
              <span>Likes</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i
                className="bi bi-chat-fill"
                style={{ color: "var(--color-accent)" }}
              ></i>
              <span style={{ fontWeight: 600 }}>
                {post.comments || post.comments_count || 0}
              </span>
              <span>Comments</span>
            </div>
          </div>

          <div className="d-flex gap-3 mt-2">
            <button
              type="button"
              className="btn btn-light flex-fill rounded-3 fw-semibold py-3"
              onClick={onClose}
              style={{ border: "1px solid #e2e8f0" }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-outline-primary flex-fill rounded-3 fw-semibold py-3"
              onClick={onEdit}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-danger flex-fill rounded-3 fw-semibold py-3"
              onClick={onDelete}
            >
              <i className="bi bi-trash me-2"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
