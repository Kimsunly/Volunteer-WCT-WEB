"use client";
import React, { useEffect, useState } from "react";
import { getUserStats } from "@/services/user";

export default function AchievementsPane() {
  const [stats, setStats] = useState({
    total_hours: 0,
    completed_projects: 0,
    upcoming_events: 0,
    points: 0
  });

  useEffect(() => {
    getUserStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="tab-pane fade show active" id="tabAchievements">
      <div className="container-xxl my-3">
        <div className="row g-3">
          {/* Badge 1 */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.total_hours >= 100 ? "vh-badge-yellow" : ""}`}>
              <div className="d-flex align-items-start gap-3">
                <div className={`vh-badge-emblem ${stats.total_hours >= 100 ? "bg-warning-subtle text-warning" : "bg-light text-muted"}`}>
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកស្ម័គ្រចិត្តឆ្នើម</h6>
                  <div className="small">Outstanding Volunteer</div>
                  <p className="small mb-2 mt-2">
                    ចូលរួមក្នុងសកម្មភាពស្ម័គ្រចិត្តលើស ១០០ ម៉ោង
                  </p>
                  <div className={stats.total_hours >= 100 ? "text-success small" : "text-muted small"}>
                    {stats.total_hours >= 100 ? (
                      <><i className="bi bi-check2-circle me-1"></i> រួចរាល់រួចហើយ</>
                    ) : (
                      <>{stats.total_hours} / 100 ម៉ោង</>
                    )}
                  </div>
                  {stats.total_hours < 100 && (
                    <div className="progress vh-progress mt-2" style={{ height: 6 }}>
                      <div className="progress-bar bg-warning" style={{ width: `${Math.min((stats.total_hours / 100) * 100, 100)}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.completed_projects >= 10 ? "vh-badge-yellow" : ""}`}>
              <div className="d-flex align-items-start gap-3">
                <div className={`vh-badge-emblem ${stats.completed_projects >= 10 ? "bg-primary-subtle text-primary" : "bg-light text-muted"}`}>
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកជួយសហគមន៍</h6>
                  <div className="small">Community Helper</div>
                  <p className="small mb-2 mt-2">
                    ចូលរួមសកម្មភាពសហគមន៍យ៉ាងហោចណាស់ ១០ ការងារ
                  </p>
                  <div className={stats.completed_projects >= 10 ? "text-success small" : "text-muted small"}>
                    {stats.completed_projects >= 10 ? (
                      <><i className="bi bi-check2-circle me-1"></i> រួចរាល់រួចហើយ</>
                    ) : (
                      <>{stats.completed_projects} / 10 ការងារ</>
                    )}
                  </div>
                  {stats.completed_projects < 10 && (
                    <div className="progress vh-progress mt-2" style={{ height: 6 }}>
                      <div className="progress-bar bg-primary" style={{ width: `${Math.min((stats.completed_projects / 10) * 100, 100)}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Track */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.points >= 100 ? "vh-badge-yellow" : ""}`}>
              <div className="d-flex align-items-start gap-3">
                <div className={`vh-badge-emblem ${stats.points >= 100 ? "bg-success-subtle text-success" : "bg-light text-muted"}`}>
                  <i className="bi bi-bullseye"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">អ្នកការពារបរិស្ថាន</h6>
                  <div className="small">Environmental Guardian</div>
                  <p className="small mb-2 mt-2">
                    ទទួលបាន ១០០ ពិន្ទុពីការចូលរួម
                  </p>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>ការសម្រេចបាន</span>
                    <span className="fw-semibold">{Math.min(stats.points, 100)}%</span>
                  </div>
                  <div className="progress vh-progress mb-1">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${Math.min(stats.points, 100)}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>{stats.points}</span>
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
