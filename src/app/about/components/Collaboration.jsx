"use client";

export default function Collaboration() {
  const stats = [
    { count: "24+", label: "កិច្ចព្រមព្រៀង MOU", delay: 200 },
    { count: "58+", label: "សកម្មភាពរួម/ឆ្នាំ", delay: 400 },
  ];

  const timelineItems = [
    {
      id: 1,
      title: "សហការផ្នែកបណ្តុះបណ្តាលគ្រូ",
      description: "រៀបចំវគ្គបណ្តុះបណ្តាល​គ្រូបច្ចេកវិទ្យា ជាមួយ",
      partner: "ANT Center",
      period: "រៀងរាល់ត្រីមាស។",
      badge: "Workshops",
    },
    {
      id: 2,
      title: "គម្រោងបរិស្ថានជាមួយសហគមន៍",
      description: "ពីរោះសម្អាតសហគមន៍ និងដាំដើមឈើជាមួយ",
      partner: "Green Life Group",
      period: "ក្នុងខែ មេសា–ឧសភា។",
      badge: "Community Action",
    },
    {
      id: 3,
      title: "MOU ជាមួយ NGO ថ្មី",
      description: "ចុះហត្ថលេខាលើកិច្ចព្រមព្រៀងសហការ ជាមួយ",
      partner: "ABC Foundation",
      period: "សម្រាប់កម្មវិធីអប់រំកុមារ។",
      badge: "MOU / Agreement",
    },
  ];

  const collaborationTypes = [
    {
      id: 1,
      icon: "bi-file-earmark-text",
      title: "កិច្ចព្រមព្រៀង (MOU)",
      description: "កំណត់គោលដៅ សិទ្ធិ និងការទទួលខុសត្រូវរបស់ភាគីទាំងពីរ។",
    },
    {
      id: 2,
      icon: "bi-people",
      title: "សកម្មភាពរួម",
      description: "Workshop, Training, Hackathon, CareerTalk, Field Trip…",
    },
    {
      id: 3,
      icon: "bi-hand-thumbs-up",
      title: "ការចូលរួមសហគមន៍",
      description: "សកម្មភាពសង្គម ដូចជា ការសម្អាតនិងដាំដើមឈើជាមួយសហគមន៍។",
    },
    {
      id: 4,
      icon: "bi-gift",
      title: "ការឧបត្ថម្ភ",
      description: "ផ្តល់ជំនួយសំរាប់គម្រោងនិងសកម្មភាពផ្សេងៗរបស់ដៃគូរ។",
    },
  ];

  return (
    <section className="collaboration py-5">
      <div className="container">
        <div className="row align-items-center g-4 mb-4">
          <div className="col-lg-7" data-aos="fade-right">
            <h2 className="section-title mb-2">
              ព័ត៌មានអំពីកិច្ចសហប្រតិបត្តិការ
            </h2>
            <p className="mb-0 fs-5">
              ការសហការជាមួយដៃគូររបស់យើង មានទម្រង់ផ្សេងៗ៖ កិច្ចព្រមព្រៀង
              (MOU/Agreement), សកម្មភាពរួម, ការចូលរួមសហគមន៍ និងឧបត្ថម្ភ។
              ខាងក្រោមជាព័ត៌មានសង្ខេប។
            </p>
          </div>
          <div className="col-lg-5" data-aos="fade-left">
            <div className="row g-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="col-6"
                  data-aos="fade-up"
                  data-aos-delay={stat.delay}
                >
                  <div className="p-4 stat-card rounded-4 text-center h-100">
                    <h4 className="fs-3 fw-bold">{stat.count}</h4>
                    <p className="fs-5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row g-4">
          <div
            className="col-12 col-lg-7"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="rounded-4 p-3 shadow p-md-4 position-relative timeline h-100">
              {timelineItems.map((item) => (
                <div
                  key={item.id}
                  className={`timeline-item ${item.id !== timelineItems.length ? "mb-4" : ""}`}
                >
                  <span className="dot"></span>
                  <h5 className="fs-5 fw-bold">{item.title}</h5>
                  <p className="fs-5 mb-0">
                    {item.description} <strong>{item.partner}</strong>{" "}
                    {item.period}
                  </p>
                  <span className="badge text-bg-primary">{item.badge}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-12 col-lg-5"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="rounded-4 p-4 p-md-3 h-100 collaboration-mode shadow">
              <h4 className="mb-3 fw-semibold">ប្រភេទសហការ</h4>
              <div className="d-flex flex-column gap-3">
                {collaborationTypes.map((type) => (
                  <div key={type.id} className="d-flex">
                    <div className={`icons ${type.id !== 2 ? "me-3" : ""}`}>
                      <i className={`bi ${type.icon}`}></i>
                    </div>
                    <div className={type.id === 2 ? "ms-3" : ""}>
                      <h5 className="fw-semibold">{type.title}</h5>
                      <p className="mb-0">{type.description}</p>
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
