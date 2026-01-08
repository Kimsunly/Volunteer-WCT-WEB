"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDonationsPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    const data = storage.read("donations", []);
    queueMicrotask(() => setDonations(data));
  }, []);

  const exportCSV = () => {
    if (!donations.length) return alert("No data to export");
    const header = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Amount",
      "Cause",
      "Payment",
      "Created At",
    ];
    const rows = donations.map((d) => [
      d.firstName || "",
      d.lastName || "",
      d.email || "",
      d.phone || "",
      d.amount || "",
      d.cause || "",
      d.payment || "",
      d.createdAt || "",
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
    if (!confirm("លុបទិន្នន័យបរិច្ចាគទាំងអស់?")) return;
    storage.write("donations", []);
    setDonations([]);
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="បញ្ជីបរិច្ចាគ"
        subtitle="Track and manage donations"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="donations" />

          <main className="col-lg-9 col-xl-10">
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
                  <button className="btn btn-danger pill" onClick={clearAll}>
                    <i className="bi bi-trash me-1"></i> Clear all
                  </button>
                </div>
              }
            />

            <div className={!roleAllowed ? "opacity-50 pe-none" : ""}>
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
                      {!donations.length ? (
                        <tr>
                          <td colSpan={7} className="text-center text-muted">
                            មិនទាន់មានទិន្នន័យបរិច្ចាគ
                          </td>
                        </tr>
                      ) : (
                        donations.map((d, i) => (
                          <tr key={i}>
                            <td>
                              <strong>
                                {d.firstName || ""} {d.lastName || ""}
                              </strong>
                            </td>
                            <td>{d.email || "-"}</td>
                            <td>{d.phone || "-"}</td>
                            <td>${Number(d.amount || 0).toLocaleString()}</td>
                            <td>{d.cause || "-"}</td>
                            <td>{d.payment || "-"}</td>
                            <td>{d.createdAt || ""}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
