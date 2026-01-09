"use client";

import React from "react";
import Link from "next/link";
import { AuthShell, CodeInput } from "../components";

export default function ConfirmCodePage() {
  const handleResend = (e) => {
    e.preventDefault();
    alert("កូដថ្មីត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នកហើយ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("code")?.value;
    if (!code || code.length !== 6) return;
    alert("បញ្ជាក់គណនីជោគជ័យ (Mock)");
    // TODO: call backend to verify, then route
    // router.push('/dashboard')
  };

  return (
    <div className="authentication-body">
      <main>
        <section>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-xl-9 col-lg-10">
                <AuthShell
                  imageSrc="https://cdni.iconscout.com/illustration/premium/thumb/banking-app-login-illustration-svg-png-download-12202056.png"
                  title="បញ្ជាក់គណនី"
                  subtitle="សូមបញ្ចូលកូដដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នកដើម្បីបញ្ជាក់គណនីរបស់អ្នក"
                >
                  <form
                    id="confirmCodeForm"
                    className="row gy-4 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <CodeInput id="code" length={6} defaultValue="123456" />

                    <div className="col-12">
                      <p className="text-center mb-0" style={{ fontSize: 14 }}>
                        មិនទទួលបានកូដទេ?{" "}
                        <a
                          href="#"
                          onClick={handleResend}
                          style={{ fontWeight: 700 }}
                        >
                          ផ្ញើម្តងទៀត
                        </a>
                      </p>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        បញ្ជាក់គណនី
                      </button>
                    </div>

                    <div className="col-12">
                      <p className="text-center mb-0">
                        ត្រលប់ទៅ <Link href="/auth/login">ចូលគណនី</Link>
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
