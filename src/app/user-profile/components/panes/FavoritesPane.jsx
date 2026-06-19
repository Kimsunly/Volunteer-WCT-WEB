"use client";

import React, { useState, useEffect } from "react";
import { getFavoriteOpportunities } from "@/services/opportunities";
import { useAuth } from "@/context/AuthContext";
import OpportunityCard from "@/components/cards/OpportunityCard";

export default function FavoritesPane() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await getFavoriteOpportunities({ page, per_page: pageSize });
      
      const items = response.data || response.items || [];
      const transformedItems = items.map(item => {
        const catName = item.category?.name || item.category_label || (typeof item.category === 'string' ? item.category : '');
        const locName = item.location_label || item.logistic?.location_label || (typeof item.location === 'string' ? item.location : '');
        return {
          ...item,
          id: String(item.id),
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

      setFavorites(transformedItems);
      setTotal(response.total || transformedItems.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("មិនអាចទាញយកឱកាសពេញចិត្តបានទេ។");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, page]);

  const handleRemoveFavorite = (id, isFav) => {
    if (!isFav) {
      setFavorites(prev => prev.filter(opp => opp.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">កំពុងទាញយកឱកាសពេញចិត្ត...</p>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active" id="tabFavorites">
      {/* Top Banner Notice */}
      <div className="alert vh-notice-banner d-flex align-items-center mb-4" role="alert">
        <div className="notice-icon-wrap me-3">
          <i className="bi bi-heart-fill text-danger pulse"></i>
        </div>
        <div>
          <div className="fw-semibold text-primary-theme">ឱកាសពេញចិត្ត / Saved Opportunities</div>
          <div className="small text-secondary-theme">
            ទីនេះជាឱកាសស្ម័គ្រចិត្តទាំងអស់ដែលអ្នកបានរក្សាទុក ឬពេញចិត្ត។
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {favorites.length === 0 ? (
        <div className="text-center py-5 rounded-4 text-muted-box">
          <i className="bi bi-heartbreak-fill fs-1 text-danger opacity-50 mb-3 d-block"></i>
          <h6 className="fw-bold text-primary-theme">មិនទាន់មានឱកាសពេញចិត្តនៅឡើយទេ</h6>
          <p className="text-secondary-theme small">ចុចលើរូបបេះដូងនៅលើឱកាសស្ម័គ្រចិត្តដើម្បីបន្ថែមទៅទីនេះ</p>
        </div>
      ) : (
        <>
          <div className="row gy-4">
            {favorites.map((opp) => (
              <OpportunityCard
                key={opp.id}
                data={opp}
                onToggleFavorite={handleRemoveFavorite}
              />
            ))}
          </div>

          {/* Custom Modern Pagination */}
          {total > pageSize && (
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination vh-pagination shadow-sm">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">{page}</span>
                  </li>
                  <li className={`page-item ${page * pageSize >= total ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p => p + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .vh-notice-banner {
          background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
          border: 1px solid var(--color-border) !important;
          border-left: 4px solid var(--color-accent) !important;
          border-radius: 16px !important;
          padding: 20px !important;
          box-shadow: var(--shadow-card) !important;
        }
        
        .notice-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background-color: rgba(220, 53, 69, 0.12) !important;
          flex-shrink: 0;
        }

        .pulse {
          animation: pulse-animation 2s infinite;
        }
        @keyframes pulse-animation {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        .text-primary-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }

        .text-muted-box {
          background-color: var(--color-bg-input) !important;
          border: 1px dashed var(--color-border) !important;
        }

        /* Custom Pagination styles */
        .vh-pagination {
          background: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 100px !important;
          padding: 4px;
          display: flex;
          gap: 6px;
        }
        
        :global(.vh-pagination .page-item) {
          border: none !important;
          margin: 0 !important;
        }

        :global(.vh-pagination .page-link) {
          width: 40px;
          height: 40px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent !important;
          background-color: transparent !important;
          color: var(--color-text-primary) !important;
          font-weight: 600;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 !important;
          font-size: 14px;
        }

        :global(.vh-pagination .page-item.active .page-link) {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          box-shadow: 0 0 10px var(--color-accent-glow) !important;
          border-color: var(--color-accent) !important;
        }

        :global(.vh-pagination .page-item:not(.active):not(.disabled) .page-link:hover) {
          background-color: var(--color-bg-card-hover) !important;
          border-color: var(--color-border) !important;
          color: var(--color-accent) !important;
          transform: scale(1.05);
        }

        :global(.vh-pagination .page-item.disabled .page-link) {
          opacity: 0.35;
          color: var(--color-text-secondary) !important;
        }
      `}</style>
    </div>
  );
}
