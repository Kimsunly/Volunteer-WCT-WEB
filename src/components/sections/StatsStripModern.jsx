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
    <section className="state-area position-relative py-5">
      {/* Decorative background blur lights */}
      <div className="achievements-blur-bg">
        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
      </div>

      <div className="container position-relative">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ color: "var(--color-text-primary)" }} data-aos="fade-up">
            ផលប៉ះពាល់របស់យើង
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }} data-aos="fade-up" data-aos-delay="100">
            តួលេខដែលនិយាយពីការប្តេជ្ញាចិត្តរបស់យើង
          </p>
        </div>
        <div className="row gy-4">
          {targets.map((t, i) => (
            <div
              key={i}
              className="col-12 col-sm-6 col-lg-3"
              data-aos="zoom-in"
              data-aos-delay={i * 100}
            >
              <div className="stat-card-modern-redesigned" ref={refs[i]}>
                <div className={`stat-icon-wrap stat-icon-color-${i} mb-4`}>
                  <i className={`bi ${icons[i]}`} />
                </div>
                <h3 className="stat-number mb-2">
                  {values[i]}+
                </h3>
                <p className="stat-label mb-0">{labels[i]}</p>
                <div className="w-100 mt-4" style={{ height: 6, background: 'var(--color-bg-input)', borderRadius: 10, overflow: 'hidden' }}>
                  <div
                    className="h-100"
                    style={{
                      width: `${[85, 70, 60, 90][i]}%`,
                      borderRadius: 10,
                      background: i === 0 ? "#00D2B2" : i === 1 ? "#10B981" : i === 2 ? "#F59E0B" : "#EF4444",
                      boxShadow: `0 0 8px ${i === 0 ? "#00D2B2" : i === 1 ? "#10B981" : i === 2 ? "#F59E0B" : "#EF4444"}`
                    }}
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
