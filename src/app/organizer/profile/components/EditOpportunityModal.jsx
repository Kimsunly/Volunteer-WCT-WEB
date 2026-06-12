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
    <div
      className="modal fade show"
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={handleClose}
      ></div>
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        style={{ zIndex: 1060 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div
            className="modal-header p-4 text-white d-flex align-items-center justify-content-between"
            style={{
              background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
              borderBottom: "none",
            }}
          >
            <h5 className="modal-title d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-pencil-square fs-4"></i> កែប្រែឱកាសការងារ (Edit Opportunity)
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

          <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="modal-body p-4">
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
                      <div className="fw-bold text-dark fs-6" style={{ fontSize: "14px" }}>សាធារណៈ (Public)</div>
                      <div className="small text-muted" style={{ fontSize: "11px" }}>បង្ហាញជាសាធារណៈសម្រាប់គ្រប់គ្នា</div>
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
                      <div className="fw-bold text-dark fs-6" style={{ fontSize: "14px" }}>ឯកជន (Private)</div>
                      <div className="small text-muted" style={{ fontSize: "11px" }}>ទាមទារកូដអញ្ជើញ ឬការអនុម័ត</div>
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
                      <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>
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
                              <span className="badge bg-primary bg-opacity-80 small" style={{ fontSize: "0.6rem" }}>ថ្មី</span>
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

            <div className="modal-footer border-0 justify-content-end p-4">
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
          background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
          border-bottom: none;
        }
        .btn-close-custom {
          background: transparent;
          border: none;
          color: white;
          opacity: 0.8;
          font-size: 1.25rem;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-close-custom:hover {
          opacity: 1;
          transform: rotate(90deg);
        }
        .form-label {
          color: #374151;
          font-size: 13.5px;
          margin-bottom: 6px;
        }
        .form-control, .form-select {
          background-color: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 14px;
          color: #1f2937;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .form-control:focus, .form-select:focus {
          background-color: white;
          border-color: #2d6a4f;
          box-shadow: 0 0 0 4px rgba(45, 106, 79, 0.12);
          outline: none;
        }
        .text-area-modern {
          resize: none;
          line-height: 1.5;
        }
        .visibility-card {
          border: 1.5px solid #e5e7eb;
          background-color: #f9fafb;
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
          border-color: #2d6a4f;
          background-color: #f4fbf7;
        }
        .visibility-card.active {
          border-color: #2d6a4f;
          background-color: #f4fbf7;
          box-shadow: 0 4px 12px rgba(45, 106, 79, 0.06);
        }
        .visibility-card input[type="radio"] {
          accent-color: #2d6a4f;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .section-divider {
          border-top: 1.5px dashed #e5e7eb;
          margin-top: 28px;
          margin-bottom: 24px;
          padding-top: 20px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #1b4332;
          margin-bottom: 18px;
        }
        .btn-tag-add {
          border: 1.5px solid #2d6a4f;
          color: #2d6a4f;
          background: transparent;
          border-radius: 0 12px 12px 0;
          padding: 0 16px;
          transition: all 0.2s ease;
        }
        .btn-tag-add:hover {
          background-color: #2d6a4f;
          color: white;
        }
        .form-control:has(+ .btn-tag-add) {
          border-radius: 12px 0 0 12px;
        }
        .badge-tag {
          font-size: 12px;
          transition: all 0.2s ease;
        }
        .badge-tag i {
          font-size: 13.5px;
          transition: color 0.15s ease;
        }
        .badge-tag i:hover {
          color: #ef4444 !important;
        }
        .premium-dropzone {
          border: 2px dashed #a3b899;
          background-color: #f4fbf7;
          border-radius: 16px;
          padding: 30px;
          transition: all 0.25s ease;
        }
        .premium-dropzone:hover {
          background-color: #eaf7f0;
          border-color: #2d6a4f;
          transform: translateY(-1px);
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
          border-color: #2d6a4f;
          box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.25), 0 4px 10px rgba(0, 0, 0, 0.08);
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
          background: #f3f4f6;
          color: #4b5563;
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .btn-premium-cancel:hover {
          background: #e5e7eb;
          color: #1f2937;
        }
        .btn-premium-submit {
          border: none;
          background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%);
          color: white;
          padding: 10px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);
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
    </div>
  );
}
