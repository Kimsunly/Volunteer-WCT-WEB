"use client";
import EventCard from "@/components/cards/EventCard";

const defaultEvents = [
  {
    id: "ev1",
    dateDay: "០៥",
    dateMonth: "តុលា",
    imageUrl: "/images/opportunities/Environment/card-2/img-6.png",
    category: {
      label: "បរិស្ថាន",
      icon: "bi bi-tree-fill",
      colorClass: "bg-success",
    },
    title: "ការសម្អាតឆ្នេរ",
    description:
      "ចូលរួមជាមួយយើងក្នុងការសម្អាតឆ្នេរ ដើម្បីរក្សាអនាម័យឆ្នេរសមុទ្ររបស់យើង",
    location: "ខេត្តកោះកុង",
    timeRange: "៧:៣០ - ១១:៣០",
    href: "/auth/login",
  },
  {
    id: "ev2",
    dateDay: "១៦",
    dateMonth: "តុលា",
    imageUrl: "/images/opportunities/Childcare/card-4/img-3.png",
    category: {
      label: "កុមារ",
      icon: "bi bi-heart-fill",
      colorClass: "bg-warning",
    },
    title: "ការមើលថែទាំកុមារ",
    description: "ចូលរួមជួយមើលថែទាំកុមារ និងផ្តល់ការអប់រំដល់ពួកគេ",
    location: "ភ្នំពេញ",
    timeRange: "៨:០០ - ១២:००",
    href: "/auth/login",
  },
  {
    id: "ev3",
    dateDay: "២១",
    dateMonth: "តុលា",
    imageUrl: "/images/opportunities/Environment/card-11/img-1.png",
    category: {
      label: "អប់រំ",
      icon: "bi bi-book-fill",
      colorClass: "bg-primary",
    },
    title: "វគ្គសិក្សាបរិស្ថាន",
    description: "រៀនអំពីការថែរក្សាបរិស្ថាន និងវិធីការពារធម្មជាតិ",
    location: "ខេត្តសៀមរាប",
    timeRange: "៩:००ー១६:००",
    href: "/auth/login",
  },
  {
    id: "ev4",
    dateDay: "០២",
    dateMonth: "វិច្ឆកា",
    imageUrl: "/images/opportunities/Environment/card-11/img-2.png",
    category: {
      label: "បរិស្ថាន",
      icon: "bi bi-tree-fill",
      colorClass: "bg-success",
    },
    title: "ដាំឈើជាសហគមន៍",
    description: "ចូលរួមដាំដើមឈើជាមួយសហគមន៍ ដើម្បីបង្កើតបរិយាកាសបៃតង",
    location: "ខេត្តកំពង់ធំ",
    timeRange: "៦:៣០ - ១០:៣០",
    href: "/auth/login",
  },
];

export default function UpcomingEvents({ items = [] }) {
  const list = items.length ? items : defaultEvents;

  return (
    <section className="upcoming-modern position-relative">
      <div className="upcoming-bg-pattern" />
      <div className="container position-relative">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="upcoming-badge">
            <i className="bi bi-calendar-event me-2" />
            ព្រឹត្តិការណ៍ខាងមុខ
          </span>
          <h2 className="upcoming-title mt-3 mb-3">
            ព្រឹត្តិការណ៏មកដល់ឆាប់ៗនេះ
          </h2>
          <p className="upcoming-subtitle mx-auto">
            ព្រឹត្តិការណ៍ដ៏ពិសេស នឹងត្រូវប្រព្រឹត្តឡើងនៅពេលឆាប់ៗខាងមុខនេះ
            ផ្តល់បទពិសោធន៍ថ្មីៗ និងឱកាសក្នុងការបង្កើតទំនាក់ទំនងថ្មីៗ
          </p>
        </div>
        <div className="row g-4">
          {list.map((e) => (
            <div key={e.id} className="col-md-6 col-lg-3" data-aos="zoom-in">
              <EventCard data={e} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
