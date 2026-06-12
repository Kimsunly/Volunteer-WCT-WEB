"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getBlogById } from "@/services/blogs";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const data = await getBlogById(id);
          setBlog(data);
        } catch (err) {
          console.error("Fetch blog detail error:", err);
          setError("បរាជ័យក្នុងការទាញយកព័ត៌មានប្លុក");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const getBadgeClass = (category) => {
    return category === "Education"
      ? "bg-primary"
      : category === "Environment"
        ? "bg-success"
        : category === "Health"
          ? "bg-danger"
          : category === "Childcare"
            ? "bg-warning"
            : category === "Community"
              ? "bg-info"
              : "bg-secondary";
  };

  if (loading) {
    return <></>;
  }

  if (error || !blog) {
    return <></>;
  }

  return (
    <>
      <main className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/blogs">Blogs</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {blog.title}
                </li>
              </ol>
            </nav>

            <article className="blog-detail">
              <header className="mb-4">
                <span className={`badge ${getBadgeClass(blog.category)} mb-2`}>
                  {blog.category}
                </span>
                <h1 className="fw-bold mb-3">{blog.title}</h1>
                <div className="text-muted d-flex align-items-center gap-3">
                  <span>
                    <i className="bi bi-calendar me-1"></i>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    <i className="bi bi-person me-1"></i>
                    {blog.author || "Admin"}
                  </span>
                </div>
              </header>

              <div
                className="position-relative mb-4"
                style={{ height: "400px" }}
              >
                <Image
                  src={
                    blog.image &&
                    (resolveImageUrl(blog.image).startsWith("http") ||
                      resolveImageUrl(blog.image).startsWith("/"))
                      ? resolveImageUrl(blog.image)
                      : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={blog.title}
                  fill
                  className="rounded shadow-sm"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div
                className="blog-content fs-5"
                style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}
              >
                {blog.content}
              </div>

              <hr className="my-5" />

              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="share-buttons">
                  <span className="me-3 fw-bold">Share:</span>
                  <button className="btn btn-outline-secondary btn-sm rounded-circle me-2">
                    <i className="bi bi-facebook"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm rounded-circle me-2">
                    <i className="bi bi-twitter"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm rounded-circle">
                    <i className="bi bi-link-45deg"></i>
                  </button>
                </div>
                <Link href="/blogs" className="btn btn-outline-primary">
                  មើលប្លុកផ្សេងទៀត
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
