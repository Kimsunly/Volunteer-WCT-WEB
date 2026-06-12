"use client";

import React, { useState } from "react";
import Image from "next/image";

function getCategoryDefaultImage(category) {
  const cat = (category || "").toLowerCase();
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
  active:   { label: "សកម្ម",        color: "#16a34a", bg: "rgba(22,163,74,0.12)",   icon: "bi-check-circle-fill" },
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
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
        }}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1060,
          width: "min(780px, 96vw)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          background: "#fff",
        }}
      >
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
            background: "linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              zIndex: 5,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.32)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          >
            <i className="bi bi-x-lg" style={{ fontSize: 14 }} />
          </button>

          {/* Hero text */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 20px" }}>
            {/* Category pill */}
            <span style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #2d6a4f, #40916c)",
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
        <div style={{ overflowY: "auto", flex: 1, background: "#f8faf9", padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Description */}
              <div style={cardStyle}>
                <SectionTitle icon="bi-file-text" label="ពិពណ៌នា" />
                <p style={{ color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap", margin: 0, fontSize: 14 }}>
                  {raw.description || "គ្មានការពិពណ៌នា"}
                </p>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div style={cardStyle}>
                  <SectionTitle icon="bi-lightning-charge" label="ជំនាញដែលត្រូវការ" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{
                        background: "linear-gradient(135deg, #e8f5e9, #d0f0dc)",
                        color: "#166534", fontSize: 12, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 20,
                        border: "1px solid rgba(22,101,52,0.15)",
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {tasks.length > 0 && (
                <div style={cardStyle}>
                  <SectionTitle icon="bi-list-check" label="ភារកិច្ចស្ម័គ្រចិត្ត" />
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {tasks.map((t, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                          background: "linear-gradient(135deg, #2d6a4f, #40916c)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i className="bi bi-check" style={{ color: "#fff", fontSize: 12 }} />
                        </span>
                        <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Logistics */}
              <div style={cardStyle}>
                <SectionTitle icon="bi-boxes" label="ហេដ្ឋារចនាសម្ព័ន្ធ" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <LogisticItem icon="bi-truck" label="ការដឹកជញ្ជូន" value={logistic.transport} />
                  <LogisticItem icon="bi-house-heart" label="ទីស្នាក់នៅ" value={logistic.housing} />
                  <LogisticItem icon="bi-egg-fried" label="អាហារ" value={logistic.meals || logistic.meal} />
                  <LogisticItem icon="bi-eye"
                    label="ការមើលឃើញ"
                    value={raw.is_private ? "ឯកជន (Private)" : "សាធារណៈ (Public)"}
                    valueColor={raw.is_private ? "#7c3aed" : "#2563eb"}
                  />
                </div>
              </div>

              {/* Impact */}
              {details.impact_description && (
                <div style={{ ...cardStyle, background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderColor: "rgba(34,197,94,0.2)" }}>
                  <SectionTitle icon="bi-heart-pulse" label="ផលប៉ះពាល់" color="#16a34a" />
                  <p style={{ color: "#166534", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {details.impact_description}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Status card */}
              <div style={{
                ...cardStyle,
                background: statusCfg.bg,
                border: `1.5px solid ${statusCfg.color}30`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: statusCfg.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className={`bi ${statusCfg.icon}`} style={{ color: "#fff", fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>ស្ថានភាព</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: statusCfg.color }}>{statusCfg.label}</p>
                  </div>
                </div>

                {/* Capacity progress */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>ការចូលរួម</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{registrations}<span style={{ color: "#9ca3af", fontWeight: 400 }}> / {capacity}</span></span>
                  </div>
                  <div style={{ height: 8, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.min(fillPct, 100)}%`,
                      background: `linear-gradient(90deg, ${statusCfg.color}, ${statusCfg.color}cc)`,
                      borderRadius: 99,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#6b7280", textAlign: "right" }}>{fillPct}% បំពេញ</p>
                </div>
              </div>

              {/* Date & location */}
              <div style={cardStyle}>
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
                <div style={cardStyle}>
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
                <div style={{ ...cardStyle, textAlign: "center", padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase" }}>ប្រភេទជំនួយ</p>
                  <span style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #1e40af, #2563eb)",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    padding: "5px 16px", borderRadius: 20,
                  }}>{details.help_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px",
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { onDelete && onDelete(opportunity.id); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 12,
                border: "1.5px solid #fecaca",
                background: "rgba(254,202,202,0.2)",
                color: "#dc2626", fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#dc2626"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(254,202,202,0.2)"; e.currentTarget.style.borderColor = "#fecaca"; }}
            >
              <i className="bi bi-trash3" />
              លុប
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
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 12,
                  border: "1.5px solid #fbbf24",
                  background: "rgba(251,191,36,0.15)",
                  color: "#d97706", fontWeight: 700, fontSize: 14, cursor: closing ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: closing ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!closing) { e.currentTarget.style.background = "rgba(251,191,36,0.25)"; e.currentTarget.style.borderColor = "#d97706"; } }}
                onMouseLeave={e => { if (!closing) { e.currentTarget.style.background = "rgba(251,191,36,0.15)"; e.currentTarget.style.borderColor = "#fbbf24"; } }}
              >
                <i className={closing ? "bi bi-arrow-repeat spin" : "bi bi-x-circle"} />
                {closing ? "កំពុងបិទ..." : "បិទឱកាស"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px", borderRadius: 12,
                border: "1.5px solid #e5e7eb", background: "#f9fafb",
                color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; }}
            >
              បិទ
            </button>
            <button
              onClick={() => { onEdit && onEdit(opportunity); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 22px", borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2d6a4f, #40916c)",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(45,106,79,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,106,79,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,79,0.3)"; }}
            >
              <i className="bi bi-pencil-square" />
              កែប្រែ
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform: translate(-50%,-48%) scale(0.96); }
          to   { opacity:1; transform: translate(-50%,-50%) scale(1); }
        }
      `}</style>
    </>
  );
}

/* ── Small helper components ── */
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: "16px 18px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

function SectionTitle({ icon, label, color = "#2d6a4f" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`bi ${icon}`} style={{ color, fontSize: 13 }} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value, iconColor = "#6b7280" }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `${iconColor}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: 12 }} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>{value || "—"}</p>
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
      background: "#f8faf9", border: "1px solid #e5e7eb",
    }}>
      <i className={`bi ${icon}`} style={{ color: "#2d6a4f", fontSize: 16, flexShrink: 0 }} />
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: valueColor || (hasValue ? "#166534" : "#9ca3af") }}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
