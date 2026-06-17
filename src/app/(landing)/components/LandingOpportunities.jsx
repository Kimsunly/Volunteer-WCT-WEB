"use client";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import OpportunityCard from "@/components/cards/OpportunityCard";
import { listCategories } from "@/services/categories";

export default function LandingOpportunities({ items = [] }) {
  const [active, setActive] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await listCategories(true);
        setCategories(data || []);
      } catch (e) {
        console.error(" iled to fetch categories", e);
      }
    }
    fetchCategories();
  }, []);

  const filters = useMemo(() => {
    const baseFilters = [{ key: "all", label: "ទាំងអស់", icon: "bi-stars" }];
    const dynamicFilters = Array.isArray(categories) ? categories.map(cat => ({
      key: cat.name.toLowerCase(),
      label: cat.name,
      icon: cat.icon || "bi-tag"
    })) : [];
    return [...baseFilters, ...dynamicFilters];
  }, [categories]);

  const filtered = useMemo(
    () =>
      active === "all" ? items : items.filter((i) => {
        const catName = i.category?.label || i.category?.name || i.category;
        return catName?.toLowerCase() === active;
      }),
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
