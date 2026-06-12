"use client";

import React, { useState } from "react";

/**
 * PasswordField
 * - Replaces inline JS togglePasswordVisibility(...)
 *
 * Props:
 * - id, label, placeholder, defaultValue, minLength, required
 */
export default function PasswordField({
  id = "password",
  label = "ពាក្យសម្ងាត់",
  placeholder = "បញ្ចូលពាក្យសម្ងាត់",
  defaultValue = "",
  minLength = 6,
  required = true,
}) {
  const [type, setType] = useState("password");
  const toggle = () => setType((t) => (t === "password" ? "text" : "password"));

  return (
    <div className="col-12">
      <div className="password-field-container">
        <input
          type={type}
          className="auth-modern-input w-100"
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          minLength={minLength}
          required={required}
        />
        <i
          className={`bi ${type === "password" ? "bi-eye" : "bi-eye-slash"} password-toggle-icon`}
          role="button"
          aria-label="Toggle password visibility"
          onClick={toggle}
        />
      </div>
      {required && (
        <div className="invalid-feedback">
          សូមបញ្ចូលពាក្យសម្ងាត់
          {minLength ? `យ៉ាងហោចណាស់ ${minLength} តួអក្សរ` : ""}!
        </div>
      )}
    </div>
  );
}
``;
