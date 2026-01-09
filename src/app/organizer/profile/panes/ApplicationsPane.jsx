// src/app/org/dashboard/components/panes/ApplicationsPane.jsx
"use client";

import React from "react";
import Image from "next/image";
function StatusChip({ status }) {
  if (status === "pending")
    return (
      <span className="status-badge status-pending">
        <i className="fa-regular fa-clock me-1"></i> កំពុងរង់ចាំ
      </span>
    );
  if (status === "approved")
    return (
      <span className="status-badge status-approved">
        <i className="fa-regular fa-circle-check me-1"></i> បានអនុម័ត
      </span>
    );
  return (
    <span className="status-badge status-rejected">
      <i className="fa-regular fa-circle-xmark me-1"></i> បានបដិសេធ
    </span>
  );
}

export default function ApplicationsPane({
  items,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  onApprove,
  onReject,
  onPending,
}) {
  return (
    <div className="tab-pane fade show active" id="applications">
      <div
        className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2"
        data-aos="fade-up"
      >
        <div>
          <h5 className="mb-0">បញ្ជីការដាក់ពាក្យ</h5>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="vh-search-wrap" style={{ minWidth: 180 }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              className="form-control vh-search"
              placeholder="ស្វែងរកឈ្មោះ…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ minWidth: 140 }}
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            <option value="">ស្ថានភាពទាំងអស់</option>
            <option value="pending">កំពុងរង់ចាំ</option>
            <option value="approved">បានអនុម័ត</option>
            <option value="rejected">បានបដិសេធ</option>
          </select>
        </div>
      </div>

      <div className="table-responsive" data-aos="fade-up" data-aos-delay="100">
        <table className="table align-middle mb-0 vh-table">
          <thead>
            <tr>
              <th>អ្នកស្ម័គ្រចិត្ត</th>
              <th>ការងារ</th>
              <th>កាលបរិច្ឆេទ</th>
              <th>ស្ថានភាព</th>
              <th className="text-end">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {items.map((app, idx) => (
              <tr
                key={app.id}
                data-aos="fade-up"
                data-aos-delay={(idx + 2) * 100}
              >
                <td data-label="អ្នកស្ម័គ្រចិត្ត">
                  <div className="d-flex align-items-center gap-2">
                    <Image
                      className="rounded-circle object-fit-cover"
                      src={app.avatar}
                      width="44"
                      height="44"
                      alt={`${app.nameEn} avatar`}
                    />
                    <div>
                      <div className="fw-semibold">{app.nameKh}</div>
                      <small>{app.nameEn}</small>
                    </div>
                  </div>
                </td>
                <td data-label="ការងារ">
                  <div className="fw-medium">{app.jobKh}</div>
                  <small>{app.meta}</small>
                </td>
                <td data-label="កាលបរិច្ឆេទ">
                  <span>{app.dateKh}</span>
                </td>
                <td data-label="ស្ថានភាព">
                  <StatusChip status={app.status} />
                </td>
                <td className="text-end" data-label="សកម្មភាព">
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Row actions"
                  >
                    <button
                      className="btn btn-outline-secondary"
                      title="មើល / View"
                    >
                      <i className="fa-regular fa-eye"></i>
                    </button>

                    <button
                      className="btn btn-outline-warning"
                      title="កំពុងរង់ចាំ / Pending"
                      onClick={() => onPending(app.id)}
                      disabled={app.status === "pending"}
                    >
                      កំពុង
                    </button>

                    <button
                      className="btn btn-outline-success"
                      title="អនុម័ត / Approve"
                      onClick={() => onApprove(app.id)}
                      disabled={app.status === "approved"}
                    >
                      អនុម័ត
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      title="បដិសេធ / Reject"
                      onClick={() => onReject(app.id)}
                      disabled={app.status === "rejected"}
                    >
                      បដិសេធ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
``;
