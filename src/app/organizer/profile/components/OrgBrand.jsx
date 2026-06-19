"use client";

import React from "react";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";

export default function OrgBrand({ org, onCreate }) {
  const rating = Number(org.rating) || 0;
  const ratingCount = Number(org.ratingCount) || 0;

  return (
    <div
      className="Org-brand d-flex align-items-center mb-4 p-4 rounded-4 position-relative"
      data-aos="fade-down"
    >
      <div className="avatar-wrapper me-3">
        <Image
          src={org.logo}
          className="rounded-circle object-fit-cover"
          width="70"
          height="70"
          alt="Profile Logo"
          unoptimized
        />
      </div>
      <div>
        <h4 className="mb-1 d-flex align-items-center gap-2 fw-bold text-primary-theme">
          {org.nameKh}
          {org.isVerified && (
            <i
              className="bi bi-patch-check-fill"
              title="Verified Organizer"
              style={{ fontSize: "1.15rem", color: "#1877f2" }}
            ></i>
          )}
        </h4>
        <small className="text-secondary-theme d-block fw-medium">{org.nameEn}</small>
        {ratingCount > 0 ? (
          <div className="d-flex align-items-center gap-2 mt-1">
            <StarRating value={rating} readOnly size="sm" />
            <small className="text-muted-theme">
              {rating.toFixed(1)} ({ratingCount} វាយតម្លៃ)
            </small>
          </div>
        ) : (
          <small className="text-muted-theme d-block mt-1">មិនទាន់មានការវាយតម្លៃ</small>
        )}
      </div>
      <div className="ms-auto" data-aos="fade-left" data-aos-delay="200">
        <button className="btn btn-add-op" onClick={onCreate}>
          <i className="bi bi-plus-lg me-1"></i> បន្ថែមឱកាស
        </button>
      </div>

      <style jsx>{`
        .Org-brand {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-card) !important;
          border-radius: 20px !important;
          transition: all 0.3s ease;
        }
        .Org-brand:hover {
          border-color: var(--color-border-hover) !important;
        }

        .avatar-wrapper {
          border: 3px solid var(--color-border);
          border-radius: 50%;
          padding: 2px;
          background: var(--color-bg-base);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }
        .Org-brand:hover .avatar-wrapper {
          transform: scale(1.03);
          border-color: var(--color-accent);
        }

        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }
        .text-muted-theme {
          color: var(--color-text-muted) !important;
          font-size: 12.5px;
        }
        .text-accent-theme {
          color: var(--color-accent) !important;
        }

        .btn-add-op {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          border: none !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          padding: 10px 24px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 12px var(--color-accent-glow) !important;
          display: inline-flex;
          align-items: center;
        }
        :global([data-theme="light"]) .btn-add-op {
          color: #ffffff !important;
          background-color: #15803d !important;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
        }
        .btn-add-op:hover {
          transform: scale(1.03) translateY(-1px) !important;
          box-shadow: 0 6px 18px var(--color-accent-glow), 0 0 0 3px var(--color-accent-dim) !important;
        }
        :global([data-theme="light"]) .btn-add-op:hover {
          box-shadow: 0 6px 18px rgba(21, 128, 61, 0.35), 0 0 0 3px rgba(21, 128, 61, 0.15) !important;
        }
        .btn-add-op:active {
          transform: scale(0.98) translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
