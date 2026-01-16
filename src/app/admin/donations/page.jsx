"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageHeader, RoleGuard, storage } from "../components";
import { listDonations } from "@/services/donations";
import { useAuth } from "@/context/AuthContext";

export default function AdminDonationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Add missing mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listDonations({ limit, offset });
      const items = res?.data || res || [];
      setDonations(items);
      setTotal(res?.total ?? items.length ?? 0);
    } catch (e) {
      console.error("Fetch donations error:", e);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    if (!authLoading && user?.role?.toLowerCase() === "admin") {
      fetchDonations();
    }
  }, [authLoading, user, fetchDonations]);

  const exportCSV = () => {
    if (!donations.length) return alert("No data to export");
    const header = [
      "Donor Name",
      "Email",
      "Phone",
      "Amount",
      "Cause",
      "Type",
      "Created At",
    ];
    const rows = donations.map((d) => [
      d.donor_name || "",
      d.email || "",
      d.phone || "",
      d.amount || "",
      d.cause || "",
      d.donation_type || "",
      d.created_at || "",
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    alert("Clearing all donations is not supported by the API.");
  };

  if (!mounted) return null;

  return (
    <>
      <RoleGuard />

      <PageHeader
        title="បញ្ជីបរិច្ចាគ"
        subtitle="ទិន្នន័យពីទម្រង់បរិច្ចាគ"
        actions={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary pill"
              onClick={exportCSV}
            >
              <i className="bi bi-download me-1"></i> Export CSV
            </button>
          </div>
        }
      />

      <div className={user?.role !== "admin" ? "opacity-50 pe-none" : ""}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="admin-card p-3">
          <div className="table-responsive">
            <table
              className="table align-middle mb-0"
              id="donationsTable"
            >
              <thead>
                <tr>
                  <th>អ្នកបរិច្ចាគ</th>
                  <th>អ៊ីមែល</th>
                  <th>ទូរស័ព្ទ</th>
                  <th>ចំណែក</th>
                  <th>ប្រភេទការងារ</th>
                  <th>វិធីទូទាត់</th>
                  <th>ថ្ងៃម៉ោង</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7}>
                        <div className="placeholder-glow">
                          <span
                            className="placeholder col-12"
                            style={{ height: 20 }}
                          ></span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !donations.length ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      មិនទាន់មានទិន្នន័យបរិច្ចាគ
                    </td>
                  </tr>
                ) : (
                  donations.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{d.donor_name}</strong>
                      </td>
                      <td>{d.email || "-"}</td>
                      <td>{d.phone || "-"}</td>
                      <td>${Number(d.amount || 0).toLocaleString()}</td>
                      <td>{d.cause || "-"}</td>
                      <td>{d.donation_type || "-"}</td>
                      <td>{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <small className="text-muted d-flex align-items-center gap-2">
            <span>
              ទិន្នន័យសរុប: <strong>{total}</strong>
            </span>
            {loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            )}
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{page}</span>
              </li>
              <li
                className={`page-item ${page * limit >= total ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
