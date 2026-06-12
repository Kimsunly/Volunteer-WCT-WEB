"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthShell, PasswordField } from "../components";
import { register as apiRegister, me as apiMe } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { setAuth } from "@/lib/utils/authState";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { showToast } from "@/components/common/CustomToaster";
import LoadingButton from "@/components/common/LoadingButton";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = {
      firstname: form.querySelector("#firstname")?.value,
      lastname: form.querySelector("#lastname")?.value,
      email: form.querySelector("#email")?.value,
      password: form.querySelector("#password")?.value,
      passwordConfirm: form.querySelector("#passwordConfirm")?.value,
      phone: form.querySelector("#phone")?.value,
    };

    // Strong Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(payload.password)) {
      showToast.error(
        "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ ខ្ទង់ រួមមានអក្សរធំ អក្សរតូច លេខ និងនិមិត្តសញ្ញាពិសេស។",
        "ពាក្យសម្ងាត់មិនរឹងមាំ",
      );
      return;
    }

    // quick client-side check
    if (
      payload.password &&
      payload.passwordConfirm &&
      payload.password !== payload.passwordConfirm
    ) {
      showToast.error(
        "ពាក្យសម្ងាត់ និងបញ្ជាក់មិនត្រូវគ្នា",
        "កំហុសពាក្យសម្ងាត់",
      );
      return;
    }
    try {
      setSubmitting(true);
      await apiRegister(payload);
      showToast.success(
        "ចុះឈ្មោះបានជោគជ័យ! សូមពិនិត្យកូដ OTP ក្នុងអ៊ីមែលរបស់អ្នក។",
        "ជោគជ័យ",
      );
      router.push(
        `/auth/confirm-code?email=${encodeURIComponent(payload.email)}`,
      );
    } catch (err) {
      console.error("Register error", err);
      const msg = err?.message || "ការចុះឈ្មោះបរាជ័យ";
      showToast.error(msg, "កំហុស");
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
                  title="Register"
                  switchText="Already have an account?"
                  switchLink="/auth/login"
                  switchAction="Login"
                  onGoogleClick={() => {
                    toast.loading("កំពុងភ្ជាប់ទៅ Google...");
                    signIn("google");
                  }}
                  onFacebookClick={() => {
                    toast.loading("កំពុងភ្ជាប់ទៅ Facebook...");
                    signIn("facebook");
                  }}
                  onGithubClick={() => {
                    toast.loading("កំពុងភ្ជាប់ទៅ GitHub...");
                    signIn("github");
                  }}
                >
                  <form
                    id="registerForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        className="auth-modern-input w-100"
                        id="firstname"
                        placeholder="First Name"
                        defaultValue="ចាន់"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        className="auth-modern-input w-100"
                        id="lastname"
                        placeholder="Last Name"
                        defaultValue="រដ្ឋនា"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="email"
                        className="auth-modern-input w-100"
                        id="email"
                        placeholder="Email or phone no"
                        defaultValue="RathanaKh123@gmail.com"
                        required
                      />
                    </div>

                    <PasswordField
                      id="password"
                      placeholder="Password"
                      defaultValue="1234567"
                      minLength={6}
                    />

                    <PasswordField
                      id="passwordConfirm"
                      placeholder="Confirm Password"
                      defaultValue="1234567"
                      minLength={6}
                    />

                    <div className="col-12">
                      <input
                        type="tel"
                        className="auth-modern-input w-100"
                        id="phone"
                        placeholder="Phone Number"
                        defaultValue="+855 12 345 678"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <div className="auth-modern-checkbox-container">
                        <input
                          type="checkbox"
                          id="terms"
                          defaultChecked
                          required
                        />
                        <label htmlFor="terms">
                          Recieve news and updates for volunteers
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <LoadingButton
                        type="submit"
                        className="auth-modern-btn"
                        loading={submitting}
                        loadingText="កំពុងបង្កើត..."
                      >
                        Get Started
                      </LoadingButton>
                    </div>

                    <div className="col-12 mt-4">
                      <p className="text-center mb-0 text-muted">
                        Register for organization?{" "}
                        <Link
                          href="/auth/org/register"
                          style={{ color: "#2d6a4f", fontWeight: 700 }}
                        >
                          Register as Organizer
                        </Link>
                      </p>
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
