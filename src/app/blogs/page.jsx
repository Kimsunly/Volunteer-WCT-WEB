'use client';

import React, { useMemo, useState, useEffect } from "react";
import { BlogHero, BlogFilter, FeaturedPost, BlogGrid } from "./components";
import { listBlogs } from "@/services/blogs";
import Skeleton from "@/components/common/Skeleton";
import toast from "react-hot-toast";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const data = await listBlogs({ published_only: true });

        // Map backend blogs to UI expectation
        const mapped = (data || []).map(b => ({
          id: b.id,
          category: {
            id: b.category?.toLowerCase().replace(/\s+/g, '-') || 'other',
            label: b.category || 'ផ្សេងៗ'
          },
          badgeClass: b.category === "Education" ? "bg-primary" :
            b.category === "Environment" ? "bg-success" :
              b.category === "Health" ? "bg-danger" : "bg-warning",
          image: b.image || "/images/opportunities/Education/card-8/img-2.png",
          date: new Date(b.created_at).toLocaleDateString('km-KH', { day: '2-digit', month: 'long', year: 'numeric' }),
          readTime: b.read_time || "5 នាទី",
          title: b.title,
          excerpt: b.content?.substring(0, 120) + "..." || "",
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("បរាជ័យក្នុងការទាញយកអត្ថបទ");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Filter + search
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((p) => {
      const matchFilter = filter === "all" || p.category.id === filter;
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });
  }, [posts, filter, search]);

  // Slice for load-more
  const visiblePosts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const onLoadMore = () => {
    if (visibleCount >= filtered.length) {
      toast.error("គ្មានអត្ថបទថ្មីៗដែលអាចដាក់ទាំងបាន!");
      return;
    }
    setVisibleCount((n) => n + 3);
  };

  if (loading) return (
    <main className="blog-page">
      <div className="container py-5 mt-5">
        <div className="row g-4 mt-5">
          <div className="col-12 mb-4">
            <Skeleton variant="card" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="col-md-6 col-lg-4" key={i}>
              <Skeleton variant="card" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  return (
    <main className="blog-page">
      <BlogHero />

      <BlogFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        searchTerm={search}
        onSearchChange={setSearch}
      />

      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {/* Featured - Use first filtered post if available */}
      {filtered.length > 0 && (
        <FeaturedPost post={filtered[0]} />
      )}

      {/* Grid - excluding the featured if needed, but for now just show all visible */}
      <BlogGrid posts={visiblePosts} />

      {/* Load more */}
      {filtered.length > visibleCount && (
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
      )}
    </main>
  );
}
