"use client";

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      count: "1000+",
      title: "គ្រួសារទទួលបានសុខភាព",
      delay: 200,
    },
    {
      id: 2,
      count: "500+",
      title: "កុមារទទួលបានអប់រំ",
      delay: 400,
    },
    {
      id: 3,
      count: "200+",
      title: "យុវជនបានបណ្តុះបណ្តាលជំនាញ",
      delay: 600,
    },
    {
      id: 4,
      count: "500+",
      title: "សហគមន៍បានអភិវឌ្ឍ",
      delay: 800,
    },
  ];

  return (
    <section className="our-story">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center pt-3" data-aos="fade-up">
              <h2 className="fw-bold">សម្រេចលទ្ធផល និងសមិទ្ធិផល</h2>
              <p className="fs-5">
                មើលសង្ខេបអំពីអ្វីដែលយើងបានសម្រេច
                និងសមិទ្ធិផលសំខាន់ៗក្នុងដំណើររបស់យើង។
              </p>
            </div>
            <div className="row py-4 g-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="col-12 col-md-6 col-lg-3"
                  data-aos="zoom-in"
                  data-aos-delay={achievement.delay}
                >
                  <div className="card card-counter text-center h-100">
                    <div className="card-img mx-auto mt-3">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div className="card-body">
                      <div className="counter">{achievement.count}</div>
                      <h3>{achievement.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
