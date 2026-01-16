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
  onView,
  onEdit,
  onDelete,
  onStatusUpdate,
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
          <i className="bi bi-plus-lg me-1"></i> បន្ថែមឱកាស
        </button>
      </div>

      {items.map((op, idx) => (
        <div
          key={op.id}
          className="vh-card p-3 mb-3 vh-hover border rounded shadow-sm bg-white"
          data-aos="fade-right"
          data-aos-delay={idx * 100}
        >
          <div className="d-flex align-items-center flex-wrap flex-md-nowrap">
            <Image
              className="vh-op-img me-3 rounded mb-2 mb-md-0"
              src={op.image}
              alt=""
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold h5 mb-0 text-dark">{op.titleKh}</div>
                  <small className="text-muted">{op.titleEn}</small>
                </div>
                <div className="ms-2">
                  <select
                    className="form-select form-select-sm"
                    value={op.status}
                    onChange={(e) => onStatusUpdate && onStatusUpdate(op.id, e.target.value)}
                    style={{ width: "auto" }}
                  >
                    <option value="active">សកម្ម (Active)</option>
                    <option value="pending">រង់ចាំ (Pending)</option>
                    <option value="closed">បិទ (Closed)</option>
                  </select>
                </div>
              </div>
              <div className="vh-op-line mt-2 text-secondary">
                <i className="fa-regular fa-calendar me-1"></i> {op.dateKh}{" "}
                <span className="mx-2">|</span>
                <i className="fa-solid fa-location-dot me-1"></i> {op.locationKh}{" "}
                <span className="mx-2">|</span>
                <i className="fa-solid fa-user-group me-1"></i> {op.current}/
                {op.capacity} នាក់
              </div>
              <div className="mt-1">
                <small className="text-muted">ការចុះឈ្មោះ: {op.registrations || 0}</small>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
            <button
              className="btn btn-sm btn-outline-info d-flex align-items-center"
              onClick={() => onView && onView(op)}
            >
              <i className="bi bi-eye me-1"></i> លម្អិត
            </button>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center"
              onClick={() => onEdit && onEdit(op)}
            >
              <i className="bi bi-pencil me-1"></i> កែប្រែ
            </button>
            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center"
              onClick={() => onDelete && onDelete(op.id)}
            >
              <i className="bi bi-trash me-1"></i> លុប
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
