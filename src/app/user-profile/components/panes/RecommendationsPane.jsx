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
      setRecommendations(data || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("មិនអាចទាញយកការណែនាំបានទេ។");
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">ការណែនាំដែលសមនឹងចំណង់ចំណូលចិត្តរបស់អ្នក</h5>
            <small className="text-muted">Opportunities Matched to Your Interests</small>
          </div>
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3"
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
              <div className="text-center py-5 bg-light rounded-4 border border-dashed">
                <i className="bi bi-stars fs-1 text-primary opacity-50 mb-3 d-block"></i>
                <h6>មិនទាន់មានការណែនាំនៅឡើយទេ</h6>
                <p className="text-muted small">សូមព្យាយាមបំពេញព័ត៌មានជំនាញក្នុងប្រវត្តិរូបរបស់អ្នក ដើម្បីទទួលបានការណែនាំកាន់តែប្រសើរ</p>
              </div>
            </div>
          ) : (
            recommendations.map((opp) => (
              <div key={opp.id} className="col-lg-6">
                <div className="vh-op-card h-100 p-4 shadow-sm border-0 rounded-4 bg-white transition-all hover-shadow">
                  <div className="d-flex justify-content-between align-items-start h-100 flex-column">
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-start gap-3">
                          <div className="rounded-4 overflow-hidden shadow-sm" style={{ width: 56, height: 56, flexShrink: 0 }}>
                            <img
                              src={opp.image || "/images/placeholder-opp.png"}
                              alt={opp.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                              <h6 className="fw-bold mb-0 text-dark">{opp.title}</h6>
                              <span className="badge rounded-pill vh-match px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                {opp.match_score}% match
                              </span>
                            </div>
                            <div className="text-muted small">{opp.title_en}</div>
                          </div>
                        </div>

                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-light rounded-circle border-0 me-1" title="Save">
                            <i className="bi bi-bookmark"></i>
                          </button>
                          <button className="btn btn-light rounded-circle border-0" data-bs-toggle="dropdown">
                            <i className="bi bi-share"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                            <li><button className="dropdown-item py-2 small"><i className="bi bi-link-45deg me-2"></i>Copy link</button></li>
                            <li><button className="dropdown-item py-2 small"><i className="bi bi-facebook me-2"></i>Facebook</button></li>
                            <li><button className="dropdown-item py-2 small"><i className="bi bi-telegram me-2"></i>Telegram</button></li>
                          </ul>
                        </div>
                      </div>

                      <div className="small d-flex flex-wrap gap-3 mt-3 text-muted">
                        <span className="d-flex align-items-center">
                          <i className="bi bi-layers me-1 text-primary"></i> {opp.category}
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-geo-alt me-1 text-primary"></i> {opp.location}
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-calendar-event me-1 text-primary"></i> {opp.date || "TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="w-100 mt-4">
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">Match score</span>
                        <span className="fw-bold text-primary">{opp.match_score}%</span>
                      </div>
                      <div className="progress vh-progress" style={{ height: 6 }}>
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
                        className="btn btn-primary w-100 rounded-pill mt-4 fw-medium py-2"
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
    </div>
  );
}
