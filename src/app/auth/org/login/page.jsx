"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  organizerLogin,
  getOrganizerProfile,
} from "@/lib/services/organizerAuth";
import { setAuth } from "@/lib/utils/authState";
import { parseApiError } from "@/lib/utils/apiError";
import { AuthShell, PasswordField } from "../../components";
import toast from "react-hot-toast";

export default function OrgLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    const email =
      e.currentTarget.querySelector("#email")?.value || "Volunteer@gmail.com";
    const password =
      e.currentTarget.querySelector("#password")?.value || "SokryPes@123";
    try {
      setSubmitting(true);
      const { token } = await organizerLogin({ email, password });
      if (!token) {
        toast.error("ការចូលគណនីបានបរាជ័យ៖ មិនមានថូខឹន");
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
      toast.success("ចូលគណនីបានជោគជ័យ!");
      router.push("/");
    } catch (err) {
      console.error("Organizer login error", err);
      const errorMsg = parseApiError(err);
      toast.error(errorMsg || "ការចូលគណនីបានបរាជ័យ។");
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
                        defaultValue="Volunteer@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      placeholder="Password"
                      defaultValue="SokryPes@123"
                    />

                    <div className="col-12">
                      <div className="auth-modern-checkbox-container">
                        <input type="checkbox" id="rememberMe" defaultChecked />
                        <label htmlFor="rememberMe">
                          Receive news and updates for organizers
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
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            កំពុងចូល...
                          </>
                        ) : (
                          "Get Started"
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
