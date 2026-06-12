"use client";

import DonationStats from "./DonationStats";
import Image from "next/image";

export default function DonationHero() {
  return (
    <section className="py-5" style={{ paddingTop: "120px", backgroundColor: "#f9fbf9" }}>
      <div className="container">
        <div className="row align-items-center g-5 mb-5">
          <div className="col-lg-6" data-aos="fade-right">
            <h1 className="display-4 fw-bold mb-4" style={{ color: "#1f2a37" }}>
              ចូលរួមបរិច្ចាគ
            </h1>
            <p className="lead mb-4" style={{ color: "#64748b", fontSize: "1.15rem", lineHeight: "1.7" }}>
              ការបរិច្ចាគរបស់អ្នកជួយផ្លាស់ប្តូរជីវិតមនុស្សរាប់ពាន់នាក់។
              រាល់ការគាំទ្រមានន័យយ៉ាងសំខាន់ក្នុងការបង្កើតអនាគតប្រសើរ។
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="#donation-form" className="btn btn-lg" style={{ 
                background: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)", 
                color: "white", 
                padding: "14px 32px", 
                borderRadius: "12px", 
                fontWeight: 700,
                border: "none"
              }}>
                <i className="bi bi-heart-fill me-2"></i>
                បរិច្ចាគឥឡូវ
              </a>
              <a href="#causes" className="btn btn-outline-secondary btn-lg" style={{ 
                padding: "14px 32px", 
                borderRadius: "12px", 
                fontWeight: 600,
                borderColor: "#cbd5e1",
                color: "#475569"
              }}>
                <i className="bi bi-info-circle me-2"></i>
                ស្វែងយល់បន្ថែម
              </a>
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <div className="position-relative">
              <Image
                src="/images/Donation/Khmer-Soviet.jpg"
                width={600}
                height={400}
                alt="Donation Hero"
                className="img-fluid"
                style={{ 
                  borderRadius: "24px", 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  maxHeight: "450px", 
                  objectFit: "cover" 
                }}
              />
              <div className="position-absolute" style={{ 
                bottom: "-20px", 
                left: "-20px", 
                width: "120px", 
                height: "120px", 
                background: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)", 
                borderRadius: "20px", 
                zIndex: -1 
              }}></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <DonationStats />
      </div>
    </section>
  );
}
