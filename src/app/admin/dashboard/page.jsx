"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard } from "../components";
import AdminNavbar from "../components/AdminNavbar";
import {
  getDashboardMetrics,
  listOrganizers,
  approveOrganizer,
  rejectOrganizer
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsData, orgsData] = await Promise.all([
        getDashboardMetrics(),
        listOrganizers({ status: "pending", limit: 5 })
      ]);
      setMetrics(metricsData);
      setPendingOrgs(orgsData?.data || []);
    } catch (err) {
      console.error("Dashboard list error:", err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchData();
    }
  }, [user, authLoading]);

  const handleApprove = async (id) => {
    if (!confirm("តើអ្នកចង់អនុម័ត Organizer នេះមែនទេ?")) return;
    setActionLoading(id);
    try {
      await approveOrganizer(id);
      await fetchData();
    } catch (err) {
      console.error("Approve error:", err);
      alert("បរាជ័យក្នុងការអនុម័ត");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("មូលហេតុនៃការបដិសេធ (យ៉ាងហោច ១០ តួអក្សរ):");
    if (!reason || reason.length < 10) return;
    setActionLoading(id);
    try {
      await rejectOrganizer(id, reason);
      await fetchData();
    } catch (err) {
      console.error("Reject error:", err);
      alert("បរាជ័យក្នុងការបដិសេធ");
    } finally {
      setActionLoading(null);
    }
  };

  const roleAllowed = user?.role === "admin";

  return (
    <>
      <RoleGuard />

      <PageHeader
        title="ស្ម័គ្រចិត្ត • Admin"
        subtitle={`Role: ${user?.role || "Guest"}`}
        actions={
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-light pill-btn"
              aria-label="Theme toggle"
            >
              <i className="bi bi-person-circle me-1"></i> {user?.name || "Admin"}
            </button>
          </div>
        }
      />

      <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
        {/* Overview KPIs */}
        <section id="section-overview" className="mb-4">
          {loading && (
            <div className="d-flex align-items-center gap-2 mb-3 text-muted">
              <div
                className="spinner-border spinner-border-sm"
                role="status"
              ></div>
              កំពុងផ្ទុកទិន្នន័យ...
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="row g-3">
            <div className="col-md-3">
              <div className="admin-card p-3">
                <div className="text-muted small">អ្នកប្រើប្រាស់សរុប</div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div className="fs-3 fw-bold">
                    {loading ? "..." : metrics?.users_count || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="admin-card p-3">
                <div className="text-muted small">
                  Organizer កំពុងរង់ចាំ
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div className="fs-3 fw-bold">
                    {loading ? "..." : metrics?.organizers_count?.pending || 0}
                  </div>
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
                  <div className="fs-3 fw-bold">
                    {loading ? "..." : metrics?.opportunities_count?.active || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="admin-card p-3">
                <div className="text-muted small">បរិច្ចាគសរុប</div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div className="fs-3 fw-bold" id="kpiDonations">
                    {loading ? "..." : `$${(metrics?.donations_total || 0).toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organizer table sample */}
        <section id="section-organizers" className="mb-4">
          <div className="d-flex align-items-center mb-2 gap-2">
            <h5 className="mb-0">ផ្ទៀងផ្ទាត់ Organizer (រង់ចាំ)</h5>
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
                  {pendingOrgs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        {!loading ? "មិនមានការស្នើសុំកំពុងរង់ចាំឡើយ" : "កំពុងផ្ទុក..."}
                      </td>
                    </tr>
                  ) : (
                    pendingOrgs.map((org) => (
                      <tr key={org.id}>
                        <td>
                          <strong>{org.organization_name}</strong>
                          <br />
                          <small className="text-muted">{org.email}</small>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary text-uppercase">
                            {org.organizer_type}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {org.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleApprove(org.id)}
                              disabled={actionLoading === org.id}
                            >
                              <i className="bi bi-check2"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleReject(org.id)}
                              disabled={actionLoading === org.id}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
``;
