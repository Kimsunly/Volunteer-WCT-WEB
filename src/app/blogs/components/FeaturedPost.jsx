import React from "react";
import Image from "next/image";
export default function FeaturedPost() {
  return (
    <section className="featured-post py-5">
      <div className="container">
        <div className="featured-badge mb-4" data-aos="fade-up">
          <i className="bi bi-star-fill me-2"></i>
          អត្ថបទលេចធ្លោ
        </div>

        <div
          className="card featured-card border-0 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row g-0">
            {/* Left image */}
            <div className="col-lg-6">
              <div className="featured-img">
                <span className="featured-tag">ពិសេស</span>
                /images/opportunities/Education/card-7/3.jpg
              </div>
            </div>

            {/* Right content */}
            <div className="col-lg-6">
              <div className="card-body p-5">
                <div className="mb-3">
                  <span className="badge bg-primary me-2">អប់រំ</span>
                  <span className="text-muted small">
                    <i className="bi bi-calendar me-1"></i>03 មករា 2026
                  </span>
                  <span className="text-muted small ms-3">
                    <i className="bi bi-clock me-1"></i>5 នាទីអាន
                  </span>
                </div>

                <h2 className="featured-title">
                  របៀបក្លាយជាស្ម័គ្រចិត្តដ៏ល្អក្នុងការបង្រៀនកុមារ
                </h2>

                <p className="featured-excerpt">
                  ការបង្រៀនកុមារតម្រូវឱ្យមានការយកចិត្តទុកដាក់
                  និងការរៀបចំយ៉ាងល្អ។ ក្នុងអត្ថបទនេះ យើងនឹងចែករំលែកគន្លឹះសំខាន់ៗ
                  និងបទពិសោធន៍ពីស្ម័គ្រចិត្តដែលមានបទពិសោធន៍
                  ក្នុងការបង្រៀនកុមារក្នុងតំបន់ជនបទ និងទីក្រុង។
                  អ្នកនឹងរៀនពីវិធីសាស្រ្តដែលមានប្រសិទ្ធភាព
                  ការរៀបចំសកម្មភាពគួរឱ្យចាប់អារម្មណ៍
                  និងការបង្កើតបរិយាកាសសិក្សាដ៏ល្អសម្រាប់កុមារ។
                </p>

                <div className="d-flex align-items-center">
                  <Image
                    src="/images/homepage/about_02.jpg"
                    alt="សុខ សុភ័ក្រ"
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h6 className="mb-0">សុខ សុភ័ក្រ</h6>
                    <small className="text-muted">ស្ម័គ្រចិត្តការបង្រៀន</small>
                  </div>
                </div>

                <a href="#" className="btn btn-link p-0 mt-3">
                  អានបន្ត <i className="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
