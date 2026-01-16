"use client";

import MainNavbar from "@/components/nav/MainNavbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <div className="site-shell">
      <MainNavbar />
      {/* spacer for fixed header height */}
      <div style={{ paddingTop: "110px" }} />
      <main className="overflow-x-hidden">{children}</main>
      <SiteFooter />
    </div>
  );
}
``;
