"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  organizerLogin,
  getOrganizerProfile,
} from "@/lib/services/organizerAuth";
import { showToast } from "@/components/common/CustomToaster";
import { setAuth } from "@/lib/utils/authState";
import { parseApiError } from "@/lib/utils/apiError";
import { AuthShell, PasswordField } from "../../components";

export default function OrgLoginPage() {
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
      const { token } = await organizerLogin({ email, password });
      if (!token) {
        showToast.error("ការចូលគណនីបានបរាជ័យ៖ មិនមានថូខឹន", "កំហុសចូលគណនី");
        return;
      }
      setAuth({ token, role: "organizer" });

      const profile = await getOrganizerProfile().catch(() => null);
      setUser({
        id: profile?.id,
        name: profile?.name || "អង្គការ",
        email,
        role: "organizer",
        profileImage: profile?.image || "/images/profile.png",
      });
      showToast.success("ចូលគណនីបានជោគជ័យ!", "សូមស្វាគមន៍");
      router.push("/");
    } catch (err) {
      console.error("Organizer login error", err);
      const errorMsg = parseApiError(err);
      showToast.error(errorMsg || "ការចូលគណនីបានបរាជ័យ។", "បរាជ័យ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      imageSrc="/images/svg_login/Volunteering-bro.svg"
      title="Organizer Login"
      switchText="Don't have an organization account?"
      switchLink="/auth/org/register"
      switchAction="Register"
    >
      <form
        id="orgloginForm"
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
                កំពុងចូល...
              </span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </div>

        <div className="col-12 text-center">
          <Link
            href="/auth/org/forget"
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
            Are you a volunteer?{" "}
            <Link
              href="/auth/login"
              style={{ color: "#2d6a4f", fontWeight: 700 }}
            >
              Login as Volunteer
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
