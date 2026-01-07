"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, PasswordField } from "../components";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();

    // Read values (ids are set in fields)
    const email =
      e.currentTarget.querySelector("#email")?.value ||
      "VolunteerCambo@gmail.com";

    // Simulate successful login
    const mockUser = {
      id: "mock-user-id",
      name: "ស្ម័គ្រចិត្ត", // Khmer label for demo
      email,
      role: "user",
      profileImage: "/images/profile.png",
      tierLabel: "Member",
      rating: 5,
    };

    // Persist mock token for middleware / future checks
    localStorage.setItem("authToken", "mock-auth-token");
    localStorage.setItem("role", "user");
    // Also set a cookie so middleware sees it (Next middleware reads cookies)
    document.cookie = "authToken=mock-auth-token; path=/; max-age=86400";
    document.cookie = "role=user; path=/; max-age=86400";

    // Update global auth state
    setUser(mockUser);

    // Go to root. Root shows homepage content when authToken cookie exists.
    router.push("/");
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
                      <button type="submit" className="btn btn-primary">
                        ចូលគណនី
                      </button>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-start">
                        <hr />
                        <span className="mx-2">ឬ</span>
                        <hr />
                      </div>
                    </div>

                    {/* Social login (static) */}
                    <div className="col-12">
                      <ul className="login-list">
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/facebook.png"
                              alt="Facebook"
                              width={40}
                              height={40}
                            />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/search.png"
                              alt="Google"
                              width={40}
                              height={40}
                            />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Image
                              src="/images/Icon/github.png"
                              alt="GitHub"
                              width={40}
                              height={40}
                            />
                          </a>
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
