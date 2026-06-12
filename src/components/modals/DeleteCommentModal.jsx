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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
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
          maxWidth: "480px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="modal-header-custom p-5 text-center"
          style={{
            background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
          }}
        >
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(220, 53, 69, 0.1)",
              borderRadius: "50%",
            }}
          >
            <i
              className="bi bi-trash-fill"
              style={{
                fontSize: "36px",
                color: "#dc3545",
              }}
            ></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">លុបមតិយោបល់</h4>
          <p className="mb-0 text-muted small">Delete Comment</p>
        </div>

        {/* Body */}
        <div className="modal-body-custom p-5 overflow-auto text-center">
          <p className="text-dark fs-6 mb-0">{message}</p>
        </div>

        {/* Footer */}
        <div className="modal-footer-custom p-4 border-top bg-light d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary flex-1 px-4 py-2.5 rounded-3 fw-medium"
            onClick={onClose}
            disabled={isDeleting}
          >
            បោះបង់
          </button>
          <button
            type="button"
            className="btn btn-danger flex-1 px-4 py-2.5 rounded-3 fw-bold shadow-sm"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              background: "#dc3545",
              borderColor: "#dc3545",
            }}
          >
            {isDeleting ? "កំពុងលុប..." : "លុប"}
          </button>
        </div>
      </div>
    </div>
  );
}
