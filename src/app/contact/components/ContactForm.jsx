"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: replace with real API endpoint
    // Example:
    // const res = await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });

    console.log("Submit payload:", form);

    alert("បានបញ្ជូនសារ! (Mock)");
    // Optionally clear after success:
    // setForm({ lastName: "", firstName: "", email: "", phone: "", message: "" });
  };

  const handleReset = () => {
    setForm({
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Last name */}
        <div className="col-12 col-xl-6">
          <div className="mb-4 form-floating">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              placeholder="នាមត្រកូល"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastName">នាមត្រកូល</label>
          </div>
        </div>

        {/* First name */}
        <div className="col-12 col-xl-6">
          <div className="mb-4 form-floating">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              placeholder="នាមខ្លួន"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="firstName">នាមខ្លួន</label>
          </div>
        </div>

        {/* Email */}
        <div className="col-12">
          <div className="mb-4 form-floating">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="អ៊ីម៉ែល"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">អ៊ីម៉ែល</label>
          </div>
        </div>

        {/* Phone */}
        <div className="col-12">
          <div className="mb-4 form-floating">
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="លេខទូរស័ព្ទ"
              value={form.phone}
              onChange={handleChange}
            />
            <label htmlFor="phone">លេខទូរស័ព្ទ</label>
          </div>
        </div>

        {/* Message */}
        <div className="col-12">
          <div className="form-floating">
            <textarea
              className="form-control"
              id="message"
              name="message"
              placeholder="ផ្ញើសារ..."
              style={{ height: "160px" }}
              value={form.message}
              onChange={handleChange}
              required
            />
            <label htmlFor="message">ផ្ញើសារ...</label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3">
        <button type="submit" className="btn btn-primary fw-bold">
          បញ្ជូន
        </button>
        <button
          type="button"
          className="btn btn-secondary fw-bold ms-2"
          onClick={handleReset}
        >
          បោះបង់
        </button>
      </div>
    </form>
  );
}
