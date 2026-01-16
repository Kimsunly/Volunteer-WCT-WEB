import React from "react";
import Image from "next/image";

export default function OrgBrand({ org, onCreate }) {
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
        <small>{org.nameEn}</small>
      </div>
      <div className="ms-auto" data-aos="fade-left" data-aos-delay="200">
        <button className="btn btn-primary" onClick={onCreate}>
          បន្ថែមឱកាស
        </button>
      </div>
    </div>
  );
}
