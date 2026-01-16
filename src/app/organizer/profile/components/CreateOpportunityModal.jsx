// src/app/org/dashboard/components/CreateOpportunityModal.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { listCategories } from "@/services/categories";

const INITIAL_FORM = {
  titleKh: "",
  titleEn: "",
  description: "",
  locationKh: "ភ្នំពេញ",
  category: "environment", // environment | education | health | wildlife | childcare | agriculture | event
  dateISO: "",
  visibility: "public", // public | private
  accessMode: "approval", // approval | invite
  accessCode: "",
  housing: "",
  meals: "",
  transport: "",
  timeRange: "",
  skills: [],
  tasks: [],
  impactDescription: "",
  capacity: 1,
  status: "active"
};

export default function CreateOpportunityModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await listCategories();
        setCategories(data);
        // Set default category if not set
        if (!form.category && data.length > 0) {
          setForm(f => ({ ...f, category: data[0].name.toLowerCase() }));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const resetLocalState = () => {
    setForm(INITIAL_FORM);
    setSkillInput("");
    setTaskInput("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validity
    const missing = [];
    if (!form.titleKh) missing.push("ចំណងជើង (KH)");
    if (!form.description) missing.push("ពិពណ៌នា");
    if (!form.locationKh) missing.push("ទីតាំង");
    if (!form.category) missing.push("ប្រភេទ");
    if (!form.dateISO) missing.push("កាលបរិច្ឆេទ");
    if (!form.capacity) missing.push("ចំនួនមុខតំណែង");
    if (!form.status) missing.push("ស្ថានភាព");

    if (missing.length > 0) {
      alert(`សូមបំពេញ៖ ${missing.join(", ")}`);
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        imageFile,
        imagePreview,
        dateKh: new Date(form.dateISO).toLocaleDateString("km-KH"), // simple conversion
        status: form.status,
      });
    } finally {
      setSubmitting(false);
    }
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

              {/* Category */}
              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="opCategory">
                  ប្រភេទ / Category
                </label>
                <select
                  id="opCategory"
                  className="form-select form-select-lg"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  required
                  disabled={loadingCategories}
                >
                  <option value="" disabled>{loadingCategories ? "កំពុងផ្ទុក..." : "ជ្រើសរើសប្រភេទ"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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

              {/* Extra Info: Transport, Housing, Meals */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" htmlFor="timeRange">
                    ពេលវេលា (ឧ. 8:00 AM - 5:00 PM)
                  </label>
                  <input
                    id="timeRange"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="8:00 AM - 5:00 PM"
                    value={form.timeRange}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, timeRange: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" htmlFor="transport">
                    ការដឹកជញ្ជូន
                  </label>
                  <input
                    id="transport"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="ឧ. មានឡានដឹក"
                    value={form.transport}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, transport: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" htmlFor="housing">
                    កន្លែងស្នាក់នៅ
                  </label>
                  <input
                    id="housing"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="ឧ. ផ្តល់កន្លែងស្នាក់នៅ"
                    value={form.housing}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, housing: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" htmlFor="meals">
                    អាហារ
                  </label>
                  <input
                    id="meals"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="ឧ. ផ្តល់អាហារថ្ងៃត្រង់"
                    value={form.meals}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, meals: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Advanced Details: Skills, Tasks, Impact */}
              <div className="border-top pt-3 mt-3">
                <h6 className="fw-bold mb-3 text-primary">ព័ត៌មានលម្អិតបន្ថែម (Advanced)</h6>

                <div className="mb-3">
                  <label className="form-label fw-medium">ជំនាញដែលត្រូវការ (Skills)</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ឧ. ការប្រាស្រ័យទាក់ទង"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
                            setSkillInput("");
                          }
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => {
                        if (skillInput.trim()) {
                          setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
                          setSkillInput("");
                        }
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {form.skills.map((s, i) => (
                      <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
                        {s}
                        <i
                          className="bi bi-x-lg cursor-pointer"
                          role="button"
                          onClick={() => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }))}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">ភារកិច្ចសំខាន់ៗ (Tasks)</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ឧ. រៀបចំកម្មវិធី"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (taskInput.trim()) {
                            setForm(f => ({ ...f, tasks: [...f.tasks, taskInput.trim()] }));
                            setTaskInput("");
                          }
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => {
                        if (taskInput.trim()) {
                          setForm(f => ({ ...f, tasks: [...f.tasks, taskInput.trim()] }));
                          setTaskInput("");
                        }
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {form.tasks.map((t, i) => (
                      <span key={i} className="badge bg-info-subtle text-info border border-info-subtle d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
                        {t}
                        <i
                          className="bi bi-x-lg cursor-pointer"
                          role="button"
                          onClick={() => setForm(f => ({ ...f, tasks: f.tasks.filter((_, idx) => idx !== i) }))}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium" htmlFor="impactDescription">ផលប៉ះពាល់នៃកម្មវិធី (Impact Description)</label>
                  <textarea
                    id="impactDescription"
                    className="form-control"
                    rows={3}
                    placeholder="ពិពណ៌នាអំពីផលប៉ះពាល់ដែលអ្នកស្ម័គ្រចិត្តនឹងបង្កើត..."
                    value={form.impactDescription}
                    onChange={(e) => setForm(f => ({ ...f, impactDescription: e.target.value }))}
                  />
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
                className="btn btn-primary btn-lg rounded-pill px-4"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    កំពុងបញ្ជូន...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-lg me-1"></i> Post Opportunity
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
``;
