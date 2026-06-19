"use client";

import Image from "next/image";

export default function AboutUs() {
  const missions = [
    {
      title: "ស្ម័គ្រចិត្តការអប់រំ",
      desc: "ផ្តល់ការអប់រំ និងការបណ្តុះបណ្តាលដល់កុមារនិងយុວជន",
      icon: "/images/Icon/presentation.png",
    },
    {
      title: "ស្ម័គ្រចិត្តតាមសហគមន៍",
      desc: "ជួយសហគមន៍ក្នុងការអភិវឌ្ឍ និងបង្កើនគុណភាពជីវិត",
      icon: "/images/Icon/community.png",
    },
    {
      title: "ស្ម័គ្រចិត្តរៀបចំព្រឹត្តិការណ៍",
      desc: "រៀបចំ និងចូលរួមព្រឹត្តិការណ៍សង្គម",
      icon: "/images/Icon/event-list.png",
    },
    {
      title: "ស្ម័គ្រចិត្តផ្នែកបរិស្ថាន",
      desc: "ការពារបរិស្ថាន និងបង្កើនការយល់ដឹង",
      icon: "/images/Icon/green-earth.png",
    },
    {
      title: "ការបរិច្ចាគ",
      desc: "ជួយផ្តល់ជំនួយ និងធនធានដល់អ្នកត្រូវការ",
      icon: "/images/Icon/donation.png",
    },
  ];

  return (
    <section className="about-modern-wrapper position-relative">
      <div className="about-glow-blob" />

      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-xl-6" data-aos="fade-right">
            <div className="about-img-container">
              <div className="about-img-main-wrap">
                <img
                  src="/images/homepage/about_02.jpg"
                  alt="About us"
                  className="about-img-main"
                />
              </div>
              <div className="about-floating-badge">
                <div className="about-badge-icon">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <div className="about-badge-text">
                  <span className="about-badge-num">100%</span>
                  <span className="about-badge-lbl">ទឹកចិត្តស្ម័គ្រចិត្ត</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div
              className="about-us-content position-relative ps-lg-4"
              data-aos="fade-left"
            >
              <span className="about-sub-label">អំពីយើង</span>
              <h2 className="about-header-title mt-3 mb-3">
                គោលបំណង និងបេសកកម្មរបស់ពួកយើង
              </h2>
              <p className="about-desc-text mb-4">
                យើងជាក្រុមស្ម័គ្រចិត្តនៅកម្ពុជា ដែលបង្កើតឡើងដោយក្រុមយុវជន
                និងមនុស្សមានចិត្តក្តីស្រឡាញ់មនុស្សជាតិ។
                យើងមានបំណងជួយដល់សហគមន៍ក្នុងតំបន់ត្រូវការ ដោយផ្តោតលើវិស័យអប់រំ
                ការពារបរិស្ថាន និងការអភិវឌ្ឍសហគមន៍។
              </p>

              <div className="about-mission-cards-list">
                {missions.map((m, idx) => (
                  <div
                    key={m.title}
                    className="about-mission-card"
                    data-aos="fade-left"
                    data-aos-delay={200 + idx * 100}
                  >
                    <div className="about-mission-icon-wrap">
                      <img src={m.icon} alt="" className="about-mission-icon" />
                    </div>
                    <div className="list-content ps-3">
                      <h4 className="about-mission-title">{m.title}</h4>
                      <p className="about-mission-desc">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
