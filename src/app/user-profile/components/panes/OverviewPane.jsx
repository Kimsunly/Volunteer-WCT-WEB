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
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-primary-subtle text-primary">
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ម៉ោងសរុប</div>
              <div className="fs-3 fw-bold">{stats?.total_hours || 0}</div>
              <div className="progress vh-progress mt-1">
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${hoursProgress}%` }}
                ></div>
              </div>
              <small className="d-block">
                {stats?.total_hours || 0} / {hoursTarget}
              </small>
            </div>
          </div>
        </div>

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
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-purple-subtle text-purple">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ព្រឹត្តិការណ៍ខាងមុខ</div>
              <div className="fs-3 fw-bold">{stats?.upcoming_events || 0}</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-warning-subtle text-warning">
              <i className="bi bi-stars"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ពិន្ទុ</div>
              <div className="fs-3 fw-bold">{stats?.points || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Recommended */}
      <div className="container-xxl my-3">
        <div className="row g-3">
          {/* Recent Activities */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h6 className="mb-0">សកម្មភាពថ្មីៗ</h6>
                  <small>Recent Activities</small>
                </div>
              </div>

              {!Array.isArray(activities) || activities.length === 0 ? (
                <div className="text-center text-muted py-4">
                  មិនទាន់មានសកម្មភាពទេ
                </div>
              ) : (
                <ul className="list-unstyled m-0">
                  {activities.slice(0, 5).map((act) => {
                    const activityStatus = act.activity_status || act.status;
                    const isCompleted = activityStatus === "completed";
                    const isPending = activityStatus === "pending";

                    return (
                      <li key={act.id} className="vh-activity-item">
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
                          <div className="fw-semibold">
                            {act.title || "Untitled"}
                          </div>
                          <div className="small">
                            {act.date
                              ? new Date(act.date).toLocaleDateString("km-KH")
                              : "TBD"}{" "}
                            • {act.location || "N/A"} •{" "}
                            {isCompleted
                              ? `${act.hours || act.planned_hours || 0}h`
                              : act.planned_hours
                                ? `~${act.planned_hours}h`
                                : "—"}
                          </div>
                        </div>
                        <span
                          className={`badge rounded-pill ${
                            isCompleted
                              ? "text-bg-success-subtle text-success"
                              : isPending
                                ? "text-bg-warning-subtle text-warning"
                                : activityStatus === "upcoming"
                                  ? "text-bg-info-subtle text-info"
                                  : "text-bg-primary-subtle text-primary"
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
                      </li>
                    );
                  })}
                </ul>
              )}

              <Link
                href="#"
                className="small mt-3 d-inline-block"
                onClick={(e) => e.preventDefault()}
              >
                {/* Placeholder link, could go to full history tab */}
                មើលទាំងអស់ / View All
              </Link>
            </div>
          </div>

          {/* Recommended for You (short list) */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="mb-2">
                <h6 className="mb-0">ការណែនាំសម្រាប់អ្នក</h6>
                <small>Recommended for You</small>
              </div>

              {!Array.isArray(recommendations) ||
              recommendations.length === 0 ? (
                <div className="text-center text-muted py-4">
                  មិនមានការណែនាំទេ សូមបំពេញជំនាញក្នុងប្រវត្តិរូប
                </div>
              ) : (
                recommendations.map((rec) => (
                  <div key={rec.id} className="vh-reco-card mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{rec.title}</div>
                        <div className="text-muted small">{rec.title_en}</div>
                        <div className="small mt-1 d-flex flex-wrap gap-3">
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
                        <div className="small mt-2 badge bg-light text-dark border">
                          {rec.category || "General"}
                        </div>
                      </div>
                      <span className="badge rounded-pill text-bg-success-subtle text-success">
                        {rec.match_score}% match
                      </span>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <Link
                        href={`/opportunities/${rec.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        ចូលរួម
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vh-kpi {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-card) !important;
          box-shadow: var(--shadow-card) !important;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-kpi:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-hover) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        }
        .vh-kpi .small {
          color: var(--color-text-secondary) !important;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 11px;
          margin-bottom: 4px;
        }
        .vh-kpi .fs-3 {
          font-size: 26px !important;
          font-weight: 700;
          color: var(--color-text-primary) !important;
        }
        .vh-kpi .vh-kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
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
        .vh-kpi .vh-progress {
          height: 6px;
          background-color: var(--color-border) !important;
          border-radius: 100px;
          margin-top: 8px;
          overflow: hidden;
        }
        .vh-kpi .vh-progress .progress-bar {
          border-radius: 100px;
        }
        .vh-kpi small {
          color: var(--color-text-secondary) !important;
          font-size: 11px;
          margin-top: 4px;
          display: block;
        }

        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: var(--radius-card) !important;
          box-shadow: var(--shadow-card) !important;
          padding: 24px !important;
          transition: all 0.3s ease;
        }
        .vh-section-card h6 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary) !important;
          margin-bottom: 2px;
        }
        .vh-section-card small {
          color: var(--color-text-secondary) !important;
        }
        .vh-section-card a {
          color: var(--color-accent) !important;
          font-weight: 600;
          text-decoration: none;
        }
        .vh-section-card a:hover {
          text-decoration: underline;
        }

        .vh-activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--color-border);
        }
        .vh-activity-item:last-of-type {
          border-bottom: none;
        }
        .vh-activity-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vh-activity-dot.bg-success-subtle {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
        }
        .vh-activity-dot.bg-primary-subtle {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
        }
        .vh-activity-item .fw-semibold {
          color: var(--color-text-primary);
          font-size: 14.5px;
        }
        .vh-activity-item .small {
          color: var(--color-text-secondary) !important;
          font-size: 12px;
        }
        .vh-activity-item .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 100px;
        }
        .vh-activity-item .badge.text-bg-success-subtle {
          background-color: rgba(25, 135, 84, 0.12) !important;
          color: #198754 !important;
          border: 1px solid rgba(25, 135, 84, 0.2) !important;
        }
        .vh-activity-item .badge.text-bg-warning-subtle {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.2) !important;
        }
        .vh-activity-item .badge.text-bg-info-subtle {
          background-color: rgba(13, 110, 253, 0.12) !important;
          color: #0d6efd !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
        .vh-activity-item .badge.text-bg-primary-subtle {
          background-color: rgba(165, 105, 189, 0.12) !important;
          color: #a569bd !important;
          border: 1px solid rgba(165, 105, 189, 0.2) !important;
        }

        .vh-reco-card {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 14px !important;
          padding: 16px;
          transition: all 0.25s ease;
        }
        .vh-reco-card:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 4px 15px var(--color-accent-dim);
          transform: translateY(-1px);
        }
        .vh-reco-card .fw-semibold {
          color: var(--color-text-primary);
          font-size: 15px;
        }
        .vh-reco-card .text-muted {
          color: var(--color-text-secondary) !important;
        }
        .vh-reco-card .small {
          color: var(--color-text-secondary) !important;
        }
        .vh-reco-card .badge {
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          border: 1px solid var(--color-border) !important;
          font-weight: 500;
        }
        .vh-reco-card .badge.text-success {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: none !important;
          font-weight: 700;
        }
        .vh-reco-card .btn-primary {
          background: var(--color-accent);
          color: #000;
          font-weight: 700;
          border: none;
          padding: 6px 16px;
          border-radius: var(--radius-btn);
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .vh-reco-card .btn-primary:hover {
          opacity: 0.9;
          box-shadow: 0 0 10px var(--color-accent-glow);
        }
      `}</style>
    </div>
  );
}
