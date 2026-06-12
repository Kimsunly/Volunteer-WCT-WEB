"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function SearchModal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/api/opportunities?q=${query}&per_page=5`,
        );
        // The API returns { success: true, message: "...", data: [...], pagination: {...} }
        setResults(data.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle modal focus
  useEffect(() => {
    const modal = document.getElementById("searchModal");
    if (modal) {
      const onShow = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 500);
      };
      const onHide = () => {
        setIsOpen(false);
        setQuery("");
      };
      modal.addEventListener("shown.bs.modal", onShow);
      modal.addEventListener("hidden.bs.modal", onHide);
      return () => {
        modal.removeEventListener("shown.bs.modal", onShow);
        modal.removeEventListener("hidden.bs.modal", onHide);
      };
    }
  }, []);

  const handleSelect = (id) => {
    // Close modal using Bootstrap instance
    const modalElement = document.getElementById("searchModal");
    if (modalElement && typeof window !== "undefined" && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
    router.push(`/opportunities/${id}`);
  };

  const popularSearches = [
    { label: "បង្រៀន", query: "Teaching", icon: "bi-book" },
    { label: "បរិស្ថាន", query: "Environment", icon: "bi-tree" },
    { label: "សុខភាព", query: "Health", icon: "bi-heart-pulse" },
    { label: "បច្ចេកវិទ្យា", query: "Technology", icon: "bi-laptop" },
  ];

  return (
    <div
      className="modal fade"
      id="searchModal"
      tabIndex="-1"
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header/Input Area */}
          <div className="modal-header p-0 border-bottom">
            <div className="input-group input-group-lg">
              <span className="input-group-text border-0 bg-white ps-4">
                <i
                  className={`bi ${loading ? "bi-arrow-repeat spin" : "bi-search"} text-primary fs-4`}
                ></i>
              </span>
              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 py-4 shadow-none fs-5"
                placeholder="ស្វែងរកឱកាសស្ម័គ្រចិត្ត..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="btn border-0 bg-white pe-4"
                  onClick={() => setQuery("")}
                >
                  <i className="bi bi-x-lg text-muted"></i>
                </button>
              )}
            </div>
          </div>

          {/* Body Area */}
          <div
            className="modal-body p-0"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {!query && (
              <div className="p-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3 tracking-wider">
                  ការស្វែងរកពេញនិយម
                </h6>
                <div className="row g-3">
                  {popularSearches.map((item, idx) => (
                    <div className="col-6 col-md-3" key={idx}>
                      <Link
                        href={`/opportunities?q=${item.query}`}
                        className="d-flex flex-column align-items-center p-3 rounded-3 bg-light text-decoration-none transition-all hover-primary"
                        data-bs-dismiss="modal"
                      >
                        <i
                          className={`bi ${item.icon} fs-3 mb-2 text-primary`}
                        ></i>
                        <span className="small fw-medium text-dark">
                          {item.label}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {query && results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 border-bottom bg-light">
                  <span className="small fw-bold text-muted text-uppercase">
                    លទ្ធផលស្វែងរក ({results.length})
                  </span>
                </div>
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="d-flex align-items-center p-3 px-4 border-bottom cursor-pointer hover-bg-light transition-all"
                  >
                    <div className="flex-shrink-0 me-3">
                      <img
                        src={
                          item.details?.images_json?.[0] ||
                          "/images/placeholder.png"
                        }
                        alt={item.title}
                        className="rounded-3 object-fit-cover"
                        style={{ width: "60px", height: "60px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-dark">{item.title}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary-soft text-primary border-0 small py-1 px-2">
                          {item.category?.name || "Volunteer"}
                        </span>
                        <span className="small text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {item.logistic?.location_label || "ភ្នំពេញ"}
                        </span>
                      </div>
                    </div>
                    <div className="ms-3">
                      <i className="bi bi-chevron-right text-muted"></i>
                    </div>
                  </div>
                ))}
                <div className="p-3 text-center">
                  <Link
                    href={`/opportunities?q=${query}`}
                    className="btn btn-link text-primary text-decoration-none fw-bold small"
                    data-bs-dismiss="modal"
                  >
                    មើលលទ្ធផលទាំងអស់ <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            )}

            {query && results.length === 0 && !loading && (
              <div className="p-5 text-center">
                <div className="mb-3">
                  <i className="bi bi-search text-muted display-4"></i>
                </div>
                <h5 className="text-dark">មិនឃើញលទ្ធផល</h5>
                <p className="text-muted">
                  សាកល្បងពាក្យគន្លឹះផ្សេងទៀត ឬពិនិត្យអក្ខរាវិរុទ្ធរបស់អ្នក
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top-0 py-2 px-4 justify-content-between">
            <div className="d-flex gap-3 small text-muted">
              <span>
                <kbd className="me-1">↑↓</kbd> ជ្រើសរើស
              </span>
              <span>
                <kbd className="me-1">↵</kbd> ចូលមើល
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-secondary rounded-pill px-3"
              data-bs-dismiss="modal"
            >
              បិទ
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .hover-primary:hover {
          background-color: #e7f1ff !important;
          transform: translateY(-2px);
        }
        .bg-primary-soft {
          background-color: rgba(13, 110, 253, 0.1);
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        kbd {
          background-color: #e9ecef;
          color: #495057;
          font-size: 0.75rem;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          border: 1px solid #dee2e6;
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .tracking-wider {
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
