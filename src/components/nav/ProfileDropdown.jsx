"use client";
import { useAuth } from "@/context/AuthContext";
import { logout as apiLogout } from "@/lib/services/auth";
import { clearAuth } from "@/lib/utils/authState";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileDropdown() {
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
        <li>
          <Link className="dropdown-item" href={getDashboardUrl()}>
            <i className="bi bi-person-circle"></i>
            <span className="ps-2">មើលគណនី</span>
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/settings">
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
