// src/app/donation/components/DonationStats.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Count-up on visible using IntersectionObserver
 */
function useCountUp(target) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 1600;
            const step = Math.max(1, Math.floor(target / (duration / 16)));
            let current = 0;
            const tick = () => {
              current += step;
              if (current < target) {
                setValue(current);
                requestAnimationFrame(tick);
              } else {
                setValue(target);
              }
            };
            tick();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, value };
}

export default function DonationStats() {
  const donors = useCountUp(1250);
  const amount = useCountUp(245000);
  const projects = useCountUp(87);
  const beneficiaries = useCountUp(15000);

  const statColors = [
    { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
    { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb" },
    { bg: "#fef3c7", border: "#fcd34d", text: "#d97706" },
    { bg: "#fdf4ff", border: "#e879f9", text: "#c026d3" }
  ];

  const stats = [
    { ...donors, label: "អ្នកបរិច្ចាគសកម្ម", prefix: "", color: statColors[0] },
    { ...amount, label: "ចំនួនទឹកប្រាក់សរុប", prefix: "$", color: statColors[1] },
    { ...projects, label: "គម្រោងបានគាំទ្រ", prefix: "", color: statColors[2] },
    { ...beneficiaries, label: "អ្នកទទួលផលប្រយោជន៍", prefix: "", color: statColors[3] }
  ];

  return (
    <div className="row g-4 mt-5">
      {stats.map((stat, index) => (
        <div className="col-6 col-md-3" key={index} ref={stat.ref}>
          <div 
            className="text-center p-5 h-100"
            style={{
              background: stat.color.bg,
              border: `2px solid ${stat.color.border}`,
              borderRadius: "24px",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span 
              className="d-block fw-bold"
              style={{ 
                color: stat.color.text,
                fontSize: "3rem"
              }}
            >
              {stat.prefix}{stat.value.toLocaleString()}
            </span>
            <span 
              className="d-block mt-2 fw-medium"
              style={{ color: "#475569", fontSize: "1rem" }}
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
