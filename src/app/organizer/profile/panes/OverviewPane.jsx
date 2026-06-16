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
          <div className="col-md-3" data-aos="fade-up">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>ការងារសកម្ម</h6>
                  <h3>{activeOpps}</h3>
                  <small className="text-success">បច្ចុប្បន្ន</small>
                </div>
                <div className="icon-box icon-blue d-flex align-items-center justify-content-center">
                  <i className="bi bi-briefcase fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>អ្នកស្ម័គ្រចិត្តសរុប</h6>
                  <h3>{totalVolunteers}</h3>
                  <small className="text-success">សរុប</small>
                </div>
                <div className="icon-box icon-green d-flex align-items-center justify-content-center">
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>ព្រឹត្តិការណ៍ខែនេះ</h6>
                  <h3>{eventsThisMonth}</h3>
                  <small className="text-success">ខែនេះ</small>
                </div>
                <div className="icon-box icon-purple d-flex align-items-center justify-content-center">
                  <i className="bi bi-calendar-event fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>ការវាយតម្លៃ</h6>
                  <h3>{Number(rating).toFixed(1)}</h3>
                  <div className="my-1">
                    <StarRating value={rating} readOnly size="sm" />
                  </div>
                  <small className="text-muted d-block">
                    {ratingCount > 0 ? `${ratingCount} វាយតម្លៃ` : "មិនទាន់មានវាយតម្លៃ"}
                  </small>
                </div>
                <div className="icon-box icon-yellow d-flex align-items-center justify-content-center">
                  <i className="bi bi-star-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent applications + quick actions */}
        <div className="row g-3 mt-3">
          <div className="col-md-6" data-aos="fade-right">
            <div className="card card-custom p-4">
              <h6 className="fw-bold mb-4">ពាក្យសុំថ្មីៗ</h6>

              {apps.length === 0 ? (
                <div className="text-muted text-center py-4">គ្មានពាក្យសុំថ្មីៗទេ</div>
              ) : (
                <div className="d-flex flex-column gap-1">
                  {apps.map((app) => (
                    <div key={app.id} className="app-item d-flex align-items-center py-3">
                      <Image
                        src={app.avatar}
                        className="rounded-circle me-3 object-fit-cover border border-secondary border-opacity-25"
                        width={44}
                        height={44}
                        alt=""
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

              <a href="#" className="d-inline-block mt-3 text-primary small">
                មើលទាំងអស់
              </a>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-left">
            <div className="card card-custom p-4">
              <h6 className="fw-bold mb-4">Quick Actions</h6>
              
              <a href="#" className="quick-action qa-blue d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <i className="bi bi-plus-circle-fill me-2 fs-5"></i> Create New Opportunity
                </span>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              <a href="#" className="quick-action qa-green d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <i className="bi bi-people-fill me-2 fs-5"></i> Manage Volunteers
                </span>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              <a href="#" className="quick-action qa-purple d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <i className="bi bi-graph-up me-2 fs-5"></i> View Reports
                </span>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              <a href="#" className="quick-action qa-orange d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-2 fs-5"></i> Send Messages
                </span>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-custom {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-card) !important;
          box-shadow: var(--shadow-card) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-custom:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-hover) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        }
        
        .card-custom h6 {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .card-custom h3 {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }
        .card-custom .text-success {
          color: var(--color-accent) !important;
          font-size: 12px;
          font-weight: 500;
        }
        
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .card-custom:hover .icon-box {
          transform: scale(1.05);
        }
        .icon-box.icon-blue {
          background-color: rgba(13, 110, 253, 0.12);
          color: #0d6efd;
        }
        .icon-box.icon-green {
          background-color: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .icon-box.icon-purple {
          background-color: rgba(165, 105, 189, 0.12);
          color: #a569bd;
        }
        .icon-box.icon-yellow {
          background-color: rgba(255, 193, 7, 0.12);
          color: #ffc107;
        }
        
        .app-item {
          border-bottom: 1px solid var(--color-border);
          transition: background-color 0.2s ease;
        }
        .app-item:last-of-type {
          border-bottom: none;
        }
        .text-primary-theme {
          color: var(--color-text-primary);
        }
        
        .app-status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 100px;
        }
        .app-status-badge.approved {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .app-status-badge.rejected {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.2) !important;
        }
        .app-status-badge.pending {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
        }
        
        .card-custom h6.fw-bold {
          color: var(--color-text-primary);
          text-transform: none;
          letter-spacing: normal;
          font-size: 15.5px;
        }
        
        .card-custom a.text-primary {
          color: var(--color-accent) !important;
          font-weight: 600;
          transition: opacity 0.2s ease;
          text-decoration: none;
        }
        .card-custom a.text-primary:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .quick-action {
          background-color: var(--color-bg-input);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary) !important;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 12px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.25s ease;
        }
        .quick-action:last-child {
          margin-bottom: 0;
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
          border-color: #9b5de5;
          background-color: rgba(155, 93, 229, 0.06);
          box-shadow: 0 4px 15px rgba(155, 93, 229, 0.08);
        }
        .quick-action.qa-purple i:not(.action-arrow) {
          color: #9b5de5;
        }
        
        .quick-action.qa-orange:hover {
          border-color: #f15bb5;
          background-color: rgba(241, 91, 181, 0.06);
          box-shadow: 0 4px 15px rgba(241, 91, 181, 0.08);
        }
        .quick-action.qa-orange i:not(.action-arrow) {
          color: #f15bb5;
        }

        .text-muted {
          color: var(--color-text-secondary) !important;
        }
      `}</style>
    </div>
  );
}
