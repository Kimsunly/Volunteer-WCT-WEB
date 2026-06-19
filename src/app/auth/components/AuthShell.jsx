"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
      <div className="auth-modern-card">
        <div className="auth-modern-container">
          <div className="auth-modern-form-side">
            <div className="auth-modern-title-area">
              <h2>{title}</h2>
              {switchText && (
                <p>
                  {switchText}{" "}
                  <Link href={switchLink} className="auth-switch-link">
                    {switchAction}
                  </Link>
                </p>
              )}
              {!switchText && subtitle && <p>{subtitle}</p>}
            </div>

            <div className="auth-form-content">{children}</div>

            {(onGoogleClick || onFacebookClick || onGithubClick) && (
              <>
                <div className="auth-modern-divider">
                  <span>Continue with</span>
                </div>

                <div className="auth-modern-socials">
                  {onGoogleClick && (
                    <button
                      className="auth-social-pill auth-social-pill--google"
                      onClick={onGoogleClick}
                      type="button"
                    >
                      <img src="/images/Icon/search.png" alt="Google" />
                      <span>Google</span>
                    </button>
                  )}
                  {onFacebookClick && (
                    <button
                      className="auth-social-pill auth-social-pill--facebook"
                      onClick={onFacebookClick}
                      type="button"
                    >
                      <img src="/images/Icon/facebook.png" alt="Facebook" />
                      <span>Facebook</span>
                    </button>
                  )}
                  {onGithubClick && (
                    <button
                      className="auth-social-pill auth-social-pill--github"
                      onClick={onGithubClick}
                      type="button"
                    >
                      <img src="/images/Icon/github.png" alt="GitHub" />
                      <span>GitHub</span>
                    </button>
                  )}
                </div>
              </>
            )}
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
    </div>
  );
}
