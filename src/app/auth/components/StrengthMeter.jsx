"use client";

import React, { useEffect, useState } from "react";

/**
 * StrengthMeter
 * - Password strength bar & text (Khmer labels)
 * - Accepts `passwordSelector` as DOM selector or `getPassword` function.
 */
export default function StrengthMeter({ getPassword }) {
  const [strength, setStrength] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => {
      const password = getPassword?.() || "";
      let score = 0;
      if (password.length >= 6) score += 25;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
      if (/[0-9]/.test(password)) score += 25;
      if (/[^a-zA-Z0-9]/.test(password)) score += 25;
      setStrength(score);

      if (score <= 25) setText("ខ្សោយ");
      else if (score <= 50) setText("មធ្យម");
      else if (score <= 75) setText("ល្អ");
      else setText("រឹងមាំ");
    };

    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [getPassword]);

  const barStyle = {
    width: `${strength}%`,
    background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)",
    transition: "width 0.3s ease",
  };

  return (
    <div style={{ marginTop: -8 }}>
      <small style={{ color: "#666", fontWeight: 600 }}>
        កម្លាំងពាក្យសម្ងាត់:
      </small>
      <div
        className="progress"
        style={{
          height: 8,
          borderRadius: 10,
          marginTop: 6,
          background: "#e8ecef",
        }}
      >
        <div className="progress-bar" role="progressbar" style={barStyle}></div>
      </div>
      <small style={{ color: "#999", fontSize: 12 }}>{text}</small>
    </div>
  );
}
