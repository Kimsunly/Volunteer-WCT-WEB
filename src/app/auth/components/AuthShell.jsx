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
  logoSrc = "/images/opportunities/Categories/logo-removebg.png",
  children,
  className = "",
}) {
  return (
    <div className={`authentication-form ${className}`}>
      <div className="login-img">
        <Image
          src={imageSrc}
          alt=""
          width={600}
          height={700}
          className="img-fluid object-fit-contain"
        />
      </div>

      <div className="login-area">
        <div className="section-title">
          <Image
            src={logoSrc}
            alt="Logo"
            width={150}
            height={150}
            className="logo"
          />
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
