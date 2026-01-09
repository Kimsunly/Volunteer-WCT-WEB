"use client";

import { usePathname } from "next/navigation";
import MainNavbar from "@/components/nav/MainNavbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <MainNavbar />}
      {children}
      {!isAuthPage && <SiteFooter />}
    </>
  );
}
