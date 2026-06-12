"use client";

import React, { useState } from "react";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "បញ្ជាក់ការសម្រេចចិត្ត",
  message = "តើអ្នកពិតជាចង់បន្តសកម្មភាពនេះមែនទេ?",
  confirmText = "យល់ព្រម",
  cancelText = "បោះបង់",
  type = "danger", // danger | warning | success | info
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!open) return null;

  const getThemeColors = () => {
    switch (type) {
      case "success":
        return {
          icon: "bi-check-circle-fill",
          iconColor: "#198754",
          iconBg: "rgba(25, 135, 84, 0.1)",
          btnClass: "btn-success",
        };
      case "warning":
        return {
          icon: "bi-exclamation-triangle-fill",
          iconColor: "#ffc107",
          iconBg: "rgba(255, 193, 7, 0.1)",
          btnClass: "btn-warning text-dark",
        };
      case "info":
        return {
          icon: "bi-info-circle-fill",
          iconColor: "#0dcaf0",
          iconBg: "rgba(13, 202, 240, 0.1)",
          btnClass: "btn-info text-white",
        };
      case "danger":
      default:
        return {
          icon: "bi-exclamation-octagon-fill",
          iconColor: "#dc3545",
          iconBg: "rgba(220, 53, 69, 0.1)",
          btnClass: "btn-danger",
        };
    }
  };

  const theme = getThemeColors();

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
          maxWidth: "450px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Icon */}
        <div className="p-4 text-center border-bottom bg-light">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "64px",
              height: "64px",
              background: theme.iconBg,
            }}
          >
            <i
              className={`bi ${theme.icon}`}
              style={{
                fontSize: "30px",
                color: theme.iconColor,
              }}
            ></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">{title}</h5>
        </div>

        {/* Body Content */}
        <div className="p-4 text-center">
          <p className="text-secondary fs-6 mb-0">{message}</p>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-top bg-light d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill rounded-3 fw-medium py-2"
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${theme.btnClass} flex-fill rounded-3 fw-bold py-2 shadow-sm`}
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "កំពុងដំណើរការ..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
