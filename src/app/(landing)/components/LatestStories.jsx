"use client";

import Link from "next/link";
import SafeDate from "@/components/common/SafeDate";

export default function LatestStories({ blogs = [] }) {
  // Use mock blogs if no blogs are loaded or returned
  const defaultBlogs = [
    {
      id: "1",
      title: "បទពិសោធន៍ស្ម័គ្រចិត្តបង្រៀនកុមារនៅសហគមន៍ជនបទ",
      excerpt: "ការនាំមកនូវក្តីសង្ឃឹម និងការអប់រំដល់កុមារនៅសាលារៀនដាច់ស្រយាលក្នុងខេត្តរតនគិរី...",
      image: "/images/even-soon/detail_01.jpg",
      created_at: "2026-06-10",
      category: "Education",
      author: {
        name: "សុខ ពិសិដ្ឋ",
        avatar: "/images/profile.png"
      }
    },
    {
      id: "2",
      title: "យុទ្ធនាការដាំកូនឈើការពារភពផែនដី និងការកែប្រែឆ្នេរខ្សាច់",
      excerpt: "យុវជនជាង ១០០ នាក់បានចូលរួមរួមគ្នាក្នុងកម្មវិធីដាំកូនឈើកោងកាង និងសម្អាតឆ្នេរខេត្តកែប...",
      image: "/images/even-soon/detail_02.jpg",
      created_at: "2026-06-05",
      category: "Environment",
      author: {
        name: "ចាន់ ស្រីនី",
        avatar: "/images/profile.png"
      }
    },
    {
      id: "3",
      title: "ការផ្តល់ជំនួយ និងការបង្កើតសេវាកម្មសុខភាពសហគមន៍",
      excerpt: "ក្រុមកងទ័ពអាវសស្ម័គ្រចិត្ត បានចុះជួយពិនិត្យសុខភាពដោយឥតគិតថ្លៃដល់ពលរដ្ឋជាង ៣០០នាក់...",
      image: "/images/even-soon/detail_03.jpg",
      created_at: "2026-05-28",
      category: "Healthcare",
      author: {
        name: "លី ម៉េង",
        avatar: "/images/profile.png"
      }
    }
  ];

  const itemsToDisplay = blogs && blogs.length > 0 ? blogs.slice(0, 3) : defaultBlogs;

  return (
    <section className="latest-stories-section py-5 position-relative">
      <div className="container">
        <div className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3">
          <div>
            <span className="stories-badge mb-2">អត្ថបទ និងរឿងរ៉ាវគួរឱ្យចាប់អារម្មណ៍</span>
            <h2 className="section-title mb-0">រឿងរ៉ាវពីការធ្វើការងារស្ម័គ្រចិត្ត</h2>
          </div>
          <Link href="/blogs" className="stories-view-all">
            អានអត្ថបទទាំងអស់ <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        <div className="row g-4">
          {itemsToDisplay.map((blog, idx) => (
            <div key={blog.id || idx} className="col-12 col-md-6 col-lg-4">
              <article className="story-card">
                <div className="story-card-img-wrap">
                  <img
                    src={blog.image || "/images/placeholder.png"}
                    alt={blog.title}
                    className="story-card-img"
                  />
                  <span className="story-card-tag">
                    {blog.category || "ស្ម័គ្រចិត្ត"}
                  </span>
                </div>
                
                <div className="story-card-body">
                  <div className="story-card-meta mb-2">
                    <span className="story-meta-date">
                      <i className="bi bi-calendar3 me-2"></i>
                      <SafeDate dateString={blog.created_at} />
                    </span>
                  </div>
                  
                  <h3 className="story-card-title mb-3">
                    <Link href={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </h3>
                  
                  <p className="story-card-excerpt mb-4">
                    {blog.excerpt || (blog.content ? blog.content.substring(0, 100) + "..." : "")}
                  </p>
                  
                  <div className="story-card-footer">
                    <div className="story-author">
                      <div className="story-author-avatar-placeholder">
                        {blog.author?.name ? blog.author.name.substring(0, 1) : "U"}
                      </div>
                      <span className="story-author-name">
                        {blog.author?.name || "អ្នកនិពន្ធ"}
                      </span>
                    </div>
                    <Link href={`/blogs/${blog.id}`} className="story-read-link">
                      អានបន្ត <i className="bi bi-chevron-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
