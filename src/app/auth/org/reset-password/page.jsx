"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, PasswordField, StrengthMeter, CodeInput } from "../../components";
import { resetPassword } from "@/lib/services/auth";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

function OrgResetForm({ step, setStep, tempOtp, setTempOtp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [submitting, setSubmitting] = useState(false);

  const handleVerifyOtpStep = (e) => {
    e.preventDefault();
    const otpCode = document.getElementById("otp")?.value;
    if (!otpCode || otpCode.length !== 6) {
      showToast.error("សូមបញ្ចូលកូដ OTP ៦ ខ្ទង់", "កំហុស");
      return;
    }
    setTempOtp(otpCode);
    setStep(2);
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
      await resetPassword({ email, otp: tempOtp, password: p, password_confirmation: c });
      showToast.success("កំណត់ពាក្យសម្ងាត់ថ្មីជោគជ័យ!", "ជោគជ័យ");
      router.push("/auth/org/login");
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
        id="orgOtpForm"
        className="row gy-4 needs-validation"
        noValidate
        onSubmit={handleVerifyOtpStep}
      >
        <CodeInput id="otp" length={6} label="Enter 6-digit OTP" placeholder="Enter 6-digit OTP" />

        <div className="col-12 mt-4">
          <button type="submit" className="auth-modern-btn">
            <span>Verify OTP</span>
          </button>
        </div>

        <div className="col-12">
          <p className="text-center mb-0">
            ត្រលប់ទៅ <Link href="/auth/org/login">ចូលគណនី</Link>
          </p>
        </div>
      </form>
    );
  }

  return (
    <form
      id="orgresetForm"
      className="row gy-3 needs-validation"
      noValidate
      onSubmit={onSubmit}
    >
      <PasswordField
        id="password"
        placeholder="New Password"
        minLength={6}
      />

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

      <div className="col-xl-12 mt-4">
        <button
          type="submit"
          className="auth-modern-btn"
          disabled={submitting}
        >
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

      <div className="col-xl-12">
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

export default function OrgResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [tempOtp, setTempOtp] = useState("");

  return (
    <AuthShell
      imageSrc="/images/svg_login/Taking care of the Earth-bro.svg"
      title={step === 1 ? "Verify OTP" : "Reset Password"}
      switchText="Back to"
      switchLink="/auth/org/login"
      switchAction="Login"
    >
      <Suspense fallback={<div className="text-center p-3">កំពុងផ្ទុក...</div>}>
        <OrgResetForm
          step={step}
          setStep={setStep}
          tempOtp={tempOtp}
          setTempOtp={setTempOtp}
        />
      </Suspense>
    </AuthShell>
  );
}
