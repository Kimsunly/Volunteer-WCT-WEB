"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getUserActivities, rateApplication } from "@/services/user";
import { format } from "date-fns";
import { km } from "date-fns/locale";
import StarRating from "@/components/common/StarRating";
import { showToast } from "@/components/common/CustomToaster";

const STATUS_LABELS = {
  pending: { label: "រង់ចាំអនុម័ត", className: "status-badge-warning" },
  upcoming: { label: "បានអនុម័ត", className: "status-badge-info" },
  in_progress: { label: "កំពុងដំណើរការ", className: "status-badge-primary" },
  completed: { label: "បានបញ្ចប់", className: "status-badge-success" },
  rejected: { label: "បានបដិសេធ", className: "status-badge-danger" },
  withdrawn: { label: "បានបោះបង់", className: "status-badge-secondary" },
};

function getStatusBadge(activityStatus) {
  const config = STATUS_LABELS[activityStatus] || {
    label: activityStatus,
    className: "status-badge-secondary",
  };
  return (
    <span className={`badge rounded-pill px-3 py-2 ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function ActivitiesPane() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingLoadingId, setRatingLoadingId] = useState(null);

  const fetchActivities = useCallback(() => {
    return getUserActivities()
      .then(setActivities)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchActivities().finally(() => setLoading(false));
  }, [fetchActivities]);

  const handleRate = async (activity, stars) => {
    if (!activity.can_rate || ratingLoadingId) return;

    setRatingLoadingId(activity.id);
    try {
      await rateApplication(activity.application_id || activity.id, stars);
      setActivities((prev) =>
        prev.map((act) =>
          act.id === activity.id
            ? { ...act, rating: stars, can_rate: false }
            : act,
        ),
      );
      showToast.success("អរគុណសម្រាប់ការវាយតម្លៃ!", "វាយតម្លៃជោគជ័យ");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "មិនអាចវាយតម្លៃបានទេ";
      showToast.error(msg, "កំហុស");
    } finally {
      setRatingLoadingId(null);
    }
  };

  const renderRatingCell = (act) => {
    if (act.rating) {
      return (
        <div className="d-flex flex-column align-items-end">
          <span className="small text-muted mb-1 opacity-75">ការវាយតម្លៃរបស់អ្នក៖</span>
          <StarRating
            value={act.rating}
            readOnly
            size="sm"
            title={`${act.rating}/5`}
          />
        </div>
      );
    }

    if (act.can_rate) {
      return (
        <div className="d-flex flex-column align-items-end">
          <StarRating
            value={0}
            onChange={(stars) => handleRate(act, stars)}
            size="sm"
            title="ចុចដើម្បីវាយតម្លៃអ្នករៀបចំ"
          />
          <small className="d-block text-muted mt-1 opacity-75">ចុចផ្កាយដើម្បីវាយតម្លៃ</small>
        </div>
      );
    }

    if (act.activity_status === "in_progress" || act.activity_status === "upcoming") {
      return (
        <small className="text-muted opacity-75" title="វាយតម្លៃបាននៅពេលឱកាសបញ្ចប់">
          មិនទាន់បញ្ចប់
        </small>
      );
    }

    if (act.activity_status === "pending") {
      return <small className="text-muted opacity-75">—</small>;
    }

    return (
      <StarRating
        value={0}
        readOnly
        size="sm"
        title="មិនអាចវាយតម្លៃ"
      />
    );
  };

  if (loading) {
    return (
      <div className="tab-pane fade show active" id="tabActivities">
        <div className="vh-section-card mb-3 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="tabActivities">
      <div className="vh-section-card mb-4">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary-subtle border-opacity-10">
          <div>
            <h6 className="mb-0 fw-bold fs-5">សកម្មភាពទាំងអស់ ({activities.length})</h6>
            <small className="opacity-75">All Activities and Ratings</small>
          </div>
        </div>

        <div className="vh-activity-list mt-3">
          {activities.length > 0 ? (
            activities.map((act) => {
              const isCompleted = act.activity_status === "completed";
              const hoursVal = isCompleted
                ? `${act.hours || act.planned_hours || 0}h`
                : act.planned_hours
                  ? `~${act.planned_hours}h`
                  : "—";
              return (
                <div key={act.id} className="vh-activity-row">
                  <div className="vh-row-main">
                    <div className={`vh-row-icon-wrap ${isCompleted ? "completed" : ""}`}>
                      {isCompleted ? (
                        <i className="bi bi-award-fill"></i>
                      ) : (
                        <i className="bi bi-clock-history"></i>
                      )}
                    </div>
                    <div className="vh-row-details">
                      <div className="fw-bold act-row-title text-truncate">{act.title}</div>
                      {act.organizer?.organization_name && (
                        <div className="act-row-org text-muted small text-truncate">
                          <i className="bi bi-building me-1"></i> {act.organizer.organization_name}
                        </div>
                      )}
                      <div className="act-row-meta mt-2 small d-flex flex-wrap gap-3">
                        <span>
                          <i className="bi bi-calendar3 me-1"></i>
                          {act.date
                            ? format(new Date(act.date), "dd MMMM yyyy", {
                                locale: km,
                              })
                            : "-"}
                        </span>
                        <span>
                          <i className="bi bi-geo-alt me-1"></i> {act.location}
                        </span>
                        <span>
                          <i className="bi bi-hourglass-split me-1"></i> {hoursVal}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="vh-row-actions">
                    <div className="status-wrap">
                      {getStatusBadge(act.activity_status)}
                    </div>
                    <div className="rating-wrap">
                      {ratingLoadingId === act.id ? (
                        <span
                          className="spinner-border spinner-border-sm text-warning"
                          role="status"
                        />
                      ) : (
                        renderRatingCell(act)
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-2 mb-2 d-block opacity-50"></i>
              មិនទាន់មានសកម្មភាពនៅឡើយ
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .vh-activity-row {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px !important;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .vh-activity-row:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 8px 20px var(--color-accent-glow);
          transform: translateY(-2px);
        }
        
        .vh-row-main {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-grow: 1;
          min-width: 0;
        }
        
        .vh-row-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background-color: rgba(13, 110, 253, 0.1) !important;
          color: #0d6efd !important;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .vh-row-icon-wrap.completed {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
        }
        .vh-activity-row:hover .vh-row-icon-wrap {
          transform: scale(1.08) rotate(5deg);
        }
        
        .act-row-title {
          color: var(--color-text-primary) !important;
          font-size: 16px;
          margin-bottom: 2px;
        }
        
        .act-row-org {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
        }
        
        .act-row-meta {
          color: var(--color-text-secondary) !important;
          font-size: 12.5px;
        }
        
        .vh-row-actions {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-shrink: 0;
        }
        
        .status-wrap {
          min-width: 100px;
          text-align: right;
        }
        
        .rating-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          min-width: 130px;
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
        .status-badge-danger {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-secondary {
          background-color: rgba(108, 117, 125, 0.12) !important;
          color: #6c757d !important;
          border: 1px solid rgba(108, 117, 125, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }

        @media (max-width: 768px) {
          .vh-activity-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .vh-row-actions {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid var(--color-border);
            padding-top: 14px;
            gap: 16px;
          }
          .status-wrap {
            text-align: left;
          }
          .rating-wrap {
            align-items: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
