// src/app/org/dashboard/components/CreateOpportunityModal.jsx
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

const INITIAL_FORM = {
  titleKh: "",
  titleEn: "",
  description: "",
  locationKh: "ភ្នំពេញ",
  dateISO: "",
  visibility: "public", // public | private
  accessMode: "approval", // approval | invite
  accessCode: "",
  capacity: 10,
  status: "pending", // active | pending | closed
};

export default function CreateOpportunityModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const errRef = useRef(null);
  const objectUrlRef = useRef(null);

  const resetLocalState = () => {
    setForm(INITIAL_FORM);
    setImageFile(null);
    setImagePreview("");
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (errRef.current) errRef.current.textContent = "";
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const onFile = (file) => {
    const MAX = 2 * 1024 * 1024;
    const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!file) return;
    if (!OK_TYPES.includes(file.type)) {
      if (errRef.current)
        errRef.current.textContent = "សូមផ្ទុកឡើងជារូបភាព PNG, JPG ឬ WebP។";
      return;
    }
    if (file.size > MAX) {
      if (errRef.current)
        errRef.current.textContent = "រូបភាពមានទំហំធំពេក។ អតិបរមា 2 MB។";
      return;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImageFile(file);
    setImagePreview(url);
    if (errRef.current) errRef.current.textContent = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validity
    if (
      !form.titleKh ||
      !form.description ||
      !form.locationKh ||
      !form.dateISO ||
      !form.capacity ||
      !form.status
    ) {
      alert("សូមបំពេញទិន្នន័យអប្បបរមា។");
      return;
    }
    onSubmit({
      ...form,
      imageFile,
      imagePreview,
      dateKh: new Date(form.dateISO).toLocaleDateString("km-KH"), // simple conversion
      status: form.status,
    });
  };

  if (!open) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 0 }}
        onClick={handleClose}
      ></div>
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        style={{ zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4">
          {/* Header */}
          <div
            className="modal-header p-4 text-white"
            style={{
              background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
              borderBottom: "none",
            }}
          >
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-briefcase-fill"></i> ឱកាសការងារថ្មី
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          {/* Body */}
          <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Titles */}
              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="opTitleKh">
                  ចំណងជើងការងារ (KH)
                </label>
                <input
                  id="opTitleKh"
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="ឧ. មន្ត្រីផ្សព្វផ្សាយសហគមន៍"
                  value={form.titleKh}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleKh: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="opTitleEn">
                  Job Title (EN)
                </label>
                <input
                  id="opTitleEn"
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="e.g., Community Outreach Officer"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleEn: e.target.value }))
                  }
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="opDescription">
                  ពិពណ៌នា
                </label>
                <textarea
                  id="opDescription"
                  className="form-control form-control-lg"
                  rows={4}
                  placeholder="ពិពណ៌នាខ្លីអំពីតួនាទី..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Location & date */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="opLocation">
                    ទីតាំង
                  </label>
                  <input
                    id="opLocation"
                    type="text"
                    className="form-control form-control-lg"
                    value={form.locationKh}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, locationKh: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="opDateISO">
                    កាលបរិច្ឆេទចាប់ផ្តើម
                  </label>
                  <input
                    id="opDateISO"
                    type="date"
                    className="form-control form-control-lg"
                    value={form.dateISO}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dateISO: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  ការមើលឃើញ / Visibility
                </label>
                <div className="d-flex flex-wrap gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="visPublic"
                      name="vis"
                      checked={form.visibility === "public"}
                      onChange={() =>
                        setForm((f) => ({ ...f, visibility: "public" }))
                      }
                    />
                    <label className="form-check-label" htmlFor="visPublic">
                      សាធារណៈ (Public)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="visPrivate"
                      name="vis"
                      checked={form.visibility === "private"}
                      onChange={() =>
                        setForm((f) => ({ ...f, visibility: "private" }))
                      }
                    />
                    <label className="form-check-label" htmlFor="visPrivate">
                      ឯកជន (Private)
                    </label>
                  </div>
                </div>
                <small className="text-muted d-block mt-1">
                  Organizer គ្រប់គ្រងការចុះឈ្មោះសម្រាប់ឯកជន និងអាចទាមទារអនុម័ត
                  ឬកូដអញ្ជើញ។
                </small>
              </div>

              {form.visibility === "private" && (
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label
                      className="form-label fw-medium"
                      htmlFor="accessMode"
                    >
                      របៀបចុះឈ្មោះ
                    </label>
                    <select
                      id="accessMode"
                      className="form-select form-select-lg"
                      value={form.accessMode}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, accessMode: e.target.value }))
                      }
                    >
                      <option value="approval">ត្រូវការអនុម័ត</option>
                      <option value="invite">មានតែអ្នកទទួលអញ្ជើញ</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label
                      className="form-label fw-medium"
                      htmlFor="accessCode"
                    >
                      កូដឬសេចក្តីណែនាំ
                    </label>
                    <input
                      id="accessCode"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="ឧ. CODE-2026"
                      value={form.accessCode}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, accessCode: e.target.value }))
                      }
                    />
                    <small className="text-muted">
                      ចែករំលែកតែជាមួយអ្នកទទួលអញ្ជើញ (បើមាន)
                    </small>
                  </div>
                </div>
              )}

              {/* Capacity & Status */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="capacity">
                    ចំនួនមុខតំណែង
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    className="form-control form-control-lg"
                    min={1}
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        capacity: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" htmlFor="status">
                    ស្ថានភាព
                  </label>
                  <select
                    id="status"
                    className="form-select form-select-lg"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    required
                  >
                    <option value="" disabled>
                      ជ្រើសរើសស្ថានភាព
                    </option>
                    <option value="active">Available</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  រូបភាពគម្រូ / គម្រោង
                </label>
                <div
                  className="dropzone p-4 border border-dashed rounded-3 text-center"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    document.getElementById("opImageInput")?.click()
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("opImageInput")?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) onFile(file);
                  }}
                >
                  <i className="bi bi-cloud-arrow-up-fill fs-3 mb-2 text-muted"></i>
                  <div className="small text-muted">
                    ចុចដើម្បីជ្រើសរើស ឬទាញរូបភាពទីនេះ
                  </div>
                </div>

                <input
                  type="file"
                  id="opImageInput"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />

                {imagePreview && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center gap-3">
                      {/* Use <img> for blob: previews to avoid next/image restrictions */}
                      <img
                        src={imagePreview}
                        className="img-thumbnail rounded"
                        alt="Preview"
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <div className="small fw-semibold">
                          {imageFile?.name}
                        </div>
                        <div className="small text-muted">
                          {imageFile?.size
                            ? (imageFile.size / 1024).toFixed(0)
                            : 0}{" "}
                          KB • {imageFile?.type}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                            if (objectUrlRef.current) {
                              URL.revokeObjectURL(objectUrlRef.current);
                              objectUrlRef.current = null;
                            }
                            if (errRef.current) errRef.current.textContent = "";
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="invalid-feedback d-block" ref={errRef}></div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 justify-content-end p-4">
              <button
                type="button"
                className="btn btn-light btn-lg rounded-pill"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-pill"
              >
                <i className="bi bi-plus-lg me-1"></i> Post Opportunity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
``;
