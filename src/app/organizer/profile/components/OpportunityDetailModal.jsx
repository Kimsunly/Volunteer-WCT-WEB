"use client";

import React, { useState } from "react";
import Image from "next/image";

function getCategoryDefaultImage(category) {
  let catStr = "";
  if (typeof category === "string") {
    catStr = category;
  } else if (category && typeof category === "object") {
    catStr = category.slug || category.name || category.name_en || "";
  }
  const cat = catStr.toLowerCase();
  const map = {
    environment: "/images/opportunities/Categories/environment.png",
    education: "/images/opportunities/Categories/teaching.png",
    health: "/images/opportunities/Categories/img-1.png",
    wildlife: "/images/opportunities/Categories/wildlife.png",
    childcare: "/images/opportunities/Categories/childcare.png",
    agriculture: "/images/opportunities/Categories/agriculture.png",
    event: "/images/opportunities/Categories/event.png",
  };
  return map[cat] || "/images/opportunities/default-opportunity.png";
}

function parseJsonField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try { return JSON.parse(field); } catch { return []; }
}

const STATUS_CONFIG = {
  active:   { label: "សកម្ម",        color: "var(--color-accent)", bg: "var(--color-accent-dim)",   icon: "bi-check-circle-fill" },
  closed:   { label: "បិទ",           color: "#dc2626", bg: "rgba(220,38,38,0.12)",   icon: "bi-x-circle-fill" },
  draft:    { label: "ព្រាង",         color: "#6b7280", bg: "rgba(107,114,128,0.12)", icon: "bi-file-earmark" },
};

export default function OpportunityDetailModal({ open, onClose, opportunity, onEdit, onDelete, onCloseOpportunity }) {
  const [activeImg, setActiveImg] = useState(0);
  const [closing, setClosing] = useState(false);

  if (!open || !opportunity) return null;

  const raw = opportunity.raw || {};
  const details  = raw.details  || {};
  const logistic = raw.logistic || {};
  const contact  = raw.contact  || {};

  // Safely extract category name — backend returns either a string or a CategoryResource object
  const categoryLabel =
    raw.category_label ||
    opportunity.category_label ||
    (typeof opportunity.category === "string"
      ? opportunity.category
      : opportunity.category?.name || null) ||
    (typeof raw.category === "string"
      ? raw.category
      : raw.category?.name || null) ||
    "ទូទៅ";

  const allImages = (details.images_json || []).filter(Boolean);
  const heroImage = allImages[activeImg] || opportunity.image ||
    getCategoryDefaultImage(categoryLabel);

  const skills = parseJsonField(details.skills_json);
  const tasks  = parseJsonField(details.tasks_json);

  const registrations = opportunity.registrations || 0;
  const capacity      = opportunity.capacity || 1;
  const fillPct       = Math.round((registrations / capacity) * 100);

  const status   = opportunity.status || "draft";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  const startDate = logistic.start_date
    ? new Date(logistic.start_date).toLocaleDateString("km-KH", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const endDate = logistic.end_date
    ? new Date(logistic.end_date).toLocaleDateString("km-KH", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || opportunity.dateKh || "—");

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop-frosted"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="modal-panel-custom">
        {/* ── HERO SECTION ── */}
        <div style={{ position: "relative", height: "260px", flexShrink: 0, overflow: "hidden" }}>
          <Image
            src={heroImage}
            alt={opportunity.titleKh}
            fill
            style={{ objectFit: "cover" }}
            priority
            unoptimized
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <i className="bi bi-x-lg" style={{ fontSize: 14 }} />
          </button>

          {/* Hero text */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 20px" }}>
            {/* Category pill */}
            <span style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #1b4332, #2d6a4f)",
              color: "#fff", fontSize: 11, fontWeight: 700,
              padding: "3px 12px", borderRadius: 20, marginBottom: 8,
              textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {categoryLabel}
            </span>

            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 22, margin: "0 0 2px", lineHeight: 1.3,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              {opportunity.titleKh}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
              {raw.organization_name || ""}
            </p>
          </div>

          {/* Image gallery strip */}
          {allImages.length > 1 && (
            <div style={{
              position: "absolute", bottom: 14, right: 16,
              display: "flex", gap: 6, zIndex: 3,
            }}>
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 44, height: 34, borderRadius: 8, overflow: "hidden", padding: 0, border: "none",
                    outline: i === activeImg ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.35)",
                    cursor: "pointer", opacity: i === activeImg ? 1 : 0.65,
                    transition: "all 0.2s", flexShrink: 0,
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="modal-body-scrollable">
          <div className="modal-columns-grid">

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Description */}
              <div className="modal-content-card">
                <SectionTitle icon="bi-file-text" label="ពិពណ៌នា" />
                <p className="card-value-text-block">
                  {raw.description || "គ្មានការពិពណ៌នា"}
                </p>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="modal-content-card">
                  <SectionTitle icon="bi-lightning-charge" label="ជំនាញដែលត្រូវការ" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{
                        background: "var(--color-accent-dim)",
                        color: "var(--color-accent)", fontSize: 12, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 20,
                        border: "1px solid var(--color-accent-glow)",
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {tasks.length > 0 && (
                <div className="modal-content-card">
                  <SectionTitle icon="bi-list-check" label="ភារកិច្ចស្ម័គ្រចិត្ត" />
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {tasks.map((t, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                          background: "var(--color-accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i className="bi bi-check text-black" style={{ fontSize: 13, fontWeight: "bold" }} />
                        </span>
                        <span style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Logistics */}
              <div className="modal-content-card">
                <SectionTitle icon="bi-boxes" label="ហេដ្ឋារចនាសម្ព័ន្ធ" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <LogisticItem icon="bi-truck" label="ការដឹកជញ្ជូន" value={logistic.transport} />
                  <LogisticItem icon="bi-house-heart" label="ទីស្នាក់នៅ" value={logistic.housing} />
                  <LogisticItem icon="bi-egg-fried" label="អាហារ" value={logistic.meals || logistic.meal} />
                  <LogisticItem icon="bi-eye"
                    label="ការមើលឃើញ"
                    value={raw.is_private ? "ឯកជន (Private)" : "សាធារណៈ (Public)"}
                    valueColor={raw.is_private ? "#a569bd" : "var(--color-accent)"}
                  />
                </div>
              </div>

              {/* Impact */}
              {details.impact_description && (
                <div className="modal-content-card" style={{ background: "var(--color-accent-dim)", borderColor: "var(--color-accent-glow)" }}>
                  <SectionTitle icon="bi-heart-pulse" label="ផលប៉ះពាល់" color="var(--color-accent)" />
                  <p style={{ color: "var(--color-accent)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {details.impact_description}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Status card */}
              <div className="modal-content-card" style={{
                background: statusCfg.bg,
                border: `1.5px solid ${statusCfg.color}30`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: statusCfg.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className={`bi ${statusCfg.icon}`} style={{ color: status === "active" ? "#000000" : "#fff", fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>ស្ថានភាព</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: statusCfg.color }}>{statusCfg.label}</p>
                  </div>
                </div>

                {/* Capacity progress */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyBetween: "space-between", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 600 }}>ការចូលរួម</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--color-text-primary)" }}>{registrations}<span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}> / {capacity}</span></span>
                  </div>
                  <div style={{ height: 8, background: "rgba(0,0,0,0.15)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.min(fillPct, 100)}%`,
                      background: `linear-gradient(90deg, ${statusCfg.color}, ${statusCfg.color}cc)`,
                      borderRadius: 99,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--color-text-secondary)", textAlign: "right" }}>{fillPct}% បំពេញ</p>
                </div>
              </div>

              {/* Date & location */}
              <div className="modal-content-card">
                <SectionTitle icon="bi-calendar3" label="ពេលវេលា និងទីតាំង" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <InfoRow icon="bi-calendar-event" label="កាលបរិច្ឆេទ" value={dateRange} iconColor="#2563eb" />
                  {logistic.time_range && (
                    <InfoRow icon="bi-clock" label="ម៉ោង" value={logistic.time_range} iconColor="#7c3aed" />
                  )}
                  {logistic.hours > 0 && (
                    <InfoRow icon="bi-hourglass-split" label="ម៉ោងប៉ាន់ស្មាន" value={`${logistic.hours} ម៉ោង`} iconColor="#d97706" />
                  )}
                  <InfoRow icon="bi-geo-alt" label="ទីតាំង" value={logistic.location_label || opportunity.locationKh} iconColor="#dc2626" />
                </div>
              </div>

              {/* Contact */}
              {(contact.name || contact.email || contact.phone) && (
                <div className="modal-content-card">
                  <SectionTitle icon="bi-person-lines-fill" label="ទំនាក់ទំនង" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {contact.name  && <InfoRow icon="bi-person"     label="ឈ្មោះ"       value={contact.name}  iconColor="#2d6a4f" />}
                    {contact.email && <InfoRow icon="bi-envelope"   label="អ៊ីមែល"       value={contact.email} iconColor="#2563eb" />}
                    {contact.phone && <InfoRow icon="bi-telephone"  label="ទូរស័ព្ទ"      value={contact.phone} iconColor="#16a34a" />}
                  </div>
                </div>
              )}

              {/* Help type */}
              {details.help_type && (
                <div className="modal-content-card" style={{ textAlign: "center", padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase" }}>ប្រភេទជំនួយ</p>
                  <span style={{
                    display: "inline-block",
                    background: "var(--color-accent-dim)",
                    color: "var(--color-accent)", fontSize: 13, fontWeight: 700,
                    padding: "5px 16px", borderRadius: 20,
                    border: "1.5px solid var(--color-accent-glow)",
                  }}>{details.help_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="modal-footer-actions">
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { onDelete && onDelete(opportunity.id); onClose(); }}
              className="btn-footer-delete"
            >
              <i className="bi bi-trash3" /> លុប
            </button>
            {status !== 'closed' && onCloseOpportunity && (
              <button
                onClick={async () => {
                  if (window.confirm('តើអ្នកប្រាកដថាចង់បិទឱកាសនេះ? អ្នកស្ម័គ្រចិត្តដែលបានទទួលសកម្មភាពនឹងត្រូវបានសម្គាល់ថាបានបញ្ចប់។')) {
                    setClosing(true);
                    try {
                      await onCloseOpportunity(opportunity.id);
                      onClose();
                    } catch (error) {
                      console.error('Failed to close opportunity:', error);
                      alert('បានបរាជ័យក្នុងការបិទឱកាស។ សូមព្យាយាមម្តងទៀត។');
                    } finally {
                      setClosing(false);
                    }
                  }
                }}
                disabled={closing}
                className="btn-footer-close-op"
              >
                <i className={closing ? "bi bi-arrow-repeat spin" : "bi bi-x-circle"} />
                {closing ? "កំពុងបិទ..." : "បិទឱកាស"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              className="btn-footer-dismiss"
            >
              បិទ
            </button>
            <button
              onClick={() => { onEdit && onEdit(opportunity); onClose(); }}
              className="btn-footer-edit"
            >
              <i className="bi bi-pencil-square" /> កែប្រែ
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop-frosted {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          zIndex: 1050;
        }

        .modal-panel-custom {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          zIndex: 1060;
          width: min(780px, 96vw);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes modalIn {
          from { opacity:0; transform: translate(-50%,-48%) scale(0.96); }
          to   { opacity:1; transform: translate(-50%,-50%) scale(1); }
        }

        .modal-close-btn {
          position: absolute; top: 14px; right: 14px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          zIndex: 5;
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.32);
        }

        .modal-body-scrollable {
          overflow-y: auto; flex: 1; background: var(--color-bg-base); padding: 20px 24px;
        }

        .modal-columns-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
        }

        .modal-content-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 16px 18px;
          box-shadow: var(--shadow-card);
        }

        .card-value-text-block {
          color: var(--color-text-secondary);
          line-height: 1.75;
          white-space: pre-wrap;
          margin: 0;
          font-size: 14px;
        }

        .modal-footer-actions {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          background: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        /* Footer buttons */
        .btn-footer-delete {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 12px;
          border: 1.5px solid rgba(220, 202, 202, 0.3);
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626; fontWeight: 700; fontSize: 14px; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-footer-delete:hover {
          background: rgba(220, 38, 38, 0.15);
          border-color: #dc2626;
        }

        .btn-footer-close-op {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 12px;
          border: 1.5px solid rgba(251, 191, 36, 0.3);
          background: rgba(251, 191, 36, 0.15);
          color: #d97706; fontWeight: 700; fontSize: 14px; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-footer-close-op:hover {
          background: rgba(251, 191, 36, 0.25);
          border-color: #d97706;
        }

        .btn-footer-dismiss {
          padding: 9px 20px; border-radius: 12px;
          border: 1.5px solid var(--color-border); background: var(--color-bg-input);
          color: var(--color-text-primary); fontWeight: 600; fontSize: 14px; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-footer-dismiss:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-hover);
        }

        .btn-footer-edit {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 22px; border-radius: 12px;
          border: none;
          background: var(--color-accent);
          color: #000000 !important; fontWeight: 700; fontSize: 14px; cursor: pointer;
          box-shadow: 0 4px 14px var(--color-accent-glow);
          transition: all 0.2s;
        }
        .btn-footer-edit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--color-accent-glow);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .modal-columns-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

/* ── Small helper components ── */
function SectionTitle({ icon, label, color = "var(--color-accent)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `var(--color-accent-dim)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`bi ${icon}`} style={{ color, fontSize: 13 }} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text-primary)" }}>{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value, iconColor = "var(--color-text-secondary)" }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `var(--color-bg-input)`,
        border: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: 12 }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500, lineHeight: 1.4 }}>{value || "—"}</p>
      </div>
    </div>
  );
}

function LogisticItem({ icon, label, value, valueColor }) {
  const hasValue = value && value !== "—";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 12,
      background: "var(--color-bg-input)", border: "1px solid var(--color-border)",
    }}>
      <i className={`bi ${icon}`} style={{ color: "var(--color-accent)", fontSize: 16, flexShrink: 0 }} />
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: valueColor || (hasValue ? "var(--color-accent)" : "var(--color-text-muted)") }}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
