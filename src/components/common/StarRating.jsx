"use client";

import React from "react";

export default function StarRating({
  value = 0,
  onChange,
  size = "md",
  readOnly = false,
  title,
}) {
  const stars = [];
  const rating = Math.min(Math.max(value || 0, 0), 5);
  const fontSize = size === "sm" ? "0.85rem" : size === "lg" ? "1.15rem" : "1rem";

  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating;
    const half = !filled && i - 0.5 <= rating;

    stars.push(
      <button
        key={i}
        type="button"
        className="btn btn-link p-0 border-0 text-warning lh-1"
        style={{
          fontSize,
          cursor: readOnly || !onChange ? "default" : "pointer",
          opacity: readOnly && rating === 0 ? 0.35 : 1,
        }}
        disabled={readOnly || !onChange}
        title={title}
        onClick={() => onChange?.(i)}
        onMouseEnter={(e) => {
          if (!readOnly && onChange) {
            e.currentTarget.parentElement
              ?.querySelectorAll("button")
              .forEach((btn, idx) => {
                const icon = btn.querySelector("i");
                if (!icon) return;
                icon.className =
                  idx < i ? "bi bi-star-fill" : "bi bi-star";
              });
          }
        }}
        onMouseLeave={(e) => {
          if (!readOnly && onChange) {
            e.currentTarget.parentElement
              ?.querySelectorAll("button")
              .forEach((btn, idx) => {
                const icon = btn.querySelector("i");
                if (!icon) return;
                const starValue = idx + 1;
                if (starValue <= rating) {
                  icon.className = "bi bi-star-fill";
                } else if (starValue - 0.5 <= rating) {
                  icon.className = "bi bi-star-half";
                } else {
                  icon.className = "bi bi-star";
                }
              });
          }
        }}
      >
        <i
          className={`bi ${
            filled ? "bi-star-fill" : half ? "bi-star-half" : "bi-star"
          }`}
        />
      </button>,
    );
  }

  return (
    <span className="d-inline-flex align-items-center gap-0 vh-stars">
      {stars}
    </span>
  );
}
