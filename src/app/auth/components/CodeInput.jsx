"use client";

import React, { useState } from "react";

/**
 * CodeInput
 * - Numeric-only input with fixed length and big letter-spacing style
 *
 * Props:
 * - id, length, label, placeholder, defaultValue
 */
export default function CodeInput({
  id = "code",
  length = 6,
  label = "បញ្ចូលកូដ",
  placeholder = "បញ្ចូលកូដ",
  defaultValue = "",
}) {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => {
    const next = e.target.value.replace(/[^0-9]/g, "").slice(0, length);
    setValue(next);
  };

  return (
    <div className="col-12">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type="text"
        className="form-control text-center"
        id={id}
        placeholder={`${placeholder} ${length} ខ្ទង់`}
        value={value}
        onChange={onChange}
        maxLength={length}
        pattern={`[0-9]{${length}}`}
        style={{ fontSize: 24, fontWeight: 700, letterSpacing: 8 }}
        required
      />
      <div className="invalid-feedback text-center">
        សូមបញ្ចូលកូដត្រឹមត្រូវ {length} ខ្ទង់
      </div>
    </div>
  );
}
``;
