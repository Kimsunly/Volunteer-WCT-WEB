"use client";

import React from "react";

export default function RegistrationsPane() {
  return (
    <div className="tab-pane fade show active" id="tabRegistrations">
      <div
        className="alert alert-info d-flex align-items-center mb-3"
        role="alert"
      >
        <i className="bi bi-shield-check me-2"></i>
        <div>
          អាចចូលមើលបានតែសម្រាប់អ្នកប្រើប្រាស់ដែលបានចូលគណនី។
          អ្នកអាចបោះបង់ឬពិនិត្យស្ថានភាពការចុះឈ្មោះនៅទីនេះ។
        </div>
      </div>

      <div className="row g-3">
        {/* Upcoming */}
        <div className="col-lg-6">
          <div className="vh-section-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h6 className="mb-0">កំពុងមកដល់ / Upcoming</h6>
                <small className="text-muted">អាចបោះបង់មុនថ្ងៃចាប់ផ្តើម</small>
              </div>
              <span className="badge bg-primary-subtle text-primary">2</span>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">ដាំដើមឈើ</div>
                    <div className="small">
                      Tree Planting • ១០ កុម្ភៈ ២០២៥ • កណ្ដាល
                    </div>
                    <div className="small text-muted">ស្ថានភាព៖ អនុម័ត</div>
                  </div>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      title="មើលលម្អិត"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-outline-danger" title="បោះបង់">
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">បណ្ណាល័យសហគមន៍</div>
                    <div className="small">
                      Community Library • ១៥ កុម្ភៈ ២០២៥ • ស្ទឹងមានជ័យ
                    </div>
                    <div className="small text-muted">
                      ស្ថានភាព៖ កំពុងរង់ចាំអនុម័ត
                    </div>
                  </div>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      title="មើលលម្អិត"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-outline-danger" title="បោះបង់">
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passed */}
        <div className="col-lg-6">
          <div className="vh-section-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h6 className="mb-0">បានបញ្ចប់ / Passed</h6>
                <small className="text-muted">ពិនិត្យប្រវត្តិ និងពិន្ទុ</small>
              </div>
              <span className="badge bg-success-subtle text-success">2</span>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">សម្អាតសហគមន៍</div>
                    <div className="small">
                      Community Cleanup • ២៣ មករា ២០២៥ • ស្វាយរៀង
                    </div>
                    <div className="small text-muted">
                      ស្ថានភាព៖ បានបញ្ចប់ • ម៉ោងសរុប ៤
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    title="វាយតម្លៃ"
                  >
                    <i className="bi bi-star"></i>
                  </button>
                </div>
              </div>

              <div className="vh-reco-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">បង្រៀនកុមារ</div>
                    <div className="small">
                      Teaching Children • ២០ មករា ២០២៥ • កំពង់ស្ពឺ
                    </div>
                    <div className="small text-muted">
                      ស្ថានភាព៖ បានបញ្ចប់ • ម៉ោងសរុប ៣
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    title="វាយតម្លៃ"
                  >
                    <i className="bi bi-star"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
``;
