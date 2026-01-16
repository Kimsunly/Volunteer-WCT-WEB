"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";

/**
 * OpportunityCard - Flexible component that handles both data shapes
 * Old shape: { id, title, category, imageUrl, location, date, time, capacityLabel, benefits[], detailHref }
 * New shape: { id, title, category{slug,label}, location{slug,label}, images[], description, date, time, capacity, benefits{transport,housing,meals}, detailHref }
 */
const benefitIconMap = {
  transport: "bi-taxi-front-fill",
  housing: "bi-house-fill",
  food: "bi-fork-knife",
  meals: "bi-fork-knife",
};

const categoryColorMap = {
  education: "bg-info",
  environment: "bg-success",
  wildlife: "bg-danger",
  childcare: "bg-warning",
  agriculture: "bg-success",
  event: "bg-primary",
  health: "bg-danger",
};

export default function OpportunityCard({
  data,
  className = "",
  onToggleFavorite,
}) {
  const [isFav, setIsFav] = useState(data?.isFavorite ?? false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle both old & new data shapes
  const isNewShape = Array.isArray(data?.images);

  // Extract fields (works for both shapes)
  const id = data?.id;
  const title = data?.title;

  // Category handling
  const categoryLabel =
    typeof data?.category === "string" ? data.category : data?.category?.label;
  const categorySlug = data?.category?.slug || data?.category;
  const categoryColorClass = categoryColorMap[categorySlug] || "bg-primary";

  // Location handling
  const locationLabel =
    typeof data?.location === "string" ? data.location : data?.location?.label;

  // Image handling
  const images = data?.images || [];
  const imageUrl = data?.imageUrl || images[0] || "/placeholder.png";
  const currentImage = images.length > 0 ? images[currentImageIndex] : imageUrl;

  // Date, Time, Capacity
  const date = data?.date;
  const time = data?.time;
  const capacityLabel =
    data?.capacityLabel ||
    (data?.capacity ? `ចំនួន ${data.capacity} នាក់` : "");

  // Benefits handling
  const benefitsArray = [];
  if (data?.transport && data.transport.toLowerCase() !== "not provided" && data.transport.toLowerCase() !== "none") benefitsArray.push("transport");
  if (data?.housing && data.housing.toLowerCase() !== "not provided" && data.housing.toLowerCase() !== "none") benefitsArray.push("housing");
  if (data?.meals && data.meals.toLowerCase() !== "not provided" && data.meals.toLowerCase() !== "none") benefitsArray.push("meals");

  // Links
  const detailHref = data?.detailHref;

  // Handle carousel
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Handle favorite toggle
  const handleToggleFav = () => {
    const newFav = !isFav;
    setIsFav(newFav);
    if (onToggleFavorite) {
      onToggleFavorite(id, newFav);
    }
  };

  const renderBenefits = () => {
    if (!benefitsArray || !benefitsArray.length) return null;
    return (
      <div className="benefits-tags mb-3">
        {benefitsArray.map((b) => (
          <span key={b} className="badge bg-light text-dark me-1 mb-1">
            <i
              className={`bi ${benefitIconMap[b] || "bi-dot"}`}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`col-12 col-md-6 col-xl-4 mb-4 ${className}`}
      data-category={categorySlug || ""}
      data-aos="fade-up"
    >
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Image Section */}
        <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
          <img
            src={currentImage}
            alt={title}
            className="w-100 h-100 object-fit-cover transition-scale"
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />

          {/* Category badge - Top Left */}
          {categoryLabel && (
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge rounded-pill bg-primary px-3 py-2 shadow-sm fw-normal">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Favorite button - Top Right */}
          <div className="position-absolute top-0 end-0 m-3">
            <button
              type="button"
              className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
              style={{ width: "38px", height: "38px", backgroundColor: "white" }}
              onClick={handleToggleFav}
            >
              <i
                className={`bi ${isFav ? "bi-heart-fill text-danger text-shadow" : "bi-heart text-dark"}`}
                style={{ fontSize: "1.1rem" }}
              />
            </button>
          </div>
        </div>

        <div className="card-body p-4 d-flex flex-column font-kantumruy">
          <h5 className="card-title fw-bold mb-3 text-dark fs-5">{title}</h5>

          {/* Icons Grid */}
          <div className="opportunity-info mb-3">
            {locationLabel && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-geo-alt-fill text-danger fs-6" />
                <span>{locationLabel}</span>
              </div>
            )}
            {date && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-calendar-check-fill text-primary fs-6" />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-clock-fill text-warning fs-6" />
                <span>{time}</span>
              </div>
            )}
            {capacityLabel && (
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <i className="bi bi-people-fill text-success fs-6" />
                <span>{capacityLabel}</span>
              </div>
            )}
          </div>

          {/* Bottom Row: Benefits and Action Button */}
          <div className="mt-auto">
            {/* Benefit Icons */}
            <div className="d-flex gap-2 mb-3 text-secondary">
              {benefitsArray.includes("transport") && (
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                  <i className="bi bi-car-front-fill fs-6" title="Transport" />
                </div>
              )}
              {benefitsArray.includes("meals") && (
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                  <i className="bi bi-utensils fs-6" title="Meals" />
                </div>
              )}
              {benefitsArray.includes("housing") && (
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                  <i className="bi bi-house-door-fill fs-6" title="Housing" />
                </div>
              )}
            </div>

            {/* Action button */}
            {detailHref ? (
              <Link
                href={detailHref}
                className="btn btn-primary w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              >
                <i className="bi bi-info-circle fs-5" />
                <span>ព័ត៌មានលម្អិត</span>
              </Link>
            ) : (
              <button
                className="btn btn-primary w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled
              >
                <i className="bi bi-info-circle fs-5" />
                <span>ព័ត៌មានលម្អិត</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .transition-scale {
          transition: transform 0.5s ease;
        }
        .opportunity-card:hover .transition-scale {
          transform: scale(1.05);
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

OpportunityCard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
  className: PropTypes.string,
  onToggleFavorite: PropTypes.func,
};
