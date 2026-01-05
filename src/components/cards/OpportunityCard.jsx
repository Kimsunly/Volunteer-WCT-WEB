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

  // Benefits handling (convert object to array if needed)
  let benefitsArray = [];
  if (Array.isArray(data?.benefits)) {
    benefitsArray = data.benefits;
  } else if (typeof data?.benefits === "object" && data.benefits) {
    if (data.benefits.transport) benefitsArray.push("transport");
    if (data.benefits.housing) benefitsArray.push("housing");
    if (data.benefits.meals) benefitsArray.push("meals");
  }

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
      className={`col-12 col-md-6 col-xl-4 opportunity-card ${className}`}
      data-category={categorySlug || ""}
      data-aos="fade-up"
      data-aos-delay="0"
    >
      <div className="card h-100 border-0 shadow-sm hover-lift">
        {/* Image + Carousel (if multiple images) */}
        <div className="position-relative overflow-hidden">
          <img
            src={currentImage}
            alt={title}
            className="card-img-top"
            style={{ height: 240, objectFit: "cover" }}
          />

          {/* Carousel indicators (for new shape with multiple images) */}
          {images.length > 1 && (
            <div className="carousel-indicators page position-absolute bottom-0 start-50 translate-middle-x mb-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={idx === currentImageIndex ? "active" : ""}
                  aria-current={idx === currentImageIndex}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{ width: 8, height: 8, margin: "0 3px" }}
                />
              ))}
            </div>
          )}

          {/* Category badge */}
          {categoryLabel && (
            <span
              className={`position-absolute top-0 start-0 m-3 badge ${categoryColorClass}`}
            >
              {categoryLabel}
            </span>
          )}

          {/* Favorite button */}
          <button
            type="button"
            className="btn btn-light btn-sm position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40 }}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            onClick={handleToggleFav}
          >
            <i
              className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart"}`}
              aria-hidden="true"
            />
          </button>

          {/* Carousel controls (for new shape with multiple images) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-control-prev position-absolute start-0 top-50 translate-middle-y"
                onClick={prevImage}
                style={{ zIndex: 10 }}
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
              </button>
              <button
                type="button"
                className="carousel-control-next position-absolute end-0 top-50 translate-middle-y"
                onClick={nextImage}
                style={{ zIndex: 10 }}
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
              </button>
            </>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h3 className="card-title mb-3 fw-bold">{title}</h3>

          {/* Info list */}
          <div className="info-list mb-3">
            {locationLabel && (
              <div className="d-flex align-items-center mb-2 text-muted">
                <i
                  className="bi bi-geo-alt-fill text-danger me-2"
                  aria-hidden="true"
                />
                <span>{locationLabel}</span>
              </div>
            )}
            {date && (
              <div className="d-flex align-items-center mb-2 text-muted">
                <i
                  className="bi bi-calendar-check text-primary me-2"
                  aria-hidden="true"
                />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="d-flex align-items-center mb-2 text-muted">
                <i
                  className="bi bi-clock text-warning me-2"
                  aria-hidden="true"
                />
                <span>{time}</span>
              </div>
            )}
            {capacityLabel && (
              <div className="d-flex align-items-center text-muted">
                <i
                  className="bi bi-people text-success me-2"
                  aria-hidden="true"
                />
                <span>{capacityLabel}</span>
              </div>
            )}
          </div>

          {/* Benefits badges */}
          {renderBenefits()}

          {/* Action button */}
          <div className="mt-auto">
            {detailHref ? (
              <Link href={detailHref} className="btn btn-primary w-100">
                <i className="bi bi-info-circle me-2" aria-hidden="true" />
                ព័ត៌មានលម្អិត
              </Link>
            ) : (
              <button className="btn btn-primary w-100" disabled>
                <i className="bi bi-info-circle me-2" aria-hidden="true" />
                ព័ត៌មានលម្អិត
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

OpportunityCard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
  className: PropTypes.string,
  onToggleFavorite: PropTypes.func,
};
