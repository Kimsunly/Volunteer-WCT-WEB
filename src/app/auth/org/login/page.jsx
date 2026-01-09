"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, PasswordField } from "../../components";

export default function OrgLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();

    const email =
      e.currentTarget.querySelector("#email")?.value ||
      "OrganizerCambo@gmail.com";

    const mockOrganizer = {
      id: "mock-org-id",
      name: "អង្គការ",
      email,
      role: "organizer",
      profileImage: "/images/profile.png",
    };

    // Persist mock token for middleware / future checks
    localStorage.setItem("authToken", "mock-auth-token");
    document.cookie = "authToken=mock-auth-token; path=/; max-age=86400";
    localStorage.setItem("role", "organizer");
    document.cookie = "role=organizer; path=/; max-age=86400";

    setUser(mockOrganizer);
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
                  title="ចូលប្រើប្រាស់គណនីអង្គការ"
                  subtitle="សូមស្វាគមន៍មកកាន់វេទិកាស្ម័គ្រចិត្ត"
                >
                  <form
                    id="orgloginForm"
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
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          ចងចាំខ្ញុំ
                        </label>
                      </div>
                      <Link href="/auth/org/forget">ភ្លេចពាក្យសម្ងាត់?</Link>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        ចូលគណនី
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មិនទាន់មានគណនីទេ?{" "}
                        <Link href="/auth/org/register">ចុះឈ្មោះ</Link>
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
