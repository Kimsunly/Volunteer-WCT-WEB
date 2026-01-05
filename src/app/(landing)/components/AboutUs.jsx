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
    <section className="about-us position-relative">
      <div className="pattern">
        <img
          src="/images/homepage/pattern-9.png"
          alt=""
          className="about-pattern"
        />
        <img
          src="/images/homepage/pattern-9.png"
          alt=""
          className="about-pattern2"
        />
        <img
          src="/images/homepage/pattern-4.png"
          alt=""
          className="pattern_01"
        />
        <img
          src="/images/homepage/pattern-4.png"
          alt=""
          className="pattern_02"
        />
        <img
          src="/images/homepage/pattern-4.png"
          alt=""
          className="pattern_03"
        />
        <div className="box box1"></div>
        <div className="box box2"></div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div
              className="about-us-img h-100 d-flex justify-content-center"
              data-aos="fade-right"
            >
              <img
                src="/images/homepage/about_02.jpg"
                alt="About us"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="col-xl-6">
            <div
              className="about-us-content position-relative"
              data-aos="fade-left"
            >
              <span>អំពីយើង</span>
              <h2 className="section-title mt-3 lh-sm">
                គោលបំណង និងបេសកកម្មរបស់ពួកយើង
              </h2>
              <p className="section-decript mt-2">
                យើងជាក្រុមស្ម័គ្រចិត្តនៅកម្ពុជា ដែលបង្កើតឡើងដោយក្រុមយុវជន
                និងមនុស្សមានចិត្តក្តីស្រឡាញ់មនុស្សជាតិ។
                យើងមានបំណងជួយដល់សហគមន៍ក្នុងតំបន់ត្រូវការ ដោយផ្តោតលើវិស័យអប់រំ
                ការពារបរិស្ថាន និងការអភិវឌ្ឍសហគមន៍។
              </p>

              <ul className="mission-list list-unstyled">
                {missions.map((m, idx) => (
                  <li
                    key={m.title}
                    className="mt-4"
                    data-aos="fade-left"
                    data-aos-delay={200 + idx * 150}
                  >
                    <div className="list-img">
                      <img src={m.icon} alt="" className="img-fluid" />
                    </div>
                    <div className="list-content ps-3">
                      <h4 className="mb-1">{m.title}</h4>
                      <p className="mb-0">{m.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
