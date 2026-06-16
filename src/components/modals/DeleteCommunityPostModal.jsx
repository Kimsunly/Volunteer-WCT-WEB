"use client";

import React, { useState } from "react";

export default function DeleteCommunityPostModal({
  open,
  onClose,
  onConfirm,
  postTitle,
  postAuthor,
  commentCount = 0,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Delete community post error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1060,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content-custom rounded-4 shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="p-4 p-md-5 text-center"
          style={{
            background: "transparent",
          }}
        >
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "74px",
              height: "74px",
              background: "rgba(255, 77, 77, 0.12)",
              color: "#dc3545",
            }}
          >
            <i className="bi bi-trash3-fill" style={{ fontSize: "2rem" }}></i>
          </div>

          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
            style={{
              background: "rgba(255, 77, 77, 0.12)",
              color: "var(--color-negative)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            <i className="bi bi-exclamation-triangle-fill"></i>
            DESTRUCTIVE ACTION
          </div>

          <h4 className="fw-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Delete community post?</h4>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 0 }}>
            This will permanently remove the post from the community feed.
            Comments, engagement, and reactions linked to this post will no
            longer be available.
          </p>
        </div>

        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div
            className="rounded-4 p-4"
            style={{
              background: "var(--color-bg-input)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <span className="d-block text-uppercase fw-semibold small mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Post title
                </span>
                <div
                  className="fw-semibold"
                  style={{ lineHeight: 1.5, color: "var(--color-text-primary)" }}
                >
                  {postTitle || "Untitled post"}
                </div>
              </div>
              <div className="col-6 col-md-2">
                <span className="d-block text-uppercase fw-semibold small mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Author
                </span>
                <div className="fw-semibold small" style={{ color: "var(--color-text-primary)" }}>
                  {postAuthor || "Unknown"}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <span className="d-block text-uppercase fw-semibold small mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Comments
                </span>
                <div className="fw-semibold small" style={{ color: "var(--color-text-primary)" }}>
                  {commentCount} total
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn-secondary flex-fill rounded-3 fw-semibold py-3"
              onClick={onClose}
              disabled={isDeleting}
              style={{ border: "1px solid var(--color-border)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger flex-fill rounded-3 fw-bold py-3 shadow-sm"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="d-inline-flex align-items-center gap-2">
                  <i
                    className="bi bi-arrow-repeat"
                    style={{ animation: "spin 1s linear infinite" }}
                  ></i>
                  Deleting...
                </span>
              ) : (
                <span className="d-inline-flex align-items-center gap-2">
                  <i className="bi bi-trash3"></i>
                  Delete post
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
