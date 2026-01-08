"use client";

import { usePathname } from "next/navigation";
import MainNavbar from "@/components/nav/MainNavbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminPage = pathname?.startsWith("/admin");
  const isApplyPage = /^\/opportunities\/[^/]+\/apply/.test(pathname || "");

  return (
    <>
      {!isAuthPage && !isAdminPage && !isApplyPage && <MainNavbar />}
      {children}
      {!isAuthPage && !isAdminPage && !isApplyPage && <SiteFooter />}
    </>
  );
}
