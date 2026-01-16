"use client";

import PropTypes from "prop-types";
import Link from "next/link";

export default function EventCard({ data, className = "", onClick }) {
  const {
    id,
    href = "#",
    dateDay,
    dateMonth,
    imageUrl,
    category,
    title,
    description,
    location,
    timeRange,
    showJoin = true,
  } = data || {};

  return (
    <div className={`event-card-modern ${className}`} onClick={onClick}>
      <Link href={href} className="stretched-link" />

      <div className="event-date-badge">
        <div className="date-circle">
          <span className="date-day">{dateDay}</span>
          <span className="date-month">{dateMonth}</span>
        </div>
      </div>

      <div className="event-image">
        <img src={imageUrl} alt={title} />
        <div className="event-overlay"></div>
      </div>

      <div className="event-content">
        {category?.label && (
          <div className={`event-category ${category.colorClass || "bg-primary"}`}>
            {category.icon && <i className={`${category.icon} me-1`} />}
            {category.label}
          </div>
        )}

        <h3 className="event-title">{title}</h3>
        {description && <p className="event-description">{description}</p>}

        <div className="event-info-list">
          {location && (
            <div className="info-item">
              <i className="bi bi-geo-alt-fill" />
              <span>{location}</span>
            </div>
          )}
          {timeRange && (
            <div className="info-item">
              <i className="bi bi-clock-fill" />
              <span>{timeRange}</span>
            </div>
          )}
        </div>

        {showJoin && (
          <div className="event-action">
            <span className="join-text">ចុះឈ្មោះឥឡូវ</span>
            <i className="bi bi-arrow-right" />
          </div>
        )}
      </div>
    </div>
  );
}

EventCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    href: PropTypes.string,
    dateDay: PropTypes.string.isRequired,
    dateMonth: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      colorClass: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    timeRange: PropTypes.string,
    showJoin: PropTypes.bool,
  }).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};