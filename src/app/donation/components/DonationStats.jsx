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

  return (
    <div className="row g-4 mt-5">
      <div className="col-6 col-md-3" ref={donors.ref}>
        <div className="donation-stat-card text-center p-4 h-100">
          <span className="stat-number d-block fs-1 fw-bold text-primary">
            {donors.value.toLocaleString()}
          </span>
          <span className="stat-label d-block mt-2">អ្នកបរិច្ចាគសកម្ម</span>
        </div>
      </div>

      <div className="col-6 col-md-3" ref={amount.ref}>
        <div className="donation-stat-card text-center p-4 h-100">
          <span className="stat-number d-block fs-1 fw-bold text-primary">
            ${amount.value.toLocaleString()}
          </span>
          <span className="stat-label d-block mt-2">ចំនួនទឹកប្រាក់សរុប</span>
        </div>
      </div>

      <div className="col-6 col-md-3" ref={projects.ref}>
        <div className="donation-stat-card text-center p-4 h-100">
          <span className="stat-number d-block fs-1 fw-bold text-primary">
            {projects.value.toLocaleString()}
          </span>
          <span className="stat-label d-block mt-2">គម្រោងបានគាំទ្រ</span>
        </div>
      </div>

      <div className="col-6 col-md-3" ref={beneficiaries.ref}>
        <div className="donation-stat-card text-center p-4 h-100">
          <span className="stat-number d-block fs-1 fw-bold text-primary">
            {beneficiaries.value.toLocaleString()}
          </span>
          <span className="stat-label d-block mt-2">អ្នកទទួលផលប្រយោជន៍</span>
        </div>
      </div>
    </div>
  );
}
