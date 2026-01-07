
import React from "react";
import BlogCard from "./BlogCard";

export default function BlogGrid({ posts }) {
  return (
    <section className="blog-grid py-5">
      <div className="container">
        <h2 className="section-title text-center mb-5" data-aos="fade-up">
          អត្ថបទថ្មីៗទាំងអស់
        </h2>

        <div className="row g-4" id="blogGrid">
          {posts.map((p, idx) => (
            <div
              key={p.id}
              className="col-md-6 col-lg-4 blog-item"
              data-category={p.category.id}
              data-aos="fade-up"
              data-aos-delay={idx % 6 === 0 ? 0 : (idx % 6) * 100}
            >
              <BlogCard post={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
