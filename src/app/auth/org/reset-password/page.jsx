"use client";

import React from "react";
import Link from "next/link";
import { AuthShell, PasswordField, StrengthMeter } from "../../components";

export default function OrgResetPasswordPage() {
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
              <div className="col-12 col-xl-7 d-flex">
                <AuthShell
                  imageSrc="/images/homepage/reset-img.jpg"
                  title="ផ្លាស់ប្តូរពាក្យសម្ងាត់អង្គការ"
                >
                  <form
                    id="orgresetForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <PasswordField
                      id="password"
                      label="ពាក្យសម្ងាត់ថ្មី ៖"
                      defaultValue="VolunteerCambo"
                      minLength={6}
                    />

                    {/* Strength meter binds to #password value */}
                    <div className="col-12">
                      <StrengthMeter
                        getPassword={() =>
                          document.getElementById("password")?.value || ""
                        }
                      />
                    </div>

                    <PasswordField
                      id="cf-password"
                      label="បញ្ជាក់ពាក្យសមំហាត់ថ្មី ៖"
                      defaultValue="VolunteerCambo"
                      minLength={6}
                    />

                    <div className="col-xl-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 text-white"
                      >
                        ចូលគណនី
                      </button>
                    </div>

                    <div className="col-xl-12">
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
