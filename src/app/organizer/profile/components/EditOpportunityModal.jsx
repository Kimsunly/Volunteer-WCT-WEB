// src/app/organizer/profile/components/EditOpportunityModal.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { listCategories } from "@/services/categories";

export default function EditOpportunityModal({ open, onClose, onSubmit, opportunity }) {
    const [form, setForm] = useState({
        titleKh: "",
        titleEn: "",
        description: "",
        locationKh: "ភ្នំពេញ",
        category: "environment",
        dateISO: "",
        visibility: "public",
        accessCode: "",
        capacity: 10,
        status: "pending",
        meals: "",
        timeRange: "",
        skills: [],
        tasks: [],
        impactDescription: ""
    });

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
            setForm({
                titleKh: opportunity.titleKh || "",
                titleEn: opportunity.titleEn || "",
                description: opportunity.raw?.description || "",
                locationKh: opportunity.locationKh || "ភ្នំពេញ",
                category: opportunity.raw?.category_label || "environment",
                dateISO: opportunity.raw?.date_range || "",
                visibility: opportunity.raw?.is_private ? "private" : "public",
                accessCode: "", // We don't show the hashed key, or maybe leave it empty for no change
                capacity: opportunity.capacity || 10,
                status: opportunity.status || "pending",
                meals: opportunity.raw?.meals || "",
                timeRange: opportunity.raw?.time_range || "",
                skills: opportunity.raw?.skills || [],
                tasks: opportunity.raw?.tasks || [],
                impactDescription: opportunity.raw?.impact_description || "",
            });
            setImagePreview(opportunity.image || "");
        }
    }, [opportunity, open]);

    const resetLocalState = () => {
        setImageFile(null);
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
                id: opportunity.id,
                imageFile,
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
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div
                        className="modal-header p-4 text-white"
                        style={{
                            background: "linear-gradient(90deg, #4b6cb7, #182848)",
                            borderBottom: "none",
                        }}
                    >
                        <h5 className="modal-title d-flex align-items-center gap-2">
                            <i className="bi bi-pencil-square"></i> កែប្រែឱកាសការងារ
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                    </div>

                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                            <div className="mb-3">
                                <label className="form-label fw-medium" htmlFor="editOpTitleKh">
                                    ចំណងជើងការងារ (KH)
                                </label>
                                <input
                                    id="editOpTitleKh"
                                    type="text"
                                    className="form-control form-control-lg"
                                    value={form.titleKh}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, titleKh: e.target.value }))
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium" htmlFor="editOpTitleEn">
                                    Job Title (EN)
                                </label>
                                <input
                                    id="editOpTitleEn"
                                    type="text"
                                    className="form-control form-control-lg"
                                    value={form.titleEn}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, titleEn: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium" htmlFor="editOpDescription">
                                    ពិពណ៌នា
                                </label>
                                <textarea
                                    id="editOpDescription"
                                    className="form-control form-control-lg"
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
                                    <label className="form-label fw-medium" htmlFor="editOpLocation">
                                        ទីតាំង
                                    </label>
                                    <input
                                        id="editOpLocation"
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
                                    <label className="form-label fw-medium" htmlFor="editOpDateISO">
                                        កាលបរិច្ឆេទចាប់ផ្តើម
                                    </label>
                                    <input
                                        id="editOpDateISO"
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

                            <div className="mb-3">
                                <label className="form-label fw-medium" htmlFor="editOpCategory">
                                    ប្រភេទ / Category
                                </label>
                                <select
                                    id="editOpCategory"
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

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium" htmlFor="editCapacity">
                                        ចំនួនមុខតំណែង
                                    </label>
                                    <input
                                        id="editCapacity"
                                        type="number"
                                        className="form-control form-control-lg"
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
                                    <label className="form-label fw-medium" htmlFor="editStatus">
                                        ស្ថានភាព
                                    </label>
                                    <select
                                        id="editStatus"
                                        className="form-select form-select-lg"
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, status: e.target.value }))
                                        }
                                        required
                                    >
                                        <option value="active">Available</option>
                                        <option value="pending">Pending</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Extra Info: Transport, Housing, Meals */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-medium" htmlFor="editTimeRange">
                                        ពេលវេលា (ឧ. 8:00 AM - 5:00 PM)
                                    </label>
                                    <input
                                        id="editTimeRange"
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
                                    <label className="form-label fw-medium" htmlFor="editTransport">
                                        ការដឹកជញ្ជូន
                                    </label>
                                    <input
                                        id="editTransport"
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
                                    <label className="form-label fw-medium" htmlFor="editHousing">
                                        កន្លែងស្នាក់នៅ
                                    </label>
                                    <input
                                        id="editHousing"
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
                                    <label className="form-label fw-medium" htmlFor="editMeals">
                                        អាហារ
                                    </label>
                                    <input
                                        id="editMeals"
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
                                        {form.skills && form.skills.map((s, i) => (
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
                                        {form.tasks && form.tasks.map((t, i) => (
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
                                    <label className="form-label fw-medium" htmlFor="editImpactDescription">ផលប៉ះពាល់នៃកម្មវិធី (Impact Description)</label>
                                    <textarea
                                        id="editImpactDescription"
                                        className="form-control"
                                        rows={3}
                                        placeholder="ពិពណ៌នាអំពីផលប៉ះពាល់ដែលអ្នកស្ម័គ្រចិត្តនឹងបង្កើត..."
                                        value={form.impactDescription}
                                        onChange={(e) => setForm(f => ({ ...f, impactDescription: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">
                                    រូបភាពគម្រូ / គម្រោង
                                </label>
                                <div
                                    className="dropzone p-3 border border-dashed rounded-3 text-center"
                                    role="button"
                                    onClick={() => document.getElementById("editOpImageInput")?.click()}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="bi bi-cloud-arrow-up-fill fs-3 mb-2 text-muted"></i>
                                    <div className="small text-muted">ចុចដើម្បីផ្លាស់ប្តូររូបភាព</div>
                                </div>

                                <input
                                    type="file"
                                    id="editOpImageInput"
                                    className="d-none"
                                    accept="image/*"
                                    onChange={(e) => onFile(e.target.files?.[0])}
                                />

                                {imagePreview && (
                                    <div className="mt-3 text-center">
                                        <img
                                            src={imagePreview}
                                            className="img-thumbnail rounded"
                                            alt="Preview"
                                            style={{ maxHeight: "150px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}
                                <div className="invalid-feedback d-block" ref={errRef}></div>
                            </div>
                        </div>

                        <div className="modal-footer border-0 justify-content-end p-4">
                            <button
                                type="button"
                                className="btn btn-light btn-lg rounded-pill px-4"
                                onClick={handleClose}
                            >
                                បោះបង់
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-pill px-4"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
        </div>
    );
}
