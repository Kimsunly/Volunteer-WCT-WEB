import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  // Resolve image URL to handle backend storage paths
  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const cleanBaseUrl = apiBaseUrl.endsWith("/")
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;
    const cleanImgPath = img.startsWith("/") ? img : "/" + img;
    return `${cleanBaseUrl}${cleanImgPath}`;
  };

  const { id, category, badgeClass, image, date, readTime, title, excerpt } =
    post;
  const resolvedImage = resolveImageUrl(image);

  return (
    <section className="featured-post py-5">
      <div className="container">
        <div className="featured-badge mb-4" data-aos="fade-up">
          <i className="bi bi-star-fill me-2"></i>
          អត្ថបទលេចធ្លោ
        </div>

        <div
          className="card featured-card-modern border-0 shadow-lg overflow-hidden p-0"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row g-0">
            {/* Left image */}
            <div className="col-lg-6">
              <div className="featured-img-wrapper h-100">
                <span className="featured-tag-modern">អត្ថបទពិសេស</span>
                <img
                  src={resolvedImage}
                  alt={title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>

            {/* Right content */}
            <div className="col-lg-6 bg-white">
              <div className="card-body p-lg-5 p-4">
                <div className="mb-4 d-flex align-items-center gap-3">
                  <span className="badge-modern-category-static">
                    {category?.label || category}
                  </span>
                  <div className="text-muted small d-flex align-items-center gap-3">
                    <span>
                      <i className="bi bi-calendar3 me-1"></i>
                      {date}
                    </span>
                    <span>
                      <i className="bi bi-clock me-1"></i>
                      {readTime}
                    </span>
                  </div>
                </div>

                <h2 className="featured-title-modern fw-bold mb-4">{title}</h2>

                <p
                  className="featured-excerpt-modern text-muted mb-4"
                  style={{ lineHeight: "1.8" }}
                >
                  {excerpt}
                </p>

                <div className="d-flex align-items-center mb-5">
                  <Image
                    src="/images/homepage/about_02.jpg"
                    alt="សុខ សុភ័ក្រ"
                    className="rounded-circle me-3 flex-shrink-0"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">សុខ សុភ័ក្រ</h6>
                    <small className="text-muted">ស្ម័គ្រចិត្តការបង្រៀន</small>
                  </div>
                </div>

                <Link
                  href={`/blogs/${id}`}
                  className="btn btn-modern-action px-5 py-3 fw-bold"
                >
                  អានអត្ថបទលម្អិត <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
