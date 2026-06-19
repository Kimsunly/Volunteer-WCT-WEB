// src/app/org/dashboard/components/CreateOpportunityModal.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { listCategories } from "@/services/categories";
import { showToast } from "@/components/common/CustomToaster";

const INITIAL_FORM = {
  titleKh: "",
  titleEn: "",
  description: "",
  locationKh: "ភ្នំពេញ",
  category_id: "", // populated from DB
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
  status: "active",
};

export default function CreateOpportunityModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const errRef = useRef(null);
  const objectUrlRefs = useRef([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await listCategories();
        setCategories(data);
        // Set default category if not set
        if (!form.category_id && data.length > 0) {
          setForm((f) => ({ ...f, category_id: data[0].id }));
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
    setImageFiles([]);
    setImagePreviews([]);
    setThumbnailIndex(0);
    objectUrlRefs.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlRefs.current = [];
    if (errRef.current) errRef.current.textContent = "";
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const MAX_IMAGES = 6;

  const onFiles = (files) => {
    const MAX = 5 * 1024 * 1024; // 5MB per file
    const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - imageFiles.length;
    if (remaining <= 0) {
      if (errRef.current)
        errRef.current.textContent = `អ្នកបានផ្ទុករូបភាពអតិបរមា ${MAX_IMAGES} រួចហើយ។`;
      return;
    }

    const newFiles = Array.from(files).slice(0, remaining);
    const validFiles = [];
    const newPreviews = [];

    for (const file of newFiles) {
      if (!OK_TYPES.includes(file.type)) {
        if (errRef.current)
          errRef.current.textContent = "សូមផ្ទុកឡើងជារូបភាព PNG, JPG ឬ WebP។";
        continue;
      }
      if (file.size > MAX) {
        if (errRef.current)
          errRef.current.textContent = `រូបភាព ${file.name} មានទំហំធំពេក។ អតិបរមា 5 MB។`;
        continue;
      }

      const url = URL.createObjectURL(file);
      objectUrlRefs.current.push(url);
      validFiles.push(file);
      newPreviews.push(url);
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (errRef.current) errRef.current.textContent = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      objectUrlRefs.current = objectUrlRefs.current.filter(
        (url) => url !== urlToRemove,
      );
      return prev.filter((_, i) => i !== index);
    });
    // Reset thumbnail index: if removed image was thumbnail, move to 0; if after, shift down
    setThumbnailIndex((prev) => {
      if (prev === index) return 0;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validity
    const missing = [];
    if (!form.titleKh) missing.push("ចំណងជើង (KH)");
    if (!form.description) missing.push("ពិពណ៌នា");
    if (!form.locationKh) missing.push("ទីតាំង");
    if (!form.category_id) missing.push("ប្រភេទ");
    if (!form.dateISO) missing.push("កាលបរិច្ឆេទ");
    if (!form.capacity) missing.push("ចំនួនមុខតំណែង");
    if (!form.status) missing.push("ស្ថានភាព");

    if (missing.length > 0) {
      showToast.error(`សូមបំពេញ៖ ${missing.join(", ")}`, "ខ្វះខាតព័ត៌មាន");
      return;
    }

    if (form.visibility === "private") {
      if (!form.accessCode || !form.accessCode.trim()) {
        showToast.error("សូមបញ្ចូលកូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន", "ខ្វះខាតព័ត៌មាន");
        return;
      }
      if (form.accessCode.trim().length < 8) {
        showToast.error("កូដសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៨ ខ្ទង់", "កូដសម្ងាត់ខ្លីពេក");
        return;
      }
    }
    try {
      setSubmitting(true);
      // Reorder imageFiles so thumbnail comes first
      const reorderedFiles = [...imageFiles];
      if (thumbnailIndex > 0 && thumbnailIndex < reorderedFiles.length) {
        const [thumb] = reorderedFiles.splice(thumbnailIndex, 1);
        reorderedFiles.unshift(thumb);
      }
      await onSubmit({
        ...form,
        imageFiles: reorderedFiles,
        thumbnailIndex: 0, // after reorder, thumbnail is always index 0
        dateKh: new Date(form.dateISO).toLocaleDateString("km-KH"),
        status: form.status,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 1040,
        }}
        onClick={handleClose}
      ></div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050,
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          className="card shadow-lg overflow-hidden"
          style={{
            width: "100%",
            maxWidth: "800px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            color: "var(--color-text-primary)",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="modal-header p-4 d-flex align-items-center justify-content-between"
            style={{
              background: "var(--color-bg-surface)",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
            }}
          >
            <h5 className="modal-title d-flex align-items-center gap-2 mb-0" style={{ color: "var(--color-text-primary)", fontSize: "1.15rem", fontWeight: "600" }}>
              <i className="bi bi-briefcase-fill fs-4" style={{ color: "var(--color-accent)" }}></i> ឱកាសការងារថ្មី (New Opportunity)
            </h5>
            <button
              type="button"
              className="btn-close-custom"
              aria-label="Close"
              onClick={handleClose}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Body & Form */}
          <form
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexGrow: 1,
              margin: 0,
            }}
          >
            <div className="modal-body p-4" style={{ overflowY: "auto", flexGrow: 1 }}>
              {/* Titles */}
              <div className="mb-4">
                <label className="form-label fw-bold" htmlFor="opTitleKh">
                  ចំណងជើងការងារ (KH) <span className="text-danger">*</span>
                </label>
                <input
                  id="opTitleKh"
                  type="text"
                  className="form-control"
                  placeholder="ឧ. មន្ត្រីផ្សព្វផ្សាយសហគមន៍"
                  value={form.titleKh}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleKh: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold" htmlFor="opTitleEn">
                  Job Title (EN)
                </label>
                <input
                  id="opTitleEn"
                  type="text"
                  className="form-control"
                  placeholder="e.g., Community Outreach Officer"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleEn: e.target.value }))
                  }
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label fw-bold" htmlFor="opDescription">
                  ពិពណ៌នាការងារ <span className="text-danger">*</span>
                </label>
                <textarea
                  id="opDescription"
                  className="form-control text-area-modern"
                  rows={4}
                  placeholder="ពិពណ៌នាខ្លីអំពីតួនាទី និងទំនួលខុសត្រូវរបស់សមាជិកស្ម័គ្រចិត្ត..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Location & date */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="opLocation">
                    ទីតាំង <span className="text-danger">*</span>
                  </label>
                  <input
                    id="opLocation"
                    type="text"
                    className="form-control"
                    value={form.locationKh}
                    onChange={(e) =>
                       setForm((f) => ({ ...f, locationKh: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="opDateISO">
                    កាលបរិច្ឆេទចាប់ផ្តើម <span className="text-danger">*</span>
                  </label>
                  <input
                    id="opDateISO"
                    type="date"
                    className="form-control"
                    value={form.dateISO}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dateISO: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="form-label fw-bold" htmlFor="opCategory">
                  ប្រភេទ / Category <span className="text-danger">*</span>
                </label>
                <select
                  id="opCategory"
                  className="form-select"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category_id: Number(e.target.value) }))
                  }
                  required
                  disabled={loadingCategories}
                >
                  <option value="" disabled>
                    {loadingCategories ? "កំពុងផ្ទុក..." : "ជ្រើសរើសប្រភេទ"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility */}
              <div className="mb-4">
                <label className="form-label fw-bold mb-2">
                  ការមើលឃើញ / Visibility
                </label>
                <div className="d-flex flex-row gap-3">
                  <div
                    className={`visibility-card ${form.visibility === "public" ? "active" : ""}`}
                    onClick={() => setForm((f) => ({ ...f, visibility: "public" }))}
                  >
                    <input
                      type="radio"
                      id="visPublic"
                      name="vis"
                      checked={form.visibility === "public"}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="visibility-title">សាធារណៈ (Public)</div>
                      <div className="small text-muted" style={{ fontSize: "11px" }}>បង្ហាញជាសាធារណៈសម្រាប់គ្រប់គ្នា</div>
                    </div>
                  </div>
                  <div
                    className={`visibility-card ${form.visibility === "private" ? "active" : ""}`}
                    onClick={() => setForm((f) => ({ ...f, visibility: "private" }))}
                  >
                    <input
                      type="radio"
                      id="visPrivate"
                      name="vis"
                      checked={form.visibility === "private"}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="visibility-title">ឯកជន (Private)</div>
                      <div className="small text-muted" style={{ fontSize: "11px" }}>ទាមទារកូដអញ្ជើញ ឬការអនុម័ត</div>
                    </div>
                  </div>
                </div>
              </div>

              {form.visibility === "private" && (
                <div className="row g-3 mb-4 animate-slide-down">
                  <div className="col-md-6">
                    <label
                      className="form-label fw-bold"
                      htmlFor="accessMode"
                    >
                      របៀបចុះឈ្មោះ
                    </label>
                    <select
                      id="accessMode"
                      className="form-select"
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
                      className="form-label fw-bold"
                      htmlFor="accessCode"
                    >
                      កូដឬសេចក្តីណែនាំ
                    </label>
                    <input
                      id="accessCode"
                      type="text"
                      className="form-control"
                      placeholder="ឧ. CODE-2026"
                      value={form.accessCode}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, accessCode: e.target.value }))
                      }
                    />
                    <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                      ចែករំលែកតែជាមួយអ្នកទទួលអញ្ជើញ (បើមាន)
                    </small>
                  </div>
                </div>
              )}

              {/* Capacity & Status */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="capacity">
                    ចំនួនមុខតំណែងស្វែងរក <span className="text-danger">*</span>
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    className="form-control"
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
                  <label className="form-label fw-bold" htmlFor="status">
                    ស្ថានភាពការងារ <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    className="form-select"
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

              {/* Logistic Info: Time, Transport, Housing, Meals */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="timeRange">
                    ពេលវេលា (ឧ. 8:00 AM - 5:00 PM)
                  </label>
                  <input
                    id="timeRange"
                    type="text"
                    className="form-control"
                    placeholder="8:00 AM - 5:00 PM"
                    value={form.timeRange}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, timeRange: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="transport">
                    ការដឹកជញ្ជូន
                  </label>
                  <input
                    id="transport"
                    type="text"
                    className="form-control"
                    placeholder="ឧ. មានឡានដឹកបញ្ជូន"
                    value={form.transport}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, transport: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="housing">
                    កន្លែងស្នាក់នៅ
                  </label>
                  <input
                    id="housing"
                    type="text"
                    className="form-control"
                    placeholder="ឧ. ផ្តល់កន្លែងស្នាក់នៅសមរម្យ"
                    value={form.housing}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, housing: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="meals">
                    អាហារនិងភេសជ្ជៈ
                  </label>
                  <input
                    id="meals"
                    type="text"
                    className="form-control"
                    placeholder="ឧ. ផ្តល់អាហារថ្ងៃត្រង់"
                    value={form.meals}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, meals: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Advanced Details: Skills, Tasks, Impact */}
              <div className="section-divider">
                <h6 className="section-title">
                  ព័ត៌មានលម្អិតបន្ថែម (Advanced Details)
                </h6>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    ជំនាញដែលត្រូវការ (Required Skills)
                  </label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ឧ. ការប្រាស្រ័យទាក់ទង"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            setForm((f) => ({
                              ...f,
                              skills: [...f.skills, skillInput.trim()],
                            }));
                            setSkillInput("");
                          }
                        }
                      }}
                    />
                    <button
                      className="btn btn-tag-add"
                      type="button"
                      onClick={() => {
                        if (skillInput.trim()) {
                          setForm((f) => ({
                            ...f,
                            skills: [...f.skills, skillInput.trim()],
                          }));
                          setSkillInput("");
                        }
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {form.skills.map((s, i) => (
                      <span
                        key={i}
                        className="badge bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center gap-2 px-3 py-2 rounded-pill badge-tag"
                      >
                        {s}
                        <i
                          className="bi bi-x-circle-fill cursor-pointer text-primary"
                          role="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              skills: f.skills.filter((_, idx) => idx !== i),
                            }))
                          }
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    ភារកិច្ចចម្បងស្ម័គ្រចិត្ត (Main Tasks)
                  </label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ឧ. រៀបចំសម្របសម្រួលកម្មវិធី"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (taskInput.trim()) {
                            setForm((f) => ({
                              ...f,
                              tasks: [...f.tasks, taskInput.trim()],
                            }));
                            setTaskInput("");
                          }
                        }
                      }}
                    />
                    <button
                      className="btn btn-tag-add"
                      type="button"
                      onClick={() => {
                        if (taskInput.trim()) {
                          setForm((f) => ({
                            ...f,
                            tasks: [...f.tasks, taskInput.trim()],
                          }));
                          setTaskInput("");
                        }
                      }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {form.tasks.map((t, i) => (
                      <span
                        key={i}
                        className="badge bg-info-subtle text-info border border-info-subtle d-flex align-items-center gap-2 px-3 py-2 rounded-pill badge-tag"
                      >
                        {t}
                        <i
                          className="bi bi-x-circle-fill cursor-pointer text-info"
                          role="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              tasks: f.tasks.filter((_, idx) => idx !== i),
                            }))
                          }
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="form-label fw-bold"
                    htmlFor="impactDescription"
                  >
                    ផលប៉ះពាល់នៃការចូលរួម (Impact Description)
                  </label>
                  <textarea
                    id="impactDescription"
                    className="form-control text-area-modern"
                    rows={3}
                    placeholder="សរសេររៀបរាប់អំពីអត្ថប្រយោជន៍ ឬឥទ្ធិពលវិជ្ជមាននៃការចូលរួមរបស់សមាជិកស្ម័គ្រចិត្ត..."
                    value={form.impactDescription}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        impactDescription: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Image upload */}
              <div className="mb-4">
                <label className="form-label fw-bold d-flex align-items-center justify-content-between">
                  <span>រូបថតសកម្មភាព (Activity Photos)</span>
                  <span className={`badge ${imagePreviews.length >= MAX_IMAGES ? 'bg-danger' : 'bg-success'}`} style={{ borderRadius: "100px" }}>
                    {imagePreviews.length}/{MAX_IMAGES} រូប
                  </span>
                </label>
                <div
                  className="premium-dropzone text-center"
                  role={imagePreviews.length < MAX_IMAGES ? "button" : undefined}
                  tabIndex={imagePreviews.length < MAX_IMAGES ? 0 : -1}
                  style={{ cursor: imagePreviews.length >= MAX_IMAGES ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    if (imagePreviews.length < MAX_IMAGES)
                      document.getElementById("opImageInput")?.click();
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && imagePreviews.length < MAX_IMAGES) {
                      e.preventDefault();
                      document.getElementById("opImageInput")?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (imagePreviews.length < MAX_IMAGES) {
                      const files = e.dataTransfer.files;
                      if (files) onFiles(files);
                    }
                  }}
                >
                  <i className="bi bi-images fs-3 mb-2 text-success"></i>
                  <div className="fw-bold" style={{ fontSize: "14px" }}>
                    {imagePreviews.length >= MAX_IMAGES
                      ? `បានដល់ចំនួនអតិបរមា ${MAX_IMAGES} រូបហើយ`
                      : "ទាញរូបភាពមកទីនេះ ឬចុចជ្រើសរើសឯកសារ"
                    }
                  </div>
                  <div className="small text-muted mt-1" style={{ fontSize: "11px" }}>
                    គាំទ្រប្រភេទ JPEG, PNG ឬ WebP (ទំហំអតិបរមា 5MB ក្នុងមួយសន្លឹក)
                  </div>
                </div>

                <input
                  type="file"
                  id="opImageInput"
                  className="d-none"
                  accept="image/*"
                  multiple
                  disabled={imagePreviews.length >= MAX_IMAGES}
                  onChange={(e) => onFiles(e.target.files)}
                />

                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    <div className="small fw-semibold text-success mb-2" style={{ fontSize: "12px" }}>
                      <i className="bi bi-hand-index-thumb me-1"></i>
                      ចុចលើរូបភាពដើម្បីជ្រើសរើសជា Thumbnail (រូបតំណាងប័ណ្ណ)
                    </div>
                    <div className="row g-2">
                      {imagePreviews.map((preview, index) => (
                        <div className="col-4" key={index}>
                          <div
                            className={`photo-preview-card ${index === thumbnailIndex ? "thumbnail-selected" : ""}`}
                            onClick={() => setThumbnailIndex(index)}
                            role="button"
                            title={index === thumbnailIndex ? "Thumbnail បច្ចុប្បន្ន" : "ចុចដើម្បីជ្រើសជា Thumbnail"}
                          >
                            <img
                              src={preview}
                              className="img-thumbnail rounded-3 w-100"
                              alt={`Preview ${index + 1}`}
                              style={{ height: "110px", objectFit: "cover", cursor: "pointer" }}
                            />
                            {/* Thumbnail crown badge */}
                            {index === thumbnailIndex && (
                              <div
                                className="position-absolute top-0 start-0 m-1"
                                style={{ zIndex: 3 }}
                              >
                                <span
                                  className="badge"
                                  style={{
                                    background: "linear-gradient(135deg, var(--color-accent) 0%, rgba(170, 255, 0, 0.7) 100%)",
                                    color: "#000000",
                                    fontSize: "10px",
                                    borderRadius: "8px",
                                    padding: "3px 7px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <i className="bi bi-image-fill me-1"></i>Thumbnail
                                </span>
                              </div>
                            )}
                            {/* Remove button */}
                            <button
                              type="button"
                              className="remove-btn position-absolute top-0 end-0 m-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                            {/* Index badge (shown when not thumbnail) */}
                            {index !== thumbnailIndex && (
                              <div className="position-absolute bottom-0 start-0 m-1">
                                <span className="badge bg-dark bg-opacity-50 small">{index + 1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <small className="text-muted mt-2 d-block" style={{ fontSize: "12px" }}>
                      <i className="bi bi-info-circle me-1 text-success"></i>
                      រូបភាពដែលមានស្លាក <strong>Thumbnail</strong> នឹងបង្ហាញជាគម្របប័ណ្ណឱកាស។
                    </small>
                  </div>
                )}

                <div className="invalid-feedback d-block mt-2 text-danger" ref={errRef}></div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="modal-footer border-0 justify-content-end p-4"
              style={{
                flexShrink: 0,
                borderTop: "1px solid var(--color-border) !important",
                backgroundColor: "var(--color-bg-surface)",
              }}
            >
              <button
                type="button"
                className="btn-premium-cancel me-2"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-premium-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
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

      <style jsx>{`
        .modal-backdrop {
          backdrop-filter: blur(8px) !important;
          background-color: rgba(17, 24, 39, 0.4) !important;
        }
        .modal-header {
          background: var(--color-bg-surface) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
        .btn-close-custom {
          background: transparent;
          border: none;
          color: var(--color-text-secondary) !important;
          opacity: 0.8;
          font-size: 1.25rem;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-close-custom:hover {
          color: var(--color-accent) !important;
          opacity: 1;
          transform: rotate(90deg);
        }
        .form-label {
          color: var(--color-text-secondary);
          font-size: 13.5px;
          margin-bottom: 6px;
        }
        .form-control, .form-select {
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          border-radius: 12px !important;
          padding: 11px 16px !important;
          font-size: 14px;
          color: var(--color-text-primary) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .form-select {
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          background-size: 16px 12px !important;
          padding-right: 40px !important;
        }
        .form-control:focus, .form-select:focus {
          background-color: var(--color-bg-surface) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 4px var(--color-accent-dim) !important;
          outline: none !important;
        }
        .text-area-modern {
          resize: none;
          line-height: 1.5;
        }
        .visibility-card {
          border: 1.5px solid var(--color-border) !important;
          background-color: var(--color-bg-input) !important;
          border-radius: 16px !important;
          padding: 14px 18px !important;
          cursor: pointer;
          transition: all 0.25s ease;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .visibility-card:hover {
          border-color: var(--color-accent) !important;
          background-color: var(--color-bg-card-hover) !important;
        }
        .visibility-card.active {
          border-color: var(--color-accent) !important;
          background-color: var(--color-bg-card-hover) !important;
          box-shadow: 0 4px 12px var(--color-accent-glow) !important;
        }
        .visibility-card input[type="radio"] {
          accent-color: var(--color-accent) !important;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .visibility-title {
          font-weight: 700;
          color: var(--color-text-primary) !important;
          font-size: 14px;
        }
        .visibility-desc {
          font-size: 11px;
          color: var(--color-text-secondary) !important;
        }
        .section-divider {
          border-top: 1.5px dashed var(--color-border) !important;
          margin-top: 28px;
          margin-bottom: 24px;
          padding-top: 20px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-accent);
          margin-bottom: 18px;
        }
        .btn-tag-add {
          border: 1.5px solid var(--color-accent) !important;
          color: var(--color-accent) !important;
          background: transparent;
          border-radius: 0 12px 12px 0;
          padding: 0 16px;
          transition: all 0.2s ease;
        }
        .btn-tag-add:hover {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
        }
        .form-control:has(+ .btn-tag-add) {
          border-radius: 12px 0 0 12px !important;
        }
        .badge-tag {
          font-size: 12px;
          transition: all 0.2s ease;
          background-color: var(--color-bg-input) !important;
          border: 1.5px solid var(--color-border) !important;
          color: var(--color-text-primary) !important;
        }
        .badge-tag i {
          font-size: 13.5px;
          transition: color 0.15s ease;
          color: var(--color-text-secondary) !important;
        }
        .badge-tag i:hover {
          color: var(--color-negative) !important;
        }
        .premium-dropzone {
          border: 2px dashed var(--color-accent) !important;
          background-color: var(--color-accent-dim) !important;
          border-radius: 16px;
          padding: 30px;
          transition: all 0.25s ease;
        }
        .premium-dropzone:hover {
          background-color: var(--color-accent-glow) !important;
          border-color: var(--color-accent) !important;
          transform: translateY(-1px);
        }
        .premium-dropzone .fw-bold {
          color: var(--color-text-primary) !important;
        }
        .photo-preview-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.25s ease;
          border: 2.5px solid transparent;
        }
        .photo-preview-card:hover {
          transform: scale(1.02);
        }
        .photo-preview-card.thumbnail-selected {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 3px var(--color-accent-glow) !important;
        }
        .remove-btn {
          background: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          padding: 0;
        }
        .remove-btn:hover {
          background: #ef4444;
          transform: scale(1.1);
        }
        .btn-premium-cancel {
          border: none;
          background: var(--color-bg-input) !important;
          color: var(--color-text-primary) !important;
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .btn-premium-cancel:hover {
          background: var(--color-bg-card-hover) !important;
          color: var(--color-text-primary) !important;
        }
        .btn-premium-submit {
          border: none;
          background: var(--color-accent) !important;
          color: #000000 !important;
          padding: 10px 28px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 12px var(--color-accent-glow);
          transition: all 0.25s ease;
        }
        .btn-premium-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(45, 106, 79, 0.3);
        }
        .btn-premium-submit:active {
          transform: translateY(0);
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
