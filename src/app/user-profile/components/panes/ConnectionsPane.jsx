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
    <div className="card border-0 shadow-sm rounded-4 p-4 user-profile-connections-card">
      <div className="border-bottom border-secondary-subtle border-opacity-10 pb-3 mb-4">
        <h5 className="fw-bold mb-1 card-title-theme">តំណភ្ជាប់បណ្តាញសង្គម</h5>
        <p className="text-secondary-theme small mb-0">
          ភ្ជាប់គណនីបណ្តាញសង្គមរបស់អ្នក ដើម្បីងាយស្រួលក្នុងការចូលប្រើប្រាស់ និងធានាសុវត្ថិភាពគណនី។
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        {availableProviders.map((prov) => {
          const linked = isLinked(prov.id);
          return (
            <div
              key={prov.id}
              className="d-flex align-items-center justify-content-between p-3 rounded-4 vh-connection-row"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="provider-icon-bubble">
                  <Image 
                    src={prov.icon} 
                    alt={prov.name} 
                    width={24} 
                    height={24} 
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold row-title-theme">{prov.name}</h6>
                  <span className={`small fw-medium ${linked ? "text-accent-theme" : "text-muted-theme"}`}>
                    {linked ? (
                      <><i className="bi bi-link-45deg me-1"></i> បានភ្ជាប់រួចរាល់</>
                    ) : (
                      "មិនទាន់បានភ្ជាប់"
                    )}
                  </span>
                </div>
              </div>

              {linked ? (
                <span className="badge connected-pill">
                  <i className="bi bi-check2-circle me-1"></i> បានភ្ជាប់
                </span>
              ) : (
                <button
                  className="btn btn-sm btn-connect-action rounded-pill px-4 py-2"
                  onClick={() => handleConnect(prov.id, prov.name)}
                >
                  ភ្ជាប់គណនី
                </button>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .user-profile-connections-card {
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 20px !important;
          box-shadow: var(--shadow-card) !important;
          padding: 28px !important;
          transition: all 0.3s ease;
        }
        .user-profile-connections-card:hover {
          border-color: var(--color-border-hover) !important;
        }

        .card-title-theme {
          color: var(--color-text-primary) !important;
        }
        .text-secondary-theme {
          color: var(--color-text-secondary) !important;
        }

        .vh-connection-row {
          background-color: var(--color-bg-input) !important;
          border: 1px solid var(--color-border) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vh-connection-row:hover {
          border-color: var(--color-accent) !important;
          box-shadow: 0 4px 15px var(--color-accent-glow);
          transform: translateY(-1px);
        }

        .provider-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--color-bg-card) !important;
          border: 1px solid var(--color-border) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .vh-connection-row:hover .provider-icon-bubble {
          transform: scale(1.08);
          border-color: var(--color-border-hover) !important;
        }

        .row-title-theme {
          color: var(--color-text-primary) !important;
          font-size: 15px;
        }

        .text-accent-theme {
          color: var(--color-accent) !important;
        }
        .text-muted-theme {
          color: var(--color-text-secondary) !important;
        }

        .connected-pill {
          background-color: var(--color-accent-dim) !important;
          color: var(--color-accent) !important;
          border: 1px solid rgba(170, 255, 0, 0.2) !important;
          font-weight: 600;
          font-size: 12px;
          padding: 8px 18px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
        }

        .btn-connect-action {
          border: 1.5px solid var(--color-accent) !important;
          color: var(--color-accent) !important;
          background-color: transparent !important;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-connect-action:hover {
          background-color: var(--color-accent) !important;
          color: #000000 !important;
          box-shadow: 0 0 12px var(--color-accent-glow);
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}
