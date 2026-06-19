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
    getUserStats()
      .then(data => {
        if (data) {
          setStats({
            total_hours: Number(data.total_hours || 0),
            completed_projects: Number(data.completed_projects || 0),
            upcoming_events: Number(data.upcoming_events || 0),
            points: Number(data.points || 0)
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="tab-pane fade show active" id="tabAchievements">
      <div className="container-fluid px-0 my-3 pb-5">
        <div className="row g-4">
          {/* Badge 1: Outstanding Volunteer */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.total_hours >= 100 ? "unlocked" : "locked"}`}>
              <div className="badge-inner">
                <div className={`vh-badge-emblem ${stats.total_hours >= 100 ? "bg-gold" : "bg-locked"}`}>
                  {stats.total_hours >= 100 ? (
                    <i className="bi bi-award-fill"></i>
                  ) : (
                    <i className="bi bi-lock-fill"></i>
                  )}
                </div>
                <div className="flex-grow-1 min-width-0">
                  <h6 className="mb-1 fw-bold badge-title">អ្នកស្ម័គ្រចិត្តឆ្នើម</h6>
                  <div className="badge-subtitle small">Outstanding Volunteer</div>
                  <p className="small badge-desc mb-3 mt-2">
                    ចូលរួមក្នុងសកម្មភាពស្ម័គ្រចិត្តលើស ១០០ ម៉ោង
                  </p>
                  
                  <div className="progress-section">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">វឌ្ឍនភាព / Progress</span>
                      <span className={`small fw-semibold ${stats.total_hours >= 100 ? "text-accent-theme" : "text-secondary-theme"}`}>
                        {stats.total_hours >= 100 ? (
                          <><i className="bi bi-check2-circle me-1"></i> សម្រេចបាន</>
                        ) : (
                          <>{stats.total_hours} / 100 ម៉ោង</>
                        )}
                      </span>
                    </div>
                    <div className="progress vh-progress" style={{ height: 8 }}>
                      <div 
                        className="progress-bar progress-bar-gold" 
                        style={{ width: `${Math.min((stats.total_hours / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge 2: Community Helper */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.completed_projects >= 10 ? "unlocked" : "locked"}`}>
              <div className="badge-inner">
                <div className={`vh-badge-emblem ${stats.completed_projects >= 10 ? "bg-blue" : "bg-locked"}`}>
                  {stats.completed_projects >= 10 ? (
                    <i className="bi bi-people-fill"></i>
                  ) : (
                    <i className="bi bi-lock-fill"></i>
                  )}
                </div>
                <div className="flex-grow-1 min-width-0">
                  <h6 className="mb-1 fw-bold badge-title">អ្នកជួយសហគមន៍</h6>
                  <div className="badge-subtitle small">Community Helper</div>
                  <p className="small badge-desc mb-3 mt-2">
                    ចូលរួមសកម្មភាពសហគមន៍យ៉ាងហោចណាស់ ១០ ការងារ
                  </p>

                  <div className="progress-section">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">វឌ្ឍនភាព / Progress</span>
                      <span className={`small fw-semibold ${stats.completed_projects >= 10 ? "text-accent-theme" : "text-secondary-theme"}`}>
                        {stats.completed_projects >= 10 ? (
                          <><i className="bi bi-check2-circle me-1"></i> សម្រេចបាន</>
                        ) : (
                          <>{stats.completed_projects} / 10 ការងារ</>
                        )}
                      </span>
                    </div>
                    <div className="progress vh-progress" style={{ height: 8 }}>
                      <div 
                        className="progress-bar progress-bar-blue" 
                        style={{ width: `${Math.min((stats.completed_projects / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge 3: Environmental Guardian */}
          <div className="col-lg-4">
            <div className={`vh-badge-tile h-100 ${stats.points >= 100 ? "unlocked" : "locked"}`}>
              <div className="badge-inner">
                <div className={`vh-badge-emblem ${stats.points >= 100 ? "bg-green" : "bg-locked"}`}>
                  {stats.points >= 100 ? (
                    <i className="bi bi-bullseye"></i>
                  ) : (
                    <i className="bi bi-lock-fill"></i>
                  )}
                </div>
                <div className="flex-grow-1 min-width-0">
                  <h6 className="mb-1 fw-bold badge-title">អ្នកការពារបរិស្ថាន</h6>
                  <div className="badge-subtitle small">Environmental Guardian</div>
                  <p className="small badge-desc mb-3 mt-2">
                    ទទួលបាន ១០០ ពិន្ទុពីការចូលរួម
                  </p>

                  <div className="progress-section">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">ការសម្រេចបាន / Achievement</span>
                      <span className={`small fw-semibold ${stats.points >= 100 ? "text-accent-theme" : "text-secondary-theme"}`}>
                        {Math.min(stats.points, 100)}%
                      </span>
                    </div>
                    <div className="progress vh-progress mb-2" style={{ height: 8 }}>
                      <div
                        className="progress-bar progress-bar-green"
                        role="progressbar"
                        style={{ width: `${Math.min(stats.points, 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted text-secondary-theme">
                      <span>{stats.points} pts</span>
                      <span>100 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tiers Guide & Points History Log */}
        <div className="row g-4 mt-4 mb-5">
          {/* Volunteer Tiers Guide */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="border-bottom border-secondary-subtle border-opacity-10 pb-3 mb-4">
                <h5 className="fw-bold mb-1 card-title-theme">កម្រិតចំណាត់ថ្នាក់អ្នកស្ម័គ្រចិត្ត</h5>
                <p className="text-secondary-theme small mb-0">Volunteer Tiers & Level Guide</p>
              </div>

              <div className="d-flex flex-column gap-3">
                {[
                  { id: "bronze", name: "អ្នកស្ម័គ្រចិត្តសំរិទ្ធ", nameEn: "Bronze Volunteer", req: "ចាប់ផ្តើមដំបូង (> 0 ម៉ោង)", icon: "bi-shield", color: "#cd7f32" },
                  { id: "silver", name: "អ្នកស្ម័គ្រចិត្តប្រាក់", nameEn: "Silver Volunteer", req: "ចូលរួមលើស ១០ ម៉ោង", icon: "bi-shield-fill", color: "#a0a0a0" },
                  { id: "gold", name: "អ្នកស្ម័គ្រចិត្តមាស", nameEn: "Gold Volunteer", req: "ចូលរួមលើស ៥០ ម៉ោង", icon: "bi-award-fill", color: "#ffc107" },
                  { id: "platinum", name: "អ្នកស្ម័គ្រចិត្តផ្លាទីន", nameEn: "Platinum Volunteer", req: "ចូលរួមលើស ១០០ ម៉ោង", icon: "bi-gem", color: "#0dcaf0" },
                ].map((tier, index) => {
                  const currentHours = stats.total_hours;
                  const activeIndex = currentHours >= 100 ? 3 : currentHours >= 50 ? 2 : currentHours >= 10 ? 1 : 0;
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={tier.id}
                      className={`d-flex align-items-center justify-content-between p-3 rounded-4 vh-tier-item ${isActive ? "active" : ""}`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="tier-icon-wrap"
                          style={{ color: tier.color, backgroundColor: isActive ? "var(--color-accent-dim)" : "var(--color-bg-card)" }}
                        >
                          <i className={`bi ${tier.icon}`}></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold tier-title">{tier.name}</h6>
                          <span className="small text-secondary-theme">{tier.nameEn}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${isActive ? "status-badge-active" : "status-badge-locked"}`}>
                          {isActive ? "កម្រិតបច្ចុប្បន្ន" : tier.req}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Points History Log */}
          <div className="col-lg-6">
            <div className="vh-section-card h-100">
              <div className="border-bottom border-secondary-subtle border-opacity-10 pb-3 mb-4">
                <h5 className="fw-bold mb-1 card-title-theme">ប្រវត្តិនៃការទទួលបានពិន្ទុ</h5>
                <p className="text-secondary-theme small mb-0">Recent Points & Achievements Log</p>
              </div>

              <div className="d-flex flex-column gap-3 vh-points-list">
                {[
                  { id: 1, points: 20, desc: "ចូលរួមយុទ្ធនាការសំអាតឆ្នេរ (Beach Cleaning Campaign)", date: "២០ មិថុនា ២០២៦" },
                  { id: 2, points: 15, desc: "ចូលរួមបង្រៀនភាសាអង់គ្លេសកុមារ (English Teaching)", date: "១៥ មិថុនា ២០២៦" },
                  { id: 3, points: 10, desc: "ចុះឈ្មោះគណនីដំបូង (Initial Registration)", date: "១០ មិថុនា ២០២៦" },
                ].map((log) => (
                  <div key={log.id} className="d-flex align-items-start gap-3 p-3 rounded-4 vh-log-item">
                    <div className="points-bubble flex-shrink-0">
                      +{log.points}
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <p className="mb-1 fw-semibold text-primary-theme log-desc">{log.desc}</p>
                      <span className="small text-secondary-theme d-block">
                        <i className="bi bi-clock me-1 text-accent-theme"></i> {log.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vh-section-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 28px !important;
          transition: all 0.3s ease;
        }
        .vh-section-card:hover {
          border-color: var(--color-border-hover) !important;
        }

        .card-title-theme {
          color: var(--color-text-primary) !important;
        }

        .vh-badge-tile {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .vh-badge-tile.locked {
          opacity: 0.75;
        }
        
        .vh-badge-tile.unlocked {
          border-color: var(--color-accent) !important;
          box-shadow: 0 12px 28px var(--color-accent-glow), var(--shadow-card) !important;
        }
        
        .vh-badge-tile:hover {
          transform: translateY(-6px);
        }
        .vh-badge-tile.locked:hover {
          border-color: var(--color-border-hover) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
          opacity: 0.95;
        }
        .vh-badge-tile.unlocked:hover {
          box-shadow: 0 16px 36px var(--color-accent-glow), var(--shadow-card) !important;
        }

        .badge-inner {
          display: flex;
          align-items: start;
          gap: 18px;
        }

        .vh-badge-emblem {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .vh-badge-tile:hover .vh-badge-emblem {
          transform: scale(1.1) rotate(6deg);
        }
        
        .bg-gold {
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 0 16px rgba(255, 193, 7, 0.45) !important;
        }
        
        .bg-blue {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 0 16px rgba(13, 110, 253, 0.45) !important;
        }
        
        .bg-green {
          background: linear-gradient(135deg, var(--color-accent) 0%, #198754 100%) !important;
          color: #000000 !important;
          box-shadow: 0 0 16px var(--color-accent-glow) !important;
        }

        .bg-locked {
          background-color: var(--color-bg-input) !important;
          color: var(--color-text-muted) !important;
          border: 1px solid var(--color-border);
        }

        .badge-title {
          color: var(--color-text-primary) !important;
          font-size: 16px;
        }
        .badge-subtitle {
          color: var(--color-text-secondary) !important;
          font-size: 12.5px;
        }
        .badge-desc {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          line-height: 1.4;
        }

        .text-accent-theme {
          color: var(--color-accent) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }
        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-accent-theme {
          color: var(--color-accent) !important;
        }

        /* Progress styles */
        .progress-section {
          margin-top: 14px;
        }
        
        .vh-badge-tile .vh-progress {
          background-color: var(--color-bg-input) !important;
          border-radius: 100px;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        
        .progress-bar-gold {
          background: linear-gradient(90deg, #ffc107, #ff9800) !important;
          border-radius: 100px;
        }
        .progress-bar-blue {
          background: linear-gradient(90deg, #0d6efd, #06b6d4) !important;
          border-radius: 100px;
        }
        .progress-bar-green {
          background: linear-gradient(90deg, var(--color-accent), #198754) !important;
          border-radius: 100px;
        }

        /* Tiers list and item styles */
        .vh-tier-item {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-tier-item.active {
          border-color: var(--color-accent) !important;
          box-shadow: 0 4px 15px var(--color-accent-glow);
          background-color: var(--color-bg-card) !important;
        }
        .vh-tier-item:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateX(4px);
        }
        .vh-tier-item.active:hover {
          border-color: var(--color-accent) !important;
        }

        .tier-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .vh-tier-item:hover .tier-icon-wrap {
          transform: scale(1.08) rotate(5deg);
        }

        .tier-title {
          color: var(--color-text-primary) !important;
          font-size: 14.5px;
        }

        .status-badge-active {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
          font-weight: 700;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 100px;
        }
        .status-badge-locked {
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-secondary) !important;
          border: 1px solid var(--color-border) !important;
          font-weight: 500;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 100px;
        }

        /* Points history list styles */
        .vh-log-item {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          transition: all 0.3s ease;
        }
        .vh-log-item:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-card) !important;
        }

        .points-bubble {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14.5px;
          box-shadow: 0 2px 8px var(--color-accent-glow);
        }
        .log-desc {
          font-size: 14px;
        }

        @media (max-width: 576px) {
          .vh-tier-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .vh-tier-item .text-end {
            text-align: left !important;
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .badge-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
