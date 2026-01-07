// src/app/org/dashboard/components/panes/OpportunitiesPane.jsx
"use client";

import React from "react";
import Image from "next/image";

function StatusBadge({ status }) {
  if (status === "active")
    return <span className="vh-badge vh-badge--success">សកម្ម</span>;
  if (status === "pending")
    return <span className="vh-badge vh-badge--warning">កំពុង</span>;
  return <span className="vh-badge vh-badge--danger">បិទ</span>;
}

export default function OpportunitiesPane({
  items,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  onCreate,
}) {
  return (
    <div className="tab-pane fade show active" id="opportunities">
      <div
        className="d-flex flex-wrap align-items-center gap-2 mb-3"
        data-aos="fade-up"
      >
        <div className="vh-search-wrap flex-grow-1">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            className="form-control vh-search"
            placeholder="ស្វែងរកឱកាស…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
        >
          <option value="all">ស្ថានភាពទាំងអស់</option>
          <option value="active">Available</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
        <button className="btn btn-primary" onClick={onCreate}>
          បន្ថែមឱកាស
        </button>
      </div>

      {items.map((op, idx) => (
        <div
          key={op.id}
          className="vh-card p-3 mb-3 vh-hover"
          data-aos="fade-right"
          data-aos-delay={idx * 100}
        >
          <div className="d-flex align-items-center">
            <Image
              className="vh-op-img me-3"
              src={op.image}
              alt=""
              width={64}
              height={64}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{op.titleKh}</div>
              <small>{op.titleEn}</small>
              <div className="vh-op-line mt-1">
                <i className="fa-regular fa-calendar"></i> {op.dateKh}{" "}
                &nbsp;•&nbsp;
                <i className="fa-solid fa-location-dot"></i> {op.locationKh}{" "}
                &nbsp;•&nbsp;
                <i className="fa-solid fa-user-group"></i> {op.current}/
                {op.capacity}
              </div>
              <small>ការចុះឈ្មោះ: {op.registrations}</small>
            </div>
            <StatusBadge status={op.status} />
          </div>
          <div className="d-flex justify-content-end vh-row-actions mt-2">
            <i className="fa-regular fa-eye" title="View"></i>
            <i className="fa-regular fa-pen-to-square ms-2" title="Edit"></i>
            <i className="fa-regular fa-trash-can ms-2" title="Delete"></i>
            <i className="fa-solid fa-download ms-2" title="Export"></i>
          </div>
        </div>
      ))}
    </div>
  );
}
