"use client";
import { useEffect, useRef, useState } from "react";

function useCounter(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let cur = 0;
    let raf = requestAnimationFrame(function tick() {
      cur += step;
      if (cur < target) {
        setVal(Math.floor(cur));
        raf = requestAnimationFrame(tick);
      } else setVal(target);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return val;
}

export default function StatsStripModern() {
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [inView, setInView] = useState([false, false, false, false]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.idx);
          if (entry.isIntersecting) {
            setInView((prev) => prev.map((v, i) => (i === idx ? true : v)));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    refs.forEach((r, i) => {
      if (r.current) {
        r.current.dataset.idx = i;
        io.observe(r.current);
      }
    });
    return () => io.disconnect();
  }, []);

  const targets = [650, 990, 300, 125];
  const labels = [
    "ចំនួនអ្នកស្ម័គ្រចិត្ត",
    "ចំនួនដើមឈើបានដាំ",
    "ក្មេងទទួលការអប់រំ",
    "កម្មវិធីបានរៀបចំ",
  ];
  const colors = ["bg-primary", "bg-success", "bg-warning", "bg-danger"];
  const icons = [
    "bi-people-fill",
    "bi-tree-fill",
    "bi-book-fill",
    "bi-calendar-check-fill",
  ];
  const values = targets.map((t, i) => useCounter(t, inView[i]));

  return (
    <section className="state-area position-relative">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-white fw-bold mb-3" data-aos="fade-up">
            ផលប៉ះពាល់របស់យើង
          </h2>
          <p className="text-white-50" data-aos="fade-up" data-aos-delay="100">
            តួលេខដែលនិយាយពីការប្តេជ្ញាចិត្តរបស់យើង
          </p>
        </div>
        <div className="row gy-4">
          {targets.map((t, i) => (
            <div
              key={i}
              className="col-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay={i * 100}
            >
              <div className="stat-card-modern" ref={refs[i]}>
                <div className="stat-icon mb-3">
                  <i className={`bi ${icons[i]}`} />
                </div>
                <h3 className="display-4 fw-bold mb-0 text-white">
                  {values[i]}+
                </h3>
                <p className="card-text fs-5 text-white-50 mb-0">{labels[i]}</p>
                <div className="progress mt-3" style={{ height: 4 }}>
                  <div
                    className={`progress-bar ${colors[i]}`}
                    style={{ width: `${[85, 70, 60, 90][i]}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
