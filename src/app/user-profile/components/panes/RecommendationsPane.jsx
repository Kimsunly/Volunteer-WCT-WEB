"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRecommendedActivities } from "@/services/user";
import { useAuth } from "@/context/AuthContext";

export default function RecommendationsPane() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedActivities();
      // Ensure we always have an array
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("មិនអាចទាញយកការណែនាំបានទេ។");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">កំពុងស្វែងរកឱកាសដែលស័ក្តិសមសម្រាប់អ្នក...</p>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="tabRecs">
      <div className="vh-section-card">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary-subtle border-opacity-10 pb-3">
          <div>
            <h5 className="fw-bold mb-1 card-title-theme">ការណែនាំដែលសមនឹងចំណង់ចំណូលចិត្តរបស់អ្នក</h5>
            <small className="text-secondary-theme">Opportunities Matched to Your Interests</small>
          </div>
          <button
            className="btn btn-sm btn-refresh rounded-pill px-3"
            onClick={fetchRecommendations}
            title="Refresh"
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {recommendations.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5 rounded-4 border border-dashed text-muted-box">
                <i className="bi bi-stars fs-1 text-accent-theme opacity-50 mb-3 d-block"></i>
                <h6 className="fw-bold text-primary-theme">មិនទាន់មានការណែនាំនៅឡើយទេ</h6>
                <p className="text-secondary-theme small">សូមព្យាយាមបំពេញព័ត៌មានជំនាញក្នុងប្រវត្តិរូបរបស់អ្នក ដើម្បីទទួលបានការណែនាំកាន់តែប្រសើរ</p>
              </div>
            </div>
          ) : (
            recommendations.map((opp) => (
              <div key={opp.id} className="col-lg-6">
                <div className="vh-op-card">
                  <div className="d-flex justify-content-between align-items-start h-100 flex-column">
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
                        <div className="d-flex align-items-start gap-3 min-width-0">
                          <Link href={`/opportunities/${opp.id}`} className="opp-img-link">
                            <div className="opp-img-frame" style={{ width: 56, height: 56, flexShrink: 0 }}>
                              <img
                                src={opp.image || "/images/placeholder.png"}
                                alt={opp.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          </Link>
                          <div className="min-width-0">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                              <Link href={`/opportunities/${opp.id}`} className="text-decoration-none text-reset">
                                <h6 className="fw-bold mb-0 text-truncate text-primary-theme opp-card-title hover-accent">{opp.title}</h6>
                              </Link>
                              <span className="badge badge-match px-2 py-1">
                                {opp.match_score}% match
                              </span>
                            </div>
                            <Link href={`/opportunities/${opp.id}`} className="text-decoration-none text-reset">
                              <div className="text-secondary-theme small text-truncate hover-accent">{opp.title_en}</div>
                            </Link>
                          </div>
                        </div>

                        <div className="btn-group btn-group-sm flex-shrink-0">
                          <button className="btn btn-action-circle me-1" title="Save">
                            <i className="bi bi-bookmark"></i>
                          </button>
                          <button className="btn btn-action-circle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-share"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1">
                            <li><button className="dropdown-item py-2 px-3 small rounded-2"><i className="bi bi-link-45deg me-2 text-accent-theme"></i>Copy link</button></li>
                            <li><button className="dropdown-item py-2 px-3 small rounded-2"><i className="bi bi-facebook me-2 text-primary"></i>Facebook</button></li>
                            <li><button className="dropdown-item py-2 px-3 small rounded-2"><i className="bi bi-telegram me-2 text-info"></i>Telegram</button></li>
                          </ul>
                        </div>
                      </div>

                      <div className="small d-flex flex-wrap gap-3 mt-3 text-secondary-theme opp-meta-links">
                        <span className="d-flex align-items-center">
                          <i className="bi bi-layers me-1 text-accent-theme"></i> {opp.category}
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-geo-alt me-1 text-accent-theme"></i> {opp.location}
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-calendar-event me-1 text-accent-theme"></i> {opp.date || "TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="w-100 mt-4 pt-2">
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-secondary-theme">Match score</span>
                        <span className="fw-bold text-accent-theme">{opp.match_score}%</span>
                      </div>
                      <div className="progress vh-progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{ width: `${opp.match_score}%` }}
                          aria-valuenow={opp.match_score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className="btn btn-join-details w-100 rounded-pill mt-4 fw-semibold py-2"
                      >
                        មើលលម្អិត / View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
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
          transition: all 0.3s ease;
        }
        .vh-section-card:hover {
          border-color: var(--color-border-hover) !important;
        }

        .card-title-theme {
          color: var(--color-text-primary) !important;
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

        .btn-refresh {
          border: 1.5px solid var(--color-accent) !important;
          color: var(--color-accent) !important;
          background-color: transparent !important;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-refresh:hover {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          box-shadow: 0 0 12px var(--color-accent-glow);
          transform: scale(1.02);
        }

        .text-muted-box {
          background-color: var(--color-bg-input) !important;
          border: 1px dashed var(--color-border) !important;
        }

        .vh-op-card {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          padding: 24px;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-op-card:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 8px 24px var(--color-accent-glow), var(--shadow-card) !important;
          transform: translateY(-4px);
        }

        .opp-img-frame {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }
        .vh-op-card:hover .opp-img-frame {
          transform: scale(1.04);
          border-color: var(--color-border-hover);
        }

        .opp-card-title {
          font-size: 16px;
          max-width: 170px;
        }
        @media (min-width: 1200px) {
          .opp-card-title {
            max-width: 200px;
          }
        }

        .badge-match {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
          font-weight: 700;
          font-size: 10.5px;
        }

        .btn-action-circle {
          width: 34px;
          height: 34px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border) !important;
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          transition: all 0.2s ease;
          padding: 0;
        }
        .btn-action-circle:hover {
          background-color: var(--color-bg-card-hover) !important;
          border-color: var(--color-border-hover) !important;
          transform: scale(1.08);
        }

        .dropdown-menu {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
        }
        .dropdown-item {
          color: var(--color-text-primary) !important;
          transition: all 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: var(--color-bg-card-hover) !important;
          color: var(--color-accent) !important;
        }

        .opp-meta-links span i {
          font-size: 14px;
        }

        .vh-op-card .vh-progress {
          height: 8px;
          background-color: var(--color-bg-card) !important;
          border-radius: 100px;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .vh-op-card .vh-progress .progress-bar {
          background: linear-gradient(90deg, #0d6efd, var(--color-accent)) !important;
          border-radius: 100px;
        }

        :global(.btn-join-details) {
          background: var(--color-accent) !important;
          color: #000000 !important;
          border: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        :global(.btn-join-details:hover) {
          box-shadow: 0 0 12px var(--color-accent-glow) !important;
          transform: scale(1.02);
          opacity: 0.95;
        }

        .hover-accent {
          transition: color 0.2s ease;
        }
        .hover-accent:hover {
          color: var(--color-accent) !important;
          cursor: pointer;
        }
        .opp-img-link {
          display: block;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
