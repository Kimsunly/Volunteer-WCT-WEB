"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminOrganizersPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [organizers, setOrganizers] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | verified | rejected | suspended
  const [detail, setDetail] = useState(null); // selected organizer detail

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    let data = storage.read("organizers", []);
    if (!data.length) {
      data = [
        {
          id: 1,
          orgName: "Khmer Youth Foundation",
          contactPerson: "Sok Dara",
          email: "dara@kyf.org",
          phone: "012-345-678",
          registrationNumber: "ORG-2025-001",
          address: "Phnom Penh, Cambodia",
          website: "https://kyf.org",
          description: "Youth empowerment and education",
          requestedAt: "2025-01-01",
          status: "pending",
        },
        {
          id: 2,
          orgName: "Green Cambodia",
          contactPerson: "Chan Sophea",
          email: "sophea@greencambodia.org",
          phone: "016-789-012",
          registrationNumber: "ORG-2024-456",
          address: "Siem Reap, Cambodia",
          website: "https://greencambodia.org",
          description: "Environmental conservation and sustainability",
          requestedAt: "2024-12-28",
          status: "verified",
          verifiedAt: "2024-12-30",
          verifiedBy: "Admin",
        },
        {
          id: 3,
          orgName: "Hope Center",
          contactPerson: "Lim Kosal",
          email: "kosal@hope.org",
          phone: "017-234-567",
          registrationNumber: "ORG-2025-002",
          address: "Battambang, Cambodia",
          website: "",
          description: "Community support and welfare",
          requestedAt: "2025-01-02",
          status: "pending",
        },
      ];
      storage.write("organizers", data);
    }
    queueMicrotask(() => setOrganizers(data));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return organizers;
    return organizers.filter((o) => o.status === filter);
  }, [organizers, filter]);

  const save = (next) => {
    setOrganizers(next);
    storage.write("organizers", next);
  };

  const viewDetail = (idx) => setDetail(filtered[idx]);

  const verifyOrganizer = (idx) => {
    const item = filtered[idx];
    const updated = organizers.map((o) =>
      o.id === item.id
        ? {
            ...o,
            status: "verified",
            verifiedAt: new Date().toISOString().slice(0, 10),
            verifiedBy: "Admin",
          }
        : o
    );
    save(updated);
  };

  const rejectOrganizer = (idx) => {
    const reason = prompt("មូលហេតុនៃការបដិសេធ:");
    if (!reason) return;
    const item = filtered[idx];
    const updated = organizers.map((o) =>
      o.id === item.id
        ? {
            ...o,
            status: "rejected",
            rejectedAt: new Date().toISOString().slice(0, 10),
            rejectedReason: reason,
          }
        : o
    );
    save(updated);
  };

  const suspendOrganizer = (idx) => {
    if (!confirm("ផ្អាក់អ្នករៀបចំនេះ?")) return;
    const item = filtered[idx];
    const updated = organizers.map((o) =>
      o.id === item.id
        ? {
            ...o,
            status: "suspended",
            suspendedAt: new Date().toISOString().slice(0, 10),
          }
        : o
    );
    save(updated);
  };

  const statusBadge = (s) => {
    const map = {
      verified: "success",
      rejected: "danger",
      pending: "warning",
      suspended: "secondary",
    };
    return (
      <span className={`status-badge bg-${map[s] || "secondary"} text-white`}>
        {s === "verified"
          ? "Verified"
          : s === "rejected"
            ? "Rejected"
            : s === "pending"
              ? "Pending"
              : "Suspended"}
      </span>
    );
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="ផ្ទៀងផ្ទាត់អ្នករៀបចំ"
        subtitle="Approve or reject organizer requests"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="organizers" />

          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="ផ្ទៀងផ្ទាត់អ្នករៀបចំ"
              subtitle="Approve or reject organizer verification requests"
              actions={
                <div className="d-flex gap-2">
                  {["all", "pending", "verified", "rejected"].map((s) => (
                    <button
                      key={s}
                      className={`btn btn-outline-${s === "pending" ? "warning" : s === "verified" ? "success" : s === "rejected" ? "danger" : "secondary"} pill`}
                      onClick={() => setFilter(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              <div className="admin-card p-3">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>អង្គការ</th>
                        <th>អ្នកទំនាក់ទំនង</th>
                        <th>អ៊ីមែល</th>
                        <th>ទូរស័ព្ទ</th>
                        <th>ថ្ងៃស្នើសុំ</th>
                        <th>ស្ថានភាព</th>
                        <th>សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!filtered.length ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-muted py-4"
                          >
                            គ្មានទិន្នន័យ
                          </td>
                        </tr>
                      ) : (
                        filtered.map((o, idx) => (
                          <tr key={o.id}>
                            <td>
                              <strong>{o.orgName}</strong>
                            </td>
                            <td>{o.contactPerson}</td>
                            <td>{o.email}</td>
                            <td>{o.phone}</td>
                            <td>{o.requestedAt}</td>
                            <td>{statusBadge(o.status)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm btn-outline-primary pill"
                                  onClick={() => viewDetail(idx)}
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                {o.status === "pending" && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success pill"
                                      onClick={() => verifyOrganizer(idx)}
                                      title="Approve"
                                    >
                                      <i className="bi bi-check-circle"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger pill"
                                      onClick={() => rejectOrganizer(idx)}
                                      title="Reject"
                                    >
                                      <i className="bi bi-x-circle"></i>
                                    </button>
                                  </>
                                )}
                                {o.status === "verified" && (
                                  <button
                                    className="btn btn-sm btn-warning pill"
                                    onClick={() => suspendOrganizer(idx)}
                                    title="Suspend"
                                  >
                                    <i className="bi bi-pause-circle"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detail Modal (inline) */}
              {detail && (
                <div
                  className="modal fade show"
                  style={{ display: "block" }}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="modal-backdrop fade show"
                    onClick={() => setDetail(null)}
                  ></div>
                  <div className="modal-dialog modal-lg">
                    <div
                      className="modal-content"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      <div
                        className="modal-header border-bottom"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <h5 className="modal-title">ព័ត៌មានលម្អិត</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setDetail(null)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <h6 className="text-primary mb-3">
                              អង្គការ Information
                            </h6>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              អង្គការ Name
                            </label>
                            <p className="mb-0">{detail.orgName}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Registration Number
                            </label>
                            <p className="mb-0">{detail.registrationNumber}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Contact Person
                            </label>
                            <p className="mb-0">{detail.contactPerson}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Email
                            </label>
                            <p className="mb-0">{detail.email}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Phone
                            </label>
                            <p className="mb-0">{detail.phone}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Website
                            </label>
                            <p className="mb-0">{detail.website || "N/A"}</p>
                          </div>
                          <div className="col-12">
                            <label className="fw-bold small text-muted">
                              Address
                            </label>
                            <p className="mb-0">{detail.address}</p>
                          </div>
                          <div className="col-12">
                            <label className="fw-bold small text-muted">
                              Description
                            </label>
                            <p className="mb-0">{detail.description}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Request Date
                            </label>
                            <p className="mb-0">{detail.requestedAt}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="fw-bold small text-muted">
                              Status
                            </label>
                            <p className="mb-0">{statusBadge(detail.status)}</p>
                          </div>
                          {detail.verifiedAt && (
                            <>
                              <div className="col-md-6">
                                <label className="fw-bold small text-muted">
                                  Verified Date
                                </label>
                                <p className="mb-0">{detail.verifiedAt}</p>
                              </div>
                              <div className="col-md-6">
                                <label className="fw-bold small text-muted">
                                  Verified By
                                </label>
                                <p className="mb-0">{detail.verifiedBy}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div
                        className="modal-footer border-top"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary pill"
                          onClick={() => setDetail(null)}
                        >
                          បិត
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
