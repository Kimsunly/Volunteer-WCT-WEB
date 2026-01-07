"use client";

import React, { useState } from "react";

const QA = [
  {
    q: "ខ្ញុំអាចបរិច្ចាគដោយរបៀបណា?",
    a:
      "អ្នកអាចជ្រើសរើសបរិច្ចាគ ១ ដង ឬប្រចាំខែ ហើយទូទាត់តាមរយៈកាត/PayPal/ធនាគារ។ ការបរិច្ចាគរបស់អ្នកនឹងត្រូវបានប្រើប្រាស់ដើម្បីគាំទ្រកម្មវិធីទាំងអស់ដែលត្រូវការជំនួយបំផុត។ យើងក៏ផ្តល់វិក័យប័ត្រអាករសម្រាប់ការបរិច្ចាគទាំងអស់។",
  },
  {
    q: "តើទុកប្រាក់របស់ខ្ញុំត្រូវបានប្រើប្រាស់ជាអ្វីត្លោះ?",
    a:
      "95% ឆ្លងកាត់ទៅលើសកម្មភាពសង្គមដោយផ្ទាល់ (គម្រោងបរិស្ថាន, សមាហារសហគមន, ដាំដើម...) 5% សម្រាប់ចំណាយប្រតិបត្តិការ និងការថែទាំប្រព័ន្ធ។ យើងផ្តល់របាយការណ៍តម្លាភាពប្រចាំឆ្នាំដល់អ្នកបរិច្ចាគទាំងអស់។",
  },
  {
    q: "តើខ្ញុំអាចទទួលបានបង្កាន់ដៃបរិច្ចាគបន្ទាន់ទេ?",
    a:
      "បាទ/ចាស—យើងផ្ញើអ៊ីមែលបញ្ជាក់ជាមួយបង្កាន់ដៃបន្ទាប់ពីទូទាត់ជោគជ័យ។ អ្នកអាចទាញយកជា PDF ឬទទួលតាមសំបុត្រ។",
  },
  {
    q: "តើស្មគ្រចិត្តទទួលបានប្រាក់ឬអត់?",
    a:
      "ការស្មគ្រចិត្តភាគច្រើនគ្មានប្រាក់ឈ្នួល។ អង្គការមួយចំនួនអាចផ្តល់អាហារ សំបុត្រធ្វើដំណើរ ឬបង្រៀនជំនាញជាការប្រាក្ដ។",
  },
  {
    q: "តើខ្ញុំអាចជ្រើសរើសម៉ោងធ្វើការបានទេ?",
    a:
      "បាទ/ចាស! យើងផ្តល់ភាពបត់បែនពេលវេលា។ អ្នកអាចជ្រើសកម្មវិធីសមកាលវិភាគរបស់អ្នក និងចូលរួមតាមពេលវេលាដែលអាចធ្វើបាន។",
  },
  {
    q: "តើខ្ញុំអាចបញ្ឈប់ការបរិច្ចាគប្រចាំខែបានទេ?",
    a:
      "បាទ/ចាស អ្នកអាចបញ្ឈប់ ផ្អាក ឬកែប្រែការបរិច្ចាគប្រចាំខែគ្រប់ពេល ដោយចូលគណនី ឬទាក់ទងមកយើង។",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="text-center mb-5" data-aos="fade-up">
        <span className="faq-donation-badge">
          <i className="bi bi-question-circle-fill me-2"></i>
          សំណួរញឹកញាប់
        </span>
        <h2 className="faq-donation-title mt-3 mb-3">សំណួរញឹកញាប់ (FAQ)</h2>
        <p className="faq-donation-subtitle mx-auto" style={{ maxWidth: 700 }}>
          ស្វែងរកចម្លើយសម្រាប់សំណួរដែលអ្នកប្រើប្រាស់តែងតែសួរ
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="faq-donation-accordion">
            {QA.map((item, idx) => {
              const isActive = active === idx;
              return (
                <div
                  key={idx}
                  className={`faq-donation-item ${isActive ? "active" : ""}`}
                  data-aos="fade-up"
                  data-aos-delay={(idx + 1) * 100}
                >
                  <button
                    type="button"
                    className="faq-donation-question w-100 d-flex align-items-center justify-content-between"
                    onClick={() => setActive(isActive ? null : idx)}
                  >
                    <h3 className="mb-0">{item.q}</h3>
                    <div className="faq-donation-toggle">
                      <i className={`bi ${isActive ? "bi-dash-lg" : "bi-plus-lg"}`}></i>
                    </div>
                  </button>
                  <div className="faq-donation-answer">
                    <p className="mb-0">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
