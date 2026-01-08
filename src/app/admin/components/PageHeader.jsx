"use client";

import React from "react";

/**
 * PageHeader (only in-page header — global navbar/footer are ignored)
 * Props:
 * - title: string
 * - subtitle: string
 * - actions: React node (e.g., buttons)
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h4 className="mb-0">{title}</h4>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </div>
      {actions}
    </div>
  );
}
