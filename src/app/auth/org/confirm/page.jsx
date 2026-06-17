"use client";

import React from "react";
import Link from "next/link";
import { AuthShell, CodeInput } from "../../components";

export default function OrgConfirmCodePage() {
  const onSubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("code")?.value;
    if (!code || code.length !== 4) return;
    alert("បញ្ជាក់លេខកូដអង្គការ (Mock)");
  };

  return (
    <AuthShell
      imageSrc="/images/svg_login/Environment-bro.svg"
      title="បញ្ជាក់គណនីអង្គការ"
      subtitle="សូមបញ្ចូលកូដដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នកដើម្បីបញ្ជាក់គណនីរបស់អ្នក"
    >
      <form
        id="orgCfForm"
        className="row gy-4 needs-validation"
        noValidate
        onSubmit={onSubmit}
      >
        <CodeInput id="code" length={4} />

        <div className="col-12">
          <button type="submit" className="auth-modern-btn">
            បញ្ជាក់លេខកូដ
          </button>
        </div>

        <div className="col-12">
          <p className="text-center mb-0">
            ត្រលប់ទៅ <Link href="/auth/org/login">ចូលគណនី</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
