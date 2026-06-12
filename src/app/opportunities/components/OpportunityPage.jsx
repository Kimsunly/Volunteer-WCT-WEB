"use client";
import { useState, useEffect, useCallback } from "react";
import OpportunityCard from "@/components/cards/OpportunityCard";
import AOSInit from "@/components/common/AOSInit";

import { listOpportunities } from "@/services/opportunities";
import { listCategories } from "@/services/categories";
import Skeleton from "@/components/common/Skeleton";

const ALL_TAB = { id: "all", name: "ទាំងអស់", slug: "all", icon: "bi bi-grid", color: "#6c757d" };

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
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGoTop, setShowGoTop] = useState(false);

  // Dynamic categories from API
  const [categoryTabs, setCategoryTabs] = useState([ALL_TAB]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Advanced Filters
  const DEFAULT_ADV_FILTER = {
    duration: "all",
    commitments: [],
    skills: [],
    organizer: "all",
    deadline: null,
    benefits: [],
  };

  const [advFilter, setAdvFilter] = useState(DEFAULT_ADV_FILTER);
  const [tempFilter, setTempFilter] = useState(DEFAULT_ADV_FILTER);
  const [showAdvFilter, setShowAdvFilter] = useState(false);
  const [organizers, setOrganizers] = useState([]);

  // Fetch categories from API on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await listCategories(true);
        const tabs = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
          icon: cat.icon || "bi bi-tag",
          color: cat.color || "#5BC0DE",
          image: null,
        }));
        setCategoryTabs([ALL_TAB, ...tabs]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listOpportunities({
        q: searchTerm,
        category: selectedCategory,
        location: selectedLocation,
        page: 1, // Fetch bulk list of first page
        pageSize: 100, // Fetch up to 100 items to enable robust client-side filters
      });

      // Ensure data is in the expected shape for cards
      const items = data.data || data.items || [];
      const transformedItems = items.map(item => {
        const catName = item.category?.name || item.category_label || (typeof item.category === 'string' ? item.category : '');
        const locName = item.location_label || item.logistic?.location_label || (typeof item.location === 'string' ? item.location : '');
        return {
          ...item,
          id: String(item.id),
          is_private: item.is_private || item.visibility === 'private',
          category: {
            slug: catName ? catName.toLowerCase().replace(/\s+/g, '-') : 'all',
            label: catName || 'ផ្សេងៗ'
          },
          location: {
            slug: locName ? locName.toLowerCase().replace(/\s+/g, '-') : 'all',
            label: locName || 'TBD'
          },
          images: item.details?.images_json || (item.images ? (typeof item.images === 'string' ? item.images.split(',') : item.images) : []),
          date: item.logistic?.start_date ? new Date(item.logistic.start_date).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' }) : 'TBD',
          time: item.logistic?.time_range || 'TBD',
          transport: item.logistic?.transport,
          housing: item.logistic?.housing,
          meals: item.logistic?.meals || item.logistic?.meal,
          detailHref: `/opportunities/${item.id}`,
          applyHref: `/opportunities/${item.id}/apply`,
        };
      });

      setAllOpportunities(transformedItems);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("បរាជ័យក្នុងការទាញយកទិន្នន័យ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLocation, searchTerm]);

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, selectedLocation, searchTerm, fetchOpportunities]);

  const getFilteredOpportunities = useCallback((items) => {
    return items.filter((item) => {
      // 1. Duration (រយះពេល)
      if (advFilter.duration && advFilter.duration !== "all") {
        const start = item.logistic?.start_date ? new Date(item.logistic.start_date) : null;
        const end = item.logistic?.end_date ? new Date(item.logistic.end_date) : null;
        if (start && end) {
          const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
          if (advFilter.duration === "short" && diffDays > 3) return false;
          if (advFilter.duration === "medium" && (diffDays < 4 || diffDays > 30)) return false;
          if (advFilter.duration === "long" && diffDays <= 30) return false;
        } else {
          return false;
        }
      }

      // 2. Commitment Types (ប្រភេទការប្តេជ្ញាចិត្ត)
      if (advFilter.commitments && advFilter.commitments.length > 0) {
        const timeRangeStr = (item.logistic?.time_range || "").toLowerCase();
        const descStr = (item.description || "").toLowerCase();
        const titleStr = (item.title || "").toLowerCase();
        
        const matchesType = advFilter.commitments.some((type) => {
          if (type === "part-time") {
            return (
              timeRangeStr.includes("part-time") ||
              timeRangeStr.includes("ក្រៅម៉ោង") ||
              timeRangeStr.includes("7:30") ||
              timeRangeStr.includes("11:30") ||
              timeRangeStr.includes("1:00") ||
              timeRangeStr.includes("5:00") ||
              descStr.includes("ក្រៅម៉ោង") ||
              titleStr.includes("ក្រៅម៉ោង")
            );
          }
          if (type === "full-time") {
            return (
              timeRangeStr.includes("full-time") ||
              timeRangeStr.includes("ពេញម៉ោង") ||
              timeRangeStr.includes("8:00") ||
              timeRangeStr.includes("5:00") ||
              descStr.includes("ពេញម៉ោង") ||
              titleStr.includes("ពេញម៉ោង")
            );
          }
          if (type === "weekend") {
            return (
              timeRangeStr.includes("weekend") ||
              timeRangeStr.includes("ចុងសប្តាហ៍") ||
              timeRangeStr.includes("សៅរ៍") ||
              timeRangeStr.includes("អាទិត្យ") ||
              descStr.includes("ចុងសប្តាហ៍") ||
              descStr.includes("សៅរ៍") ||
              descStr.includes("អាទិត្យ")
            );
          }
          return false;
        });
        if (!matchesType) return false;
      }

      // 3. Required Skills (តម្រូវការជំនាញ)
      if (advFilter.skills && advFilter.skills.length > 0) {
        const skillsList = Array.isArray(item.details?.skills_json)
          ? item.details.skills_json
          : typeof item.details?.skills_json === "string"
            ? (() => { try { return JSON.parse(item.details.skills_json); } catch { return []; } })()
            : [];
        const skillsText = skillsList.map(s => s.toLowerCase()).join(" ");
        const descText = (item.description || "").toLowerCase();
        const titleText = (item.title || "").toLowerCase();

        const matchesSkill = advFilter.skills.some((skill) => {
          if (skill === "teaching") {
            return skillsText.includes("បង្រៀន") || skillsText.includes("teach") || skillsText.includes("educat") || descText.includes("បង្រៀន") || titleText.includes("បង្រៀន");
          }
          if (skill === "agriculture") {
            return skillsText.includes("កសិកម្ម") || skillsText.includes("agricultur") || skillsText.includes("ដាំ") || descText.includes("កសិកម្ម") || descText.includes("ដាំ") || titleText.includes("កសិកម្ម");
          }
          if (skill === "it") {
            return skillsText.includes("it") || skillsText.includes("technology") || skillsText.includes("កុំព្យូទ័រ") || skillsText.includes("computer") || descText.includes("កុំព្យូទ័រ") || titleText.includes("កុំព្យូទ័រ");
          }
          if (skill === "medical") {
            return skillsText.includes("ពេទ្យ") || skillsText.includes("medical") || skillsText.includes("health") || descText.includes("ពេទ្យ") || descText.includes("សុខភាព") || titleText.includes("ពេទ្យ");
          }
          if (skill === "translation") {
            return skillsText.includes("បកប្រែ") || skillsText.includes("translat") || skillsText.includes("languag") || descText.includes("បកប្រែ") || titleText.includes("បកប្រែ");
          }
          if (skill === "event") {
            return skillsText.includes("ព្រឹត្តិការណ៍") || skillsText.includes("event") || skillsText.includes("រៀបចំ") || descText.includes("ព្រឹត្តិការណ៍") || titleText.includes("ព្រឹត្តិការណ៍");
          }
          return false;
        });
        if (!matchesSkill) return false;
      }

      // 4. Organizer (ក្រុមការងារស្ម័គ្រចិត្ត)
      if (advFilter.organizer && advFilter.organizer !== "all") {
        const orgName = item.organization_name || item.creator?.name || item.createdByAdmin?.name || "";
        if (orgName.toLowerCase() !== advFilter.organizer.toLowerCase()) return false;
      }

      // 5. Deadline (ថ្ងៃផុតកំណត់)
      if (advFilter.deadline) {
        const start = item.logistic?.start_date ? new Date(item.logistic.start_date) : null;
        const selected = new Date(advFilter.deadline);
        if (start && start > selected) return false;
      }

      // 6. Benefits (អត្ថប្រយោជន៍)
      if (advFilter.benefits && advFilter.benefits.length > 0) {
        const hasBenefits = advFilter.benefits.every((benefit) => {
          if (benefit === "housing") {
            const val = (item.logistic?.housing || "").toLowerCase();
            return val && val !== "none" && val !== "no" && val !== "—" && !val.includes("មិនមាន");
          }
          if (benefit === "meals") {
            const val = (item.logistic?.meals || item.logistic?.meal || "").toLowerCase();
            return val && val !== "none" && val !== "no" && val !== "—" && !val.includes("មិនមាន");
          }
          if (benefit === "transport") {
            const val = (item.logistic?.transport || "").toLowerCase();
            return val && val !== "none" && val !== "no" && val !== "—" && !val.includes("មិនមាន");
          }
          if (benefit === "certificate") {
            const desc = (item.description || "").toLowerCase();
            const detailsText = JSON.stringify(item.details || "").toLowerCase();
            return desc.includes("វិញ្ញាបនបត្រ") || desc.includes("certificate") || detailsText.includes("វិញ្ញាបនបត្រ") || detailsText.includes("certificate");
          }
          if (benefit === "insurance") {
            const desc = (item.description || "").toLowerCase();
            const detailsText = JSON.stringify(item.details || "").toLowerCase();
            return desc.includes("ធានារ៉ាប់រង") || desc.includes("insurance") || detailsText.includes("ធានារ៉ាប់រង") || detailsText.includes("insurance");
          }
          return false;
        });
        if (!hasBenefits) return false;
      }

      return true;
    });
  }, [advFilter]);

  useEffect(() => {
    const filtered = getFilteredOpportunities(allOpportunities);
    setFilteredOpportunities(filtered);
    setPage(1);
  }, [allOpportunities, advFilter, getFilteredOpportunities]);

  useEffect(() => {
    if (allOpportunities && allOpportunities.length > 0) {
      const orgSet = new Set();
      allOpportunities.forEach((item) => {
        const name = item.organization_name || item.creator?.name || item.createdByAdmin?.name;
        if (name) orgSet.add(name);
      });
      setOrganizers(Array.from(orgSet));
    }
  }, [allOpportunities]);

  // Sync tempFilter when opening modal
  useEffect(() => {
    if (showAdvFilter) {
      setTempFilter(advFilter);
    }
  }, [showAdvFilter, advFilter]);

  const handleCheckboxChange = (field, value, checked) => {
    setTempFilter((prev) => {
      const list = prev[field] || [];
      const updated = checked
        ? [...list, value]
        : list.filter((item) => item !== value);
      return { ...prev, [field]: updated };
    });
  };

  const applyAdvFilters = () => {
    setAdvFilter(tempFilter);
    setShowAdvFilter(false);
  };

  const resetAdvFilters = () => {
    setTempFilter(DEFAULT_ADV_FILTER);
    setAdvFilter(DEFAULT_ADV_FILTER);
    setShowAdvFilter(false);
  };

  const handleFavorite = (id, isFav) => {
    setAllOpportunities(prev =>
      prev.map(o => o.id === id ? { ...o, isFavorite: isFav } : o)
    );
  };

  useEffect(() => {
    const onScroll = () => setShowGoTop(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const paginatedOpportunities = filteredOpportunities.slice((page - 1) * pageSize, page * pageSize);

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
                  <div className="opportunity-filters row pt-3 pt-lg-0 g-2 align-items-center">
                    <div className="col-4 col-md-4">
                      <select
                        id="categoryFilter"
                        className="filter-category shadow-sm w-100"
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setPage(1);
                        }}
                      >
                        {categoryTabs.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4 col-md-4">
                      <select
                        id="locationFilter"
                        className="filter-location shadow-sm w-100"
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
                    <div className="col-4 col-md-4">
                      <button
                        id="advancedFilterBtn"
                        type="button"
                        className="btn-filter-toggle shadow-sm w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => setShowAdvFilter(true)}
                      >
                        <i className="bi bi-sliders"></i> Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category icon tabs */}
            <div className="category-icons">
              <div className="tab mb-3">
                <div className="col-12 col-lg-10 d-flex flex-wrap gap-3">
                  {categoryTabs.map((cat, idx) => (
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
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} />
                        ) : (
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              background: `${cat.color}20`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                              color: cat.color,
                              margin: "0 auto",
                            }}
                          >
                            <i className={cat.icon} />
                          </div>
                        )}
                        <span>{cat.name}</span>
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
                ) : paginatedOpportunities.length > 0 ? (
                  paginatedOpportunities.map((opportunity) => (
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

            {/* Pagination */}
            {!loading && filteredOpportunities.length > pageSize && (
              <div className="d-flex justify-content-center mt-5">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>ថយក្រោយ</button>
                    </li>
                    <li className="page-item disabled"><span className="page-link">{page} / {Math.ceil(filteredOpportunities.length / pageSize)}</span></li>
                    <li className={`page-item ${page >= Math.ceil(filteredOpportunities.length / pageSize) ? 'disabled' : ''}`}>
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

        {/* Advanced Filter Modal */}
        {showAdvFilter && (
          <div className="adv-filter-modal-backdrop" onClick={() => setShowAdvFilter(false)}>
            <div className="adv-filter-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="adv-filter-modal-header">
                <h5 className="modal-title fw-bold">Filters</h5>
                <button type="button" className="btn-close-filter" onClick={() => setShowAdvFilter(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="adv-filter-modal-body">
                {/* 1. Duration */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">រយះពេល</label>
                  <select
                    className="form-select w-100"
                    value={tempFilter.duration}
                    onChange={(e) => setTempFilter(prev => ({ ...prev, duration: e.target.value }))}
                  >
                    <option value="all">គ្រប់ពេល</option>
                    <option value="short">រយៈពេលខ្លី (1-3 ថ្ងៃ)</option>
                    <option value="medium">រយៈពេលមធ្យម (1-4 សប្តាហ៍)</option>
                    <option value="long">រយៈពេលវែង (1 ខែឡើង)</option>
                  </select>
                </div>

                {/* 2. Commitment Types */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">ប្រភេទការប្តេជ្ញាចិត្ត</label>
                  <div className="d-flex flex-row gap-4 flex-wrap">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={tempFilter.commitments.includes("part-time")}
                        onChange={(e) => handleCheckboxChange("commitments", "part-time", e.target.checked)}
                      />
                      <span className="ms-2">ក្រៅម៉ោង</span>
                    </label>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={tempFilter.commitments.includes("full-time")}
                        onChange={(e) => handleCheckboxChange("commitments", "full-time", e.target.checked)}
                      />
                      <span className="ms-2">ពេញម៉ោង</span>
                    </label>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={tempFilter.commitments.includes("weekend")}
                        onChange={(e) => handleCheckboxChange("commitments", "weekend", e.target.checked)}
                      />
                      <span className="ms-2">ចុងសប្តាហ៍</span>
                    </label>
                  </div>
                </div>

                {/* 3. Skills */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">តម្រូវការជំនាញ</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("teaching")}
                          onChange={(e) => handleCheckboxChange("skills", "teaching", e.target.checked)}
                        />
                        <span className="ms-2">ការបង្រៀន</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("agriculture")}
                          onChange={(e) => handleCheckboxChange("skills", "agriculture", e.target.checked)}
                        />
                        <span className="ms-2">កសិកម្ម</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("it")}
                          onChange={(e) => handleCheckboxChange("skills", "it", e.target.checked)}
                        />
                        <span className="ms-2">IT & បច្ចេកវិទ្យា</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("medical")}
                          onChange={(e) => handleCheckboxChange("skills", "medical", e.target.checked)}
                        />
                        <span className="ms-2">វេជ្ជសាស្ត្រ / ថែទាំសុខភាព</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("translation")}
                          onChange={(e) => handleCheckboxChange("skills", "translation", e.target.checked)}
                        />
                        <span className="ms-2">បកប្រែភាសា</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.skills.includes("event")}
                          onChange={(e) => handleCheckboxChange("skills", "event", e.target.checked)}
                        />
                        <span className="ms-2">រៀបចំព្រឹត្តិការណ៍</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. Organizer */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">ក្រុមការងារស្ម័គ្រចិត្ត</label>
                  <select
                    className="form-select w-100"
                    value={tempFilter.organizer}
                    onChange={(e) => setTempFilter(prev => ({ ...prev, organizer: e.target.value }))}
                  >
                    <option value="all">ទាំងអស់</option>
                    {organizers.map((org) => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Deadline */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">ថ្ងៃផុតកំណត់</label>
                  <input
                    type="date"
                    className="form-control w-100"
                    value={tempFilter.deadline || ""}
                    onChange={(e) => setTempFilter(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                {/* 6. Benefits */}
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">អត្ថប្រយោជន៍</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.benefits.includes("housing")}
                          onChange={(e) => handleCheckboxChange("benefits", "housing", e.target.checked)}
                        />
                        <span className="ms-2">កន្លែងស្នាក់នៅ</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.benefits.includes("meals")}
                          onChange={(e) => handleCheckboxChange("benefits", "meals", e.target.checked)}
                        />
                        <span className="ms-2">អាហារបរិភោគ</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.benefits.includes("transport")}
                          onChange={(e) => handleCheckboxChange("benefits", "transport", e.target.checked)}
                        />
                        <span className="ms-2">មធ្យោបាយធ្វើដំណើរ</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.benefits.includes("certificate")}
                          onChange={(e) => handleCheckboxChange("benefits", "certificate", e.target.checked)}
                        />
                        <span className="ms-2">វិញ្ញាបនបត្រ</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={tempFilter.benefits.includes("insurance")}
                          onChange={(e) => handleCheckboxChange("benefits", "insurance", e.target.checked)}
                        />
                        <span className="ms-2">ធានារ៉ាប់រង</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="adv-filter-modal-footer">
                <button type="button" className="btn-reset" onClick={resetAdvFilters}>
                  កំណត់ឡើងវិញ
                </button>
                <div className="d-flex gap-2">
                  <button type="button" className="btn-close-btn" onClick={() => setShowAdvFilter(false)}>
                    បិទ
                  </button>
                  <button type="button" className="btn-apply" onClick={applyAdvFilters}>
                    អនុវត្តតម្រង
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .btn-filter-toggle {
          border-radius: 6px;
          border: 1px solid var(--text-title);
          padding: 10px;
          height: 46px;
          font-size: 16px;
          outline: none;
          background-color: #3b82f6;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .btn-filter-toggle:hover {
          background-color: #2563eb;
        }
        .adv-filter-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adv-filter-modal-content {
          background: #ffffff;
          border-radius: 16px;
          width: min(460px, 94vw);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .adv-filter-modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn-close-filter {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .btn-close-filter:hover {
          color: #111827;
        }
        .adv-filter-modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }
        .form-label {
          color: #374151;
          font-size: 14px;
        }
        .form-select, .form-control {
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          padding: 10px 12px;
          color: #1f2937;
          background-color: #f9fafb;
          transition: border-color 0.15s ease;
        }
        .form-select:focus, .form-control:focus {
          border-color: #3b82f6;
          box-shadow: none;
          outline: none;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #4b5563;
        }
        .checkbox-container input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #3b82f6;
          cursor: pointer;
        }
        .adv-filter-modal-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f9fafb;
        }
        .btn-reset {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
        }
        .btn-reset:hover {
          text-decoration: underline;
        }
        .btn-close-btn {
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #4b5563;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-close-btn:hover {
          background: #f3f4f6;
        }
        .btn-apply {
          border: none;
          background: #3b82f6;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
          transition: background 0.15s ease;
        }
        .btn-apply:hover {
          background: #2563eb;
        }
      `}</style>
    </>
  );
}
