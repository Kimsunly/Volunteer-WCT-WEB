"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar, PageHeader, RoleGuard, storage } from "../components";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminCommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("role") || "admin";
    setRoleAllowed(role === "admin");
    let data = storage.read("communityPosts", []);
    if (!data.length) {
      data = [
        {
          id: 1,
          organizerId: 2,
          organizerName: "Green Cambodia",
          title: "Thank You Volunteers! 🌳",
          titleKh: "សូមអរគុណស្ម័គ្រចិត្ត!",
          content:
            "We planted 500 trees this month with the help of amazing volunteers. Together, we're making Cambodia greener!",
          contentKh:
            "យើងបានដាំដើមឈើ 500 ដើមក្នុងខែនេះ ជាមួយជំនួយពីស្ម័គ្រចិត្តដ៏អស្ចារ្យ។",
          category: "update",
          images: ["/images/community/tree-planting.jpg"],
          visibility: "public",
          likes: 45,
          comments: 12,
          createdAt: "2025-01-05",
          status: "approved",
          tags: ["environment", "tree-planting"],
        },
        {
          id: 2,
          organizerId: 1,
          organizerName: "Khmer Youth Foundation",
          title: "Volunteer Meet & Greet - Coffee Session",
          titleKh: "ជួបជុំស្ម័គ្រចិត្ត - សម័យកាហ្វេ",
          content:
            "Join us for an informal coffee session to meet fellow volunteers and share experiences!",
          contentKh:
            "ចូលរួមជាមួយយើងសម្រាប់សម័យកាហ្វេក្រៅផ្លូវការ ដើម្បីជួបស្ម័គ្រចិត្តផ្សេងទៀត និងចែករំលែកបទពិសោធន៍!",
          category: "event",
          images: [],
          visibility: "public",
          likes: 28,
          comments: 7,
          createdAt: "2025-01-03",
          status: "approved",
          tags: ["networking", "social"],
        },
        {
          id: 3,
          organizerId: 3,
          organizerName: "Hope Center",
          title: "Tips for First-Time Volunteers",
          titleKh: "គន្លឹះសម្រាប់ស្ម័គ្រចិត្តលើកដំបូង",
          content:
            "New to volunteering? Here are some helpful tips to make your experience meaningful and enjoyable.",
          contentKh:
            "ថ្មីក្នុងការធ្វើស្ម័គ្រចិត្ត? នេះគឺជាគន្លឹះមួយចំនួនដើម្បីធ្វើឱ្យបទពិសោធន៍របស់អ្នកមានន័យ និងរីករាយ។",
          category: "discussion",
          images: [],
          visibility: "public",
          likes: 15,
          comments: 5,
          createdAt: "2025-01-02",
          status: "pending",
          tags: ["tips", "beginners"],
        },
      ];
      storage.write("communityPosts", data);
    }
    queueMicrotask(() => setPosts(data));
  }, []);

  const filtered = posts.filter((p) => filter === "all" || p.status === filter);

  const save = (next) => {
    setPosts(next);
    storage.write("communityPosts", next);
  };

  const viewDetail = (idx) => setDetail(filtered[idx]);

  const approvePost = (idx) => {
    const item = filtered[idx];
    const updated = posts.map((p) =>
      p.id === item.id ? { ...p, status: "approved" } : p
    );
    save(updated);
  };

  const rejectPost = (idx) => {
    const reason = prompt("មូលហេតុនៃការបដិសេធ:");
    if (!reason) return;
    const item = filtered[idx];
    const updated = posts.map((p) =>
      p.id === item.id ? { ...p, status: "rejected", rejectReason: reason } : p
    );
    save(updated);
  };

  const deletePost = (idx) => {
    if (!confirm("លុបប្រកាសនេះ?")) return;
    const item = filtered[idx];
    const updated = posts.filter((p) => p.id !== item.id);
    save(updated);
  };

  if (!mounted) return null;

  return (
    <>
      <AdminNavbar
        title="Community Management"
        subtitle="Manage community posts from organizers"
      />
      <div className="container-fluid py-4">
        <div className="row g-3">
          <AdminSidebar active="community" />

          <main className="col-lg-9 col-xl-10">
            <RoleGuard enabled={!roleAllowed} />

            <PageHeader
              title="គ្រប់គ្រងសហគមន៍"
              subtitle="អនុម័ត ឬ បដិសេធប្រកាសពីអង្គការ"
            />

            {/* Filters */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-auto">
                    <label className="form-label small mb-1">ស្ថានភាព</label>
                    <select
                      className="form-select form-select-sm"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">ទាំងអស់</option>
                      <option value="pending">រង់ចាំ</option>
                      <option value="approved">បានអនុម័ត</option>
                      <option value="rejected">បានបដិសេធ</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Table */}
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h6 className="mb-0">ប្រកាសសហគមន៍ ({filtered.length})</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ចំណងជើង</th>
                        <th>អង្គការ</th>
                        <th>ប្រភេទ</th>
                        <th>កាលបរិច្ឆេទ</th>
                        <th>ស្ថានភាព</th>
                        <th>សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            មិនមានប្រកាស
                          </td>
                        </tr>
                      )}
                      {filtered.map((p, i) => (
                        <tr key={p.id}>
                          <td>
                            <div className="fw-semibold">{p.title}</div>
                            <small className="text-muted">{p.titleKh}</small>
                          </td>
                          <td>{p.organizerName}</td>
                          <td>
                            <span
                              className={`badge ${
                                p.category === "update"
                                  ? "bg-info"
                                  : p.category === "event"
                                    ? "bg-success"
                                    : "bg-secondary"
                              }`}
                            >
                              {p.category}
                            </span>
                          </td>
                          <td>{p.createdAt}</td>
                          <td>
                            <span
                              className={`badge ${
                                p.status === "approved"
                                  ? "bg-success"
                                  : p.status === "pending"
                                    ? "bg-warning"
                                    : "bg-danger"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => viewDetail(i)}
                                title="មើលលម្អិត"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {p.status === "pending" && (
                                <>
                                  <button
                                    className="btn btn-outline-success"
                                    onClick={() => approvePost(i)}
                                    title="អនុម័ត"
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => rejectPost(i)}
                                    title="បដិសេធ"
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </button>
                                </>
                              )}
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => deletePost(i)}
                                title="លុប"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDetail(null)}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{detail.title}</h5>
                <button
                  className="btn-close"
                  onClick={() => setDetail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>អង្គការ:</strong> {detail.organizerName}
                </div>
                <div className="mb-3">
                  <strong>ប្រភេទ:</strong> {detail.category}
                </div>
                <div className="mb-3">
                  <strong>មាតិកា:</strong>
                  <p className="mt-2">{detail.content}</p>
                  <p className="text-muted">{detail.contentKh}</p>
                </div>
                <div className="mb-3">
                  <strong>ស្ថានភាព:</strong>{" "}
                  <span
                    className={`badge ${
                      detail.status === "approved"
                        ? "bg-success"
                        : detail.status === "pending"
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
                  >
                    {detail.status}
                  </span>
                </div>
                <div>
                  <strong>ទិន្នន័យ:</strong> Likes: {detail.likes}, Comments:{" "}
                  {detail.comments}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
