// src/app/donation/components/BloodDonateModal.jsx
"use client";

import React, { useState } from "react";

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

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const okAge = isValidAge(form.dob);
    setAgeInvalid(!okAge);
    setValidated(true);
    if (!okAge) return;

    // Mock success
    alert("✅ Registration submitted!");
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
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-droplet-fill me-2 text-danger"></i>{" "}
              ចុះឈ្មោះបរិច្ចាគឈាម
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className={validated ? "was-validated" : ""}
          >
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label">
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
                  <div className="invalid-feedback">សូមបញ្ចូលឈ្មោះ</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
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
                  <div className="invalid-feedback">អ៊ីមែលមិនត្រឹមត្រូវ</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
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
                  <label htmlFor="dob" className="form-label">
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
                  <div className="invalid-feedback">
                    អាយុត្រូវនៅចន្លោះ 18–60 ឆ្នាំ
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="bloodType" className="form-label">
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
                  <div className="invalid-feedback">សូមជ្រើសរើសប្រភេទឈាម</div>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      id="agree"
                      name="agree"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.agree}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="agree">
                      ខ្ញុំយល់ព្រមនឹងលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព
                    </label>
                    <div className="invalid-feedback">ត្រូវតែយល់ព្រម</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                បិទ
              </button>
              <button type="submit" className="btn btn-danger">
                <i className="bi bi-droplet-fill me-1"></i> បញ្ជូនការចុះឈ្មោះ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
