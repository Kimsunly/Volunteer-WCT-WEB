"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function BlogHero() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  return (
    <section className="blog-hero">
      <div className="container">
        <div className="row align-items-center">
          {/* Left */}
          <div className="col-lg-6" data-aos="fade-right">
            <span className="blog-badge">
              <i className="bi bi-lightbulb-fill me-2"></i>
              អត្ថបទ និងព័ត៌មាន
            </span>
            <h1 className="blog-hero-title">
              រៀនស្វែងយល់ពីរបៀបរួមចំណែក
              <br />
              សម្រាប់ស្ម័គ្រចិត្ត
            </h1>
            <p className="blog-hero-subtitle">
              រកមើលគន្លឹះ និងការណែនាំពិសេសៗអំពីការងារស្ម័គ្រចិត្ត
              ការអភិវឌ្ឍន៍សង្គម
              និងរបៀបដែលអ្នកអាចបង្កើតការផ្លាស់ប្តូរវិជ្ជមានក្នុងសហគមន៍របស់អ្នក។
            </p>

            <div className="blog-stats mt-4 mb-4">
              <div className="stat-item">
                <h3>150+</h3>
                <p>អត្ថបទ</p>
              </div>
              <div className="stat-item">
                <h3>50K+</h3>
                <p>អ្នកអាន</p>
              </div>
              <div className="stat-item">
                <h3>12</h3>
                <p>ប្រភេទ</p>
              </div>
            </div>

            {isAdmin && (
              <div className="admin-actions mt-4">
                <Link
                  href="/admin/blogs"
                  className="btn btn-primary btn-lg rounded-pill shadow-sm px-4"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  បង្កើតអត្ថបទថ្មី
                </Link>
              </div>
            )}
          </div>

          {/* Right image */}
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
            <div className="blog-hero-image">
              <img
                src="/images/homepage/cta-ipad.png"
                alt="Volunteer App Preview"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
