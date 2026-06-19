"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";

/* ─── Status helpers ─────────────────────────────── */
const STATUS = {
  pending:  { label: "កំពុងរង់ចាំ", color: "#d97706", bg: "rgba(217,119,6,0.12)",  border: "rgba(217,119,6,0.25)",  icon: "bi-clock-fill" },
  approved: { label: "បានអនុម័ត",   color: "var(--color-accent)", bg: "var(--color-accent-dim)",  border: "var(--color-accent-glow)",  icon: "bi-check-circle-fill" },
  rejected: { label: "បានបដិសេធ",   color: "#dc2626", bg: "rgba(220,38,38,0.12)",  border: "rgba(220,38,38,0.25)",  icon: "bi-x-circle-fill" },
};

function StatusBadge({ status, large }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: large ? "6px 14px" : "4px 12px",
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
      background: accent ? "var(--color-accent-dim)" : "var(--color-bg-card)",
      border: `1px solid ${accent ? "var(--color-accent-glow)" : "var(--color-border)"}`,
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
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: value ? "var(--color-text-primary)" : "var(--color-text-muted)", lineHeight: 1.6, fontStyle: !value ? "italic" : "normal" }}>
        {value || "មិនបានបញ្ជាក់"}
      </p>
    </div>
  );
}

/* ─── Tag chip list ──────────────────────────────── */
function TagList({ items }) {
  if (!items || items.trim() === "") return <span style={{ color: "var(--color-text-muted)", fontSize: 13, fontStyle: "italic" }}>មិនបានបញ្ជាក់</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
      {items.split(",").map((t, i) => (
        <span key={i} style={{
          background: "var(--color-accent-dim)",
          color: "var(--color-accent)", fontSize: 12, fontWeight: 600,
          padding: "3px 11px", borderRadius: 20,
          border: "1px solid var(--color-accent-glow)",
        }}>{t.trim()}</span>
      ))}
    </div>
  );
}

/* ─── KPI Card component ─────────────────────────── */
function KpiCard({ title, value, color, icon, gradient }) {
  return (
    <div className="vh-kpi-modern">
      <div className="top-glow-bar" style={{ background: gradient }} />
      <div>
        <span className="kpi-title">{title}</span>
        <h3 className="kpi-value">{value}</h3>
      </div>
      <div className="kpi-icon-bubble" style={{ background: color + "1a" }}>
        <i className={`bi ${icon}`} style={{ color: color, fontSize: 20 }} />
      </div>
      <style jsx>{`
        .vh-kpi-modern {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-card);
          flex: 1;
          min-width: 180px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-kpi-modern:hover {
          transform: translateY(-2px);
          border-color: var(--color-accent) !important;
          box-shadow: 0 8px 20px var(--color-accent-glow), var(--shadow-card) !important;
        }

        .top-glow-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
        }

        .kpi-title {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .kpi-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 4px 0 0;
        }

        .kpi-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
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

  // Sorting state
  const [sortField, setSortField] = useState(null); // 'volunteer' | 'opportunity' | 'date'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when search, filter, or items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items, search, statusFilter]);

  // Apply sorting on filtered list
  const sortedItems = useMemo(() => {
    if (!sortField) return items;
    const sorted = [...items];
    sorted.sort((a, b) => {
      let valA, valB;
      if (sortField === "volunteer") {
        valA = (a.nameKh || a.nameEn || "").toLowerCase();
        valB = (b.nameKh || b.nameEn || "").toLowerCase();
      } else if (sortField === "opportunity") {
        valA = (a.jobKh || "").toLowerCase();
        valB = (b.jobKh || "").toLowerCase();
      } else if (sortField === "date") {
        valA = a.appliedDateRaw || 0;
        valB = b.appliedDateRaw || 0;
      } else {
        return 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortField, sortOrder]);

  // Apply pagination
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedItems, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, sortedItems.length);

  return (
    <div className="tab-pane fade show active" id="applications" style={{ background: "transparent", border: "none", padding: 0 }}>
      
      {/* ── KPI Grid ── */}
      <div className="kpi-grid mb-4" data-aos="fade-up">
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
          color="var(--color-accent)"
          icon="bi-check-circle-fill"
          gradient="linear-gradient(90deg, var(--color-accent), var(--color-accent-glow))"
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
        className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-3 rounded-4 toolbar-wrapper"
        data-aos="fade-up"
      >
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 4, height: 20, background: "var(--color-accent)", borderRadius: 2 }} />
          <h5 className="mb-0 fw-bold title-theme">បញ្ជីឈ្មោះបេក្ខជន</h5>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <select
            className="form-select form-control-premium"
            style={{
              width: 160,
              flexShrink: 0,
            }}
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            <option value="">ស្ថានភាពទាំងអស់</option>
            <option value="pending">⏳ កំពុងរង់ចាំ</option>
            <option value="approved">✅ បានអនុម័ត</option>
            <option value="rejected">❌ បានបដិសេធ</option>
          </select>
          <div className="vh-search-wrap" style={{ width: 260, position: "relative", flexShrink: 0 }}>
            <i className="bi bi-search search-icon" />
            <input
              type="search"
              className="form-control form-control-premium"
              placeholder="ស្វែងរកឈ្មោះ អ៊ីមែល ជំនាញ..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Custom Table UI ── */}
      <div className="table-responsive" data-aos="fade-up" data-aos-delay="50" style={{ overflowX: "auto" }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", width: "100%" }}>
          <thead>
            <tr style={{ background: "transparent" }}>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("volunteer")}
              >
                អ្នកស្ម័គ្រចិត្ត (Volunteer) 
                {sortField === "volunteer" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("opportunity")}
              >
                ការងារស្ម័គ្រចិត្ត (Opportunity)
                {sortField === "opportunity" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("date")}
              >
                កាលបរិច្ឆេទ (Applied Date)
                {sortField === "date" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th className="regular-header">ស្ថានភាព (Status)</th>
              <th className="regular-header" style={{ textAlign: "right" }}>សកម្មភាព (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((app, idx) => (
              <tr 
                key={app.id} 
                className="application-row"
              >
                {/* Volunteer cell */}
                <td className="cell-left border-y-theme">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
                      <Image
                        className="rounded-circle object-fit-cover avatar-border"
                        src={app.avatar}
                        alt={app.nameEn}
                        fill
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="volunteer-name-kh">{app.nameKh}</div>
                      <div className="volunteer-name-en">{app.nameEn}</div>
                    </div>
                  </div>
                </td>

                {/* Job / Opportunity cell */}
                <td className="border-y-theme">
                  <div>
                    <div className="opportunity-title-row">{app.jobKh}</div>
                    <div className="opportunity-skills-row">{app.meta}</div>
                  </div>
                </td>

                {/* Date cell */}
                <td className="border-y-theme date-cell-text">{app.dateKh}</td>

                {/* Status cell */}
                <td className="border-y-theme"><StatusBadge status={app.status} /></td>

                {/* Actions cell */}
                <td className="cell-right border-y-theme" style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="btn-action-tab btn-action-view"
                      title="មើលព័ត៌មានលម្អិត"
                    >
                      <i className="bi bi-eye-fill" />
                    </button>

                    <button 
                      onClick={() => onPending(app.id)} 
                      disabled={app.status === "pending"}
                      className={`btn-action-tab btn-action-pending ${app.status === "pending" ? "disabled" : ""}`}
                      title="ដាក់ទៅរង់ចាំ"
                    >
                      <i className="bi bi-hourglass-split" />
                    </button>

                    <button 
                      onClick={() => onApprove(app.id)} 
                      disabled={app.status === "approved"}
                      className={`btn-action-tab btn-action-approve ${app.status === "approved" ? "disabled" : ""}`}
                      title="អនុម័តពាក្យសុំ"
                    >
                      <i className="bi bi-check-lg" />
                    </button>

                    <button 
                      onClick={() => onReject(app.id)} 
                      disabled={app.status === "rejected"}
                      className={`btn-action-tab btn-action-reject ${app.status === "rejected" ? "disabled" : ""}`}
                      title="បដិសេធពាក្យសុំ"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-5 no-data-cell">
                  <i className="bi bi-inbox fs-1 d-block mb-2 text-muted-theme" style={{ opacity: 0.4 }} />
                  មិនមានការដាក់ពាក្យស្របតាមការស្វែងរករបស់អ្នកឡើយ។
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination controls ── */}
      {sortedItems.length > 0 && (
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 px-2 pagination-container" data-aos="fade-up">
          <span className="pagination-info">
            បង្ហាញពី <span className="fw-bold text-accent-theme">{startEntry}</span> ដល់ <span className="fw-bold text-accent-theme">{endEntry}</span> នៃ <span className="fw-bold text-accent-theme">{sortedItems.length}</span> ការដាក់ពាក្យ
          </span>
          <div className="d-flex align-items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
              aria-label="Previous page"
            >
              <i className="bi bi-chevron-left"></i> មុន
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`pagination-number-btn ${currentPage === p ? "active" : ""}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
              aria-label="Next page"
            >
              បន្ទាប់ <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          APPLICANT DETAIL MODAL
      ════════════════════════════════════════════ */}
      {selectedApp && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedApp(null)}
            className="modal-backdrop-frosted"
          />

          {/* Panel */}
          <div className="modal-panel-custom">

            {/* ── Profile header banner ── */}
            <div className="modal-header-banner">
              {/* Close */}
              <button
                onClick={() => setSelectedApp(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>

              {/* Opportunity tag */}
              <span className="modal-op-tag">
                <i className="bi bi-briefcase-fill" />
                {selectedApp.jobKh}
              </span>

              <h3 className="modal-title-main">
                ព័ត៌មានអ្នកដាក់ពាក្យ
              </h3>
              <p className="modal-title-sub">
                ដាក់ពាក្យ​នៅ​ {selectedApp.dateKh}
              </p>
            </div>

            {/* ── Avatar card ── (overlaps header) */}
            <div className="modal-avatar-card">
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <Image
                  src={selectedApp.avatar}
                  alt={selectedApp.nameKh}
                  className="rounded-circle object-fit-cover shadow-sm avatar-overlap-border"
                  fill
                  unoptimized
                />
                {/* Status dot */}
                <span className="status-dot-avatar" style={{
                  background: STATUS[selectedApp.status]?.color || "#d97706",
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 className="modal-applicant-name">
                  {selectedApp.nameKh}
                </h4>
                <div className="d-flex flex-wrap gap-x-3 gap-y-1 align-items-center mt-1">
                  {selectedApp.email && (
                    <span className="modal-meta-item">
                      <i className="bi bi-envelope" />
                      {selectedApp.email}
                    </span>
                  )}
                  {selectedApp.phone_number && (
                    <span className="modal-meta-item">
                      <i className="bi bi-telephone" />
                      {selectedApp.phone_number}
                    </span>
                  )}
                  {selectedApp.sex && (
                    <span className="modal-meta-item">
                      <i className="bi bi-gender-ambiguous" style={{ color: "#a569bd" }} />
                      {selectedApp.sex === "male" ? "ប្រុស" : selectedApp.sex === "female" ? "ស្រី" : (selectedApp.sex || "ផ្សេងៗ")}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={selectedApp.status} large />
            </div>

            {/* ── Scrollable content ── */}
            <div className="modal-body-scrollable">

              {/* Bio — full width */}
              {selectedApp.bio && (
                <div className="modal-content-card">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="card-icon-bubble bubble-green">
                      <i className="bi bi-person-lines-fill" />
                    </div>
                    <span className="card-label-text">អំពីខ្ញុំ (Bio)</span>
                  </div>
                  <p className="card-value-text-block">{selectedApp.bio}</p>
                </div>
              )}

              {/* Skills & Interests */}
              <div className="modal-row-grid-2">
                <div className="modal-content-card">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="card-icon-bubble bubble-purple">
                      <i className="bi bi-lightning-charge-fill" />
                    </div>
                    <span className="card-label-text">ជំនាញ (Skills)</span>
                  </div>
                  <TagList items={selectedApp.skills} />
                </div>
                <div className="modal-content-card">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="card-icon-bubble bubble-pink">
                      <i className="bi bi-heart-fill" />
                    </div>
                    <span className="card-label-text">ចំណាប់អារម្មណ៍ (Interests)</span>
                  </div>
                  <TagList items={selectedApp.interests} />
                </div>
              </div>

              {/* Education, Experience, Availability, Address */}
              <div className="modal-row-grid-2 mb-3">
                <InfoCard icon="bi-mortarboard-fill" label="ការសិក្សា (Education)"    value={selectedApp.education}   iconColor="#2563eb" />
                <InfoCard icon="bi-briefcase-fill"   label="បទពិសោធន៍ (Experience)"   value={selectedApp.experience}  iconColor="#d97706" />
                <InfoCard icon="bi-clock-fill"       label="ពេលវេលាទំនេរ (Availability)" value={selectedApp.availability} iconColor="#0891b2" />
                <InfoCard icon="bi-geo-alt-fill"     label="អាសយដ្ឋាន (Address)"       value={selectedApp.address}     iconColor="#dc2626" />
              </div>

              {/* Application message */}
              <div className="message-highlight-card">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="card-icon-bubble bubble-blue">
                    <i className="bi bi-chat-quote-fill" />
                  </div>
                  <span className="card-label-text" style={{ color: "#1e40af" }}>សារភ្ជាប់ជាមួយពាក្យស្នើសុំ</span>
                </div>
                <p className="message-highlight-text">
                  "{selectedApp.message || "គ្មានសារ"}"
                </p>
              </div>

              {/* CV download */}
              {selectedApp.cv_url && (
                <a
                  href={selectedApp.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cv-download-accent"
                >
                  <i className="bi bi-file-earmark-pdf-fill fs-5" />
                  មើល / ទាញយក CV
                </a>
              )}
            </div>

            {/* ── Footer actions ── */}
            <div className="modal-footer-actions">
              <button
                onClick={() => setSelectedApp(null)}
                className="btn-modal-close"
              >
                បិទ
              </button>

              {selectedApp.status !== "rejected" && selectedApp.status !== "approved" && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { onReject(selectedApp.id); setSelectedApp(null); }}
                    className="btn-modal-reject"
                  >
                    <i className="bi bi-x-circle-fill" /> បដិសេធ
                  </button>
                  <button
                    onClick={() => { onApprove(selectedApp.id); setSelectedApp(null); }}
                    className="btn-modal-approve"
                  >
                    <i className="bi bi-check-circle-fill" /> អនុម័ត
                  </button>
                </div>
              )}

              {/* Show re-open option for already-decided applications */}
              {(selectedApp.status === "approved" || selectedApp.status === "rejected") && (
                <button
                  onClick={() => { onPending(selectedApp.id); setSelectedApp(null); }}
                  className="btn-modal-reopen"
                >
                  <i className="bi bi-arrow-counterclockwise" /> ត្រឡប់ទៅរង់ចាំ
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Styled JSX styling rules */}
      <style jsx>{`


        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .toolbar-wrapper {
          background-color: var(--color-bg-card);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-card);
        }

        .title-theme {
          color: var(--color-text-primary) !important;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
        }

        .form-control-premium {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          height: 42px;
          font-size: 14px;
          padding-left: 40px;
          transition: all 0.25s ease;
        }
        .form-control-premium:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          outline: none;
        }
        
        select.form-control-premium {
          padding-left: 14px;
        }

        /* Table headers */
        .sortable-header {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border: none;
          cursor: pointer;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sortable-header:hover {
          color: var(--color-text-primary) !important;
        }
        .sort-arrow {
          color: var(--color-accent) !important;
        }
        .sort-arrow-inactive {
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        .regular-header {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border: none;
        }

        /* Table cells */
        .application-row {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          box-shadow: var(--shadow-card) !important;
          border-radius: 16px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .application-row:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1), var(--shadow-card) !important;
        }

        .border-y-theme {
          border-top: 1px solid var(--color-border) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
        .cell-left {
          padding: 16px;
          border-left: 1px solid var(--color-border) !important;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .cell-right {
          padding: 16px;
          border-right: 1px solid var(--color-border) !important;
          border-top-right-radius: 14px;
          border-bottom-right-radius: 14px;
        }

        .avatar-border {
          border: 2px solid var(--color-border);
          background-color: var(--color-bg-base);
        }

        .volunteer-name-kh {
          font-weight: 700;
          color: var(--color-text-primary);
          font-size: 14.5px;
        }
        .volunteer-name-en {
          font-size: 12.5px;
          color: var(--color-text-secondary);
        }

        .opportunity-title-row {
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 14px;
        }
        .opportunity-skills-row {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-top: 2px;
        }

        .date-cell-text {
          color: var(--color-text-secondary);
          font-size: 13.5px;
        }

        .no-data-cell {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          color: var(--color-text-secondary);
        }
        .text-muted-theme {
          color: var(--color-text-muted) !important;
        }

        /* Action buttons */
        .btn-action-tab {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-bg-card);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-action-tab.disabled {
          opacity: 0.4;
          cursor: not-allowed !important;
        }

        .btn-action-view {
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
        }
        .btn-action-view:hover {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-color: var(--color-border-hover);
        }

        .btn-action-pending {
          border: 1px solid rgba(217,119,6,0.25);
          color: #d97706;
        }
        .btn-action-pending:hover:not(.disabled) {
          background: rgba(217,119,6,0.15);
          transform: translateY(-1px);
        }

        .btn-action-approve {
          border: 1px solid var(--color-accent-glow);
          color: var(--color-accent);
        }
        .btn-action-approve:hover:not(.disabled) {
          background: var(--color-accent-dim);
          transform: translateY(-1px);
          box-shadow: 0 0 8px var(--color-accent-glow);
        }

        .btn-action-reject {
          border: 1px solid rgba(220,38,38,0.25);
          color: #dc2626;
        }
        .btn-action-reject:hover:not(.disabled) {
          background: rgba(220,38,38,0.15);
          transform: translateY(-1px);
        }

        /* Pagination styles */
        .pagination-container {
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
        }
        .pagination-info {
          font-size: 13.5px;
          color: var(--color-text-secondary);
        }
        .pagination-btn {
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 6px 14px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(.disabled) {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-hover);
        }
        .pagination-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-number-btn {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1px solid transparent;
          border-radius: 8px;
          width: 34px;
          height: 34px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .pagination-number-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-card-hover);
        }
        .pagination-number-btn.active {
          background: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
        }

        /* Modal Styles */
        .modal-backdrop-frosted {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          z-index: 1050;
        }

        .modal-panel-custom {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1060;
          width: min(720px, 96vw);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
        }

        .modal-header-banner {
          background: linear-gradient(135deg, #1b4332 0%, #0f5132 100%);
          padding: 28px 28px 56px;
          position: relative;
          flex-shrink: 0;
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-op-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 20px;
          margin-bottom: 8px;
        }

        .modal-title-main {
          color: #fff;
          font-weight: 800;
          margin: 4px 0 2px;
          font-size: 20px;
        }
        .modal-title-sub {
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
          font-size: 13px;
        }

        .modal-avatar-card {
          margin: -40px 28px 0;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          z-index: 2;
          position: relative;
        }

        .avatar-overlap-border {
          border: 3px solid var(--color-bg-card) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.25s ease;
        }
        .modal-avatar-card:hover .avatar-overlap-border {
          transform: scale(1.05);
        }

        .status-dot-avatar {
          position: absolute;
          bottom: 3px;
          right: 3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--color-bg-card);
        }

        .modal-applicant-name {
          margin: 0 0 2px;
          font-weight: 800;
          font-size: 18px;
          color: var(--color-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-meta-item {
          font-size: 12.5px;
          color: var(--color-text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .modal-meta-item i {
          color: var(--color-accent);
        }

        .modal-body-scrollable {
          overflow-y: auto;
          flex: 1;
          padding: 24px 28px;
          background: var(--color-bg-base);
        }

        /* Slim premium scrollbar */
        .modal-body-scrollable::-webkit-scrollbar {
          width: 8px;
        }
        .modal-body-scrollable::-webkit-scrollbar-track {
          background: var(--color-bg-base);
        }
        .modal-body-scrollable::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 8px;
        }
        .modal-body-scrollable::-webkit-scrollbar-thumb:hover {
          background: var(--color-border-hover);
        }

        .modal-content-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 14px 18px;
          margin-bottom: 14px;
          box-shadow: var(--shadow-card);
        }

        .card-icon-bubble {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .bubble-green {
          background: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .bubble-purple {
          background: rgba(124, 58, 237, 0.12);
          color: #7c3aed;
        }
        .bubble-pink {
          background: rgba(219, 39, 119, 0.12);
          color: #db2777;
        }
        .bubble-blue {
          background: rgba(37, 99, 235, 0.12);
          color: #2563eb;
        }

        .card-label-text {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-text-primary);
        }
        
        .card-value-text-block {
          margin: 0;
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.75;
          white-space: pre-line;
        }

        .modal-row-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .message-highlight-card {
          background: var(--color-accent-dim);
          border: 1.5px solid var(--color-accent-glow);
          border-radius: 16px;
          padding: 14px 18px;
          margin-bottom: 14px;
        }
        .message-highlight-text {
          margin: 0;
          font-size: 14px;
          color: var(--color-text-primary);
          font-style: italic;
          line-height: 1.7;
        }

        .btn-cv-download-accent {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px 0;
          border-radius: 14px;
          background: var(--color-accent);
          color: #000000 !important;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 14px var(--color-accent-glow);
          transition: all 0.25s ease;
          border: none;
        }
        .btn-cv-download-accent:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--color-accent-glow);
        }

        .modal-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        .btn-modal-close {
          padding: 9px 20px;
          border-radius: 12px;
          border: 1.5px solid var(--color-border);
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-modal-close:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-hover);
        }

        .btn-modal-reject {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: 12px;
          border: 1.5px solid rgba(220, 38, 38, 0.3);
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-modal-reject:hover {
          background: rgba(220, 38, 38, 0.2);
        }

        .btn-modal-approve {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          border-radius: 12px;
          border: none;
          background: var(--color-accent);
          color: #000000 !important;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 14px var(--color-accent-glow);
          transition: all 0.25s ease;
        }
        .btn-modal-approve:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--color-accent-glow);
        }

        .btn-modal-reopen {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: 12px;
          border: 1.5px solid rgba(217, 119, 6, 0.3);
          background: rgba(217, 119, 6, 0.1);
          color: #d97706;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-modal-reopen:hover {
          background: rgba(217, 119, 6, 0.2);
        }

        @media (max-width: 576px) {
          .modal-row-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
