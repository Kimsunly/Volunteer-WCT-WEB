"use client";

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      count: "1000+",
      title: "គ្រួសារទទួលបានសុខភាព",
      icon: "bi-heart-pulse-fill",
      colorClass: "color-0",
      delay: 200,
    },
    {
      id: 2,
      count: "500+",
      title: "កុមារទទួលបានអប់រំ",
      icon: "bi-mortarboard-fill",
      colorClass: "color-1",
      delay: 400,
    },
    {
      id: 3,
      count: "200+",
      title: "យុវជនបានបណ្តុះបណ្តាលជំនាញ",
      icon: "bi-laptop-fill",
      colorClass: "color-2",
      delay: 600,
    },
    {
      id: 4,
      count: "500+",
      title: "សហគមន៍បានអភិវឌ្ឍ",
      icon: "bi-house-heart-fill",
      colorClass: "color-3",
      delay: 800,
    },
  ];

  return (
    <section className="about-achievements py-5 position-relative">
      {/* Abstract decorative background blurs */}
      <div className="achievements-blur-bg">
        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="achievements-badge mb-3">
                <i className="bi bi-award-fill me-2" />
                សមិទ្ធិផលរបស់យើង
              </span>
              <h2 className="fw-bold mb-3 achievements-title">សម្រេចលទ្ធផល និងសមិទ្ធិផល</h2>
              <p className="achievements-subtitle mx-auto">
                មើលសង្ខេបអំពីអ្វីដែលយើងបានសម្រេច
                និងសមិទ្ធិផលសំខាន់ៗក្នុងដំណើររបស់យើង។
              </p>
            </div>
          </div>
        </div>

        <div className="row py-4 g-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="col-12 col-md-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay={achievement.delay}
            >
              <div className="achievement-card-redesigned text-center h-100 py-4">
                <div className={`achievement-icon-wrap ${achievement.colorClass} mx-auto mt-3 mb-4`}>
                  <i className={`bi ${achievement.icon}`}></i>
                </div>
                <div className="achievement-body px-3 pb-3">
                  <div className="achievement-number mb-2">{achievement.count}</div>
                  <h3 className="achievement-label">{achievement.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
