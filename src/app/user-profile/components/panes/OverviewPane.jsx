"use client";

import React from "react";

export default function OverviewPane() {
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
              <div className="fs-3 fw-bold">156</div>
              <div className="progress vh-progress mt-1">
                <div
                  className="progress-bar bg-primary"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <small className="d-block">156 / 200</small>
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
              <div className="fs-3 fw-bold">12</div>
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
              <div className="fs-3 fw-bold">3</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="vh-kpi">
            <div className="vh-kpi-icon bg-warning-subtle text-warning">
              <i className="bi bi-stars"></i>
            </div>
            <div className="flex-grow-1">
              <div className="small">ពិន្ទុវាយតម្លៃ</div>
              <div className="fs-3 fw-bold">1250</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Recommended */}
      <div className="container-xxl my-3">
        <div className="row g-3">
          {/* Recent Activities */}
          <div className="col-lg-6">
            <div className="vh-section-card">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h6 className="mb-0">សកម្មភាពថ្មីៗ</h6>
                  <small>Recent Activities</small>
                </div>
              </div>

              <ul className="list-unstyled m-0">
                <li className="vh-activity-item">
                  <div className="vh-activity-dot bg-success-subtle text-success">
                    <i className="bi bi-check2"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">សម្អាតសហគមន៍</div>
                    <div className="small">
                      Community Cleanup • ២៣ មករា ២០២៥ • ឧត្តរមានជ័យ • 4h
                    </div>
                  </div>
                  <span className="badge rounded-pill text-bg-success-subtle text-success">
                    បានបញ្ចប់
                  </span>
                </li>

                <li className="vh-activity-item">
                  <div className="vh-activity-dot bg-success-subtle text-success">
                    <i className="bi bi-check2"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">បង្រៀនកុមារ</div>
                    <div className="small">
                      Teaching Children • ២០ មករា ២០២៥ • កំពង់ស្ពឺ • 3h
                    </div>
                  </div>
                  <span className="badge rounded-pill text-bg-success-subtle text-success">
                    បានបញ្ចប់
                  </span>
                </li>

                <li className="vh-activity-item">
                  <div className="vh-activity-dot bg-primary-subtle text-primary">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">កីឡាការណ៍</div>
                    <div className="small">
                      Sports Event • ៥ កុម្ភៈ ២០២៥ • តាកែវ • 8h
                    </div>
                  </div>
                  <span className="badge rounded-pill text-bg-primary-subtle text-primary">
                    កំពុងរៀបចំ
                  </span>
                </li>
              </ul>

              <a href="#" className="small mt-2 d-inline-block">
                មើលទាំងអស់ / View All
              </a>
            </div>
          </div>

          {/* Recommended for You (short list) */}
          <div className="col-lg-6">
            <div className="vh-section-card">
              <div className="mb-2">
                <h6 className="mb-0">ការណែនាំសម្រាប់អ្នក</h6>
                <small>Recommended for You</small>
              </div>

              {/* Card 1 */}
              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">ដាំដើមឈើ</div>
                    <div>Tree Planting</div>
                    <div className="small mt-1 d-flex flex-wrap gap-3">
                      <span>
                        <i className="bi bi-calendar2 me-1"></i>១០ កុម្ភៈ ២០២៥
                      </span>
                      <span>
                        <i className="bi bi-geo-alt me-1"></i> កណ្ដាល
                      </span>
                      <span>
                        <i className="bi bi-people me-1"></i>{" "}
                        អ្នកស្ម័គ្រចិត្តថ្មី
                      </span>
                    </div>
                    <div className="small mt-2">សកម្មភាពបរិស្ថាន</div>
                  </div>
                  <span className="badge rounded-pill text-bg-success-subtle text-success">
                    95% match
                  </span>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <a
                    href="volunteer-apply.html"
                    className="btn btn-primary btn-sm"
                  >
                    ចូលរួម
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">បណ្ណាល័យសហគមន៍</div>
                    <div>Community Library</div>
                    <div className="small mt-1 d-flex flex-wrap gap-3">
                      <span>
                        <i className="bi bi-calendar2 me-1"></i>១៥ កុម្ភៈ ២០២៥
                      </span>
                      <span>
                        <i className="bi bi-geo-alt me-1"></i> ស្ទឹងមានជ័យ
                      </span>
                      <span>
                        <i className="bi bi-people me-1"></i> មធ្យម
                      </span>
                    </div>
                    <div className="small mt-2">បង្រៀន/អានសៀវភៅ</div>
                  </div>
                  <span className="badge rounded-pill text-bg-success-subtle text-success">
                    88% match
                  </span>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <a
                    href="volunteer-apply.html"
                    className="btn btn-primary btn-sm"
                  >
                    ចូលរួម
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
