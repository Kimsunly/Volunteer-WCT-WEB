"use client";

import React from "react";
import Link from "next/link";
import { AuthShell } from "../components";

export default function ForgetPasswordPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    if (!email) return;
    alert("តំណស្តារពាក្យសម្ងាត់ត្រូវបានផ្ញើទៅអ៊ីមែល (Mock)");
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-10">
                <AuthShell
                  imageSrc="/images/homepage/forget-img.jpg"
                  title="ភ្លេចពាក្យសម្ងាត់"
                  subtitle="យើងនឹងផ្ញើតំណភ្ជាប់សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មីទៅអ៊ីមែលរបស់អ្នក។"
                >
                  <form
                    id="forgetForm"
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

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        ផ្ទៀងផ្ទាត់គណនី
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
