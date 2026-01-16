"use client";
import { useState, useEffect, useMemo } from "react";
import OpportunityCard from "@/components/cards/OpportunityCard";
import AOSInit from "@/components/common/AOSInit";


import { listOpportunities } from "@/services/opportunities";
import Skeleton from "@/components/common/Skeleton";

const CATEGORY_TABS = [
  { slug: "all", label: "ទាំងអស់", icon: "/logos/logo.png" },
  {
    slug: "wildlife",
    label: "ជម្រកសត្វព្រៃ",
    icon: "/images/opportunities/Categories/wildlife.png",
  },
  {
    slug: "education",
    label: "ការអប់រំ",
    icon: "/images/opportunities/Categories/teaching.png",
  },
  {
    slug: "childcare",
    label: "មើលថែកុមារ",
    icon: "/images/opportunities/Categories/childcare.png",
  },
  {
    slug: "environment",
    label: "បរិស្ថាន",
    icon: "/images/opportunities/Categories/environment.png",
  },
  {
    slug: "agriculture",
    label: "កសិកម្ម",
    icon: "/images/opportunities/Categories/agriculture.png",
  },
  {
    slug: "event",
    label: "រៀបចំព្រឹត្តការណ៍",
    icon: "/images/opportunities/Categories/event.png",
  },
  {
    slug: "health",
    label: "សុខភាព",
    icon: "/images/opportunities/Categories/img-1.png",
  },
];

const LOCATIONS = [
  { slug: "all", label: "គ្រប់កន្លែងទាំងអស់" },
  { slug: "phnom-penh", label: "ភ្នំពេញ" },
  { slug: "siem-reap", label: "សៀមរាប" },
  { slug: "kampot", label: "កំពត" },
  { slug: "kep", label: "កែប" },
  { slug: "koh-kong", label: "កោះកុង" },
  { slug: "kandal", label: "កណ្តាល" },
  { slug: "prey-veng", label: "ព្រៃវែង" },
  { slug: "ratanakiri", label: "រតនៈគិរី" },
  { slug: "mondulkiri", label: "មណ្ឌលគិរី" },
  { slug: "steung-treng", label: "ស្ទឹងត្រែង" },
  { slug: "kratié", label: "ក្រចេះ" },
  { slug: "pursat", label: "ពោធិ៍សាត់" },
];

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGoTop, setShowGoTop] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const data = await listOpportunities({
        q: searchTerm,
        category: selectedCategory,
        page,
        pageSize,
      });

      // Ensure data is in the expected shape for cards
      // The backend response for /api/opportunities? is often OpportunityListResponse
      const items = data.data || data.items || [];
      const transformedItems = items.map(item => ({
        ...item,
        id: String(item.id),
        // Map backend fields to frontend expectations if they differ
        category: { slug: item.category_slug || 'all', label: item.category_label || item.category },
        location: { slug: item.location_slug || 'all', label: item.location_label || item.location },
        images: item.images ? (typeof item.images === 'string' ? item.images.split(',') : item.images) : [],
        date: item.date_range ? new Date(item.date_range).toLocaleDateString() : 'TBD',
        time: item.time_range || 'TBD',
        benefits: {
          transport: item.transport,
          housing: item.housing,
          meals: item.meals,
        },
        detailHref: `/opportunities/${item.id}`,
        applyHref: "/volunteer-apply", // Assuming this is the path
      }));

      setOpportunities(transformedItems);
      setTotal(data.total || 0);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, selectedLocation, searchTerm, page]);

  useEffect(() => {
    const onScroll = () => setShowGoTop(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFavorite = (id, isFav) => {
    setOpportunities(prev =>
      prev.map(o => o.id === id ? { ...o, isFavorite: isFav } : o)
    );
  };

  return (
    <>
      <AOSInit />
      <main className="flex-grow-1">
        <section
          className="opportunity py-4 pt-5"
          style={{ marginTop: "120px" }}
        >
          <div className="container">
            {/* Search + Select filters */}
            <div
              className="opportunity-search-filter mb-4"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <div className="row">
                <div className="col-12 col-lg-7">
                  <div className="opportunity-search">
                    <input
                      type="text"
                      placeholder="ស្វែងរកការងារស្ម័គ្រចិត្ត..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                    />
                    <button className="search-btn" onClick={() => { setPage(1); fetchOpportunities(); }}>ស្វែងរក</button>
                  </div>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="opportunity-filters row pt-3 pt-lg-0">
                    <select
                      id="categoryFilter"
                      className="filter-category col-4 col-md-5 ms-md-3 mx-md-4 mx-4 shadow-sm"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setPage(1);
                      }}
                    >
                      {CATEGORY_TABS.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <select
                      id="locationFilter"
                      className="filter-location col-4 col-md-5 me-0 shadow-sm"
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setPage(1);
                      }}
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l.slug} value={l.slug}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Category icon tabs */}
            <div className="category-icons">
              <div className="tab mb-3">
                <div className="col-12 col-lg-10 d-flex flex-wrap gap-3">
                  {CATEGORY_TABS.map((cat, idx) => (
                    <button
                      key={cat.slug}
                      className={`tablinks ${selectedCategory === cat.slug ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                      }}
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={`${(idx + 1) * 100}`}
                    >
                      <div className="category-icons_item">
                        <img src={cat.icon} alt={cat.label} />
                        <span>{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="opportunities-card-list">
              <div className="row g-4">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="col-12 col-md-6 col-lg-4">
                      <Skeleton variant="card" />
                    </div>
                  ))
                ) : error ? (
                  <div className="col-12 text-center text-danger p-5">
                    <i className="bi bi-exclamation-triangle fs-1"></i>
                    <p className="mt-3 fs-5">{error}</p>
                    <button className="btn btn-outline-primary mt-2" onClick={fetchOpportunities}>ព្យាយាមម្តងទៀត</button>
                  </div>
                ) : opportunities.length > 0 ? (
                  opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      data={opportunity}
                      onToggleFavorite={handleFavorite}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center text-muted p-5">
                    <i className="bi bi-search fs-1"></i>
                    <p className="mt-3 fs-5">
                      មិនមានលទ្ធផល — សូមសាកល្បងតម្រងផ្សេង
                      ឬពិនិត្យម្តងទៀតពេលក្រោយ។
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination if needed */}
            {!loading && total > pageSize && (
              <div className="d-flex justify-content-center mt-5">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>ថយក្រោយ</button>
                    </li>
                    <li className="page-item disabled"><span className="page-link">{page} / {Math.ceil(total / pageSize)}</span></li>
                    <li className={`page-item ${page >= Math.ceil(total / pageSize) ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(p => p + 1)}>បន្ទាប់</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* Go-top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          id="go-top"
          title="Go to top"
          className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
          style={{
            zIndex: 99,
            width: 50,
            height: 50,
            display: showGoTop ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="bi bi-arrow-up-short fs-5"></i>
        </button>
      </main>
    </>
  );
}
