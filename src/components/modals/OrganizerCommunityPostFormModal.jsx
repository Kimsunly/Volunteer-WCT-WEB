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
      className="modal-backdrop-premium"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel-premium">
        {/* Modal Header */}
        <div className="modal-header-banner">
          <h3 className="modal-title-text">
            {editMode ? "កែប្រែប្រកាសសហគមន៍ / Edit Post" : "បង្កើតប្រកាសថ្មី / Create Post"}
          </h3>
          <button
            type="button"
            className="modal-close-bubble"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="modal-form-body">
          
          {/* Category */}
          <div className="premium-field-wrapper">
            <label className="premium-field-label">ប្រភេទ / Category</label>
            <div className="premium-input-box">
              <div className="premium-input-icon"><i className="bi bi-tag-fill"></i></div>
              <select
                className="premium-input-field premium-select-field"
                value={form.category || "discussion"}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="discussion">Discussion (ការពិភាក្សា)</option>
                <option value="event">Event (ព្រឹត្តិការណ៍)</option>
                <option value="story">Story (រឿងរ៉ាវ)</option>
                <option value="update">Update (បច្ចុប្បន្នភាព)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="premium-field-wrapper">
            <label className="premium-field-label">ចំណងជើង / Title *</label>
            <div className="premium-input-box">
              <div className="premium-input-icon"><i className="bi bi-type-h1"></i></div>
              <input
                type="text"
                className="premium-input-field"
                required
                placeholder="ចំណងជើងប្រកាសរបស់អ្នក / Enter post title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          {/* Content */}
          <div className="premium-field-wrapper">
            <label className="premium-field-label">មាតិកា / Content Description *</label>
            <div className="premium-input-box align-items-start pt-2">
              <div className="premium-input-icon mt-1"><i className="bi bi-justify-left"></i></div>
              <textarea
                className="premium-input-field"
                rows="6"
                required
                placeholder="សរសេរមាតិកាប្រកាសរបស់អ្នក... / Write your post content description..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                style={{ resize: "none", minHeight: "150px" }}
              ></textarea>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer-premium">
            <button
              type="button"
              className="btn-premium-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat spin-icon"></i>
                  {editMode ? "Updating..." : "Posting..."}
                </>
              ) : editMode ? (
                <>
                  <i className="bi bi-check-circle-fill"></i>
                  Save Changes
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle-fill"></i>
                  Post Community
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-backdrop-premium {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          z-index: 1060;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-panel-premium {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border-radius: 24px;
          border: 1px solid var(--color-border);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header-banner {
          background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
        }

        .modal-title-text {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
        }

        .modal-close-bubble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close-bubble:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: rotate(90deg);
        }

        .modal-form-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .premium-field-wrapper {
          display: flex;
          flex-direction: column;
        }

        .premium-field-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          transition: color 0.2s ease;
        }

        .premium-input-box {
          display: flex;
          align-items: center;
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 14px;
          padding: 4px 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .premium-input-box:hover {
          border-color: var(--color-border-hover) !important;
        }
        .premium-input-box:focus-within {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 3px var(--color-accent-glow) !important;
          background-color: var(--color-bg-card) !important;
        }

        .premium-field-wrapper:focus-within .premium-field-label {
          color: var(--color-text-primary) !important;
        }

        .premium-input-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-base);
          color: var(--color-text-secondary);
          transition: all 0.25s ease;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 15px;
        }
        .premium-input-box:focus-within .premium-input-icon {
          background: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
        }

        .premium-input-field {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 8px 4px !important;
          color: var(--color-text-primary) !important;
          font-size: 14.5px;
          width: 100%;
          outline: none;
          line-height: 1.5;
        }
        .premium-input-field::placeholder {
          color: var(--color-text-muted) !important;
        }

        .premium-select-field {
          cursor: pointer;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 14px 12px !important;
          padding-right: 40px !important;
        }
        :global([data-theme="dark"]) .premium-select-field {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
        }

        .modal-footer-premium {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }

        .btn-premium-cancel {
          border: 1.5px solid var(--color-border);
          background: var(--color-bg-input) !important;
          color: var(--color-text-primary) !important;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-premium-cancel:hover {
          background: var(--color-bg-card-hover) !important;
          border-color: var(--color-border-hover);
        }

        .btn-premium-submit {
          border: none;
          background: var(--color-accent) !important;
          color: #000000 !important;
          padding: 10px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 12px var(--color-accent-glow);
          transition: all 0.25s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        :global([data-theme="light"]) .btn-premium-submit {
          color: #ffffff !important;
          background-color: #15803d !important;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
        }
        .btn-premium-submit:hover:not(:disabled) {
          transform: scale(1.02) translateY(-1px);
          box-shadow: 0 6px 18px var(--color-accent-glow), 0 0 0 3px var(--color-accent-dim) !important;
        }
        :global([data-theme="light"]) .btn-premium-submit:hover:not(:disabled) {
          box-shadow: 0 6px 18px rgba(21, 128, 61, 0.35), 0 0 0 3px rgba(21, 128, 61, 0.15) !important;
        }
        .btn-premium-submit:active {
          transform: scale(0.98) translateY(0);
        }
        .btn-premium-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          font-size: 14px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

