"use client";
import React from "react";

export default function AchievementsPane() {
  return (
    <div className="tab-pane fade show active" id="tabAchievements">
      <div className="container-xxl my-3">
        <div className="row g-3">
          {/* Badge 1 */}
          <div className="col-lg-4">
            <div className="vh-badge-tile vh-badge-yellow h-100">
              <div className="d-flex align-items-start gap-3">
                <div className="vh-badge-emblem bg-warning-subtle text-warning">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកស្ម័គ្រចិត្តឆ្នើម</h6>
                  <div className="small">Outstanding Volunteer</div>
                  <p className="small mb-2 mt-2">
                    ចូលរួមក្នុងសកម្មភាពស្ម័គ្រចិត្តលើស ១០០ ម៉ោង
                  </p>
                  <div className="text-success small">
                    <i className="bi bi-check2-circle me-1"></i> រួចរាល់រួចហើយ
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="col-lg-4">
            <div className="vh-badge-tile vh-badge-yellow h-100">
              <div className="d-flex align-items-start gap-3">
                <div className="vh-badge-emblem bg-primary-subtle text-primary">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកជួយសហគមន៍</h6>
                  <div className="small">Community Helper</div>
                  <p className="small mb-2 mt-2">
                    ចូលរួមសកម្មភាពសហគមន៍យ៉ាងហោចណាស់ ១០ ការងារ
                  </p>
                  <div className="text-success small">
                    <i className="bi bi-check2-circle me-1"></i> រួចរាល់រួចហើយ
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Track */}
          <div className="col-lg-4">
            <div className="vh-badge-tile h-100">
              <div className="d-flex align-items-start gap-3">
                <div className="vh-badge-emblem bg-success-subtle text-success">
                  <i className="bi bi-bullseye"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកការពារបរិស្ថាន</h6>
                  <div className="small">Environmental Guardian</div>
                  <p className="small mb-2 mt-2">
                    ចូលរួមសកម្មភាពបរិស្ថានជាយូរអង្វែង
                  </p>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>ការសម្រេចបាន</span>
                    <span className="fw-semibold">75%</span>
                  </div>
                  <div className="progress vh-progress mb-1">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
