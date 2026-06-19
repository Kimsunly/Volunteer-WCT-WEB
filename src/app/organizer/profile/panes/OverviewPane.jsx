"use client";

import React from "react";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";

export default function OverviewPane({ stats, recentApps }) {
  // Default values if props are missing
  const {
    activeOpps = 0,
    totalVolunteers = 0,
    eventsThisMonth = 0,
    rating = 0,
    rating_count: ratingCount = 0,
  } = stats || {};
  const apps = recentApps || [];

  return (
    <div className="tab-pane fade show active" id="overview">
      <div className="container px-0">
        {/* KPI Cards */}
        <div className="row g-3">
          {/* KPI: Active Opps */}
          <div className="col-md-3" data-aos="fade-up">
            <div className="vh-kpi">
              <div className="vh-kpi-icon bg-blue-subtle">
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small">ការងារសកម្ម</div>
                <div className="fs-3 fw-bold">{activeOpps}</div>
                <div className="kpi-tag text-blue-subtle">Active</div>
              </div>
            </div>
          </div>

          {/* KPI: Total Volunteers */}
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
            <div className="vh-kpi">
              <div className="vh-kpi-icon bg-green-subtle">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small">អ្នកស្ម័គ្រចិត្តសរុប</div>
                <div className="fs-3 fw-bold">{totalVolunteers}</div>
                <div className="kpi-tag text-green-subtle">Total</div>
              </div>
            </div>
          </div>

          {/* KPI: Monthly Events */}
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="vh-kpi">
              <div className="vh-kpi-icon bg-purple-subtle">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small">ព្រឹត្តិការណ៍ខែនេះ</div>
                <div className="fs-3 fw-bold">{eventsThisMonth}</div>
                <div className="kpi-tag text-purple-subtle">Monthly</div>
              </div>
            </div>
          </div>

          {/* KPI: Ratings */}
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="vh-kpi">
              <div className="vh-kpi-icon bg-yellow-subtle">
                <i className="bi bi-star-fill"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small">ការវាយតម្លៃ</div>
                <div className="fs-3 fw-bold">{Number(rating).toFixed(1)}</div>
                <div className="d-flex align-items-center gap-1 mt-1">
                  <StarRating value={rating} readOnly size="sm" />
                </div>
                <small className="d-block mt-1 text-muted">
                  {ratingCount > 0 ? `${ratingCount} វាយតម្លៃ` : "គ្មានការវាយតម្លៃ"}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Recent applications + quick actions */}
        <div className="row g-3 mt-3">
          <div className="col-md-6" data-aos="fade-right">
            <div className="vh-section-card h-100">
              <h5 className="fw-bold mb-4 card-title-theme">ពាក្យសុំថ្មីៗ</h5>

              {apps.length === 0 ? (
                <div className="text-muted text-center py-4">គ្មានពាក្យសុំថ្មីៗទេ</div>
              ) : (
                <div className="d-flex flex-column gap-1">
                  {apps.map((app) => (
                    <div key={app.id} className="app-item d-flex align-items-center py-3">
                      <Image
                        src={app.avatar}
                        className="rounded-circle me-3 object-fit-cover border border-secondary border-opacity-25"
                        width={42}
                        height={42}
                        alt=""
                        unoptimized
                      />
                      <div>
                        <div className="fw-semibold text-primary-theme">{app.nameKh}</div>
                        <small className="text-muted">{app.dateKh}</small>
                      </div>
                      <span
                        className={`badge ms-auto app-status-badge ${
                          app.status === "approved"
                            ? "approved"
                            : app.status === "rejected"
                              ? "rejected"
                              : "pending"
                        }`}
                      >
                        {app.status === "pending"
                          ? "កំពុងរង់ចាំ"
                          : app.status === "approved"
                            ? "អនុម័ត"
                            : "បានបដិសេធ"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-left">
            <div className="vh-section-card h-100">
              <h5 className="fw-bold mb-4 card-title-theme">សកម្មភាពរហ័ស (Quick Actions)</h5>
              
              <div className="d-flex flex-column gap-2">
                <a href="#opportunities" className="quick-action qa-blue d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-plus-circle-fill me-2 fs-5"></i> Create New Opportunity
                  </span>
                  <i className="bi bi-chevron-right action-arrow"></i>
                </a>
                <a href="#applications" className="quick-action qa-green d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-people-fill me-2 fs-5"></i> Manage Volunteers
                  </span>
                  <i className="bi bi-chevron-right action-arrow"></i>
                </a>
                <a href="#analytics" className="quick-action qa-purple d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-graph-up me-2 fs-5"></i> View Reports
                  </span>
                  <i className="bi bi-chevron-right action-arrow"></i>
                </a>
                <a href="#settings" className="quick-action qa-orange d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-envelope-fill me-2 fs-5"></i> Send Messages
                  </span>
                  <i className="bi bi-chevron-right action-arrow"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vh-kpi {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .vh-kpi::after {
          content: "";
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%);
          right: -20px;
          bottom: -20px;
          opacity: 0.5;
          pointer-events: none;
        }
        .vh-kpi:hover {
          transform: translateY(-5px);
          border-color: var(--color-accent) !important;
          box-shadow: 0 12px 30px var(--color-accent-glow), var(--shadow-card) !important;
        }
        .vh-kpi .small {
          color: var(--color-text-secondary) !important;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .vh-kpi .fs-3 {
          font-size: 28px !important;
          font-weight: 700;
          color: var(--color-text-primary) !important;
        }
        .vh-kpi .vh-kpi-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }
        .vh-kpi:hover .vh-kpi-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .vh-kpi-icon.bg-blue-subtle {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
        }
        .vh-kpi-icon.bg-green-subtle {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
        }
        .vh-kpi-icon.bg-purple-subtle {
          background-color: rgba(165, 105, 189, 0.12) !important;
          color: #a569bd !important;
        }
        .vh-kpi-icon.bg-yellow-subtle {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
        }
        
        .kpi-tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
        .kpi-tag.text-blue-subtle { color: #0d6efd !important; }
        .kpi-tag.text-green-subtle { color: var(--color-accent) !important; }
        .kpi-tag.text-purple-subtle { color: #a569bd !important; }

        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 24px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-section-card:hover {
          border-color: var(--color-border-hover) !important;
        }
        
        .card-title-theme {
          color: var(--color-text-primary) !important;
          font-size: 16px;
        }
        
        .app-item {
          border-bottom: 1px solid var(--color-border);
          transition: all 0.25s ease;
        }
        .app-item:hover {
          transform: translateX(4px);
        }
        .app-item:last-of-type {
          border-bottom: none;
        }
        
        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-muted {
          color: var(--color-text-secondary) !important;
        }
        
        .app-status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 100px;
        }
        .app-status-badge.approved {
          background-color: rgba(22, 163, 74, 0.12) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(22, 163, 74, 0.2) !important;
        }
        .app-status-badge.rejected {
          background-color: rgba(220, 38, 38, 0.12) !important;
          color: #dc2626 !important;
          border: 1px solid rgba(220, 38, 38, 0.2) !important;
        }
        .app-status-badge.pending {
          background-color: rgba(217, 119, 6, 0.12) !important;
          color: #d97706 !important;
          border: 1px solid rgba(217, 119, 6, 0.2) !important;
        }
        
        .quick-action {
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary) !important;
          border-radius: 12px;
          padding: 14px 18px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.25s ease;
        }
        .quick-action i:not(.action-arrow) {
          transition: transform 0.25s ease;
        }
        .quick-action:hover i:not(.action-arrow) {
          transform: scale(1.15);
        }
        .quick-action .action-arrow {
          font-size: 12px;
          color: var(--color-text-secondary);
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .quick-action:hover .action-arrow {
          transform: translateX(4px);
          color: var(--color-text-primary);
        }
        
        .quick-action.qa-blue:hover {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.06);
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.08);
        }
        .quick-action.qa-blue i:not(.action-arrow) {
          color: #0d6efd;
        }
        
        .quick-action.qa-green:hover {
          border-color: var(--color-accent);
          background-color: var(--color-accent-dim);
          box-shadow: 0 4px 15px var(--color-accent-glow);
        }
        .quick-action.qa-green i:not(.action-arrow) {
          color: var(--color-accent);
        }
        
        .quick-action.qa-purple:hover {
          border-color: #a569bd;
          background-color: rgba(165, 105, 189, 0.06);
          box-shadow: 0 4px 15px rgba(165, 105, 189, 0.08);
        }
        .quick-action.qa-purple i:not(.action-arrow) {
          color: #a569bd;
        }
        
        .quick-action.qa-orange:hover {
          border-color: #db2777;
          background-color: rgba(219, 39, 119, 0.06);
          box-shadow: 0 4px 15px rgba(219, 39, 119, 0.08);
        }
        .quick-action.qa-orange i:not(.action-arrow) {
          color: #db2777;
        }
      `}</style>
    </div>
  );
}
