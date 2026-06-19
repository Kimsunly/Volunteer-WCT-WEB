"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";

function StatusBadge({ status }) {
  if (status === "active")
    return <span className="vh-badge vh-badge--success">សកម្ម</span>;
  if (status === "draft")
    return <span className="vh-badge vh-badge--warning">ព្រាង</span>;
  return <span className="vh-badge vh-badge--danger">បិទ</span>;
}

export default function OpportunitiesPane({
  items,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onStatusUpdate,
}) {
  const [sortField, setSortField] = useState(null); // 'title' | 'date' | 'volunteers' | 'status'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when items, search, or statusFilter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items, search, statusFilter]);

  const sortedItems = useMemo(() => {
    if (!sortField) return items;
    const sorted = [...items];
    sorted.sort((a, b) => {
      let valA, valB;
      if (sortField === "title") {
        valA = (a.titleKh || "").toLowerCase();
        valB = (b.titleKh || "").toLowerCase();
      } else if (sortField === "date") {
        // Fallback to id sort since ID matches creation order
        valA = a.id || 0;
        valB = b.id || 0;
      } else if (sortField === "volunteers") {
        valA = a.current || 0;
        valB = b.current || 0;
      } else if (sortField === "status") {
        valA = a.status || "";
        valB = b.status || "";
      } else {
        return 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedItems, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, sortedItems.length);

  return (
    <div className="tab-pane fade show active" id="opportunities" style={{ background: "transparent", border: "none", padding: 0 }}>
      {/* ── Toolbar ── */}
      <div
        className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3 rounded-4 toolbar-wrapper"
        data-aos="fade-up"
      >
        <div className="vh-search-wrap flex-grow-1 position-relative" style={{ width: "auto" }}>
          <i className="bi bi-search search-icon"></i>
          <input
            className="form-control form-control-premium"
            placeholder="ស្វែងរកឱកាស…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select form-control-premium"
          style={{ width: 180, flexShrink: 0 }}
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
        >
          <option value="all">ស្ថានភាពទាំងអស់</option>
          <option value="active">សកម្ម (Available)</option>
          <option value="closed">បិទ (Closed)</option>
          <option value="draft">ព្រាង (Draft)</option>
        </select>
        <button className="btn btn-add-op" onClick={onCreate} style={{ flexShrink: 0 }}>
          <i className="bi bi-plus-lg me-1"></i> បន្ថែមឱកាស
        </button>
      </div>

      {/* ── Custom Table UI ── */}
      <div className="table-responsive" data-aos="fade-up" data-aos-delay="50" style={{ overflowX: "auto" }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", width: "100%" }}>
          <thead>
            <tr style={{ background: "transparent" }}>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("title")}
              >
                ឱកាសស្ម័គ្រចិត្ត (Opportunity) 
                {sortField === "title" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("date")}
              >
                កាលបរិច្ឆេទ (Date)
                {sortField === "date" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th className="regular-header">ទីតាំង (Location)</th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("volunteers")}
              >
                ចំនួនអ្នកស្ម័គ្រចិត្ត (Volunteers)
                {sortField === "volunteers" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort("status")}
              >
                ស្ថានភាព (Status)
                {sortField === "status" ? (
                  <i className={`bi bi-arrow-${sortOrder === "asc" ? "up" : "down"} ms-1 sort-arrow`} />
                ) : (
                  <i className="bi bi-arrow-down-up ms-1 sort-arrow-inactive" />
                )}
              </th>
              <th className="regular-header" style={{ textAlign: "right" }}>សកម្មភាព (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((op, idx) => (
              <tr 
                key={op.id} 
                className="opportunity-row"
              >
                {/* Opportunity cell */}
                <td className="cell-left border-y-theme">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
                      <Image
                        className="rounded object-fit-cover avatar-border"
                        src={op.image}
                        alt=""
                        fill
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="opportunity-title-kh">{op.titleKh}</div>
                      <div className="opportunity-title-en">{op.titleEn}</div>
                    </div>
                  </div>
                </td>

                {/* Date cell */}
                <td className="border-y-theme date-cell-text">{op.dateKh}</td>

                {/* Location cell */}
                <td className="border-y-theme location-cell-text">{op.locationKh}</td>

                {/* Volunteers count cell */}
                <td className="border-y-theme">
                  <div>
                    <div className="volunteers-ratio-text">{op.current} / {op.capacity} នាក់</div>
                    <div className="volunteers-registrations-text">ការចុះឈ្មោះ៖ <span className="fw-bold text-accent-theme">{op.registrations || 0}</span></div>
                  </div>
                </td>

                {/* Status cell */}
                <td className="border-y-theme">
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm select-status-theme"
                      value={op.status}
                      onChange={(e) => onStatusUpdate && onStatusUpdate(op.id, e.target.value)}
                      style={{ width: "auto" }}
                    >
                      <option value="active">សកម្ម (Active)</option>
                      <option value="draft">ព្រាង (Draft)</option>
                      <option value="closed">បិទ (Closed)</option>
                    </select>
                  </div>
                </td>

                {/* Actions cell */}
                <td className="cell-right border-y-theme" style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button 
                      onClick={() => onView && onView(op)}
                      className="btn-action-tab btn-action-view"
                      title="លម្អិត"
                    >
                      <i className="bi bi-eye-fill" />
                    </button>

                    <button 
                      onClick={() => onEdit && onEdit(op)}
                      className="btn-action-tab btn-action-edit"
                      title="កែប្រែ"
                    >
                      <i className="bi bi-pencil-fill" />
                    </button>

                    <button 
                      onClick={() => onDelete && onDelete(op.id)}
                      className="btn-action-tab btn-action-delete"
                      title="លុប"
                    >
                      <i className="bi bi-trash-fill" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-5 no-data-cell">
                  <i className="bi bi-briefcase fs-1 d-block mb-2 text-muted-theme" style={{ opacity: 0.4 }} />
                  មិនទាន់មានឱកាសស្ម័គ្រចិត្តស្របតាមការស្វែងរករបស់អ្នកឡើយ។
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination controls ── */}
      {sortedItems.length > 0 && (
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 px-2 pagination-container" data-aos="fade-up">
          <span className="pagination-info">
            បង្ហាញពី <span className="fw-bold text-accent-theme">{startEntry}</span> ដល់ <span className="fw-bold text-accent-theme">{endEntry}</span> នៃ <span className="fw-bold text-accent-theme">{sortedItems.length}</span> ឱកាសស្ម័គ្រចិត្ត
          </span>
          <div className="d-flex align-items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
              aria-label="Previous page"
            >
              <i className="bi bi-chevron-left"></i> មុន
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`pagination-number-btn ${currentPage === p ? "active" : ""}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
              aria-label="Next page"
            >
              បន្ទាប់ <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .toolbar-wrapper {
          background-color: var(--color-bg-card);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-card);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
        }

        .form-control-premium {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          height: 42px;
          font-size: 14.5px;
          padding-left: 40px;
          transition: all 0.25s ease;
        }
        .form-control-premium:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          outline: none;
        }

        select.form-control-premium {
          padding-left: 14px;
        }

        .btn-add-op {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          border: none !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          padding: 10px 24px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 12px var(--color-accent-glow) !important;
          height: 42px;
          display: inline-flex;
          align-items: center;
        }
        :global([data-theme="light"]) .btn-add-op {
          color: #ffffff !important;
          background-color: #15803d !important;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25) !important;
        }
        .btn-add-op:hover {
          transform: scale(1.03) translateY(-1px) !important;
          box-shadow: 0 6px 18px var(--color-accent-glow), 0 0 0 3px var(--color-accent-dim) !important;
        }
        :global([data-theme="light"]) .btn-add-op:hover {
          box-shadow: 0 6px 18px rgba(21, 128, 61, 0.35), 0 0 0 3px rgba(21, 128, 61, 0.15) !important;
        }

        /* Table headers */
        .sortable-header {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border: none;
          cursor: pointer;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sortable-header:hover {
          color: var(--color-text-primary) !important;
        }
        .sort-arrow {
          color: var(--color-accent) !important;
        }
        .sort-arrow-inactive {
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        .regular-header {
          color: var(--color-text-secondary) !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          border: none;
        }

        /* Table cells */
        .opportunity-row {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          box-shadow: var(--shadow-card) !important;
          border-radius: 16px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .opportunity-row:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1), var(--shadow-card) !important;
        }

        .border-y-theme {
          border-top: 1px solid var(--color-border) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
        .cell-left {
          padding: 16px;
          border-left: 1px solid var(--color-border) !important;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .cell-right {
          padding: 16px;
          border-right: 1px solid var(--color-border) !important;
          border-top-right-radius: 14px;
          border-bottom-right-radius: 14px;
        }

        .avatar-border {
          border: 2px solid var(--color-border);
          background-color: var(--color-bg-base);
        }

        .opportunity-title-kh {
          font-weight: 700;
          color: var(--color-text-primary);
          font-size: 14.5px;
        }
        .opportunity-title-en {
          font-size: 12.5px;
          color: var(--color-text-secondary);
        }

        .date-cell-text,
        .location-cell-text {
          color: var(--color-text-secondary);
          font-size: 13.5px;
        }

        .volunteers-ratio-text {
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 14px;
        }
        .volunteers-registrations-text {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-top: 2px;
        }

        .select-status-theme {
          background-color: var(--color-bg-input);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 12.5px;
          padding: 4px 28px 4px 10px;
        }
        .select-status-theme:focus {
          border-color: var(--color-accent);
          box-shadow: none;
        }

        .no-data-cell {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          color: var(--color-text-secondary);
        }

        /* Action buttons */
        .btn-action-tab {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--color-bg-card);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-action-view {
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
        }
        .btn-action-view:hover {
          background: var(--color-bg-input);
          color: var(--color-text-primary);
          border-color: var(--color-border-hover);
        }

        .btn-action-edit {
          border: 1.5px solid var(--color-accent) !important;
          color: var(--color-accent) !important;
          background: transparent !important;
        }
        .btn-action-edit:hover {
          background: var(--color-accent) !important;
          color: #000000 !important;
          box-shadow: 0 0 10px var(--color-accent-glow);
          transform: translateY(-1px);
        }

        .btn-action-delete {
          border: 1.5px solid #dc3545 !important;
          color: #dc3545 !important;
          background: transparent !important;
        }
        .btn-action-delete:hover {
          background: rgba(220, 53, 69, 0.1) !important;
          transform: translateY(-1px);
        }

        /* Pagination styles */
        .pagination-container {
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
        }
        .pagination-info {
          font-size: 13.5px;
          color: var(--color-text-secondary);
        }
        .pagination-btn {
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 6px 14px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(.disabled) {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-hover);
        }
        .pagination-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-number-btn {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1px solid transparent;
          border-radius: 8px;
          width: 34px;
          height: 34px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .pagination-number-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-card-hover);
        }
        .pagination-number-btn.active {
          background: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid var(--color-accent-glow) !important;
        }

        .vh-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .vh-badge--success {
          background-color: var(--color-accent-dim);
          color: var(--color-accent);
          border: 1px solid rgba(22, 163, 74, 0.2);
        }
        .vh-badge--warning {
          background-color: rgba(217, 119, 6, 0.12);
          color: #d97706;
          border: 1px solid rgba(217, 119, 6, 0.2);
        }
        .vh-badge--danger {
          background-color: rgba(220, 38, 38, 0.12);
          color: #dc2626;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }
      `}</style>
    </div>
  );
}
