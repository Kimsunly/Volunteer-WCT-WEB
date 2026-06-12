"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, CodeInput } from "../components";
import { verifyOtp, resendOtp } from "@/lib/services/auth";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

function ConfirmCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast.error("រកមិនឃើញអាសយដ្ឋានអ៊ីមែល", "កំហុស");
      return;
    }
    try {
      setResending(true);
      await resendOtp({ email });
      showToast.success(
        "កូដថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នកហើយ!",
        "ផ្ញើកូដជោគជ័យ",
      );
    } catch (err) {
      console.error(err);
      showToast.error(
        parseApiError(err) || "បរាជ័យក្នុងការផ្ញើកូដឡើងវិញ",
        "កំហុស",
      );
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = document.getElementById("code")?.value;
    if (!code || code.length !== 6) {
      showToast.error("សូមបញ្ចូលកូដឲ្យបានគ្រប់ ៦ ខ្ទង់", "កូដមិនគ្រប់គ្រាន់");
      return;
    }
    if (!email) {
      showToast.error("រកមិនឃើញអាសយដ្ឋានអ៊ីមែល", "កំហុស");
      return;
    }

    try {
      setSubmitting(true);
      await verifyOtp({ email, otp: code });
      showToast.success("បញ្ជាក់គណនីជោគជ័យ! សូមចូលគណនីរបស់អ្នក។", "ជោគជ័យ");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      showToast.error(parseApiError(err) || "កូដបញ្ជាក់មិនត្រឹមត្រូវ", "កំហុស");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="confirmCodeForm"
      className="row gy-4 needs-validation"
      noValidate
      onSubmit={handleSubmit}
    >
      <CodeInput id="code" length={6} defaultValue="123456" />

      <div className="col-12">
        <p className="text-center mb-0" style={{ fontSize: 14 }}>
          មិនទទួលបានកូដទេ?{" "}
          <a
            href="#"
            onClick={handleResend}
            style={{
              fontWeight: 700,
              pointerEvents: resending ? "none" : "auto",
            }}
          >
            {resending ? "កំពុងផ្ញើ..." : "ផ្ញើម្តងទៀត"}
          </a>
        </p>
      </div>

      <div className="col-12">
        <button type="submit" className="auth-modern-btn" disabled={submitting}>
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              កំពុងបញ្ជាក់...
            </>
          ) : (
            "Verify Account"
          )}
        </button>
      </div>

      <div className="col-12">
        <p className="text-center mb-0">
          ត្រលប់ទៅ <Link href="/auth/login">ចូលគណនី</Link>
        </p>
      </div>
    </form>
  );
}

export default function ConfirmCodePage() {
  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <AuthShell
                  imageSrc="/images/svg_login/Volunteering-bro.svg"
                  title="Verify OTP"
                  switchText="Back to"
                  switchLink="/auth/login"
                  switchAction="Login"
                >
                  <Suspense
                    fallback={
                      <div className="text-center p-3">កំពុងផ្ទុក...</div>
                    }
                  >
                    <ConfirmCodeForm />
                  </Suspense>
                </AuthShell>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
