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
          <div className={`stat-card-box stat-card-box-${index} text-center py-4 px-2 h-100`}>
            <span className="stat-number d-block fw-bold">
              {stat.prefix}{stat.value.toLocaleString()}
            </span>
            <span className="stat-label d-block mt-2 fw-medium">
              {stat.label}
            </span>
          </div>
        </div>
      ))}

      <style jsx>{`
        .stat-card-box {
          border-radius: 24px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .stat-card-box:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
        }
        
        .stat-number {
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          line-height: 1.2;
        }

        .stat-label {
          color: #475569;
          font-size: 0.95rem;
        }

        /* Color variations in light theme (default) */
        .stat-card-box-0 { background: #f0fdf4; border: 2px solid #bbf7d0; }
        .stat-card-box-0 .stat-number { color: #16a34a; }
        
        .stat-card-box-1 { background: #eff6ff; border: 2px solid #bfdbfe; }
        .stat-card-box-1 .stat-number { color: #2563eb; }
        
        .stat-card-box-2 { background: #fef3c7; border: 2px solid #fcd34d; }
        .stat-card-box-2 .stat-number { color: #d97706; }
        
        .stat-card-box-3 { background: #fdf4ff; border: 2px solid #e879f9; }
        .stat-card-box-3 .stat-number { color: #c026d3; }

        /* Color variations in dark theme */
        :global([data-theme="dark"]) .stat-card-box-0 { background: rgba(22, 163, 74, 0.1) !important; border-color: rgba(22, 163, 74, 0.2) !important; }
        :global([data-theme="dark"]) .stat-card-box-0 .stat-number { color: #4ade80 !important; }
        
        :global([data-theme="dark"]) .stat-card-box-1 { background: rgba(37, 99, 235, 0.1) !important; border-color: rgba(37, 99, 235, 0.2) !important; }
        :global([data-theme="dark"]) .stat-card-box-1 .stat-number { color: #60a5fa !important; }
        
        :global([data-theme="dark"]) .stat-card-box-2 { background: rgba(217, 119, 6, 0.1) !important; border-color: rgba(217, 119, 6, 0.2) !important; }
        :global([data-theme="dark"]) .stat-card-box-2 .stat-number { color: #fbbf24 !important; }
        
        :global([data-theme="dark"]) .stat-card-box-3 { background: rgba(192, 38, 211, 0.1) !important; border-color: rgba(192, 38, 211, 0.2) !important; }
        :global([data-theme="dark"]) .stat-card-box-3 .stat-number { color: #f472b6 !important; }

        :global([data-theme="dark"]) .stat-label {
          color: var(--color-text-secondary) !important;
        }
      `}</style>
    </div>
  );
}
