"use client";

import React from "react";
import Image from "next/image";

export default function RecommendationsPane() {
  return (
    <div className="tab-pane fade show active" id="tabRecs">
      <div className="vh-section-card">
        <h6 className="mb-0">ការណែនាំដែលសមនឹងចំណង់ចំណូលចិត្តរបស់អ្នក</h6>
        <small>Opportunities Matched to Your Interests</small>

        <div className="row g-3 mt-3">
          {/* Card A */}
          <div className="col-lg-6">
            <div className="vh-op-card">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-start gap-3">
                  <Image
                    className="vh-org-logo"
                    src="/images/ORG/Tree-conservation.png"
                    alt="Org Logo"
                    width={56}
                    height={56}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h6 className="mb-0">ដាំដើមឈើ</h6>
                      <span className="badge rounded-pill vh-match">
                        95% match
                      </span>
                    </div>
                    <div>Tree Planting</div>
                  </div>
                </div>

                <div className="btn-group">
                  <button
                    className="btn btn-light btn-sm vh-icon-btn"
                    aria-label="Save"
                  >
                    <i className="bi bi-bookmark"></i>
                  </button>
                  <button
                    className="btn btn-light btn-sm vh-icon-btn"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-share"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-link-45deg me-2"></i>Copy link
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-facebook me-2"></i>Facebook
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-telegram me-2"></i>Telegram
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="small d-flex flex-wrap gap-3 mt-2">
                <span>
                  <i className="bi bi-calendar2 me-1"></i> ១០ កុម្ភៈ ២០២៥
                </span>
                <span>
                  <i className="bi bi-geo-alt me-1"></i> កណ្ដាល
                </span>
                <span>
                  <i className="bi bi-clock-history me-1"></i> 8h
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                <span className="vh-chip">Environment</span>
                <span className="vh-chip">Outdoor</span>
                <span className="vh-chip">Teamwork</span>
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Match score</span>
                  <span className="fw-semibold">95%</span>
                </div>
                <div className="progress vh-progress">
                  <div className="progress-bar" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <a
                  href="volunteer-apply.html"
                  className="btn btn-primary flex-grow-1"
                >
                  ចូលរួម / Apply
                </a>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="col-lg-6">
            <div className="vh-op-card">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-start gap-3">
                  <Image
                    className="vh-org-logo"
                    src="/images/ORG/company-icon.png"
                    alt="Org Logo"
                    width={56}
                    height={56}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h6 className="mb-0">បណ្ណាល័យសហគមន៍</h6>
                      <span className="badge rounded-pill vh-match">
                        88% match
                      </span>
                    </div>
                    <div>Community Library</div>
                  </div>
                </div>

                <div className="btn-group">
                  <button className="btn btn-light btn-sm vh-icon-btn">
                    <i className="bi bi-bookmark"></i>
                  </button>
                  <button
                    className="btn btn-light btn-sm vh-icon-btn"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-share"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-link-45deg me-2"></i>Copy link
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-facebook me-2"></i>Facebook
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <i className="bi bi-telegram me-2"></i>Telegram
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="small d-flex flex-wrap gap-3 mt-2">
                <span>
                  <i className="bi bi-calendar2 me-1"></i> ១៥ កុម្ភៈ ២០២៥
                </span>
                <span>
                  <i className="bi bi-geo-alt me-1"></i> ស្ទឹងមានជ័យ
                </span>
                <span>
                  <i className="bi bi-clock-history me-1"></i> 6h
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-2">
                <span className="vh-chip">Education</span>
                <span className="vh-chip">Reading</span>
                <span className="vh-chip">Children</span>
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Match score</span>
                  <span className="fw-semibold">88%</span>
                </div>
                <div className="progress vh-progress">
                  <div className="progress-bar" style={{ width: "88%" }}></div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <a
                  href="volunteer-apply.html"
                  className="btn btn-primary flex-grow-1"
                >
                  ចូលរួម / Apply
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
