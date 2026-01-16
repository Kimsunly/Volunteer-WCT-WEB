"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PageHeader, RoleGuard, storage } from "../components";
import {
  approveOrganizer,
  listOrganizers,
  rejectOrganizer,
  suspendOrganizer,
} from "@/services/admin";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Skeleton from "@/components/common/Skeleton";
import LoadingButton from "@/components/common/LoadingButton";

export default function AdminOrganizersPage() {
  const { user, loading: authLoading } = useAuth();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listOrganizers({
        status: filter === "all" ? null : filter,
        limit,
        offset,
      });
      setOrganizers(res?.data || []);
      setTotal(res?.total ?? res?.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch organizers error:", err);
      setError("បរាជ័យក្នុងការទាញយកអ្នករៀបចំ");
    } finally {
      setLoading(false);
    }
  }, [filter, limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchOrganizers();
    }
  }, [fetchOrganizers, authLoading, user]);

  const viewDetail = (org) => setDetail(org);

  const handleApprove = async (org) => {
    if (!org || !confirm("អនុម័តអ្នករៀបចំនេះ?")) return;
    setActionLoading(org.id);
    try {
      await approveOrganizer(org.id);
      toast.success("បានអនុម័តដោយជោគជ័យ");
      await fetchOrganizers();
    } catch (err) {
      console.error(err);
      toast.error("បរាជ័យក្នុងការអនុម័ត");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (org) => {
    if (!org) return;
    const reason = prompt("មូលហេតុនៃការបដិសេធ (យ៉ាងហោចណាស់ ១០ តួអក្សរ):");
    if (!reason || reason.length < 10) return;
    setActionLoading(org.id);
    try {
      await rejectOrganizer(org.id, reason);
      toast.success("បានបដិសេធដោយជោគជ័យ");
      await fetchOrganizers();
    } catch (err) {
      console.error(err);
      toast.error("បរាជ័យក្នុងការបដិសេធ");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (org) => {
    if (!org) return;
    const reason = prompt("មូលហេតុនៃការផ្អាក់ (យ៉ាងហោចណាស់ ១០ តួអក្សរ):");
    if (!reason || reason.length < 10) return;
    setActionLoading(org.id);
    try {
      await suspendOrganizer(org.id, reason);
      toast.success("បានផ្អាក់ដោយជោគជ័យ");
      await fetchOrganizers();
    } catch (err) {
      console.error(err);
      toast.error("បរាជ័យក្នុងការផ្អាក់");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
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
      <RoleGuard />

      <PageHeader
        title="ផ្ទៀងផ្ទាត់អ្នករៀបចំ"
        subtitle="Approve or reject organizer verification requests"
        actions={
          <div className="d-flex gap-2">
            {["all", "pending", "verified", "rejected"].map((s) => (
              <button
                key={s}
                className={`btn ${filter === s ? "btn" : "btn-outline"}-${s === "pending" ? "warning" : s === "verified" ? "success" : s === "rejected" ? "danger" : "secondary"} pill`}
                onClick={() => {
                  setOffset(0);
                  setFilter(s);
                }}
                disabled={loading}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      <div className={user?.role !== "admin" ? "opacity-50 pe-none" : ""}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        <div className="admin-card p-3">
          {loading && (
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <div
                className="spinner-border spinner-border-sm"
                role="status"
              ></div>
              កំពុងផ្ទុកទិន្នន័យ...
            </div>
          )}
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <Skeleton variant="table" lines={5} />
                    </td>
                  </tr>
                ) : !organizers.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-muted py-4"
                    >
                      គ្មានទិន្នន័យ
                    </td>
                  </tr>
                ) : !organizers.length ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-muted py-4"
                    >
                      គ្មានទិន្នន័យ
                    </td>
                  </tr>
                ) : (
                  organizers.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.organization_name}</strong>
                      </td>
                      <td>{o.contact_person || "—"}</td>
                      <td>{o.email}</td>
                      <td>{o.phone || "—"}</td>
                      <td>{formatDate(o.submitted_at)}</td>
                      <td>{statusBadge(o.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary pill"
                            onClick={() => viewDetail(o)}
                            title="View Details"
                            disabled={actionLoading === o.id}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {o.status === "pending" && (
                            <>
                              <LoadingButton
                                className="btn btn-sm btn-success pill"
                                onClick={() => handleApprove(o)}
                                title="Approve"
                                loading={actionLoading === o.id}
                              >
                                <i className="bi bi-check-circle"></i>
                              </LoadingButton>
                              <LoadingButton
                                className="btn btn-sm btn-danger pill"
                                onClick={() => handleReject(o)}
                                title="Reject"
                                loading={actionLoading === o.id}
                              >
                                <i className="bi bi-x-circle"></i>
                              </LoadingButton>
                            </>
                          )}
                          {o.status === "verified" && (
                            <LoadingButton
                              className="btn btn-sm btn-warning pill"
                              onClick={() => handleSuspend(o)}
                              title="Suspend"
                              loading={actionLoading === o.id}
                            >
                              <i className="bi bi-pause-circle"></i>
                            </LoadingButton>
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

        <div className="d-flex align-items-center justify-content-between mt-3">
          <small className="text-muted">
            ទិន្នន័យសរុប: <strong>{total}</strong>
            {loading && (
              <span className="ms-2 spinner-border spinner-border-sm"></span>
            )}
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${offset === 0 || loading ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0 || loading}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {Math.floor(offset / limit) + 1}
                </span>
              </li>
              <li
                className={`page-item ${offset + limit >= total || loading ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total || loading}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Detail Modal (inline) */}
        {detail && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1040 }}
              onClick={() => setDetail(null)}
            ></div>
            <div
              className="modal fade show"
              style={{ display: "block", zIndex: 1050 }}
              aria-modal="true"
              role="dialog"
            >
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
                        <p className="mb-0">{detail.organization_name}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Registration Number
                        </label>
                        <p className="mb-0">
                          {detail.registration_number || "—"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Contact Person
                        </label>
                        <p className="mb-0">
                          {detail.contact_person || "—"}
                        </p>
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
                        <p className="mb-0">{detail.phone || "—"}</p>
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
                        <p className="mb-0">{detail.address || "—"}</p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold small text-muted">
                          Description
                        </label>
                        <p className="mb-0">{detail.description || "—"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Request Date
                        </label>
                        <p className="mb-0">
                          {formatDate(detail.submitted_at)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small text-muted">
                          Status
                        </label>
                        <p className="mb-0">{statusBadge(detail.status)}</p>
                      </div>
                      {detail.rejection_reason && (
                        <div className="col-12">
                          <label className="fw-bold small text-muted">
                            Rejection Reason
                          </label>
                          <p className="mb-0">{detail.rejection_reason}</p>
                        </div>
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
          </>
        )}
      </div>
    </>
  );
}
