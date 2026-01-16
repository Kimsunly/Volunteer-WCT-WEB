// src/app/org/dashboard/components/panes/ApplicationsPane.jsx
"use client";

import React from "react";
import Image from "next/image";
function StatusChip({ status }) {
  if (status === "pending")
    return (
      <span className="status-badge status-pending">
        <i className="bi bi-clock me-1"></i> កំពុងរង់ចាំ
      </span>
    );
  if (status === "approved")
    return (
      <span className="status-badge status-approved">
        <i className="bi bi-check-circle me-1"></i> បានអនុម័ត
      </span>
    );
  return (
    <span className="status-badge status-rejected">
      <i className="bi bi-x-circle me-1"></i> បានបដិសេធ
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
  const [selectedApp, setSelectedApp] = React.useState(null);

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
            <i className="bi bi-search"></i>
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
                      onClick={() => setSelectedApp(app)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    <button
                      className="btn btn-outline-warning"
                      title="កំពុងរង់ចាំ / Pending"
                      onClick={() => onPending(app.id)}
                      disabled={app.status === "pending"}
                    >
                      <i className="bi bi-hourglass-split"></i>
                    </button>

                    <button
                      className="btn btn-outline-success"
                      title="អនុម័ត / Approve"
                      onClick={() => onApprove(app.id)}
                      disabled={app.status === "approved"}
                    >
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      title="បដិសេធ / Reject"
                      onClick={() => onReject(app.id)}
                      disabled={app.status === "rejected"}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Applicant Details Modal */}
      {selectedApp && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
          onClick={() => setSelectedApp(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 shadow-lg border-0">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">ព័ត៌មានអ្នកដាក់ពាក្យ</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedApp(null)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-4">
                  <Image
                    src={selectedApp.avatar}
                    width={80}
                    height={80}
                    className="rounded-circle object-fit-cover me-3"
                    alt="Avatar"
                  />
                  <div>
                    <h4 className="mb-0">{selectedApp.nameKh}</h4>
                    <div className="text-muted">{selectedApp.email}</div>
                    <div className="text-muted">{selectedApp.phone_number || "គ្មានលេខទូរស័ព្ទ"}</div>
                  </div>
                  <div className="ms-auto text-end">
                    <StatusChip status={selectedApp.status} />
                    <div className="small text-muted mt-1">{selectedApp.dateKh}</div>
                  </div>
                </div>

                <div className="row g-3">
                  {/* Bio/Intro - Full Width */}
                  <div className="col-12">
                    <div className="p-3 bg-light rounded-3">
                      <h6 className="fw-bold mb-2"><i className="bi bi-person-lines-fill me-2"></i>អំពីខ្ញុំ (Bio)</h6>
                      <p className="mb-0 text-break">{selectedApp.bio || "មិនទាន់មានព័ត៌មាន"}</p>
                    </div>
                  </div>

                  {/* Skills & Interests */}
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-tools me-2"></i>ជំនាញ (Skills)</h6>
                      <p className="mb-0 text-break">{selectedApp.skills || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-heart me-2"></i>ចំណាប់អារម្មណ៍ (Interests)</h6>
                      <p className="mb-0 text-break">{selectedApp.interests || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-mortarboard me-2"></i>ការសិក្សា (Education)</h6>
                      <p className="mb-0 text-break">{selectedApp.education || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-briefcase me-2"></i>បទពិសោធន៍ (Experience)</h6>
                      <p className="mb-0 text-break">{selectedApp.experience || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>

                  {/* Contact & Availability */}
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-clock me-2"></i>ពេលវេលាទំនេរ (Availability)</h6>
                      <p className="mb-0 text-break">{selectedApp.availability || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold mb-2"><i className="bi bi-geo-alt me-2"></i>អាសយដ្ឋាន (Address)</h6>
                      <p className="mb-0 text-break">{selectedApp.address || "មិនបានបញ្ជាក់"}</p>
                    </div>
                  </div>

                  {/* Application Message */}
                  <div className="col-12">
                    <div className="p-3 bg-primary-subtle rounded-3">
                      <h6 className="fw-bold mb-2 text-primary"><i className="bi bi-chat-quote-fill me-2"></i>សារភ្ជាប់ជាមួយពាក្យស្នើសុំ</h6>
                      <p className="mb-0 text-break fst-italic">"{selectedApp.message || "គ្មានសារ"}"</p>
                    </div>
                  </div>

                  {selectedApp.cv_url && (
                    <div className="col-12">
                      <a
                        href={selectedApp.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary w-100"
                      >
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        មើលប្រវត្តិរូបសង្ខេប (CV)
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>បិទ</button>
                {selectedApp.status === "pending" && (
                  <>
                    <button className="btn btn-success" onClick={() => { onApprove(selectedApp.id); setSelectedApp(null); }}>អនុម័ត</button>
                    <button className="btn btn-danger" onClick={() => { onReject(selectedApp.id); setSelectedApp(null); }}>បដិសេធ</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
``;
