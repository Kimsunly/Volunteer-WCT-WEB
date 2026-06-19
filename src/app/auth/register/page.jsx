"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthShell, PasswordField } from "../components";
import { register as apiRegister } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { showToast } from "@/components/common/CustomToaster";
import LoadingButton from "@/components/common/LoadingButton";

export default function RegisterPage() {
  const router = useRouter();
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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(payload.password)) {
      showToast.error(
        "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ ខ្ទង់ រួមមានអក្សរធំ អក្សរតូច លេខ និងនិមិត្តសញ្ញាពិសេស។",
        "ពាក្យសម្ងាត់មិនរឹងមាំ",
      );
      return;
    }

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
    <AuthShell
      imageSrc="/images/svg_login/Team work.svg"
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
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <input
            type="text"
            className="auth-modern-input w-100"
            id="lastname"
            placeholder="Last Name"
            required
          />
        </div>

        <div className="col-12">
          <input
            type="email"
            className="auth-modern-input w-100"
            id="email"
            placeholder="Email Address"
            required
          />
        </div>

        <PasswordField
          id="password"
          placeholder="Password"
          minLength={6}
        />

        <PasswordField
          id="passwordConfirm"
          placeholder="Confirm Password"
          minLength={6}
        />

        <div className="col-12">
          <input
            type="tel"
            className="auth-modern-input w-100"
            id="phone"
            placeholder="Phone Number"
            required
          />
        </div>

        <div className="col-12">
          <div className="auth-modern-checkbox-container">
            <input type="checkbox" id="terms" defaultChecked required />
            <label htmlFor="terms">
              Receive news and updates for volunteers
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
  );
}
