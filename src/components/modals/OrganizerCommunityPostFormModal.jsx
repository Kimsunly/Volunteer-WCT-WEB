"use client";

import React from "react";

export default function OrganizerCommunityPostFormModal({
  open,
  onClose,
  onSubmit,
  editMode = false,
  form,
  setForm,
  loading = false,
}) {
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
            {editMode ? "Edit Community Post" : "Create New Post"}
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

        <form
          onSubmit={onSubmit}
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
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
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
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i
                    className="bi bi-arrow-repeat"
                    style={{
                      animation: "spin 1s linear infinite",
                      marginRight: "0.5rem",
                    }}
                  ></i>{" "}
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Save Changes"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
