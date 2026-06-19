"use client";

import React, { useState, useRef, useEffect } from "react";

/**
 * CodeInput
 * - Standard multi-box OTP input field
 * - Numeric-only input, automatically shifts focus on typing/backspace/paste
 * - Responsive, clean, premium style matching the modern green theme
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
  const initialOtp = Array(length).fill("");
  if (defaultValue) {
    for (let i = 0; i < Math.min(defaultValue.length, length); i++) {
      initialOtp[i] = defaultValue[i];
    }
  }
  const [otp, setOtp] = useState(initialOtp);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Autofocus the first field on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Capture the latest digit entered
    const char = cleanValue.substring(cleanValue.length - 1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-focus next input if valid character entered
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index]) {
        // If current is empty, focus and clear the previous input
        if (index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "ArrowRight") {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const cleanData = pastedData.replace(/[^0-9]/g, "").slice(0, length);
    if (!cleanData) return;

    const newOtp = [...otp];
    for (let i = 0; i < cleanData.length; i++) {
      newOtp[i] = cleanData[i];
    }
    setOtp(newOtp);

    // Focus the last filled input
    const focusIndex = Math.min(cleanData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="col-12">
      <label
        htmlFor={`${id}-0`}
        className="form-label text-center d-block w-100 mb-3"
        style={{ fontWeight: 600 }}
      >
        {label}
      </label>

      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={index === 0 ? `${id}-0` : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className="otp-digit-input form-control"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Hidden input to store complete value for standard form submittal/DOM retrieval */}
      <input type="hidden" id={id} name={id} value={otp.join("")} />

      <div className="invalid-feedback text-center">
        សូមបញ្ចូលកូដត្រឹមត្រូវ {length} ខ្ទង់
      </div>
    </div>
  );
}
