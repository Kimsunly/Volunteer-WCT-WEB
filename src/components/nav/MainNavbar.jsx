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
        return "/user";
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
          <div className="container py-1">
            {/* Mobile Logo */}
            <Link
              className="navbar-brand d-lg-none d-flex align-items-center"
              href="/"
              style={{ color: "var(--text-black)" }}
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
                <ul className="nav-authentication d-none d-lg-flex m-0 list-unstyled align-items-center">
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
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              ម៉េនុយ
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  href="/"
                  data-bs-dismiss="offcanvas"
                >
                  ទំព័រដើម
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/opportunities") ? "active" : ""}`}
                  href="/opportunities"
                  data-bs-dismiss="offcanvas"
                >
                  ការងារស្ម័គ្រចិត្ត
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/community") ? "active" : ""}`}
                  href="/community"
                  data-bs-dismiss="offcanvas"
                >
                  សហគមន៍
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/blogs") ? "active" : ""}`}
                  href="/blogs"
                  data-bs-dismiss="offcanvas"
                >
                  អត្ថបទ
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/donation") ? "active" : ""}`}
                  href="/donation"
                  data-bs-dismiss="offcanvas"
                >
                  បរិច្ចាក
                </Link>
              </li>

              <hr className="my-3" />

              {/* Mobile Auth Section */}
              {!loading && user && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href={getDashboardUrl()}
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      គណនីរបស់ខ្ញុំ
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/settings"
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-gear me-2"></i>
                      ការកំណត់
                    </Link>
                  </li>
                  {user.role === "user" && (
                    <li className="nav-item">
                      <button
                        className="nav-link text-primary"
                        onClick={() => {
                          setShowOrgModal(true);
                          // Close offcanvas if possible - might need a data-bs-dismiss on a button
                        }}
                        data-bs-dismiss="offcanvas"
                        style={{
                          border: "none",
                          background: "none",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <i className="bi bi-briefcase me-2"></i>
                        ក្លាយជាអ្នករៀបចំ
                      </button>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className="nav-link text-danger"
                      onClick={async () => {
                        try {
                          await fetch("/api/auth/logout", { method: "POST" });
                        } finally {
                          localStorage.removeItem("authToken");
                          localStorage.removeItem("role");
                          document.cookie = "authToken=; path=/; max-age=0";
                          document.cookie = "role=; path=/; max-age=0";
                          setUser(null);
                          router.push("/");
                        }
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i>
                      ចាកចេញ
                    </button>
                  </li>
                </>
              )}

              {!loading && !user && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/auth/login"
                      data-bs-dismiss="offcanvas"
                    >
                      ចូលគណនី
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/auth/register"
                      data-bs-dismiss="offcanvas"
                    >
                      បង្កើតគណនី
                    </Link>
                  </li>
                </>
              )}
            </ul>
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
