// src/app/org/dashboard/components/panes/ApplicationsPane.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

/* ─── Status helpers ─────────────────────────────── */
const STATUS = {
  pending:  { label: "កំពុងរង់ចាំ", color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.2)",  icon: "bi-clock-fill" },
  approved: { label: "បានអនុម័ត",   color: "#16a34a", bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.25)",  icon: "bi-check-circle-fill" },
  rejected: { label: "បានបដិសេធ",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.2)",  icon: "bi-x-circle-fill" },
};

function StatusBadge({ status, large }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: large ? "5px 14px" : "4px 12px",
      borderRadius: 20,
      fontSize: large ? 13 : 12,
      fontWeight: 700,
      color: s.color,
      background: s.bg,
      border: `1.5px solid ${s.border}`,
    }}>
      <i className={`bi ${s.icon}`} style={{ fontSize: large ? 12 : 11 }} />
      {s.label}
    </span>
  );
}

/* ─── Small info card ────────────────────────────── */
function InfoCard({ icon, label, value, iconColor = "#2d6a4f", accent = false }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "#f8faf9",
      border: `1px solid ${accent ? "rgba(34,197,94,0.2)" : "#e5e7eb"}`,
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: `${iconColor}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: 12 }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: value ? "#111827" : "#9ca3af", lineHeight: 1.6, fontStyle: !value ? "italic" : "normal" }}>
        {value || "មិនបានបញ្ជាក់"}
      </p>
    </div>
  );
}

/* ─── Tag chip list ──────────────────────────────── */
function TagList({ items }) {
  if (!items || items.trim() === "") return <span style={{ color: "#9ca3af", fontSize: 13, fontStyle: "italic" }}>មិនបានបញ្ជាក់</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
      {items.split(",").map((t, i) => (
        <span key={i} style={{
          background: "linear-gradient(135deg,#e8f5e9,#d0f0dc)",
          color: "#166534", fontSize: 12, fontWeight: 600,
          padding: "3px 11px", borderRadius: 20,
          border: "1px solid rgba(22,101,52,0.15)",
        }}>{t.trim()}</span>
      ))}
    </div>
  );
}

/* ─── KPI Card component ─────────────────────────── */
function KpiCard({ title, value, color, icon, gradient }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
      flex: 1,
      minWidth: "180px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 4,
        background: gradient
      }} />
      <div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>{title}</span>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "4px 0 0" }}>{value}</h3>
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: gradient + "15",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <i className={`bi ${icon}`} style={{ color: color, fontSize: 20 }} />
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function ApplicationsPane({
  items,
  stats = { total: 0, pending: 0, approved: 0, rejected: 0 },
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  onApprove,
  onReject,
  onPending,
}) {
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <div className="tab-pane fade show active" id="applications" style={{ background: "transparent", border: "none", padding: 0 }}>
      
      {/* ── KPI Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 24
      }} data-aos="fade-up">
        <KpiCard
          title="ការដាក់ពាក្យសរុប"
          value={stats.total}
          color="#3b82f6"
          icon="bi-files"
          gradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
        />
        <KpiCard
          title="កំពុងរង់ចាំពិនិត្យ"
          value={stats.pending}
          color="#d97706"
          icon="bi-hourglass-split"
          gradient="linear-gradient(90deg, #d97706, #fbbf24)"
        />
        <KpiCard
          title="បានអនុម័ត"
          value={stats.approved}
          color="#16a34a"
          icon="bi-check-circle-fill"
          gradient="linear-gradient(90deg, #16a34a, #34d399)"
        />
        <KpiCard
          title="បានបដិសេធ"
          value={stats.rejected}
          color="#dc2626"
          icon="bi-x-circle-fill"
          gradient="linear-gradient(90deg, #dc2626, #f87171)"
        />
      </div>

      {/* ── Toolbar ── */}
      <div
        className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-3 rounded-4"
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}
        data-aos="fade-up"
      >
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 4, height: 20, background: "#2d6a4f", borderRadius: 2 }} />
          <h5 className="mb-0 fw-bold text-dark">បញ្ជីឈ្មោះបេក្ខជន</h5>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="vh-search-wrap" style={{ minWidth: 260, position: "relative" }}>
            <i className="bi bi-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="search"
              className="form-control"
              style={{
                paddingLeft: 40,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                height: 42,
                fontSize: 14,
                boxShadow: "none"
              }}
              placeholder="ស្វែងរកឈ្មោះ អ៊ីមែល ជំនាញ..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{
              minWidth: 160,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              height: 42,
              fontSize: 14,
              boxShadow: "none"
            }}
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            <option value="">ស្ថានភាពទាំងអស់</option>
            <option value="pending">⏳ កំពុងរង់ចាំ</option>
            <option value="approved">✅ បានអនុម័ត</option>
            <option value="rejected">❌ បានបដិសេធ</option>
          </select>
        </div>
      </div>

      {/* ── Custom Table UI ── */}
      <div className="table-responsive" data-aos="fade-up" data-aos-delay="50" style={{ overflowX: "auto" }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", width: "100%" }}>
          <thead>
            <tr style={{ background: "transparent" }}>
              <th style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, padding: "10px 16px", border: "none" }}>អ្នកស្ម័គ្រចិត្ត (Volunteer)</th>
              <th style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, padding: "10px 16px", border: "none" }}>ការងារស្ម័គ្រចិត្ត (Opportunity)</th>
              <th style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, padding: "10px 16px", border: "none" }}>កាលបរិច្ឆេទ (Applied Date)</th>
              <th style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, padding: "10px 16px", border: "none" }}>ស្ថានភាព (Status)</th>
              <th style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, padding: "10px 16px", border: "none", textAlign: "right" }}>សកម្មភាព (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((app, idx) => (
              <tr 
                key={app.id} 
                className="application-row"
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  borderRadius: 16,
                  transition: "all 0.2s"
                }}
              >
                {/* Volunteer cell */}
                <td style={{
                  padding: "16px",
                  borderTop: "1px solid #f3f4f6",
                  borderBottom: "1px solid #f3f4f6",
                  borderLeft: "1px solid #f3f4f6",
                  borderTopLeftRadius: 14,
                  borderBottomLeftRadius: 14
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
                      <img
                        className="rounded-circle object-fit-cover"
                        src={app.avatar}
                        alt={app.nameEn}
                        style={{ width: "100%", height: "100%", border: "2px solid #e5e7eb" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: 14.5 }}>{app.nameKh}</div>
                      <div style={{ fontSize: 12.5, color: "#6b7280" }}>{app.nameEn}</div>
                    </div>
                  </div>
                </td>

                {/* Job / Opportunity cell */}
                <td style={{
                  padding: "16px",
                  borderTop: "1px solid #f3f4f6",
                  borderBottom: "1px solid #f3f4f6"
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>{app.jobKh}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{app.meta}</div>
                  </div>
                </td>

                {/* Date cell */}
                <td style={{
                  padding: "16px",
                  borderTop: "1px solid #f3f4f6",
                  borderBottom: "1px solid #f3f4f6",
                  color: "#4b5563",
                  fontSize: 13.5
                }}>{app.dateKh}</td>

                {/* Status cell */}
                <td style={{
                  padding: "16px",
                  borderTop: "1px solid #f3f4f6",
                  borderBottom: "1px solid #f3f4f6"
                }}><StatusBadge status={app.status} /></td>

                {/* Actions cell */}
                <td style={{
                  padding: "16px",
                  borderTop: "1px solid #f3f4f6",
                  borderBottom: "1px solid #f3f4f6",
                  borderRight: "1px solid #f3f4f6",
                  borderTopRightRadius: 14,
                  borderBottomRightRadius: 14,
                  textAlign: "right"
                }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button 
                      onClick={() => setSelectedApp(app)}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: "1px solid #e5e7eb",
                        background: "#fff", color: "#4b5563", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}
                      title="មើលព័ត៌មានលម្អិត"
                      onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#111827"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#4b5563"; }}
                    >
                      <i className="bi bi-eye-fill" style={{ fontSize: 14 }} />
                    </button>

                    <button 
                      onClick={() => onPending(app.id)} 
                      disabled={app.status === "pending"}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(217,119,6,0.15)",
                        background: app.status === "pending" ? "#f9fafb" : "rgba(217,119,6,0.05)", 
                        color: app.status === "pending" ? "#9ca3af" : "#d97706", 
                        cursor: app.status === "pending" ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}
                      title="ដាក់ទៅរង់ចាំ"
                      onMouseEnter={e => { if (app.status !== "pending") e.currentTarget.style.background = "rgba(217,119,6,0.15)"; }}
                      onMouseLeave={e => { if (app.status !== "pending") e.currentTarget.style.background = "rgba(217,119,6,0.05)"; }}
                    >
                      <i className="bi bi-hourglass-split" style={{ fontSize: 14 }} />
                    </button>

                    <button 
                      onClick={() => onApprove(app.id)} 
                      disabled={app.status === "approved"}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(22,163,74,0.15)",
                        background: app.status === "approved" ? "#f9fafb" : "rgba(22,163,74,0.05)", 
                        color: app.status === "approved" ? "#9ca3af" : "#16a34a", 
                        cursor: app.status === "approved" ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}
                      title="អនុម័តពាក្យសុំ"
                      onMouseEnter={e => { if (app.status !== "approved") e.currentTarget.style.background = "rgba(22,163,74,0.15)"; }}
                      onMouseLeave={e => { if (app.status !== "approved") e.currentTarget.style.background = "rgba(22,163,74,0.05)"; }}
                    >
                      <i className="bi bi-check-lg" style={{ fontSize: 15 }} />
                    </button>

                    <button 
                      onClick={() => onReject(app.id)} 
                      disabled={app.status === "rejected"}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(220,38,38,0.15)",
                        background: app.status === "rejected" ? "#f9fafb" : "rgba(220,38,38,0.05)", 
                        color: app.status === "rejected" ? "#9ca3af" : "#dc2626", 
                        cursor: app.status === "rejected" ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}
                      title="បដិសេធពាក្យសុំ"
                      onMouseEnter={e => { if (app.status !== "rejected") e.currentTarget.style.background = "rgba(220,38,38,0.15)"; }}
                      onMouseLeave={e => { if (app.status !== "rejected") e.currentTarget.style.background = "rgba(220,38,38,0.05)"; }}
                    >
                      <i className="bi bi-x-lg" style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-5" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16 }}>
                  <i className="bi bi-inbox fs-1 d-block mb-2 text-muted" style={{ opacity: 0.4 }} />
                  មិនមានការដាក់ពាក្យស្របតាមការស្វែងរករបស់អ្នកឡើយ។
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Styles for row animations and layout */}
      <style jsx global>{`
        .application-row:hover {
          background-color: #fcfdfc !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.04) !important;
        }
      `}</style>

      {/* ════════════════════════════════════════════
          APPLICANT DETAIL MODAL
      ════════════════════════════════════════════ */}
      {selectedApp && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedApp(null)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              zIndex: 1050,
            }}
          />

          {/* Panel */}
          <div style={{
            position: "fixed",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 1060,
            width: "min(720px, 96vw)",
            maxHeight: "92vh",
            display: "flex", flexDirection: "column",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            background: "#fff",
          }}>

            {/* ── Profile header banner ── */}
            <div style={{
              background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
              padding: "28px 28px 60px",
              position: "relative",
              flexShrink: 0,
            }}>
              {/* Close */}
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              >
                <i className="bi bi-x-lg" style={{ fontSize: 13 }} />
              </button>

              {/* Opportunity tag */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.9)",
                fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                marginBottom: 8,
              }}>
                <i className="bi bi-briefcase-fill" style={{ fontSize: 10 }} />
                {selectedApp.jobKh}
              </span>

              <h3 style={{ color: "#fff", fontWeight: 800, margin: "4px 0 2px", fontSize: 20 }}>
                ព័ត៌មានអ្នកដាក់ពាក្យ
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: 13 }}>
                ដាក់ពាក្យ​នៅ​ {selectedApp.dateKh}
              </p>
            </div>

            {/* ── Avatar card ── (overlaps header) */}
            <div style={{
              margin: "-44px 28px 0",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16,
              flexShrink: 0,
              zIndex: 2,
              position: "relative",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={selectedApp.avatar}
                  alt={selectedApp.nameKh}
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #fff",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                />
                {/* Online dot */}
                <span style={{
                  position: "absolute", bottom: 3, right: 3,
                  width: 14, height: 14, borderRadius: "50%",
                  background: STATUS[selectedApp.status]?.color || "#d97706",
                  border: "2px solid #fff",
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 18, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {selectedApp.nameKh}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", alignItems: "center" }}>
                  {selectedApp.email && (
                    <span style={{ fontSize: 12.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="bi bi-envelope" style={{ color: "#2d6a4f" }} />
                      {selectedApp.email}
                    </span>
                  )}
                  {selectedApp.phone_number && (
                    <span style={{ fontSize: 12.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="bi bi-telephone" style={{ color: "#2d6a4f" }} />
                      {selectedApp.phone_number}
                    </span>
                  )}
                  {selectedApp.sex && (
                    <span style={{ fontSize: 12.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                      <i className="bi bi-gender-ambiguous" style={{ color: "#7c3aed" }} />
                      {selectedApp.sex === "male" ? "ប្រុស" : selectedApp.sex === "female" ? "ស្រី" : (selectedApp.sex || "ផ្សេងៗ")}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={selectedApp.status} large />
            </div>

            {/* ── Scrollable content ── */}
            <div style={{ overflowY: "auto", flex: 1, padding: "20px 28px", background: "#f8faf9" }}>

              {/* Bio — full width */}
              {selectedApp.bio && (
                <div style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16, padding: "14px 18px", marginBottom: 14,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-person-lines-fill" style={{ color: "#2d6a4f", fontSize: 12 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>អំពីខ្ញុំ (Bio)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.75 }}>{selectedApp.bio}</p>
                </div>
              )}

              {/* Skills & Interests */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-lightning-charge-fill" style={{ color: "#7c3aed", fontSize: 12 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>ជំនាញ (Skills)</span>
                  </div>
                  <TagList items={selectedApp.skills} />
                </div>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: "#fce7f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-heart-fill" style={{ color: "#db2777", fontSize: 12 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>ចំណាប់អារម្មណ៍ (Interests)</span>
                  </div>
                  <TagList items={selectedApp.interests} />
                </div>
              </div>

              {/* Education, Experience, Availability, Address */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <InfoCard icon="bi-mortarboard-fill" label="ការសិក្សា (Education)"    value={selectedApp.education}   iconColor="#2563eb" />
                <InfoCard icon="bi-briefcase-fill"   label="បទពិសោធន៍ (Experience)"   value={selectedApp.experience}  iconColor="#d97706" />
                <InfoCard icon="bi-clock-fill"       label="ពេលវេលាទំនេរ (Availability)" value={selectedApp.availability} iconColor="#0891b2" />
                <InfoCard icon="bi-geo-alt-fill"     label="អាសយដ្ឋាន (Address)"       value={selectedApp.address}     iconColor="#dc2626" />
              </div>

              {/* Application message */}
              <div style={{
                background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                border: "1.5px solid rgba(37,99,235,0.2)",
                borderRadius: 16, padding: "14px 18px", marginBottom: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bi bi-chat-quote-fill" style={{ color: "#2563eb", fontSize: 12 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>សារភ្ជាប់ជាមួយពាក្យស្នើសុំ</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#1e40af", fontStyle: "italic", lineHeight: 1.7 }}>
                  "{selectedApp.message || "គ្មានសារ"}"
                </p>
              </div>

              {/* CV download */}
              {selectedApp.cv_url && (
                <a
                  href={selectedApp.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    width: "100%", padding: "12px 0",
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#2d6a4f,#40916c)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(45,106,79,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,106,79,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,79,0.3)"; }}
                >
                  <i className="bi bi-file-earmark-pdf-fill fs-5" />
                  មើល / ទាញយក CV
                </a>
              )}
            </div>

            {/* ── Footer actions ── */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 28px",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              flexShrink: 0,
            }}>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  padding: "9px 20px", borderRadius: 12,
                  border: "1.5px solid #e5e7eb", background: "#f9fafb",
                  color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                បិទ
              </button>

              {selectedApp.status !== "rejected" && selectedApp.status !== "approved" && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { onReject(selectedApp.id); setSelectedApp(null); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 20px", borderRadius: 12,
                      border: "1.5px solid #fecaca", background: "rgba(254,202,202,0.2)",
                      color: "#dc2626", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(254,202,202,0.2)"}
                  >
                    <i className="bi bi-x-circle-fill" /> បដិសេធ
                  </button>
                  <button
                    onClick={() => { onApprove(selectedApp.id); setSelectedApp(null); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 22px", borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg,#2d6a4f,#40916c)",
                      color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(45,106,79,0.3)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,106,79,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,79,0.3)"; }}
                  >
                    <i className="bi bi-check-circle-fill" /> អនុម័ត
                  </button>
                </div>
              )}

              {/* Show re-open option for already-decided applications */}
              {(selectedApp.status === "approved" || selectedApp.status === "rejected") && (
                <button
                  onClick={() => { onPending(selectedApp.id); setSelectedApp(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 20px", borderRadius: 12,
                    border: "1.5px solid #fde68a", background: "rgba(253,230,138,0.2)",
                    color: "#92400e", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise" /> ត្រឡប់ទៅរង់ចាំ
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
