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
        backgroundColor: "rgba(15, 23, 42, 0.58)",
        backdropFilter: "blur(10px)",
        zIndex: 1060,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content-custom bg-white rounded-4 shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "560px",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.28)",
        }}
      >
        <div
          className="p-4 p-md-5 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 77, 77, 0.12) 0%, rgba(255, 255, 255, 1) 85%)",
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
              background: "rgba(220, 53, 69, 0.08)",
              color: "#dc3545",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            <i className="bi bi-exclamation-triangle-fill"></i>
            DESTRUCTIVE ACTION
          </div>

          <h4 className="fw-bold text-dark mb-2">Delete community post?</h4>
          <p className="text-secondary mb-0">
            This will permanently remove the post from the community feed.
            Comments, reactions, and engagement data linked to this post will no
            longer be available.
          </p>
        </div>

        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div
            className="rounded-4 p-4"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <span className="d-block text-uppercase text-muted fw-semibold small mb-2">
                  Post title
                </span>
                <div
                  className="fw-semibold text-dark"
                  style={{ lineHeight: 1.5 }}
                >
                  {postTitle || "Untitled post"}
                </div>
              </div>
              <div className="col-6 col-md-2">
                <span className="d-block text-uppercase text-muted fw-semibold small mb-2">
                  Author
                </span>
                <div className="fw-semibold text-dark small">
                  {postAuthor || "Unknown"}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <span className="d-block text-uppercase text-muted fw-semibold small mb-2">
                  Comments
                </span>
                <div className="fw-semibold text-dark small">
                  {commentCount} total
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              className="btn btn-light flex-fill rounded-3 fw-semibold py-3"
              onClick={onClose}
              disabled={isDeleting}
              style={{ border: "1px solid #e2e8f0" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger flex-fill rounded-3 fw-bold py-3 shadow-sm"
              onClick={handleConfirm}
              disabled={isDeleting}
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                borderColor: "#dc2626",
              }}
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
