
import React, { useState, useEffect } from "react";
import { getMyApplications, withdrawApplication } from "@/services/applications";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegistrationsPane() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleWithdraw = async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់បោះបង់ការចុះឈ្មោះនេះមែនទេ?")) return;

    setActionLoading(id);
    try {
      await withdrawApplication(id);
      await fetchApplications(); // Refresh list
      alert("បោះបង់ការចុះឈ្មោះដោយជោគជ័យ។");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      alert(err.response?.data?.detail || "មានបញ្ហាក្នុងការបោះបង់។");
    } finally {
      setActionLoading(null);
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
      <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
        <i className="bi bi-shield-check me-2"></i>
        <div>
          អ្នកអាចបោះបង់ឬពិនិត្យស្ថានភាពការចុះឈ្មោះរបស់លោកអ្នកនៅទីនេះ។
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {/* Upcoming */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold mb-0">កំពុងមកដល់ / Upcoming</h5>
                <small className="text-muted">ការចុះឈ្មោះដែលកំពុងរង់ចាំ ឬបានអនុម័ត</small>
              </div>
              <span className="badge bg-primary rounded-pill p-2 px-3">{upcoming.length}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {upcoming.length === 0 ? (
                <div className="text-center py-4 text-muted border border-dashed rounded-4">
                  <i className="bi bi-journal-x fs-2 mb-2 d-block"></i>
                  មិនមានការចុះឈ្មោះដែលកំពុងមកដល់ឡើយ
                </div>
              ) : (
                upcoming.map(app => (
                  <div key={app.id} className="p-3 border rounded-4 hover-shadow transition-all bg-white">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark mb-1">{app.opportunity_title || `ឱកាស #${app.opportunity_id}`}</div>
                        <div className="small text-muted mb-2">
                          <i className="bi bi-calendar-event me-2"></i>{formatDate(app.created_at)}
                        </div>
                        <div className={`small fw-medium ${getStatusLabel(app.status).className}`}>
                          ស្ថានភាព៖ {getStatusLabel(app.status).label}
                        </div>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <Link href={`/opportunities/${app.opportunity_id}`} className="btn btn-light border-0 rounded-start-pill" title="មើលលម្អិត">
                          <i className="bi bi-eye"></i>
                        </Link>
                        {["pending", "approved"].includes(app.status) && (
                          <button
                            className="btn btn-light border-0 text-danger rounded-end-pill"
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
          <div className="card border-0 shadow-sm h-100 p-4 rounded-4 bg-light bg-opacity-50">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold mb-0">ប្រវត្តិការចុះឈ្មោះ / History</h5>
                <small className="text-muted">ការចុះឈ្មោះដែលបានបដិសេធ ឬបោះបង់</small>
              </div>
              <span className="badge bg-secondary rounded-pill p-2 px-3">{passed.length}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {passed.length === 0 ? (
                <div className="text-center py-4 text-muted border border-dashed rounded-4">
                  <i className="bi bi-history fs-2 mb-2 d-block"></i>
                  មិនទាន់មានប្រវត្តិការចុះឈ្មោះឡើយ
                </div>
              ) : (
                passed.map(app => (
                  <div key={app.id} className="p-3 border rounded-4 bg-white opacity-75 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold text-dark mb-1">{app.opportunity_title || `ឱកាស #${app.opportunity_id}`}</div>
                        <div className="small text-muted mb-1">
                          <i className="bi bi-calendar-event me-2"></i>{formatDate(app.created_at)}
                        </div>
                        <div className={`small fw-medium ${getStatusLabel(app.status).className}`}>
                          {getStatusLabel(app.status).label}
                        </div>
                      </div>
                      <Link href={`/opportunities/${app.opportunity_id}`} className="btn btn-outline-secondary btn-sm rounded-circle">
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
    </div>
  );
}
``;
