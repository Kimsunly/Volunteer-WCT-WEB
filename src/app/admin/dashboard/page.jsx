"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboardPage() {
  const [donationsTotal, setDonationsTotal] = useState("$0");
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    // KPI: donations (from localStorage 'donations')
    const donations = storage.read("donations", []);
    const total = donations.reduce(
      (sum, d) => sum + (Number(d.amount) || 0),
      0
    );
    if (donations.length)
      queueMicrotask(() => setDonationsTotal(`$${total.toLocaleString()}`));
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar title="Dashboard" subtitle="Overview of platform metrics" />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="dashboard" />

          <main className="col-lg-9 col-xl-10">
            <RoleGuard />

            <PageHeader
              title="ស្ម័គ្រចិត្ត • Admin"
              subtitle="Role: Admin (verified)"
              actions={
                <div className="d-flex align-items-center gap-2">
                  {/* theme toggle button handled globally; here it's just placeholder */}
                  <button
                    className="btn btn-sm btn-light pill-btn"
                    aria-label="Theme toggle"
                  >
                    <i className="bi bi-moon-fill"></i>
                  </button>
                </div>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
              {/* Overview KPIs */}
              <section id="section-overview" className="mb-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="admin-card p-3">
                      <div className="text-muted small">អ្នកប្រើប្រាស់សរុប</div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="fs-3 fw-bold">1,420</div>
                        <span className="badge bg-success-subtle text-success pill-btn">
                          +4.2%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="admin-card p-3">
                      <div className="text-muted small">
                        Organizer កំពុងរង់ចាំ
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="fs-3 fw-bold">12</div>
                        <span className="badge bg-warning-subtle text-warning pill-btn">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="admin-card p-3">
                      <div className="text-muted small">ឱកាសសកម្ម</div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="fs-3 fw-bold">34</div>
                        <span className="badge bg-primary-subtle text-primary pill-btn">
                          +3
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="admin-card p-3">
                      <div className="text-muted small">បរិច្ចាគថ្មី</div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="fs-3 fw-bold" id="kpiDonations">
                          {donationsTotal}
                        </div>
                        <span className="badge bg-info-subtle text-info pill-btn">
                          7 ថ្មី
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Organizer table sample */}
              <section id="section-organizers" className="mb-4">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <h5 className="mb-0">ផ្ទៀងផ្ទាត់ Organizer</h5>
                  <span className="admin-badge text-warning">
                    <i className="bi bi-shield-check me-1"></i>Admin approve
                    only
                  </span>
                </div>
                <div className="admin-card p-3">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>អង្គការ</th>
                          <th>ប្រភេទ</th>
                          <th>ស្ថានភាព</th>
                          <th className="text-end">សកម្មភាព</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>ក្រុមអភិរក្សបរិស្ថាន</strong>
                            <br />
                            <small>env_org@example.com</small>
                          </td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              NGO
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              Pending
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-success">
                                <i className="bi bi-check2"></i>
                              </button>
                              <button className="btn btn-outline-danger">
                                <i className="bi bi-x"></i>
                              </button>
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>ក្រុមអប់រំជាតិ</strong>
                            <br />
                            <small>edu_team@example.com</small>
                          </td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary">
                              Community
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success">Verified</span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-danger">
                                <i className="bi bi-ban"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* You can keep the rest sections like in your HTML (opps, categories, tips, comments, users, settings)
              Or navigate via the sidebar to each dedicated page below. */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
``;
