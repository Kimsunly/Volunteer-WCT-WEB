"use client";

import React from "react";
import Image from "next/image";

export default function Testimonials() {
  const items = [
    {
      rating: 5,
      text: "ការបរិច្ចាគបានផ្តល់ឱ្យខ្ញុំនូវអារម្មណ៍ថាខ្ញុំកំពុងចូលរួមចំណែកដល់សង្គម។ ខ្ញុំរីករាយនឹងបានឃើញផលវិជ្ជមានពីការបរិច្ចាគរបស់ខ្ញុំ។",
      avatar: "https://i.pravatar.cc/80?img=32",
      name: "សុភា ចាន់",
      location: "Phnom Penh",
      aosSide: "right",
      delay: 100,
    },
    {
      rating: 4,
      text: "ខ្ញុំមានអារម្មណ៍ល្អណាស់ដែលបានឃើញផលវិជ្ជមានពីការបរិច្ចាគរបស់ខ្ញុំ។ វាជួយកុមារជាច្រើនបានទទួលការអប់រំល្អប្រសើរ។",
      avatar: "https://i.pravatar.cc/80?img=14",
      name: "ដារា លី",
      location: "Siem Reap",
      aosSide: "left",
      delay: 200,
    },
  ];

  const Star = ({ filled }) => (
    <i className={`bi ${filled ? "bi-star-fill" : "bi-star"} text-warning`}></i>
  );

  return (
    <>
      <div className="text-center mb-4">
        <h5 className="mb-2">មតិពីអ្នកបរិច្ចាគ</h5>
        <p className="text-muted">ស្តាប់អ្វីដែលអ្នកបរិច្ចាគផ្សេងទៀតនិយាយ</p>
      </div>

      <div className="row g-4">
        {items.map((t, idx) => (
          <div
            key={idx}
            className="col-md-6"
            data-aos={`fade-${t.aosSide}`}
            data-aos-delay={t.delay}
          >
            <div className="testimonial-donation">
              <div className="testimonial-rating mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < t.rating} />
                ))}
              </div>

              <p className="testimonial-text">"{t.text}"</p>

              <div className="testimonial-author">
                <Image src={t.avatar} width={80} height={80} alt="Donor" />
                <div className="testimonial-author-info">
                  <div className="name">{t.name}</div>
                  <div className="location">{t.location}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
