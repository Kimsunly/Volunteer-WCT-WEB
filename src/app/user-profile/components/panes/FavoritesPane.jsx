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
      <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i className="bi bi-heart-fill text-danger me-2"></i>
        <div>
          ទីនេះជាឱកាសស្ម័គ្រចិត្តទាំងអស់ដែលអ្នកបានរក្សាទុក ឬពេញចិត្ត។
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {favorites.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
          <i className="bi bi-heartbreak fs-1 text-muted opacity-50 mb-3 d-block"></i>
          <h6 className="fw-bold">មិនទាន់មានឱកាសពេញចិត្តនៅឡើយទេ</h6>
          <p className="text-muted small">ចុចលើរូបបេះដូងនៅលើឱកាសស្ម័គ្រចិត្តដើម្បីបន្ថែមទៅទីនេះ</p>
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

          {/* Simple Pagination */}
          {total > pageSize && (
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination shadow-sm rounded-pill overflow-hidden">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link px-3" onClick={() => setPage(p => Math.max(1, p - 1))}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link px-3">{page}</span>
                  </li>
                  <li className={`page-item ${page * pageSize >= total ? 'disabled' : ''}`}>
                    <button className="page-link px-3" onClick={() => setPage(p => p + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
