"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "../components";
import { forgotPassword } from "@/lib/services/auth";
import { showToast } from "@/components/common/CustomToaster";
import { parseApiError } from "@/lib/utils/apiError";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    if (!email) {
      showToast.error("សូមបញ្ចូលអ៊ីមែល", "កំហុស");
      return;
    }

    try {
      setSubmitting(true);
      await forgotPassword({ email });
      showToast.success("កូដកំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នកហើយ!", "ជោគជ័យ");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      const msg = parseApiError(err) || "បរាជ័យក្នុងការផ្ញើកូដកំណត់ឡើងវិញ";
      showToast.error(msg, "កំហុស");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      imageSrc="/images/svg_login/Questions-bro.svg"
      title="Forgot Password"
      switchText="Remember your password?"
      switchLink="/auth/login"
      switchAction="Login"
    >
      <form
        id="forgetForm"
        className="row gy-3 needs-validation"
        noValidate
        onSubmit={onSubmit}
      >
        <div className="col-12">
          <input
            type="email"
            className="auth-modern-input w-100"
            id="email"
            placeholder="Email Address"
            required
          />
          <div className="invalid-feedback">
            សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="auth-modern-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                កំពុងផ្ទៀងផ្ទាត់...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
