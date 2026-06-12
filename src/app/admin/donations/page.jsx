"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RoleGuard } from "../components";
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
      setError("Failed to load donations");
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

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <RoleGuard />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Donations</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Donation records from the form
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-secondary"
            onClick={exportCSV}
          >
            <i className="bi bi-download me-2"></i> Export CSV
          </button>
        </div>
      </div>

      <div className={user?.role !== "admin" ? "opacity-50 pointer-events-none" : ""}>
        {error && (
          <div className="card" style={{ color: "var(--color-negative)" }}>
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="card" style={{ padding: "0" }}>
          <div className="table-wrapper">
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Cause</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="text-center py-4">
                        <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                          <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !donations.length ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                      No donations yet
                    </td>
                  </tr>
                ) : (
                  donations.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{d.donor_name}</strong>
                      </td>
                      <td>{d.email || "—"}</td>
                      <td>{d.phone || "—"}</td>
                      <td>
                        <span style={{ color: "var(--color-positive)", fontWeight: "600" }}>
                          ${Number(d.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>{d.cause || "—"}</td>
                      <td>{d.donation_type || "—"}</td>
                      <td>{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <small style={{ color: "var(--color-text-secondary)" }}>
            Total: <strong style={{ color: "var(--color-text-primary)" }}>{total}</strong>
            {loading && (
              <span className="ms-2">
                <i className="bi bi-arrow-repeat" style={{ animation: "spin 1s linear infinite" }}></i>
              </span>
            )}
          </small>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span className="status-badge active" style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
              {page}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
