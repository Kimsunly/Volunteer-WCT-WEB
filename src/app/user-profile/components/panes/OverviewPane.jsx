"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getUserStats,
  getUserActivities,
  getRecommendedActivities,
} from "@/services/user";

export default function OverviewPane() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes, recRes] = await Promise.all([
          getUserStats(),
          getUserActivities(),
          getRecommendedActivities(),
        ]);
        setStats(statsRes);
        setActivities(Array.isArray(actRes) ? actRes : []);
        setRecommendations(Array.isArray(recRes) ? recRes : []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center">កំពុងដំណើរការ...</div>;
  }

  // Calculate progress percent for fun (or based on target)
  const hoursTarget = 200;
  const hoursProgress = Math.min(
    ((stats?.total_hours || 0) / hoursTarget) * 100,
    100,
  );

  return (
    <div className="tab-pane fade show active" id="tabOverview">
      {/* KPIs */}
      <div className="row g-4 mb-4">
        {/* KPI: Total Hours */}
        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-primary-subtle text-primary">
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ម៉ោងសរុប</div>
              <div className="fs-3 fw-bold">{stats?.total_hours || 0}</div>
              <div className="progress vh-progress mt-2">
                <div
                  className="progress-bar"
                  style={{ width: `${hoursProgress}%` }}
                ></div>
              </div>
              <small className="d-block mt-1">
                {stats?.total_hours || 0} / {hoursTarget}
              </small>
            </div>
          </div>
        </div>

        {/* KPI: Completed Projects */}
        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-success-subtle text-success">
              <i className="bi bi-check2-circle"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">គម្រោងបញ្ចប់</div>
              <div className="fs-3 fw-bold">
                {stats?.completed_projects || 0}
              </div>
              <div className="kpi-tag text-success-subtle">Completed</div>
            </div>
          </div>
        </div>

        {/* KPI: Upcoming Events */}
        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-purple-subtle text-purple">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ព្រឹត្តិការណ៍ខាងមុខ</div>
              <div className="fs-3 fw-bold">{stats?.upcoming_events || 0}</div>
              <div className="kpi-tag text-purple-subtle">Upcoming</div>
            </div>
          </div>
        </div>

        {/* KPI: Points */}
        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-warning-subtle text-warning">
              <i className="bi bi-stars"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ពិន្ទុ</div>
              <div className="fs-3 fw-bold">{stats?.points || 0}</div>
              <div className="kpi-tag text-warning-subtle">Reward Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Recommended */}
      <div className="container-fluid px-0 my-4">
        <div className="row g-4">
          {/* Recent Activities */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary-subtle border-opacity-10">
                <div>
                  <h6 className="mb-0 fw-bold fs-5">សកម្មភាពថ្មីៗ</h6>
                  <small className="opacity-75">Recent Activities</small>
                </div>
              </div>

              {!Array.isArray(activities) || activities.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-calendar-x fs-2 mb-2 d-block opacity-50"></i>
                  មិនទាន់មានសកម្មភាពទេ
                </div>
              ) : (
                <div className="vh-activity-list">
                  {activities.slice(0, 5).map((act) => {
                    const activityStatus = act.activity_status || act.status;
                    const isCompleted = activityStatus === "completed";
                    const isPending = activityStatus === "pending";

                    return (
                      <div key={act.id} className="vh-activity-item">
                        <div
                          className={`vh-activity-dot ${isCompleted ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary"}`}
                        >
                          {isCompleted ? (
                            <i className="bi bi-check2"></i>
                          ) : (
                            <i className="bi bi-clock"></i>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-primary-theme">
                            {act.title || "Untitled"}
                          </div>
                          <div className="small text-secondary-theme d-flex align-items-center gap-2 mt-1">
                            <span>
                              <i className="bi bi-calendar3 me-1"></i>
                              {act.date
                                ? new Date(act.date).toLocaleDateString("km-KH")
                                : "TBD"}
                            </span>
                            <span>•</span>
                            <span>
                              <i className="bi bi-geo-alt me-1"></i>
                              {act.location || "N/A"}
                            </span>
                            <span>•</span>
                            <span className="fw-medium">
                              {isCompleted
                                ? `${act.hours || act.planned_hours || 0}h`
                                : act.planned_hours
                                  ? `~${act.planned_hours}h`
                                  : "—"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            isCompleted
                              ? "status-badge-success"
                              : isPending
                                ? "status-badge-warning"
                                : activityStatus === "upcoming"
                                  ? "status-badge-info"
                                  : "status-badge-primary"
                          }`}
                        >
                          {isCompleted
                            ? "បញ្ចប់"
                            : isPending
                              ? "រង់ចាំ"
                              : activityStatus === "upcoming"
                                ? "បានអនុម័ត"
                                : "កំពុងដំណើរការ"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-start mt-4 pt-2">
                <Link
                  href="#"
                  className="vh-view-all-link"
                  onClick={(e) => e.preventDefault()}
                >
                  មើលទាំងអស់ / View All <i className="bi bi-arrow-right-short ms-1"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Recommended for You */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary-subtle border-opacity-10">
                <div>
                  <h6 className="mb-0 fw-bold fs-5">ការណែនាំសម្រាប់អ្នក</h6>
                  <small className="opacity-75">Recommended for You</small>
                </div>
              </div>

              {!Array.isArray(recommendations) ||
              recommendations.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-patch-question fs-2 mb-2 d-block opacity-50"></i>
                  មិនមានការណែនាំទេ សូមបំពេញជំនាញក្នុងប្រវត្តិរូប
                </div>
              ) : (
                <div className="vh-reco-list d-flex flex-column gap-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="vh-reco-card">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div className="flex-grow-1">
                          <div className="fw-semibold rec-title">{rec.title}</div>
                          <div className="rec-title-en text-muted small">{rec.title_en}</div>
                          <div className="small mt-2 d-flex flex-wrap gap-3 rec-details">
                            <span>
                              <i className="bi bi-calendar2 me-1"></i>
                              {rec.date
                                ? new Date(rec.date).toLocaleDateString("km-KH")
                                : "TBD"}
                            </span>
                            <span>
                              <i className="bi bi-geo-alt me-1"></i>{" "}
                              {rec.location || "Online"}
                            </span>
                          </div>
                          <div className="mt-3">
                            <span className="badge category-badge">
                              {rec.category || "General"}
                            </span>
                          </div>
                        </div>
                        <span className="badge match-score-badge">
                          <i className="bi bi-heart-fill me-1 text-danger"></i> {rec.match_score}% match
                        </span>
                      </div>
                      <div className="d-flex justify-content-end mt-3 border-top border-secondary-subtle border-opacity-10 pt-3">
                        <Link
                          href={`/opportunities/${rec.id}`}
                          className="btn btn-join-opportunity btn-sm px-4"
                        >
                          ចូលរួម
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          gap: 20px;
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
        .vh-kpi-icon.bg-primary-subtle {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
        }
        .vh-kpi-icon.bg-success-subtle {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
        }
        .vh-kpi-icon.bg-purple-subtle {
          background-color: rgba(165, 105, 189, 0.12) !important;
          color: #a569bd !important;
        }
        .vh-kpi-icon.bg-warning-subtle {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
        }
        .kpi-tag {
          font-size: 10px;
          font-weight: 600;
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
        .vh-kpi .vh-progress {
          height: 8px;
          background-color: var(--color-bg-input) !important;
          border-radius: 100px;
          margin-top: 10px;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .vh-kpi .vh-progress .progress-bar {
          border-radius: 100px;
          background: linear-gradient(90deg, #0d6efd, var(--color-accent)) !important;
        }
        .vh-kpi small {
          color: var(--color-text-secondary) !important;
          font-size: 11px;
        }

        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 28px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-section-card:hover {
          border-color: var(--color-border-hover) !important;
        }
        
        .vh-activity-list {
          position: relative;
          padding-left: 12px;
        }
        .vh-activity-list::before {
          content: "";
          position: absolute;
          left: 29px;
          top: 24px;
          bottom: 24px;
          width: 2px;
          background: linear-gradient(to bottom, var(--color-border) 0%, rgba(255,255,255,0.02) 100%);
          opacity: 0.5;
        }

        .vh-activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 12px;
          margin-bottom: 8px;
          border-radius: 14px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }
        .vh-activity-item:hover {
          background-color: var(--color-bg-card-hover) !important;
          transform: translateX(4px);
        }
        
        .vh-activity-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid var(--color-border);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          background-color: var(--color-bg-card) !important;
          transition: all 0.25s ease;
        }
        .vh-activity-item:hover .vh-activity-dot {
          transform: scale(1.1);
          border-color: var(--color-accent);
          box-shadow: 0 0 8px var(--color-accent-glow);
        }
        
        .vh-activity-dot.bg-success-subtle {
          color: var(--color-accent) !important;
        }
        .vh-activity-dot.bg-primary-subtle {
          color: #0d6efd !important;
        }

        .text-primary-theme {
          color: var(--color-text-primary) !important;
          font-size: 15px;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
          font-size: 12.5px;
        }

        /* Status badges */
        .status-badge-success {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-warning {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-info {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-primary {
          background-color: rgba(165, 105, 189, 0.12) !important;
          color: #a569bd !important;
          border: 1px solid rgba(165, 105, 189, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }

        .vh-view-all-link {
          color: var(--color-accent) !important;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        .vh-view-all-link:hover {
          color: var(--color-text-primary) !important;
          transform: translateX(3px);
        }

        /* Recommendation card list */
        .vh-reco-card {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px !important;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-reco-card:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 8px 20px var(--color-accent-glow);
          transform: translateY(-2px);
        }
        .rec-title {
          color: var(--color-text-primary) !important;
          font-size: 15.5px;
        }
        .rec-title-en {
          color: var(--color-text-secondary) !important;
        }
        .rec-details {
          color: var(--color-text-secondary) !important;
        }
        
        .category-badge {
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          border: 1px solid var(--color-border) !important;
          font-weight: 500;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 8px;
        }
        .match-score-badge {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
          font-weight: 700;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
        }
        
        .btn-join-opportunity {
          background: var(--color-accent) !important;
          color: #000000 !important;
          font-weight: 600;
          border: none;
          padding: 8px 20px;
          border-radius: var(--radius-btn);
          font-size: 13.5px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-join-opportunity:hover {
          box-shadow: 0 0 12px var(--color-accent-glow);
          transform: scale(1.02);
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}
