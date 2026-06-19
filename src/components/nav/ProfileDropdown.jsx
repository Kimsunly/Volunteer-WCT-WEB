"use client";
import { useAuth } from "@/context/AuthContext";
import { logout as apiLogout } from "@/lib/services/auth";
import { clearAuth } from "@/lib/utils/authState";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileDropdown({ onBecomeOrganizer }) {
  const { user, setUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const getDashboardUrl = () => {
    switch (user?.role) {
      case "organizer":
        return "/organizer/profile";
      case "admin":
        return "/admin";
      case "user":
      default:
        return "/user-profile";
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setUser(null);
      router.push("/");
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn border-0 p-0"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src={user.avatar_url || user.profileImage || "/images/profile.png"}
          alt={user.name}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <li className="px-3 py-2 border-bottom" style={{ minWidth: "200px" }}>
          <div className="fw-bold text-truncate text-primary-theme" style={{ maxWidth: "180px", fontSize: "14px" }}>
            {user.name}
          </div>
          <div className="text-muted small text-truncate" style={{ maxWidth: "180px", fontSize: "12px" }}>
            {user.email}
          </div>
          {user.role === "user" && user.status === "pending" && (
            <span className="badge bg-warning-subtle text-warning mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "10.5px", whiteSpace: "normal", textAlign: "left" }}>
              <i className="bi bi-clock-history"></i> រង់ចាំការអនុម័តជាអ្នករៀបចំ
            </span>
          )}
        </li>
        <li>
          <Link className="dropdown-item" href={getDashboardUrl()}>
            <i className="bi bi-person-circle"></i>
            <span className="ps-2">មើលគណនី</span>
          </Link>
        </li>
        {user.role === "user" && (
          <li>
            <button
              className="dropdown-item text-primary"
              onClick={(e) => {
                e.preventDefault();
                onBecomeOrganizer();
              }}
              style={{
                border: "none",
                background: "none",
                width: "100%",
                textAlign: "left",
              }}
            >
              {user.status === "pending" ? (
                <>
                  <i className="bi bi-hourglass-split text-warning"></i>
                  <span className="ps-2 text-warning fw-semibold">កំពុងពិនិត្យការស្នើសុំ</span>
                </>
              ) : (
                <>
                  <i className="bi bi-briefcase"></i>
                  <span className="ps-2">ក្លាយជាអ្នករៀបចំ</span>
                </>
              )}
            </button>
          </li>
        )}
        <li>
          <Link className="dropdown-item" href="/user-profile">
            <i className="bi bi-gear"></i>
            <span className="ps-2">ការកំណត់</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
            style={{
              border: "none",
              background: "none",
              textAlign: "left",
              width: "100%",
            }}
          >
            <i className="bi bi-box-arrow-left"></i>
            <span className="ps-2">ចាកចេញ</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
