import React from "react";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";

export default function OrgBrand({ org, onCreate }) {
  const rating = Number(org.rating) || 0;
  const ratingCount = Number(org.ratingCount) || 0;

  return (
    <div
      className="Org-brand d-flex align-items-center mb-4 bg-white p-3 rounded shadow-sm mt-4"
      data-aos="fade-down"
    >
      <Image
        src={org.logo}
        className="rounded-circle me-3"
        width="60"
        height="60"
        alt="Profile"
        unoptimized
      />
      <div>
        <h5 className="mb-0 d-flex align-items-center gap-2">
          {org.nameKh}
          {org.isVerified && (
            <i
              className="bi bi-patch-check-fill text-primary"
              title="Verified Organizer"
              style={{ fontSize: "1rem" }}
            ></i>
          )}
        </h5>
        <small className="d-block">{org.nameEn}</small>
        {ratingCount > 0 ? (
          <div className="d-flex align-items-center gap-2 mt-1">
            <StarRating value={rating} readOnly size="sm" />
            <small className="text-muted">
              {rating.toFixed(1)} ({ratingCount} វាយតម្លៃ)
            </small>
          </div>
        ) : (
          <small className="text-muted d-block mt-1">មិនទាន់មានការវាយតម្លៃ</small>
        )}
      </div>
      <div className="ms-auto" data-aos="fade-left" data-aos-delay="200">
        <button className="btn btn-primary" onClick={onCreate}>
          បន្ថែមឱកាស
        </button>
      </div>
    </div>
  );
}
