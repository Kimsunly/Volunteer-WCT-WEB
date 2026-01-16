"use client";

import React, { useEffect, useState } from "react";
import { getUserActivities } from "@/services/user";
import { format } from "date-fns";
import { km } from "date-fns/locale";

export default function ActivitiesPane() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserActivities()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "completed" || s === "approved") {
      return <span className="badge rounded-pill text-bg-success-subtle text-success px-3">បានបញ្ចប់</span>;
    }
    if (s === "pending") {
      return <span className="badge rounded-pill text-bg-warning-subtle text-warning px-3">រង់ចាំ</span>;
    }
    if (s === "rejected") {
      return <span className="badge rounded-pill text-bg-danger-subtle text-danger px-3">បដិសេធ</span>;
    }
    return <span className="badge rounded-pill text-bg-secondary-subtle text-secondary px-3">{status}</span>;
  };

  const renderStars = (rating) => {
    const stars = [];
    const r = Math.min(Math.max(rating || 0, 0), 5); // clamp 0-5
    for (let i = 1; i <= 5; i++) {
      if (i <= r) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
      } else if (i - 0.5 <= r) {
        stars.push(<i key={i} className="bi bi-star-half"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star"></i>);
      }
    }
    return stars;
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
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>{act.title}</div>
                      <small className="d-block text-muted text-truncate" style={{ maxWidth: '200px' }}>{act.title_en}</small>
                      <small className="text-primary">{act.location}</small>
                    </td>
                    <td>
                      {act.date ? format(new Date(act.date), "dd MMMM yyyy", { locale: km }) : "-"}
                    </td>
                    <td>{act.hours}h</td>
                    <td>{getStatusBadge(act.status)}</td>
                    <td className="text-warning vh-stars" title={`${act.rating || 0}/5`}>
                      {renderStars(act.rating)}
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
``;
