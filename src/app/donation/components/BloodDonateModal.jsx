
// src/app/donation/components/BloodDonateModal.jsx
"use client";

import React, { useState } from "react";
import { createBloodDonation } from "@/services/donations";
import toast from "react-hot-toast";

function isValidAge(dobStr) {
  if (!dobStr) return false;
  const dob = new Date(dobStr);
  const ageMs = Date.now() - dob.getTime();
  const age = new Date(ageMs).getUTCFullYear() - 1970;
  return age >= 18 && age <= 60;
}

export default function BloodDonateModal({ open, onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    bloodType: "",
    agree: true,
  });
  const [validated, setValidated] = useState(false);
  const [ageInvalid, setAgeInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const okAge = isValidAge(form.dob);
    setAgeInvalid(!okAge);
    setValidated(true);
    if (!okAge) return;

    if (!form.fullName || !form.email || !form.bloodType || !form.agree) {
      return;
    }

    try {
      setSubmitting(true);
      // Map to API payload (snake_case)
      const payload = {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        dob: form.dob,
        blood_type: form.bloodType,
        agree: form.agree
      };

      await createBloodDonation(payload);

      toast.success("✅ បានចុះឈ្មោះដោយជោគជ័យ! យើងនឹងទាក់ទងទៅអ្នកឆាប់ៗនេះ។");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        bloodType: "",
        agree: true,
      });
      setValidated(false);
      onClose();
    } catch (err) {
      console.error("Failed to register blood donation:", err);
      toast.error("បរាជ័យក្នុងការចុះឈ្មោះ សូមព្យាយាមម្តងទៀត");
    } finally {
      setSubmitting(false);
    }
  };

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
              className="modal-title fw-bold m-0 d-flex align-items-center gap-2"
              style={{ color: "var(--color-text-primary)", fontSize: "1.5rem" }}
            >
              <i className="bi bi-droplet-fill text-danger"></i> ចុះឈ្មោះបរិច្ចាគឈាម
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

          <form
            onSubmit={handleSubmit}
            noValidate
            className={validated ? "was-validated" : ""}
          >
            {/* Body */}
            <div className="modal-body p-4 p-md-5 overflow-auto" style={{ maxHeight: "70vh" }}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label mb-2">
                    ឈ្មោះពេញ
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback mt-2">សូមបញ្ចូលឈ្មោះ</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label mb-2">
                    អ៊ីមែល
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback mt-2">អ៊ីមែលមិនត្រឹមត្រូវ</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label mb-2">
                    លេខទូរស័ព្ទ
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="dob" className="form-label mb-2">
                    ថ្ងៃខែឆ្នាំកំណើត
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    className={`form-control ${ageInvalid ? "is-invalid" : ""}`}
                    value={form.dob}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback mt-2">
                    អាយុត្រូវនៅចន្លោះ 18–60 ឆ្នាំ
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="bloodType" className="form-label mb-2">
                    ប្រភេទឈាម
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    className="form-select"
                    value={form.bloodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">ជ្រើសរើស</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                  <div className="invalid-feedback mt-2">សូមជ្រើសរើសប្រភេទឈាម</div>
                </div>

                <div className="col-12 mt-4">
                  <div className="form-check d-flex align-items-center gap-2">
                    <input
                      id="agree"
                      name="agree"
                      type="checkbox"
                      className="form-check-input m-0"
                      checked={form.agree}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="agree">
                      ខ្ញុំយល់ព្រមនឹងលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព
                    </label>
                  </div>
                  <div className="invalid-feedback mt-2">ត្រូវតែយល់ព្រម</div>
                </div>
              </div>
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
                disabled={submitting}
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
              <button
                type="submit"
                className="btn px-4 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2"
                disabled={submitting}
                style={{
                  background: "linear-gradient(135deg, #FF4D4D 0%, #dc3545 100%)",
                  borderColor: "#FF4D4D",
                  color: "#FFFFFF",
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    កំពុងបញ្ជូន...
                  </>
                ) : (
                  <>
                    <i className="bi bi-droplet-fill"></i> បញ្ជូនការចុះឈ្មោះ
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
