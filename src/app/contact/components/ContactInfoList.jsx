"use client";

import React from "react";

export default function ContactInfoList() {
  return (
    <ul className="list-unstyled">
      {/* Address */}
      <li className="py-2">
        <a
          href="https://www.google.com/maps/place/Russey+Keo-Phnom+Penh,+Phnom+Penh/..."
          className="contact-link text-decoration-none"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact-icon">
            <i className="bi bi-geo-alt"></i>
          </div>
          <div className="ps-3 mt-2">
            <h3 className="p-0 fs-5">អាស័យដ្ឋាន</h3>
            <p className="p-0">ផ្លូវលេខ210A សង្កាត់ទួកគក ខណ្ឌឬស្សីកែវ ភ្នំពេញ</p>
          </div>
        </a>
      </li>

      {/* Phone */}
      <li className="py-2">
        <a href="tel:+85586280862" className="contact-link text-decoration-none">
          <div className="contact-icon">
            <i className="bi bi-telephone"></i>
          </div>
          <div className="ps-3 mt-2">
            <h3 className="p-0 fs-5">ទូរស័ព្ទទំនាក់ទំនង</h3>
            <p className="p-0">+855 086 280 862</p>
          </div>
        </a>
      </li>

      {/* Email */}
      <li className="py-2">
        <a href="mailto:sengmenghorn82@gmail.com" className="contact-link text-decoration-none">
          <div className="contact-icon">
            <i className="bi bi-envelope"></i>
          </div>
          <div className="ps-3 mt-2">
            <h3 className="p-0 fs-5">អ៊ីម៉ែល</h3>
            <p className="p-0">sengmenghorn82@gmail.com</p>
          </div>
        </a>
      </li>

      {/* Working Hours */}
      <li className="py-2">
        <a href="#" className="contact-link text-decoration-none">
          <div className="contact-icon">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="ps-3 mt-2">
            <h3 className="p-0 fs-5">ម៉ោងធ្វើការ</h3>
            <p className="p-0">ថ្ងៃច័ន្ទ ដល់ សុក្រ ម៉ោង ៧:00 ដល់ ៥:00</p>
          </div>
        </a>
      </li>
    </ul>
  );
}
