"use client";

import React from "react";
import Image from "next/image";
/**
 * AuthShell
 * - Wraps the page with left image and right form panel.
 * - Keeps your class names so your CSS works.
 *
 * Props:
 * - imageSrc: string (left visual)
 * - title: string
 * - subtitle: string (optional)
 * - logoSrc: string (default /images/opportunities/Categories/logo-removebg.png)
 * - children: JSX (form body)
 * - className: optional extra classes for container
 */
export default function AuthShell({
  imageSrc,
  title,
  subtitle,
  children,
  switchLink,
  switchText,
  switchAction,
  onGoogleClick,
  onFacebookClick,
  onGithubClick,
}) {
  return (
    <div className="auth-modern-wrapper">
      <div className="auth-modern-header container">
        <h1>
          Let us go <span className="text-green">green</span> to get our planet
          clean
        </h1>
      </div>

      <div className="auth-modern-container container">
        <div className="auth-modern-form-side">
          <div className="auth-modern-title-area">
            <h2>{title}</h2>
            {switchText && (
              <p>
                {switchText}{" "}
                <a href={switchLink} className="auth-switch-link">
                  {switchAction}
                </a>
              </p>
            )}
            {!switchText && subtitle && <p>{subtitle}</p>}
          </div>

          <div className="auth-form-content">{children}</div>

          <div className="auth-modern-divider">
            <span>OR</span>
          </div>

          <div className="auth-modern-socials">
            <button
              className="auth-modern-social-btn"
              onClick={onGoogleClick}
              type="button"
            >
              <img src="/images/Icon/search.png" alt="Google" />
              <span>Signup with Google</span>
            </button>
            <button
              className="auth-modern-social-btn"
              onClick={onFacebookClick}
              type="button"
            >
              <img src="/images/Icon/facebook.png" alt="Facebook" />
              <span>Signup with facebook</span>
            </button>
            <button
              className="auth-modern-social-btn"
              onClick={onGithubClick}
              type="button"
            >
              <img src="/images/Icon/github.png" alt="GitHub" />
              <span>Signup with GitHub</span>
            </button>
          </div>
        </div>

        <div className="auth-modern-visual-side">
          <Image
            src={imageSrc}
            alt="Authentication Visual"
            width={600}
            height={500}
            className="img-fluid"
            priority
          />
        </div>
      </div>
    </div>
  );
}
