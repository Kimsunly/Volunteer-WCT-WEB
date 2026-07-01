"use client";

import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  toggleFavoriteOpportunity,
  verifyOpportunityAccessKey,
} from "@/services/opportunities";
import { showToast } from "@/components/common/CustomToaster";
import { useRouter } from "next/navigation";
import SafeDate from "@/components/common/SafeDate";

/**
 * OpportunityCard - Flexible component that handles both data shapes
 * Old shape: { id, title, category, imageUrl, location, date, time, capacityLabel, benefits[], detailHref }
 * New shape: { id, title, category{slug,label}, location{slug,label}, images[], description, date, time, capacity, benefits{transport,housing,meals}, detailHref }
 */
const benefitIconMap = {
  transport: "bi-taxi-front-fill",
  housing: "bi-house-fill",
  food: "bi-fork-knife",
  meals: "bi-fork-knife",
};

const categoryColorMap = {
  education: "bg-info",
  environment: "bg-success",
  wildlife: "bg-danger",
  childcare: "bg-warning",
  agriculture: "bg-success",
  event: "bg-primary",
  health: "bg-danger",
};

export default function OpportunityCard({
  data,
  className = "",
  onToggleFavorite,
  priority = false,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isFav, setIsFav] = useState(
    data?.is_favorite ?? data?.isFavorite ?? false,
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [accessKeyModalOpen, setAccessKeyModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [accessKeyError, setAccessKeyError] = useState("");
  const [verifyingKey, setVerifyingKey] = useState(false);

  // Extract images info first to initialize state
  const images = data?.images || [];
  const imageUrl = data?.imageUrl || images[0] || "/placeholder.png";
  const currentImage = images.length > 0 ? images[currentImageIndex] : imageUrl;

  const [imgSrc, setImgSrc] = useState(currentImage);

  useEffect(() => {
    setImgSrc(currentImage);
  }, [currentImage]);

  useEffect(() => {
    setIsFav(data?.is_favorite ?? data?.isFavorite ?? false);
  }, [data]);

  // Handle both old & new data shapes
  const isNewShape = Array.isArray(data?.images);

  // Extract fields (works for both shapes)
  const id = data?.id;
  const title = data?.title;

  // Category handling
  const categoryLabel =
    typeof data?.category === "string" ? data.category : data?.category?.label;
  const categorySlug = data?.category?.slug || data?.category;
  const categoryColorClass = categoryColorMap[categorySlug] || "bg-primary";

  // Location handling
  const locationLabel =
    typeof data?.location === "string" ? data.location : data?.location?.label;

  // Date, Time, Capacity
  const date = data?.date;
  const start_date = data?.start_date;
  const time = data?.time;
  const capacityLabel =
    data?.capacityLabel ||
    (data?.capacity ? `ចំនួន ${data.capacity} នាក់` : "");

  // Benefits handling
  const benefitsArray = [];
  if (
    data?.transport &&
    data.transport.toLowerCase() !== "not provided" &&
    data.transport.toLowerCase() !== "none"
  )
    benefitsArray.push("transport");
  if (
    data?.housing &&
    data.housing.toLowerCase() !== "not provided" &&
    data.housing.toLowerCase() !== "none"
  )
    benefitsArray.push("housing");
  if (
    data?.meals &&
    data.meals.toLowerCase() !== "not provided" &&
    data.meals.toLowerCase() !== "none"
  )
    benefitsArray.push("meals");

  // Links
  const detailHref = data?.detailHref;

  // Handle carousel
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Handle favorite toggle
  const handleToggleFav = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      showToast.error(
        "សូមចូលគណនីជាមុនសិន ដើម្បីរក្សាទុកឱកាសនេះ។",
        "တម្រូវឱ្យចូលគណនី",
      );
      return;
    }
    const newFav = !isFav;
    setIsFav(newFav);
    try {
      const response = await toggleFavoriteOpportunity(id);
      const isNowFav = response?.data?.is_favorite;
      if (isNowFav) {
        showToast.success("បានបន្ថែមទៅក្នុងបញ្ជីពេញចិត្ត", "ជោគជ័យ");
      } else {
        showToast.success("បានលុបចេញពីបញ្ជីពេញចិត្ត", "ជោគជ័យ");
      }
      if (onToggleFavorite) {
        onToggleFavorite(id, isNowFav ?? newFav);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setIsFav(isFav); // revert state
      showToast.error("មានបញ្ហាក្នុងការរក្សាទុក។ សូមព្យាយាមម្តងទៀត។", "កំហុស");
    }
  };

  // Handle detail click for private opportunities
  const handleDetailClick = (e) => {
    if (data?.is_private) {
      e.preventDefault();
      setAccessKeyModalOpen(true);
    }
  };

  // Handle access key submission
  const handleAccessKeySubmit = async () => {
    if (!user) {
      showToast.error("សូមចូលគណនីជាមុនសិន ដើម្បីបន្ត។", "តម្រូវឱ្យចូលគណនី");
      router.push(`/auth/login?redirect=${encodeURIComponent(detailHref)}`);
      return;
    }
    if (!accessKey.trim()) {
      setAccessKeyError("សូមបញ្ចូលកូដសម្ងាត់");
      return;
    }
    setVerifyingKey(true);
    setAccessKeyError("");
    try {
      await verifyOpportunityAccessKey(id, accessKey);
      // Key is valid! Store access key in sessionStorage and navigate to detail page
      sessionStorage.setItem("private_access_key", accessKey);
      showToast.success("កូដសម្ងាត់ត្រឹមត្រូវ!");
      setAccessKeyModalOpen(false);
      setAccessKey("");
      setAccessKeyError("");
      router.push(detailHref);
    } catch (err) {
      console.error("Access key verification failed:", err);
      const errMsg = err.response?.data?.message || "កូដសម្ងាត់មិនត្រឹមត្រូវទេ";
      setAccessKeyError(errMsg);
    } finally {
      setVerifyingKey(false);
    }
  };

  const renderBenefits = () => {
    if (!benefitsArray || !benefitsArray.length) return null;
    return (
      <div className="benefits-tags mb-3">
        {benefitsArray.map((b) => (
          <span key={b} className="badge bg-light text-dark me-1 mb-1">
            <i
              className={`bi ${benefitIconMap[b] || "bi-dot"}`}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`col-12 col-md-6 col-xl-4 mb-4 opportunity-card ${className}`}
      data-category={categorySlug || ""}
      data-aos="fade-up"
    >
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden p-0">
        {/* Image Section */}
        <div
          className="position-relative overflow-hidden group"
          style={{ height: "220px" }}
        >
          <Image
            src={imgSrc || "/placeholder.png"}
            alt={title || "Opportunity Image"}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-100 h-100 object-fit-cover transition-scale"
            onError={() => {
              setImgSrc("/placeholder.png");
            }}
          />

          {/* Carousel Controls */}
          {images.length > 1 && (
            <div className="carousel-controls opacity-0 group-hover-opacity-100 transition-opacity">
              <button
                className="btn btn-dark btn-sm position-absolute top-50 start-0 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
              >
                <i className="bi bi-chevron-left text-white"></i>
              </button>
              <button
                className="btn btn-dark btn-sm position-absolute top-50 end-0 translate-middle-y m-2 rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
              >
                <i className="bi bi-chevron-right text-white"></i>
              </button>

              {/* Dots */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-circle ${i === currentImageIndex ? "bg-white" : "bg-white-50"}`}
                    style={{ width: "6px", height: "6px" }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Category badge - Top Left */}
          {categoryLabel && (
            <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
              <span
                className="badge rounded-pill px-3 py-2 shadow-sm fw-normal"
                style={{
                  backgroundColor: "var(--btn-primary)",
                  color: "var(--text-white-fixed)",
                }}
              >
                {categoryLabel}
              </span>
              {data.is_private && (
                <span className="badge rounded-pill bg-warning text-dark px-3 py-2 shadow-sm fw-normal">
                  ឯកជន
                </span>
              )}
            </div>
          )}

          {/* Favorite button - Top Right */}
          <div className="position-absolute top-0 end-0 m-3">
            <button
              type="button"
              className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                padding: "0",
                cursor: "pointer",
                outline: "none",
              }}
              onClick={handleToggleFav}
            >
              <i
                className={`bi ${isFav ? "bi-heart-fill" : "bi-heart"}`}
                style={{
                  fontSize: "1.1rem",
                  color: isFav ? "#ef4444" : "var(--color-text-secondary)",
                  lineHeight: "1",
                }}
              />
            </button>
          </div>
        </div>

        <div className="card-body p-4 d-flex flex-column font-kantumruy">
          <h5 className="card-title fw-bold mb-3 text-dark fs-5">{title}</h5>

          {/* Icons Grid */}
          <div className="opportunity-info mb-3">
            {locationLabel && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-geo-alt-fill text-danger fs-6" />
                <span>{locationLabel}</span>
              </div>
            )}
            {(date || start_date) && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-calendar-check-fill text-primary fs-6" />
                <span>
                  {date || (
                    <SafeDate
                      dateString={start_date}
                      options={{
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }}
                    />
                  )}
                </span>
              </div>
            )}
            {time && (
              <div className="d-flex align-items-center mb-2 gap-2 text-secondary small">
                <i className="bi bi-clock-fill text-warning fs-6" />
                <span>{time}</span>
              </div>
            )}
            {capacityLabel && (
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <i className="bi bi-people-fill text-success fs-6" />
                <span>{capacityLabel}</span>
              </div>
            )}
          </div>

          {/* Bottom Row: Benefits and Action Button */}
          <div className="mt-auto">
            {/* Benefit Icons */}
            <div className="d-flex gap-2 mb-3 text-secondary">
              {benefitsArray.includes("transport") && (
                <div
                  className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-car-front-fill fs-6" title="Transport" />
                </div>
              )}
              {benefitsArray.includes("meals") && (
                <div
                  className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-utensils fs-6" title="Meals" />
                </div>
              )}
              {benefitsArray.includes("housing") && (
                <div
                  className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-house-door-fill fs-6" title="Housing" />
                </div>
              )}
            </div>

            {/* Action button */}
            {detailHref ? (
              data?.is_private ? (
                <button
                  onClick={handleDetailClick}
                  className="btn btn-primary w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    backgroundColor: "var(--btn-primary)",
                    borderColor: "var(--btn-primary)",
                    color: "var(--text-white-fixed)",
                  }}
                >
                  <i className="bi bi-info-circle fs-5" />
                  <span>ព័ត៌មានលម្អិត</span>
                </button>
              ) : (
                <Link
                  href={detailHref}
                  className="btn btn-primary w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    backgroundColor: "var(--btn-primary)",
                    borderColor: "var(--btn-primary)",
                    color: "var(--text-white-fixed)",
                  }}
                >
                  <i className="bi bi-info-circle fs-5" />
                  <span>ព័ត៌មានលម្អិត</span>
                </Link>
              )
            ) : (
              <button
                className="btn btn-primary w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled
              >
                <i className="bi bi-info-circle fs-5" />
                <span>ព័ត៌មានលម្អិត</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Private Opportunity Access Key Modal */}
      {accessKeyModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={() => setAccessKeyModalOpen(false)}
          ></div>
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ zIndex: 1060 }}
          >
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header p-4 border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-lock-fill me-2 text-warning"></i>
                  កូដសម្ងាត់សម្រាប់កម្មវិធីឯកជន
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAccessKeyModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-warning border-0 bg-warning bg-opacity-10">
                  <i className="bi bi-info-circle me-2"></i>
                  កម្មវិធីនេះជាកម្មវិធីឯកជន។
                  សូមបញ្ចូលកូដសម្ងាត់ដែលបានពីអ្នករៀបចំកម្មវិធីដើម្បីបន្ត។
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    កូដសម្ងាត់ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${accessKeyError ? "is-invalid" : ""}`}
                    value={accessKey}
                    onChange={(e) => {
                      setAccessKey(e.target.value);
                      setAccessKeyError("");
                    }}
                    placeholder="បញ្ចូលកូដសម្ងាត់របស់អ្នករៀបចំកម្មវិធី"
                  />
                  {accessKeyError && (
                    <div className="invalid-feedback">{accessKeyError}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer p-4 border-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setAccessKeyModalOpen(false)}
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
                  disabled={verifyingKey}
                  onClick={handleAccessKeySubmit}
                >
                  {verifyingKey ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                      កំពុងផ្ទៀងផ្ទាត់...
                    </>
                  ) : (
                    "បន្ត"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .transition-scale {
          transition: transform 0.5s ease;
        }
        .opportunity-card:hover .transition-scale {
          transform: scale(1.05);
        }
        .card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }
        .group:hover .group-hover-opacity-100 {
          opacity: 1 !important;
        }
        .bg-white-50 {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

OpportunityCard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
  className: PropTypes.string,
  onToggleFavorite: PropTypes.func,
  priority: PropTypes.bool,
};
