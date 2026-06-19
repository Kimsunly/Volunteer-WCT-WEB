"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { login as apiLogin, me as apiMe } from "@/lib/services/auth";
import { setAuth } from "@/lib/utils/authState";
import { parseApiError } from "@/lib/utils/apiError";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, PasswordField } from "../components";
import Image from "next/image";
import { showToast } from "@/components/common/CustomToaster";
import LoadingButton from "@/components/common/LoadingButton";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/");
    }
  }, [user, loading, router]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.currentTarget.querySelector("#email")?.value;
    const password = e.currentTarget.querySelector("#password")?.value;

    try {
      setSubmitting(true);
      const { token, refreshToken } = await apiLogin({ email, password });
      if (!token) {
        showToast.error("ការចូលគណនីបានបរាជ័យ៖ មិនមានថូខឹន", "កំហុសចូលគណនី");
        return;
      }
      const remember = e.target?.querySelector("#rememberMe")?.checked || false;
      setAuth({ token, refreshToken, remember });

      const userInfo = await apiMe();
      const role = userInfo?.role || "user";
      setAuth({ token, refreshToken, role, remember });
      setUser({
        id: userInfo?.id,
        name: userInfo?.name,
        email: userInfo?.email || email,
        role,
        profileImage:
          userInfo?.avatar_url ||
          userInfo?.avatar ||
          userInfo?.image ||
          "/images/profile.png",
      });
      showToast.success("ចូលគណនីបានជោគជ័យ!", "សូមស្វាគមន៍");
      router.push(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      console.error("Login error", err);
      const msg =
        parseApiError(err) ||
        "ការចូលគណនីបានបរាជ័យ។ សូមពិនិត្យមើលព័ត៌មានសម្ងាត់របស់អ្នក។";
      showToast.error(msg, "បរាជ័យ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      imageSrc="/images/svg_login/Volunteering-bro.svg"
      title="Login"
      switchText="Don't have an account?"
      switchLink="/auth/register"
      switchAction="Register"
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
        id="loginForm"
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

        <PasswordField
          id="password"
          placeholder="Password"
        />

        <div className="col-12">
          <div className="auth-modern-checkbox-container">
            <input type="checkbox" id="rememberMe" defaultChecked />
            <label htmlFor="rememberMe">
              Remember Me
            </label>
          </div>
        </div>

        <div className="col-12">
          <LoadingButton
            type="submit"
            className="auth-modern-btn"
            loading={submitting}
            loadingText="កំពុងចូល..."
          >
            Login
          </LoadingButton>
        </div>

        <div className="col-12 text-center">
          <Link
            href="/auth/forget-password"
            style={{
              color: "#2d6a4f",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <div className="col-12 mt-4">
          <p className="text-center mb-0 text-muted">
            Are you an organization?{" "}
            <Link
              href="/auth/org/login"
              style={{ color: "#2d6a4f", fontWeight: 700 }}
            >
              Login as Organizer
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
