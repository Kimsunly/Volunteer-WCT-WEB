"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "../components";
import { forgotPassword } from "@/lib/services/auth";
import toast from "react-hot-toast";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    if (!email) {
      toast.error("សូមបញ្ចូលអ៊ីមែល");
      return;
    }

    try {
      setSubmitting(true);
      await forgotPassword({ email });
      toast.success("កូដកំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នកហើយ!");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "បរាជ័យក្នុងការផ្ញើកូដកំណត់ឡើងវិញ",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <AuthShell
                  imageSrc="/images/svg_login/Volunteering-bro.svg"
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
                        defaultValue="VolunteerCambo@gmail.com"
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
