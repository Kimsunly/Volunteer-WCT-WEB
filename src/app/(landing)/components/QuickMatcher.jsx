"use client";

import { useState } from "react";
import Link from "next/link";
import SafeDate from "@/components/common/SafeDate";

export default function QuickMatcher({ items = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  const categories = [
    { id: "all", label: "ទាំងអស់", icon: "bi-grid-fill" },
    { id: "education", label: "អប់រំ", icon: "bi-book-fill" },
    { id: "environment", label: "បរិស្ថាន", icon: "bi-tree-fill" },
    { id: "technology", label: "បច្ចេកវិទ្យា", icon: "bi-laptop" },
    { id: "healthcare", label: "សុខភាព", icon: "bi-heart-pulse-fill" },
  ];

  const locations = [
    { value: "all", label: "គ្រប់ទីតាំង" },
    { value: "ភ្នំពេញ", label: "ភ្នំពេញ" },
    { value: "កែប", label: "កែប" },
    { value: "កោះកុង", label: "កោះកុង" },
  ];

  // Filter items based on criteria
  const filtered = items.filter((item) => {
    const matchesCat =
      selectedCategory === "all" ||
      item.category?.label
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase()) ||
      item.category?.slug
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase()) ||
      item.category_label
        ?.toLowerCase()
        .includes(selectedCategory.toLowerCase()) ||
      (typeof item.category === "string" &&
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const itemLocation = item.location?.label || item.location || "";
    const matchesLoc =
      selectedLocation === "all" ||
      itemLocation.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesCat && matchesLoc;
  });

  // Recommend default ones if no search or no results
  const recommendations = items.slice(0, 3);

  return (
    <section className="quick-matcher-section py-5 position-relative">
      <div className="quick-matcher-bg-glow" />
      <div className="container">
        <div className="text-center mb-5">
          <span className="matcher-badge mb-2">ស្វែងរកកម្មវិធីស័ក្តិសម</span>
          <h2 className="section-title">ស្វែងរកឱកាសដែលត្រូវនឹងចិត្តអ្នក</h2>
          <p className="section-decript mt-2">
            ជ្រើសរើសវិស័យដែលអ្នកចង់ចូលរួម និងទីតាំង
            ដើម្បីស្វែងរកកម្មវិធីសមស្របបំផុតភ្លាមៗ
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Matcher Box */}
          <div className="col-12 col-lg-5">
            <div className="matcher-box-card">
              <div className="mb-4">
                <label className="matcher-label mb-3">
                  ១. ជ្រើសរើសវិស័យដែលអ្នកស្រឡាញ់
                </label>
                <div className="matcher-categories-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`matcher-cat-btn ${
                        selectedCategory === cat.id ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setHasSearched(true);
                      }}
                    >
                      <i className={`bi ${cat.icon} matcher-cat-icon`}></i>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="matcher-label mb-2">
                  ២. ជ្រើសរើសទីតាំងរបស់អ្នក
                </label>
                <select
                  className="form-select matcher-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setHasSearched(true);
                  }}
                >
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center pt-2">
                <Link
                  href={`/opportunities?category=${selectedCategory}&location=${selectedLocation}`}
                  className="matcher-search-btn"
                >
                  <i className="bi bi-search me-2"></i>ស្វែងរកលម្អិតបន្ថែម
                </Link>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="col-12 col-lg-7">
            <div className="matcher-results-panel">
              <h4 className="results-header mb-4">
                {hasSearched ? (
                  <>
                    <i className="bi bi-stars text-warning me-2 animate-pulse"></i>
                    លទ្ធផលស្វែងរក ({filtered.length})
                  </>
                ) : (
                  <>
                    <i className="bi bi-lightning-charge-fill text-accent me-2"></i>
                    កម្មវិធីដែលណែនាំសម្រាប់អ្នក
                  </>
                )}
              </h4>

              <div className="results-list d-flex flex-column gap-3">
                {(hasSearched ? filtered.slice(0, 3) : recommendations).map(
                  (item) => (
                    <div key={item.id} className="matcher-result-item">
                      <div className="result-item-img-wrap">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="result-item-img"
                        />
                      </div>
                      <div className="result-item-content">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="result-badge-cat">
                            {item.category?.label ||
                              item.category ||
                              "ស្ម័គ្រចិត្ត"}
                          </span>
                          <span className="result-badge-loc">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            {item.location?.label || item.location || "TBD"}
                          </span>
                        </div>
                        <h5 className="result-item-title mb-2">{item.title}</h5>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="result-item-date">
                            <i className="bi bi-calendar-event me-2 text-muted"></i>
                            {item.date || (
                              <SafeDate dateString={item.start_date} />
                            )}
                          </div>
                          <Link
                            href={`/opportunities/${item.id}`}
                            className="result-apply-btn"
                          >
                            ចូលរួម <i className="bi bi-arrow-right ms-1"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                )}

                {hasSearched && filtered.length === 0 && (
                  <div className="matcher-no-results text-center py-5">
                    <div className="no-results-icon-wrap mb-3">
                      <i className="bi bi-search-heart"></i>
                    </div>
                    <h5>មិនមានកម្មវិធីដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ</h5>
                    <p className="text-muted small mb-4">
                      សាកល្បងប្តូរវិស័យ ឬទីតាំង ឬមើលកម្មវិធីសកម្មផ្សេងទៀតរបស់យើង
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedLocation("all");
                        }}
                      >
                        សម្អាតតម្រង
                      </button>
                      <Link
                        href="/opportunities"
                        className="btn btn-sm btn-primary rounded-pill px-3"
                      >
                        មើលកម្មវិធីទាំងអស់
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
