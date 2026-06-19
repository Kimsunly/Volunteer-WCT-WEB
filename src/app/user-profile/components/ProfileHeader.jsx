"use client";

import React from "react";
import Image from "next/image";

export default function ProfileHeader({ user, onOpenSettings }) {
  const { name, avatar, tierLabel, status } = user;

  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="vh-avatar">
        <Image src={avatar} alt="avatar" width={80} height={80} unoptimized />
      </div>

      <div>
        <h3 className="mb-1 d-flex align-items-center gap-2">
          {name}
          {status === "pending" && (
            <i
              className="bi bi-hourglass-split text-warning animate-pulse"
              title="រង់ចាំការអនុម័តជាអ្នករៀបចំ"
              style={{ fontSize: "1.1rem" }}
            ></i>
          )}
        </h3>
        <div className="d-flex align-items-center gap-2 small">
          <span className="badge rounded-pill text-bg-warning-subtle text-warning fw-semibold">
            {tierLabel}
          </span>
          {status === "pending" && (
            <span className="badge rounded-pill bg-warning-subtle text-warning fw-semibold border border-warning-subtle d-inline-flex align-items-center gap-1">
              <i className="bi bi-clock-history"></i>
              រង់ចាំការអនុម័តជាអ្នករៀបចំ (Pending Organizer Approval)
            </span>
          )}
        </div>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        {/* Gear icon opens settings modal */}
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={onOpenSettings}
          aria-label="Account settings"
          title="Account settings"
        >
          <i className="bi bi-gear fs-5"></i>
        </button>
      </div>
    </div>
  );
}
