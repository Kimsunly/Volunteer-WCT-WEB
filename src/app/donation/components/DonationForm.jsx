// src/app/donation/components/DonationForm.jsx
"use client";

import React, { useState } from "react";
import { createDonation } from "@/services/donations";
import { showToast } from "@/components/common/CustomToaster";

const AMOUNTS = [10, 25, 50, 100, 250, 500];

const CAUSES = [
  {
    id: "general",
    name: "គាំទ្រកម្មវិធីទូទៅ",
    icon: "bi bi-heart-fill",
    color: "danger",
    progress: 65,
    collected: 45000,
    target: 100000,
  },
  {
    id: "education",
    name: "អប់រំ",
    icon: "bi bi-mortarboard-fill",
    color: "primary",
    progress: 40,
    collected: 12000,
    target: 30000,
  },
  {
    id: "environment",
    name: "ការពារធម្មជាតិ",
    icon: "bi bi-tree-fill",
    color: "success",
    progress: 62,
    collected: 62000,
    target: 100000,
  },
  {
    id: "community",
    name: "សហគមន៍",
    icon: "bi bi-people-fill",
    color: "purple",
    progress: 20,
    collected: 8000,
    target: 40000,
  },
];

export default function DonationForm() {
  const [form, setForm] = useState({
    donationType: "once",
    amount: 50,
    customAmount: "",
    cause: "general",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    news: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmountClick = (val) => {
    setForm((prev) => ({ ...prev, amount: val, customAmount: "" }));
  };

  const handleCustomAmount = (e) => {
    const v = e.target.value;
    setForm((prev) => ({
      ...prev,
      customAmount: v,
      amount: v ? Number(v) : prev.amount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      donor_name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      amount: Number(form.amount) || 0,
      cause: form.cause,
      donation_type: form.donationType,
      payment_method: "card",
    };

    try {
      await createDonation(payload);
      showToast.success("សូមអរគុណសម្រាប់ការបរិច្ចាគរបស់លោកអ្នក! យើងបានទទួលព័ត៌មានរួចហើយ។", "ជោគជ័យ");
      // Reset form fields
      setForm({
        donationType: "once",
        amount: 50,
        customAmount: "",
        cause: "general",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        news: true,
      });
    } catch (err) {
      console.error("Donation error:", err);
      showToast.error("បរាជ័យក្នុងការបញ្ជូនការបរិច្ចាគ។ សូមព្យាយាមម្តងទៀត។", "កំហុស");
    }
  };

  return (
    <form
      className="p-4 p-md-5 bg-white border border-light"
      style={{
        borderRadius: "28px",
        boxShadow: "0 24px 70px rgba(0, 0, 0, 0.05)",
      }}
      onSubmit={handleSubmit}
    >
      {/* Form Header */}
      <div className="mb-4 text-center text-md-start">
        <h3 className="fw-bold mb-1 d-flex align-items-center justify-content-center justify-content-md-start gap-2" style={{ color: "#111827", letterSpacing: "-0.75px" }}>
          <span className="d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: "38px", height: "38px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
            <i className="bi bi-heart-fill fs-5"></i>
          </span>
          ចូលរួមចំណែកជាមួយស្ម័គ្រចិត្ត
        </h3>
        <p className="text-muted small mb-0 mt-2">រាល់ការបរិច្ចាគរបស់លោកអ្នក នឹងជួយគាំទ្រដល់សកម្មភាពសង្គមផ្សេងៗ</p>
      </div>

      {/* Donation Type: Segmented Switch Container */}
      <div className="mb-4">
        <div 
          className="d-flex p-1 rounded-4 position-relative" 
          style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
        >
          <button
            type="button"
            className={`flex-fill py-2.5 px-3 rounded-3 border-0 fw-bold transition-all d-flex align-items-center justify-content-center gap-2 ${
              form.donationType === "once"
                ? "bg-white shadow-sm"
                : "bg-transparent text-secondary"
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, donationType: "once" }))
            }
            style={{ 
              fontSize: "0.95rem",
              color: form.donationType === "once" ? "#2d6a4f" : "#6b7280",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            <i className="bi bi-gift-fill"></i>
            ១ ដង
          </button>
          <button
            type="button"
            className={`flex-fill py-2.5 px-3 rounded-3 border-0 fw-bold transition-all d-flex align-items-center justify-content-center gap-2 ${
              form.donationType === "monthly"
                ? "bg-white shadow-sm"
                : "bg-transparent text-secondary"
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, donationType: "monthly" }))
            }
            style={{ 
              fontSize: "0.95rem",
              color: form.donationType === "monthly" ? "#2d6a4f" : "#6b7280",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >
            <i className="bi bi-calendar-check-fill"></i>
            ប្រចាំខែ
          </button>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="mb-4">
        <label className="form-label small fw-bold mb-2" style={{ color: "#4b5563" }}>
          ចំនួនទឹកប្រាក់បរិច្ចាគ (Amount)
        </label>
        <div className="row g-3 mb-3">
          {AMOUNTS.map((amt) => {
            const isSelected = String(form.amount) === String(amt) && !form.customAmount;
            return (
              <div key={amt} className="col-4 col-md-2">
                <button
                  type="button"
                  className="w-100 py-2.5 rounded-3 border fw-semibold amount-btn"
                  onClick={() => handleAmountClick(amt)}
                  style={{
                    fontSize: "0.95rem",
                    background: isSelected ? "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)" : "#ffffff",
                    borderColor: isSelected ? "transparent" : "#e5e7eb",
                    color: isSelected ? "#ffffff" : "#374151",
                    boxShadow: isSelected ? "0 8px 16px rgba(45, 106, 79, 0.2)" : "none",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  ${amt}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Amount input */}
        <div
          className="input-group align-items-center px-3 rounded-3 custom-amount-wrapper"
          style={{ 
            border: "1px solid #e5e7eb", 
            backgroundColor: "#ffffff", 
            transition: "all 0.2s ease",
            boxShadow: form.customAmount ? "0 0 0 3px rgba(45, 106, 79, 0.15)" : "none",
            borderColor: form.customAmount ? "#2d6a4f" : "#e5e7eb"
          }}
        >
          <span
            className="fw-bold"
            style={{ fontSize: "1.1rem", color: form.customAmount ? "#2d6a4f" : "#9ca3af" }}
          >
            $
          </span>
          <input
            type="number"
            className="form-control border-0 bg-transparent py-2.5 ms-2"
            placeholder="បញ្ចូលចំនួនទឹកប្រាក់ផ្សេងទៀត..."
            min="1"
            name="customAmount"
            value={form.customAmount}
            onChange={handleCustomAmount}
            style={{ 
              boxShadow: "none",
              fontSize: "0.95rem",
              color: "#1f2937",
              fontWeight: form.customAmount ? "600" : "400"
            }}
          />
        </div>
      </div>

      {/* Cause Selection */}
      <div className="mb-4">
        <label className="form-label small fw-bold mb-2" style={{ color: "#4b5563" }}>
          ជ្រើសរើសគោលបំណង (Select Purpose)
        </label>
        <div className="row g-3">
          {CAUSES.map((c) => {
            const isSelected = form.cause === c.id;
            
            // Map colors to explicit RGBA styles for contrast logic
            const themeColors = {
              danger: { base: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", lightBg: "rgba(239, 68, 68, 0.03)" },
              primary: { base: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", lightBg: "rgba(59, 130, 246, 0.03)" },
              success: { base: "#10b981", bg: "rgba(16, 185, 129, 0.1)", lightBg: "rgba(16, 185, 129, 0.03)" },
              purple: { base: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)", lightBg: "rgba(139, 92, 246, 0.03)" }
            }[c.color] || { base: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", lightBg: "rgba(59, 130, 246, 0.03)" };

            return (
              <div key={c.id} className="col-12 col-md-6">
                <button
                  type="button"
                  className="w-100 p-3 rounded-4 border text-start transition-all duration-200 card-hover-effect position-relative"
                  style={{
                    backgroundColor: isSelected ? themeColors.lightBg : "#ffffff",
                    borderColor: isSelected ? themeColors.base : "#e5e7eb",
                    borderWidth: isSelected ? "1.5px" : "1px",
                    borderStyle: "solid",
                    boxShadow: isSelected ? `0 10px 25px -5px ${themeColors.bg}` : "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.005)"
                  }}
                  onClick={() => setForm((prev) => ({ ...prev, cause: c.id }))}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div 
                      className="position-absolute"
                      style={{
                        top: "12px",
                        right: "12px",
                        color: themeColors.base,
                        fontSize: "1.1rem",
                        lineHeight: 1
                      }}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-3">
                    {/* Circle icon container using absolute explicit styling to prevent browser defaults */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        backgroundColor: themeColors.bg,
                        color: themeColors.base
                      }}
                    >
                      <i className={c.icon} style={{ fontSize: "1.15rem" }}></i>
                    </div>
                    
                    <div className="flex-grow-1 min-w-0 pe-3">
                      <div className="fw-bold text-dark text-truncate" style={{ fontSize: "0.95rem" }}>
                        {c.name}
                      </div>
                      
                      {/* Dynamic Progress Bar */}
                      <div className="progress mt-2 bg-light" style={{ height: "4px", borderRadius: "10px" }}>
                        <div
                          className="progress-bar transition-all duration-500"
                          style={{ 
                            width: `${c.progress}%`,
                            backgroundColor: themeColors.base,
                            borderRadius: "10px"
                          }}
                        ></div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-1 text-muted" style={{ fontSize: "0.75rem" }}>
                        <span>${c.collected.toLocaleString()}</span>
                        <span className="fw-medium">${c.target.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donor Information */}
      <div className="mb-4">
        <label className="form-label small fw-bold mb-2" style={{ color: "#4b5563" }}>
          ព័ត៌មានអ្នកបរិច្ចាគ (Donor Details)
        </label>
        <div className="row g-3">
          <div className="col-md-6">
            <div>
              <span className="small text-secondary mb-1 d-block fw-semibold" style={{ fontSize: "0.8rem" }}>នាមត្រកូល (Last Name) <span className="text-danger">*</span></span>
              <div className="input-group align-items-center px-3 rounded-3 form-input-wrapper" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff", transition: "all 0.2s ease" }}>
                <i className="bi bi-person text-muted me-2" style={{ fontSize: "1rem" }}></i>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2.5"
                  name="lastName"
                  placeholder="ឧ. សុខ"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  style={{ boxShadow: "none", fontSize: "0.9rem", color: "#1f2937" }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <span className="small text-secondary mb-1 d-block fw-semibold" style={{ fontSize: "0.8rem" }}>នាមខ្លួន (First Name) <span className="text-danger">*</span></span>
              <div className="input-group align-items-center px-3 rounded-3 form-input-wrapper" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff", transition: "all 0.2s ease" }}>
                <i className="bi bi-person text-muted me-2" style={{ fontSize: "1rem" }}></i>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2.5"
                  name="firstName"
                  placeholder="ឧ. ដារ៉ា"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  style={{ boxShadow: "none", fontSize: "0.9rem", color: "#1f2937" }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <span className="small text-secondary mb-1 d-block fw-semibold" style={{ fontSize: "0.8rem" }}>អ៊ីមែល (Email) <span className="text-danger">*</span></span>
              <div className="input-group align-items-center px-3 rounded-3 form-input-wrapper" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff", transition: "all 0.2s ease" }}>
                <i className="bi bi-envelope text-muted me-2" style={{ fontSize: "1rem" }}></i>
                <input
                  type="email"
                  className="form-control border-0 bg-transparent py-2.5"
                  name="email"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ boxShadow: "none", fontSize: "0.9rem", color: "#1f2937" }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <span className="small text-secondary mb-1 d-block fw-semibold" style={{ fontSize: "0.8rem" }}>លេខទូរស័ព្ទ (Phone Number)</span>
              <div className="input-group align-items-center px-3 rounded-3 form-input-wrapper" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff", transition: "all 0.2s ease" }}>
                <i className="bi bi-telephone text-muted me-2" style={{ fontSize: "1rem" }}></i>
                <input
                  type="tel"
                  className="form-control border-0 bg-transparent py-2.5"
                  name="phone"
                  placeholder="012 345 678"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ boxShadow: "none", fontSize: "0.9rem", color: "#1f2937" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="d-grid mt-4">
        <button
          className="btn text-white fw-bold py-3 rounded-4 hover-scale d-flex align-items-center justify-content-center gap-2"
          type="submit"
          style={{
            background: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)",
            fontSize: "1.05rem",
            border: "none",
            boxShadow: "0 8px 24px rgba(45, 106, 79, 0.2)",
            transition: "all 0.2s ease-in-out"
          }}
        >
          <i className="bi bi-heart-fill"></i>
          បរិច្ចាគឥឡូវនេះ ${Number(form.amount || 0).toLocaleString()}
        </button>
      </div>

      <style jsx>{`
        .amount-btn:hover {
          background-color: #f3f4f6 !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-1px);
        }
        .custom-amount-wrapper:focus-within {
          border-color: #2d6a4f !important;
          box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15) !important;
        }
        .form-input-wrapper:focus-within {
          border-color: #2d6a4f !important;
          box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15) !important;
        }
        .form-input-wrapper:focus-within i {
          color: #2d6a4f !important;
        }
        .card-hover-effect {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04) !important;
        }
        .hover-scale {
          transition: all 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 28px rgba(45, 106, 79, 0.3) !important;
        }
      `}</style>
    </form>
  );
}
