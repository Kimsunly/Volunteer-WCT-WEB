// src/app/donation/components/DonationGrid.jsx
"use client";

import React from "react";
import DonationCard from "./DonationCard";

const hospitalDetails = {
  "koma-angkor": {
    name: "Koma Angkor Children's Hospital",
    location: "សមាមកមុមារអង្គរវត្ត • Siem Reap",
    description:
      "ជួយគាំទ្រការថែទាំសុខភាពកុមារ ដោយផ្តល់ថ្នាំ វីភាគ និងការថែទាំបន្ទាន់ឥតគិតថ្លៃ។",
    mission:
      "បេសកម្មរបស់យើងគឺផ្តល់សេវាពេទ្យឥតគិតថ្លៃដល់កុមារក្រីក្រនៅភាគខាងជើងនៃប្រទេសកម្ពុជា។",
    services: [
      "ការថែទាំបន្ទាន់ (Emergency Care)",
      "ការវះកាត់កុមារ (Pediatric Surgery)",
      "ការព្យាបាលជំងឺមហារីកកុមារ (Pediatric Oncology)",
      "ការថែទាំដំបូង (Primary Care)",
      "កម្មវិធីវ៉ាក់សាំង (Vaccination Programs)",
    ],
    founded: 2003,
  },
  "kuntha-bopha": {
    name: "Jayavarman VII – Kantha Bopha",
    location: "មន្ទីរពេទ្យកុមារ • Phnom Penh & Siem Reap",
    description:
      "ជួយថែទាំកុមារក្រីក្រ ជាមួយនឹងសេវាពេទ្យឥតគិតថ្លៃ និងការពិបាលជំងឺធ្ងន់ធ្ងរ។",
    mission:
      "ផ្តល់ការថែទាំសុខភាពឥតគិតថ្លៃដល់កុមារទាំងអស់ ដោយមិនគិតពីស្ថានភាពសេដ្ឋកិច្ច។",
    services: [
      "ការថែទាំបន្ទាន់ 24 ម៉ោង (24hr Emergency)",
      "ការវះកាត់បេះដូងកុមារ (Pediatric Cardiac Surgery)",
      "ការព្យាបាលជំងឺខួរឆ្អឹង (Neonatal Care)",
      "កម្មវិធីបណ្តុះបណ្តាល (Training Programs)",
      "មណ្ឌលស្រាវជ្រាវ (Research Center)",
    ],
    founded: 1992,
  },
};

export default function DonationGrid({ onInfo, onBloodRegister, onQRDonate }) {
  const cards = [
    {
      id: "koma-angkor",
      image: "/images/Donation/Koma Angkor Children’s Hospital.jpg",
      badge: {
        text: "សុខភាព",
        className: "bg-primary text-white",
        icon: "bi bi-hospital me-1",
      },
      title: "Koma Angkor Children's Hospital",
      location: "សមាមកមុមារអង្គរវត្ត • Siem Reap",
      description:
        "ជួយគាំទ្រការថែទាំសុខភាពកុមារ ដោយផ្តល់ថ្នាំ វីភាគ និងការថែទាំបន្ទាន់ឥតគិតថ្លៃ។",
      progress: { collected: 45200, goal: 100000, percent: 45 },
      actions: [
        { type: "info", label: "ព័ត៌មាន" },
        { type: "donate", label: "បរិច្ចាគ" },
      ],
      aosDelay: 100,
    },
    {
      id: "kuntha-bopha",
      image: "/images/Donation/Kantha Bopha.jpg",
      badge: {
        text: "កុមារ",
        className: "bg-success text-white",
        icon: "bi bi-heart-pulse me-1",
      },
      title: "Jayavarman VII – Kantha Bopha",
      location: "មន្ទីរពេទ្យកុមារ • Phnom Penh & Siem Reap",
      description:
        "ជួយថែទាំកុមារក្រីក្រ ជាមួយនឹងសេវាពេទ្យឥតគិតថ្លៃ និងការពិបាលជំងឺធ្ងន់ធ្ងរ។",
      progress: { collected: 68400, goal: 150000, percent: 46 },
      actions: [
        { type: "info", label: "ព័ត៌មាន" },
        { type: "donate", label: "បរិច្ចាគ" },
      ],
      aosDelay: 200,
    },
    {
      id: "blood-donation",
      image: "/images/Donation/Khmer-Soviet.jpg",
      badge: {
        text: "បន្ទាន់",
        className: "bg-white text-danger",
        icon: "bi bi-droplet-fill me-1",
      },
      title: "បរិច្ចាគឈាម • ថ្ងៃនេះ",
      location: "មន្ទីរពេទ្យខ្មែរ-សូវៀត • Phnom Penh",
      description:
        "ដូរឈាមថ្មេង អាចជួយសង្គ្រោះជីវិតបានច្រើន។ ចុះបញ្ជីឥឡូវ និងទីតាំងដែលសមស្រប។",
      progress: { collected: 432, goal: 800, percent: 54, unit: "ចុះឈ្មោះ" },
      bloodTypes: ["A+", "A-", "B+", "O+", "AB+"],
      actions: [
        {
          type: "map",
          label: "ស្វែងរកទីតាំង",
          href: "https://maps.app.goo.gl/zKZzbcv5gDuwFqE5A",
        },
        { type: "register", label: "ចុះឈ្មោះ" },
      ],
      aosDelay: 300,
    },
  ];

  const renderInfoBody = (card) => {
    const details = hospitalDetails[card.id];
    if (!details) {
      return (
        <div className="card-content">
          <p className="mb-2">{card.description}</p>
          <p className="text-secondary small mb-0">ទីតាំង: {card.location}</p>
        </div>
      );
    }

    return (
      <div className="card-content">
        {/* Info Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6">
            <div
              className="d-flex align-items-center gap-3 p-3 rounded-4"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "var(--color-accent-dim)",
                  color: "var(--color-accent)",
                  flexShrink: 0
                }}
              >
                <i className="bi bi-geo-alt-fill" style={{ fontSize: "1.2rem" }}></i>
              </div>
              <div className="d-flex flex-column">
                <span className="text-uppercase fw-bold small" style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>ទីតាំង</span>
                <span className="fw-semibold" style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>{details.location}</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div
              className="d-flex align-items-center gap-3 p-3 rounded-4"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "var(--color-accent-dim)",
                  color: "var(--color-accent)",
                  flexShrink: 0
                }}
              >
                <i className="bi bi-calendar-event-fill" style={{ fontSize: "1.2rem" }}></i>
              </div>
              <div className="d-flex flex-column">
                <span className="text-uppercase fw-bold small" style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>បង្កើតឡើង</span>
                <span className="fw-semibold" style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>ឆ្នាំ {details.founded}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-4" style={{ lineHeight: "1.8", color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
          {details.description}
        </p>

        {/* Mission Callout */}
        <div
          className="rounded-4 p-4 mb-4"
          style={{
            background: "var(--color-bg-input)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <div className="d-flex gap-3 align-items-start">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mt-1"
              style={{
                width: "32px",
                height: "32px",
                background: "var(--color-accent-dim)",
                color: "var(--color-accent)",
                flexShrink: 0
              }}
            >
              <i className="bi bi-bullseye" style={{ fontSize: "1rem" }}></i>
            </div>
            <div>
              <span className="d-block text-uppercase fw-bold mb-1" style={{ color: "var(--color-text-secondary)", fontSize: "0.8rem", letterSpacing: "0.04em" }}>បេសកកម្មរបស់យើង</span>
              <p className="mb-0 fw-medium" style={{ color: "var(--color-text-primary)", lineHeight: "1.6" }}>{details.mission}</p>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-4">
          <h5 className="fw-bold mb-3" style={{ color: "var(--color-text-primary)", fontSize: "1.15rem" }}>
            សេវាដែលផ្តល់
          </h5>
          <div className="row g-3">
            {details.services.map((service, index) => (
              <div key={index} className="col-12 col-md-6">
                <div
                  className="d-flex align-items-center gap-3 p-3 rounded-4"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(16, 185, 129, 0.12)",
                      color: "#10B981",
                      flexShrink: 0
                    }}
                  >
                    <i className="bi bi-check2" style={{ fontSize: "1.1rem" }}></i>
                  </div>
                  <span className="small fw-semibold" style={{ color: "var(--color-text-primary)" }}>{service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="row g-4 mb-5">
      {cards.map((c) => (
        <div
          key={c.id}
          className="col-md-6 col-lg-4"
          data-aos="fade-up"
          data-aos-delay={c.aosDelay}
        >
          <DonationCard
            {...c}
            onInfo={() =>
              onInfo({
                title: c.title,
                body: renderInfoBody(c),
              })
            }
            onRegister={onBloodRegister}
            onDonate={() => onQRDonate && onQRDonate(c.id)}
          />
        </div>
      ))}
    </div>
  );
}
