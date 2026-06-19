"use client";

import Link from "next/link";

export default function VolunteerSpotlight() {
  return (
    <section className="volunteer-spotlight-section py-5 position-relative">
      <div className="spotlight-bg-glow" />
      <div className="container">
        <div className="spotlight-card">
          <div className="row g-0 align-items-center">
            {/* Left Image column */}
            <div className="col-12 col-lg-5 position-relative">
              <div className="spotlight-img-wrap p-4 p-lg-5 text-center">
                <div className="spotlight-ring-deco" />
                <img
                  src="/images/profile.png"
                  alt="Volunteer Spotlight"
                  className="spotlight-avatar img-fluid"
                />
                <div className="spotlight-badge-overlay">
                  <i className="bi bi-award-fill me-1 text-warning"></i>
                  អ្នកស្ម័គ្រចិត្តលេចធ្លោប្រចាំខែ
                </div>
              </div>
            </div>

            {/* Right details column */}
            <div className="col-12 col-lg-7 p-4 p-lg-5">
              <div className="spotlight-content">
                <span className="spotlight-sub-badge mb-3">អ្នកស្ម័គ្រចិត្តគំរូ</span>
                <h3 className="spotlight-name mb-1">កញ្ញា សុខ ស្រីនី</h3>
                <p className="spotlight-role mb-4 text-accent">និស្សិតសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ & ស្ម័គ្រចិត្តផ្នែកបរិស្ថាន</p>

                <div className="spotlight-quote-box mb-4">
                  <i className="bi bi-quote spotlight-quote-icon"></i>
                  <p className="spotlight-quote">
                    "ការចូលរួមការងារស្ម័គ្រចិត្តមិនត្រឹមតែបានជួយដល់សហគមន៍ដែលខ្វះខាតប៉ុណ្ណោះទេ 
                    ប៉ុន្តែវាបានបង្រៀនខ្ញុំឱ្យចេះធ្វើការងារជាក្រុម និងបង្កើនទំនុកចិត្តលើខ្លួនឯង 
                    ជាពិសេសគឺបានផ្លាស់ប្តូរទស្សនៈរបស់ខ្ញុំក្នុងការរួមចំណែកដល់សង្គមជាតិ។"
                  </p>
                </div>

                <div className="spotlight-stats-grid mb-4">
                  <div className="spotlight-stat-item">
                    <h4 className="spotlight-stat-value">៥+</h4>
                    <span className="spotlight-stat-label">កម្មវិធីបានចូលរួម</span>
                  </div>
                  <div className="spotlight-stat-item">
                    <h4 className="spotlight-stat-value">១២០+ ម៉ោង</h4>
                    <span className="spotlight-stat-label">ការងារសង្គម</span>
                  </div>
                  <div className="spotlight-stat-item">
                    <h4 className="spotlight-stat-value">៥០+ ដើម</h4>
                    <span className="spotlight-stat-label">ដាំកូនឈើកោងកាង</span>
                  </div>
                </div>

                <Link href="/opportunities" className="btn btn-accent rounded-pill px-4 py-2 spotlight-btn">
                  ចូលរួមជាមួយពួកយើងឥឡូវនេះ <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
