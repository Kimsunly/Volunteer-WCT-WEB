// src/app/donation/components/DonationGrid.jsx
"use client";

import React from "react";
import DonationCard from "./DonationCard";

export default function DonationGrid({ onInfo, onBloodRegister }) {
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
                body: (
                  <div className="card-content">
                    <p className="mb-2">{c.description}</p>
                    <p className="text-secondary small mb-0">
                      ទីតាំង: {c.location}
                    </p>
                  </div>
                ),
              })
            }
            onRegister={onBloodRegister}
          />
        </div>
      ))}
    </div>
  );
}
