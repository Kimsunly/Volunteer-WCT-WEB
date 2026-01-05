"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    text: "ការចូលរួមជាស្ម័គ្រចិត្តក្នុងវិស័យអប់រំនេះ បានផ្តល់ឱកាសដ៏អស្ចារ្យមួយឱ្យខ្ញុំ។ ពេលដែលឃើញកូនក្មេងមានមុខញញឹម ពេលពួកគេចាប់ផ្តើមយល់ដឹងពីអ្វីដែលខ្ញុំបានបង្រៀន នោះជាការទទួលបានដែលមានតម្លៃជាងអ្វីៗទាំងអស់។",
    name: "លី គឹមស៊ុន",
    role: "អ្នកស្ម័គ្រចិត្តការអប់រំ",
    avatar: "/images/homepage/testimonial_01.jpg",
  },
  {
    text: "ការចូលរួមជាស្ម័គ្រចិត្តក្នុងសហគមន៍ ធ្វើឱ្យខ្ញុំបានយល់ច្បាស់ថា ការប្រព្រឹត្តិការណ៍តូចៗអាចបង្កើតការផ្លាស់ប្តូរដ៏ធំមួយសម្រាប់សង្គម។ វាបង្កើតទំនាក់ទំនង និងភាពជាអ្នកមួយគ្នាដ៏រឹងមាំ។",
    name: "ចន្ទ មុនី",
    role: "អ្នកស្ម័គ្រចិត្តសហគមន៍",
    avatar: "/images/homepage/testimonial_02.jpg",
  },
  {
    text: "ការចូលរួមក្នុងសកម្មភាពស្ម័គ្រចិត្តសម្រាប់បរិស្ថាន ធ្វើឱ្យខ្ញុំមានអារម្មណ៍ថា ខ្ញុំកំពុងចូលរួមការពារពិភពលោកសម្រាប់ជំនាន់ក្រោយ។ វាបង្រៀនឱ្យខ្ញុំស្រឡាញ់ធម្មជាតិ និងទទួលខុសត្រូវចំពោះសង្គម។",
    name: "ចាន់ ចំរើន",
    role: "អ្នកស្ម័គ្រចិត្តថែររក្សាបរិស្ថាន",
    avatar: "/images/homepage/testimonial_03.jpg",
  },
  {
    text: "ការចូលរួមជាស្ម័គ្រចិត្តក្នុងព្រឹត្តិការណ៍ធ្វើឱ្យខ្ញុំទទួលបានបទពិសោធន៍ថ្មីៗជាច្រើន។ ខ្ញុំបានរៀនពីភាពជាអ្នកដឹកនាំ ការសហការណ៍ និងការដោះស្រាយបញ្ហា។ វាជាបទពិសោធន៍ដែលខ្ញុំមិនអាចភ្លេចបានឡើយ។",
    name: "កែវ សុជាតា",
    role: "អ្នកស្ម័គ្រចិត្តរៀបចំព្រឹត្តិការណ៍",
    avatar: "/images/homepage/testimonial_04.jpg",
  },
  {
    text: "ការចូលរួមជាស្ម័គ្រចិត្តក្នុងការបរិច្ចាគ ធ្វើឲ្យខ្ញុំបានជួបប្រទះជាមួយមនុស្សជាច្រើន។ ពេលវេលាតិចតួចរបស់ខ្ញុំមានតម្លៃជាងគេ។ វាបានបង្រៀនឲ្យខ្ញុំមានចិត្តមេត្តា និងស្រឡាញ់អ្នកនៅជុំវិញខ្លួន។",
    name: "ផល សុភា",
    role: "អ្នកស្ម័គ្រចិត្តបរិច្ចាគ",
    avatar: "/images/homepage/testimonial_05.jpg",
  },
];

export default function TestimonialsSlider() {
  return (
    <section className="testimonials-modern position-relative">
      <div className="testimonial-bg">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
      </div>

      <div className="container position-relative">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="testimonial-badge">
            <i className="bi bi-chat-heart-fill me-2" />
            មតិយោបល់
          </span>
          <h2 className="testimonial-title mt-3 mb-3">មតិយោបល់របស់អ្នកស្ម័គ្រចិត្ត</h2>
          <p className="testimonial-subtitle mx-auto">
            ការចូលរួមស្ម័គ្រចិត្តមិនមែនជាការផ្លាស់ប្តូរដល់សហគមន៍តែប៉ុណ្ណោះទេ ប៉ុន្តែវាជាភាពជោគជ័យផ្លូវចិត្តសម្រាប់អ្នកផងដែរ
          </p>
        </div>

        <div className="testimonial-slider-wrapper" data-aos="fade-up" data-aos-delay="200">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="testimonial-card-modern">
                  <div className="quote-icon">
                    <i className="bi bi-quote" />
                  </div>
                  <div className="testimonial-content-wrapper">
                    <p className="testimonial-text">{t.text}</p>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill" />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <img src={t.avatar} alt={t.name} className="author-avatar" />
                    <div className="author-info">
                      <h4 className="author-name">{t.name}</h4>
                      <p className="author-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}