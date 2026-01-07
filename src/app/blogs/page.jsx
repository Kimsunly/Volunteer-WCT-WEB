// src/app/blogs/page.jsx
"use client";

import React, { useMemo, useState } from "react";
import { BlogHero, BlogFilter, FeaturedPost, BlogGrid } from "./components";

/**
 * Static posts array (mock). Later you will fetch from API.
 * Categories: education | environment | health | community
 */
const POSTS = [
  {
    id: "p1",
    category: { id: "education", label: "អប់រំ" },
    badgeClass: "bg-primary",
    image: "/images/opportunities/Education/card-8/img-2.png",
    date: "02 មករា 2026",
    readTime: "4 នាទី",
    title: "ការអភិវឌ្ឍន៍ជំនាញភាសាអង់គ្លេសសម្រាប់កុមារ",
    excerpt:
      "យុទ្ធសាស្រ្តនិងវិធីសាស្រ្តដ៏ល្អក្នុងការបង្រៀនភាសាអង់គ្លេសដល់កុមារ ដើម្បីឱ្យពួកគេមានមូលដ្ឋានរឹងមាំនិងចាប់អារម្មណ៍ក្នុងការរៀន។",
  },
  {
    id: "p2",
    category: { id: "environment", label: "បរិស្ថាន" },
    badgeClass: "bg-success",
    image: "/images/opportunities/Environment/card-11/img-1.png",
    date: "01 មករា 2026",
    readTime: "6 នាទី",
    title: "ការការពារបរិស្ថាន៖ តួនាទីរបស់យុវជន",
    excerpt:
      "យុវជនអាចចូលរួមវិវឌ្ឍន៍ការការពារបរិស្ថានដ៏សំខាន់ តាមរយៈការចូលរួមក្នុងសកម្មភាពអភិរក្សធម្មជាតិនិងការកាត់បន្ថយកាកសំណល់។",
  },
  {
    id: "p3",
    category: { id: "health", label: "សុខភាព" },
    badgeClass: "bg-danger",
    image: "/images/opportunities/Health/card-14/img-1.png",
    date: "31 ធ្នូ 2025",
    readTime: "5 នាទី",
    title: "ការថែទាំសុខភាពនៅតំបន់ជនបទ",
    excerpt:
      "គន្លឹះសំខាន់ៗក្នុងការផ្តល់សេវាសុខភាពនៅតំបន់ជនបទ និងរបៀបដែលស្ម័គ្រចិត្តអាចជួយបង្កើនការចូលដំណើរការសេវាសុខភាព។",
  },
  {
    id: "p4",
    category: { id: "community", label: "សហគមន៍" },
    badgeClass: "bg-warning",
    image: "/images/opportunities/Childcare/card-15/img-1.png",
    date: "30 ធ្នូ 2025",
    readTime: "7 នាទី",
    title: "ការកសាងសហគមន៍ធំមួយតាមរយៈស្ម័គ្រចិត្ត",
    excerpt:
      "របៀបដែលកម្មវិធីស្ម័គ្រចិត្តអាចជួយកសាងទំនាក់ទំនងរវាងមនុស្ស និងបង្កើតសហគមន៍ដ៏រឹងមាំនិងមានការចូលរួមយ៉ាងសកម្ម។",
  },
  {
    id: "p5",
    category: { id: "education", label: "អប់រំ" },
    badgeClass: "bg-primary",
    image: "/images/opportunities/Education/English teaching/image-1.png",
    date: "29 ធ្នូ 2025",
    readTime: "3 នាទី",
    title: "ការប្រើប្រាស់បច្ចេកវិទ្យាក្នុងការបង្រៀន",
    excerpt:
      "យុគសម័យឌីជីថលផ្តល់ឱកាសថ្មីៗក្នុងការបង្រៀន។ រៀនពីរបៀបប្រើឧបករណ៍ឌីជីថលដើម្បីបង្កើតបទពិសោធន៍សិក្សាកាន់តែល្អ។",
  },
  {
    id: "p6",
    category: { id: "environment", label: "បរិស្ថាន" },
    badgeClass: "bg-success",
    image: "/images/opportunities/Environment/card-16/img-2.png",
    date: "28 ធ្នូ 2025",
    readTime: "5 នាទី",
    title: "ការដាំដើមឈើសម្រាប់អនាគតបៃតង",
    excerpt:
      "សារៈសំខាន់នៃការដាំដើមឈើនិងការអភិរក្សព្រៃឈើ ក្នុងការប្រយុទ្ធប្រឆាំងនឹងការប្រែប្រួលអាកាសធាតុនិងការការពារជីវចម្រុះ។",
  },
];

export default function BlogsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // initial number of cards shown

  // Filter + search
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return POSTS.filter((p) => {
      const matchFilter = filter === "all" || p.category.id === filter;
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  // Slice for load-more
  const visiblePosts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const onLoadMore = () => {
    // Simulate load more. If no more posts, show an alert.
    if (visibleCount >= filtered.length) {
      alert("គ្មានអត្ថបទថ្មីៗដែលអាចដាក់ទាំងបាន!");
      return;
    }
    setVisibleCount((n) => n + 3);
  };

  return (
    <main className="blog-page">
      {/* Hero */}
      <BlogHero />

      {/* Filter & Search */}
      <BlogFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        searchTerm={search}
        onSearchChange={setSearch}
      />

      {/* Featured */}
      <FeaturedPost />

      {/* Grid */}
      <BlogGrid posts={visiblePosts} />

      {/* Load more */}
      <section>
        <div className="container">
          <div className="text-center mt-5" data-aos="fade-up">
            <button
              className="btn btn-primary btn-lg px-5"
              onClick={onLoadMore}
            >
              <i className="bi bi-arrow-down-circle me-2"></i>ដាក់បន្ថែម
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
