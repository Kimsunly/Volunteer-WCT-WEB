
import React, { useState, useEffect } from "react";
import { getMyApplications, withdrawApplication } from "@/services/applications";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { showToast } from "@/components/common/CustomToaster";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function RegistrationsPane() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Confirmation modal state
  const [withdrawConfirmOpen, setWithdrawConfirmOpen] = useState(false);
  const [withdrawingAppId, setWithdrawingAppId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getMyApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("មិនអាចទាញយកទិន្នន័យបានទេ។");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const handleWithdraw = (id) => {
    setWithdrawingAppId(id);
    setWithdrawConfirmOpen(true);
  };

  const confirmWithdraw = async () => {
    setActionLoading(withdrawingAppId);
    try {
      await withdrawApplication(withdrawingAppId);
      await fetchApplications(); // Refresh list
      showToast.success("បានបោះបង់ការចុះឈ្មោះដោយជោគជ័យ។", "ជោគជ័យ");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      showToast.error(err.response?.data?.detail || "មានបញ្ហាក្នុងការបោះបង់។", "កំហុស");
    } finally {
      setActionLoading(null);
      setWithdrawConfirmOpen(false);
      setWithdrawingAppId(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return { label: "កំពុងរង់ចាំអនុម័ត", className: "text-warning" };
      case "approved": return { label: "អនុម័ត", className: "text-success" };
      case "rejected": return { label: "មិនបានអនុម័ត", className: "text-danger" };
      case "withdrawn": return { label: "បានបោះបង់", className: "text-muted" };
      default: return { label: status, className: "" };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    try {
      return new Date(dateStr).toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Grouping (For now, let's just group by status as a proxy for upcoming/passed if date is missing)
  const upcoming = applications.filter(app => ["pending", "approved"].includes(app.status));
  const passed = applications.filter(app => ["rejected", "withdrawn"].includes(app.status));

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">កំពុងទាញយក...</p>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="tabRegistrations">
      {/* Top Banner Notice */}
      <div className="alert vh-notice-banner d-flex align-items-center mb-4" role="alert">
        <div className="notice-icon-wrap me-3">
          <i className="bi bi-shield-check"></i>
        </div>
        <div>
          <div className="fw-semibold text-primary-theme">ពិនិត្យស្ថានភាពការចុះឈ្មោះ / Manage Registrations</div>
          <div className="small text-secondary-theme">
            អ្នកអាចបោះបង់ឬពិនិត្យស្ថានភាពការចុះឈ្មោះរបស់លោកអ្នកនៅទីនេះ។
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {/* Upcoming */}
        <div className="col-lg-6">
          <div className="vh-reg-column upcoming-column">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold mb-1 title-theme">កំពុងមកដល់ / Upcoming</h5>
                <small className="text-secondary-theme">ការចុះឈ្មោះដែលកំពុងរង់ចាំ ឬបានអនុម័ត</small>
              </div>
              <span className="badge counter-badge bg-primary-theme">{upcoming.length}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {upcoming.length === 0 ? (
                <div className="text-center py-5 text-muted border border-dashed rounded-4 opacity-75">
                  <i className="bi bi-journal-x fs-2 mb-2 d-block"></i>
                  មិនមានការចុះឈ្មោះដែលកំពុងមកដល់ឡើយ
                </div>
              ) : (
                upcoming.map(app => (
                  <div key={app.id} className="vh-reg-card">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1 min-width-0">
                        <div className="fw-bold act-title text-truncate mb-1">{app.opportunity_title || `ឱកាស #${app.opportunity_id}`}</div>
                        <div className="small text-secondary-theme mb-3">
                          <i className="bi bi-calendar-event me-2 text-accent-theme"></i>{formatDate(app.created_at)}
                        </div>
                        <div className="mt-2">
                          <span className={`badge ${getStatusLabel(app.status).className}`}>
                            {getStatusLabel(app.status).label}
                          </span>
                        </div>
                      </div>
                      <div className="btn-group-actions">
                        <Link href={`/opportunities/${app.opportunity_id}`} className="btn btn-action btn-view" title="មើលលម្អិត">
                          <i className="bi bi-eye"></i>
                        </Link>
                        {["pending", "approved"].includes(app.status) && (
                          <button
                            className="btn btn-action btn-cancel"
                            title="បោះបង់"
                            onClick={() => handleWithdraw(app.id)}
                            disabled={actionLoading === app.id}
                          >
                            {actionLoading === app.id ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-x-circle"></i>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Passed / History */}
        <div className="col-lg-6">
          <div className="vh-reg-column history-column">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold mb-1 title-theme">ប្រវត្តិការចុះឈ្មោះ / History</h5>
                <small className="text-secondary-theme">ការចុះឈ្មោះដែលបានបដិសេធ ឬបោះបង់</small>
              </div>
              <span className="badge counter-badge bg-secondary-theme">{passed.length}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {passed.length === 0 ? (
                <div className="text-center py-5 text-muted border border-dashed rounded-4 opacity-75">
                  <i className="bi bi-history fs-2 mb-2 d-block"></i>
                  មិនទាន់មានប្រវត្តិការចុះឈ្មោះឡើយ
                </div>
              ) : (
                passed.map(app => (
                  <div key={app.id} className="vh-reg-card history-card">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1 min-width-0">
                        <div className="fw-bold act-title text-truncate mb-1">{app.opportunity_title || `ឱកាស #${app.opportunity_id}`}</div>
                        <div className="small text-secondary-theme mb-3">
                          <i className="bi bi-calendar-event me-2"></i>{formatDate(app.created_at)}
                        </div>
                        <div>
                          <span className={`badge ${getStatusLabel(app.status).className}`}>
                            {getStatusLabel(app.status).label}
                          </span>
                        </div>
                      </div>
                      <Link href={`/opportunities/${app.opportunity_id}`} className="btn btn-action btn-view-history" title="មើលលម្អិត">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={withdrawConfirmOpen}
        onClose={() => {
          setWithdrawConfirmOpen(false);
          setWithdrawingAppId(null);
        }}
        onConfirm={confirmWithdraw}
        title="បោះបង់ការចុះឈ្មោះ"
        message="តើអ្នកពិតជាចង់បោះបង់ការចុះឈ្មោះសម្រាប់ឱកាសនេះមែនទេ?"
        confirmText="បោះបង់ការចុះឈ្មោះ"
        cancelText="បោះបង់"
        type="danger"
      />

      <style jsx>{`
        .vh-notice-banner {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          border-left: 4px solid var(--color-accent) !important;
          border-radius: 16px !important;
          padding: 20px !important;
          box-shadow: var(--shadow-card) !important;
        }
        
        .notice-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          flex-shrink: 0;
        }

        .vh-reg-column {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 28px !important;
          height: 100%;
          transition: all 0.3s ease;
        }
        .vh-reg-column:hover {
          border-color: var(--color-border-hover) !important;
        }

        .title-theme {
          color: var(--color-text-primary) !important;
        }

        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }

        .counter-badge {
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 100px;
        }
        .bg-primary-theme {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
        }
        .bg-secondary-theme {
          background-color: var(--color-bg-input) !important;
          color: var(--color-text-secondary) !important;
          border: 1px solid var(--color-border) !important;
        }

        .vh-reg-card {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 16px !important;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-reg-card:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 8px 20px var(--color-accent-glow);
          transform: translateY(-2px);
        }
        .history-card {
          opacity: 0.85;
        }
        .history-card:hover {
          opacity: 1;
          border-color: var(--color-border-hover) !important;
          box-shadow: var(--shadow-card);
          transform: translateY(-2px);
        }

        .act-title {
          color: var(--color-text-primary) !important;
          font-size: 15.5px;
        }
        .text-accent-theme {
          color: var(--color-accent) !important;
        }

        .btn-group-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-action {
          width: 38px;
          height: 38px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border) !important;
          background-color: var(--color-bg-card) !important;
          color: var(--color-text-primary) !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }
        
        .btn-view:hover {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
          transform: scale(1.08);
        }
        
        .btn-cancel:hover {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border-color: rgba(220, 53, 69, 0.3) !important;
          transform: scale(1.08);
        }

        .btn-view-history:hover {
          background-color: var(--color-bg-card-hover) !important;
          border-color: var(--color-border-hover) !important;
          transform: translateX(3px);
        }

        /* Status Badges */
        .status-badge-success {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-warning {
          background-color: rgba(255, 193, 7, 0.12) !important;
          color: #ffc107 !important;
          border: 1px solid rgba(255, 193, 7, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-danger {
          background-color: rgba(220, 53, 69, 0.12) !important;
          color: #dc3545 !important;
          border: 1px solid rgba(220, 53, 69, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
        .status-badge-secondary {
          background-color: rgba(108, 117, 125, 0.12) !important;
          color: #6c757d !important;
          border: 1px solid rgba(108, 117, 125, 0.25) !important;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 14px;
        }
      `}</style>
    </div>
  );
}
``;
