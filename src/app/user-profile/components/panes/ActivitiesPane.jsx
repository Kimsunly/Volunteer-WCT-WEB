"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getUserActivities, rateApplication } from "@/services/user";
import { format } from "date-fns";
import { km } from "date-fns/locale";
import StarRating from "@/components/common/StarRating";
import { showToast } from "@/components/common/CustomToaster";

const STATUS_LABELS = {
  pending: { label: "រង់ចាំអនុម័ត", className: "text-bg-warning-subtle text-warning" },
  upcoming: { label: "បានអនុម័ត", className: "text-bg-info-subtle text-info" },
  in_progress: { label: "កំពុងដំណើរការ", className: "text-bg-primary-subtle text-primary" },
  completed: { label: "បានបញ្ចប់", className: "text-bg-success-subtle text-success" },
  rejected: { label: "បានបដិសេធ", className: "text-bg-danger-subtle text-danger" },
  withdrawn: { label: "បានបោះបង់", className: "text-bg-secondary-subtle text-secondary" },
};

function getStatusBadge(activityStatus) {
  const config = STATUS_LABELS[activityStatus] || {
    label: activityStatus,
    className: "text-bg-secondary-subtle text-secondary",
  };
  return (
    <span className={`badge rounded-pill px-3 ${config.className}`}>
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
        <StarRating
          value={act.rating}
          readOnly
          size="sm"
          title={`${act.rating}/5`}
        />
      );
    }

    if (act.can_rate) {
      return (
        <div>
          <StarRating
            value={0}
            onChange={(stars) => handleRate(act, stars)}
            size="sm"
            title="ចុចដើម្បីវាយតម្លៃអ្នករៀបចំ"
          />
          <small className="d-block text-muted mt-1">ចុចផ្កាយដើម្បីវាយតម្លៃ</small>
        </div>
      );
    }

    if (act.activity_status === "in_progress" || act.activity_status === "upcoming") {
      return (
        <small className="text-muted" title="វាយតម្លៃបាននៅពេលឱកាសបញ្ចប់">
          មិនទាន់បញ្ចប់
        </small>
      );
    }

    if (act.activity_status === "pending") {
      return <small className="text-muted">—</small>;
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
      <div className="vh-section-card mb-3">
        <h6 className="mb-0">សកម្មភាពទាំងអស់ ({activities.length})</h6>

        <div className="table-responsive mt-3">
          <table className="table vh-table align-middle">
            <thead>
              <tr>
                <th>សកម្មភាព / ACTIVITY</th>
                <th>កាលបរិច្ឆេទ / DATE</th>
                <th>ម៉ោង / HOURS</th>
                <th>ស្ថានភាព / STATUS</th>
                <th>ការវាយតម្លៃ / RATING</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <div
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "220px" }}
                      >
                        {act.title}
                      </div>
                      {act.organizer?.organization_name && (
                        <small className="d-block text-muted text-truncate" style={{ maxWidth: "220px" }}>
                          {act.organizer.organization_name}
                        </small>
                      )}
                      <small className="text-primary">{act.location}</small>
                    </td>
                    <td>
                      {act.date
                        ? format(new Date(act.date), "dd MMMM yyyy", {
                            locale: km,
                          })
                        : "-"}
                    </td>
                    <td>
                      {act.activity_status === "completed"
                        ? `${act.hours || act.planned_hours || 0}h`
                        : act.planned_hours
                          ? `~${act.planned_hours}h`
                          : "—"}
                    </td>
                    <td>{getStatusBadge(act.activity_status)}</td>
                    <td className="text-warning">
                      {ratingLoadingId === act.id ? (
                        <span
                          className="spinner-border spinner-border-sm text-warning"
                          role="status"
                        />
                      ) : (
                        renderRatingCell(act)
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    មិនទាន់មានសកម្មភាពនៅឡើយ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
