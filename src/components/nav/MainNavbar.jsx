"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TopHeader from "./TopHeader";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import InlineSearchBar from "./InlineSearchBar";
import BecomeOrganizerModal from "../modals/BecomeOrganizerModal";
import { useState } from "react";

export default function MainNavbar() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showOrgModal, setShowOrgModal] = useState(false);

  const getDashboardUrl = () => {
    switch (user?.role) {
      case "user":
        return "/user-profile";
      case "organizer":
        return "/organizer";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  // Helper function to check if nav item is active
  const isActive = (path) => {
    return pathname === path;
  };

  const handleMobileNav = (url) => {
    if (typeof window !== "undefined") {
      // Find the native close button and trigger click to trigger Bootstrap close animations
      const closeBtn = document.getElementById("offcanvasCloseBtn");
      if (closeBtn) {
        closeBtn.click();
      }
      
      // Safety clean up for overlay backdrops and overflow styles
      setTimeout(() => {
        const backdrops = document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop");
        backdrops.forEach((el) => el.remove());
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.body.classList.remove("offcanvas-open", "modal-open");
      }, 150);
    }
    if (url) {
      router.push(url);
    }
  };

  return (
    <>
      <header className="fixed-top shadow-sm">
        <TopHeader />

        <nav
          className="navbar navbar-expand-lg border-top"
          style={{
            backgroundColor: "var(--navabr)",
            borderColor: "var(--border) !important",
          }}
        >
          <div className="container py-0">
            {/* Mobile Logo */}
            <Link
              className="navbar-brand d-lg-none d-flex align-items-center"
              href="/"
              style={{ color: "var(--primary-color)" }}
            >
              <Image
                src="/logos/logo.png"
                alt="Logo"
                width={35}
                height={35}
                className="me-2"
                style={{ borderRadius: "4px" }}
              />
              <span className="fw-bold">ស្ម័គ្រចិត្ត</span>
            </Link>

            {/* Desktop Navigation - Only show on large screens */}
            <div className="d-none d-lg-flex mx-auto">
              <ul className="navbar-nav landing-nav">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                    href="/"
                  >
                    ទំព័រដើម
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/opportunities") ? "active" : ""}`}
                    href="/opportunities"
                  >
                    ការងារស្ម័គ្រចិត្ត
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/community") ? "active" : ""}`}
                    href="/community"
                  >
                    សហគមន៍
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/blogs") ? "active" : ""}`}
                    href="/blogs"
                  >
                    អត្ថបទ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/donation") ? "active" : ""}`}
                    href="/donation"
                  >
                    បរិច្ចាក
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center ms-auto gap-3">
              {/* Inline Search Bar */}
              <div className="d-none d-lg-block">
                <InlineSearchBar />
              </div>

              {/* Notification & Profile (Only if logged in) */}
              {!loading && user && (
                <>
                  <NotificationDropdown />
                  <ProfileDropdown
                    onBecomeOrganizer={() => setShowOrgModal(true)}
                  />
                </>
              )}

              {/* Authentication Buttons - Desktop Only */}
              {!loading && !user && (
                <ul className="nav-authentication d-none d-lg-flex m-0 list-unstyled align-items-center gap-2">
                  <li>
                    <Link href="/auth/login" className="login">
                      ចូលគណនី
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="sign-up">
                      បង្កើតគណនី
                    </Link>
                  </li>
                </ul>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="btn navbar-toggler ms-2 border-0 d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
                style={{
                  padding: "0",
                  marginInline: "20px",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-list"
                  style={{ color: "var(--text-black)", fontSize: "28px" }}
                ></i>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Offcanvas Menu */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <Image
                src="/logos/logo.png"
                alt="Logo"
                width={32}
                height={32}
                style={{ borderRadius: "6px" }}
              />
              <span className="fw-bold fs-5 brand-title">ស្ម័គ្រចិត្ត</span>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              id="offcanvasCloseBtn"
            ></button>
          </div>

          <div className="offcanvas-body px-4 py-4">
            {/* User Profile Card */}
            {!loading && user && (
              <div className="user-profile-menu-card p-3 rounded-4 mb-4 d-flex align-items-center gap-3">
                <div className="position-relative flex-shrink-0">
                  <Image
                    src={user.avatar_url || user.profileImage || "/images/ORG/computer-icons-user-profile-circle-abstract.jpg"}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="rounded-circle border border-2 border-accent"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
                </div>
                <div className="min-width-0 flex-grow-1">
                  <h6 className="mb-0 fw-bold text-primary-theme text-truncate">
                    {(user.first_name && user.last_name)
                      ? `${user.first_name} ${user.last_name}`
                      : (user.name || "អ្នកប្រើប្រាស់")}
                  </h6>
                  <span className="small text-secondary-theme text-truncate d-block mb-1">{user.email}</span>
                  <span className="badge status-badge-active">
                    {user.role === "admin" ? "Admin" : user.role === "organizer" ? "Organizer" : (user.volunteer_level || "Bronze Volunteer")}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="mobile-nav-list d-flex flex-column gap-1">
              <button
                className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}
                onClick={() => handleMobileNav("/")}
              >
                <i className="bi bi-house-door-fill"></i>
                <span>ទំព័រដើម</span>
              </button>

              <button
                className={`mobile-nav-item ${isActive("/opportunities") ? "active" : ""}`}
                onClick={() => handleMobileNav("/opportunities")}
              >
                <i className="bi bi-briefcase-fill"></i>
                <span>ការងារស្ម័គ្រចិត្ត</span>
              </button>

              <button
                className={`mobile-nav-item ${isActive("/community") ? "active" : ""}`}
                onClick={() => handleMobileNav("/community")}
              >
                <i className="bi bi-people-fill"></i>
                <span>សហគមន៍</span>
              </button>

              <button
                className={`mobile-nav-item ${isActive("/blogs") ? "active" : ""}`}
                onClick={() => handleMobileNav("/blogs")}
              >
                <i className="bi bi-file-text-fill"></i>
                <span>អត្ថបទ</span>
              </button>

              <button
                className={`mobile-nav-item ${isActive("/donation") ? "active" : ""}`}
                onClick={() => handleMobileNav("/donation")}
              >
                <i className="bi bi-heart-fill"></i>
                <span>បរិច្ចាក</span>
              </button>
            </div>

            <hr className="my-4 border-secondary border-opacity-25" />

            {/* Mobile Auth / Profile Section */}
            {!loading && user && (
              <div className="mobile-nav-list d-flex flex-column gap-1">
                <button
                  className={`mobile-nav-item ${isActive(getDashboardUrl()) ? "active" : ""}`}
                  onClick={() => handleMobileNav(getDashboardUrl())}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>គណនីរបស់ខ្ញុំ</span>
                </button>

                <button
                  className={`mobile-nav-item ${isActive("/settings") ? "active" : ""}`}
                  onClick={() => handleMobileNav("/settings")}
                >
                  <i className="bi bi-gear-fill"></i>
                  <span>ការកំណត់</span>
                </button>

                {user.role === "user" && (
                  <button
                    className="mobile-nav-item text-primary"
                    onClick={() => {
                      const closeBtn = document.getElementById("offcanvasCloseBtn");
                      if (closeBtn) closeBtn.click();
                      setShowOrgModal(true);
                    }}
                  >
                    <i className="bi bi-briefcase-fill text-primary"></i>
                    <span>ក្លាយជាអ្នករៀបចំ</span>
                  </button>
                )}

                <button
                  className="mobile-nav-item text-danger"
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST" });
                    } finally {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("role");
                      document.cookie = "authToken=; path=/; max-age=0";
                      document.cookie = "role=; path=/; max-age=0";
                      setUser(null);
                      handleMobileNav("/");
                    }
                  }}
                >
                  <i className="bi bi-box-arrow-left text-danger"></i>
                  <span>ចាកចេញ</span>
                </button>
              </div>
            )}

            {!loading && !user && (
              <div className="mobile-nav-auth d-flex flex-column gap-2 mt-2">
                <button
                  className="btn btn-outline-theme w-100 py-2.5 rounded-3 fw-bold"
                  onClick={() => handleMobileNav("/auth/login")}
                >
                  ចូលគណនី
                </button>
                <button
                  className="btn btn-theme w-100 py-2.5 rounded-3 fw-bold"
                  onClick={() => handleMobileNav("/auth/register")}
                >
                  បង្កើតគណនី
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <BecomeOrganizerModal
        open={showOrgModal}
        onClose={() => setShowOrgModal(false)}
      />
    </>
  );
}
