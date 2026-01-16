"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getUserStats, getUserActivities, getRecommendedActivities } from "@/services/user";

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
          getRecommendedActivities()
        ]);
        setStats(statsRes);
        setActivities(actRes);
        setRecommendations(recRes);
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
  const hoursProgress = Math.min(((stats?.total_hours || 0) / hoursTarget) * 100, 100);

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
              <small className="d-block">{stats?.total_hours || 0} / {hoursTarget}</small>
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
              <div className="fs-3 fw-bold">{stats?.completed_projects || 0}</div>
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

              {activities.length === 0 ? (
                <div className="text-center text-muted py-4">មិនទាន់មានសកម្មភាពទេ</div>
              ) : (
                <ul className="list-unstyled m-0">
                  {activities.slice(0, 5).map((act) => (
                    <li key={act.id} className="vh-activity-item">
                      <div className={`vh-activity-dot ${act.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
                        {act.status === 'completed' ? <i className="bi bi-check2"></i> : <i className="bi bi-clock"></i>}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{act.title || "Untitled"}</div>
                        <div className="small">
                          {act.date ? new Date(act.date).toLocaleDateString('km-KH') : 'TBD'} • {act.location || "N/A"} • {act.hours}h
                        </div>
                      </div>
                      <span className={`badge rounded-pill ${act.status === 'completed' ? 'text-bg-success-subtle text-success' :
                        act.status === 'pending' ? 'text-bg-warning-subtle text-warning' :
                          'text-bg-primary-subtle text-primary'
                        }`}>
                        {act.status === 'completed' ? 'បញ្ចប់' : act.status === 'pending' ? 'រង់ចាំ' : 'កំពុងធ្វើ'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link href="#" className="small mt-3 d-inline-block" onClick={(e) => e.preventDefault()}>
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

              {recommendations.length === 0 ? (
                <div className="text-center text-muted py-4">
                  មិនមានការណែនាំទេ សូមបំពេញជំនាញក្នុងប្រវត្តិរូប
                </div>
              ) : (
                recommendations.map(rec => (
                  <div key={rec.id} className="vh-reco-card mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{rec.title}</div>
                        <div className="text-muted small">{rec.title_en}</div>
                        <div className="small mt-1 d-flex flex-wrap gap-3">
                          <span>
                            <i className="bi bi-calendar2 me-1"></i>
                            {rec.date ? new Date(rec.date).toLocaleDateString('km-KH') : 'TBD'}
                          </span>
                          <span>
                            <i className="bi bi-geo-alt me-1"></i> {rec.location || "Online"}
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
    </div>
  );
}
