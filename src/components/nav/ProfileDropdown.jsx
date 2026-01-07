"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      document.cookie = "authToken=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";
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
          src={user.profileImage || "/images/profile.png"}
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
          <a className="dropdown-item" href={getDashboardUrl()}>
            <i className="bi bi-person-circle"></i>
            <span className="ps-2">មើលគណនី</span>
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="/settings">
            <i className="bi bi-gear"></i>
            <span className="ps-2">ការកំណត់</span>
          </a>
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
