"use client";
import "@/styles/opportunity-detail.css";
import SafeDate from "@/components/common/SafeDate";

const formatImageUrl = (url) => {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const backendBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://smakjit.publicvm.com";
    if (url.includes("localhost:8000")) {
      return url.replace("http://localhost:8000", backendBase);
    }
    return url;
  }
  if (url.startsWith("/")) {
    const staticAssets = ["/placeholder.png", "/logos/", "/images/"];
    if (staticAssets.some((asset) => url.startsWith(asset))) {
      return url;
    }
    const backendBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://smakjit.publicvm.com";
    return `${backendBase}${url}`;
  }
  return url;
};

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getOpportunityById,
  listOpportunities,
  verifyOpportunityAccessKey,
} from "@/services/opportunities";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/services/comments";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";
import toast from "react-hot-toast";
import ReportCommentModal from "@/components/modals/ReportCommentModal";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";
import ActivityImagesGrid from "../../(landing)/components/ActivityImagesGrid";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentFormData, setCommentFormData] = useState({
    text: "",
    agree: false,
  });
  const [localComments, setLocalComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedCommentId, setReportedCommentId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const [accessKeyModalOpen, setAccessKeyModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [accessKeyError, setAccessKeyError] = useState("");
  const [verifyingKey, setVerifyingKey] = useState(false);

  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState(null);
  const [verifyingLockedKey, setVerifyingLockedKey] = useState(false);

  const canViewReportedComments = Boolean(
    user &&
    opportunity &&
    (user.role === "admin" ||
      (user.role === "organizer" &&
        Number(opportunity.created_by) === Number(user.id))),
  );

  useEffect(() => {
    async function fetchData() {
      if (!params || !params.id) return;
      setLoading(true);
      try {
        const storedKey = typeof window !== 'undefined' ? sessionStorage.getItem("private_access_key") : null;
        const res = await getOpportunityById(params.id, storedKey);
        const data = res.data || res;

        const transformedOpp = {
          ...data,
          is_private: data.is_private || data.visibility === "private",
          heroImage: formatImageUrl(
            data.details?.images_json?.[0] || data.images?.[0],
          ),
          images:
            data.details?.images_json && Array.isArray(data.details.images_json)
              ? data.details.images_json.map(formatImageUrl)
              : data.images && typeof data.images === "string"
                ? data.images
                    .split(",")
                    .filter((url) => url.trim())
                    .map(formatImageUrl)
                : data.images && Array.isArray(data.images)
                  ? data.images.map(formatImageUrl)
                  : [],
          programInfo:
            data.description || "មិនមានព័ត៌មានលម្អិតសម្រាប់កម្មវិធីនេះទេ។",
          start_date: data.logistic?.start_date, // Keep raw date
          time: data.logistic?.time_range || data.time || "TBD",
          type:
            data.category?.name ||
            data.category_label ||
            data.category ||
            "Volunteer",
          location:
            data.logistic?.location_label ||
            data.location_label ||
            data.location ||
            "Other",
          benefits: [
            data.logistic?.transport &&
              `ការដឹកជញ្ជូន: ${data.logistic.transport}`,
            data.logistic?.housing &&
              `កន្លែងស្នាក់នៅ: ${data.logistic.housing}`,
            data.logistic?.meals && `អាហារ: ${data.logistic.meals}`,
          ].filter(Boolean),
          counters: [
            {
              icon: "bi-people-fill",
              value: data.capacity || "50+",
              label: "អ្នកស្ម័គ្រចិត្ត",
            },
            {
              icon: "bi-geo-alt-fill",
              value: data.logistic?.location_label || "កម្ពុជា",
              label: "ទីតាំង",
            },
            {
              icon: "bi-stars",
              value: data.details?.help_type || "ពេញនិយម",
              label: "ប្រភេទ",
            },
          ],
          skills: data.details?.skills_json ||
            data.skills || [
              "ការប្រាស្រ័យទាក់ទង",
              "ការធ្វើការជាក្រុម",
              "ភាពអំណត់",
            ],
          tasks: data.details?.tasks_json ||
            data.tasks || [
              "ជួយរៀបចំកម្មវិធី",
              "សម្របសម្រួលសកម្មភាព",
              "រៀបចំរបាយការណ៍សង្ខេប",
            ],
          impact: {
            description:
              data.details?.impact_description ||
              data.impact_description ||
              "កម្មវិធីនេះមានគោលបំណងបង្កើតផលប៉ះពាល់វិជ្ជមានលើសហគមន៍មូលដ្ឋាន និងបរិស្ថានតាមរយៈកិច្ចខិតខំប្រឹងប្រែងរួមគ្នា។",
            stats: data.details?.impact_stats_json
              ? Object.entries(data.details.impact_stats_json).map(
                  ([key, value]) => ({ value, label: key }),
                )
              : [
                  { value: "500+", label: "អ្នកទទួលផល" },
                  { value: "20+", label: "គម្រោងបានជោគជ័យ" },
                ],
          },
          testimonials: data.details?.testimonials_json ||
            data.testimonials || [
              {
                name: "សុខ ពិសិដ្ឋ",
                role: "អ្នកស្ម័គ្រចិត្តអតីតកាល",
                image: "/images/profile.png",
                quote: "វាជាបទពិសោធន៍ដ៏អស្ចារ្យដែលខ្ញុំមិនអាចបំភ្លេចបាន។",
              },
            ],
          organizationInfo: `អង្គការ ${data.organization_name || data.organization || "ដៃគូស្ម័គ្រចិត្ត"} ប្តេជ្ញាចិត្តក្នុងការលើកកម្ពស់ការចូលរួមសង្គមក្នុងចំណោមយុវជន។`,
          contact: {
            website:
              data.contact?.website ||
              data.contact_website ||
              "www.volunteer-wct.org",
            email:
              data.contact?.email ||
              data.contact_email ||
              "contact@example.com",
            phone:
              data.contact?.phone || data.contact_phone || "+855 12 345 678",
            social: data.contact?.social_json ||
              data.contact_social || {
                facebook: "#",
                twitter: "#",
                telegram: "#",
                linkedin: "#",
                instagram: "#",
              },
            workingHours:
              data.contact?.hours ||
              data.contact_hours ||
              "ម៉ោង ៨:០០ ព្រឹក - ៥:០០ ល្ងាច",
            address: data.contact?.address || data.location_label || "ភ្នំពេញ",
          },
        };

        setOpportunity(transformedOpp);
        fetchComments(params.id);

        const others = await listOpportunities({ pageSize: 3 });
        setRelatedOpportunities(
          others.items
            ? others.items
                .filter((o) => String(o.id) !== String(params.id))
                .slice(0, 3)
                .map((opp) => ({
                  ...opp,
                  images: opp.images
                    ? Array.isArray(opp.images)
                      ? opp.images.map(formatImageUrl)
                      : opp.images.split(",").map(formatImageUrl)
                    : ["/placeholder.png"],
                }))
            : [],
        );
      } catch (err) {
        console.error("Error fetching opportunity:", err);
        setError("មិនអាចស្វែងរកកម្មវិធីដែលអ្នកចង់បាន។");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params?.id, router]);

  useEffect(() => {
    if (loading || authLoading || !opportunity) return;
    if (opportunity.is_private) {
      if (!user) {
        setIsLocked(true);
        setLockReason("login");
      } else {
        const checkKey = async () => {
          const savedKey = sessionStorage.getItem("private_access_key");
          if (!savedKey) {
            setIsLocked(true);
            setLockReason("key");
            return;
          }
          try {
            await verifyOpportunityAccessKey(opportunity.id, savedKey);
            setIsLocked(false);
            setLockReason(null);
          } catch (err) {
            sessionStorage.removeItem("private_access_key");
            setIsLocked(true);
            setLockReason("key");
          }
        };
        checkKey();
      }
    } else {
      setIsLocked(false);
      setLockReason(null);
    }
  }, [opportunity, user, authLoading]);

  const fetchComments = async (id) => {
    setCommentsLoading(true);
    try {
      const data = await getComments("opportunity", String(id));
      setLocalComments(data.data || []);
    } catch (err) {
      setLocalComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentFormData.text || !commentFormData.agree) return;
    try {
      await createComment(
        commentFormData.text,
        "opportunity",
        String(params.id),
      );
      showToast.success("បានបញ្ចេញមតិដោយជោគជ័យ", "ជោគជ័យ");
      setCommentFormData({ text: "", agree: false });
      fetchComments(params.id);
    } catch (err) {
      showToast.error(
        parseApiError(err) ||
          "បរាជ័យក្នុងការបញ្ចេញមតិ។ សូមប្រាកដថាអ្នកបានចូលក្នុងគណនី។",
        "កំហុស",
      );
    }
  };

  const handleDeleteComment = (commentId) => {
    setDeletingCommentId(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      showToast.success("បានលុបមតិយោបល់ដោយជោគជ័យ", "ជោគជ័យ");
      fetchComments(params.id);
    } catch (err) {
      showToast.error(
        parseApiError(err) || "បរាជ័យក្នុងការលុបមតិយោបល់",
        "កំហុស",
      );
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    try {
      setSubmittingEdit(true);
      await updateComment(editingCommentId, editCommentText);
      showToast.success("បានកែសម្រួលមតិយោបល់ដោយជោគជ័យ", "ជោគជ័យ");
      setEditingCommentId(null);
      setEditCommentText("");
      fetchComments(params.id);
    } catch (err) {
      showToast.error(
        parseApiError(err) || "បរាជ័យក្នុងការកែសម្រួលមតិយោបល់",
        "កំហុស",
      );
    } finally {
      setSubmittingEdit(false);
    }
  };

  /* ─── Loading Skeleton ─── */
  if (loading) {
    return (
      <main className="flex-grow-1">
        <div className="opp-detail-hero-skeleton" style={{ marginTop: 112 }}>
          <div
            className="placeholder-glow w-100 h-100"
            style={{ minHeight: 460, background: "var(--color-bg-input)" }}
          ></div>
        </div>
        <div className="container py-5">
          <div className="placeholder-glow mb-5">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="placeholder col-4 me-3"
                style={{
                  height: 100,
                  borderRadius: 16,
                  display: "inline-block",
                }}
              ></span>
            ))}
          </div>
          <div className="row g-5">
            <div className="col-lg-8">
              <span
                className="placeholder col-6 mb-4"
                style={{ height: 32, display: "block" }}
              ></span>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="placeholder col-12 mb-2"
                  style={{ display: "block" }}
                ></span>
              ))}
            </div>
            <div className="col-lg-4">
              <div
                style={{
                  background: "var(--color-bg-input)",
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="placeholder col-12 mb-3"
                    style={{ display: "block" }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Error State ─── */
  if (error || !opportunity) {
    return (
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center p-5">
          <div className="opp-error-icon mb-4">
            <i
              className="bi bi-exclamation-triangle"
              style={{ fontSize: 64, color: "var(--color-negative)" }}
            ></i>
          </div>
          <h2
            className="fw-bold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            {error || "រកមិនឃើញកម្មវិធី"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            សូមត្រលប់ទៅទំព័រចម្បងដើម្បីស្វែងរកកម្មវិធីផ្សេង
          </p>
          <Link
            href="/opportunities"
            className="opp-btn-primary mt-3 d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i> ត្រឡប់ទៅ
          </Link>
        </div>
      </main>
    );
  }

  /* ─── Locked State ─── */
  if (isLocked) {
    return (
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{ minHeight: "90vh", paddingTop: 80 }}
      >
        <div className="opp-locked-card">
          <div className="opp-locked-icon mb-4">
            <i
              className={`bi bi-${lockReason === "login" ? "person-lock" : "lock-fill"}`}
            ></i>
          </div>
          {lockReason === "login" ? (
            <>
              <h3 className="fw-bold mb-2">សូមចូលគណនីរបស់អ្នក</h3>
              <p className="text-secondary mb-4">
                កម្មវិធីនេះជាកម្មវិធីឯកជន។ សូមចូលគណនីដើម្បីបន្ត។
              </p>
              <div className="d-grid gap-3">
                <Link
                  href={`/auth/login?redirect=/opportunities/${params.id}`}
                  className="opp-btn-primary"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>ចូលគណនី
                </Link>
                <Link href="/opportunities" className="opp-btn-outline">
                  <i className="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅក្រោយ
                </Link>
              </div>
            </>
          ) : (
            <>
              <h3 className="fw-bold mb-2">កូដសម្ងាត់</h3>
              <p className="text-secondary mb-4">
                សូមបញ្ចូលកូដសម្ងាត់ពីអ្នករៀបចំ
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!accessKey.trim()) {
                    setAccessKeyError("សូមបញ្ចូលកូដសម្ងាត់");
                    return;
                  }
                  setVerifyingLockedKey(true);
                  setAccessKeyError("");
                  try {
                    await verifyOpportunityAccessKey(params.id, accessKey);
                    sessionStorage.setItem("private_access_key", accessKey);
                    toast.success("កូដសម្ងាត់ត្រឹមត្រូវ!");
                    setIsLocked(false);
                    setLockReason(null);
                    window.location.reload();
                  } catch (err) {
                    setAccessKeyError(
                      err.response?.data?.message ||
                        "កូដសម្ងាត់មិនត្រឹមត្រូវទេ",
                    );
                  } finally {
                    setVerifyingLockedKey(false);
                  }
                }}
              >
                <div className="mb-3 text-start">
                  <label className="opp-label">
                    កូដសម្ងាត់ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`opp-input ${accessKeyError ? "is-invalid" : ""}`}
                    value={accessKey}
                    onChange={(e) => {
                      setAccessKey(e.target.value);
                      setAccessKeyError("");
                    }}
                    placeholder="បញ្ចូលកូដ..."
                    required
                  />
                  {accessKeyError && (
                    <div className="invalid-feedback">{accessKeyError}</div>
                  )}
                </div>
                <div className="d-grid gap-3">
                  <button
                    type="submit"
                    className="opp-btn-primary"
                    disabled={verifyingLockedKey}
                  >
                    {verifyingLockedKey ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        កំពុងផ្ទៀងផ្ទាត់...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-unlock-fill me-2"></i>ផ្ទៀងផ្ទាត់
                      </>
                    )}
                  </button>
                  <Link href="/opportunities" className="opp-btn-outline">
                    <i className="bi bi-arrow-left me-2"></i>ត្រឡប់
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    );
  }

  /* ─── MAIN REDESIGNED PAGE ─── */
  return (
    <main className="flex-grow-1 opp-detail-page">
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="opp-hero" style={{ marginTop: 112 }}>
        {/* Glow blobs & pattern overlays */}
        <div className="opp-hero-grid-pattern" />
        <div className="opp-hero-glow-blob" />

        <div className="opp-hero-img">
          <img
            src={opportunity.heroImage}
            alt={opportunity.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
          <div className="opp-hero-overlay" />
        </div>
        <div className="opp-hero-content container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              {/* Breadcrumb */}
              <nav className="opp-breadcrumb mb-3">
                <Link href="/opportunities">ការងារស្ម័គ្រចិត្ត</Link>
                <i className="bi bi-chevron-right mx-2 opacity-50"></i>
                <span className="opacity-75">{opportunity.title}</span>
              </nav>

              {/* Title + badges */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="opp-hero-category">{opportunity.type}</span>
                {opportunity.is_private && (
                  <span className="opp-hero-private">
                    <i className="bi bi-lock-fill me-1"></i>ឯកជន
                  </span>
                )}
              </div>
              <h1 className="opp-hero-title mb-3">{opportunity.title}</h1>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <span className="opp-hero-meta">
                  <i className="bi bi-geo-alt-fill"></i> {opportunity.location}
                </span>
                <span className="opp-hero-meta">
                  <i className="bi bi-calendar-event"></i>{" "}
                  <SafeDate dateString={opportunity.start_date} />
                </span>
                <span className="opp-hero-meta">
                  <i className="bi bi-clock"></i> {opportunity.time}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  href={`/opportunities/${params.id}/apply`}
                  className="opp-btn-hero-primary"
                >
                  <i className="bi bi-send-fill me-2"></i>ដាក់ពាក្យឥឡូវនេះ
                </Link>
                <button
                  className="opp-btn-hero-ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast.success("ចម្លងតំណភ្ជាប់បានជោគជ័យ!", "ជោគជ័យ");
                  }}
                >
                  <i className="bi bi-share me-2"></i>ចែករំលែក
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="opp-hero-thumbnail-wrapper">
                <img
                  src={opportunity.heroImage}
                  alt={opportunity.title}
                  className="opp-hero-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="opp-stats-strip">
          <div className="container">
            <div className="opp-stats-row">
              {opportunity.counters.map((c, i) => (
                <div key={i} className="opp-stat-item">
                  <i className={`bi ${c.icon} opp-stat-icon`}></i>
                  <div>
                    <div className="opp-stat-value">{c.value}</div>
                    <div className="opp-stat-label">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="container opp-main-content">
        <div className="row g-5">
          {/* ─── LEFT: Main Body ─── */}
          <div className="col-lg-8">
            {/* Program Info */}
            <section className="opp-section">
              <div className="opp-section-label">
                <i className="bi bi-file-earmark-text-fill"></i>
                <span>ព័ត៌មានទូទៅ</span>
              </div>
              <h2 className="opp-section-title">អំពីកម្មវិធី</h2>
              <p className="opp-body-text" style={{ whiteSpace: "pre-wrap" }}>
                {opportunity.programInfo}
              </p>
            </section>

            {/* Skills & Tasks */}
            <section className="opp-section">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="opp-list-card">
                    <div className="opp-list-card-header">
                      <div
                        className="opp-list-card-icon"
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          color: "#6366f1",
                        }}
                      >
                        <i className="bi bi-lightning-charge-fill"></i>
                      </div>
                      <h3 className="opp-list-card-title">ជំនាញដែលត្រូវការ</h3>
                    </div>
                    <ul className="opp-list">
                      {opportunity.skills.map((skill, i) => (
                        <li key={i} className="opp-list-item">
                          <i className="bi bi-check-circle-fill opp-list-check"></i>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="opp-list-card">
                    <div className="opp-list-card-header">
                      <div
                        className="opp-list-card-icon"
                        style={{
                          background: "rgba(20,184,166,0.12)",
                          color: "#14b8a6",
                        }}
                      >
                        <i className="bi bi-list-check"></i>
                      </div>
                      <h3 className="opp-list-card-title">ភារកិច្ចសំខាន់ៗ</h3>
                    </div>
                    <ul className="opp-list">
                      {opportunity.tasks.map((task, i) => (
                        <li key={i} className="opp-list-item">
                          <i className="bi bi-arrow-right-circle-fill opp-list-arrow"></i>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact Section */}
            <section className="opp-section">
              <div className="opp-impact-card">
                <div className="opp-impact-glow" />
                <div className="row align-items-center g-4 position-relative">
                  <div className="col-md-6">
                    <div className="opp-section-label mb-2">
                      <i className="bi bi-graph-up-arrow"></i>
                      <span>ផលប៉ះពាល់</span>
                    </div>
                    <h2 className="opp-impact-title">🌱 ផលប៉ះពាល់របស់យើង</h2>
                    <p className="opp-impact-desc">
                      {opportunity.impact.description}
                    </p>
                    <div className="opp-impact-stats">
                      {opportunity.impact.stats.map((stat, i) => (
                        <div key={i} className="opp-impact-stat">
                          <span className="opp-impact-stat-value">
                            {stat.value}
                          </span>
                          <span className="opp-impact-stat-label">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="opp-impact-quote-title">
                      🗣️ អ្វីដែលពួកគេនិយាយ
                    </h3>
                    {opportunity.testimonials.map((t, i) => (
                      <div key={i} className="opp-testimonial-card mb-3">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="opp-testimonial-avatar"
                          />
                          <div>
                            <div className="opp-testimonial-name">{t.name}</div>
                            <div className="opp-testimonial-role">{t.role}</div>
                          </div>
                        </div>
                        <p className="opp-testimonial-quote">"{t.quote}"</p>
                        <div className="opp-testimonial-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i key={s} className="bi bi-star-fill"></i>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery */}
            {opportunity.images && opportunity.images.length > 0 && (
              <section className="opp-section">
                <div className="opp-section-label mb-2">
                  <i className="bi bi-images"></i>
                  <span>រូបភាព</span>
                </div>
                <h2 className="opp-section-title mb-4">បុគ្គលិកលក្ខណៈ</h2>
                <ActivityImagesGrid images={opportunity.images || []} />
              </section>
            )}
          </div>

          {/* ─── RIGHT: Sticky Sidebar ─── */}
          <div className="col-lg-4">
            <div className="opp-sidebar">
              {/* Quick Apply CTA */}
              <div className="opp-sidebar-cta">
                <div className="opp-sidebar-cta-glow" />
                <h4 className="opp-sidebar-cta-title">ត្រៀមខ្លួនហើយ?</h4>
                <p className="opp-sidebar-cta-sub">
                  ចូលរួមជាមួយអ្នកស្ម័គ្រចិត្តរបស់យើង
                </p>
                <Link
                  href={`/opportunities/${params.id}/apply`}
                  className="opp-btn-primary w-100 text-center d-block"
                >
                  <i className="bi bi-send-fill me-2"></i>ដាក់ពាក្យឥឡូវ
                </Link>
              </div>

              {/* Quick Info Card */}
              <div className="opp-info-card">
                <h5 className="opp-info-card-title">
                  <i className="bi bi-info-circle-fill me-2"></i>ព័ត៌មានរហ័ស
                </h5>
                <div className="opp-info-list">
                  <div className="opp-info-row">
                    <span
                      className="opp-info-icon"
                      style={{
                        background: "rgba(59,130,246,0.12)",
                        color: "#3b82f6",
                      }}
                    >
                      <i className="bi bi-calendar3"></i>
                    </span>
                    <div>
                      <div className="opp-info-key">កាលបរិច្ឆេទ</div>
                      <div className="opp-info-val">
                        <SafeDate dateString={opportunity.start_date} />
                      </div>
                    </div>
                  </div>
                  <div className="opp-info-row">
                    <span
                      className="opp-info-icon"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        color: "#10b981",
                      }}
                    >
                      <i className="bi bi-clock-fill"></i>
                    </span>
                    <div>
                      <div className="opp-info-key">ពេលវេលា</div>
                      <div className="opp-info-val">{opportunity.time}</div>
                    </div>
                  </div>
                  <div className="opp-info-row">
                    <span
                      className="opp-info-icon"
                      style={{
                        background: "rgba(245,158,11,0.12)",
                        color: "#f59e0b",
                      }}
                    >
                      <i className="bi bi-collection-fill"></i>
                    </span>
                    <div>
                      <div className="opp-info-key">ប្រភេទ</div>
                      <div className="opp-info-val">{opportunity.type}</div>
                    </div>
                  </div>
                  <div className="opp-info-row">
                    <span
                      className="opp-info-icon"
                      style={{
                        background: "rgba(239,68,68,0.12)",
                        color: "#ef4444",
                      }}
                    >
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                    <div>
                      <div className="opp-info-key">ទីតាំង</div>
                      <div className="opp-info-val">{opportunity.location}</div>
                    </div>
                  </div>
                  {opportunity.benefits.length > 0 && (
                    <div className="opp-info-row opp-info-row--benefits">
                      <span
                        className="opp-info-icon"
                        style={{
                          background: "rgba(139,92,246,0.12)",
                          color: "#8b5cf6",
                        }}
                      >
                        <i className="bi bi-gift-fill"></i>
                      </span>
                      <div>
                        <div className="opp-info-key">ផលប្រយោជន៍</div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {opportunity.benefits.map((b, i) => (
                            <span key={i} className="opp-benefit-chip">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Card */}
              <div className="opp-share-card">
                <h5 className="opp-info-card-title">
                  <i className="bi bi-share-fill me-2"></i>ចែករំលែក
                </h5>
                <div className="opp-share-btns">
                  {[
                    {
                      icon: "bi-facebook",
                      color: "#1877f2",
                      label: "Facebook",
                    },
                    {
                      icon: "bi-telegram",
                      color: "#0088cc",
                      label: "Telegram",
                    },
                    { icon: "bi-twitter-x", color: "#111", label: "X" },
                    {
                      icon: "bi-link-45deg",
                      color: "var(--color-accent)",
                      label: "Copy",
                    },
                  ].map((s, i) => (
                    <button
                      key={i}
                      className="opp-share-btn"
                      title={s.label}
                      style={{ "--share-color": s.color }}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast.success("ចម្លងតំណភ្ជាប់!", "");
                      }}
                    >
                      <i className={`bi ${s.icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Organization (Full Width 1200px) ─── */}
        <section className="opp-section">
          <div className="opp-org-card">
            <div className="opp-org-accent" />
            <div className="ps-4">
              <div className="opp-section-label mb-2">
                <i className="bi bi-building"></i>
                <span>អំពីអង្គការ</span>
              </div>
              <p className="opp-body-text mb-0">
                {opportunity.organizationInfo}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Comments Section (Full Width 1200px) ─── */}
        <section className="opp-section" id="opportunity-comments">
          <div className="opp-section-label mb-2">
            <i className="bi bi-chat-dots-fill"></i>
            <span>មតិយោបល់</span>
          </div>
          <h2 className="opp-section-title mb-4">💬 មតិយោបល់ពីសហគមន៍</h2>

          <div className="row g-4">
            {/* Guidelines */}
            <div className="col-lg-4">
              <div className="opp-comment-guide-card">
                <h5 className="opp-comment-guide-title">
                  <i
                    className="bi bi-shield-check-fill me-2"
                    style={{ color: "var(--color-accent)" }}
                  ></i>
                  ច្បាប់សហគមន៍
                </h5>
                <ul className="opp-comment-guide-list">
                  <li>
                    <i className="bi bi-eye-fill text-primary"></i>
                    <span>
                      <strong>Guest:</strong> មើលបានតែមតិយោបល់
                    </span>
                  </li>
                  <li>
                    <i className="bi bi-person-fill text-success"></i>
                    <span>
                      <strong>User:</strong> អាចបញ្ចេញមតិ និងចុះឈ្មោះ
                    </span>
                  </li>
                </ul>
                <p className="opp-comment-guide-note">
                  សូមប្រើប្រាស់ភាសាសមរម្យ និងគោរពគ្នាទៅវិញទៅមក។
                </p>
              </div>
            </div>

            {/* Form + List */}
            <div className="col-lg-8">
              <div className="opp-comment-box">
                <h5 className="opp-comment-form-title">បញ្ចេញមតិរបស់អ្នក</h5>
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <textarea
                    className="opp-textarea mb-3"
                    rows="4"
                    placeholder="តើអ្នកមានចំណាប់អារម្មណ៍យ៉ាងណាចំពោះកម្មវិធីនេះ?"
                    value={commentFormData.text}
                    onChange={(e) =>
                      setCommentFormData({
                        ...commentFormData,
                        text: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="commentAgree"
                      checked={commentFormData.agree}
                      onChange={(e) =>
                        setCommentFormData({
                          ...commentFormData,
                          agree: e.target.checked,
                        })
                      }
                      required
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="commentAgree"
                    >
                      ខ្ញុំយល់ព្រមតាមគោលការណ៍របស់វេទិកា
                    </label>
                  </div>
                  <button type="submit" className="opp-btn-primary">
                    <i className="bi bi-send-fill me-2"></i>ផ្ញើមតិ
                  </button>
                </form>

                <div className="opp-comment-divider">
                  <span className="opp-comment-count-label">
                    <i className="bi bi-chat-left-text me-1"></i>
                    មតិទាំងអស់ ({localComments.length})
                  </span>
                </div>

                <div className="opp-comments-list">
                  {commentsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                  ) : localComments.length > 0 ? (
                    localComments.map((comment) => (
                      <div className="opp-comment-item" key={comment.id}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center gap-2">
                            {comment.user?.avatar_url ? (
                              <img
                                src={comment.user.avatar_url}
                                width="32"
                                height="32"
                                className="opp-comment-avatar"
                                style={{ objectFit: "cover" }}
                                alt=""
                              />
                            ) : (
                              <div className="opp-comment-avatar-placeholder">
                                {(comment.user?.name || "U")[0]}
                              </div>
                            )}
                            <div>
                              <strong className="small d-block">
                                {comment.user?.name || "អ្នកប្រើប្រាស់"}
                              </strong>
                              <small
                                style={{
                                  color: "var(--color-text-muted)",
                                  fontSize: "0.7rem",
                                }}
                              >
                                <SafeDate dateString={comment.created_at} />
                              </small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            {user && user.id !== comment.user_id && (
                              <button
                                className="opp-comment-action-btn text-danger"
                                title="រាយការណ៍"
                                onClick={() => {
                                  setReportedCommentId(comment.id);
                                  setReportModalOpen(true);
                                }}
                              >
                                <i className="bi bi-flag"></i>
                              </button>
                            )}
                            {!user && (
                              <button
                                className="opp-comment-action-btn text-muted"
                                onClick={() =>
                                  showToast.error("សូមចូលគណនីជាមុនសិន", "កំហុស")
                                }
                              >
                                <i className="bi bi-flag"></i>
                              </button>
                            )}
                            {user && user.id === comment.user_id && (
                              <div className="dropdown">
                                <button
                                  className="opp-comment-action-btn"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul
                                  className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3"
                                  style={{ background: "var(--color-bg-card)" }}
                                >
                                  <li>
                                    <button
                                      className="dropdown-item small"
                                      style={{
                                        color: "var(--color-text-primary)",
                                      }}
                                      onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditCommentText(comment.content);
                                      }}
                                    >
                                      <i className="bi bi-pencil-square me-2"></i>
                                      កែសម្រួល
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item small text-danger"
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                    >
                                      <i className="bi bi-trash me-2"></i>លុប
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingCommentId === comment.id ? (
                          <form onSubmit={handleUpdateComment} className="mt-2">
                            <textarea
                              className="opp-textarea mb-2"
                              rows="3"
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              required
                            ></textarea>
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                type="button"
                                className="opp-btn-sm-outline"
                                onClick={() => setEditingCommentId(null)}
                              >
                                បោះបង់
                              </button>
                              <button
                                type="submit"
                                className="opp-btn-sm-primary"
                                disabled={submittingEdit}
                              >
                                {submittingEdit ? "រក្សាទុក..." : "រក្សាទុក"}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p
                            className="mb-0 small"
                            style={{
                              color: "var(--color-text-secondary)",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {comment.content}
                          </p>
                        )}

                        {canViewReportedComments && comment.flagged && (
                          <div className="mt-2 rounded-3 border border-danger-subtle bg-danger-subtle p-2">
                            <div className="d-flex align-items-center gap-2 text-danger fw-semibold small">
                              <i className="bi bi-flag-fill"></i>
                              <span>មតិត្រូវបានរាយការណ៍</span>
                              <span className="badge bg-danger ms-auto">
                                {comment.reportCount ||
                                  comment.reports?.length ||
                                  0}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="opp-empty-comments">
                      <i className="bi bi-chat-square-dots opp-empty-icon"></i>
                      <p>មិនទាន់មានមតិយោបល់នៅឡើយ។ ជាអ្នកដំបូង!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ CONTACT SECTION ══════════════ */}
        <section className="opp-section opp-contact-section">
          <div className="opp-section-label mb-2">
            <i className="bi bi-telephone-fill"></i>
            <span>ទំនាក់ទំនង</span>
          </div>
          <h2 className="opp-section-title mb-4">ព័ត៌មានទំនាក់ទំនង</h2>
          <div className="row g-4">
            {[
              {
                icon: "bi-globe2",
                label: "គេហទំព័រ",
                value: opportunity.contact.website,
                href: `https://${opportunity.contact.website}`,
                color: "#6366f1",
              },
              {
                icon: "bi-envelope-fill",
                label: "អ៊ីមែល",
                value: opportunity.contact.email,
                href: `mailto:${opportunity.contact.email}`,
                color: "#10b981",
              },
              {
                icon: "bi-telephone-fill",
                label: "ទូរស័ព្ទ",
                value: opportunity.contact.phone,
                href: `tel:${opportunity.contact.phone}`,
                color: "#f59e0b",
              },
            ].map((c, i) => (
              <div key={i} className="col-md-4">
                <a
                  href={c.href}
                  className="opp-contact-card"
                  style={{ "--contact-color": c.color }}
                >
                  <div className="opp-contact-icon-wrap">
                    <i className={`bi ${c.icon}`}></i>
                  </div>
                  <div>
                    <div className="opp-contact-label">{c.label}</div>
                    <div className="opp-contact-value">{c.value}</div>
                  </div>
                  <i className="bi bi-arrow-up-right ms-auto opp-contact-arrow"></i>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* end .opp-main-content container */}

      {/* ══════════════ CTA BANNER — FULL WIDTH ══════════════ */}
      <section className="opp-cta-fullwidth">
        <div className="opp-cta-fw-inner">
          {/* Left: text + bullets */}
          <div className="opp-cta-fw-left">
            <div className="opp-cta-fw-badge">
              <i className="bi bi-heart-fill"></i> ស្ម័គ្រចិត្ត WCT
            </div>
            <h2 className="opp-cta-fw-title">
              ត្រៀមខ្លួនសម្រាប់
              <br />
              <span className="opp-cta-fw-highlight">ការផ្លាស់ប្តូរ</span>ជីវិត?
            </h2>
            <p className="opp-cta-fw-desc">
              ចូលរួមជាមួយអ្នកស្ម័គ្រចិត្តរបស់យើង
              ហើយបង្កើតផលប៉ះពាល់វិជ្ជមានទៅលើសហគមន៍
            </p>
            {/* Feature points */}
            <div className="opp-cta-fw-features">
              {[
                {
                  icon: "bi-award-fill",
                  color: "#6366f1",
                  text: "ទទួលបានបទពិសោធន៍ជាក់ស្ដែង",
                },
                {
                  icon: "bi-people-fill",
                  color: "#10b981",
                  text: "ភ្ជាប់ទំនាក់ទំនងថ្មីៗ",
                },
                {
                  icon: "bi-graph-up-arrow",
                  color: "#f59e0b",
                  text: "លើកកម្ពស់ជំនាញវិជ្ជាជីវៈ",
                },
                {
                  icon: "bi-globe2",
                  color: "#06b6d4",
                  text: "រួមចំណែកអភិវឌ្ឍន៍ប្រទេស",
                },
              ].map((f, i) => (
                <div key={i} className="opp-cta-fw-feature-item">
                  <span
                    className="opp-cta-fw-feature-icon"
                    style={{ background: `${f.color}1a`, color: f.color }}
                  >
                    <i className={`bi ${f.icon}`}></i>
                  </span>
                  <span className="opp-cta-fw-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
            {/* Buttons */}
            <div className="opp-cta-fw-actions">
              <Link
                href={`/opportunities/${params.id}/apply`}
                className="opp-cta-fw-btn-primary"
              >
                <i className="bi bi-send-fill me-2"></i>ដាក់ពាក្យឥឡូវនេះ
              </Link>
              <button
                className="opp-cta-fw-btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast.success("ចម្លងតំណភ្ជាប់!", "");
                }}
              >
                <i className="bi bi-share me-2"></i>ចែករំលែក
              </button>
            </div>
          </div>

          {/* Right: stats + decoration */}
          <div className="opp-cta-fw-right">
            <div className="opp-cta-fw-stats-grid">
              {[
                {
                  value: "2,500+",
                  label: "អ្នកស្ម័គ្រចិត្ត",
                  icon: "bi-people-fill",
                  color: "#6366f1",
                },
                {
                  value: "150+",
                  label: "កម្មវិធី",
                  icon: "bi-collection-fill",
                  color: "#10b981",
                },
                {
                  value: "98%",
                  label: "ពេញចិត្ត",
                  icon: "bi-star-fill",
                  color: "#f59e0b",
                },
                {
                  value: "25+",
                  label: "ខេត្ត",
                  icon: "bi-geo-alt-fill",
                  color: "#ef4444",
                },
              ].map((s, i) => (
                <div key={i} className="opp-cta-fw-stat-card">
                  <div
                    className="opp-cta-fw-stat-icon"
                    style={{ background: `${s.color}1a`, color: s.color }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <div className="opp-cta-fw-stat-value">{s.value}</div>
                  <div className="opp-cta-fw-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Decorative element */}
            <div className="opp-cta-fw-deco">
              <div className="opp-cta-fw-deco-ring opp-cta-fw-deco-ring--1"></div>
              <div className="opp-cta-fw-deco-ring opp-cta-fw-deco-ring--2"></div>
              <div className="opp-cta-fw-deco-ring opp-cta-fw-deco-ring--3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ RELATED OPPORTUNITIES ══════════════ */}
      {relatedOpportunities.length > 0 && (
        <div className="container opp-related-section">
          <div className="opp-section-label mb-2">
            <i className="bi bi-grid-3x3-gap-fill"></i>
            <span>ការណែនាំ</span>
          </div>
          <h2 className="opp-section-title mb-4">
            🔎 កម្មវិធីស្ម័គ្រចិត្តផ្សេងទៀត
          </h2>
          <div className="row g-4 mb-5">
            {relatedOpportunities.map((related) => (
              <div className="col-lg-4" key={related.id}>
                <div className="opp-related-card">
                  <div className="opp-related-img">
                    <img
                      src={
                        related.images
                          ? typeof related.images === "string"
                            ? related.images.split(",")[0]
                            : related.images[0]
                          : "/placeholder.png"
                      }
                      alt={related.title}
                    />
                    <div className="opp-related-img-overlay" />
                  </div>
                  <div className="opp-related-body">
                    <h5 className="opp-related-title">{related.title}</h5>
                    <p className="opp-related-location">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {related.location_label || related.location}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <Link
                        href={`/opportunities/${related.id}`}
                        className="opp-btn-sm-outline flex-grow-1 text-center"
                      >
                        ព័ត៌មានលម្អិត
                      </Link>
                      <Link
                        href={`/opportunities/${related.id}/apply`}
                        className="opp-btn-sm-primary flex-grow-1 text-center"
                      >
                        ដាក់ពាក្យ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ReportCommentModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        commentId={reportedCommentId}
        onReportSuccess={() => fetchComments(params.id)}
      />
      <DeleteCommentModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingCommentId(null);
        }}
        commentId={deletingCommentId}
        onDeleteSuccess={confirmDeleteComment}
      />
    </main>
  );
}
