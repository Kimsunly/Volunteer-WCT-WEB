import React from "react";

export default function BlogHero() {
  return (
    <section className="blog-hero">
      <div className="container">
        <div className="row align-items-center">
          {/* Left */}
          <div className="col-lg-6" data-aos="fade-right">
            <span className="blog-badge">
              <i className="bi bi-lightbulb-fill me-2"></i>
              អត្ថបទ និងព័ត៌មាន
            </span>
            <h1 className="blog-hero-title">
              រៀនស្វែងយល់ពីរបៀបរួមចំណែក
              <br />
              សម្រាប់ស្ម័គ្រចិត្ត
            </h1>
            <p className="blog-hero-subtitle">
              រកមើលគន្លឹះ និងការណែនាំពិសេសៗអំពីការងារស្ម័គ្រចិត្ត
              ការអភិវឌ្ឍន៍សង្គម
              និងរបៀបដែលអ្នកអាចបង្កើតការផ្លាស់ប្តូរវិជ្ជមានក្នុងសហគមន៍របស់អ្នក។
            </p>

            <div className="blog-stats mt-4">
              <div className="stat-item">
                <h3>150+</h3>
                <p>អត្ថបទ</p>
              </div>
              <div className="stat-item">
                <h3>50K+</h3>
                <p>អ្នកអាន</p>
              </div>
              <div className="stat-item">
                <h3>12</h3>
                <p>ប្រភេទ</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
            <div className="blog-hero-image">/images/homepage/cta-ipad.png</div>
          </div>
        </div>
      </div>
    </section>
  );
}
