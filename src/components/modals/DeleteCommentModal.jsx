"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteCommentModal({
  open,
  onClose,
  commentId,
  onDeleteSuccess,
  message = "តើអ្នកពិតជាចង់លុបមតិយោបល់នេះមែនទេ?",
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDeleteSuccess) {
        await onDeleteSuccess(commentId);
      }
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("បរាជ័យក្នុងការលុបមតិយោបល់");
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
        backdropFilter: "blur(6px)",
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
          maxWidth: "480px",
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
              color: "#dc3545",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            <i className="bi bi-exclamation-triangle-fill"></i>
            DESTRUCTIVE ACTION
          </div>

          <h4 className="fw-bold mb-2" style={{ color: "var(--color-text-primary)" }}>លុបមតិយោបល់</h4>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 0, fontSize: "14.5px", lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div className="d-flex gap-3">
            <button
              type="button"
              className="flex-fill rounded-3 fw-semibold py-3"
              onClick={onClose}
              disabled={isDeleting}
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-input)",
                color: "var(--color-text-primary)",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14.5px",
                transition: "all 0.2s"
              }}
            >
              បោះបង់
            </button>
            <button
              type="button"
              className="flex-fill rounded-3 fw-bold py-3 shadow-sm"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: "#dc3545",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14.5px",
                transition: "all 0.2s"
              }}
            >
              {isDeleting ? "កំពុងលុប..." : "លុប"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
