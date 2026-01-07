
// src/app/donation/components/DonationCard.jsx
"use client";

import React, { useEffect, useRef } from "react";

export default function DonationCard({
  image,
  badge,
  title,
  location,
  description,
  progress,
  actions = [],
  bloodTypes = [],
  onInfo,
  onRegister,
}) {
  const barRef = useRef(null);

  // Animate progress bar width on mount
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const targetWidth = `${progress.percent}%`;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.width = targetWidth;
    }, 250);
    return () => clearTimeout(t);
  }, [progress?.percent]);

  return (
    <div className={`donation-card-modern ${bloodTypes.length ? "blood-donation-card" : ""}`}>
      <div className="card-image-wrapper">
        <img src={image} alt={title} />
        <span className={`card-badge ${badge.className}`}>
          <i className={badge.icon}></i>
          {badge.text}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title-modern">{title}</h3>
        <p className="card-location">
          <i className="bi bi-geo-alt-fill"></i> {location}
        </p>
        <p className="card-description">{description}</p>

        <div className="donation-progress-section">
          <div className="donation-progress-info">
            <span>
              <strong>
                {progress.unit === "ចុះឈ្មោះ"
                  ? progress.collected.toLocaleString()
                  : `$${progress.collected.toLocaleString()}`}
              </strong>{" "}
              {progress.unit === "ចុះឈ្មោះ" ? "ចុះឈ្មោះ" : "បានប្រមូល"}
            </span>
            <span>
              គោលដៅ{" "}
              <strong>
                {progress.unit === "ចុះឈ្មោះ"
                  ? progress.goal.toLocaleString()
                  : `$${progress.goal.toLocaleString()}`}
              </strong>
            </span>
          </div>
          <div className="donation-progress-bar">
            <div ref={barRef} className="progress-fill"></div>
          </div>
        </div>

        {bloodTypes.length > 0 && (
          <div className="blood-types">
            {bloodTypes.map((t) => (
              <span key={t} className="blood-type-badge">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="donation-card-actions">
          {actions.map((a, idx) => {
            if (a.type === "info") {
              return (
                <button key={idx} className="btn btn-outline-primary" onClick={onInfo}>
                  <i className="bi bi-info-circle me-1"></i> ព័ត៌មាន
                </button>
              );
            }
            if (a.type === "donate") {
              return (
                <button key={idx} className="btn btn-primary">
                  <i className="bi bi-heart-fill me-1"></i> បរិច្ចាគ
                </button>
              );
            }
            if (a.type === "map") {
              return (
                <a
                  key={idx}
                  className="btn btn-outline-light"
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-map me-1"></i> ស្វែងរកទីតាំង
                </a>
              );
            }
            if (a.type === "register") {
              return (
                <button key={idx} className="btn btn-light text-danger" onClick={onRegister}>
                  <i className="bi bi-droplet-fill me-1"></i> ចុះឈ្មោះ
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

