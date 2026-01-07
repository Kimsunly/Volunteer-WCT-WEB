// src/app/org/dashboard/page.jsx
"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import {
  OrgBrand,
  CreateOpportunityModal,
  Tabs,
  OverviewPane,
  OpportunitiesPane,
  ApplicationsPane,
  AnalyticsPane,
} from "./profile";

/** Mock data — replace with API later */
const INITIAL_OPPORTUNITIES = [
  {
    id: "op-1",
    titleKh: "សម្អាតសហគមន៍",
    titleEn: "Community Cleanup",
    dateKh: "២៤ មករា ២០២៥",
    locationKh: "ភ្នំពេញ",
    current: 15,
    capacity: 20,
    registrations: 8,
    status: "active", // active | pending | closed
    image: "/images/ORG/Tree-conservation.png",
  },
  {
    id: "op-2",
    titleKh: "ដាំដើមឈើ",
    titleEn: "Tree Planting",
    dateKh: "៥ កុម្ភៈ ២០២៥",
    locationKh: "តាកែវ",
    current: 25,
    capacity: 30,
    registrations: 12,
    status: "active",
    image: "/images/ORG/Tree-conservation.png",
  },
  {
    id: "op-3",
    titleKh: "អភិរក្សព្រៃឈើ",
    titleEn: "Forest Conservation",
    dateKh: "១២ កុម្ភៈ ២០២៥",
    locationKh: "កំពង់ចាម",
    current: 8,
    capacity: 15,
    registrations: 3,
    status: "pending",
    image: "/images/ORG/Tree-conservation.png",
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    avatar: "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
    nameKh: "សុភា ចាន់",
    nameEn: "Sophea Chan",
    jobKh: "សម្អាតសហគមន៍",
    meta: "​ចូលរួម៖ ២ ថ្ងៃ",
    dateKh: "២៤ មករា ២០២៥",
    status: "pending",
  },
  {
    id: "app-2",
    avatar: "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
    nameKh: "ដារា លី",
    nameEn: "Dara Lee",
    jobKh: "ដាំដើមឈើ",
    meta: "ចំនួនម៉ោង៖ ៩",
    dateKh: "២៤ មករា ២០២៥",
    status: "approved",
  },
  {
    id: "app-3",
    avatar: "/images/ORG/computer-icons-user-profile-circle-abstract.jpg",
    nameKh: "ពិសាក់ ស៊ុន",
    nameEn: "Pisach Sun",
    jobKh: "អភិរក្សព្រៃឈើ",
    meta: "ចំនួនថ្ងៃ៖ ៣",
    dateKh: "២៣ មករា ២០២៥",
    status: "rejected",
  },
];

export default function OrgDashboardPage() {
  // Role guard (front-end only)
  const [roleAllowed] = useState(() => {
    if (typeof window === "undefined") return true;
    const role = localStorage.getItem("role") || "organizer";
    return role === "organizer";
  });

  const [orgAvatarPreviewSrc, setOrgAvatarPreviewSrc] = useState(
    "/images/ORG/company-icon.png"
  );

  // Tabs (React-controlled)
  const [activeTab, setActiveTab] = useState("overview"); // overview | opportunities | applications | analytics | settings

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);

  // Opportunities state + filters
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [opSearch, setOpSearch] = useState("");
  const [opStatusFilter, setOpStatusFilter] = useState("all"); // all | active | closed | pending

  const filteredOps = useMemo(() => {
    const term = opSearch.trim().toLowerCase();
    return opportunities.filter((op) => {
      const matchStatus =
        opStatusFilter === "all" || op.status === opStatusFilter;
      const matchText =
        !term ||
        op.titleKh.toLowerCase().includes(term) ||
        op.titleEn.toLowerCase().includes(term) ||
        op.locationKh.toLowerCase().includes(term);
      return matchStatus && matchText;
    });
  }, [opportunities, opSearch, opStatusFilter]);

  // Applications state + filters
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("");

  const filteredApps = useMemo(() => {
    const term = appSearch.trim().toLowerCase();
    return applications.filter((app) => {
      const matchStatus = !appStatusFilter || app.status === appStatusFilter;
      const matchText =
        !term ||
        app.nameKh.toLowerCase().includes(term) ||
        app.nameEn.toLowerCase().includes(term) ||
        app.jobKh.toLowerCase().includes(term);
      return matchStatus && matchText;
    });
  }, [applications, appSearch, appStatusFilter]);

  // Handle modal submit to create opportunity
  const handleCreateOpportunity = (payload) => {
    // payload = { titleKh, description, locationKh, dateISO, visibility, accessMode, accessCode, capacity, status, imageFile }
    const newOp = {
      id: `op-${Date.now()}`,
      titleKh: payload.titleKh || "ឱកាសថ្មី",
      titleEn: payload.titleEn || payload.titleKh || "New Opportunity",
      dateKh: payload.dateKh || "—",
      locationKh: payload.locationKh || "—",
      current: 0,
      capacity: Number(payload.capacity || 1),
      registrations: 0,
      status: payload.status || "pending",
      image: payload.imagePreview || "/images/ORG/company-icon.png",
    };
    setOpportunities((prev) => [newOp, ...prev]);
    setCreateOpen(false);
  };

  // Organization brand header mock
  const org = {
    logo: "/images/ORG/company-icon.png",
    nameKh: "អង្គការបរិស្ថានកម្ពុជា",
    nameEn: "Cambodia Environment Organization • NGO",
  };

  return (
    <main className="flex-grow-1 org-dashboard">
      <div className="container py-4">
        {/* Role Guard */}
        {!roleAllowed && (
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <i className="bi bi-shield-lock-fill me-2"></i>
            <div>
              សម្រាប់ Organizer ដែលត្រូវបានបញ្ជាក់ដោយ Admin ប៉ុណ្ណោះ។ សូមចូលគណនី
              Organizer ឬស្នើសុំការផ្ទៀងផ្ទាត់។
            </div>
          </div>
        )}

        {/* Org brand header + CTA */}
        <OrgBrand org={org} onCreate={() => setCreateOpen(true)} />

        {/* Tabs */}
        <Tabs
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "overview", label: "ទិដ្ឋភាពទូទៅ" },
            { id: "opportunities", label: "ឱកាស" },
            { id: "applications", label: "ការដាក់ពាក្យ" },
            { id: "analytics", label: "វិភាគទិន្នន័យ" },
            { id: "settings", label: "ការកំណត់" },
          ]}
        />

        {/* Panes – we add `opacity-50 pe-none` when role is not allowed */}
        <div
          className={`tab-content mt-4 w-100 ${!roleAllowed ? "opacity-50 pe-none" : ""}`}
        >
          {activeTab === "overview" && <OverviewPane />}

          {activeTab === "opportunities" && (
            <OpportunitiesPane
              items={filteredOps}
              search={opSearch}
              onSearch={setOpSearch}
              statusFilter={opStatusFilter}
              onStatusFilter={setOpStatusFilter}
              onCreate={() => setCreateOpen(true)}
            />
          )}

          {activeTab === "applications" && (
            <ApplicationsPane
              items={filteredApps}
              search={appSearch}
              onSearch={setAppSearch}
              statusFilter={appStatusFilter}
              onStatusFilter={setAppStatusFilter}
              onApprove={(id) => {
                setApplications((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, status: "approved" } : a
                  )
                );
              }}
              onReject={(id) => {
                setApplications((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, status: "rejected" } : a
                  )
                );
              }}
              onPending={(id) => {
                setApplications((prev) =>
                  prev.map((a) =>
                    a.id === id ? { ...a, status: "pending" } : a
                  )
                );
              }}
            />
          )}

          {activeTab === "analytics" && <AnalyticsPane />}

          {activeTab === "settings" && (
            <div className="card shadow-sm mb-4" data-aos="fade-up">
              <div className="card-body">
                <h5 className="card-title mb-1">ការកំណត់អង្គការ</h5>

                {/* Avatar uploader (simple preview) */}
                <div
                  className="d-flex align-items-center justify-content-center gap-3 mb-3"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  <label className="vh-avatar-uploader mb-0">
                    <input
                      type="file"
                      className="d-none"
                      id="orgAvatarInput"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = URL.createObjectURL(f);
                        setOrgAvatarPreviewSrc(url);
                      }}
                    />
                    <span className="vh-avatar ring">
                      <Image
                        src={orgAvatarPreviewSrc}
                        alt="រូបភាព"
                        width={80}
                        height={80}
                        unoptimized
                      />
                    </span>
                    <span className="small d-block mt-1">ជ្រើសរើសរូបភាព</span>
                  </label>
                </div>

                {/* Basic fields */}
                <div
                  className="row g-3"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="col-md-6">
                    <label htmlFor="orgName" className="form-label">
                      ឈ្មោះអង្គការ
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="orgName"
                      placeholder="អង្គការបរិស្ថានកម្ពុជា"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="orgEmail" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="orgEmail"
                      placeholder="info@environment.org.kh"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="orgPhone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="orgPhone"
                      placeholder="+855 23 123 456"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="orgWebsite" className="form-label">
                      Website
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="orgWebsite"
                      placeholder="www.environment.org.kh"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="orgAddress" className="form-label">
                      អាស័យដ្ឋាន
                    </label>
                    <textarea
                      className="form-control"
                      id="orgAddress"
                      rows={2}
                      placeholder="ផ្លូវ ២៧១, ភ្នំពេញ"
                    ></textarea>
                  </div>
                </div>

                <hr className="my-4" data-aos="fade-up" data-aos-delay="300" />

                <h6 className="mb-2" data-aos="fade-up" data-aos-delay="400">
                  បណ្តាញសង្គម
                </h6>
                <div
                  className="row g-3"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Facebook</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Instagram</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Twitter / X</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://x.com/yourpage"
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://linkedin.com/company/yourorg"
                    />
                  </div>
                </div>

                <hr className="my-4" data-aos="fade-up" data-aos-delay="600" />

                <h6 className="mb-2" data-aos="fade-up" data-aos-delay="700">
                  សុវត្ថិភាព / Security
                </h6>
                <div
                  className="row g-3"
                  data-aos="fade-up"
                  data-aos-delay="800"
                >
                  <div className="col-md-4">
                    <label className="form-label">
                      ពាក្យសម្ងាត់បច្ចុប្បន្ន
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ពាក្យសម្ងាត់ថ្មី</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="********"
                    />
                  </div>
                </div>

                <div
                  className="d-flex justify-content-end mt-4"
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  <button
                    type="reset"
                    className="btn btn-outline-secondary me-2"
                  >
                    កំណត់ឡើងវិញ
                  </button>
                  <button type="submit" className="btn btn-primary">
                    រក្សាទុកការផ្លាស់ប្តូរ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Opportunity Modal (React) */}
      <CreateOpportunityModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateOpportunity}
      />
    </main>
  );
}
``;
