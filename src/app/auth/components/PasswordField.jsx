"use client";

import React, { useState } from "react";

/**
 * PasswordField
 * - Replaces inline JS togglePasswordVisibility(...)
 * - Supports both controlled (value/onChange) and uncontrolled (defaultValue) modes
 *
 * Props:
 * - id, label, placeholder, value, onChange, defaultValue, minLength, required
 */
export default function PasswordField({
  id = "password",
  label = "ពាក្យសម្ងាត់",
  placeholder = "បញ្ចូលពាក្យសម្ងាត់",
  value,
  onChange,
  defaultValue = "",
  minLength = 6,
  required = true,
}) {
  const [type, setType] = useState("password");
  const toggle = () => setType((t) => (t === "password" ? "text" : "password"));

  // Determine if this is a controlled component
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className="col-12">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          className="form-control"
          id={id}
          placeholder={placeholder}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={onChange}
          minLength={minLength}
          required={required}
        />
        <i
          className={`bi ${type === "password" ? "bi-eye" : "bi-eye-slash"} password-toggle`}
          role="button"
          aria-label="Toggle password visibility"
          onClick={toggle}
          style={{ cursor: "pointer" }}
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
