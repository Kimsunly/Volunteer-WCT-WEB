import React from "react";
import Image from "next/image";

export default function OverviewPane({ stats, recentApps }) {
  // Default values if props are missing
  const { activeOpps = 0, totalVolunteers = 0, eventsThisMonth = 0, rating = 0 } = stats || {};
  const apps = recentApps || [];

  return (
    <div className="tab-pane fade show active" id="overview">
      <div className="container">
        {/* KPI Cards */}
        <div className="row g-3">
          <div className="col-md-3" data-aos="fade-up">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>ការងារសកម្ម</h6>
                  <h3>{activeOpps}</h3>
                  <small className="text-success">បច្ចុប្បន្ន</small>
                </div>
                <div className="icon-box bg-primary text-white d-flex align-items-center justify-content-center">
                  <i className="bi bi-briefcase fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>អ្នកស្ម័គ្រចិត្តសរុប</h6>
                  <h3>{totalVolunteers}</h3>
                  <small className="text-success">សរុប</small>
                </div>
                <div className="icon-box bg-success text-white d-flex align-items-center justify-content-center">
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>ព្រឹត្តិការណ៍ខែនេះ</h6>
                  <h3>{eventsThisMonth}</h3>
                  <small className="text-success">ខែនេះ</small>
                </div>
                <div
                  className="icon-box bg-purple text-white d-flex align-items-center justify-content-center"
                  style={{ background: "#a569bd" }}
                >
                  <i className="bi bi-calendar-event fs-4"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>ការវាយតម្លៃ</h6>
                  <h3>{rating}</h3>
                  <small className="text-warning">
                    <i className="bi bi-star-fill me-1"></i>
                  </small>
                </div>
                <div className="icon-box bg-warning text-white d-flex align-items-center justify-content-center">
                  <i className="bi bi-star-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent applications + quick actions */}
        <div className="row g-3 mt-3">
          <div className="col-md-6" data-aos="fade-right">
            <div className="card card-custom p-3">
              <h6 className="fw-bold mb-3">ពាក្យសុំថ្មីៗ</h6>

              {apps.length === 0 ? (
                <div className="text-muted text-center py-4">គ្មានពាក្យសុំថ្មីៗទេ</div>
              ) : (
                apps.map((app) => (
                  <div key={app.id} className="d-flex align-items-center mb-3">
                    <Image
                      src={app.avatar}
                      className="rounded-circle me-2 object-fit-cover"
                      width={44}
                      height={44}
                      alt=""
                    />
                    <div>
                      <strong>{app.nameKh}</strong>
                      <br />
                      <small>{app.dateKh}</small>
                    </div>
                    <span
                      className={`badge ms-auto ${app.status === 'approved' ? 'bg-success' :
                        app.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}
                    >
                      {app.status === 'pending' ? 'កំពុងរង់ចាំ' :
                        app.status === 'approved' ? 'អនុម័ត' : 'បានបដិសេធ'}
                    </span>
                  </div>
                ))
              )}

              <a href="#" className="d-block mt-2 text-primary small">
                មើលទាំងអស់
              </a>
            </div>
          </div>

          <div className="col-md-6" data-aos="fade-left">
            <div className="card card-custom p-3">
              <h6 className="fw-bold mb-3">Quick Actions</h6>
              <a href="#" className="quick-action bg-light-blue">
                Create New Opportunity
              </a>
              <a href="#" className="quick-action bg-light-green">
                <i className="bi bi-people-fill me-2"></i> Manage Volunteers
              </a>
              <a href="#" className="quick-action bg-light-purple">
                <i className="bi bi-graph-up me-2"></i> View Reports
              </a>
              <a href="#" className="quick-action bg-light-orange">
                <i className="bi bi-envelope-fill me-2"></i> Send Messages
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
``;
