// src/app/blogs/components/BlogCard.jsx
import React from "react";
import Image from "next/image";

export default function BlogCard({ post }) {
  const { category, badgeClass, image, date, readTime, title, excerpt } = post;

  return (
    <div className="card blog-card h-100 border-0 shadow-sm hover-lift">
      <div className="blog-card-img">
        <div className="blog-card-overlay">
          <span className={`badge ${badgeClass}`}>{category.label}</span>
        </div>
        <Image
          src={image}
          alt={category.label}
          className="img-fluid"
          width={600}
          height={400}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <div className="blog-meta mb-3">
          <span className="me-3">
            <i className="bi bi-calendar me-1"></i>
            {date}
          </span>
          <span>
            <i className="bi bi-clock me-1"></i>
            {readTime}
          </span>
        </div>

        <h5 className="blog-card-title">{title}</h5>
        <p className="blog-card-text mb-3">{excerpt}</p>

        <a href="#" className="btn btn-link p-0 mt-3">
          អានបន្ត <i className="bi bi-arrow-right ms-2"></i>
        </a>
      </div>
    </div>
  );
}
