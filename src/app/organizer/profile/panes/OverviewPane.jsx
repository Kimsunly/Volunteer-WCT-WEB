import React from "react";
import Image from "next/image";

export default function OverviewPane() {
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
                  <h3>12</h3>
                  <small className="text-success">+3 ថ្មីៗ</small>
                </div>
                <div className="icon-box bg-primary">
                  <i className="fa-regular fa-calendar-days"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>អ្នកស្ម័គ្រចិត្តសរុប</h6>
                  <h3>156</h3>
                  <small className="text-success">+24 ថ្មីៗ</small>
                </div>
                <div className="icon-box bg-success">
                  <i className="fa-solid fa-user-group"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>ព្រឹត្តិការណ៍ខែនេះ</h6>
                  <h3>8</h3>
                  <small className="text-success">+2 ថ្មីៗ</small>
                </div>
                <div
                  className="icon-box bg-purple"
                  style={{ background: "#a569bd" }}
                >
                  <i className="fa-regular fa-calendar"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <div className="card card-custom p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>ការវាយតម្លៃ</h6>
                  <h3>4.8</h3>
                  <small className="text-success">+0.2 ថ្មីៗ</small>
                </div>
                <div className="icon-box bg-warning">
                  <i className="fa-solid fa-star"></i>
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

              <div className="d-flex align-items-center mb-3">
                <Image
                  src="/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
                  className="rounded-circle me-2"
                  width={44}
                  height={44}
                  alt=""
                />
                <div>
                  <strong>សុភា ចាន់</strong>
                  <br />
                  <small>24 មករា 2025</small>
                </div>
                <span className="badge bg-warning text-dark ms-auto">
                  កំពុងរង់ចាំ
                </span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <Image
                  src="/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
                  className="rounded-circle me-2"
                  width={44}
                  height={44}
                  alt=""
                />
                <div>
                  <strong>ដារា លី</strong>
                  <br />
                  <small>24 មករា 2025</small>
                </div>
                <span className="badge bg-success ms-auto">អនុម័ត</span>
              </div>

              <div className="d-flex align-items-center">
                <Image
                  src="/images/ORG/computer-icons-user-profile-circle-abstract.jpg"
                  className="rounded-circle me-2"
                  width={44}
                  height={44}
                  alt=""
                />
                <div>
                  <strong>ពិសាក់ ស៊ុន</strong>
                  <br />
                  <small>23 មករា 2025</small>
                </div>
                <span className="badge bg-danger ms-auto">បានបដិសេធ</span>
              </div>

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
                <i className="fa-solid fa-user-group"></i> Manage Volunteers
              </a>
              <a href="#" className="quick-action bg-light-purple">
                <i className="fa-solid fa-chart-line"></i> View Reports
              </a>
              <a href="#" className="quick-action bg-light-orange">
                <i className="fa-solid fa-envelope"></i> Send Messages
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
``;
