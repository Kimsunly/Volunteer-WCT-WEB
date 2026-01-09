"use client";

import { useEffect, useState } from "react";

export default function TeamCarousel() {
  const members = [
    {
      id: 1,
      name: "លី គីមស៊ុន",
      role: "ប្រធានក្រុម",
      image: "/images/member/sun.jpg",
      description:
        "ខ្ញុំបាទជាសិស្សមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)ឆ្នាំទី៣ ផ្នែកវិស្វកមុ្មព័ត៌មានវិទ្យា",
      social: {
        facebook: "https://www.facebook.com/kimsun.ly.2025",
        telegram: "https://t.me/Kimsun_Ly",
        email: "mailto:kimsunly49@gmail.com",
      },
      index: 0,
    },
    {
      id: 2,
      name: "លី​ ម៉េងហុង",
      role: "សមាជិក",
      image: "/images/member/hong.png",
      description:
        "ខ្ញុំបាទជាសិស្សមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)ឆ្នាំទី៣ ផ្នែកវិស្វកមុ្មព័ត៌មានវិទ្យា",
      social: {
        facebook: "https://www.facebook.com/share/1APqhWAT8c/?mibextid=wwXIfr",
        telegram: "https://t.me/menghong5",
        email: "mailto:hong06032005@gmail.com",
      },
      index: 1,
    },
    {
      id: 3,
      name: "រ៉េត ចាន់រិទ្ធ",
      role: "សមាជិក",
      image: "/images/member/rith.jpg",
      description:
        "ខ្ញុំបាទជាសិស្សមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)ឆ្នាំទី៣ ផ្នែកវិស្វកមុ្មព័ត៌មានវិទ្យា",
      social: {
        facebook: "https://www.facebook.com/share/1BczthbPiZ/?mibextid=wwXIfr",
        telegram: "https://t.me/mechanrith",
        email: "mailto:rithc512@gmail.com",
      },
      index: 2,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideDelay = 2500;

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, slideDelay);

    return () => clearInterval(autoSlide);
  }, [members.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getCardClass = (index) => {
    const total = members.length;
    const current = currentIndex;

    if (index === current) return "card center";
    if (index === (current - 1 + total) % total) return "card left-1";
    if (index === (current - 2 + total) % total) return "card left-2";
    if (index === (current + 1) % total) return "card right-1";
    if (index === (current + 2) % total) return "card right-2";
    return "card";
  };

  return (
    <section className="team">
      <div className="container">
        <h2 className="text-center fw-bold">សមាជិកក្រុម</h2>
        <div className="carousel-container">
          <button className="nav-arrow left" onClick={handlePrev}>
            ‹
          </button>
          <div className="carousel-track">
            {members.map((member) => (
              <div
                key={member.id}
                className={getCardClass(member.index)}
                data-index={member.index}
              >
                <img src={member.image} alt={member.name} />
                <div className="overlay">
                  <h4 className="card-title name">{member.name}</h4>
                  <p className="card-text">{member.description}</p>
                  <div className="contact-social d-flex justify-content-center align-items-center">
                    <a
                      className="icon"
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a
                      className="icon mx-3"
                      href={member.social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-telegram"></i>
                    </a>
                    <a className="icon" href={member.social.email}>
                      <i className="bi bi-envelope-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="nav-arrow right" onClick={handleNext}>
            ›
          </button>
        </div>

        <div className="member-info">
          <h2 className="member-name">{members[currentIndex].name}</h2>
          <p className="member-role">{members[currentIndex].role}</p>
        </div>

        <div className="dots">
          {members.map((member) => (
            <div
              key={member.id}
              className={`dot ${currentIndex === member.index ? "active" : ""}`}
              data-index={member.index}
              onClick={() => handleDotClick(member.index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
