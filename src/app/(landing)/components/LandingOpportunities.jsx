"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import OpportunityCard from "@/components/cards/OpportunityCard";

const filters = [
  { key: "all", label: "ទាំងអស់", icon: "bi-stars" },
  { key: "education", label: "អប់រំ", icon: "bi-book" },
  { key: "environment", label: "បរិស្ថាន", icon: "bi-tree" },
  { key: "community", label: "សហគមន៍", icon: "bi-people" },
  { key: "event", label: "ព្រឹត្តិការណ៍", icon: "bi-calendar-event" },
];

export default function LandingOpportunities({ items = [] }) {
  const [active, setActive] = useState("all");
  const filtered = useMemo(
    () =>
      active === "all" ? items : items.filter((i) => i.category === active),
    [active, items]
  );

  return (
    <section className="opportunities-area">
      <div className="container">
        <div className="section-header mb-4" data-aos="fade-up">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="section-title-wrapper">
              <h2 className="text-start my-5">ឱកាសស្ម័គ្រចិត្ត</h2>
              <p className="text-start mb-0 text-muted">
                ស្វែងរកឱកាសដែលត្រូវនឹងចំណាប់អារម្មណ៍របស់អ្នក
              </p>
            </div>
            <div className="section-actions d-flex gap-2">
              <Link href="/opportunities" className="btn btn-outline-primary">
                <i className="bi bi-grid-3x3-gap me-2" /> មើលទាំងអស់
              </Link>
            </div>
          </div>
        </div>

        <div
          className="filter-pills mb-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="d-flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`btn btn-sm ${active === f.key ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setActive(f.key)}
              >
                <i className={`bi ${f.icon} me-1`} /> {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="row mt-2 gy-4">
          {filtered.map((item, idx) => (
            <OpportunityCard
              key={item.id || idx}
              data={item}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
