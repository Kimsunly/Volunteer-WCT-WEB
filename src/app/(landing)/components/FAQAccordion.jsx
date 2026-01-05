"use client";
import { useState } from "react";

const faqs = [
  {
    q: "តើត្រូវចំណាយថ្លៃសម្រាប់ចូលរួមទេ?",
    a: "មិនចាំបាច់ទេ! ការចូលរួមស្ម័គ្រចិត្តគឺឥតគិតថ្លៃ។ យើងជឿជាក់ថាការស្ម័គ្រចិត្តគួរតែអាចចូលដំណើរការបានសម្រាប់មនុស្សគ្រប់គ្នា។",
  },
  {
    q: "ហេតុអ្វីបានជាខ្ញុំគួរជាអ្នកស្ម័គ្រចិត្ត?",
    a: "ការជាអ្នកស្ម័គ្រចិត្តជាវិធីល្អក្នុងការផ្ដល់វិញដល់សហគមន៍ ទទួលបានជំនាញថ្មីៗ ស្គាល់មនុស្សថ្មីៗ និងបង្កើតឥទ្ធិពលវិជ្ជមាន។ វាក៏អាចជួយបន្ថែមបទពិសោធន៍ និងពង្រឹងប្រវត្តិរូបរបស់អ្នកផងដែរ។",
  },
  {
    q: "តើខ្ញុំត្រូវមានបទពិសោធន៍មុនដើម្បីស្ម័គ្រចិត្តទេ?",
    a: "មិនចាំបាច់ទេ! តួនាទីភាគច្រើនមានការបណ្តុះបណ្តាល ហើយការមានចិត្តក្តីស្ម័គ្រចិត្តគឺសំខាន់ជាងបទពិសោធន៍។ តួនាទីពិសេសខ្លះអាចទាមទារជំនាញឬវិញ្ញាបនបត្របិសេស។",
  },
  {
    q: "តើស្ម័គ្រចិត្តទទួលបានប្រាក់ឬអត់?",
    a: "ការស្ម័គ្រចិត្តភាគច្រើនគឺគ្មានប្រាក់ឈ្នួល។ ទោះយ៉ាងណា អង្គការមួយចំនួនអាចផ្តល់ជូនអាហារ សំបុត្រធ្វើដំណើរ ឬបង្រៀនជំនាញជាការប្រាថ្នា។",
  },
  {
    q: "តើខ្ញុំអាចជ្រើសរើសម៉ោងធ្វើការបានទេ?",
    a: "បាទ/ចាស! យើងផ្តល់នូវភាពបត់បែនខ្ពស់។ អ្នកអាចជ្រើសរើសកម្មវិធីដែលសមនឹងកាលវិភាគរបស់អ្នក និងចូលរួមតាមពេលវេលាដែលអ្នកអាចធ្វើបាន។",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <section className="faq-modern position-relative mt-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5" data-aos="fade-right">
            <div className="faq-image-wrapper">
              <img
                src="/images/homepage/cta-ipad.png"
                alt="FAQ"
                className="img-fluid"
              />
              <div className="floating-q q1">?</div>
              <div className="floating-q q2">?</div>
              <div className="floating-q q3">?</div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="mb-4" data-aos="fade-left">
              <span className="faq-badge">
                <i className="bi bi-question-circle-fill me-2" />
                សំណួរញឹកញាប់
              </span>
              <h2 className="faq-title mt-3 mb-3">សំណួរញឹកញាប់ (FAQ)</h2>
              <p className="faq-subtitle">
                ស្វែងរកចម្លើយសម្រាប់សំណួរដែលអ្នកប្រើប្រាស់តែងតែសួរ
              </p>
            </div>

            <div className="faq-accordion">
              {faqs.map((f, i) => {
                const active = open === i;
                return (
                  <div
                    key={f.q}
                    className={`faq-item ${active ? "active" : ""}`}
                    data-aos="fade-left"
                    data-aos-delay={(i + 1) * 100}
                  >
                    <button
                      type="button"
                      className="faq-question w-100 text-start d-flex justify-content-between align-items-center"
                      onClick={() => setOpen(active ? null : i)}
                    >
                      <h3 className="mb-0">{f.q}</h3>
                      <div className="faq-toggle">
                        <i
                          className={`bi ${
                            active ? "bi-dash-lg" : "bi-plus-lg"
                          }`}
                        />
                      </div>
                    </button>
                    <div
                      className="faq-answer"
                      style={{ display: active ? "block" : "none" }}
                    >
                      <p>{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="faq-cta mt-4"
              data-aos="fade-left"
              data-aos-delay="600"
            >
              <div className="faq-cta-content">
                <i className="bi bi-chat-dots-fill" />
                <p className="mb-0">
                  មាន​សំណួរ​ទៀត​ទេ? <a href="/contact">ទាក់ទងយើងខ្ញុំ</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
