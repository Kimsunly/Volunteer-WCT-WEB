"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { login as apiLogin, me as apiMe } from "@/lib/services/auth";
import { setAuth } from "@/lib/utils/authState";
import { parseApiError } from "@/lib/utils/apiError";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, PasswordField } from "../components";
import Image from "next/image";
import toast from "react-hot-toast";
import LoadingButton from "@/components/common/LoadingButton";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Read values (ids are set in fields)
    const email =
      e.currentTarget.querySelector("#email")?.value ||
      "VolunteerCambo@gmail.com";
    const password =
      e.currentTarget.querySelector("#password")?.value || "VolunteerCambo";

    try {
      setSubmitting(true);
      const { token } = await apiLogin({ email, password });
      if (!token) {
        toast.error("ការចូលគណនីបានបរាជ័យ៖ មិនមានថូខឹន");
        return;
      }
      const remember = e.target?.querySelector("#rememberMe")?.checked || false;
      setAuth({ token, remember });

      // Fetch current user info to get role
      const userInfo = await apiMe();
      const role = userInfo?.role || "user";
      setAuth({ token, role, remember });
      setUser({
        id: userInfo?.id,
        name: userInfo?.name,
        email: userInfo?.email || email,
        role,
        profileImage: userInfo?.image || "/images/profile.png",
      });
      toast.success("ចូលគណនីបានជោគជ័យ!");
      router.push(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      console.error("Login error", err);
      const msg =
        parseApiError(err) || "ការចូលគណនីបានបរាជ័យ។ សូមពិនិត្យមើលព័ត៌មានសម្ងាត់របស់អ្នក។";
      toast.error(msg);
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
              <div className="col-12 col-xl-10 col-lg-11">
                <AuthShell
                  imageSrc="/images/homepage/login-img.jpg"
                  title="ចូលប្រើប្រាស់គណនី"
                  subtitle="សូមស្វាគមន៍មកកាន់វេទិកាស្ម័គ្រចិត្ត"
                >
                  <form
                    id="loginForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        អ៊ីមែល
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="បញ្ចូលអ៊ីមែល"
                        defaultValue="VolunteerCambo@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      defaultValue="VolunteerCambo"
                    />

                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          ចងចាំខ្ញុំ
                        </label>
                      </div>
                      <Link href="/auth/forget-password">
                        ភ្លេចពាក្យសម្ងាត់?
                      </Link>
                    </div>

                    <div className="col-12">
                      <LoadingButton
                        type="submit"
                        className="btn btn-primary w-100"
                        loading={submitting}
                        loadingText="កំពុងចូល..."
                      >
                        ចូលគណនី
                      </LoadingButton>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-start">
                        <hr />
                        <span className="mx-2">ឬ</span>
                        <hr />
                      </div>
                    </div>

                    {/* Social login with NextAuth */}
                    <div className="col-12">
                      <ul className="login-list">
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              signIn("facebook", {
                                callbackUrl: "/",
                                redirect: true,
                              })
                            }
                            style={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src="/images/Icon/facebook.png"
                              alt="Facebook"
                              width={40}
                              height={40}
                            />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              signIn("google", {
                                callbackUrl: "/",
                                redirect: true,
                              })
                            }
                            style={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src="/images/Icon/search.png"
                              alt="Google"
                              width={40}
                              height={40}
                            />
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              signIn("github", {
                                callbackUrl: "/",
                                redirect: true,
                              })
                            }
                            style={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src="/images/Icon/github.png"
                              alt="GitHub"
                              width={40}
                              height={40}
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មិនទាន់មានគណនីទេ?{" "}
                        <Link href="/auth/register">ចុះឈ្មោះ</Link>
                      </p>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-start">
                        <hr />
                      </div>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        គណនីរបស់អង្គការមែនទេ?{" "}
                        <Link href="/auth/org/login">ចូលគណនី</Link>
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
