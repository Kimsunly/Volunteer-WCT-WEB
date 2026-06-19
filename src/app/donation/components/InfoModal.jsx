
// src/app/donation/components/InfoModal.jsx
"use client";

import React from "react";

export default function InfoModal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1050,
        padding: "1rem",
      }}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered w-100 m-0"
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content rounded-4 shadow-lg overflow-hidden"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Header */}
          <div
            className="modal-header d-flex align-items-center justify-content-between p-4 px-md-5"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <h4
              className="modal-title fw-bold m-0"
              style={{ color: "var(--color-text-primary)", fontSize: "1.5rem" }}
            >
              {title}
            </h4>
            <button
              type="button"
              className="d-flex align-items-center justify-content-center rounded-circle"
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                background: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-card-hover)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-bg-input)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: "1rem" }}></i>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 p-md-5 overflow-auto" style={{ maxHeight: "70vh" }}>
            {children}
          </div>

          {/* Footer */}
          <div
            className="modal-footer p-4 d-flex justify-content-end gap-3"
            style={{
              background: "var(--color-bg-surface)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="button"
              className="btn px-4 py-2.5 rounded-3 fw-bold"
              onClick={onClose}
              style={{
                background: "var(--color-bg-input)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                transition: "all 0.2s ease",
                minWidth: "100px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-card-hover)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-bg-input)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              បិទ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
