"use client";

import React from "react";

export default function ActivitiesPane() {
  return (
    <div className="tab-pane fade show active" id="tabActivities">
      <div className="vh-section-card mb-3">
        <h6 className="mb-0">សកម្មភាពទាំងអស់</h6>

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
              <tr>
                <td>
                  <div className="fw-semibold">សម្អាតសហគមន៍</div>
                  <small className="d-block">Community Cleanup</small>
                  <small>ស្វាយរៀង</small>
                </td>
                <td>២៣ មករា ២០២៥</td>
                <td>4h</td>
                <td>
                  <span className="badge rounded-pill text-bg-success-subtle text-success px-3">
                    បានបញ្ចប់
                  </span>
                </td>
                <td
                  className="text-warning vh-stars"
                  aria-label="5 stars"
                  title="5/5"
                >
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </td>
              </tr>

              <tr>
                <td>
                  <div className="fw-semibold">បង្រៀនកុមារ</div>
                  <small className="d-block">Teaching Children</small>
                  <small>កំពង់ស្ពឺ</small>
                </td>
                <td>២០ មករា ២០២៥</td>
                <td>3h</td>
                <td>
                  <span className="badge rounded-pill text-bg-success-subtle text-success px-3">
                    បានបញ្ចប់
                  </span>
                </td>
                <td
                  className="text-warning vh-stars"
                  aria-label="4 stars"
                  title="4/5"
                >
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star"></i>
                </td>
              </tr>

              <tr>
                <td>
                  <div className="fw-semibold">កីឡាការណ៍</div>
                  <small className="d-block">Sports Event</small>
                  <small>តាកែវ</small>
                </td>
                <td>៥ កុម្ភៈ ២០២៥</td>
                <td>8h</td>
                <td>
                  <span className="badge rounded-pill text-bg-primary-subtle text-primary px-3">
                    កំពុងរៀបចំ
                  </span>
                </td>
                <td
                  className="text-warning vh-stars"
                  aria-label="4 stars"
                  title="4/5"
                >
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star"></i>
                  <i className="bi bi-star"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
``;
