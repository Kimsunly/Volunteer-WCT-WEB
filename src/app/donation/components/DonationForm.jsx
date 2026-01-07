
// src/app/donation/components/DonationForm.jsx
"use client";

import React, { useState } from "react";

const AMOUNTS = [10, 25, 50, 100, 250, 500];

const CAUSES = [
  {
    id: "general",
    name: "គាំទ្រកម្មវិធីទូទៅ",
    icon: "bi bi-heart-fill",
    iconClass: "bg-danger-subtle text-danger",
    progress: 65,
    collected: 45000,
    target: 100000,
  },
  {
    id: "education",
    name: "អប់រំ",
    icon: "bi bi-mortarboard-fill",
    iconClass: "bg-primary-subtle text-primary",
    progress: 40,
    collected: 12000,
    target: 30000,
  },
  {
    id: "environment",
    name: "ការពារធម្មជាតិ",
    icon: "bi bi-tree-fill",
    iconClass: "bg-success-subtle text-success",
    progress: 62,
    collected: 62000,
    target: 100000,
  },
  {
    id: "community",
    name: "សហគមន៍",
    icon: "bi bi-people-fill",
    iconClass: "bg-purple-subtle text-purple",
    progress: 20,
    collected: 8000,
    target: 40000,
  },
];

export default function DonationForm() {
  const [form, setForm] = useState({
    donationType: "once", // once | monthly
    amount: 50,
    customAmount: "",
    cause: "general",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pay: "card", // card | bank
    news: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      donationType: form.donationType,
      amount: Number(form.amount) || 0,
      cause: form.cause,
      donor: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      pay: form.pay,
      news: form.news,
    };

    console.log("Donation payload:", payload);

    // TODO: replace with real API (e.g., /api/donate)
    // const res = await fetch("/api/donate", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    alert("បរិច្ចាគបានបញ្ជូន (Mock)");
  };

  return (
    <form className="donation-form-modern" onSubmit={handleSubmit}>
      {/* Donation Type */}
      <div className="mb-4">
        <h5 className="form-section-title">ផ្តល់ជំនួយរបស់អ្នក</h5>
        <div className="donation-type-selector">
          <div className="donation-type-option">
            <input
              type="radio"
              name="donationType"
              id="typeOnce"
              value="once"
              checked={form.donationType === "once"}
              onChange={handleChange}
            />
            <label htmlFor="typeOnce">
              <i className="bi bi-gift fs-3 mb-2"></i>
              <div className="fw-bold">១ ដង</div>
            </label>
          </div>
          <div className="donation-type-option">
            <input
              type="radio"
              name="donationType"
              id="typeMonthly"
              value="monthly"
              checked={form.donationType === "monthly"}
              onChange={handleChange}
            />
            <label htmlFor="typeMonthly">
              <i className="bi bi-graph-up fs-3 mb-2"></i>
              <div className="fw-bold">ប្រចាំខែ</div>
            </label>
          </div>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="mb-4">
        <label className="form-label fw-bold">ចំនួនទឹកប្រាក់</label>
        <div className="amount-grid">
          {AMOUNTS.map((amt) => (
            <div key={amt} className="amount-option">
              <input
                type="radio"
                name="amount"
                id={`amt${amt}`}
                value={amt}
                checked={String(form.amount) === String(amt) && !form.customAmount}
                onChange={() => handleAmountClick(amt)}
              />
              <label htmlFor={`amt${amt}`}>
                <span className="fw-bold fs-4">${amt}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="បញ្ចូលចំនួន"
              min="1"
              name="customAmount"
              value={form.customAmount}
              onChange={handleCustomAmount}
            />
          </div>
        </div>
      </div>

      {/* Cause Selection */}
      <div className="mb-4">
        <label className="form-label fw-bold">ជ្រើសរើសគោលបំណង</label>
        <div className="cause-grid">
          {CAUSES.map((c) => (
            <div key={c.id} className="cause-option">
              <input
                type="radio"
                name="cause"
                id={`cause-${c.id}`}
                value={c.id}
                checked={form.cause === c.id}
                onChange={handleChange}
              />
              <label htmlFor={`cause-${c.id}`}>
                <div className="cause-content">
                  <div className={`cause-icon ${c.iconClass}`}>
                    <i className={c.icon}></i>
                  </div>
                  <div className="cause-details">
                    <div className="cause-name">{c.name}</div>
                    <div className="cause-progress-mini">
                      <div className="fill" style={{ width: `${c.progress}%` }}></div>
                    </div>
                    <div className="cause-amounts">
                      <span>${c.collected.toLocaleString()}</span>
                      <span>${c.target.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Donor Information */}
      <div className="mb-4">
        <h6 className="form-section-title">ពត៌មានអ្នកបរិច្ចាគ</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="lastName">នាមត្រកូល</label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="firstName">នាមខ្លួន</label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email">អ៊ីមែល</label>
            <input
              id="email"
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">លេខទូរស័ព្ទ</label>
            <input
              id="phone"
              type="tel"
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="form-label fw-bold">វិធីទូទាត់</label>
        <div className="donation-type-selector">
          <div className="donation-type-option">
            <input
              type="radio"
              name="pay"
              id="payCard"
              value="card"
              checked={form.pay === "card"}
              onChange={handleChange}
            />
            <label htmlFor="payCard">
              <i className="bi bi-credit-card fs-3 mb-2"></i>
              <div className="fw-bold">កាត</div>
            </label>
          </div>
          <div className="donation-type-option">
            <input
              type="radio"
              name="pay"
              id="payBank"
              value="bank"
              checked={form.pay === "bank"}
              onChange={handleChange}
            />
            <label htmlFor="payBank">
              <i className="bi bi-bank fs-3 mb-2"></i>
              <div className="fw-bold">ធនាគារ</div>
            </label>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="news"
            name="news"
            checked={form.news}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="news">ទទួលព័ត៌មានថ្មីៗ</label>
        </div>
      </div>

      {/* Submit */}
      <div className="d-grid">
        <button
          className="btn btn-primary btn-lg"
          type="submit"
          style={{ borderRadius: 12, padding: "1rem", fontWeight: 700 }}
        >
          <i className="bi bi-heart-fill me-2"></i>
          បរិច្ចាគឥឡូវនេះ
        </button>
      </div>
    </form>
  );
}

