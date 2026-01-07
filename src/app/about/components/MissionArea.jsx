"use client";

import Image from "next/image";

export default function MissionArea() {
  const missions = [
    {
      id: 1,
      title: "ចក្ខុវិស័យ",
      icon: "/images/about-photo/miss1.png",
      color: "text-primary",
      text: "ចង់ឃើញសង្គមដែលមនុស្សគ្រប់រូបមានឱកាសស្មើគ្នា ទទួលបានអប់រំ និងជីវភាពប្រសើរទាំងជនបទនិងទីប្រជុំជន។",
      bgtext: "ចក្ខុវិស័យ",
      delay: 0,
    },
    {
      id: 2,
      title: "បេសកកម្ម",
      icon: "/images/about-photo/miss2.png",
      color: "text-success",
      text: "ផ្តល់ឱកាសអប់រំ ការបណ្តុះបណ្តាល ដើម្បីបង្កើតកម្លាំងឲ្យយុវជន និងសហគមន៍ ក្លាយជាអ្នកដឹកនាំ និងផ្លាស់ប្តូរសង្គមឲ្យកាន់តែប្រសើរ។",
      bgtext: "បេសកកម្ម",
      delay: 200,
    },
    {
      id: 3,
      title: "គោលដៅ",
      icon: "/images/about-photo/miss3.png",
      color: "text-danger",
      text: "ជំរុញការចូលរួមសហគមន៍ អភិវឌ្ឍសេដ្ឋកិច្ច និងបរិស្ថាន ព្រមទាំងគាំទ្រដល់អ្នកដែលត្រូវការជំនួយទាំងឡាយគ្រប់ខេត្តក្រុង។",
      bgtext: "គោលដៅ",
      delay: 400,
    },
  ];

  return (
    <section className="mission-area py-5 mt-5">
      <div className="container mt-5">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold text-primary">អំពីយើង</h2>
          <div className="line-style mx-auto mb-3"></div>
          <p className="fs-4">
            យើងជឿជាក់ថា សង្គមអាចក្លាយជាកន្លែងប្រសើរជាងមុន ប្រសិនបើយុវជន
            និងសហគមន៍ទទួលបានឱកាសអប់រំ និងការគាំទ្រសមស្រប។
          </p>
        </div>
        <div className="row g-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="col-12 col-md-6 col-lg-4"
              data-aos="zoom-in"
              data-aos-delay={mission.delay}
            >
              <div
                className="mission-card card text-center p-4 shadow-lg h-100 hover-card"
                data-bgtext={mission.bgtext}
              >
                <Image
                  src={mission.icon}
                  width={120}
                  height={120}
                  className="mb-3 mx-auto"
                  alt={mission.title}
                />
                <div className="card-body">
                  <h4 className={`mb-3 fw-bold ${mission.color}`}>
                    {mission.title}
                  </h4>
                  <p className="fs-5">{mission.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
