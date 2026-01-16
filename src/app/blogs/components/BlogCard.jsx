import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ post }) {
  const { id, category, image, created_at, title, content } = post;

  // Create excerpt from content
  const excerpt = content ? content.substring(0, 100) + "..." : "";
  const dateStr = created_at ? new Date(created_at).toLocaleDateString() : "";

  // Validate image URL
  const isValidUrl = (url) => {
    if (!url || url === "string" || url === "") return false;
    try {
      if (url.startsWith('http')) {
        new URL(url);
        return true;
      }
      return url.startsWith('/');
    } catch {
      return false;
    }
  };

  const imageSrc = isValidUrl(image) ? image : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="card blog-card h-100 border-0 shadow-sm hover-lift">
      <div className="blog-card-img">
        <div className="blog-card-overlay">
          <span className="badge bg-primary">{category?.label || category}</span>
        </div>
        <Image
          src={imageSrc}
          alt={title}
          className="img-fluid"
          width={600}
          height={400}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <div className="blog-meta mb-3">
          <span className="me-3">
            <i className="bi bi-calendar me-1"></i>
            {dateStr}
          </span>
        </div>

        <h5 className="blog-card-title">{title}</h5>
        <p className="blog-card-text mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{excerpt}</p>

        <Link href={`/blogs/${id}`} className="btn btn-link p-0 mt-auto text-decoration-none">
          អានបន្ត <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  );
}
