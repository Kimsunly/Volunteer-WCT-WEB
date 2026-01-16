import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  const { id, category, badgeClass, image, date, readTime, title, excerpt } = post;

  return (
    <section className="featured-post py-5">
      <div className="container">
        <div className="featured-badge mb-4" data-aos="fade-up">
          <i className="bi bi-star-fill me-2"></i>
          អត្ថបទលេចធ្លោ
        </div>

        <div
          className="card featured-card border-0 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row g-0">
            {/* Left image */}
            <div className="col-lg-6">
              <div className="featured-img h-100">
                <span className="featured-tag">ពិសេស</span>
                <img
                  src={image}
                  alt={title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>

            {/* Right content */}
            <div className="col-lg-6">
              <div className="card-body p-5">
                <div className="mb-3">
                  <span className={`badge ${badgeClass || "bg-primary"} me-2`}>
                    {category?.label || category}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-calendar me-1"></i>{date}
                  </span>
                  <span className="text-muted small ms-3">
                    <i className="bi bi-clock me-1"></i>{readTime}
                  </span>
                </div>

                <h2 className="featured-title">
                  {title}
                </h2>

                <p className="featured-excerpt">
                  {excerpt}
                </p>

                <div className="d-flex align-items-center mt-4">
                  <Image
                    src="/images/homepage/about_02.jpg"
                    alt="សុខ សុភ័ក្រ"
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h6 className="mb-0">សុខ សុភ័ក្រ</h6>
                    <small className="text-muted">ស្ម័គ្រចិត្តការបង្រៀន</small>
                  </div>
                </div>

                <Link href={`/blogs/${id}`} className="btn btn-primary px-4 mt-4">
                  អានបន្ថែម <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
