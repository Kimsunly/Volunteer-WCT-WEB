// src/app/organizer/profile/components/EditOpportunityModal.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { listCategories } from "@/services/categories";

export default function EditOpportunityModal({
  open,
  onClose,
  onSubmit,
  opportunity,
}) {
  const [form, setForm] = useState({
    titleKh: "",
    titleEn: "",
    description: "",
    locationKh: "ភ្នំពេញ",
    category_id: "",
    dateISO: "",
    visibility: "public",
    accessCode: "",
    capacity: 10,
    status: "draft",
    meals: "",
    housing: "",
    transport: "",
    timeRange: "",
    skills: [],
    tasks: [],
    impactDescription: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const errRef = useRef(null);
  const objectUrlRefs = useRef([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await listCategories();
        setCategories(data);
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

  useEffect(() => {
    if (opportunity) {
      const getParsedArray = (field) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        try {
          return JSON.parse(field);
        } catch {
          return typeof field === "string" ? [field] : [];
        }
      };

      const skillsArr = opportunity.raw?.skills || getParsedArray(opportunity.raw?.details?.skills_json);
      const tasksArr = opportunity.raw?.tasks || getParsedArray(opportunity.raw?.details?.tasks_json);

      setForm({
        titleKh: opportunity.titleKh || opportunity.raw?.title || "",
        titleEn: opportunity.titleEn || opportunity.raw?.title || "",
        description: opportunity.raw?.description || opportunity.description || "",
        locationKh: opportunity.locationKh || opportunity.raw?.logistic?.location_label || opportunity.raw?.location || "ភ្នំពេញ",
        category_id: opportunity.raw?.category_id || opportunity.raw?.category?.id || opportunity.category_id || "",
        dateISO: (opportunity.raw?.date_range || opportunity.raw?.logistic?.start_date || opportunity.raw?.startDate || "").substring(0, 10),
        visibility: (opportunity.raw?.is_private || opportunity.raw?.visibility === "private" || opportunity.visibility === "private") ? "private" : "public",
        accessCode: "", // We don't show the hashed key, or maybe leave it empty for no change
        capacity: opportunity.capacity || opportunity.raw?.capacity || 10,
        status: opportunity.status || opportunity.raw?.status || "pending",
        meals: opportunity.raw?.meals || opportunity.raw?.logistic?.meals || "",
        housing: opportunity.raw?.housing || opportunity.raw?.logistic?.housing || "",
        transport: opportunity.raw?.transport || opportunity.raw?.logistic?.transport || "",
        timeRange: opportunity.raw?.time_range || opportunity.raw?.logistic?.time_range || "",
        skills: skillsArr,
        tasks: tasksArr,
        impactDescription: opportunity.raw?.impact_description || opportunity.raw?.details?.impact_description || "",
      });

      // Handle existing images
      let images = [];
      const rawDetails = opportunity.raw?.details || {};
      const imgField = rawDetails.images_json || opportunity.raw?.images_json;
      if (imgField) {
        images = getParsedArray(imgField);
      } else if (opportunity.raw?.images) {
        images = Array.isArray(opportunity.raw.images)
          ? opportunity.raw.images
          : typeof opportunity.raw.images === "string"
            ? opportunity.raw.images.split(",").filter(Boolean)
            : [opportunity.raw.images];
      } else if (opportunity.image) {
        images = [opportunity.image];
      }
      // Clean up empty items or non-string items
      images = images.map(img => typeof img === 'string' ? img : img?.url || '').filter(Boolean);

      setExistingImages(images);
      setImageFiles([]);
      setImagePreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunity, open]);

  const resetLocalState = () => {
    setImageFiles([]);
    setImagePreviews([]);
    objectUrlRefs.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlRefs.current = [];
    if (errRef.current) errRef.current.textContent = "";
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const MAX_IMAGES = 6;

  const resolveImageUrl = (path) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    if (cleanPath.startsWith("/storage/")) {
      return `${apiBaseUrl}${cleanPath}`;
    }
    if (cleanPath.startsWith("/uploads/")) {
      return `${apiBaseUrl}${cleanPath}`;
    }
    return `${apiBaseUrl}/storage${cleanPath}`;
  };

  const onFiles = (files) => {
    const MAX = 5 * 1024 * 1024; // 5MB
    const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!files || files.length === 0) return;

    const totalExisting = existingImages.length + imageFiles.length;
    const remaining = MAX_IMAGES - totalExisting;
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

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      objectUrlRefs.current = objectUrlRefs.current.filter(
        (url) => url !== urlToRemove,
      );
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = [];
    if (!form.titleKh) missing.push("ចំណងជើង (KH)");
    if (!form.description) missing.push("ពិពណ៌នា");
    if (!form.locationKh) missing.push("ទីតាំង");
    if (!form.category_id) missing.push("ប្រភេទ");
    if (!form.dateISO) missing.push("កាលបរិច្ឆេទ");
    if (!form.capacity) missing.push("ចំនួនមុខតំណែង");
    if (!form.status) missing.push("ស្ថានភាព");

    if (missing.length > 0) {
      alert(`សូមបំពេញ៖ ${missing.join(", ")}`);
      return;
    }

    if (form.visibility === "private") {
      const wasPrivate = opportunity.raw?.is_private || opportunity.raw?.visibility === "private";
      if (!wasPrivate && (!form.accessCode || !form.accessCode.trim())) {
        alert("សូមបញ្ចូលកូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន");
        return;
      }
      if (form.accessCode && form.accessCode.trim().length < 8) {
        alert("កូដសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៨ ខ្ទង់");
        return;
      }
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        id: opportunity.id,
        imageFiles,
        existingImages,
        replace_images: true, // We want to replace with the remaining existing + new files
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !opportunity) return null;

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
            maxWidth: "720px",
            maxHeight: "90vh",
            overflowY: "hidden",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
            backgroundColor: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            color: "var(--color-text-primary)",
          }}
        >
          <div
            className="modal-header p-4 d-flex align-items-center justify-content-between"
            style={{
              background: "var(--color-bg-surface)",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
            }}
          >
            <h5 className="modal-title d-flex align-items-center gap-2 mb-0" style={{ color: "var(--color-text-primary)", fontSize: "1.15rem", fontWeight: "600" }}>
              <i className="bi bi-pencil-square fs-4" style={{ color: "var(--color-accent)" }}></i> កែប្រែឱកាសការងារ (Edit Opportunity)
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

          <form
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              flexGrow: 1,
            }}
          >
            <div
              className="modal-body p-4"
              style={{
                overflowY: "auto",
                flexGrow: 1,
              }}
            >
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="editOpTitleKh">
                  ចំណងជើងការងារ (KH)
                </label>
                <input
                  id="editOpTitleKh"
                  type="text"
                  className="form-control"
                  value={form.titleKh}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleKh: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="editOpTitleEn">
                  Job Title (EN)
                </label>
                <input
                  id="editOpTitleEn"
                  type="text"
                  className="form-control"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleEn: e.target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label
                  className="form-label fw-bold"
                  htmlFor="editOpDescription"
                >
                  ពិពណ៌នា
                </label>
                <textarea
                  id="editOpDescription"
                  className="form-control text-area-modern"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    htmlFor="editOpLocation"
                  >
                    ទីតាំង
                  </label>
                  <input
                    id="editOpLocation"
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
                  <label
                    className="form-label fw-bold"
                    htmlFor="editOpDateISO"
                  >
                    កាលបរិច្ឆេទចាប់ផ្តើម
                  </label>
                  <input
                    id="editOpDateISO"
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

              <div className="mb-3">
                <label
                  className="form-label fw-bold"
                  htmlFor="editOpCategory"
                >
                  ប្រភេទ / Category
                </label>
                <select
                  id="editOpCategory"
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

              {/* Visibility selection card */}
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
                      id="editVisPublic"
                      name="editVis"
                      checked={form.visibility === "public"}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="visibility-title">សាធារណៈ (Public)</div>
                      <div className="visibility-desc">បង្ហាញជាសាធារណៈសម្រាប់គ្រប់គ្នា</div>
                    </div>
                  </div>
                  <div
                    className={`visibility-card ${form.visibility === "private" ? "active" : ""}`}
                    onClick={() => setForm((f) => ({ ...f, visibility: "private" }))}
                  >
                    <input
                      type="radio"
                      id="editVisPrivate"
                      name="editVis"
                      checked={form.visibility === "private"}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="visibility-title">ឯកជន (Private)</div>
                      <div className="visibility-desc">ទាមទារកូដអញ្ជើញ ឬការអនុម័ត</div>
                    </div>
                  </div>
                </div>
              </div>

              {form.visibility === "private" && (
                <div className="mb-4">
                  <label className="form-label fw-bold" htmlFor="editAccessCode">
                    កូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន <span className="text-danger">*</span>
                  </label>
                  <input
                    id="editAccessCode"
                    type="text"
                    className="form-control"
                    placeholder="បញ្ចូលកូដសម្ងាត់ថ្មី (យ៉ាងតិច ៨ ខ្ទង់)"
                    value={form.accessCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accessCode: e.target.value }))
                    }
                  />
                  <small className="text-muted d-block mt-1">
                    ទុករន្ធទំនេរ បើមិនចង់ផ្លាស់ប្តូរកូដសម្ងាត់ចាស់។
                  </small>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    htmlFor="editCapacity"
                  >
                    ចំនួនមុខតំណែង
                  </label>
                  <input
                    id="editCapacity"
                    type="number"
                    className="form-control"
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
                  <label className="form-label fw-bold" htmlFor="editStatus">
                    ស្ថានភាព
                  </label>
                  <select
                    id="editStatus"
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    required
                  >
                    <option value="active">Available</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Extra Info: Transport, Housing, Meals */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label
                    className="form-label fw-bold"
                    htmlFor="editTimeRange"
                  >
                    ពេលវេលា (ឧ. 8:00 AM - 5:00 PM)
                  </label>
                  <input
                    id="editTimeRange"
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
                  <label
                    className="form-label fw-bold"
                    htmlFor="editTransport"
                  >
                    ការដឹកជញ្ជូន
                  </label>
                  <input
                    id="editTransport"
                    type="text"
                    className="form-control"
                    placeholder="ឧ. មានឡានដឹក"
                    value={form.transport}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, transport: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="editHousing">
                    កន្លែងស្នាក់នៅ
                  </label>
                  <input
                    id="editHousing"
                    type="text"
                    className="form-control"
                    placeholder="ឧ. ផ្តល់កន្លែងស្នាក់នៅ"
                    value={form.housing}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, housing: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" htmlFor="editMeals">
                    អាហារ
                  </label>
                  <input
                    id="editMeals"
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
              <div className="border-top pt-3 mt-3">
                <h6 className="section-title">
                  ព័ត៌មានលម្អិតបន្ថែម (Advanced)
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    ជំនាញដែលត្រូវការ (Skills)
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
                      className="btn-tag-add"
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
                  <div className="d-flex flex-wrap gap-2">
                    {form.skills &&
                      form.skills.map((s, i) => (
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

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    ភារកិច្ចសំខាន់ៗ (Tasks)
                  </label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ឧ. រៀបចំកម្មវិធី"
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
                      className="btn-tag-add"
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
                  <div className="d-flex flex-wrap gap-2">
                    {form.tasks &&
                      form.tasks.map((t, i) => (
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

                <div className="mb-3">
                  <label
                    className="form-label fw-bold"
                    htmlFor="editImpactDescription"
                  >
                    ផលប៉ះពាល់នៃកម្មវិធី (Impact Description)
                  </label>
                  <textarea
                    id="editImpactDescription"
                    className="form-control text-area-modern"
                    rows={3}
                    placeholder="ពិពណ៌នាអំពីផលប៉ះពាល់ដែលអ្នកស្ម័គ្រចិត្តនឹងបង្កើត..."
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
              <div className="mb-3">
                <label className="form-label fw-bold d-flex align-items-center justify-content-between">
                  <span>រូបថតសកម្មភាព (Activity Photos)</span>
                  <span className={`badge ${(existingImages.length + imagePreviews.length) >= MAX_IMAGES ? 'bg-danger' : 'bg-secondary'}`}>
                    {existingImages.length + imagePreviews.length}/{MAX_IMAGES} រូប
                  </span>
                </label>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="small text-muted mb-2">
                      <i className="bi bi-images me-1"></i>រូបភាពបច្ចុប្បន្ន (ចុចលើ ✕ ដើម្បីលុប)
                    </p>
                    <div className="row g-2">
                      {existingImages.map((img, index) => (
                        <div className="col-4" key={`existing-${index}`}>
                          <div className="photo-preview-card">
                            <img
                              src={resolveImageUrl(img)}
                              className="img-thumbnail rounded-3 w-100"
                              alt={`Existing ${index + 1}`}
                              style={{ height: "110px", objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              className="remove-btn position-absolute top-0 end-0 m-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExistingImage(img);
                              }}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                            <div className="position-absolute bottom-0 start-0 m-1">
                              <span className="badge bg-secondary bg-opacity-80 small" style={{ fontSize: "0.6rem" }}>បច្ចុប្បន្ន</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New uploads dropzone */}
                {(existingImages.length + imagePreviews.length) < MAX_IMAGES && (
                  <>
                    <div
                      className="premium-dropzone text-center mb-3"
                      role="button"
                      onClick={() =>
                        document.getElementById("editOpImageInput")?.click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <i className="bi bi-images fs-3 mb-2 text-success"></i>
                      <div className="fw-bold" style={{ fontSize: "14px" }}>
                        ទាញរូបភាពមកទីនេះ ឬចុចជ្រើសរើសឯកសារ
                      </div>
                      <div className="small text-muted mt-1" style={{ fontSize: "11px" }}>
                        ចុចដើម្បីបន្ថែមរូបភាព (អតិបរមា {MAX_IMAGES - existingImages.length - imagePreviews.length} រូបទៀតបាន)
                      </div>
                    </div>
                    <input
                      type="file"
                      id="editOpImageInput"
                      className="d-none"
                      accept="image/*"
                      multiple
                      onChange={(e) => onFiles(e.target.files)}
                    />
                  </>
                )}

                {/* New image previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-2">
                    <p className="small text-muted mb-2">
                      <i className="bi bi-plus-circle me-1 text-primary"></i>រូបភាពថ្មី
                    </p>
                    <div className="row g-2">
                      {imagePreviews.map((preview, index) => (
                        <div className="col-4" key={`new-${index}`}>
                          <div className="photo-preview-card">
                            <img
                              src={preview}
                              className="img-thumbnail rounded-3 w-100"
                              alt={`New ${index + 1}`}
                              style={{
                                height: "110px",
                                objectFit: "cover",
                                border: "2px solid var(--bs-primary)",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: "22px", height: "22px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNewImage(index);
                              }}
                            >
                              <i className="bi bi-x small"></i>
                            </button>
                            <div className="position-absolute bottom-0 start-0 m-1">
                              <span className="badge badge-new small" style={{ fontSize: "0.6rem" }}>ថ្មី</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="invalid-feedback d-block" ref={errRef}></div>
                <small className="text-muted d-block mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  រូបភាពទី 1 នឹងបង្ហាញជារូបសំខាន់នៅក្នុងការ់ដ
                </small>
              </div>
            </div>

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
                បោះបង់
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
                    កំពុងរក្សាទុក...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i> រក្សាទុក
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
          background-color: var(--color-bg-input);
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 14px;
          color: var(--color-text-primary);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .form-control:focus, .form-select:focus {
          background-color: var(--color-bg-surface);
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px var(--color-accent-dim);
          color: var(--color-text-primary);
          outline: none;
        }
        .text-area-modern {
          resize: none;
          line-height: 1.5;
        }
        .visibility-card {
          border: 1.5px solid var(--color-border);
          background-color: var(--color-bg-input);
          border-radius: 16px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.25s ease;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .visibility-card:hover {
          border-color: var(--color-accent);
          background-color: var(--color-bg-card-hover);
        }
        .visibility-card.active {
          border-color: var(--color-accent);
          background-color: var(--color-accent-dim);
          box-shadow: 0 4px 12px var(--color-accent-glow);
        }
        .visibility-card input[type="radio"] {
          accent-color: var(--color-accent);
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .visibility-title {
          font-weight: 700;
          color: var(--color-text-primary);
          font-size: 14px;
        }
        .visibility-desc {
          font-size: 11px;
          color: var(--color-text-secondary);
        }
        .section-divider {
          border-top: 1.5px dashed var(--color-border);
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
          border: 1.5px solid var(--color-border);
          color: var(--color-text-primary);
          background: var(--color-bg-input);
          border-radius: 0 12px 12px 0;
          padding: 0 16px;
          transition: all 0.2s ease;
        }
        .btn-tag-add:hover {
          background-color: var(--color-accent);
          color: #000;
          border-color: var(--color-accent);
        }
        .form-control:has(+ .btn-tag-add) {
          border-radius: 12px 0 0 12px;
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
          border: 2px dashed var(--color-border);
          background-color: var(--color-bg-input);
          border-radius: 16px;
          padding: 30px;
          transition: all 0.25s ease;
        }
        .premium-dropzone:hover {
          background-color: var(--color-bg-card-hover);
          border-color: var(--color-accent);
          transform: translateY(-1px);
        }
        .premium-dropzone .fw-bold {
          color: var(--color-text-primary);
        }
        .premium-dropzone i {
          color: var(--color-accent) !important;
        }
        .photo-preview-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.25s ease;
          border: 2.5px solid var(--color-border);
        }
        .photo-preview-card:hover {
          transform: scale(1.02);
        }
        .photo-preview-card.thumbnail-selected {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-dim), 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        .img-thumbnail {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
        }
        .remove-btn {
          background: rgba(255, 77, 77, 0.9);
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
          background: var(--color-negative);
          transform: scale(1.1);
        }
        .btn-premium-cancel {
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-primary);
          padding: 10px 24px;
          border-radius: var(--radius-btn);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .btn-premium-cancel:hover {
          background: var(--color-bg-input);
          border-color: var(--color-border-hover);
        }
        .btn-premium-submit {
          border: none;
          background: var(--color-accent);
          color: #000;
          padding: 10px 28px;
          border-radius: var(--radius-btn);
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 12px var(--color-accent-dim);
          transition: all 0.25s ease;
        }
        .btn-premium-submit:hover {
          opacity: 0.88;
          box-shadow: 0 0 16px var(--color-accent-glow);
          transform: translateY(-1px);
        }
        .btn-premium-submit:active {
          transform: translateY(0);
        }
        .photo-preview-card .badge {
          background-color: var(--color-bg-base) !important;
          color: var(--color-text-primary) !important;
          border: 1px solid var(--color-border) !important;
          font-weight: 500;
        }
        .photo-preview-card .badge-new {
          background-color: var(--color-accent) !important;
          color: #000 !important;
          border: none !important;
          font-weight: 600;
        }
        .text-muted {
          color: var(--color-text-secondary) !important;
        }
        .border-top {
          border-top: 1px solid var(--color-border) !important;
        }
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }
        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: var(--color-border-hover);
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
