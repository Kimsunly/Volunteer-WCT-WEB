"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyOrganizerApplication } from "@/services/organizer";
import { getMyApplications } from "@/services/applications";
import Link from "next/link";

function formatNotificationDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildOrganizerAppNotification(app, userId, refreshUser) {
  const isRead =
    localStorage.getItem(`org-app-read-${app.status}-${userId}`) === "true";

  if (app.status === "verified") {
    if (typeof refreshUser === "function") {
      refreshUser();
    }
    return {
      id: "org-app-approved",
      kind: "org-app",
      orgStatus: "verified",
      type: "success",
      icon: "/images/Icon/mark.png",
      title: "ការស្នើសុំជាអ្នករៀបចំកម្មវិធី",
      message:
        "ការស្នើសុំក្លាយជាអ្នករៀបចំកម្មវិធីរបស់អ្នកត្រូវបានអនុម័តរួចហើយ!",
      time: formatNotificationDate(app.updated_at || app.created_at),
      read: isRead,
      href: "/organizer",
    };
  }

  if (app.status === "rejected") {
    return {
      id: "org-app-rejected",
      kind: "org-app",
      orgStatus: "rejected",
      type: "danger",
      icon: "/images/Icon/setting.png",
      title: "ការស្នើសុំជាអ្នករៀបចំកម្មវិធី",
      message: `ការស្នើសុំត្រូវបានបដិសេធ៖ ${app.rejection_reason || "ព័ត៌មានមិនគ្រប់គ្រាន់"}`,
      time: formatNotificationDate(app.updated_at || app.created_at),
      read: isRead,
      href: "/organizer",
    };
  }

  if (app.status === "pending") {
    return {
      id: "org-app-pending",
      kind: "org-app",
      orgStatus: "pending",
      type: "info",
      icon: "/images/Icon/setting.png",
      title: "ការស្នើសុំជាអ្នករៀបចំកម្មវិធី",
      message: "ការស្នើសុំរបស់អ្នកកំពុងស្ថិតក្នុងការពិនិត្យមើលពី Admin...",
      time: formatNotificationDate(app.created_at),
      read: isRead,
      href: "/organizer",
    };
  }

  return null;
}

function buildOpportunityAppNotifications(apps, userId) {
  return apps
    .filter((app) => app.status === "approved" || app.status === "rejected")
    .map((app) => {
      const isApproved = app.status === "approved";
      const oppTitle =
        app.opportunity_title ||
        app.opportunity?.title ||
        `ឱកាស #${app.opportunity_id}`;
      const isRead =
        localStorage.getItem(
          `opp-app-read-${app.id}-${app.status}-${userId}`,
        ) === "true";

      return {
        id: `opp-app-${app.id}-${app.status}`,
        kind: "opp-app",
        appId: app.id,
        appStatus: app.status,
        type: isApproved ? "success" : "danger",
        icon: isApproved
          ? "/images/Icon/mark.png"
          : "/images/Icon/setting.png",
        title: "ការដាក់ពាក្យឱកាស",
        message: isApproved
          ? `ការដាក់ពាក្យរបស់អ្នកសម្រាប់ "${oppTitle}" ត្រូវបានអនុម័តរួចហើយ!`
          : `ការដាក់ពាក្យរបស់អ្នកសម្រាប់ "${oppTitle}" ត្រូវបានបដិសេធ។`,
        time: formatNotificationDate(app.reviewed_at || app.updated_at),
        read: isRead,
        href: "/user-profile",
        sortAt: new Date(app.reviewed_at || app.updated_at || 0).getTime(),
      };
    })
    .sort((a, b) => b.sortAt - a.sortAt);
}

export default function NotificationDropdown() {
  const { user, refreshUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const next = [];

    try {
      const orgRes = await getMyOrganizerApplication();
      const orgApp = orgRes?.data;
      if (orgApp) {
        const orgNotification = buildOrganizerAppNotification(
          orgApp,
          user.id,
          refreshUser,
        );
        if (orgNotification) {
          next.push(orgNotification);
        }
      }
    } catch {
      // No organizer application — expected for most volunteers
    }

    try {
      const appsRes = await getMyApplications({ limit: 50, offset: 0 });
      const oppNotifications = buildOpportunityAppNotifications(
        appsRes?.data || [],
        user.id,
      );
      next.push(...oppNotifications);
    } catch (err) {
      console.error("Error fetching application notifications:", err);
    }

    setNotifications(next);
  }, [user, refreshUser]);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (notification) => {
    if (notification.kind === "org-app") {
      localStorage.setItem(
        `org-app-read-${notification.orgStatus}-${user.id}`,
        "true",
      );
    } else if (notification.kind === "opp-app") {
      localStorage.setItem(
        `opp-app-read-${notification.appId}-${notification.appStatus}-${user.id}`,
        "true",
      );
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n,
      ),
    );
  };

  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (notification.kind === "org-app") {
        localStorage.setItem(
          `org-app-read-${notification.orgStatus}-${user.id}`,
          "true",
        );
      } else if (notification.kind === "opp-app") {
        localStorage.setItem(
          `opp-app-read-${notification.appId}-${notification.appStatus}-${user.id}`,
          "true",
        );
      }
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="dropdown nav-notification">
      <button
        className="btn p-0 position-relative"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-bell-fill" style={{ fontSize: "20px" }}></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger fs-6 fw-normal">
            {unreadCount}
          </span>
        )}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        style={{ minWidth: "320px" }}
      >
        <li className="px-3 py-2 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">ការជូនដំណឹង</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-sm btn-link text-primary p-0"
                onClick={markAllAsRead}
                style={{ fontSize: "12px" }}
              >
                សម្គាល់ថាបានអាន
              </button>
            )}
          </div>
        </li>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <li className="px-3 py-4 text-center text-muted">
              <i className="bi bi-bell-slash fs-1 d-block mb-2"></i>
              <small>មិនមានការជូនដំណឹង</small>
            </li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id}>
                <Link
                  className={`dropdown-item d-flex align-items-start py-3 ${
                    !notification.read ? "bg-light" : ""
                  }`}
                  href={notification.href || "#"}
                  onClick={() => markAsRead(notification)}
                >
                  <img
                    src={notification.icon}
                    alt={notification.title}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                  <span className="ps-2 flex-grow-1">
                    <strong className="d-block">{notification.title}</strong>
                    <small className="d-block text-muted">
                      {notification.message}
                    </small>
                    <small className="text-secondary">
                      {notification.time}
                    </small>
                  </span>
                  {!notification.read && (
                    <span
                      className="badge bg-primary rounded-circle"
                      style={{ width: "8px", height: "8px", padding: 0 }}
                    ></span>
                  )}
                </Link>
              </li>
            ))
          )}
        </div>
        <li className="my-3 d-flex justify-content-center border-top pt-3">
          <Link href="/user-profile" className="text-primary">
            មើលការជូនដំណឹងទាំងអស់
          </Link>
        </li>
      </ul>
    </div>
  );
}
