"use client";

import React from "react";
import Image from "next/image";

export default function ProfileHeader({ user, onOpenSettings }) {
  const { name, avatar, tierLabel, notifCount, providers = [] } = user;

  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case "google":
        return "/images/Icon/search.png";
      case "github":
        return "/images/Icon/github.png";
      case "facebook":
        return "/images/Icon/facebook.png";
      default:
        return null;
    }
  };

  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="vh-avatar">
        <Image src={avatar} alt="avatar" width={80} height={80} unoptimized />
      </div>

      <div>
        <h3 className="mb-1">{name}</h3>
        <div className="d-flex align-items-center gap-2 small">
          <span className="badge rounded-pill text-bg-warning-subtle text-warning fw-semibold">
            {tierLabel}
          </span>
        </div>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <a className="position-relative text-decoration-none" href="#">
          <i className="bi bi-bell fs-5"></i>
          {notifCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notifCount}
            </span>
          )}
        </a>

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
