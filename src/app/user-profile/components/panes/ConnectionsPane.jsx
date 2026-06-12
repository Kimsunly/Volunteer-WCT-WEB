"use client";
import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function ConnectionsPane({ providers = [] }) {
  const availableProviders = [
    { id: "google", name: "Google", icon: "/images/Icon/search.png" },
    { id: "github", name: "GitHub", icon: "/images/Icon/github.png" },
    { id: "facebook", name: "Facebook", icon: "/images/Icon/facebook.png" },
  ];

  const isLinked = (providerId) => {
    return providers.some((p) => p.provider.toLowerCase() === providerId.toLowerCase());
  };

  const handleConnect = (providerId, providerName) => {
    toast.loading(`កំពុងភ្ជាប់ទៅ ${providerName}...`);
    signIn(providerId);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-4">តំណភ្ជាប់បណ្តាញសង្គម</h5>
      <p className="text-muted small mb-4">
        ភ្ជាប់គណនីបណ្តាញសង្គមរបស់អ្នក ដើម្បីងាយស្រួលក្នុងការចូលប្រើប្រាស់ និងធានាសុវត្ថិភាពគណនី។
      </p>

      <div className="d-flex flex-column gap-3">
        {availableProviders.map((prov) => {
          const linked = isLinked(prov.id);
          return (
            <div
              key={prov.id}
              className="d-flex align-items-center justify-content-between p-3 rounded-3 border"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                  <Image 
                    src={prov.icon} 
                    alt={prov.name} 
                    width={32} 
                    height={32} 
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{prov.name}</h6>
                  <span className={`small ${linked ? "text-success" : "text-muted"}`}>
                    {linked ? "បានភ្ជាប់រួចរាល់" : "មិនទាន់បានភ្ជាប់"}
                  </span>
                </div>
              </div>

              {linked ? (
                <button className="btn btn-sm btn-outline-success disabled rounded-pill px-3">
                  <i className="bi bi-check-circle-fill me-1"></i> បានភ្ជាប់
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3"
                  onClick={() => handleConnect(prov.id, prov.name)}
                >
                  ភ្ជាប់គណនី
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
