"use client";

import React from "react";
import Link from "next/link";
import { AuthShell } from "../../components";

export default function OrgForgetPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    alert("ផ្ទៀងផ្ទាត់គណនីអង្គការ (Mock)");
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
                  title="Forgot Password"
                  switchText="Remember your password?"
                  switchLink="/auth/org/login"
                  switchAction="Login"
                >
                  <form
                    id="orgforgetForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-xl-12">
                      <input
                        type="email"
                        className="auth-modern-input w-100"
                        id="email"
                        placeholder="Email Address"
                        defaultValue="VolunteerCambo@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <button type="submit" className="auth-modern-btn">
                        Send Reset Link
                      </button>
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
``;
