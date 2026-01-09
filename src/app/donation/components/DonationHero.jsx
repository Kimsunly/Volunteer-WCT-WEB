"use client";

import DonationStats from "./DonationStats";
import Image from "next/image";

export default function DonationHero() {
  return (
    <section
      className="donation-hero bg-light py-5"
      style={{ paddingTop: "100px" }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right">
            <h1
              className="display-4 fw-bold mb-4"
              style={{ paddingTop: "100px" }}
            >
              ចូលរួមបរិច្ចាគ
            </h1>
            <p className="lead mb-4">
              ការបរិច្ចាគរបស់អ្នកជួយផ្លាស់ប្តូរជីវិតមនុស្សរាប់ពាន់នាក់។
              រាល់ការគាំទ្រមានន័យយ៉ាងសំខាន់ក្នុងការបង្កើតអនាគតប្រសើរ។
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="#donation-form" className="btn btn-primary btn-lg">
                <i className="bi bi-heart-fill me-2"></i>
                បរិច្ចាគឥឡូវ
              </a>
              <a href="#causes" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-info-circle me-2"></i>
                ស្វែងយល់បន្ថែម
              </a>
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <Image
              src="/images/Donation/Khmer-Soviet.jpg"
              width={600}
              height={400}
              alt="Donation Hero"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <DonationStats />
      </div>
    </section>
  );
}
