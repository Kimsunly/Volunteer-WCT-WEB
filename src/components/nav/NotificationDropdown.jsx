"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      icon: "/images/Icon/facebook.png",
      title: "Facebook",
      message: "អ្នកបានភ្ជាប់គណនីជាមួយ Facebook",
      time: "ឥឡូវនេះ",
      read: false,
    },
    {
      id: 2,
      type: "info",
      icon: "/images/Icon/setting.png",
      title: "ការកំណត់",
      message: "អ្នកបានផ្លាស់ប្តូរពាក្យសម្ងាត់បានជោគជ័យ",
      time: "៣០នាទីមុន",
      read: false,
    },
    {
      id: 3,
      type: "success",
      icon: "/images/Icon/mark.png",
      title: "ការដាក់ពាក្យ",
      message: "ការដាក់ពាក្យរបស់អ្នកបានជោគជ័យ",
      time: "២ម៉ោងមុន",
      read: false,
    },
  ]);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
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
                <a
                  className={`dropdown-item d-flex align-items-start py-3 ${
                    !notification.read ? "bg-light" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    markAsRead(notification.id);
                  }}
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
                </a>
              </li>
            ))
          )}
        </div>
        <li className="my-3 d-flex justify-content-center border-top pt-3">
          <a href="/notifications" className="text-primary">
            មើលការជូនដំណឹងទាំងអស់
          </a>
        </li>
      </ul>
    </div>
  );
}
