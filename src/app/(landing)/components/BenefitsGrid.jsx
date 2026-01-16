const benefits = [
  {
    title: "ស្ម័គ្រចិត្តការអប់រំ",
    icon: "/images/homepage/benefits_01.png",
    color: "benefit-blue",
    points: ["បង្កើនចំណេះដឹង", "ជួយកុមារ", "បង្កើនការយល់ដឹង"],
  },
  {
    title: "ស្ម័គ្រចិត្តតាមសហគមន៍",
    icon: "/images/homepage/benefits_02.png",
    color: "benefit-green",
    points: ["សហគមន៍រឹងមាំ", "បង្កើនគុណភាពជីវិត", "ទំនាក់ទំនងល្អ"],
  },
  {
    title: "ស្ម័គ្រចិត្តរៀបចំព្រឹត្តិការណ៍",
    icon: "/images/homepage/benefits_03.png",
    color: "benefit-purple",
    points: ["រៀបចំព្រឹត្តិការណ៍", "ការងារជាក្រុម", "សាមគ្គីភាព"],
  },
  {
    title: "ស្ម័គ្រចិត្តផ្នែកបរិស្ថាន",
    icon: "/images/homepage/benefits_04.png",
    color: "benefit-teal",
    points: ["បរិស្ថានស្អាត", "ទំនួលខុសត្រូវសង្គម", "ស្រឡាញ់ភពផែនដី"],
  },
  {
    title: "ការបរិច្ចាគ",
    icon: "/images/homepage/benefits_05.png",
    color: "benefit-orange",
    points: ["ជួយសង្គម", "ឥទ្ធិពលវែង", "ចិត្តមេត្តា"],
  },
];

import Link from "next/link";

export default function BenefitsGrid() {
  return (
    <section className="benefits-modern position-relative">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="benefits-badge">
            <i className="bi bi-star-fill me-2" /> អត្ថប្រយោជន៍
          </span>
          <h2 className="benefits-title mt-3 mb-3">
            អត្ថប្រយោជន៍នៃការស្ម័គ្រចិត្ត
          </h2>
          <p className="benefits-subtitle mx-auto">
            ការស្ម័គ្រចិត្តជួយអភិវឌ្ឍខ្លួនឯង
            ដោយផ្តល់ឱកាសឲ្យយើងទទួលបានបទពិសោធន៍ថ្មីៗ...
          </p>
        </div>

        <div className="row g-4">
          {benefits.map((b, idx) => (
            <div
              className="col-md-6 col-lg-4"
              key={b.title}
              data-aos="fade-up"
              data-aos-delay={(idx + 1) * 100}
            >
              <div className={`benefit-card ${b.color}`}>
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon">
                    <img src={b.icon} alt={b.title} />
                  </div>
                  <div className="benefit-glow"></div>
                </div>
                <h3 className="benefit-title">{b.title}</h3>
                <ul className="benefit-list">
                  {b.points.map((p) => (
                    <li key={p}>
                      <i className="bi bi-check-circle-fill" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="benefit-pattern"></div>
              </div>
            </div>
          ))}

          <div
            className="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="benefit-cta-card">
              <div className="cta-icon">
                <i className="bi bi-rocket-takeoff-fill" />
              </div>
              <h3>ចាប់ផ្តើមធ្វើការផ្លាស់ប្តូរ</h3>
              <p>
                ចូលរួមជាមួយយើងថ្ងៃនេះ និងក្លាយជាផ្នែកមួយនៃការផ្លាស់ប្តូរវិជ្ជមាន
              </p>
              <Link href="/auth/login" className="cta-button">
                <span>ចុះឈ្មោះឥឡូវ</span>
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
