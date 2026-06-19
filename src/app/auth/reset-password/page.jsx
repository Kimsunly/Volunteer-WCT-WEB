"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, PasswordField, StrengthMeter, CodeInput } from "../components";
import { resetPassword, verifyPasswordOtp, resendPasswordOtp } from "@/lib/services/auth";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

function ResetPasswordForm({ step, setStep, tempOtp, setTempOtp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [submitting, setSubmitting] = useState(false);

  const handleVerifyOtpStep = async (e) => {
    e.preventDefault();
    const otpCode = document.getElementById("otp")?.value;
    if (!otpCode || otpCode.length !== 6) {
      showToast.error("សូមបញ្ចូលកូដ OTP ៦ ខ្ទង់", "កំហុស");
      return;
    }

    try {
      setSubmitting(true);
      await verifyPasswordOtp({ email, otp: otpCode });
      setTempOtp(otpCode);
      showToast.success("OTP ត្រូវបានផ្ទៀងផ្ទាត់ជោគជ័យ!", "ជោគជ័យ");
      setStep(2);
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response data:", err?.response?.data);
      
      // If the backend doesn't support the separate OTP verification endpoint (returns 404/405 or fails with CORS Network Error),
      // allow the user to proceed to the next step, since the final reset-password endpoint will validate the OTP anyway.
      const isNetworkOr404 = !err?.response || err?.response?.status === 404 || err?.response?.status === 405;
      if (isNetworkOr404) {
        console.warn("verifyPasswordOtp endpoint not available or returned 404/405. Falling back to inline validation at reset stage.");
        setTempOtp(otpCode);
        setStep(2);
        return;
      }

      const msg = parseApiError(err) || "OTP មិនត្រឹមត្រូវ ឬផុតកំណត់";
      showToast.error(msg, "កំហុស");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setSubmitting(true);
      await resendPasswordOtp({ email });
      showToast.success("OTP ថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នក!", "ជោគជ័យ");
    } catch (err) {
      console.error(err);
      const msg = parseApiError(err) || "បរាជ័យក្នុងការផ្ញើ OTP ឡើងវិញ";
      showToast.error(msg, "កំហុស");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const p = document.getElementById("password")?.value;
    const c = document.getElementById("cf-password")?.value;

    if (!email) {
      showToast.error("រកមិនឃើញអ៊ីមែលសម្រាប់ការកំណត់ឡើងវិញទេ", "កំហុស");
      return;
    }
    if (!tempOtp || tempOtp.length !== 6) {
      showToast.error("សូមបញ្ចូលកូដ OTP ៦ ខ្ទង់", "កំហុស");
      setStep(1);
      return;
    }
    if (p !== c) {
      document.getElementById("cf-password")?.classList.add("is-invalid");
      showToast.error("ពាក្យសម្ងាត់ និងការបញ្ជាក់មិនត្រូវគ្នាឡើយ", "កំហុស");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword({
        email,
        otp: tempOtp,
        password: p,
        password_confirmation: c,
      });
      showToast.success(
        "កំណត់ពាក្យសម្ងាត់ថ្មីជោគជ័យ! សូមចូលគណនីរបស់អ្នក។",
        "ជោគជ័យ"
      );
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      const msg = parseApiError(err) || "បរាជ័យក្នុងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ";
      showToast.error(msg, "កំហុស");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <form
        id="otpForm"
        className="row gy-4 needs-validation"
        noValidate
        onSubmit={handleVerifyOtpStep}
      >
        <CodeInput id="otp" length={6} label="Enter 6-digit OTP" placeholder="Enter 6-digit OTP" />

        <div className="col-12 mt-4">
          <button type="submit" className="auth-modern-btn" disabled={submitting}>
            {submitting ? (
              <span className="d-flex align-items-center justify-content-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                កំពុងផ្ទៀងផ្ទាត់...
              </span>
            ) : (
              <span>Verify OTP</span>
            )}
          </button>
        </div>

        <div className="col-12">
          <button
            type="button"
            className="btn btn-link w-100"
            onClick={handleResendOtp}
            disabled={submitting}
            style={{ color: "#2d6a4f", fontWeight: 700 }}
          >
            បញ្ជូន OTP ឡើងវិញ
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

  return (
    <form
      id="resetForm"
      className="row gy-3 needs-validation"
      noValidate
      onSubmit={onSubmit}
    >
      <PasswordField id="password" placeholder="New Password" minLength={6} />

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
            style={{ fontWeight: 700, color: "#2d6a4f", fontSize: 15 }}
          >
            <i className="bi bi-shield-lock me-2"></i>
            Password Requirements:
          </p>
          <ul
            className="mb-0 ps-3"
            style={{ color: "#444", fontSize: 14, lineHeight: 1.6 }}
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
        minLength={6}
      />

      <div className="col-12 mt-4">
        <button type="submit" className="auth-modern-btn" disabled={submitting}>
          {submitting ? (
            <span className="d-flex align-items-center justify-content-center">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              កំពុងកំណត់ឡើងវិញ...
            </span>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </div>

      <div className="col-12">
        <p className="text-center mb-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setStep(1);
            }}
            style={{ color: "#2d6a4f", fontWeight: 700 }}
          >
            ត្រលប់ទៅបញ្ចូល OTP ឡើងវិញ
          </a>
        </p>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [tempOtp, setTempOtp] = useState("");

  return (
    <AuthShell
      imageSrc="/images/svg_login/Taking care of the Earth-bro.svg"
      title={step === 1 ? "Verify OTP" : "Reset Password"}
      switchText="Back to"
      switchLink="/auth/login"
      switchAction="Login"
    >
      <Suspense fallback={<div className="text-center p-3">កំពុងផ្ទុក...</div>}>
        <ResetPasswordForm
          step={step}
          setStep={setStep}
          tempOtp={tempOtp}
          setTempOtp={setTempOtp}
        />
      </Suspense>
    </AuthShell>
  );
}
