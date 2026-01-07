"use client";

import React from "react";
import Link from "next/link";
import { AuthShell, PasswordField, StrengthMeter } from "../components";

export default function ResetPasswordPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    const p = document.getElementById("password")?.value;
    const c = document.getElementById("cf-password")?.value;
    if (p !== c) {
      document.getElementById("cf-password")?.classList.add("is-invalid");
      return;
    }
    alert("កំណត់ពាក្យសម្ងាត់ថ្មី (Mock)");
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-10">
                <AuthShell
                  imageSrc="/images/homepage/reset-img.jpg"
                  title="ផ្លាស់ប្តូរពាក្យសម្ងាត់"
                  subtitle="បញ្ចូលពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក"
                >
                  <form
                    id="resetForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <PasswordField
                      id="password"
                      label="ពាក្យសម្ងាត់ថ្មី"
                      defaultValue="VolunteerCambo"
                      minLength={6}
                    />
                    <div className="col-12">
                      <div
                        className="alert alert-info"
                        style={{
                          background: "#e0f2fe",
                          border: "2px solid #bae6fd",
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <p
                          className="mb-2"
                          style={{
                            fontWeight: 600,
                            color: "#0c4a6e",
                            fontSize: 14,
                          }}
                        >
                          <i className="bi bi-shield-check me-2"></i>
                          តម្រូវការសុវត្ថិភាពពាក្យសម្ងាត់:
                        </p>
                        <ul
                          className="mb-0 ps-4"
                          style={{
                            color: "#0c4a6e",
                            fontSize: 13,
                            lineHeight: 1.8,
                          }}
                        >
                          <li>យ៉ាងហោចណាស់ 6 តួអក្សរ</li>
                          <li>ប្រើលេខ និង អក្សរ</li>
                          <li>ប្រើអក្សរធំ និង អក្សរតូច</li>
                          <li>មានតួអក្សរពិសេស (@, #, $, % ...)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Strength meter binds to #password value */}
                    <div className="col-12">
                      <StrengthMeter
                        getPassword={() =>
                          document.getElementById("password")?.value || ""
                        }
                      />
                    </div>

                    {/* Confirm */}
                    <PasswordField
                      id="cf-password"
                      label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                      defaultValue="VolunteerCambo"
                      minLength={6}
                    />
                    <div
                      className="invalid-feedback d-block"
                      style={{ display: "none" }}
                    >
                      ពាក្យសម្ងាត់មិនត្រូវគ្នា។
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        កំណត់ពាក្យសម្ងាត់ថ្មី
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="text-center">
                        ចូលគណនីផ្សេងទៀត? <Link href="/auth/login">ចូលគណនី</Link>
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
