"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, PasswordField, StrengthMeter } from "../components";
import { resetPassword } from "@/lib/services/auth";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const p = document.getElementById("password")?.value;
    const c = document.getElementById("cf-password")?.value;

    if (!email) {
      toast.error("រកមិនឃើញអ៊ីមែលសម្រាប់ការកំណត់ឡើងវិញទេ");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("សូមបញ្ចូលកូដ OTP ៦ ខ្ទង់");
      return;
    }
    if (p !== c) {
      document.getElementById("cf-password")?.classList.add("is-invalid");
      toast.error("ពាក្យសម្ងាត់ និងការបញ្ជាក់មិនត្រូវគ្នាឡើយ");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword({
        email,
        otp,
        password: p,
        password_confirmation: c,
      });
      toast.success("កំណត់ពាក្យសម្ងាត់ថ្មីជោគជ័យ! សូមចូលគណនីរបស់អ្នក។");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "បរាជ័យក្នុងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="resetForm"
      className="row gy-3 needs-validation"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="col-12">
        <input
          type="text"
          className="auth-modern-input w-100"
          id="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />
      </div>

      <PasswordField
        id="password"
        placeholder="New Password"
        defaultValue="VolunteerCambo"
        minLength={6}
      />

      <div className="col-12">
        <div
          className="alert alert-info"
          style={{
            background: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: 15,
            padding: 20,
          }}
        >
          <p
            className="mb-2"
            style={{
              fontWeight: 700,
              color: "#2d6a4f",
              fontSize: 15,
            }}
          >
            <i className="bi bi-shield-lock me-2"></i>
            Password Requirements:
          </p>
          <ul
            className="mb-0 ps-3"
            style={{
              color: "#444",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <li>At least 6 characters</li>
            <li>Use numbers and letters</li>
            <li>Mix uppercase and lowercase</li>
            <li>Special characters (@, #, $, % ...)</li>
          </ul>
        </div>
      </div>

      <div className="col-12">
        <StrengthMeter
          getPassword={() => document.getElementById("password")?.value || ""}
        />
      </div>

      <PasswordField
        id="cf-password"
        placeholder="Confirm New Password"
        defaultValue="VolunteerCambo"
        minLength={6}
      />

      <div className="col-12">
        <button type="submit" className="auth-modern-btn" disabled={submitting}>
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              កំពុងកំណត់ឡើងវិញ...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <AuthShell
                  imageSrc="/images/svg_login/Volunteering-bro.svg"
                  title="Reset Password"
                  switchText="Back to"
                  switchLink="/auth/login"
                  switchAction="Login"
                >
                  <Suspense
                    fallback={
                      <div className="text-center p-3">កំពុងផ្ទុក...</div>
                    }
                  >
                    <ResetPasswordForm />
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
