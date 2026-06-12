import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ post }) {
  const { id, category, image, created_at, title, content } = post;

  // Create excerpt from content
  const excerpt = content ? content.substring(0, 100) + "..." : "";
  const dateStr = created_at ? new Date(created_at).toLocaleDateString() : "";

  // Resolve image URL to handle backend storage paths
  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('blob:')) {
      return img;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const cleanBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    const cleanImgPath = img.startsWith('/') ? img : '/' + img;
    return `${cleanBaseUrl}${cleanImgPath}`;
  };

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

  const resolvedImage = resolveImageUrl(image);
  const imageSrc = isValidUrl(resolvedImage) ? resolvedImage : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="card blog-card-modern h-100 border-0 shadow-lg overflow-hidden">
      <div className="blog-card-img-wrapper position-relative">
        <span className="badge-modern-category position-absolute top-0 start-0 m-3 z-3">
          {category?.label || category}
        </span>
        <Image
          src={imageSrc}
          alt={title}
          className="blog-card-img"
          width={600}
          height={400}
          style={{ objectFit: 'cover', width: '100%', height: '240px' }}
        />
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <div className="blog-meta-modern d-flex align-items-center gap-3 mb-3 text-muted small">
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-calendar3"></i>
            {dateStr}
          </span>
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-clock"></i>
            {post.readTime || "5 នាទី"}
          </span>
        </div>

        <h5 className="blog-card-title-modern fw-bold mb-3">{title}</h5>
        
        <p className="blog-card-text-modern text-muted mb-4 small" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.6'
        }}>{excerpt}</p>

        <div className="blog-tags-modern d-flex flex-wrap gap-2 mb-4">
          <span className="badge rounded-pill bg-light text-dark px-3 py-2 border">#ស្ម័គ្រចិត្ត</span>
          <span className="badge rounded-pill bg-light text-dark px-3 py-2 border">#សហគមន៍</span>
        </div>

        <Link href={`/blogs/${id}`} className="btn btn-modern-action w-100 mt-auto py-2 fw-bold">
          អានបន្ថែម <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  );
}
