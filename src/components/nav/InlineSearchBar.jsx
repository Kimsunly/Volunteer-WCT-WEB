"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function InlineSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

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
        const { data } = await api.get(`/api/search?q=${query}`);
        // data.data will have { opportunities, community_posts }
        const allResults = [
          ...(data.data?.opportunities || []).map((o) => ({
            ...o,
            type: "opportunity",
            icon: "bi-briefcase",
          })),
          ...(data.data?.community_posts || []).map((p) => ({
            ...p,
            type: "community",
            icon: "bi-people",
          })),
        ];
        setResults(allResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setShowResults(false);
    setQuery("");
    if (item.type === "opportunity") {
      router.push(`/opportunities/${item.id}`);
    } else if (item.type === "community") {
      router.push(`/community/post/${item.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      router.push(`/opportunities?q=${query}`);
    }
  };

  return (
    <div className="inline-search-wrapper" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-group">
          <i
            className={`bi ${loading ? "bi-arrow-repeat spin" : "bi-search"} search-icon`}
          ></i>
          <input
            type="text"
            className="search-input"
            placeholder="ស្វែងរកឱកាស..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {showResults && query.trim() && (
        <div className="search-dropdown shadow-lg border">
          {results.length > 0 ? (
            <>
              <div className="dropdown-header">
                <i className="bi bi-clock-history me-2"></i> ធ្លាប់បានស្វែងរក
              </div>
              <div className="results-list">
                {results.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="result-item"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="result-content">
                      <i className={`bi ${item.icon} me-3 text-muted`}></i>
                      <div className="d-flex flex-column">
                        <span className="result-title text-truncate">
                          {item.title || item.title_kh}
                        </span>
                        <span
                          className="text-muted"
                          style={{
                            fontSize: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <button
                      className="remove-result"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer text-center border-top p-2">
                <Link
                  href={`/opportunities?q=${query}`}
                  className="view-all-link"
                  onClick={() => setShowResults(false)}
                >
                  មើលលទ្ធផលទាំងអស់
                </Link>
                <div className="footer-links mt-1">
                  <span>ទំនាក់ទំនង</span> | <span>អំពីយើង</span> |{" "}
                  <span>មើលគណនី</span>
                </div>
              </div>
            </>
          ) : (
            !loading && (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">មិនឃើញលទ្ធផលសម្រាប់ "{query}"</p>
              </div>
            )
          )}
        </div>
      )}

      <style jsx>{`
        .inline-search-wrapper {
          position: relative;
          width: 300px;
        }
        .search-input-group {
          position: relative;
          display: flex;
          align-items: center;
          background: #f1f3f4;
          border-radius: 24px;
          padding: 2px 12px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .search-input-group:focus-within {
          background: #fff;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
          border-color: #dfe1e5;
        }
        .search-icon {
          color: #5f6368;
          font-size: 14px;
          margin-right: 8px;
        }
        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
          padding: 2px 0;
          color: #202124;
        }
        .clear-btn {
          border: none;
          background: transparent;
          color: #5f6368;
          padding: 0 4px;
          cursor: pointer;
        }
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 450px;
          background: #fff;
          margin-top: 12px;
          border-radius: 12px;
          z-index: 9999;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        .dropdown-header {
          padding: 12px 16px;
          font-size: 12px;
          color: #202124;
          font-weight: 600;
          background: #fff;
        }
        .result-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.1s;
        }
        .result-item:hover {
          background: #f8f9fa;
        }
        .result-content {
          display: flex;
          align-items: center;
          flex-grow: 1;
          overflow: hidden;
        }
        .result-title {
          font-size: 14px;
          color: #3c4043;
        }
        .remove-result {
          border: none;
          background: transparent;
          color: #bdc1c6;
          padding: 4px;
          border-radius: 50%;
        }
        .remove-result:hover {
          background: #f1f3f4;
          color: #70757a;
        }
        .view-all-link {
          font-size: 13px;
          color: #1a73e8;
          text-decoration: none;
          font-weight: 600;
        }
        .footer-links {
          font-size: 11px;
          color: #70757a;
        }
        .footer-links span {
          margin: 0 4px;
          cursor: pointer;
        }
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

        @media (max-width: 991px) {
          .inline-search-wrapper {
            width: 100%;
            margin: 10px 0;
          }
        }
      `}</style>
    </div>
  );
}
