"use client";

import React from "react";
import Link from "next/link";
import { AuthShell, PasswordField } from "../components";

export default function RegisterPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    alert("បង្កើតគណនី (Mock)");
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-10 col-lg-11">
                <AuthShell
                  imageSrc="/images/homepage/register-img.jpg"
                  title="បង្កើតគណនីរបស់អ្នក"
                  subtitle="ចាប់ផ្តើមធ្វើការផ្លាស់ប្តូរជាមួយយើង"
                >
                  <form
                    id="registerForm"
                    className="row gy-3 needs-validation"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <div className="col-12 col-md-6">
                      <label htmlFor="firstname" className="form-label">
                        គោត្តនាម
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        placeholder="បញ្ចូលគោត្តនាម"
                        defaultValue="ចាន់"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលគោត្តនាមរបស់អ្នក!
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="lastname" className="form-label">
                        នាមខ្លួន
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        placeholder="បញ្ចូលនាម"
                        defaultValue="រដ្ឋនា"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលនាមរបស់អ្នក!
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        អ៊ីមែល
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="បញ្ចូលអ៊ីមែល"
                        defaultValue="RathanaKh123@gmail.com"
                        required
                      />
                      <div className="invalid-feedback">
                        សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!
                      </div>
                    </div>

                    <PasswordField
                      id="password"
                      defaultValue="1234567"
                      minLength={6}
                    />

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="terms"
                          defaultChecked
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ និង គោលការណ៍ឯកជន
                        </label>
                        <div className="invalid-feedback">
                          សូមយល់ព្រមនឹងលក្ខខណ្ឌ!
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        បង្កើតគណនី
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        មានគណនីរួចហើយ? <Link href="/auth/login">ចូលគណនី</Link>
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
