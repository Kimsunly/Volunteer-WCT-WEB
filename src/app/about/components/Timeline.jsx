"use client";

export default function Timeline() {
  const timeline = [
    {
      year: "2020",
      title: "ឆ្នាំបង្កើត(Foundation Year)",
      items: [
        "ចាប់ផ្តើមគំនិតបង្កើតគម្រោងដោយក្រុមយុវជនតូចៗ។",
        "គោលបំណងដំបូង៖ ជួយសហគមន៍ក្នុងវិស័យអប់រំ និងបរិស្ថាន។",
        "រៀបចំការជួបជុំដំបូងជាមួយសហគមន៍ក្នុងតំបន់។",
      ],
      delay: 0,
    },
    {
      year: "2021",
      title: "ការចាប់ផ្តើមសកម្មភាព",
      items: [
        "រៀបចំសកម្មភាពសម្អាតតំបន់សាធារណៈដំបូង។",
        "ចូលរួមជាមួយកុមារ និងមាតាបិតាក្នុងការបង្រៀនអក្សរខ្មែរ និងគណិតវិទ្យា។",
        "ទទួលបានការគាំទ្រពីអាជ្ញាធរ និងស្ថាប័នមូលដ្ឋាន។",
      ],
      delay: 200,
    },
    {
      year: "2022",
      title: "ការពង្រីកបណ្តាញ",
      items: [
        "បង្កើតក្រុមស្ម័គ្រចិត្តចំនួន 50 នាក់។",
        "រៀបចំកម្មវិធីដាំដើមឈើ និងការពារបរិស្ថាន។",
        "ចាប់ផ្តើមចូលរួមសកម្មភាពជាមួយស្ថាប័នអន្តរជាតិ។",
      ],
      delay: 400,
    },
    {
      year: "2023",
      title: "ការសម្រេចលទ្ធផលដំបូង",
      items: [
        "ជួយកុមារជាង 100 នាក់ក្នុងការអប់រំក្រៅម៉ោង។",
        "ដាំដើមឈើជាង 200 ដើមនៅសាលារៀន និងវាលសាធារណៈ។",
        "ចូលរួមក្នុងការបណ្តុះបណ្តាលជំនាញជីវិតសម្រាប់យុវជន។",
      ],
      delay: 600,
    },
    {
      year: "2024",
      title: "ការទទួលស្គាល់",
      items: [
        "ទទួលបានរង្វាន់សកម្មភាពសង្គមលំដាប់ជាតិ។",
        "ការចូលរួមស្ម័គ្រចិត្តកើនដល់ 400 នាក់។",
        "ទទួលបានការគាំទ្រពីអាជ្ញាធរ និងស្ថាប័នមូលដ្ឋាន។",
      ],
      delay: 800,
    },
    {
      year: "2025",
      title: "ការសម្រេចជោគជ័យធំ",
      items: [
        "ចំនួនស្ម័គ្រចិត្តកើនដល់ 3,000 នាក់។",
        "បង្កើតគម្រោងថ្មីសម្រាប់ការការពារបរិស្ថាន។",
        "មានដៃគូរសហកាណ៏ជាច្រើនបានទាក់ទងមកយើង",
      ],
      delay: 1000,
    },
  ];

  return (
    <section className="our-story">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card bg-transparent border-0">
              <div className="card-body">
                <div className="section-header text-center" data-aos="fade-up">
                  <h2 className="fw-bold fs-3 text-center mt-4">
                    ប្រវត្តិដំណើរការនៃការចាប់ផ្តើមក្រុម
                  </h2>
                </div>
                <div className="steps">
                  {timeline.map((step) => (
                    <div
                      key={step.year}
                      className="steps-container"
                      data-aos="fade-left"
                      data-aos-delay={step.delay}
                    >
                      <div className="content w-100">
                        <h2 className="fs-4">{step.title}</h2>
                        <ul className="fs-5 ps-0">
                          {step.items.map((item, index) => (
                            <li key={index}>
                              <i className="bi bi-check-circle-fill text-success"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="step-line"></div>
                      <div className="date">{step.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
