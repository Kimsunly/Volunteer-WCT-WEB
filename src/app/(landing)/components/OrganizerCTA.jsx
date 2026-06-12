"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function OrganizerCTA() {
  const { user } = useAuth();

  const getStartedHref = user ? "/organizer" : "/auth/org/register";

  return (
    <section
      className="py-5 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2" data-aos="fade-left">
            <div className="position-relative">
              <div
                className="bg-primary bg-opacity-10 position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{ width: "120%", height: "120%", zIndex: 0 }}
              ></div>
              <img
                src="/images/homepage/cta-ipad.png"
                alt="Organizer Dashboard"
                className="img-fluid position-relative shadow-lg rounded-4"
                style={{ zIndex: 1 }}
              />
            </div>
          </div>

          <div className="col-lg-6 order-lg-1" data-aos="fade-right">
            <div className="pe-lg-5">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
                សម្រាប់អ្នករៀបចំកម្មវិធី
              </span>
              <h2 className="display-5 fw-bold mb-4">
                តើអ្នកមានកម្មវិធីស្ម័គ្រចិត្ត{" "}
                <span className="text-primary">ចង់ចែករំលែកមែនទេ?</span>
              </h2>
              <p className="lead text-muted mb-4">
                ចូលរួមជាមួយយើងក្នុងនាមជាអ្នករៀបចំ
                ដើម្បីផ្សព្វផ្សាយឱកាសស្ម័គ្រចិត្តរបស់អ្នកទៅកាន់យុវជនរាប់ពាន់នាក់
                និងគ្រប់គ្រងការចុះឈ្មោះដោយងាយស្រួល។
              </p>

              <div className="row g-4 mb-5">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-white shadow-sm rounded-circle p-2 me-3 text-primary">
                      <i className="bi bi-megaphone-fill fs-4"></i>
                    </div>
                    <span className="fw-semibold">ផ្សព្វផ្សាយបានទូលំទូលាយ</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-white shadow-sm rounded-circle p-2 me-3 text-primary">
                      <i className="bi bi-shield-check fs-4"></i>
                    </div>
                    <span className="fw-semibold">
                      ប្រព័ន្ធផ្ទៀងផ្ទាត់ច្បាស់លាស់
                    </span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-white shadow-sm rounded-circle p-2 me-3 text-primary">
                      <i className="bi bi-graph-up-arrow fs-4"></i>
                    </div>
                    <span className="fw-semibold">
                      គ្រប់គ្រងទិន្នន័យងាយស្រួល
                    </span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-white shadow-sm rounded-circle p-2 me-3 text-primary">
                      <i className="bi bi-people-fill fs-4"></i>
                    </div>
                    <span className="fw-semibold">ភ្ជាប់ទំនាក់ទំនងសហគមន៍</span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  href={getStartedHref}
                  className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm fw-bold"
                >
                  ចាប់ផ្តើមបង្កើតកម្មវិធី
                </Link>
                <Link
                  href="/about"
                  className="btn btn-outline-dark btn-lg px-5 rounded-pill fw-bold"
                >
                  ស្វែងយល់បន្ថែម
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
