"use client";

import React, { useEffect, useRef } from "react";

export default function SidebarSelectedCause({ cause }) {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const target = `${cause.percent}%`;
    el.style.width = "0%";
    const t = setTimeout(() => (el.style.width = target), 250);
    return () => clearTimeout(t);
  }, [cause?.percent]);

  return (
    <>
      <h6>
        <i className="bi bi-bullseye me-2"></i>
        គោលបំណងដែលបានជ្រើសរើស
      </h6>
      <div className="cause-content">
        <div className="cause-icon bg-danger-subtle text-danger">
          <i className="bi bi-heart-fill"></i>
        </div>
        <div className="cause-details">
          <div className="cause-name">{cause.name}</div>
          <small className="text-secondary d-block mb-2">{cause.description}</small>
          <div className="cause-progress-mini">
            <div ref={barRef} className="fill"></div>
          </div>
          <div className="cause-amounts mt-2">
            <span>${cause.collected.toLocaleString()}</span>
            <span>${cause.target.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
